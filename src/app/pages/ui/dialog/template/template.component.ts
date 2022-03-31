import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GeneralService } from '../../../../services/genservice.service';
//import { NgxNumToWordsService, SUPPORTED_LANGUAGE  } from 'ngx-num-to-words';

// declare var $: any;

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})


export class TemplateComponent implements OnInit {

  serviceName: string;
  serviceId: number;
  serviceDetail: any;
  templateName = 'TEMPLATE EDITOR';
  txtValue = '';
  replaceData: string;
  //lang: SUPPORTED_LANGUAGE = 'en';
  constructor(
    public dialogRef: MatDialogRef<TemplateComponent>,
    public _GeneralService: GeneralService,
    //private ngxNumToWordsService: NgxNumToWordsService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    //console.log('data temp 1 ', data);
    
    //console.log('service id ', data.serviceId);
    //console.log('serviceDetail ', data.serviceDetail);
    console.log("values to replace ", data.replaceVal);
    //console.log("level ", data.level);
    if (data.serviceDetail !== undefined && data.serviceDetail.template.templateName !== undefined){
      this.templateName = `${data.serviceDetail.template.templateName} TEMPLATE EDITOR`;
    }

    this.serviceId  = data.serviceId

    if(this.serviceId == 11){
      this.replaceData = data.data;
    }
    if(this.serviceId == 20){
      this.replaceData = data.data;
    }
    if(this.serviceId == 3){
      //console.log("values to replace ", data.replaceVal);
      if(data.level == 2){
      this.replaceData = `${data.data.replace('{{BENEFICIARY}}', data.replaceVal.beneficiary.toUpperCase()).
      replace('{{AMT}}', data.replaceVal.amount).
      replace('{{ACCTNO}}', data.replaceVal.acctNo).
      replace('{{BRANCHNAME}}', data.replaceVal.branchName.toUpperCase()).
      replace(new RegExp('{{CCY}}', 'g'), data.replaceVal.ccyCode).
      replace('{{CHARGEAMT}}', data.replaceVal.chargeAmount).
      replace('{{ACCTNAME}}', data.replaceVal.acctName).
      replace(new RegExp('{{REASON}}', 'g'), data.replaceVal.reason).
      replace('{{ACCTSTATUS}}', data.replaceVal.acctStatus).
      replace('{{DateIssued}}', this._GeneralService.dateconvertion(data.replaceVal.dateIssued)).
      replace('{{AVAILBAL}}', data.replaceVal.acctBalance)}`;
      //console.log("replaceData ", this.replaceData);
      }
      else{
        this.replaceData = data.data;
      }
    }
    if(this.serviceId == 14){
      this.replaceData = data.data;
    }
    if(this.serviceId == 19){
      this.replaceData = data.data;
    }
    if(this.serviceId == 23){
      this.replaceData = data.data;
    }
    if(this.serviceId == 18){
      this.replaceData = data.data;
    }
    if(this.serviceId == 10){
      this.replaceData = data.data;
    }
    if(this.serviceId == 22){
      this.replaceData = data.data;
    }
    if(this.serviceId == 8){
      this.replaceData = data.data;
    }
    if(this.serviceId == 9){
      this.replaceData = data.data;
    }
    //this.txtValue = data.data;

    //document.getElementById("divValue").textContent = data.data;

  }

  ngOnInit() {
    //console.log('data temp ngOnInit ', this.data.data);

  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    this.dialogRef.close(this.data.data);
    // this.dialogRef.close($('#summernote').summernote('code'))
  }

}
