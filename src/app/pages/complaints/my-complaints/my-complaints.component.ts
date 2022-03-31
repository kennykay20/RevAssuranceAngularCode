import { Router } from '@angular/router';



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
import swal from 'sweetalert2';

declare var $;



@Component({
  selector: 'app-my-complaints',
    templateUrl: './my-complaints.component.html',
    styleUrls: ['./my-complaints.component.scss']
})
export class MyComplaintsComponent implements OnInit {
 @ViewChild(DatatableComponent) table: DatatableComponent;

//  @ViewChild('dataTable') table: ElementRef;
  
  dataTable: any;

  editing = {};
  //rows: any; // = [];
  //temp = [];

 // this._localStorageService.set(this.recordDetails, row); 
 // this.router.navigate(['./com/getCom']);

 rowsMobile = [];
 rowsMobileTem = [];
 current_page = 1;
  rows = [];
  columns = [];
  temp = [];
  btnConfirm = GenModel.btnConfirm;
  count = 20;
  selected = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  // columns = [
  //   { prop: 'name' },
  //   { name: 'Gender' },
  //   { name: 'Company' }
  // ];
  dialogRef: any;
  public settings: Settings;
  dataRes: any;
  token = GenModel.tokenName;
  loadPage = true;
  addedworkflowList: any[] = [];

  selectedRec: any[] = [];

  btnActionApprove = 'Approve';
  displayloader = false;
  displayloaderC = false;
  lblProcess = '';
  retryService: number =  GenModel.retryService;
  retryMessage: any;
  retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
  internetConMsg = GenModel.internetConMsg;
  errorOccur = GenModel.errorOccur;
  recordDetails = GenModel.recordDetails;
  pageLmit = GenModel.pageLmit;
  searchUserColumns: any;
  ItemsPerPage: any;
  columnId: any;
  statusTrack: any;

  searchUserColumns1 = [
    {
      id: 1,
      columnName: 'Ticket Id'

    },
    {
      id: 2,
      columnName: 'Resident Name'

    },
    {
      id: 3,
      columnName: 'Title'

    },
    {
      id: 4,
      columnName: 'Description'

    },
    {
      id: 5,
      columnName: 'Date Created'

    },
    {
      id: 6,
      columnName: 'Status'

    }

];

  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public _GeneralService: GeneralService,public router: Router,
              
              private _localStorageService: LocalStorageService) {
    this.settings = this.appSettings.settings; 
  }



  ngOnInit() 
  {

   // //this.searchUserColumns = this.searchUserColumns1;
   // this.ItemsPerPage = this._GeneralService.ItemsPerPage;
   this.load();
  
  }

  load(): void {
   
    let token = this._localStorageService.get(this.token);
   
    this._GeneralService.getT(token, 'auth/my-complaints-history?token=')
    
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
        this.temp = data;
        this.rows = data;

        this.rowsMobile =  data.slice(0, this.pageLmit);
        this.rowsMobileTem = data;
        this.changePage(this.current_page);

          // for (let i = 0; i < data.data.length; i++) {

          //   // this.addedworkflowList = this.addedworkflowList || [];
 
          //          this.addedworkflowList.push({ 
          //            id: data.data[i].id,
          //            first_name: data.data[i].first_name,
          //            last_name: data.data[i].last_name,
          //            email: data.data[i].email,
          //            phone_number: data.data[i].phone_number,
          //            meter_number: data.data[i].meter_number,
          //            status: data.data[i].status,
          //           created_at:  this._GeneralService.dateconvertion(data.data[i].created_at)
          //           // roleId: data.data[i].roleId,
          //           // createdBy: data.data[i].createdBy,
          //          // productname: this.productNameBind,
          //          //  permissionActionName: data[i].permissionActionName, 
          //            // permissionActionOrder: data[i].priority,
          //          // assignMsg:'',
          //          // created:  this._GeneralService.dateconvertion(data.data[i].created_at),
          //            // last: data[i].last,
          //      });
 
          //  }
       
       
        

         // // // console.log('get list of service this.rows array', data.ToArray());
         
          // // console.log('get all user this.rows', this.rows);
        

      },
      (error: any) => { // // console.log('error:', error)

    });
 
   }

   select(row: any): void {
    // // console.log('select row:', row);


            this.selectedRec.push({ 
                    email: row.email,
                    status: row.email,
                    partner_type: row.partner_type,
                    
                   
               });

               // // console.log('  this.selectedRec row:',   this.selectedRec);
   }

   userAction(status: any) : any{
   // this.displayloader = true;

   

    if(this.selectedRec.length == 0){
      return  Swal('', 'Select User(s)', 'error');
    }
    this.statusTrack = status;
    let token = this._localStorageService.get(this.token);
    // console.log('userAction token: ', token);
    //let getSelect = new List<any>(this.rows).Where(c=> c.)
  // console.log('  this.userAction row:',   this.selectedRec);

      for (let i = 0; i < this.selectedRec.length; i++) {

              let value =  
              {
                    email: this.selectedRec[i].email,
                    status: status   
              };

              
   // this.loadPage =  true;
    this.lblProcess = 'Wait, Action in Progress...';
  

    let url = `auth/authorize-user?token=` + token; 
    // console.log('post url: ', value);
    // console.log('post value: ', value);

    
    
    this._GeneralService.post(value, url).subscribe(
      (data: any) => {

        // this.displayloader =  false;
       
        this.statusTrack = '';
        // // console.log('gaddToCart data', data);
      let msg =  'Action Completed Successfully!';
        Swal('', msg, 'success');
        this.load();
       // this.btnActionApprove =  'Approve';
       
  
      },
      (error: any) => {
        
        // // console.log('error:', error)
     //   this.btnActionApprove =  'Approve';
   
         this.displayloader =  false;
         this.loadPage =  false;

         Swal('', error.error.message, 'error');

      });

     }


   

   }

 



  closeComplain(row: any) {

    // console.log('closeComplaint row', row);
    Swal({
      title: `Ticket Id : ${row.ticket_id}`,
      text: `Enter Reason to Close this Complaint`,
      type: 'warning',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Cancel'
    }).then((result) => {
     
      // console.log('closeComplaint result: ', result);

      if (result.value == null || result.value == '') {
        Swal('', 'Enter Reason for Closing this Complaint', 'error');
        return;
      }


     
      if (result.value) 
      {
        
            
            let postValues = 
            {
              ticket_id: row.ticket_id, 
              remarks: result.value 
            };

            // console.log('closeComplaint values', postValues);
            
            this.loadPage =  true;

            let url = 'auth/close-complaint';
            this._GeneralService.post(postValues, url).subscribe(
              (data: any) => {
        
                this.loadPage =  false;
          
                // console.log('closeComplaint result data', data);
                Swal('', data.Message, 'success');
                this.load();
        
              },
              (error: any) => {
                
                // console.log('error:', error);

               
          
              this.loadPage =  false;

                  if (error.error.message != undefined){
                    Swal('', error.error.message, 'error');
                  }
                  else  {
                    Swal('', this.errorOccur, 'error');
                  }
          
              });

          
       
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }


    updateFilter(event) {

      if (this.columnId === 1) {
        const val = event.target.value.toLowerCase();
      
        const temp = this.temp.filter(function(d) {
          return d.ticket_id.toLowerCase().indexOf(val) !== -1 || !val;
        });

        this.rows = temp;
        this.rowsMobile = temp;
        // // console.log('updateFilter',  this.rows);
        this.table.offset = 0;
      }

      if (this.columnId === 2) {
        const val = event.target.value.toLowerCase();
      
        const temp = this.temp.filter(function(d) {
          return d.resident_name.toLowerCase().indexOf(val) !== -1 || !val;
        });

        this.rows = temp;
        this.rowsMobile = temp;
        // // console.log('updateFilter',  this.rows);
        this.table.offset = 0;
      }

      if (this.columnId === 3) {
        const val = event.target.value.toLowerCase();
      
        const temp = this.temp.filter(function(d) {
          return d.title.toLowerCase().indexOf(val) !== -1 || !val;
        });

        this.rows = temp;
        this.rowsMobile = temp;
        // // console.log('updateFilter',  this.rows);
        this.table.offset = 0;
      }

      if (this.columnId === 4) {
        const val = event.target.value.toLowerCase();
      
        const temp = this.temp.filter(function(d) {
          return d.description.toLowerCase().indexOf(val) !== -1 || !val;
        });

        this.rows = temp;
        this.rowsMobile = temp;
        // // console.log('updateFilter',  this.rows);
        this.table.offset = 0;
      }
      if (this.columnId === 5) {
        const val = event.target.value.toLowerCase();
      
        const temp = this.temp.filter(function(d) {
          return d.created_at.toLowerCase().indexOf(val) !== -1 || !val;
        });

        this.rows = temp;
        this.rowsMobile = temp;
        // // console.log('updateFilter',  this.rows);
        this.table.offset = 0;
      }
      if (this.columnId === 6) {
        const val = event.target.value.toLowerCase();
      
        const temp = this.temp.filter(function(d) {
          return d.status.toLowerCase().indexOf(val) !== -1 || !val;
        });

        this.rows = temp;
        this.rowsMobile = temp;
        // // console.log('updateFilter',  this.rows);
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
 
 
 


}