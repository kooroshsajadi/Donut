import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeDialogService {
  
  time = {hour: 13, minute: 30};
  
  constructor() { }
}
