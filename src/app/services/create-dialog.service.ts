import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CreateDialogService {

  projectOptions: any[] = []
  phaseOptions: any[] = []
  subphaseOptions: any[] = []
  time = {hour: 0, minute: 0};

  constructor(private configService: ConfigService) { }

  private generateSearchPhaseBody(value: string): string {
    //429C8EB5-FF7E-EA11-9981-005056AF44B4
    //" + this.projectOptions[0].ProjectId + "
    var projectID = 0
    if(this.projectOptions.length === 1)
      projectID = this.projectOptions[0].ProjectId
    return "{'ProjctId':'" + projectID + "','PhaseName':'" + value + "'}"
  }

  public searchPhase(value: string): Observable<any> {
    debugger
    var body = this.generateSearchPhaseBody(value)
    return this.configService.post('ContinuebyEstablishments/SearchPhase', body);
  }

  private generateSearchProjectBody(value: string): string {
    return "{'projectName':'" + value + "'}"
  }

  public searchProject(value: string): Observable<any> {
    var body = this.generateSearchProjectBody(value);
    return this.configService.post('ContinuebyEstablishments/SearchProject', body);
  }

  private generateSearchSubphaseBody(value: string): string {
    debugger
    var phaseID = 0
    if(this.phaseOptions.length === 1)
      phaseID = this.phaseOptions[0].PhaseId
    return "{'PhaseId':'" + phaseID + "','SubPhaseName':'" + value + "'}"
  }

  public searchSubphase(value: string): Observable<any> {
    debugger
    var body = this.generateSearchSubphaseBody(value)
    return this.configService.post('ContinuebyEstablishments/SearchSubPhase', body);
  }

  // public LoadContinuebyEstablishments(): Observable<any> {
  //   debugger
  //   var body = this.generateLoadContinuebyEstablishmentsBody(localStorage.getItem('personCode').replace("\"", "").replace("\"", ""))
  //   return this.configService.post('ContinuebyEstablishments/LoadContinuebyEstablishments', body);
  // }

 // private generateLoadContinuebyEstablishmentsBody(personID: string): string {
    //961523
    //" + personID + "
   // return "{'ActivityList':[{}],'PersonId':'961523'}"
 // }
}
