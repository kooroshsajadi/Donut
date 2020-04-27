import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { CreateDialogService } from 'src/app/services/create-dialog.service';
import { TimeDialogComponent } from 'src/app/shared/time-dialog/time-dialog.component';
import { TimeDialogService } from 'src/app/services/time-dialog.service';
import { ResultDialogComponent } from 'src/app/shared/result-dialog/result-dialog.component';

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.scss']
})
export class CreateDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public createDialogService: CreateDialogService,
    private dialog: MatDialog,
    public timeDialogService: TimeDialogService) {
      //dialogRef.disableClose = true;
     }

  modalityControl = new FormControl('')
  customerControl = new FormControl('')
  timeControl = new FormControl('')
  placeControl = new FormControl('')
  descriptionControl = new FormControl('')
  filteredModalityOptions: Observable<string[]>
  filteredCustomerOptions: Observable<string[]>
  filteredPlaceOptions: Observable<string[]>
  date = new FormControl(new Date());
  selectedDate: string;
  serverResponse: any[] = []
  projectControl = new FormControl('');
  filteredProjectOptions: Observable<string[]>
  phaseControl = new FormControl('');
  filteredPhaseOptions: Observable<string[]>
  subphaseControl = new FormControl('');
  filteredSubphaseOptions: Observable<string[]>
  places: string[] = ["کسرا", "محل مشتری"]

  ngOnInit(): void {
    this.timeControl.disable()

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

    // Date
    this.selectedDate = this.date.value;

    // Description
    this.descriptionControl.setValue("")
  }

  public phaseSearch(value: string) {
    if(this.createDialogService.projectOptions.length === 1) {
      debugger
      this.createDialogService.searchPhase(value).subscribe(
        (success) => {
          debugger
          this.createDialogService.phaseOptions = JSON.parse(success.message)
        },
        (error) => {}
      )
    }
  }

  public subphaseSearch(value: string) {
    debugger
    this.createDialogService.searchSubphase(value).subscribe(
      (success) => {
        debugger
        this.createDialogService.subphaseOptions = JSON.parse(success.message)
      },
      (error) => {}
    )
  }

  public projectSearch(value: string) {
    this.createDialogService.searchProject(value).subscribe(
      (success) => {
        this.createDialogService.projectOptions = JSON.parse(success.message)
        debugger
      },
      (error) => {}
    )
  }

  private phaseFilter(value: string): string[] {
    this.phaseSearch(value);
    return this.createDialogService.phaseOptions
  }

  private subphaseFilter(value: string): string[] {
    this.subphaseSearch(value);
    return this.createDialogService.subphaseOptions
  }

  private projectFilter(value: string): string[] {
    this.projectSearch(value);
    return this.createDialogService.projectOptions
  }

  openTimeDialog(content: string): void {
    const dialogRef = this.dialog.open(TimeDialogComponent, {
      data: {content: content}
    });
  }

  onTimeIconClick() {
    this.openTimeDialog("")
  }

  public showTime(): string {
    var hour = this.createDialogService.time.hour
    var minute = this.createDialogService.time.minute
    if(hour === 0 && minute === 0)
      return ""
    else
      return hour + " : " + minute
  }

  onSaveBtnClick() {
    debugger
    this.createDialogService.createContinuebyEstablishments(this.projectControl.value, this.descriptionControl.value, this.selectedDate).subscribe(
      (success) => {
        debugger
        if(success.message !== null) {
          this.dialog.open(ResultDialogComponent, {
            data: {message: "عملیات با موفقیت انجام شد"}
          });
          this.dialogRef.close()
        }
        else {
          this.dialog.open(ResultDialogComponent, {
            data: {message: "خطایی رخ داد"}
          });
        }
      },
      (error) => {
        this.dialog.open(ResultDialogComponent, {
          data: {message: "خطایی رخ داد"}
        });
      }
    )
  }

  onSaveAndContinueBtnClick() {
    debugger
    this.createDialogService.createContinuebyEstablishments(this.projectControl.value, this.descriptionControl.value, this.selectedDate).subscribe(
      (success) => {
        debugger
        if(success.message !== null) {
          this.dialog.open(ResultDialogComponent, {
            data: {message: "عملیات با موفقیت انجام شد"}
          });
        }
          
        else {
          this.dialog.open(ResultDialogComponent, {
            data: {message: "خطایی رخ داد"}
          });
        }
      },
      (error) => {
        this.dialog.open(ResultDialogComponent, {
          data: {message: "خطایی رخ داد"}
        });
      }
    )
  }
}
