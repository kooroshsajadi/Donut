import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): 
  boolean | Promise<boolean> | Observable<boolean> {
    // TODO - Handle the return value
    return true
  }
  constructor() { }
}
