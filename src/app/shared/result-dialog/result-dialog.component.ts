import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-result-dialog',
  templateUrl: './result-dialog.component.html',
  styleUrls: ['./result-dialog.component.scss']
})
export class ResultDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;
     }

  ngOnInit(): void {
  }

  // onOkBtnClick() {
  //   debugger
  //   if(this.data.closureEmit) {
  //     this.createDialogEmitterService.onOkBtnClick()
  //   }
    // if(this.data.success) {
    //   this.showTasksEmitterService.onOkBtnClick(this.data.date)
    // }
  // }
}
