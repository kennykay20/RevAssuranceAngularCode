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
    selector: 'app-assign-role',
    templateUrl: './assign-role.component.html',
    styleUrls: ['./assign-role.component.scss']
})
export class AssignRoleComponent implements OnInit {
 @ViewChild(DatatableComponent) table: DatatableComponent;

//  @ViewChild('dataTable') table: ElementRef;
  
  dataTable: any;

  editing = {};
  //rows: any; // = [];
  //temp = [];
  Roles: any[] = [];


  rows = [];
  columns = [];
  temp = [];

  rowsMobile = [];
  rowsMobileTem = [];
  current_page = 1;




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
  errorOccur = GenModel.errorOccur;
  pageLmit = GenModel.pageLmit;
  searchUserColumns: any;
  ItemsPerPage: any;
  columnId: any;
  statusTrack: any;
  roleInfo: any;

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
   this.loadRoles();
  
  }

  load(): void {
   
    let token = this._localStorageService.get(this.token);
   
    this._GeneralService.getT(token, 'auth/all-users?token=')
    
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

       let onlyActive  = new List<any>(data.data).Where(c => c.status === 'Active').ToArray();
       // console.log('get list temp', onlyActive);
        this.temp = onlyActive; // data.data;

        // // // console.log('get list temp', temp);

          this.rows = onlyActive; // data.data;
          this.rowsMobile = onlyActive.slice(0, this.pageLmit);
          this.rowsMobileTem = onlyActive;
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

   loadRoles(): void {
   
    let token = this._localStorageService.get(this.token);
   
    this._GeneralService.getT(token, 'auth/roles?token=')
    
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

        // // console.log('get roles list', data);
        this.loadPage = false;
        let orderby = new List<any>(data).OrderBy(x => x.name).ToArray();
        // // console.log('get roles orderby', orderby);
        this.Roles = orderby;

      },
      (error: any) => 
      {
        // // console.log('error:', error)
      } 

    );
 
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

   assignRole() : any {
   // this.displayloader = true;
    if (this.selectedRec.length == 0) {
        Swal('', 'Select User(s)', 'error');
        return;
    }

    if (this.roleInfo == undefined) {
      Swal('', `Select User's Role`, 'error');
      return;
  }

    let token = this._localStorageService.get(this.token);
    // console.log('userAction token: ', token);
    //let getSelect = new List<any>(this.rows).Where(c=> c.)
  // console.log('  this.userAction row:',   this.selectedRec);

      for (let i = 0; i < this.selectedRec.length; i++) {

              let value =  
              {
                    email: this.selectedRec[i].email,
                    role: this.roleInfo.name   
              };

              this.displayloader = true;   
   // this.loadPage =  true;
  //  this.lblProcess = 'Wait, Action in Progress...';
  

    let url = `auth/assign-role?token=` + token; 
    
    
    // console.log('post url: ', value);
    // console.log('post value: ', value);

    
    
    this._GeneralService.post(value, url).subscribe(
      (data: any) => {

        // console.log('error res: ', data);

        this.displayloader =  false;
    
        Swal('', data.message, 'success');
        
        
        this.load();
      
       
  
      },
      (error: any) => {
        
       // console.log('error assing:', error);
     //   this.btnActionApprove =  'Approve';
   
         this.displayloader =  false;
         //this.loadPage =  false;
        if ( error.error.message !== undefined){
          Swal('', error.error.message, 'error');
        }
       else{
        Swal('', this.errorOccur, 'error');
       }

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
      this.rowsMobile = temp;
      // // console.log('updateFilter',  this.rows);
      this.table.offset = 0;
    }

    if (this.columnId === 2) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.phone_number.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      this.rowsMobile = temp;
      // // console.log('updateFilter',  this.rows);
      this.table.offset = 0;
    }

    if (this.columnId === 3) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.email.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      this.rowsMobile = temp;
      // // console.log('updateFilter',  this.rows);
      this.table.offset = 0;
    }

    if (this.columnId === 4) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.meter_number.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      this.rowsMobile = temp;
      // // console.log('updateFilter',  this.rows);
      this.table.offset = 0;
    }
    if (this.columnId === 5) {
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