import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class TasksShowService {

  constructor(private configService: ConfigService) { }

  public getActivityData(date: string):Observable<any> {
    var body = this.generateGetActivityDataBody(date)
    return this.configService.post('ActivitiyInfo/ActivityData', body);
  }

  private generateGetActivityDataBody(date: string): string {
    debugger
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const nums = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    var dateArray = date.toString().split(" ")
    var month = nums[months.indexOf(dateArray[1])]
    var body: string = "{'personId':'" + localStorage.getItem('personCode').replace("\"", "").replace("\"", "") + "','SelectedDate':'" + dateArray[3] + "-" + month + "-" + dateArray[2] + "'}"
    return body
  }
}
