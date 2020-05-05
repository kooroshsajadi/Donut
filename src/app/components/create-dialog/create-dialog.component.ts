import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { CreateDialogService } from 'src/app/services/create-dialog.service';
import { TimeDialogComponent } from 'src/app/shared/time-dialog/time-dialog.component';
import { TimeDialogService } from 'src/app/services/time-dialog.service';
import { ResultDialogComponent } from 'src/app/shared/result-dialog/result-dialog.component';
import { TasksShowService } from 'src/app/services/tasks-show.service';
import {ErrorStateMatcher} from '@angular/material/core';

export class myErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    if(control.value === "") {
      return false
    }
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

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
    public timeDialogService: TimeDialogService,
    public tasksShowService: TasksShowService) {
      //dialogRef.disableClose = true;
      dialogRef.updateSize("75%", "75%")
     }

  modalityControl = new FormControl('')
  
  customerControl = new FormControl('')
  timeControl = new FormControl('', [
    Validators.required,
    Validators.minLength(4)
  ])
  placeControl = new FormControl('')
  descriptionControl = new FormControl('')
  filteredModalityOptions: Observable<string[]>
  filteredCustomerOptions: Observable<string[]>
  filteredPlaceOptions: Observable<string[]>
  date = new FormControl(new Date());
 serverResponse: any[] = []
  projectControl = new FormControl('');
  filteredProjectOptions: Observable<string[]>
  phaseControl = new FormControl('');
  filteredPhaseOptions: Observable<string[]>
  subphaseControl = new FormControl('');
  filteredSubphaseOptions: Observable<string[]>
  places: string[] = ["کسرا", "محل مشتری"]
  selectedDate: string;
  valid: boolean = null
  matcher = new myErrorStateMatcher();

  public mask = {
    guide: false,
    showMask: true,
    mask: [/\d/, /\d/, ':', /\d/, /\d/]
  };  

  ngOnInit(): void {
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

  public phaseSearch(projectName: string, searchedValue: string) {
    debugger      
      this.createDialogService.searchPhase(projectName, searchedValue).subscribe(
        (success) => {
          debugger
          this.createDialogService.phaseOptions = JSON.parse(success.message)
        },
        (error) => {}
      )
  }

  public subphaseSearch(phaseName: string, searchedSubphaseValue: string) {
    debugger
    this.createDialogService.searchSubphase(phaseName, searchedSubphaseValue).subscribe(
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

  private phaseFilter(searchedPhaseValue: string): string[] {
    this.phaseSearch(this.projectControl.value, searchedPhaseValue);
    return this.createDialogService.phaseOptions
  }

  private subphaseFilter(searchedSubphaseValue: string): string[] {
    this.subphaseSearch(this.phaseControl.value, searchedSubphaseValue);
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
    dialogRef.afterClosed().subscribe(result => {
      debugger
      if(this.createDialogService.time.hour.toString().length === 1) {
        this.createDialogService.taskTime = '0' + this.createDialogService.time.hour.toString()
      }
      else {
        this.createDialogService.taskTime = this.createDialogService.time.hour.toString()
      }

      if(this.createDialogService.time.minute.toString().length === 1) {
        this.createDialogService.taskTime += '0' + this.createDialogService.time.minute.toString()
      }
      else {
        this.createDialogService.taskTime += this.createDialogService.time.minute.toString()
      }
    });
  }

  onTimeIconClick() {
    this.openTimeDialog("")
  }

  public showTime(): string {
    var hour = this.createDialogService.time.hour
    var minute = this.createDialogService.time.minute
    return hour + " : " + minute
  }

  onSaveBtnClick() {
    debugger
    if(this.modalityControl.valid && this.projectControl.valid && this.phaseControl.valid && this.subphaseControl.valid && this.timeControl.value !== "" && this.descriptionControl.valid) {
      this.tasksShowService.selectedDate = this.selectedDate
      this.createDialogService.createContinuebyEstablishments(this.projectControl.value, this.descriptionControl.value, this.tasksShowService.selectedDate).subscribe(
        (success) => {
          debugger
          if(success.message !== null) {
            debugger
            var resultDialogRef = this.dialog.open(ResultDialogComponent, {
              data: {message: "عملیات با موفقیت انجام شد",
                closureEmit: true,
                success: true,
                date: this.tasksShowService.selectedDate}
            });
            resultDialogRef.afterClosed().subscribe(result => {
              this.dialogRef.close()
            });
          }
          else {
            this.dialog.open(ResultDialogComponent, {
              data: {message: "خطایی رخ داد",
              closureEmit: false,
              success: false}
            });
          }
        },
        (error) => {
          this.dialog.open(ResultDialogComponent, {
            data: {message: "خطایی رخ داد",
            closureEmit: false,
            success: false}
          });
        }
      )
    }
  }

  onSaveAndContinueBtnClick() {
    debugger
    if(this.modalityControl.valid && this.projectControl.valid && this.phaseControl.valid && this.subphaseControl.valid && this.timeControl.value !== "" && this.descriptionControl.valid) {
      this.tasksShowService.selectedDate = this.selectedDate
      this.createDialogService.createContinuebyEstablishments(this.projectControl.value, this.descriptionControl.value, this.tasksShowService.selectedDate).subscribe(
        (success) => {
          debugger
          if(success.message !== null) {
            this.dialog.open(ResultDialogComponent, {
              data: {message: "عملیات با موفقیت انجام شد",
              closureEmit: false,
              success: true,
              date: this.tasksShowService.selectedDate}
            });
          }

          else {
            this.dialog.open(ResultDialogComponent, {
              data: {message: "خطایی رخ داد",
              closureEmit: false,
              success: false}
            });
          }
        },
        (error) => {
          this.dialog.open(ResultDialogComponent, {
            data: {message: "خطایی رخ داد",
            closureEmit: false,
            success: false}
          });
        }
      )
    }
  }
  onProjectSelectPhaseSearch(projectName: string) {
    debugger
    this.phaseSearch(projectName, "")
    this.filteredPhaseOptions = this.phaseControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this.phaseFilter(value))
    );
  }

  onPhaseSelectSubphaseSearch(phaseName: string) {
    debugger
    this.subphaseSearch(phaseName, "")
    this.filteredSubphaseOptions = this.subphaseControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this.subphaseFilter(value))
    );
  }
}