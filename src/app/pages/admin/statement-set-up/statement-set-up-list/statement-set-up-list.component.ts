


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
import { StatementSetUpDetailsComponent } from '../statement-set-up-details/statement-set-up-details.component';

declare var $;

@Component({
  selector: 'app-statement-set-up-list',
    templateUrl: './statement-set-up-list.component.html',
    styleUrls: ['./statement-set-up-list.component.scss']
})
export class StatementSetUpListComponent implements OnInit {
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
  //props
  acStmtHeader : string;
  acStmtBody : string;
  acStmtFooter : string;
  rowPage : number;
  maxCharacterBreak : number;
  table_id : number;
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
  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public _GeneralService: GeneralService,private _localStorageService: LocalStorageService) 
    {
    this.settings = this.appSettings.settings; 
  }



  ngOnInit() 
  {
      this.searchUserColumns = this.searchUserColumns1;
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;

      this.load();

      // this.onSubmit();
   
  }
  onSubmit(): any {

    let url = 'BankServiceSetup/login';
 
    let  values =
       {
         "userId": 0,
         "fullName": "string",
         "loginId": "string",
         "isFirstLogin": true,
         "isSupervisor": "string",
         "loggedOn": true,
         "roleId": 0,
         "deptId": 0,
         "branchNo": 0,
         "passwordExpiryDate": "2020-05-08T18:55:32.859Z",
         "status": "string",
         "branchName": "string",
         "roleName": "string",
         "emailAddress": "string",
         "mobileNo": "string",
         "enforcePswdChange": "string",
         "createdBy": 0,
         "dateCreated": "2020-05-08T18:55:32.859Z",
         "password": "string",
         "loginstatus": 0,
         "lockcount": 0,
         "logincount": 0,
         "useCbsAuth": "string",
         "canPrintStatement": "string",
         "canPrintBidSecurity": "string",
         "canPrintRefLetter": "string",
         "canPrintBond": "string",
         "canPrintTradeRef": "string",
         "canPrintOD": "string",
         "canReverse": "string",
         "dataSources": "string",
         "authUser": "string",
         "canApprove": "string",
         "rsmId": 0
       }
     
   console.log('onSubmit values: ', values);
     
     
     this.displayloader = true;
    
 
       this._GeneralService.homePage(values, url)      
       // .retryWhen((err) => {
     
       //   return err.scan((retryCount) =>  {
 
       //     retryCount  += 1;
       //     if (retryCount < this.retryService) {
 
       //         this.btnlogtxt = 'Authenticating...'; 
 
       //         return retryCount;
       //     }
       //     else 
       //     {
       //       Swal('', 'Problem with your Login. Kindly contact System Administrator', 'error');
           
       //        throw(err);
       //     }
       //   }, 0).delay(this.retryDelayServiceInterval); 
       // })
     .subscribe((data: any) => {
 
             
                
                
         },
         (error: any) => {
           
          
      
 
 
         
 
         });
     
   }
 
   load(): void {
    
     let url = 'Statement/GetAll';
     let val = 
     {
       "aId": 0,
       "userName": "string",
       "password": "string",
       "dateCreated": "2020-05-12T12:08:01.854Z"
     }
    
     this._GeneralService.homePage(val, url)
     
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
       (data: any) => {
         this.loadPage = false;
         this.temp = data;
         this.rows = data;
        console.log(data);
         this.acStmtBody = this.rows[0].acStmtBody;
         this.acStmtFooter= this.rows[0].acStmtFooter;
         this.acStmtHeader= this.rows[0].acStmtHeader;
         this.rowPage = this.rows[0].rowPage;
         this.maxCharacterBreak = this.rows[0].maxCharacterBreak;
        this.table_id = this.rows[0].id;
       },
       (error: any) => { 
 
     });
  
    }
 
    
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

    update(){

      let url = 'Statement/Update';
      let obj = {
        Id : this.table_id,
        acStmtBody : this.acStmtBody,
        acStmtFooter : this.acStmtFooter,
        acStmtHeader : this.acStmtHeader,
        rowPage : this.rowPage,
        maxCharacterBreak : this.maxCharacterBreak
      }
 
      //make call to update api and pass obj
      this._GeneralService.homePage(obj, url)
     .subscribe(
        (data: any) => {
         
         console.log(data);
        
        },
        (error: any) => { 
  
      });
   
    }
 }


