

  //////////////////////////////////

  import { ActivatedRoute } from '@angular/router';

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
import { BroadcastMsgDetailsComponent } from '../broadcast-msg-details/broadcast-msg-details.component';
import { UserDetails } from '../../../../model/userDetails';
import { BroadCastMessage } from '../../../../model/broadcastMessage';

declare var $;

@Component({
  selector: 'app-broadcast-msg-list',
    templateUrl: './broadcast-msg-list.component.html',
    styleUrls: ['./broadcast-msg-list.component.scss']
})
export class BroadcastMsgListComponent implements OnInit {
 //  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('dataTable') table: ElementRef;
  
  dataTable: any;

  editing = {};
  hour = [];
  minutes = [];
  //rows: any; // = [];
  //temp = [];



  rows: BroadCastMessage [];
  columns = [];
  temp: BroadCastMessage[];

  



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
      columnName: 'DEPARTMENT NAME'

    },
    {
      id: 2,
      columnName: 'DEPARTMENT CODE'

    },
    {
      id: 3,
      columnName: 'STATUS'

    }
];

roleAssign: any;
menuId: any;
origMobile = [];
getUserDetails: UserDetails;

  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public _GeneralService: GeneralService,
    private _localStorageService: LocalStorageService,
    public route: ActivatedRoute,) 
    {
    this.settings = this.appSettings.settings; 

      let routMenuId = this.route.snapshot.params.mid;
      
      this.menuId = this._GeneralService.menuId(routMenuId);
     
  }



  ngOnInit() 
  {
      this.searchUserColumns = this.searchUserColumns1;
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;
      this.getUserDetails =  this._GeneralService.getUserDetails();
      this.load(this.getUserDetails);
  }

  load(param: any): void {
   
    let url = 'BroadCastMessage/GetAll';
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
    })
    
    .subscribe(
      (data: any) => {

        console.log('broadcast data', data);
        this.loadPage = false;
        this.temp = data._response;
        this.rows = data._response;
        this.roleAssign = data.roleAssign
        
      },
      (error: any) => { 

    });

   }



  updateFilter(event, value: any) {
    
    console.log('updateFilter:', value);

    if (value === 'SUBJECT') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.subject.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
     
     // this.table.offset = 0;
    }

    if (value === 'DEPT') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.deptName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      
    
     // this.table.offset = 0;
    }

    if (value === 'DATE') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.dateCreated.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

     // this.table.offset = 0;
    }

    if (value === 'DUETIME') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.dateCreated.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

     // this.table.offset = 0;
    }

    if (value === 'STATUS') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.status.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

     // this.table.offset = 0;
    }

  }

  action(actionName: any, record: any){
    
    this.loadPage = true;
     setTimeout(() => {
      this.loadPage = false;
      this.openDialog(actionName, record);
    }, 100);
  }

  callHours(): void
  {
    this.hour.length = 0;
    this.minutes.length = 0;
    for(let i = 1; i < 13; i++){
      this.hour.push(i);
     }

     console.log('hours ', this.hour);
     for(let i = 1; i < 61; i++){
       if(i.toString().length == 1){
         this.minutes.push(':0'+i);
       }else
       {
         this.minutes.push(':'+i);
       }
      
      }
  }
  openDialog(action: any, record: any): void
   {

    this.callHours();
    let dialogRef = this.dialog.open(BroadcastMsgDetailsComponent, {

      width: '1500px',
      height: '620px',
      // hasBackdrop: true,
       disableClose: true,
      // autoFocus: true,
      data: { actionName: action, record:  record, hours: this.hour, minutes: this.minutes},
      
    });

    dialogRef.afterClosed().subscribe(result => {

      console.log('dept Close result', result);
      if(result == 'Y')
      {

        this.load(this.getUserDetails);
      }
    });
  }

}



