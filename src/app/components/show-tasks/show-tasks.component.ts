import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { TasksShowService } from 'src/app/services/tasks-show.service';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { CreateDialogComponent } from '../create-dialog/create-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogService } from '../../services/delete-dialog.service';
import { Time } from '@angular/common';
import { CreateDialogService } from 'src/app/services/create-dialog.service';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-show-tasks',
  templateUrl: './show-tasks.component.html',
  styleUrls: ['./show-tasks.component.scss']
})


export class ShowTasksComponent implements OnInit {

  displayedColumns: string[] = ['Owner', 'Customer', 'Project', 'Phase', 'SubPhase',
                                'ActivitesDate', 'ActivitesTime', 'PlaceOfAction', 'Description'];
    // 'IsMoreWork', 'Delete'

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChild(MatSort, {static: true}) sort: MatSort;

  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  kendoSource: any = []
  serverRes: any[] = []
  currentDate: string
  events: string[] = [];
  selection = new SelectionModel<Element>(true, []);
  totalTime: Time = {hours: 0, minutes: 0}
  public multiple = false;
    public allowUnsort = true;
    public sort: SortDescriptor[] = [{
      field: 'Project',
      dir: 'asc'
    }];
    public gridView: GridDataResult;
    public pageSize = 10;
    public skip = 0;
    private items: any[]

  // The initial value of the calendar is set to today.
  date = new FormControl(new Date());

  constructor(private router: Router,
    private route: ActivatedRoute,
    public tasksShowService: TasksShowService,
    private deleteDialogService: DeleteDialogService,
    public commonService: CommonService,
    public dialog: MatDialog,
    private createDialogService: CreateDialogService) { }

    model: NgbDateStruct;

    ngOnInit(): void {
      this.tasksShowService.selectedDate = this.date.value;

      //Get the grid with the initial today date.
      this.generateTable(this.tasksShowService.selectedDate)
    }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

    public generateTable(date: string) {
      debugger
      this.tasksShowService.getActivityData(date).subscribe(
        (success) => {
          debugger
          this.serverRes = JSON.parse(success.message)
          this.items = this.serverRes
          this.kendoSource = this.items
          this.loadItems()
          // this.dataSource = new MatTableDataSource(this.serverRes);
          // this.dataSource = new MatTableDataSource(this.serverRes);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
          
          this.totalTime.hours = 0
          this.totalTime.minutes = 0
          var min: string
          var hour: string
          this.dataSource.data.forEach(row => {
            this.totalTime.minutes += +row.ActivitesTime
            // Change the time input in here.
            debugger
            hour = Math.floor(row.ActivitesTime / 60).toString()
            min = (row.ActivitesTime % 60).toString()
            if(min.length === 1) {
              min = "0" + min
            }
            row.ActivitesTime = hour + ":" + min
          })
          debugger
          this.totalTime.hours = Math.floor(this.totalTime.minutes / 60)
          this.totalTime.minutes = this.totalTime.minutes % 60          
        },
        (error) => {}
      )
    }

    onDateChange() {
      this.generateTable(this.tasksShowService.selectedDate)
    }

    // The following method gets the user fullname which is stored in the local storage.
    getFullname(): string {
      if(localStorage.getItem('fullname') !== null)
        return localStorage.getItem('fullname').replace("\"", "").replace("\"", "");
      else
        return ""
    }

    openCreateDialog(content: string): void {
      debugger
      var dialogRef = this.dialog.open(CreateDialogComponent, {
        data: {content: content},
        width: "100%",
        height: "98%"
      });
      debugger
      dialogRef.afterClosed().subscribe(result => {
        debugger
        this.generateTable(this.tasksShowService.selectedDate)
        this.createDialogService.projectOptions = []
        this.createDialogService.phaseOptions = []
        this.createDialogService.subphaseOptions = []
        this.createDialogService.time.hour = 0
        this.createDialogService.time.minute = 0
        this.createDialogService.taskTime = ""
        this.createDialogService.selectedModality = "0"
        this.createDialogService.selectedPlace = "0"
        this.createDialogService.nextStep = "0"
      });
    }

    onCreateBtnClick() {
      debugger
      this.openCreateDialog("")
    }

    onNextDayClick() {
      debugger
      console.log(this.date.value)
    }

    private loadProducts(): void {
      this.gridView = {
          data: orderBy(this.kendoSource, this.sort),
          total: this.kendoSource.length
      };
    }
    
    public sortChange(sort: SortDescriptor[]): void {
      this.sort = sort;
      debugger
      this.loadProducts();
      debugger
      this.kendoSource = this.gridView.data
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();
  }

  private loadItems(): void {
    debugger
    this.kendoSource = {
        data: this.items.slice(this.skip, this.skip + this.pageSize),
        total: this.items.length
    };
 }
}
