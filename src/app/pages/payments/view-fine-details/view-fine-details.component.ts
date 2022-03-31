import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
@Component({
  selector: 'app-view-fine-details',
  templateUrl: './view-fine-details.component.html',
  styleUrls: ['./view-fine-details.component.scss']
})
export class ViewFineDetailsComponent implements OnInit {

  constructor(private thisDialogRef: MatDialogRef<ViewFineDetailsComponent> ) { }

  ngOnInit() {
  }
  close() 
  {
     
     this.thisDialogRef.close('Cancel');
  }
 
}
