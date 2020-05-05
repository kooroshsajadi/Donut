import { Component, OnInit, Inject, OnDestroy, Input, Self, ElementRef, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl, Validators, ControlValueAccessor, FormGroup, FormBuilder, NgControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { CreateDialogService } from 'src/app/services/create-dialog.service';
import { TimeDialogComponent } from 'src/app/shared/time-dialog/time-dialog.component';
import { TimeDialogService } from 'src/app/services/time-dialog.service';
import { ResultDialogComponent } from 'src/app/shared/result-dialog/result-dialog.component';
import { TasksShowService } from 'src/app/services/tasks-show.service';
import { MatFormFieldControl } from '@angular/material/form-field';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';

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
  timeControl = new FormControl('')
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
    // if(this.createDialogService.projectOptions.length === 1) {
      
      this.createDialogService.searchPhase(projectName, searchedValue).subscribe(
        (success) => {
          debugger
          this.createDialogService.phaseOptions = JSON.parse(success.message)
        },
        (error) => {}
      )
    // }
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

// export class TaskTime {
//   constructor(public hours: string, public minutes: string) {}
// }

// /** Custom `MatFormFieldControl` for telephone number input. */
// @Component({
//   selector: 'time-input',
//   templateUrl: 'time-input.html',
//   styleUrls: ['time-input.scss'],
//   providers: [{provide: MatFormFieldControl, useExisting: TimeInput}],
//   host: {
//     '[class.example-floating]': 'shouldLabelFloat',
//     '[id]': 'id',
//     '[attr.aria-describedby]': 'describedBy',
//   }
// })
// export class TimeInput implements ControlValueAccessor, MatFormFieldControl<TaskTime>, OnDestroy {
//   static nextId = 0;

//   private formBuilder: FormBuilder
//   parts: FormGroup;
//   // parts = this.formBuilder.group({});
//   stateChanges = new Subject<void>();
//   focused = false;
//   errorState = false;
//   controlType = 'time-input';
//   id = `time-input-${TimeInput.nextId++}`;
//   describedBy = '';
//   onChange = (_: any) => {};
//   onTouched = () => {};

//   get empty() {
//     const {value: {hours, minutes}} = this.parts;

//     return !hours && !minutes;
//   }

//   get shouldLabelFloat() { return this.focused || !this.empty; }

//   @Input()
//   get placeholder(): string { return this._placeholder; }
//   set placeholder(value: string) {
//     this._placeholder = value;
//     this.stateChanges.next();
//   }
//   private _placeholder: string;

//   @Input()
//   get required(): boolean { return this._required; }
//   set required(value: boolean) {
//     this._required = coerceBooleanProperty(value);
//     this.stateChanges.next();
//   }
//   private _required = false;

//   @Input()
//   get disabled(): boolean { return this._disabled; }
//   set disabled(value: boolean) {
//     this._disabled = coerceBooleanProperty(value);
//     this._disabled ? this.parts.disable() : this.parts.enable();
//     this.stateChanges.next();
//   }
//   private _disabled = false;

//   @Input()
//   get value(): TaskTime | null {
//     if (this.parts.valid) {
//       const {value: {hours, minutes}} = this.parts;
//       return new TaskTime(hours, minutes);
//     }
//     return null;
//   }
//   set value(time: TaskTime | null) {
//     const {hours, minutes} = time || new TaskTime('', '');
//     this.parts.setValue({hours, minutes});
//     this.stateChanges.next();
//   }

//   constructor(
//     formBuilder: FormBuilder,
//     private _focusMonitor: FocusMonitor,
//     private _elementRef: ElementRef<HTMLElement>,
//     @Optional() @Self() public ngControl: NgControl) {

//     this.parts = formBuilder.group({
//       hours: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(2)]],
//       minutes: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(2)]],
//     });

//     _focusMonitor.monitor(_elementRef, true).subscribe(origin => {
//       if (this.focused && !origin) {
//         this.onTouched();
//       }
//       this.focused = !!origin;
//       this.stateChanges.next();
//     });

//     if (this.ngControl != null) {
//       this.ngControl.valueAccessor = this;
//     }
//   }

//   ngOnDestroy() {
//     this.stateChanges.complete();
//     this._focusMonitor.stopMonitoring(this._elementRef);
//   }

//   setDescribedByIds(ids: string[]) {
//     this.describedBy = ids.join(' ');
//   }

//   onContainerClick(event: MouseEvent) {
//     if ((event.target as Element).tagName.toLowerCase() != 'input') {
//       this._elementRef.nativeElement.querySelector('input')!.focus();
//     }
//   }

//   writeValue(time: TaskTime | null): void {
//     this.value = time;
//   }

//   registerOnChange(fn: any): void {
//     this.onChange = fn;
//   }

//   registerOnTouched(fn: any): void {
//     this.onTouched = fn;
//   }

//   setDisabledState(isDisabled: boolean): void {
//     this.disabled = isDisabled;
//   }

//   _handleInput(): void {
//     this.onChange(this.value);
//   }

//   static ngAcceptInputType_disabled: boolean | string | null | undefined;
//   static ngAcceptInputType_required: boolean | string | null | undefined;
// }