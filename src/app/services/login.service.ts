import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from './config.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from '../components/login/user.model';

export interface LoginResponseData {
  FullName: string
  PresonCode: string
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  user = new BehaviorSubject<User>(null);

  constructor(private configService: ConfigService) { }

  private generateLoginBody(username: string, password: string): string {
    return "{'UserName':'" + username + "','Password':'" + password + "'}"
  }

  public sendLoginInfo(username: string, password: string) {
    const body = this.generateLoginBody(username, password)
    return this.configService.post('AuthDonat/LoginKasra', body)
    .pipe(catchError(this.handleError), tap(resData => {
      debugger
      var readableRes = JSON.parse(resData.message)
      this.handleAuthentication(readableRes.FullName, readableRes.PresonCode);
    }));
  }

  private handleError(errorRes: HttpErrorResponse) {
    var errorMessage = errorRes.error.error.message
    return throwError(errorMessage)
  }

  private handleAuthentication(fullname: string, personID: string) {
    const user = new User(fullname, personID);
    this.user.next(user);
    localStorage.setItem('fullname', JSON.stringify(user.fullname));
    localStorage.setItem('personCode', JSON.stringify(user.personID));
  }
}
