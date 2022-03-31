import { Router, ActivatedRoute } from '@angular/router';

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
import { RoleDetailsComponent } from '../role-details/role-details.component';
import { RoleLimitComponent } from '../role-limit/role-limit.component';

declare var $;

@Component({
  selector: 'app-role-list',
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {
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


   roleAssign: any;
   menuId: any;


origMobile = [];
  constructor(public appSettings: AppSettings, 
              public dialog: MatDialog,
              public _GeneralService: GeneralService,
              private _localStorageService: LocalStorageService,
              public router: Router, public route: ActivatedRoute) 
    {
      this.settings = this.appSettings.settings; 

      let routMenuId = this.route.snapshot.params.mid;
      console.log('**data param4', routMenuId);
      this.menuId = this._GeneralService.menuId(routMenuId);
      console.log('** this.menuId',  this.menuId);
  }


  ngOnInit() 
  {
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;
      let getUserDetails =  this._GeneralService.getUserDetails();
      // console.log('getUserDetails token', getUserDetails)
      this.load(getUserDetails);

  }



  load(param: any): void {

    this.loadPage = true;

    let val = 
    {
      pdtCurrentDate: param.bankingDate,
      psBranchNo: param.branchNo,
      pnDeptId: param.deptId,
      pnGlobalView: 'N',
      serviceId: 0,
      menuId: this.menuId,
      roleId: param.roleId
    }

    let url = 'Roles/GetAll';

    this._GeneralService.post(val, url)
    
    .retryWhen((err) => {
    
      return err.scan((retryCount) =>  {

        retryCount  += 1;
        if (retryCount < this.retryService) {

            this.retryMessage = this.RetryAttmMsg; 

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

       console.log('roles data', data);
        this.loadPage = false;
        this.temp = data._response;
        this.rows = data._response;
        this.roleAssign = data.roleAssign
      },
      (error: any) => { 

    });
 
   }



  assignRole(row)
  {
     localStorage.setItem('RoleId', row.roleId);
     this.router.navigate(['./adm/role-ass/mid=3433']);
  }

  assignDashboard(row) {
    localStorage.setItem('RoleId', row.roleId);
    this.router.navigate(['./adm/dashboard/mid=3433']);
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
      let getUserDetails =  this._GeneralService.getUserDetails();
        this.load(getUserDetails);
       
       
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

    let tem1 = this.temp;

    console.log('updateFilter tem1:', tem1);

    if (value === 1) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.first_name.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
     
     // this.table.offset = 0;
    }

    if (value === 2) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.phone_number.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      
    
     // this.table.offset = 0;
    }

    if (value === 3) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.roleName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
 

      
     // this.table.offset = 0;
    }

  
    if (value === 5) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.creditLimit.indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
     // this.table.offset = 0;
    }
    if (value === 6) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.debitLimit.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
     // this.table.offset = 0;
    }

    if (value === 7) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.dateCreated.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
     // this.table.offset = 0;
    }
    if (value === 8) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.dateCreated.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
     // this.table.offset = 0;
    }
    if (value === 9) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.dateCreated.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
     // this.table.offset = 0;
    }
    if (value === 10) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.status.toLowerCase().indexOf(val) !== -1 || !val;
      });

      console.log('temp111 status', temp);

      this.rows = temp;
  
     // this.table.offset = 0;
    }
    
    if(this.rows.length === 0){

      swal('', 'No record Found', 'warning');

      this.rows = tem1;
    }
    

  }

  action(actionName: any, record: any)
  {
    
    this.loadPage = true;
     setTimeout(() => {
      this.loadPage = false;
      this.openDialog(actionName, record);
    }, 100);
  }

  openDialog(action: any, record: any): void
   {

    let dialogRef = this.dialog.open(RoleDetailsComponent, {

      width: '1000px',
      height: '560px',
      // hasBackdrop: true,
      disableClose: true,
      // autoFocus: true,
      data: { actionName: action, record:  record},
      
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('role list refresh result', result)
      if(result == 'Y'){
        let getUserDetails =  this._GeneralService.getUserDetails();
        this.load(getUserDetails);
      }
    });
  }

  roleLimit(action: any, record: any): void
  {


   let dialogRef = this.dialog.open(RoleLimitComponent, {

     // width: '3500px',
     // height: '800px',
     // hasBackdrop: true,
     disableClose: true,
     // autoFocus: true,
     data: { actionName: action, record:  record},
     
   });

   dialogRef.afterClosed().subscribe(result => {
     console.log('role list refresh result', result)
     if(result == 'Y'){
       let getUserDetails =  this._GeneralService.getUserDetails();
       this.load(getUserDetails);
     }
   });
 }


 changePage(page)
 {
     let btn_next = document.getElementById("btn_next");
     let btn_prev = document.getElementById("btn_prev");
   // let listing_table = document.getElementById("listingTable");
     let page_span = document.getElementById("page");
 
     // Validate page
     if (page < 1) page = 1;

     //if (page > this.numPages()) page = this.numPages();

     let tem = []; 

     for (let i = ( page - 1 ) * this.pageLmit; i < (page * this.pageLmit) && i < this.temp.length; i++) 
     {
         tem.push(this.temp[i]);
     }

     this.rows = tem;

     //page_span.innerHTML = page + "/" + this.numPages();

 }

 public onOptionsSelected(event) 
  {
   // console.log('onOptionsSelected', event.target.value);
    
    
    this.pageLmit = event.target.value;
    if(event.target.value !== "Item Per Page")
    {
      console.log('pageLimit: ', this.pageLmit);
  
      this.rows =  this.temp.slice(0, this.pageLmit);
      
      console.log('allRow: ', this.rows);
    }


    //this.changePage(this.current_page);    
 }

}
