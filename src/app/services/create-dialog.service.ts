import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CreateDialogService {

  modalityOptions: any[] = []
  customerOptions: any[] = []
  subphaseOptions: any[] = []
  placeOptions: any[] = []

  constructor(private configService: ConfigService) { }

  public modalityFilter(value: string): string[] {
    debugger
    //this.getProducts(value);
    this.modalityOptions = [];
    // this.serverResponse.forEach(product => {
    //   debugger
    //   this.options.push(product)
    // });
    debugger
    //return this.serverResponse;
    return this.modalityOptions
  }

  public customerFilter(value: string): string[] {
    debugger
    //this.getProducts(value);
    this.customerOptions = [];
    // this.serverResponse.forEach(product => {
    //   debugger
    //   this.options.push(product)
    // });
    debugger
    //return this.serverResponse;
    return this.customerOptions
  }

  public subphaseFilter(value: string): string[] {
    debugger
    //this.getProducts(value);
    this.subphaseOptions = [];
    // this.serverResponse.forEach(product => {
    //   debugger
    //   this.options.push(product)
    // });
    debugger
    //return this.serverResponse;
    return this.subphaseOptions
  }

  public placeFilter(value: string): string[] {
    debugger
    //this.getProducts(value);
    this.placeOptions = [];
    // this.serverResponse.forEach(product => {
    //   debugger
    //   this.options.push(product)
    // });
    debugger
    //return this.serverResponse;
    return this.placeOptions
  }

  public searchPhase(body: string): Observable<any> {
    return this.configService.post('ContinuebyEstablishments/SearchPhase', body);
  }

  public searchProject(body: string): Observable<any> {
    return this.configService.post('ContinuebyEstablishments/SearchProject', body);
  }

  public searchSubphase(body: string): Observable<any> {
    return this.configService.post('ContinuebyEstablishments/SearchSubPhase', body);
  }
}
