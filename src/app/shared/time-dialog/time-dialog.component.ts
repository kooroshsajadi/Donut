import { Component, OnInit, Inject } from '@angular/core';
import { CreateDialogService } from 'src/app/services/create-dialog.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-time-dialog',
  templateUrl: './time-dialog.component.html',
  styleUrls: ['./time-dialog.component.scss']
})
export class TimeDialogComponent implements OnInit {

  constructor(public createDialogService: CreateDialogService,
    public dialogRef: MatDialogRef<TimeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;
     }

  ngOnInit(): void {
  }

}
