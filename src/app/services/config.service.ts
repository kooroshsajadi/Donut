import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  serverAddress = "http://pack.kasraco.ir:8080/api"
  // http://pack.kasraco.ir:8080
  // 192.168.20.73:8970
 
  constructor(public http: HttpClient) { }

  public post(url, body, mode?): Observable<any> {
    let httpOptions
    if (mode == "zip") {
      httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        responseType: 'blob'
      }
    }
    else {
      httpOptions = {
       
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
         
      }
    }
    return this.http.post(this.serverAddress + '/' + url, JSON.stringify(body), httpOptions);
  }
}