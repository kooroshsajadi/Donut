import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteDialogService } from 'src/app/services/delete-dialog.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {

  constructor(private deleteDialogService: DeleteDialogService,
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) { 
      dialogRef.disableClose = true;
    }

  ngOnInit(): void {
  }

  onDeleteAdmitBtnClick() {
    // this.deleteDialogService.deleteContinuebyEstablishments().subscribe(
    //   (success) => {
    //     debugger
    //     if(success.message === true)
    //       console.log("عملیات با موفقیت انجام شد")
    //     else
    //       console.log("خطایی رخ داد")
    //   },
    //   (error) => {}
    // )
  }
}
