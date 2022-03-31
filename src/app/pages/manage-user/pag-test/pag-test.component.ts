
import { GenModel } from './../../../model/gen.model';
import Swal from 'sweetalert2';
import { GeneralService } from './../../../services/genservice.service';
import { Component, ViewChild,  OnInit,  ElementRef, Directive, Input, } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import { List } from 'linqts';
import {  WaitingDialog } from '../../../services/services';
import { LocalStorageService } from 'angular-2-local-storage';
import swal from 'sweetalert2';

declare var $;



@Component({
  selector: 'app-pag-test',
    templateUrl: './pag-test.component.html',
    styleUrls: ['./pag-test.component.scss']
})
export class PagTestComponent implements OnInit {
 //  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('dataTable') table: ElementRef;
  
  dataTable: any;

  editing = {};
  //rows: any; // = [];
  //temp = [];



  rows = [];
  columns = [];
  temp = [];

  rowsMobile = [];
  rowsMobileTem = [];




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
  lblProcess = '';
  retryService: number =  GenModel.retryService;
  retryMessage: any;
  retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
  internetConMsg = GenModel.internetConMsg;
  
  pageLmit = GenModel.pageLmit;
  
  searchUserColumns: any;
  ItemsPerPage: any;
  columnId: any
  statusTrack: any;

   current_page = 1;




origMobile = [];
  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public _GeneralService: GeneralService,
              
              private _localStorageService: LocalStorageService) {
    this.settings = this.appSettings.settings; 
  }



  ngOnInit() 
  {

    //this.searchUserColumns = this._GeneralService.searchUserColumns;
 //   this.ItemsPerPage = this._GeneralService.ItemsPerPage;
   this.load();
   
  
  }

  load(): void {
   
    let token = this._localStorageService.get(this.token);
   
    this._GeneralService.getT(token, 'auth/activated-users?token=')
    
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

       

        this.temp = data.data;

      

          this.rows = data.data;

          
        
          this.rowsMobile =  data.data.slice(0, this.pageLmit);
          this.rowsMobileTem = data.data;
          
          
          console.log('this.rowsMobile : ', this.rowsMobile );
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
       
       
        

         // // console.log('get list of service this.rows array', data.ToArray());
         
          // console.log('get all user this.rows', this.rows);
        

      },
      (error: any) => { // console.log('error:', error)

    });
 
   }

   select(row: any): void {
     console.log('select row:', row);


            this.selectedRec.push({ 
                    email: row.email,
                    status: row.email,
                    partner_type: row.partner_type,
                    
                   
               });

               // console.log('  this.selectedRec row:',   this.selectedRec);
   }

   userAction(status: any) : any {
   // this.displayloader = true;
    if (this.selectedRec.length == 0){
        Swal('', 'Select User(s)', 'error');
        return;
    }
    this.statusTrack = status;
    let token = this._localStorageService.get(this.token);
    console.log('userAction token: ', token);
    //let getSelect = new List<any>(this.rows).Where(c=> c.)
  console.log('  this.userAction row:',   this.selectedRec);

      for (let i = 0; i < this.selectedRec.length; i++) {

              let value =  
              {
                    email: this.selectedRec[i].email,
                    status: status   
              };

              
   // this.loadPage =  true;
    this.lblProcess = 'Wait, Action in Progress...';
  

    let url = `auth/authorize-user?token=` + token; 
    
    
    console.log('post url: ', value);
    console.log('post value: ', value);

    
    
    this._GeneralService.post(value, url).subscribe(
      (data: any) => {

        // this.displayloader =  false;
       
        this.statusTrack = '';
        // console.log('gaddToCart data', data);
      let msg =  'Action Completed Successfully!';
        Swal('', msg, 'success');
        this.load();
       // this.btnActionApprove =  'Approve';
       
  
      },
      (error: any) => {
        
        // console.log('error:', error)
     //   this.btnActionApprove =  'Approve';
   
         this.displayloader =  false;
         this.loadPage =  false;

         Swal('', error.error.message, 'error');

      });

     }


   

   }

 



  updateFilter(event) {

    if (this.columnId === 1) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.first_name.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

      // console.log('updateFilter',  this.rows);
     // this.table.offset = 0;
    }

    if (this.columnId === 2) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.phone_number.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

      // console.log('updateFilter',  this.rows);
     // this.table.offset = 0;
    }

    if (this.columnId === 3) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.email.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

      // console.log('updateFilter',  this.rows);
     // this.table.offset = 0;
    }

    if (this.columnId === 4) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.meter_number.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

      // console.log('updateFilter',  this.rows);
     // this.table.offset = 0;
    }
    if (this.columnId === 5) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.status.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

      // console.log('updateFilter',  this.rows);
     // this.table.offset = 0;
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


}