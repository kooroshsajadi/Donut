import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';
import { take, map } from 'rxjs/operators';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate {

  constructor(
    private loginService: LoginService,
    private router: Router,
    private commonService: CommonService) { }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
    ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    // TODO - Handle the return value
    debugger
    if(this.commonService.currentUserFullname !== null || this.commonService.currentUserFullname !== "") {
      return true;
    }
    else {
      return false;
    }
    
    // return this.loginService.user.pipe(
    //   take(1),
    //   // map(user => {
    //   // debugger
    //   // // TODO - delete the next line
    //   // const isAuth = !!user;
    //   // if (isAuth) {
    //   //   return true;
    //   // }
    //   // return this.router.createUrlTree(['']);
    //   // })
    // );
  }
  
}
