import { GenModel } from './../../../model/gen.model';
import Swal from 'sweetalert2';
import { GeneralService } from './../../../services/genservice.service';
import { Component, ViewChild,  OnInit,  ElementRef, Directive, Input, } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
// import { ViewAgentdetailsComponent } from '../view-agent/view-agentdetails/view-agentdetails.component';
// import { UpdateAgentComponent } from '../view-agent/update-agent/update-agent.component';
import { List } from 'linqts';
import {  WaitingDialog } from '../../../services/services';
import { LocalStorageService } from 'angular-2-local-storage';

declare var $;



@Component({
  selector: 'app-payment-his',
    templateUrl: './payment-his.component.html',
    styleUrls: ['./payment-his.component.scss']
})
export class PaymentHisComponent implements OnInit {
 // @ViewChild(DatatableComponent) table: DatatableComponent;
 @ViewChild(DatatableComponent) table: DatatableComponent;
  // @ViewChild('dataTable') table: ElementRef;
  
  dataTable: any;
  rowsMobile = [];
  rowsMobileTem = [];
  current_page = 1;
  editing = {};
  rows: any[] = [];
  temp = [];
  count = 20;
  selected = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  columns = [
    { prop: 'name' },
    { name: 'Gender' },
    { name: 'Company' }
  ];
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
  pageLmit = GenModel.pageLmit;
 

  searchUserColumns1 = [
    {
      id: 1,
      columnName: 'Payment Type'

    },
    {
      id: 2,
      columnName: 'Resident Name'

    },
    {
      id: 3,
      columnName: 'Trans. Ref.'

    },
    {
      id: 4,
      columnName: 'Description'

    },
    {
      id: 5,
      columnName: 'Amount(₦)'

    },
    {
      id: 6,
      columnName: 'Date Created'

    },
    {
      id: 7,
      columnName: 'Status'

    }

];

searchUserColumns: any;
ItemsPerPage: any;
columnId: any;

  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public _GeneralService: GeneralService,
              
              private _localStorageService: LocalStorageService) {
    this.settings = this.appSettings.settings; 
  }



  ngOnInit() 
  {
    //this.searchUserColumns = this.searchUserColumns1;
 //   this.ItemsPerPage = this._GeneralService.ItemsPerPage;
   this.load();
  
  }

  load(): void {
   
    let token = this._localStorageService.get(this.token);
   
    this._GeneralService.getT(token, 'auth/my-payments-history?token=')
    
    .retryWhen((err) => {
    
      return err.scan((retryCount) =>  {

        retryCount  += 1;
        if (retryCount < this.retryService) {

            this.retryMessage = 'Retrying...Attempt'; // #'  + retryCount;

            return retryCount;
        }
        else 
        {
          this.retryMessage = 'Problem Loading Page. Kindly contact System Administrator';
           throw(err);
        }
      }, 0).delay(this.retryDelayServiceInterval); 
    }).subscribe(
      (data: any) => {

        this.loadPage = false;

        let temp = data.data;
         this.rows = data.data;
         this.temp = data.data;
         this.rowsMobile =  data.data.slice(0, this.pageLmit);
        this.rowsMobileTem = data.data;
        this.changePage(this.current_page);


      },
      (error: any) =>
    {

    }

    );
 
   }
   details(row: any){

   }

   select(row: any) {
 


            this.selectedRec.push({ 
                    email: row.email,
                    status: row.email,
                    partner_type: row.partner_type,
                    
                   
               });

             
   }

   post() {



      for (let i = 0; i < this.selectedRec.length; i++) {

              let value =  
              {
                    email: this.selectedRec[i][0],
                    status: this.selectedRec[i][1],
                    partner_type: this.selectedRec[i][2],
              };

              
   // this.loadPage =  true;
    this.lblProcess = 'Wait, Action in Progress...';
    this.displayloader = true;

    let url = `auth/authorize-user`; 

   
    
    this._GeneralService.post(value, url).subscribe(
      (data: any) => {

         this.displayloader =  false;
       

     

        Swal('', data.message, 'success');

        this.btnActionApprove =  'Approve';
       
  
      },
      (error: any) => {
        
      
        this.btnActionApprove =  'Approve';
   
         this.displayloader =  false;
         this.loadPage =  false;

         Swal('', error.error.message, 'error');

      });

     }


   

   }

  //  ngAfterViewInit()  {

  //   this.dataTable =  $(this.table.nativeElement);
  //   this.dataTable.dataTable();
  //   this.settings.loadingSpinner = false; 
  // }

    
  updateFilter(event) {

    if (this.columnId === 1) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.type.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      this.rowsMobile = temp;
     
      this.table.offset = 0;
    }

    if (this.columnId === 2) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      this.rowsMobile = temp;
   
      this.table.offset = 0;
    }

    if (this.columnId === 3) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.eazybillz_reference.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      this.rowsMobile = temp;
     
      this.table.offset = 0;
    }
    if (this.columnId === 4) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.description.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      this.rowsMobile = temp;
    
      this.table.offset = 0;
    }

    if (this.columnId === 5) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.amount.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      this.rowsMobile = temp;
    
      this.table.offset = 0;
    }

    if (this.columnId === 6) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.created_at.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      this.rowsMobile = temp;
    
      this.table.offset = 0;
    }
    if (this.columnId === 7) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.created_at.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      this.rowsMobile = temp;
    
      this.table.offset = 0;
    }
  }

   // From BElow is the Pagination on Mobile ///

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

       for (let i = ( page - 1 ) * this.pageLmit; i < (page * this.pageLmit) && i < this.rowsMobileTem.length; i++) 
       {
           tem.push(this.rowsMobileTem[i]);
       }
       this.rowsMobile = tem;

        

       page_span.innerHTML = page + "/" + this.numPages();

     
   }

   numPages()
   {
       return Math.ceil(this.rowsMobileTem.length / this.pageLmit);
   }

   onload = function() {
     this.changePage(1);
   };
 //Pagination for Mobile Ends here


//  exportExcel(){



    
//  let arr: any[] = [];



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
//   this._GeneralService.exportAsExcelFile1(arr, 'My-Payment-History');
// }

numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
 
}



  }




