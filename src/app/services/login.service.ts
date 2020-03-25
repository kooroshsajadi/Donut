import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private configService: ConfigService,
    private http: HttpClient) { }

  public sendLoginInfo(body: string):Observable<any>{
    return this.configService.post('LoginKasra',body);
  }
}
