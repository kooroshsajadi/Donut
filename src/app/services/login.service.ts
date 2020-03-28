import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

interface LoginResponseData {
  FullName: string
  PresonCode: string
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private configService: ConfigService,
    private http: HttpClient) { }

  // private generateLoginBody(username: string, password: string): string {
  //   return "{'UserName':'" + this.username + "','Password':'" + this.password + "'}"
  // }

  public sendLoginInfo(username: string, password: string):Observable<any>{
    return this.configService.post('AuthDonat/LoginKasra',
    {
      UserName: username,
      Password: password
    });
  }
}
