

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
    selector: 'app-unapprove-user',
        templateUrl: './unapprove-user.component.html',
        styleUrls: ['./unapprove-user.component.scss']
  })
  export class UnapproveUserComponent implements OnInit {

   // @ViewChild('dataTable') table: ElementRef;
   @ViewChild(DatatableComponent) table: DatatableComponent;
    dataTable: any;
    rowsMobile = [];
    rowsMobileTem = [];
    current_page = 1;
    editing = {};
    rows: any; // = [];
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
    partnerType = ['Partner', 'Non-partner'];
    partnerTypeSelected: string;
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
    columnId:any;
    pageLmit = GenModel.pageLmit;
  searchUserColumns: any;
  ItemsPerPage: any;
  
    constructor(public appSettings: AppSettings, public dialog: MatDialog,
      public _GeneralService: GeneralService,
                
                private _localStorageService: LocalStorageService) {
      this.settings = this.appSettings.settings; 
    }
  
  
  
    ngOnInit() 
    {
     // this.searchUserColumns = this._GeneralService.searchUserColumns;
   //   this.ItemsPerPage = this._GeneralService.ItemsPerPage;
     this.load();
    
    }
  
    load(): void {
     
      let token = this._localStorageService.get(this.token);
      
      this._GeneralService.getT(token, 'auth/unauthorized-users?token=')
      
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
          this.changePage(this.current_page);

        },
        (error: any) => 
        {
         

        }
      );
   
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
     
     if (this.partnerTypeSelected  === undefined){
      Swal('', 'Kindly Select Partner Type', 'error');
      return;
     }

     let token = this._localStorageService.get(this.token);
    
   
       for (let i = 0; i < this.selectedRec.length; i++) {
 
               let value =  
               {
                     email: this.selectedRec[i].email,
                     status: status,
                     partner_type: this.partnerTypeSelected  
               };
 
              this.loadPage  = true;   

     let url = `auth/authorize-user?token=` + token; 
     
    

     
     this._GeneralService.post(value, url).subscribe(
       (data: any) => {

     
         // this.displayloader =  false;
         this.loadPage  = false; 
         this.selectedRec = [];  
       //  this.statusTrack = '';
         //
       let msg =  'Action Completed Successfully!';
         Swal('', data.message, 'success');
         this.load();
        // this.btnActionApprove =  'Approve';
        
   
       },
       (error: any) => {
         

      //   this.btnActionApprove =  'Approve';
    
          this.displayloader =  false;
          this.loadPage =  false;
 
          Swal('', error.error.message, 'error');
 
       });
 
      }
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
  
    // ngOnChanges ()  {
      
    //   this.dataTable =  $(this.table.nativeElement);
    //   this.dataTable.dataTable();
    //   this.settings.loadingSpinner = false; 
    // }

    updateFilter(event) {

      if (this.columnId === 1) {
        const val = event.target.value.toLowerCase();
      
        const temp = this.temp.filter(function(d) {
          return d.first_name.toLowerCase().indexOf(val) !== -1 || !val;
        });
  
        this.rows = temp;
        this.rowsMobile = temp;
       
        this.table.offset = 0;
      }
  
      if (this.columnId === 2) {
        const val = event.target.value.toLowerCase();
      
        const temp = this.temp.filter(function(d) {
          return d.phone_number.toLowerCase().indexOf(val) !== -1 || !val;
        });
  
        this.rows = temp;
        this.rowsMobile = temp;
        
        this.table.offset = 0;
      }
  
      if (this.columnId === 3) {
        const val = event.target.value.toLowerCase();
      
        const temp = this.temp.filter(function(d) {
          return d.email.toLowerCase().indexOf(val) !== -1 || !val;
        });
  
        this.rows = temp;
        this.rowsMobile = temp;
       
        this.table.offset = 0;
      }
  
      if (this.columnId === 4) {
        const val = event.target.value.toLowerCase();
      
        const temp = this.temp.filter(function(d) {
          return d.meter_number.toLowerCase().indexOf(val) !== -1 || !val;
        });
  
        this.rows = temp;
        this.rowsMobile = temp;
      
        this.table.offset = 0;
      }
      if (this.columnId === 5) {
        const val = event.target.value.toLowerCase();
      
        const temp = this.temp.filter(function(d) {
          return d.status.toLowerCase().indexOf(val) !== -1 || !val;
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
 
 
  
  
    }
  