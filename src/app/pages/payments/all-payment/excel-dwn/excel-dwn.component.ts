
import { GenModel } from './../../../../model/gen.model';
import Swal from 'sweetalert2';
import { GeneralService } from './../../../../services/genservice.service';
import { Component, ViewChild,  OnInit,  ElementRef, Directive, Input, Inject} from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import { List } from 'linqts';
import {  WaitingDialog } from '../../../../services/services';
import { LocalStorageService } from 'angular-2-local-storage';

declare var $;



@Component({
    selector: 'app-excel-dwn',
    templateUrl: './excel-dwn.component.html',
    styleUrls: ['./excel-dwn.component.scss']
})
export class ExcelDwnComponent implements OnInit {


  rows: any[] = [];
  type: any;
  starDate: any;
  EndDate: any;


  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public _GeneralService: GeneralService, public dialogRef: MatDialogRef<ExcelDwnComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

     
      this.rows = data.data;
      this.type = data.downloadtype;

     

  }



  ngOnInit() 
  {
  
  
  }

  downlaod(){
      if (this.type === 'Excel')
      {
      //  this.downlaodExcel();
      }
      if (this.type === 'CSV')
      {
        this.downlaodCSV();
      }
    
  }

//   downlaodExcel() {

 
//  let arr: any[] = [];

//  //let getBetw = new List<any>(this.rows).Where(c => c.created_at === '2020-05-06 19:41:22').ToArray();

//  for (let i = 0; i < this.rows.length; i++)
//  {

//     arr.push({

//        'NAME': this.rows[i].name != null ? this.rows[i].name : '',
//        'PAYSTACK REFERENCE': this.rows[i].paystack_reference != null ? this.rows[i].paystack_reference : '',
//        'QUANTITY': this.rows[i].quantity != null ? this.rows[i].quantity : '',
//        'TYPE': this.rows[i].type != null ? this.rows[i].type : '',      
//        'AMOUNT': this.rows[i].amount != null ? this.numberWithCommas(this.rows[i].amount) : 0.00,
//        'TRANSACTION DATE': this.rows[i].created_at != null ? this.rows[i].created_at : '',
//        'DESCRIPTION': this.rows[i].description != null ? this.rows[i].description : ''
      
//     });
//  }
//   this._GeneralService.exportAsExcelFile1(arr, 'ALL-Payment-History');
// }
downlaodCSV(){

}
cancel(){
  this.dialogRef.close();
}

numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


  }




