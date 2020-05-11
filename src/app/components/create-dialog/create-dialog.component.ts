import { Component, OnInit, Inject, ViewChild } from '@angular/core';
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
import { stringify } from 'querystring';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export class myErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    // !str.replace(/\s/g, '').length
    if(control.value === "" ) {
      return true
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

  displayedColumns: string[] = ['ListName', 'SubListName', 'CreatedOn'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(public dialogRef: MatDialogRef<CreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public createDialogService: CreateDialogService,
    private dialog: MatDialog,
    public timeDialogService: TimeDialogService,
    public tasksShowService: TasksShowService) {}

  // Form controllers
  modalityControl = new FormControl("")
  placeControl = new FormControl("")
  descriptionControl = new FormControl("")
  projectControl = new FormControl("");
  accountControl = new FormControl("");
  phaseControl = new FormControl("");
  subphaseControl = new FormControl("");
  dateControl = new FormControl(new Date());
  timeControl = new FormControl("", [
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

  // Input mask
  public mask = {
    guide: false,
    showMask: true,
    mask: [/\d/, /\d/, ':', /\d/, /\d/]
  };  

  ngOnInit(): void {
    // Costumizing the paginator.
    this.paginator._intl.nextPageLabel = "بعدی"
    this.paginator._intl.previousPageLabel = "قبلی"
    this.paginator._intl.itemsPerPageLabel = "موارد در هر صفحه"
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) =>
    { if (length == 0 || pageSize == 0) { return `0 از ${length}`; } length = Math.max(length, 0);
    const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} – ${endIndex} از ${length}`; }

    // Account
    this.filteredAccountOptions = this.accountControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this.accountFilter(value))
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

    // Date
    this.selectedDate = this.dateControl.value;

    // Description
    this.descriptionControl.setValue("")

  }

  public phaseSearch(projectName: string, searchedValue: string) {
    debugger
    this.createDialogService.subphaseOptions = []
    // this.filteredPhaseOptions = this.phaseControl.valueChanges
    //       .pipe(
    //       startWith(''),
    //       map(value => this.phaseFilter(value)),
    //       );
      this.createDialogService.searchPhase(projectName, searchedValue).subscribe(
        (success) => {
          debugger
          this.createDialogService.phaseOptions = JSON.parse(success.message)
          // this.filteredPhaseOptions = this.phaseControl.valueChanges
          // .pipe(
          // startWith(''),
          // map(value => this.phaseFilter(value)),
          // );
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

  public projectSearch(accountName: string, searchedValue: string) {
    this.createDialogService.phaseOptions = []
    this.createDialogService.searchProject(accountName, searchedValue).subscribe(
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

  private projectFilter(searchedProjectValue: string): string[] {
    this.projectSearch(this.accountControl.value, searchedProjectValue);
    return this.createDialogService.projectOptions
  }

  private accountFilter(value: string): string[] {
    this.accountSearch(value);
    return this.createDialogService.accountOptions
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
          this.error = null
        },
        (error) => {
          this.dialog.open(ResultDialogComponent, {
            data: {message: "خطایی رخ داد",
            closureEmit: false,
            success: false}
          });
          this.error = null
        }
      )
    }
    else {
      this.error = "! لطفا تمامی فیلد های ضروری را پر کنید"
    }
  }

  onSaveAndContinueBtnClick() {
    debugger
    this.error = null
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
          this.error = null
        },
        (error) => {
          this.dialog.open(ResultDialogComponent, {
            data: {message: "خطایی رخ داد",
            closureEmit: false,
            success: false}
          });
          this.error = null
        }
      )
    }
    else {
      this.error = "! لطفا تمامی فیلد های ضروری را پر کنید"
    }
  }
  onProjectSelectPhaseSearch(projectName: string) {
    debugger
    this.phaseSearch(projectName, "")
    // this.filteredPhaseOptions = this.phaseControl.valueChanges
    // .pipe(
    //   startWith(''),
    //   map(value => this.phaseFilter(value)),
    // );
  }

  onPhaseSelectSubphaseSearch(phaseName: string) {
    debugger
    this.subphaseSearch(phaseName, "")
    debugger
    this.LoadSubchecklistGrid(phaseName)

    this.filteredSubphaseOptions = this.subphaseControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this.subphaseFilter(value))
    );
  }

  onAccountSelectProjectSearch(accountName: string) {
    debugger
    this.projectSearch(accountName, "")
    this.filteredProjectOptions = this.projectControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this.projectFilter(value)),
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
        this.dataSource = new MatTableDataSource(this.serverRes)
        this.dataSource = new MatTableDataSource(this.serverRes)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {}
    )
  }

  accountSearch(searchedValue: string) {
    debugger
    this.createDialogService.projectOptions = []
    debugger
    this.createDialogService.searchAccount(searchedValue).subscribe(
      (success) => {
        debugger
        this.createDialogService.accountOptions = JSON.parse(success.message)
        debugger
      },
      (error) => {}
    )
  }
}