import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { TasksShowService } from 'src/app/services/tasks-show.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-show-tasks',
  templateUrl: './show-tasks.component.html',
  styleUrls: ['./show-tasks.component.scss']
})
export class ShowTasksComponent implements OnInit {

  displayedColumns: string[] = ['Owner', 'Customer', 'Project', 'Phase', 'SubPhase',
                                'ActivitesDate', 'ActivitesTime', 'PlaceOfAction', 'Description',
                                'IsMoreWork'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort

  dataSource: MatTableDataSource<any>
  serverRes: any[] = []
  currentDate: string
  events: string[] = [];
  selectedDate: string;

  // The initial value of the calendar is set to today.
  date = new FormControl(new Date());

  constructor(private router: Router,
    private route: ActivatedRoute,
    private tasksShowService: TasksShowService,
    public commonService: CommonService) { }

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
      this.generateTable();
    }

    public generateTable() {
      debugger
      this.selectedDate
      var body = this.generateGetActivityDataBody(this.selectedDate)
      console.log(body)
      this.tasksShowService.getActivityData(body).subscribe(
        (success) => {
          debugger
          this.serverRes = JSON.parse(success.message)
          debugger
          this.dataSource = new MatTableDataSource(this.serverRes)
          this.dataSource = new MatTableDataSource(this.serverRes)
          this.dataSource.paginator = this.paginator
          this.dataSource.sort = this.sort
          debugger
        },
        (error) => {debugger}
      )
    }

    onDateChange() {
      this.generateTable()
    }

    private generateGetActivityDataBody(date: string): string {
      debugger
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const nums = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
      var dateArray = date.toString().split(" ")
      var month = nums[months.indexOf(dateArray[1])]
      
      // localStorage.getItem('personCode')
      var body: string = "{'personId':'" + localStorage.getItem('personCode') + "','SelectedDate':'" + dateArray[3] + "-" + month + "-" + dateArray[2] + "'}"
      return body
    }

    // The two following methods get the user data which is stored in the local storage.
    getFullname(): string {
      return localStorage.getItem('fullname');
    }
    getPersonCode(): string {
      return localStorage.getItem('personCode');
    }
}
