import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { CommonService } from 'src/app/services/common.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-show-tasks',
  templateUrl: './show-tasks.component.html',
  styleUrls: ['./show-tasks.component.scss']
})
export class ShowTasksComponent implements OnInit {

  displayedColumns: string[] = ['Owner', 'Customer', 'Project', 'Phase', 'SubPhase',
                                'ActivitesDate', 'ActivitesTime', 'PlaceOfAction', 'Description',
                                'IsMoreWork'];
  
  dataSource: MatTableDataSource<any>

  constructor(private router: Router,
    private route: ActivatedRoute,
    private sendRequest: LoginService,
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
    }
  
    onLoading() {
      // this.commonService.OpportunityId = this.commonService.getParameterByName();
      // this.sendRequest.sendLoginInfo(this.generateLoginBody()).subscribe(
      //   (success) => {
      //     debugger
      //     console.log(success.message)
      //     this.router.navigate(['/Tasks'])
          
      //   },
      //   (error) => {
      //     console.log(error.message)
      //     this.error = error.message
      //   }
      // )
    }
}
