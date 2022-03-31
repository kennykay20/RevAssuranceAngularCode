
import { GenModel } from './../../../../model/gen.model';
import Swal from 'sweetalert2';
import { GeneralService } from './../../../../services/genservice.service';
import { Component, ViewChild,  OnInit,  ElementRef, Directive, Input, } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import { List } from 'linqts';
import {  WaitingDialog } from '../../../../services/services';
import { LocalStorageService } from 'angular-2-local-storage';
import swal from 'sweetalert2';
import { CurrencyDetailsComponent } from '../currency-details/currency-details.component';

declare var $;

@Component({
  selector: 'app-currency-list',
    templateUrl: './currency-list.component.html',
    styleUrls: ['./currency-list.component.scss']
})
export class CurrencyListComponent implements OnInit {
 //  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('dataTable') table: ElementRef;
  
  dataTable: any;

  editing = {};
  //rows: any; // = [];
  //temp = [];



  rows = [];
  columns = [];
  temp = [];

  



  count = 20;
  selected = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  dialogRef: any;
  public settings: Settings;
  dataRes: any;
  token = GenModel.tokenName;
  loadPage = true;
  addedworkflowList: any[] = [];

  selectedRec: any[] = [];

  btnActionApprove = 'Approve';
  displayloader = false;
  lblProcess = '';
  retryService: number =  GenModel.retryService;
  retryMessage: any;
  retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
  internetConMsg = GenModel.internetConMsg;
  RetryAttmMsg = GenModel.RetryAttmMsg;

  pageLmit = GenModel.pageLmit;
  
  searchUserColumns: any;
  ItemsPerPage: any;
  columnId: any 
  statusTrack: any;
  errorOccur = GenModel.errorOccur;

   current_page = 1;

   tempList = [

         {
          Id: 1,
          conName: 'Live Zenbase',
          server: '127.0.0.1',
          dbName: 'testing',
          dateCreated: '2020-04-06',
          status: 'Active'
        }
      
   ]

   searchUserColumns1 = [
    {
      id: 1,
      columnName: 'CURRENCY CODE'

    },
    {
      id: 2,
      columnName: 'DESCRIPTION'

    },
   
    {
      id: 3,
      columnName: 'STATUS'

    }
];


origMobile = [];
  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public _GeneralService: GeneralService,private _localStorageService: LocalStorageService) 
    {
    this.settings = this.appSettings.settings; 
  }



  ngOnInit() 
  {
      this.searchUserColumns = this.searchUserColumns1;
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;

      this.load();

      // this.onSubmit();
   
  }

  load(): void {
    this.loadPage = true;
    let url = 'Currency/GetAll';
    let val = 
    {
      "aId": 0,
      "userName": "string",
      "password": "string",
      "dateCreated": "2020-05-12T12:08:01.854Z"
    }
   
    this._GeneralService.homePage(val, url)
    
    .retryWhen((err) => {
    
      return err.scan((retryCount) =>  {

        retryCount  += 1;
        if (retryCount < this.retryService) {

            this.retryMessage = this.RetryAttmMsg; // #'  + retryCount;

            return retryCount;
        }
        else 
        {
          this.retryMessage = this.errorOccur;
           throw(err);
        }
      }, 0).delay(this.retryDelayServiceInterval); 
    }).subscribe(
      (data: any) => {

        console.log('Currency data', data);
        this.loadPage = false;
        this.temp = data;
        this.rows = data;
      },
      (error: any) => { 
        this.loadPage = false;
    });
 
   }



  select(row)
  {
    const objIndex = this.selectedRec.findIndex(obj => obj.id === row.id);
    if (objIndex > -1) 
    {
      this.selectedRec.splice(objIndex, 1);
    
    }
    else
    {
      this.selectedRec.push({ 
        id: row.id,
        email: row.email,
        status: row.email,
        partner_type: row.partner_type,
      });
    
    }
  }




   userAction(status: any) : any {
   // this.displayloader = true;
    if (this.selectedRec.length == 0){
        Swal('', 'Select User(s)', 'error');
        return;
    }
    this.statusTrack = status;
    let token = this._localStorageService.get(this.token);
  
    //let getSelect = new List<any>(this.rows).Where(c=> c.)

      for (let i = 0; i < this.selectedRec.length; i++) {

              let value =  
              {
                    email: this.selectedRec[i].email,
                    status: status   
              };

              
   // this.loadPage =  true;
   // this.lblProcess = 'Wait, Action in Progress...';
    this.loadPage  = true;   

    let url = `auth/authorize-user?token=` + token; 
    this._GeneralService.post(value, url).subscribe(
      (data: any) => {

        // this.displayloader =  false;
        this.loadPage  = false;   
        this.statusTrack = '';
        this.selectedRec = [];
      
      let msg =  'Action Completed Successfully!';
      Swal('', data.message, 'success');
        this.load();
       // this.btnActionApprove =  'Approve';
       
  
      },
      (error: any) => {
        
        
         this.displayloader =  false;
         this.loadPage =  false;

         Swal('', error.error.message, 'error');

      });

     }
   }


  updateFilter(event, value: any) {
    
    console.log('updateFilter:', this.temp);
    
    if (value === 1) {
      const val = event.target.value.toLowerCase();
    
      //console.log('vals ', val)
      const temp = this.temp.filter(function(d) {
        //console.log('d - ', d.isoCode);
        return d.isoCode.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
     
     // this.table.offset = 0;
    }

    if (value === 2) {
      const val = event.target.value.toLowerCase();
      console.log('val ', val);
      
      if(val.includes("no")){
        const temp = this.temp.filter(function(d) {
          console.log('d - ', d.isLocalCurrency);
          console.log('temp - ', temp);
          return d.isLocalCurrency.match("false");
        });
        console.log('temp out - ', temp);
        this.rows = temp;
      }
      else if(val.includes("yes")){
        const temp = this.temp.filter(function(d) {
          console.log('d - ', d.isLocalCurrency);
          console.log('temp - ', temp);
          return d.isLocalCurrency.match(true);
        });

        console.log('temp out - ', temp);
        this.rows = temp;
      }

      

      
      
    
     // this.table.offset = 0;
    }

    if (value === 3) {
      const val = event.target.value.toLowerCase();
      
      //console.log('val ', val);
      const temp = this.temp.filter(function(d) {
        //console.log('d - ', d.description);
        return d.description.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
 

      
     // this.table.offset = 0;
    }

    if (value === 4) {
      const val = event.target.value.toLowerCase();
      //console.log('val ', val);
      const temp = this.temp.filter(function(d) {
        //console.log('d - ', d.status);
        return d.status.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      //console.log('this rows ', this.rows)

      
     // this.table.offset = 0;
    }


  }


  action(actionName: any, record: any){
    
    this.loadPage = true;
     setTimeout(() => {
      this.loadPage = false;
      let currencies = this.temp;
      if(record != '')
      {
        
        this.openDialog(actionName, record);
      }
      else
      {
      
        this.View(actionName, currencies, '')
      }
      //this.openDialog(actionName, record);
    }, 100);
  }


  View(action: any, record: any, createdBy: any): void
   {

    let dialogRef = this.dialog.open(CurrencyDetailsComponent, {

      width: '1200px',
      height: '560px',
      data: { actionName: action, record:  record,createdBy: createdBy},
      
    });

    dialogRef.afterClosed().subscribe(result => {
      
      if(result === 'Y'){
        this.load();
      }
     
    });
  }
   
  openDialog(action: any, record: any): void
   {

    let dialogRef = this.dialog.open(CurrencyDetailsComponent, {

      width: '1200px',
      height: '560px',
      // hasBackdrop: true,
       disableClose: true,
      // autoFocus: true,
      data: { actionName: action, record:  record},
      
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === 'Y'){

        this.load();
      }
    });
  }

  prevPage()
  {
    
      if (this.current_page > 1) {
          this.current_page--;
          this.changePage(this.current_page);
      }
  }

  nextPage()
  {
    
      if (this.current_page < this.numPages()) {
        this.current_page++;
          this.changePage(this.current_page);
      }
  }

  changePage(page)
  {
      let btn_next = document.getElementById("btn_next");
      let btn_prev = document.getElementById("btn_prev");
    // let listing_table = document.getElementById("listingTable");
      let page_span = document.getElementById("page");
  
      // Validate page
      if (page < 1) page = 1;

      if (page > this.numPages()) page = this.numPages();

      let tem = []; 

      for (let i = ( page - 1 ) * this.pageLmit; i < (page * this.pageLmit) && i < this.temp.length; i++) 
      {
          tem.push(this.temp[i]);
      }

      this.rows = tem;

      page_span.innerHTML = page + "/" + this.numPages();

  }

  numPages()
  {
      return Math.ceil(this.temp.length / this.pageLmit);
  }

  onload = function() {
    this.changePage(1);
  };
  /*Pagination ends here*/

  public onOptionsSelected(event) 
  {
   // console.log('onOptionsSelected', event);
    this.pageLmit = event.target.value;
    console.log('pageLimit: ', this.pageLmit);

    this.rows =  this.temp.slice(0, this.pageLmit);
    
    console.log('allRow: ', this.rows);


    this.changePage(this.current_page);    
 }


}