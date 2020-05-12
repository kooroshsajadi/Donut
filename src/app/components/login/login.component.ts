import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService, LoginResponseData } from 'src/app/services/login.service';
import { CommonService } from 'src/app/services/common.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  OpportunityId: any
  error: string = null
  isLoading = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private sendRequest: LoginService,
    private commonService: CommonService) { }

  ngOnInit(): void {
    // this.route.queryParams.subscribe(params => {
    //   this.commonService.OpportunityId = params['id']
    //   if (this.commonService.OpportunityId != undefined) {
    //     this.commonService.OpportunityId=this.commonService.OpportunityId.replace('{',"").replace('}',"")
    //   }
    // });
  }

  onSubmit(form: NgForm) {
    if(!form.valid) {
      return
    }
    const username = form.value.username
    const password = form.value.password
    let authObs: Observable<LoginResponseData>;
    this.isLoading = true
    this.commonService.OpportunityId = this.commonService.getParameterByName();
    authObs = this.sendRequest.sendLoginInfo(username, password);
    authObs.subscribe(
      resData => {
        this.isLoading = false;
        debugger
        this.router.navigate(['/tasks'])
        debugger
      },
      errorMessage => {
        debugger
        this.error = "نام کاربری یا رمز عبور اشتباه است"
        this.isLoading = false
      }
    );
    form.reset()
  }
}
