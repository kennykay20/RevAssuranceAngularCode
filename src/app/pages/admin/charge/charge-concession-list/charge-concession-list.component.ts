import { GenModel } from './../../../../model/gen.model';
import Swal from 'sweetalert2';
import { GeneralService } from './../../../../services/genservice.service';
import { Component, ViewChild,  OnInit,  ElementRef, Directive, Input, Inject } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import { List } from 'linqts';
import {  WaitingDialog } from '../../../../services/services';
import { LocalStorageService } from 'angular-2-local-storage';
import swal from 'sweetalert2';
import { ChargeConcessionDetailsComponent } from '../charge-concession-details/charge-concession-details.component';

declare var $;


@Component({
  selector: 'app-charge-concession-list',
  templateUrl: './charge-concession-list.component.html',
  styleUrls: ['./charge-concession-list.component.scss']
})
export class ChargeConcessionListComponent implements OnInit {

  @ViewChild('dataTable') table: ElementRef;
  
  dataTable: any;

  editing = {};
  rows = [];
  columns = [];
  temp = [];
  count = 20;
  selected = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  //dialogRef: any;
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
  stuff : any;
   current_page = 1;
   pageResponse = '';

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
      columnName: 'CONNECTION NAME'

    },
    {
      id: 2,
      columnName: 'SERVER Name'

    },
    {
      id: 3,
      columnName: 'DATABASE NAME'

    },
    {
      id: 4,
      columnName: 'Date Created'

    },
    {
      id: 5,
      columnName: 'STATUS'

    }
];


origMobile = [];
  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public _GeneralService: GeneralService,private _localStorageService: LocalStorageService,
     public dialogRef: MatDialogRef<ChargeConcessionDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) 
    {
    this.settings = this.appSettings.settings; 
    this.stuff = data;
    console.log('ehen',this.stuff);
  }


  ngOnInit() 
  {
      this.searchUserColumns = this.searchUserColumns1;
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;
      this.load();
  }

  
  load(): void {
    let url = 'Charge/GetConcessionByChargeCode';
    let val = 
    {
      "chargeCode": this.stuff.record.chargeCode
    }
   
    console.log('sent',val);
    this._GeneralService.post(val, url)
    
    .retryWhen((err) => {
    
      return err.scan((retryCount) =>  {

        retryCount  += 1;
        if (retryCount < this.retryService) {

            this.retryMessage = this.RetryAttmMsg; // #'  + retryCount;
            console.log('this.retryMessage ', this.retryMessage);
            return retryCount;
        }
        else 
        {
          this.retryMessage = this.errorOccur;
          console.log('this.retryMessage err ', this.retryMessage);
           throw(err);
        }
      }, 0).delay(this.retryDelayServiceInterval); 
    }).subscribe(
      (data: any) => {
        if(data.length > 0){
          console.log('concessions' ,data)
          this.loadPage = false;
          this.temp = data;
          this.rows  =  data.slice(0, this.pageLmit);
        this.changePage(this.current_page); 
        }
        this.loadPage = false;
        this.temp = data;
        this.rows  =  data;
        console.log('data ', data);
        console.log('this.rows ', this.rows);
      },
      (error: any) => { 
        console.log('error occur ', error);
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
    
    console.log('updateFilter:', value);

    if (value === 1) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.chargeCode.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
     
     // this.table.offset = 0;
    }

    if (value === 2) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.description.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
     // this.table.offset = 0;
    }

    if (value === 3) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.status.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
 

      
     // this.table.offset = 0;
    }

  }

  action(actionName: any, record: any){
    
    localStorage.setItem("ChargeCode",this.stuff.record.chargeCode);
    this.loadPage = true;
     setTimeout(() => {
      this.loadPage = false;
      this.openDialog(actionName, record);
    }, 100);
  }
   
  openDialog(action: any, record: any): void
   {

    let dialogRef = this.dialog.open(ChargeConcessionDetailsComponent, {

      width: '1500px',
      height: '650px',
      // hasBackdrop: true,
      // disableClose: true,
      // autoFocus: true,
      data: { actionName: action, record:  record},
      
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === "Y")
      {
          this.load();
      }
    });
  }

  close(): void 
  {

    this.dialogRef.close('Y');
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
      console.log("page_span ", page_span);
      // Validate page
      if (page < 1) page = 1;

      if (page > this.numPages()) page = this.numPages();

      let tem = []; 

      for (let i = ( page - 1 ) * this.pageLmit; i < (page * this.pageLmit) && i < this.temp.length; i++) 
      {
          tem.push(this.temp[i]);
      }

      this.rows = tem;

      console.log('page + "/" + this.numPages() ', page + "/" + this.numPages());
      //page_span.innerHTML = page + "/" + this.numPages();

      this.pageResponse = page + "/" + this.numPages();

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
