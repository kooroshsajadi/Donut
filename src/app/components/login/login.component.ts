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

  //hidePassword = true
  username: string = ""
  password: string = ""
  OpportunityId: any
  error: string = null
  isLoading = false;

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
    this.isLoading = true
    this.commonService.OpportunityId = this.commonService.getParameterByName();
    // this.generateLoginBody()
    this.sendRequest.sendLoginInfo(this.username, this.password).subscribe(
      (success) => {
        console.log("true")
        this.isLoading = false
      },
      (error) => {
        console.log("false")
        this.error = "خطایی رخ داد!"
        this.isLoading = false
      }
    )
  }

  private generateLoginBody(): string {
    return "{'UserName':'" + this.username + "','Password':'" + this.password + "'}"
  }

  onSubmit(form: NgForm) {
    if(!form.valid) {
      return
    }
    const username = form.value.username
    const password = form.value.password
    this.isLoading = true
    this.commonService.OpportunityId = this.commonService.getParameterByName();
    // this.generateLoginBody()
    this.sendRequest.sendLoginInfo(username, password).subscribe(
      (success) => {
        debugger
        console.log(success.message)
        this.isLoading = false
        this.router.navigate(['/Tasks'])
        
      },
      (error) => {
        console.log(error.message)
        this.error = error.message
        this.isLoading = false
      }
    )
    form.reset()
  }
}
