import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CreateDialogService {

  accountOptions: any[] = []
  projectOptions: any[] = []
  phaseOptions: any[] = []
  subphaseOptions: any[] = []
  time = {hour: 0, minute: 0};
  taskTime: string = ""
  selectedPlace: string = "0"
  nextStep: string = "0"
  selectedModality: string = "0"
  selectedProject: string = ""

  constructor(private configService: ConfigService) { }

  private generateSearchPhaseBody(projectName: string, searchedValue: string): string {
    debugger
    var projectID = 0
    if(this.projectOptions !== null) {
      if(this.projectOptions.length === 1) {
        projectID = this.projectOptions[0].ProjectId
      }
      else if(this.projectOptions.length >= 1) {
        this.projectOptions.forEach(project => {
          if(project.Name === projectName) {
            projectID = project.ProjectId
            return
          }
        })
      }
    }
    return "{'ProjctId':'" + projectID + "','PhaseName':'" + searchedValue + "'}"
  }

  public searchPhase(projectName: string, serachedValue: string): Observable<any> {
    debugger
    var body = this.generateSearchPhaseBody(projectName, serachedValue)
    return this.configService.post('ContinuebyEstablishments/SearchPhase', body);
  }

  private generateSearchProjectBody(accountName: string, searchedValue: string): string {
    debugger
    var accountID = ""
    this.accountOptions.forEach(account => {
      if(account.Name === accountName) {
        accountID = account.AccountId
        return
      }
    })
    return "{'AccountId':'" + accountID + "','projectName':'" + searchedValue + "'}"
  }

  public searchProject(accountName: string, serachecValue: string): Observable<any> {
    var body = this.generateSearchProjectBody(accountName, serachecValue);
    return this.configService.post('ContinuebyEstablishments/SearchProject', body);
  }

  private generateSearchSubphaseBody(phaseName: string, subphaseSearchedValue: string): string {
    debugger
    var phaseID = 0
    if(this.phaseOptions.length === 1)
      phaseID = this.phaseOptions[0].PhaseId
    else if(this.phaseOptions.length >= 1) {
      this.phaseOptions.forEach(phase => {
        if(phase.Name === phaseName) {
          phaseID = phase.PhaseId
          return
        }
      })
    }
    return "{'PhaseId':'" + phaseID + "','SubPhaseName':'" + subphaseSearchedValue + "'}"
  }

  public searchSubphase(phaseName: string, subphaseSearchedValue: string): Observable<any> {
    debugger
    var body = this.generateSearchSubphaseBody(phaseName, subphaseSearchedValue)
    return this.configService.post('ContinuebyEstablishments/SearchSubPhase', body);
  }

  public createContinuebyEstablishmentsBody(projectName: string, description: string, date: string): string {
    debugger
    var ActivityID: string = ""
    if(this.projectOptions !== null && this.projectOptions.length > 0){
      var projectID: string = this.projectOptions[0].ProjectId
    }
    if(this.phaseOptions !== null && this.phaseOptions.length > 0) {
      var phaseID: string = this.phaseOptions[0].PhaseId
    }
    if(this.subphaseOptions !== null && this.subphaseOptions.length > 0) {
      var subphaseID: string = this.subphaseOptions[0].SubPhaseId
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const nums = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    var dateArray = date.toString().split(" ")
    var month = nums[months.indexOf(dateArray[1])]
    // TODO - Add the true current time to this part later.
    var dueDate: string = dateArray[3] + "-" + month + "-" + dateArray[2] + " 00:00:00.000"
    // var duration: number = this.time.hour * 60 + this.time.minute
    var stringTimeArray: Array<string> = this.taskTime.split(':')
    var integerTimeArray: Array<number> = [Number.parseInt(stringTimeArray[0]), Number.parseInt(stringTimeArray[1])]
    var duration: number = integerTimeArray[0] * 60 + integerTimeArray[1]
    var personID: string = localStorage.getItem('personCode').replace("\"", "").replace("\"", "")
    // var place = (this.selectedPlace === "option1") ? "کسرا" : "محل مشتری"
    return "{'ActivityList':[{'ActivityId':'" + ActivityID + "','ProjectId':'" + projectID + "','ProjectName':'" + projectName + "','PhaseId':'" + phaseID + "','SubPhaseId':'" + subphaseID + "','Description':'" + description + "','DuDate':'" + dueDate + "','Duration':" + duration + ",'Place':" + +this.selectedPlace + ",'NextStep':" + this.nextStep + "}],'PersonId':'" + personID + "'}"
  }

  public createContinuebyEstablishments(projectName: string, description: string, date: string): Observable<any> {
    debugger
    var body = this.createContinuebyEstablishmentsBody(projectName, description, date)
    this.projectOptions = []
    this.phaseOptions = []
    this.subphaseOptions = []
    return this.configService.post('ContinuebyEstablishments/CreateContinuebyEstablishments', body);
  }

  private generateLoadSubchecklistBody(phaseName: string): string {
    debugger
    var phaseID = ""
    this.phaseOptions.forEach(element => {
      if(element.Name === phaseName) {
        phaseID = element.PhaseId
        return
      }
    });
    // var phaseID = this.phaseOptions[this.phaseOptions.indexOf(phaseName)].PhaseId
    return "{'ActivityList':[{}],'PhaseId':'" + phaseID + "'}"
  }

  public LoadSubchecklist(phaseName: string): Observable<any> {
    debugger
    var body = this.generateLoadSubchecklistBody(phaseName)
    return this.configService.post('ContinuebyEstablishments/LoadSubCheckList', body);
  }

  public searchAccount(searchValue: string): Observable<any> {
    var body = this.generateSearchAccountBody(searchValue);
    return this.configService.post('ContinuebyEstablishments/SearchAccount', body);
  }

  private generateSearchAccountBody(searchValue: string): string {
    return "{'accountName':'" + searchValue + "'}"
  }
}
