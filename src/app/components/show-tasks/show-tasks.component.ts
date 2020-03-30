import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { CommonService } from 'src/app/services/common.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { TasksShowService } from 'src/app/services/tasks-show.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgForm } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

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
      console.log(this.commonService.currentUserFullname)
      // this.dataSource = new MatTableDataSource([])
    }

    public generateTable(body: string) {
      debugger
      if(this.dataSource === undefined || this.dataSource.data === null || this.dataSource.data === [])
      this.tasksShowService.getActivityData(body).subscribe(
        (success) => {
          this.serverRes = JSON.parse(success.message)
          this.dataSource = new MatTableDataSource(this.serverRes)
          this.dataSource = new MatTableDataSource(this.serverRes)
          this.dataSource.paginator = this.paginator
          this.dataSource.sort = this.sort
        },
        (error) => {}
      )
      debugger
    }

    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
      //this.events.push(`${type}: ${event.value}`);
      debugger
      var body = this.generateGetActivityDataBody(event.value)
      this.generateTable(body)
    }

    private generateGetActivityDataBody(date: Date): string {
      debugger
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
      var dateArray = date.toString().split(" ")
      var month = nums[months.indexOf(dateArray[1])]
      var body: string = "{'personId':'" + this.commonService.currentUserID + "','SelectedDate':'" + dateArray[3] + "-" + month + "-" + dateArray[2] + "'}"
      return body
    }
}
