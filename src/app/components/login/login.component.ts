import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { CommonService } from 'src/app/services/common.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hidePassword = true
  username: string = ""
  password: string = ""
  OpportunityId: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private sendRequest: LoginService,
    private commonService: CommonService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.commonService.OpportunityId = params['id']
      if (this.commonService.OpportunityId != undefined) {
        this.commonService.OpportunityId=this.commonService.OpportunityId.replace('{',"").replace('}',"")
      }
    });
  }

  onLoginButtonClick() {
    debugger
    this.router.navigate(['/Tasks'])
    debugger
    this.commonService.OpportunityId = this.commonService.getParameterByName();
    this.sendRequest.sendLoginInfo(this.generateLoginBody()).subscribe(
      (success) => {
        console.log("true")
      },
      (error) => {
        console.log("false")
      }
    )
  }

  private generateLoginBody(): string {
    return "{'UserName':'" + this.username + "','Password':'" + this.password + "'}"
  }

  onSubmit(form: NgForm) {
    form.reset()
  }
}
