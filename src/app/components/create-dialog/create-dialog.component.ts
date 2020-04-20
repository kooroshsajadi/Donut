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
  //subphaseControl = new FormControl('')
  placeControl = new FormControl('')
  
  filteredModalityOptions: Observable<string[]>
  filteredCustomerOptions: Observable<string[]>
  
  //filteredSubphaseOptions: Observable<string[]>
  filteredPlaceOptions: Observable<string[]>
  date = new FormControl(new Date());
  selectedDate: string;
  serverResponse: any[] = []

  projectControl = new FormControl('');
  projectOptions: any[] = []
  filteredProjectOptions: Observable<string[]>
  phaseControl = new FormControl('');
  phaseOptions: any[] = []
  filteredPhaseOptions: Observable<string[]>
  subphaseControl = new FormControl('');
  subphaseOptions: any[] = []
  filteredSubphaseOptions: Observable<string[]>

  ngOnInit(): void {
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

      // Project
      this.filteredProjectOptions = this.projectControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.projectFilter(value))
      );

    // Phase
      this.filteredPhaseOptions = this.phaseControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.phaseFilter(value))
      );

      // Subphase
      this.filteredSubphaseOptions = this.subphaseControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.subphaseFilter(value))
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

  public phaseSearch(value: string) {
    if(this.projectOptions.length === 1) {
      debugger
      this.createDialogService.searchPhase("{'ProjectId':'" + this.projectOptions[0].ProjectId + "','PhaseName':'" + value + "'}").subscribe(
        (success) => {
          debugger
          this.phaseOptions = JSON.parse(success.message)
        },
        (error) => {}
      )
    }
  }

  public subphaseSearch(value: string) {
    debugger
    //if(this.phaseOptions.length === 1) {
      debugger
      this.createDialogService.searchSubphase("{'PhaseId':'" + this.phaseOptions[0].PhaseId + "','SubPhaseName':'" + value + "'}").subscribe(
        (success) => {
          debugger
          this.subphaseOptions = JSON.parse(success.message)
        },
        (error) => {}
      )
    //}
  }

  public projectSearch(value: string) {
    this.createDialogService.searchProject("{'projectName':'" + value + "'}").subscribe(
      (success) => {
        this.projectOptions = JSON.parse(success.message)
        debugger
      },
      (error) => {}
    )
  }

  private phaseFilter(value: string): string[] {
    this.phaseSearch(value);
    // this.phaseOptions = [];
    // this.serverResponse.forEach(product => {
    //   this.phaseOptions.push(product)
    // });    
    return this.phaseOptions
  }

  private subphaseFilter(value: string): string[] {
    this.subphaseSearch(value);
    return this.subphaseOptions
  }

  private projectFilter(value: string): string[] {
    this.projectSearch(value);
    // this.projectOptions = [];
    // this.serverResponse.forEach(product => {
    //   this.projectOptions.push(product)
    // });
    return this.projectOptions
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
