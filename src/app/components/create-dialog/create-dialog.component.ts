import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith, debounceTime, switchMap} from 'rxjs/operators';
import { CreateDialogService } from 'src/app/services/create-dialog.service';
import { TimeDialogComponent } from 'src/app/shared/time-dialog/time-dialog.component';
import { TimeDialogService } from 'src/app/services/time-dialog.service';
import { ResultDialogComponent } from 'src/app/shared/result-dialog/result-dialog.component';
import { TasksShowService } from 'src/app/services/tasks-show.service';
import {ErrorStateMatcher} from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { validateComplexValues } from '@progress/kendo-angular-dropdowns/dist/es2015/util';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

export class myErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.scss']
})
export class CreateDialogComponent implements OnInit {

  displayedColumns: string[] = ['ListName', 'SubListName', 'CreatedOn'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public dialogRef: MatDialogRef<CreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public createDialogService: CreateDialogService,
    private dialog: MatDialog,
    public timeDialogService: TimeDialogService,
    public tasksShowService: TasksShowService) {
      dialogRef.disableClose = true;
    }

  // Form controllers
  modalityControl = new FormControl('', [
    Validators.required,
  ])

  placeControl = new FormControl('', [
    Validators.required,
  ])

  descriptionControl = new FormControl('', [
    Validators.required,
  ])

  projectControl = new FormControl('', [
    Validators.required,
  ])

  accountControl = new FormControl('', [
    Validators.required,
  ])

  phaseControl = new FormControl('', [
    Validators.required,
  ])

  subphaseControl = new FormControl('', [
    Validators.required,
  ])

  dateControl = new FormControl(new Date(), [
    Validators.required,
  ])
  events: string[] = [];
  invalidFilledDate: boolean = false

  timeControl = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
  ])

  // Filteredoptions
  filteredModalityOptions: Observable<string[]>
  filteredAccountOptions: Observable<string[]>
  filteredPlaceOptions: Observable<string[]>
  filteredProjectOptions: Observable<string[]>
  filteredPhaseOptions: Observable<string[]>
  filteredSubphaseOptions: Observable<string[]>

  places: string[] = ["کسرا", "محل مشتری"]
  selectedDate: string;
  valid: boolean = null
  matcher = new myErrorStateMatcher();
  error: string = null
  accountName: string
  serverRes: any[] = []
  isSaving: boolean = false

  // Input mask
  public mask = {
    guide: false,
    showMask: true,
    mask: [/\d/, /\d/, ':', /\d/, /\d/]
  };

  // Variables related to Kendo grid
  kendoSource: any = []
  public multiple = false;
    public allowUnsort = true;
    public sort: SortDescriptor[] = [{
      field: 'CreatedOn',
      dir: 'desc'
    }];
    public gridView: GridDataResult;
    public pageSize = 10;
    public skip = 0;
    private items: any[]

  ngOnInit(): void {
    // Account
    this.filteredAccountOptions = this.accountControl.valueChanges
    .pipe(
      startWith(''),
      debounceTime(500),
      switchMap(value => this.accountFilter(value))
    );

    // Project
    this.filteredProjectOptions = this.projectControl.valueChanges
    .pipe(
      startWith(''),
      switchMap(value => this.projectFilter(value))
    );

    // Phase
    this.filteredPhaseOptions = this.phaseControl.valueChanges
    .pipe(
      startWith(''),
      switchMap(value => this.phaseFilter(value))
    );

    // Subphase
    this.filteredSubphaseOptions = this.subphaseControl.valueChanges
    .pipe(
      startWith(''),
      switchMap(value => this.subphaseFilter(value))
    );

    // Date
    this.selectedDate = this.dateControl.value;

    // Description
    this.descriptionControl.setValue("")
  }

  public phaseSearch(projectName: string, searchedValue: string): Observable<any> {
    debugger
      return this.createDialogService.searchPhase(projectName, searchedValue).pipe(
        map(success => this.createDialogService.phaseOptions = JSON.parse(success.message))
      );
  }

  public subphaseSearch(phaseName: string, searchedSubphaseValue: string): Observable<any> {
    debugger
    return this.createDialogService.searchSubphase(phaseName, searchedSubphaseValue).pipe(
      map(success => this.createDialogService.subphaseOptions = JSON.parse(success.message))
    );
  }

  public projectSearch(accountName: string, searchedValue: string): Observable<any> {
    return this.createDialogService.searchProject(accountName, searchedValue).pipe(
      map(success => this.createDialogService.projectOptions = JSON.parse(success.message))
    );
  }

  private phaseFilter(searchedPhaseValue: string): Observable<any> {
    return this.phaseSearch(this.projectControl.value, searchedPhaseValue);
  }

  private subphaseFilter(searchedSubphaseValue: string): Observable<any> {
    return this.subphaseSearch(this.phaseControl.value, searchedSubphaseValue);
  }

  private projectFilter(searchedProjectValue: string): Observable<any> {
    return this.projectSearch(this.accountControl.value, searchedProjectValue);
  }

  private accountFilter(value: string): Observable<any> {
    debugger
    this.createDialogService.accountOptions
    return this.accountSearch(value);
    debugger
  }

  openTimeDialog(content: string): void {
    const dialogRef = this.dialog.open(TimeDialogComponent, {
      data: {content: content}
    });
    dialogRef.afterClosed().subscribe(result => {
      debugger
      // At this part the time must get converted to a proper format.
      if(this.createDialogService.time.hour.toString().length === 1) {
        this.createDialogService.taskTime = "0" + this.createDialogService.time.hour.toString()
      }
      else {
        this.createDialogService.taskTime = this.createDialogService.time.hour.toString()
      }

      this.createDialogService.taskTime += ":"

      if(this.createDialogService.time.minute.toString().length === 1) {
        this.createDialogService.taskTime += "0" + this.createDialogService.time.minute.toString()
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
    this.error = null
    debugger
    this.dateControl.valid
    if(this.preSaveValidator()) {
      this.isSaving = true
      this.tasksShowService.selectedDate = this.selectedDate
      this.createDialogService.createContinuebyEstablishments(this.projectControl.value, this.descriptionControl.value, this.tasksShowService.selectedDate).subscribe(
        (success) => {
          debugger
          if(success.validate) {
            debugger
            var resultDialogRef = this.dialog.open(ResultDialogComponent, {
              data: {message: success.exceptionMessage,
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
              data: {message: success.exceptionMessage,
              closureEmit: false,
              success: false}
            });
          }
          this.error = null
          this.isSaving = false
        },
        (error) => {
          this.dialog.open(ResultDialogComponent, {
            data: {message: "خطایی رخ داد",
            closureEmit: false,
            success: false}
          });
          this.error = null
          this.isSaving = false
        }
      )
    }
    else {
      this.error = "! لطفا تمامی فیلد ها را به درستی پر کنید"
    }
  }

  onSaveAndContinueBtnClick() {
    debugger
    this.error = null
    if(this.preSaveValidator()) {
      this.isSaving = true
      this.tasksShowService.selectedDate = this.selectedDate
      this.createDialogService.createContinuebyEstablishments(this.projectControl.value, this.descriptionControl.value, this.tasksShowService.selectedDate).subscribe(
        (success) => {
          debugger
          if(success.validate) {
            this.dialog.open(ResultDialogComponent, {
              data: {message: success.exceptionMessage,
              closureEmit: false,
              success: true,
              date: this.tasksShowService.selectedDate}
            });
          }

          else {
            this.dialog.open(ResultDialogComponent, {
              data: {message: success.exceptionMessage,
              closureEmit: false,
              success: false}
            });
          }
          this.error = null
          this.isSaving = false
        },
        (error) => {
          this.dialog.open(ResultDialogComponent, {
            data: {message: "خطایی رخ داد",
            closureEmit: false,
            success: false}
          });
          this.error = null
          this.isSaving = false
        }
      )
    }
    else {
      this.error = "! لطفا تمامی فیلد ها را به درستی پر کنید"
    }
  }
  onProjectSelectPhaseSearch(projectName: string) {
    debugger
    this.createDialogService.phaseOptions
    this.filteredPhaseOptions = this.phaseControl.valueChanges
    .pipe(
      startWith(''),
      switchMap(value => this.phaseFilter(value))
    );
  }

  onPhaseSelectSubphaseSearch(phaseName: string) {
    debugger
    this.LoadSubchecklistGrid(phaseName)
    this.filteredSubphaseOptions = this.subphaseControl.valueChanges
    .pipe(
      startWith(''),
      switchMap(value => this.subphaseFilter(value))
    );
  }

  onAccountSelectProjectSearch(accountName: string) {
    debugger
    this.createDialogService.accountOptions
    this.filteredProjectOptions = this.projectControl.valueChanges
    .pipe(
      startWith(''),
      switchMap(value => this.projectFilter(value))
    );
  }

  onTimeValueChange() {
    debugger
    if(this.createDialogService.taskTime !== null) {
      this.createDialogService.taskTime.trim()
      if(this.createDialogService.taskTime.length === 1) {
        this.createDialogService.taskTime = "0" + this.createDialogService.taskTime + ":" + "00"
      }
      else if(this.createDialogService.taskTime.length === 3) {
        var taskTimeArray = this.createDialogService.taskTime.split(":")
        this.createDialogService.taskTime = taskTimeArray[0] + ":" + "00"
      }
      else if(this.createDialogService.taskTime.length === 4) {
        var taskTimeArray = this.createDialogService.taskTime.split(":")
        this.createDialogService.taskTime = taskTimeArray[0] + ":" + "0" + taskTimeArray[1]
      }
    }
  }

  LoadSubchecklistGrid(phaseName: string) {
    debugger
    this.createDialogService.LoadSubchecklist(phaseName).subscribe(
      (success) => {
        debugger
        this.serverRes = JSON.parse(success.message)
        this.items = this.serverRes
        this.kendoSource.data = this.items
        this.loadItems()
        // this.dataSource = new MatTableDataSource(this.serverRes)
        // this.dataSource = new MatTableDataSource(this.serverRes)
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
      },
      (error) => {}
    )
  }

  accountSearch(searchedValue: string): Observable<any> {
    debugger
    return this.createDialogService.searchAccount(searchedValue).pipe(
      map(success => this.createDialogService.accountOptions = JSON.parse(success.message))
    );
  }

  private loadProducts(): void {
    this.gridView = {
        data: orderBy(this.kendoSource.data, this.sort),
        total: this.kendoSource.data.length
    };
  }
  
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    debugger
    this.loadProducts();
    debugger
    this.kendoSource.data = this.gridView.data
  }

  onXMarkClick() {
    this.dialogRef.close()
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();
  }

  private loadItems(): void {
    debugger
    this.kendoSource = {
        data: this.items.slice(this.skip, this.skip + this.pageSize),
        total: this.items.length
    };
 }

  private preSaveValidator(): boolean {
    debugger
    this.subphaseControl.hasError('required')
    return this.accountControl.valid && this.projectControl.valid && this.phaseControl.valid
           && this.subphaseControl.valid && !this.invalidFilledDate
           && this.timeControl.value !== "" && this.descriptionControl.valid
  }

  addEvent(event: MatDatepickerInputEvent<Date>) {
    debugger
    var t = this.selectedDate
    if(event.value === null) {
      this.invalidFilledDate = true
      this.selectedDate = null
      this.dateControl.setValue(null)
    }
    else {
      this.invalidFilledDate = false
    }
  }
}