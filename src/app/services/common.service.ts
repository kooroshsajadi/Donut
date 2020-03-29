import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  OpportunityId
  currentUserFullname: string;
  currentUserID: string;

  constructor() { }

  public getParameterByName() {
    var name='id'
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    var resultGeneral= results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    return resultGeneral.replace('{',"").replace('}',"")
  }
}
