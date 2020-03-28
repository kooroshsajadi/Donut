import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from './config.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';

interface LoginResponseData {
  "FullName": string
  "PresonCode": string
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private configService: ConfigService,
    private http: HttpClient) { }

  private generateLoginBody(username: string, password: string): string {
    return "{'UserName':'" + username + "','Password':'" + password + "'}"
  }

  public sendLoginInfo(username: string, password: string):Observable<any>{
    const body = this.generateLoginBody(username, password)
    return this.configService.post('AuthDonat/LoginKasra', body)
    .pipe(catchError(this.handleError));
  }

  private handleError(errorRes: HttpErrorResponse) {
    var errorMessage = errorRes.error.error.message
    return throwError(errorMessage)
  }
}
