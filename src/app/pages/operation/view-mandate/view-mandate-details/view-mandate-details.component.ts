import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InstrumentForm } from '../../../../model/instrumentForms.model';
import { Mandate } from '../../../../model/mandate.model';
import Swal from 'sweetalert2';
import { GeneralService } from '../../../../services/genservice.service';
import { List } from 'linqts';

@Component({
  selector: 'app-view-mandate-details',
  templateUrl: './view-mandate-details.component.html',
  styleUrls: ['./view-mandate-details.component.scss']
})
export class ViewMandateDetailsComponent implements OnInit {

  serviceName: string;
  instrumentForm: InstrumentForm;
  lstSignaturePhoto: Mandate[];
  firstlstSignaturePhoto: Mandate; 
  lstMandate: Mandate[]
  firstlstMandate: Mandate
  mandate: Mandate;
  genMandate: Mandate[];
  constructor( public dialogRef: MatDialogRef<ViewMandateDetailsComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               public _GeneralService: GeneralService,) {

                    console.log('data mandate 1 ', data);
                    this.genMandate = data.data;
                    this.mandate = this.genMandate[0];


                    this.lstSignaturePhoto =  new List<Mandate>( this.genMandate).Where(c=> c.mandateType == 'SIGNATURE').ToArray();
                    console.log('lstSignaturePhoto', this.lstSignaturePhoto);
                    this.lstMandate  =new List<Mandate>( this.genMandate).Where(c=> c.mandateType == 'MANDATE').ToArray();
            
                    console.log('lstMandate', this.lstMandate);
            
                   this.firstlstSignaturePhoto = new Mandate();
            
            
                  if(this.lstSignaturePhoto.length > 0){
                   
                    this.firstlstSignaturePhoto.photoBase64 = this.lstSignaturePhoto[0].photoBase64;
                    this.firstlstSignaturePhoto.signatory = this.lstSignaturePhoto[0].signatory
                  }
                 
}

ngOnInit() {
}

cancel(): void {
  this.dialogRef.close();
}

submit(): void {
  this.dialogRef.close(this.data.data);
}

loadMoreSignature(row: Mandate) {
  console.log('loadMoreSignature: ', row);
  this.firstlstSignaturePhoto.photoBase64 = row.photoBase64 ;
  this.firstlstSignaturePhoto.signatory = row.signatory

}

}

