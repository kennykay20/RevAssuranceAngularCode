
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-print-tem',
  templateUrl: './print-tem.component.html',
  styleUrls: ['./print-tem.component.scss']
})
export class PrintTemComponent implements OnInit {

  serviceName: string;
  constructor( public dialogRef: MatDialogRef<PrintTemComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any) {

                    console.log('PrintTemComponent data 1 ', data);
                   
                }

  ngOnInit() {
  }

  cancel(): void 
  {
    this.dialogRef.close();
  }

  submit(): void 
  {
    this.dialogRef.close(this.data.data);
  }

  get()
  {
    console.log('data.data', this.data.data);
  }

}
