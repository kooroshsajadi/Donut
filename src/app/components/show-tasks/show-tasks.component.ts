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
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { DeleteDialogService } from '../../services/delete-dialog.service';
import { Time } from '@angular/common';
import { CreateDialogService } from 'src/app/services/create-dialog.service';
import {MatSort} from '@angular/material/sort';

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
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  serverRes: any[] = []
  currentDate: string
  events: string[] = [];
  selection = new SelectionModel<Element>(true, []);
  totalTime: Time = {hours: 0, minutes: 0}

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
      // Costumizing the paginator.
      this.paginator._intl.nextPageLabel = "بعدی"
      this.paginator._intl.previousPageLabel = "قبلی"
      this.paginator._intl.itemsPerPageLabel = "موارد در هر صفحه"
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) =>
      { if (length == 0 || pageSize == 0) { return `0 از ${length}`; } length = Math.max(length, 0);
      const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} – ${endIndex} از ${length}`; }

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
          this.dataSource = new MatTableDataSource(this.serverRes);
          this.dataSource = new MatTableDataSource(this.serverRes);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          
          this.totalTime.hours = 0
          this.totalTime.minutes = 0
          var min: string
          var hour: string
          this.dataSource.data.forEach(row => {
            this.totalTime.minutes += +row.ActivitesTime
            // Change the time input in here.
            debugger
            hour = Math.floor(row.ActivitesTime / 60).toString()
            // if(hour.length === 1) {
            //   hour = "0" + hour
            // }
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
        data: {content: content}
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
      });
    }

    // openDeleteDialog(content: string): void {
    //   const dialogRef = this.dialog.open(DeleteDialogComponent, {
    //     data: {content: content}
    //   });
    // }

    onCreateBtnClick() {
      debugger
      //this.tasksShowService.selectedDate
      //this.date.valid
      // this.date.setValue("2/4/78")
      this.openCreateDialog("")
    }

    // onDeleteCellClick(row) {
    //   debugger
    //   this.deleteDialogService = row.ActivitiesId
    //   this.openDeleteDialog("آیا از حذف فعالیت اطمینان دارید ؟")
    // }

    onNextDayClick() {
      debugger
      console.log(this.date.value)
    }
}
