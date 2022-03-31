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

declare var $;



@Component({
  selector: 'app-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  
  rowsMobile = [];
  rowsMobileTem = [];
  current_page = 1;

  pageLmit = GenModel.pageLmit;

  dataTable: any;

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

  errorOccur = GenModel.errorOccur;
  recordDetails = GenModel.recordDetails;

  searchUserColumns1 = [
    {
      id: 1,
      columnName: 'Role Name'

    },
    {
      id: 2,
      columnName: 'Date Created'

    }

];

  constructor(public appSettings: AppSettings, 
              public dialog: MatDialog,
              public _GeneralService: GeneralService,
              public router: Router,
              
              private _localStorageService: LocalStorageService) {
    this.settings = this.appSettings.settings; 
  }



  ngOnInit() 
  {
   this.load();
  
  }

  load(): void {
   
    let token = this._localStorageService.get(this.token);
   
    // this._GeneralService.getT(token, 'auth/roles?token=')
    
    // .retryWhen((err) => {
    
    //   return err.scan((retryCount) =>  {

    //     retryCount  += 1;
    //     if (retryCount < this.retryService) {

    //         this.retryMessage = 'Retrying...Attempt'; // #'  + retryCount;

    //         return retryCount;
    //     }
    //     else 
    //     {
    //       this.retryMessage = this.errorOccur;
    //        throw(err);
    //     }
    //   }, 0).delay(this.retryDelayServiceInterval); 
    // }).subscribe(
    //   (data: any) => {

    //   // console.log('get roles list', data);
    //     this.loadPage = false;
    //     let orderby = new List<any>(data).OrderBy(x => x.name).ToArray();
    //     this.loadPage = false;
    //     this.temp = orderby;
    //     this.rows = orderby;

    //     this.rowsMobile = orderby.slice(0, this.pageLmit);
    //     this.rowsMobileTem = orderby;
    //     this.changePage(this.current_page);

    //   },
    //   (error: any) => 
    //   {
    //     // console.log('error:', error)
    //   } 

    // );
 
   }



   select(row: any) {
    // console.log('select row:', row);


            this.selectedRec.push({ 
                    email: row.email,
                    status: row.email,
                    partner_type: row.partner_type,
                    
                   
               });

             //  console.log('  this.selectedRec row:',   this.selectedRec);
   }

   addRole(){

    this.router.navigate(['./Roles/addrole']);
 
   
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

  //  console.log('post url: ', url);
    
    this._GeneralService.post(value, url).subscribe(
      (data: any) => {

         this.displayloader =  false;
       

     //   console.log('gaddToCart data', data);

        Swal('', data.message, 'success');

        this.btnActionApprove =  'Approve';
       
  
      },
      (error: any) => {
        
       // console.log('error:', error);

        this.btnActionApprove =  'Approve';
   
         this.displayloader =  false;
         this.loadPage =  false;

         Swal('', error.error.message, 'error');

      });

     }


   

   }

   updateFilter(event) {

   
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      this.rowsMobile = temp;
      this.table.offset = 0;
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




