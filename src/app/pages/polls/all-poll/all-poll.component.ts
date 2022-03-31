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
import { Router, ActivatedRoute } from '@angular/router';
declare var $;

@Component({
    selector: 'app-all-poll',
    templateUrl: './all-poll.component.html',
    styleUrls: ['./all-poll.component.scss']
})
export class AllPollComponent implements OnInit {
 @ViewChild(DatatableComponent) table: DatatableComponent;

//  @ViewChild('dataTable') table: ElementRef;
  
  dataTable: any;

  editing = {};
  //rows: any; // = [];
  //temp = [];

  rowsMobile = [];
  rowsMobileTem = [];
  current_page = 1;

  rows = [];
  columns = [];
  temp = [];

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
  recordDetails = GenModel.recordDetails;
  errorOccur = GenModel.errorOccur;
  redirectUrl = GenModel.redirectUrl;
  searchUserColumns: any;
  //ItemsPerPage: any;
  columnId: any;
  statusTrack: any;

  searchUserColumns1 = [
    {
      id: 1,
      columnName: 'Poll Question'

    },
    {
      id: 2,
      columnName: 'Expiry Date'

    },
    {
      id: 3,
      columnName: 'Status'

    }

];


ItemsPerPage = [
  {
    itemPerPage: 5
  },
  {
    itemPerPage: 10
  },
  {
    itemPerPage: 20
  },
  {
    itemPerPage: 50
  },
  {
    itemPerPage: 100
  },
  {
    itemPerPage: 200
  },
  {
    itemPerPage: 500
  },
];

  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public _GeneralService: GeneralService, public router: Router,
              
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
   
    this._GeneralService.getT(token, 'auth/all-polls?token=')
    
    .retryWhen((err) => {
    
      return err.scan((retryCount) =>  {

        retryCount  += 1;
        if (retryCount < this.retryService) {

            this.retryMessage = 'Retrying...Attempt'; // #'  + retryCount;

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

     

        this.loadPage = false;
        this.temp = data.data;
        this.rows = data.data;
        this.rowsMobile =  data.data.slice(0, this.pageLmit);
this.rowsMobileTem = data.data;
this.changePage(this.current_page);
      },
      (error: any) => { 
       

        swal('Error', this.errorOccur, 'error');

    });
 
   }


   Edit(row: any): void {
    this._localStorageService.set(this.recordDetails, row); 

    this._localStorageService.set(this.redirectUrl, null); 
    this._localStorageService.set(this.redirectUrl, './pol/AllPoll'); 
    this.router.navigate(['./pol/editPoll']);
   }

   userAction(status: any) : any{
   // this.displayloader = true;

   

    if(this.selectedRec.length == 0){
      return  Swal('', 'Select User(s)', 'error');
    }
    this.statusTrack = status;
    let token = this._localStorageService.get(this.token);

      for (let i = 0; i < this.selectedRec.length; i++) {

              let value =  
              {
                    email: this.selectedRec[i].email,
                    status: status   
              };

              
   // this.loadPage =  true;
    this.lblProcess = 'Wait, Action in Progress...';
  

    let url = `auth/authorize-user?token=` + token; 

    
    this._GeneralService.post(value, url).subscribe(
      (data: any) => {

        // this.displayloader =  false;
       
        this.statusTrack = '';
        
      let msg =  'Action Completed Successfully!';
        Swal('', msg, 'success');
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




  updateFilter(event) {

    if (this.columnId === 1) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.question.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      this.rowsMobile = temp;
     
      this.table.offset = 0;
    }

    if (this.columnId === 2) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.expiring_date.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      this.rowsMobile = temp;
     
      this.table.offset = 0;
    }

    if (this.columnId === 3) {
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