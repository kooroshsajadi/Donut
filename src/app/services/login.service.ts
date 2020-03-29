import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from './config.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { User } from '../components/login/user.model';

interface LoginResponseData {
  "FullName": string
  "PresonCode": string
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  user = new Subject<User>();

  constructor(private configService: ConfigService,
    private http: HttpClient) { }

  private generateLoginBody(username: string, password: string): string {
    return "{'UserName':'" + username + "','Password':'" + password + "'}"
  }

  public sendLoginInfo(username: string, password: string):Observable<any>{
    const body = this.generateLoginBody(username, password)
    return this.configService.post('AuthDonat/LoginKasra', body)
    .pipe(catchError(this.handleError), tap(resData => {
      debugger
      this.handleAuthentication(resData["FullName"], resData["PresonCode"]);
      debugger
    }));
  }

  private handleError(errorRes: HttpErrorResponse) {
    var errorMessage = errorRes.error.error.message
    return throwError(errorMessage)
  }

  private handleAuthentication(fullname: string, personID: string) {
    debugger
    const user = new User(fullname, personID);
    debugger
    this.user.next(user);
    debugger
  }
}
