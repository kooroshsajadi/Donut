import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { TasksShowService } from 'src/app/services/tasks-show.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { CreateDialogComponent } from '../create-dialog/create-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { DeleteDialogService } from '../../services/delete-dialog.service';
import { Time } from '@angular/common';
@Component({
  selector: 'app-show-tasks',
  templateUrl: './show-tasks.component.html',
  styleUrls: ['./show-tasks.component.scss']
})
export class ShowTasksComponent implements OnInit {

  displayedColumns: string[] = ['Owner', 'Customer', 'Project', 'Phase', 'SubPhase',
                                'ActivitesDate', 'ActivitesTime', 'PlaceOfAction', 'Description',
                                'IsMoreWork', 'Delete'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort

  dataSource: MatTableDataSource<any>
  serverRes: any[] = []
  currentDate: string
  events: string[] = [];
  selectedDate: string;
  selection = new SelectionModel<Element>(true, []);
  totalTime: Time = {hours: 0, minutes: 0}

  // The initial value of the calendar is set to today.
  date = new FormControl(new Date());

  constructor(private router: Router,
    private route: ActivatedRoute,
    private tasksShowService: TasksShowService,
    private deleteDialogService: DeleteDialogService,
    public commonService: CommonService,
    public dialog: MatDialog) { }

    model: NgbDateStruct;

    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.commonService.OpportunityId = params['id']
        if (this.commonService.OpportunityId != undefined) {
          this.commonService.OpportunityId=this.commonService.OpportunityId.replace('{',"").replace('}',"")
        }
      });

      // Costumizing the paginator.
      this.paginator._intl.nextPageLabel = "بعدی"
      this.paginator._intl.previousPageLabel = "قبلی"
      this.paginator._intl.itemsPerPageLabel = "موارد در هر صفحه"
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) =>
      { if (length == 0 || pageSize == 0) { return `0 از ${length}`; } length = Math.max(length, 0);
      const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} – ${endIndex} از ${length}`; }

      this.selectedDate = this.date.value;

      //Get the grid with the initial today date.
      this.generateTable()
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

    public generateTable() {
      debugger
      this.tasksShowService.getActivityData(this.selectedDate).subscribe(
        (success) => {
          debugger
          this.serverRes = JSON.parse(success.message)
          debugger
          this.dataSource = new MatTableDataSource(this.serverRes)
          this.dataSource = new MatTableDataSource(this.serverRes)
          this.totalTime.hours = 0
          this.totalTime.minutes = 0
          this.dataSource.data.forEach(row => {
            this.totalTime.minutes += +row.ActivitesTime
            debugger
          })
          debugger
          this.totalTime.hours = Math.floor(this.totalTime.minutes / 60)
          this.totalTime.minutes = this.totalTime.minutes % 60
          console.log(this.totalTime)
          this.dataSource.paginator = this.paginator
          this.dataSource.sort = this.sort
          debugger
        },
        (error) => {}
      )
    }

    onDateChange() {
      this.generateTable()
    }

    // The following method gets the user fullname which is stored in the local storage.
    getFullname(): string {
      if(localStorage.getItem('fullname') !== null)
        return localStorage.getItem('fullname').replace("\"", "").replace("\"", "");
      else
        return ""
    }

    openCreateDialog(content: string): void {
      const dialogRef = this.dialog.open(CreateDialogComponent, {
        data: {content: content}
      });
    }

    openDeleteDialog(content: string): void {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: {content: content}
      });
    }

    onCreateBtnClick() {
      this.openCreateDialog("")
    }

    onDeleteCellClick(row) {
      debugger
      this.deleteDialogService = row.ActivitiesId
      this.openDeleteDialog("آیا از حذف فعالیت اطمینان دارید ؟")
    }

}
