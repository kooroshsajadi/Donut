import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { CreateDialogService } from 'src/app/services/create-dialog.service';

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.scss']
})
export class CreateDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private createDialogService: CreateDialogService) { }

  modalityControl = new FormControl('')
  customerControl = new FormControl('')
  phaseControl = new FormControl('')
  filteredPhaseOptions: Observable<string[]>
  phaseOptions: any[] = []
  subphaseControl = new FormControl('')
  placeControl = new FormControl('')
  
  filteredModalityOptions: Observable<string[]>
  filteredCustomerOptions: Observable<string[]>
  
  filteredSubphaseOptions: Observable<string[]>
  filteredPlaceOptions: Observable<string[]>
  date = new FormControl(new Date());
  selectedDate: string;
  serverResponse: any[] = []


  myControl = new FormControl('');
  options: any[] = []
  filteredOptions: Observable<string[]>

  ngOnInit(): void {
    // TODO- Test
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    // Modality
    this.filteredModalityOptions = this.modalityControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.createDialogService.modalityFilter(value))
      );

    // Costumer
    this.filteredCustomerOptions = this.customerControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.createDialogService.customerFilter(value))
      );

    // Phase
      this.filteredPhaseOptions = this.phaseControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._phaseFilter(value))
      );

      // Subphase
      this.filteredSubphaseOptions = this.subphaseControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.createDialogService.subphaseFilter(value))
      );

      // Place
      this.filteredPlaceOptions = this.placeControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.createDialogService.placeFilter(value))
      );

    // Date
    this.selectedDate = this.date.value;
  }

  private _phaseFilter(value: string): string[] {
    debugger
    this.phaseSearch(value);
    this.phaseOptions = [];
    this.serverResponse.forEach(product => {
      debugger
      this.phaseOptions.push(product)
    });
    debugger
    //return this.serverResponse;
    return this.phaseOptions
  }

  public phaseSearch(value: string) {
    debugger
    this.createDialogService.searchPhase("{'ProjctId':'429C8EB5-FF7E-EA11-9981-005056AF44B4','PhaseName':'" + value + "'}").subscribe(
      (success) => {
        debugger
        this.serverResponse = JSON.parse(success.message)
      },
      (error) => {}
    )
  }

  private _filter(value: string): string[] {
    debugger
    this.phaseSearch(value);
    this.options = [];
    this.serverResponse.forEach(product => {
      this.options.push(product)
    });
    debugger
    
    return this.options
  }

  public getProducts(value: string) {
    debugger
    this.createDialogService.searchPhase("{'ProjctId':'429C8EB5-FF7E-EA11-9981-005056AF44B4','PhaseName':'" + value + "'}").subscribe(
      (success) => {
        debugger
        this.serverResponse = JSON.parse(success.message)
      },
      (error) => {}
    )
  }

}
