import { Router, ActivatedRoute } from '@angular/router';
import { BankservicesetupDetailsComponent } from './../bankservicesetup-details/bankservicesetup-details.component';

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


declare var $;



@Component({
  selector: 'app-bankservicesetup-list',
   templateUrl: './bankservicesetup-list.component.html',
  styleUrls: ['./bankservicesetup-list.component.scss']
})
export class BankservicesetupListComponent implements OnInit {
 //  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('dataTable') table: ElementRef;
  
  dataTable: any;

  editing = {};
  //rows: any; // = [];
  //temp = [];


  roleAssign: any;
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
menuId: any;
  constructor(public appSettings: AppSettings, public dialog: MatDialog,
              public _GeneralService: GeneralService,
              private _localStorageService: LocalStorageService,
              public router: ActivatedRoute,) 
    {
           this.settings = this.appSettings.settings; 

           let routMenuId = this.router.snapshot.params.mid;
           console.log('**data param4', routMenuId);
           this.menuId = this._GeneralService.menuId(routMenuId);
           console.log('** this.menuId',  this.menuId);

  
  }

  ngOnInit() 
  {
      this.searchUserColumns = this.searchUserColumns1;
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;

      let getUserDetails =  this._GeneralService.getUserDetails();
      // console.log('getUserDetails token', getUserDetails)
      this.load(getUserDetails);
      // this.onSubmit();
   
  }

   load(param: any): void {

    this.loadPage = true;

    let url = 'BankServiceSetUp/GetAll';

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

    console.log('val get All', val);

  this._GeneralService.post(val, url)
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
    (data: any) => 
    {
     

      this.loadPage = false;
      this.temp = data._response;
      this.rows = data._response;
      this.loadPage = false;
      this.roleAssign = data.roleAssign
      console.log('get All bank serv', this.roleAssign);
      
    },
    (error: any) => 
    {
    
      Swal('', error.message, 'error');

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
      let getUserDetails =  this._GeneralService.getUserDetails();
        this.load(getUserDetails);
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
    
 
    if (value === 1) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.connectionName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
     
     // this.table.offset = 0;
    }

    if (value === 2) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.server.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      
    
     // this.table.offset = 0;
    }

    if (value === 3) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.dataBaseName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
 

      
     // this.table.offset = 0;
    }

    if (value === 4) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.dateCreated.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    

      
     // this.table.offset = 0;
    }
    if (value === 5) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.status.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    

     
     
    }

  }


  action(actionName: any, record: any)
  {
 
    this.loadPage = true;
     setTimeout(() => {
      this.loadPage = false;
      
      
        this.View(actionName, record, '')
      
      
    }, 100);
  }

  View(action: any, record: any, createdBy: any): void
   {

    let dialogRef = this.dialog.open(BankservicesetupDetailsComponent, {

      // width: '3500px',
      height: '560px',
      // hasBackdrop: true,
      disableClose: true,
      // autoFocus: true,
      data: { actionName: action, record:  record, createdBy: createdBy},
      
    });

    dialogRef.afterClosed().subscribe(result => {
      
      console.log('reload bank service result', result);

      if(result === 'Y'){
        let getUserDetails =  this._GeneralService.getUserDetails();
        this.load(getUserDetails);
      }
     
    });
  }


  
  

}