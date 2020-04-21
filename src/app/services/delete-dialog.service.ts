import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeleteDialogService {
  configService: any;
  activityID: string = ""

  constructor() { }

  deleteContinuebyEstablishments():Observable<any> {
    var body = this.generateDeleteContinuebyEstablishments()
    return this.configService.post('ContinuebyEstablishments/DeleteContinuebyEstablishments', body);
  }

  private generateDeleteContinuebyEstablishments(): string {
    return "{'ActivityId':'" + this.activityID + "'}"
  }
}
