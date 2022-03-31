
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BankservicesetupDetailsComponent } from './../../../admin/bankServiceSetUp/bankservicesetup-details/bankservicesetup-details.component';
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
import { ActivatedRoute } from '@angular/router';
import { admService } from '../../../../model/admService';
import { BatchControl } from '../../../../model/BatchControl';
import { UserDetails } from '../../../../model/userDetails';
import * as XLSX from 'xlsx';
import { ApproveBatchDetailsComponent } from '../approve-batch-details/approve-batch-details.component';
import { PostTransResponse } from '../../../../model/PostTransResponse';

declare var $;



@Component({
  selector: 'app-approve-batch',
  templateUrl: './approve-batch.component.html',
  styleUrls: ['./approve-batch.component.scss']
})
export class ApproveBatchComponent implements OnInit {

  @ViewChild('dataTable') table: ElementRef;
  
  dataTable: any;

  editing = {};
  //rows: any; // = [];
  //temp = [];



  rows:BatchControl [];
  columns = [];
  temp: BatchControl[];
  current_page = 1;


  selectAllText: any;
  actionLoaderDismiss = false;
  actionLoaderUpdate = false;
  tabVlues = 1;
  selectedAll  = false;

  count = 20;
  selected = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  dialogRef: any;
  public settings: Settings;
  dataRes: any;
  token = GenModel.tokenName;
  selectTransMsg = GenModel.selectTransMsg
  recordNotFoundMsg = GenModel.recordNotFoundMsg
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
  btnConfirm = GenModel.btnConfirm;
  searchUserColumns: any;
  ItemsPerPage: any;
  columnId: any 
  statusTrack: any;
  errorOccur = GenModel.errorOccur;

  selectedAllTrans =  false;
  
  unAuthorized =  false;


tab1 = '';
tab2 = '';



coinwallet: string[] = ['wallet1','wallet2'];
selectedwallet = this.coinwallet[0];


origMobile = [];

step = 'brown';

apiIsDown = GenModel.apiIsDown;

 selectedCalss = 'selected nav-item cursorPointer';
 selectedCalss2 = 'selected nav-item cursorPointer';
 selectedCalss3 = 'selected nav-item cursorPointer';

 serviceId = 12;

 chargeSetup: any;
assignRole: any
menuId: any
admService: admService;
loderTimer = GenModel.LoderTimer;
userDetails: UserDetails;

  alertPostTrans = false;
  viewTransDetails = false;
  postTransResponse: PostTransResponse;

  postTransResponseList: PostTransResponse[];
  pageListVal = '';

  constructor(public appSettings: AppSettings, public dialog: MatDialog,
              public _GeneralService: GeneralService,
              private _localStorageService: LocalStorageService,
              private route: ActivatedRoute) 
    {
       this.settings = this.appSettings.settings; 

       let queryString = this.route.snapshot.params.mid;
       this.menuId = _GeneralService.menuId(queryString);
       //   console.log('**data param4', param4);
    }

  ngOnInit() 
  {
     //console.log()
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;
      this.userDetails =  this._GeneralService.getUserDetails();

      this.load(this.userDetails);

      this.swapTab(1);
  }

   load(param: any): void {

    console.log('load param', param);

    this.loadPage = true;

    let track = 0;
    let url = 'ApproveBatch/GetAll';


      let val = 
        {
          pdtCurrentDate: param.bankingDate,
          psBranchNo: param.branchNo,
          pnDeptId: param.deptId,
          pnGlobalView: 'N', // hard code will later get this from role Assing
          serviceId: this.serviceId,
          roleId: param.roleId,
          menuId:  this.menuId
        }

        console.log('token param load', val);

  this._GeneralService.post(val, url)
  // .retryWhen((err) => {

  //   return err.scan((retryCount) =>  {

  //     retryCount  += 1;
  //     track = retryCount;
  //     if (retryCount < this.retryService) {

  //         this.retryMessage = this.RetryAttmMsg; 

  //         return retryCount;
  //     }
  //     else 
  //     {
  //       this.retryMessage = this.errorOccur;
  //        throw(err);
  //     }
  //   }, 0).delay(this.retryDelayServiceInterval); 
  // })
  
  .subscribe(
    (data: any) => 
    {
      console.log('data batch control: ', data);
      this.loadPage = false;
      this.temp = data._response;
      this.rows = data._response;
      this.admService = data.admService;
      
      this.chargeSetup = data.charge;
      this.loadPage = false;

      this.assignRole = data.roleAssign;

      
      if(data._response.length > 0)
      {
        console.log('data._response.length: ', data._response.length);
        this.rows  =  data._response.slice(0, this.pageLmit);
        this.changePage(this.current_page);
      } 
    },
    (error: any) => 
    {

      console.log('error loading: ', error);

      if(track === this.retryService)
      {
        Swal('', this.apiIsDown, 'error');
      }
      else
      {
        Swal('', this.errorOccur, 'error');

      }
  });
   }

   inCompleteBatch(param: any): void {

    console.log('load param', param);

    this.loadPage = true;

    let track = 0;
    let url = 'ApproveBatch/GetAllIncomplete';


      let val = 
        {
          pdtCurrentDate: param.bankingDate,
          psBranchNo: param.branchNo,
          pnDeptId: param.deptId,
          pnGlobalView: 'N', // hard code will later get this from role Assing
          serviceId: this.serviceId,
          roleId: param.roleId,
          menuId:  this.menuId
        }

        console.log('token param load', val);

  this._GeneralService.post(val, url)
  .retryWhen((err) => {

    return err.scan((retryCount) =>  {

      retryCount  += 1;
      track = retryCount;
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
  }) .subscribe(
    (data: any) => 
    {
      console.log('data batch control inCompleteBatch: ', data);
      this.loadPage = false;
      if(data._response.length > 0)
      {
        this.temp = data._response;
        this.rows = data._response;
        this.rows  =  data._response; //slice(0, this.pageLmit);
       //  this.changePage(this.current_page);
        console.log('inCompleteBatch this.rows: ', this.rows);
      } 
    },
    (error: any) => 
    {
      this.loadPage = false;
      console.log('error loading: ', error);

      
    });
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
  
      let numPage = this.numPages();
      console.log("numPage ", numPage);
      // Validate page
      if (page < 1) page = 1;

      if (page > numPage) page = numPage;

      let tem = []; 

      for (let i = ( page - 1 ) * this.pageLmit; i < (page * this.pageLmit) && i < this.temp.length; i++) 
      {
          tem.push(this.temp[i]);
      }

      this.rows = tem;

      console.log("this.rows ", this.rows);
      console.log("this.page ", page);

      this.pageListVal = page + "/" + numPage;

  }

  numPages()
  {
      return Math.ceil(this.temp.length / this.pageLmit);
  }

  onload = function() {
    this.changePage(1);
  };

  select(row)
  {
        console.log('selected row', row);

        let valRe = new List<any>(this.rows).FirstOrDefault(c=> c.itbid === row.itbId);

        if (row.serviceStatus === "Unauthorized") {
          swal('','This request has already been Processed', 'error')
          return;
        }

        const objIndex = this.selectedRec.findIndex(obj => obj.itbId === row.itbId);

        if (objIndex > -1) 
        {
          this.selectedRec.splice(objIndex, 1);
        }
        else
        {
          this.selectedRec.push({ 
            itbId: row.itbId,
            acctName: row.acctName,
            acctNo: row.acctNo,
            acctType: row.acctType,
            branchName: row.branchName,
            ccyCode: row.ccyCode,
            chgAcctNo: row.chgAcctNo,
            datecreated: row.datecreated,
            recordDate: row.recordDate,
            referenceNo: row.referenceNo,
            select: row.select,
            serialNo: row.serialNo,
            serviceId: row.serviceId,
            serviceStatus: row.serviceStatus,
            transactionDate: row.transactionDate,
            userId: row.userId,
            userName: row.userName,

          });
        }

        console.log('selected this.selectedRec', this.selectedRec);
  }

  selectAll1() {


    let selonlyLoadedStatus = new List<any>(this.rows).Where(c=> c.serviceStatus != 'Unauthorized').ToArray();
    
    console.log('selonlyLoadedStatus: ', selonlyLoadedStatus);

    let seletAuth = new List<any>(this.rows).Where(c=> c.serviceStatus === 'Unauthorized').ToArray();

    console.log('selonly Auth: ', seletAuth);

    for (let i = 0; i < selonlyLoadedStatus.length; i++) {

          selonlyLoadedStatus[i].select = this.selectedAllTrans;
          
          this.rows[i].select =  this.selectedAllTrans;

          const objIndex = this.selectedRec.findIndex(obj => obj.itbId === selonlyLoadedStatus[i].itbId);

          if (objIndex > -1) 
          {
            this.selectedRec.splice(objIndex, 1);
          }
          else
          {
            this.selectedRec.push({ 
              itbId:  selonlyLoadedStatus[i].itbId,
              acctName: selonlyLoadedStatus[i].acctName,
              acctNo: selonlyLoadedStatus[i].acctNo,
              acctType: selonlyLoadedStatus[i].acctType,
              branchName: selonlyLoadedStatus[i].branchName,
              ccyCode: selonlyLoadedStatus[i].ccyCode,
              chgAcctNo: selonlyLoadedStatus[i].chgAcctNo,
              datecreated: selonlyLoadedStatus[i].datecreated,
              recordDate: selonlyLoadedStatus[i].recordDate,
              referenceNo: selonlyLoadedStatus[i].referenceNo,
              select: selonlyLoadedStatus[i].select,
              serialNo: selonlyLoadedStatus[i].serialNo,
              serviceId: selonlyLoadedStatus[i].serviceId,
              serviceStatus: selonlyLoadedStatus[i].serviceStatus,
              transactionDate: selonlyLoadedStatus[i].transactionDate,
              userId: selonlyLoadedStatus[i].userId,
              userName: selonlyLoadedStatus[i].userName,
  
            });
          }

        }

        console.log('selonlyLoadedStatus after: ', selonlyLoadedStatus);

        console.log('this.selectedRec after: ', this.selectedRec); 

       

       console.log('selectAll this.rows: ', this.rows);

    }

    selectAll() {

          for (let i = 0; i < this.rows.length; i++) 
          {
            this.rows[i].select =  this.selectedAllTrans;   
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


  updateFilter(event, value: any)
   {
    let temp1 = this.temp;
    if (value === 'batchNo') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.batchNo.toString().toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }

    if (value === 'CURRENCY') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.ccyCode.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }
    if (value === 'TOTAL POSTED TXN') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.postedTransCount.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }

    if (value === 'TOTAL DR') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.totalDr.toString().toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }
    if (value === 'DIFFERENCE') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.tDifference.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }

    if (value === 'TOTAL RECORD COUNT') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.recordCount.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }
    if (value === 'TOTAL DR COUNT') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.totalDrCount.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }

    if (value === 'TOTAL CR COUNT') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.totalCrCount.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }
    if (value === 'PROC. DEPT') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.processingDept.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }
    if (value === 'STATUS') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.status.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }
    if (value === 'ORIG. BRANCH') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.originBranch.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }

    if (value === 'FILE NAME') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.filename.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }
  

   

    

  

    if(this.rows.length === 0){
      swal('',this.recordNotFoundMsg, 'error');

      this.rows = temp1;
      
    }

  }


  action(actionName: any, record: BatchControl)
  {
 
 
    this.loadPage = true;
     setTimeout(() => {
      this.loadPage = false;
      this.View(actionName, record, '')
      
    }, this.loderTimer);
  }

  View(action: any, record: BatchControl, createdBy: any): void
   {

    let getSelected = new List<BatchControl>(this.rows).Where(c => c.batchNo === record.batchNo).ToArray();

    let dialogRef = this.dialog.open(ApproveBatchDetailsComponent, {

      width: '1400px',
      height: '600px',
      // hasBackdrop: true,
       disableClose: true,
      // autoFocus: true,
      data: { actionName: action, record:  record, createdBy: createdBy, 
              chargeSetup: this.chargeSetup, serviceId:  this.serviceId, 
              serviceName: 'BATCH  CONTROL',  admService :  this.admService,
              row: getSelected
            },
     
    });

    dialogRef.afterClosed().subscribe(result => {
      
      if(result === 'Y'){
      
        this.load(this.userDetails);
        
      }
     
    });
  }



  openDialog(action: any, record: any): any {

   console.log('openDialog record', record );

    let url = 'Users/GetUserById';
      let val = 
        {
          UserId: record.userId
        }
  
  this._GeneralService.post(val, url)
    .subscribe(
    (data: any) => 
    {
        this.View(action, record, data.fullName)
    
  
    },
    (error: any) => 
    {
    
     
  
  });
  }

  swapTab(value){
    console.log('swapTab: ', value);

    if(value === 1)
    {
      this.tab1 = 'active';
      this.tab2 = '';
      this.load(this.userDetails);
    
    }
    if(value === 2)
    {
      this.tab1 = '';
      this.tab2 =  'active';
      this.inCompleteBatch(this.userDetails);
    }

    this.tabVlues = value;
  }

  public onOptionsSelected(event) 
  {
   // console.log('onOptionsSelected', event);
    this.pageLmit = event.target.value;
    console.log('pageLimit: ', this.pageLmit);

    this.rows =  this.temp.slice(0, this.pageLmit);
    
    console.log('allRow: ', this.rows);


    this.changePage(this.current_page);    
 }

 processTrans(): void {

  let getSelected = new List<any>(this.rows).Where(c=> c.serviceStatus !== 'Unauthorized' && c.select === true).ToArray();

  if(getSelected.length === 0){

    Swal('', this.selectTransMsg, 'warning');

    return;
  }

  this.actionLoaderUpdate = true;
  let element = <HTMLInputElement> document.getElementById("btnProcess");
  
  element.disabled = true;
  console.log('this.selectedRec: ', this.selectedRec);

  let url = 'Token/ProcessList';

  let userDetails = this._GeneralService.getUserDetails();

  console.log('userDetails: ', userDetails);


  let val = {
    ListOprTokenDTO: getSelected,
    serviceId: this.serviceId,
    loginUserName: userDetails.userName,
    deptId: userDetails.deptId,
    userId: userDetails.userId,
  }

    this._GeneralService.post(val, url).subscribe(
      (data: any) => 
      {
        element.disabled = false;
        this.actionLoaderUpdate =  false;

        let getUserDetails =  this._GeneralService.getUserDetails();
        console.log('getUserDetails token', getUserDetails)
        this.load(getUserDetails);
       
     
        Swal('', data.sErrorText, 'success');
      },
      (error: any) => {
        
        element.disabled = false;
        this.actionLoaderUpdate =  false;
     
        Swal('', error.error.message, 'error');
    });

  
}

dismissTrans(): void {

  let getSelected = new List<any>(this.rows).Where(c=> c.serviceStatus !== 'Unauthorized' && c.select === true).ToArray();

  if(getSelected.length === 0){

    Swal('', this.selectTransMsg, 'warning');

    return;
  }

    

    Swal({
      title: '',
      text: 'Are you sure you want Dismiss the Selected Request? ' ,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'YES',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'NO'
    }).then((result) => {
      if (result.value) 
      {

        this.actionLoaderDismiss = true;
  let element = <HTMLInputElement> document.getElementById("btnDismiss");
  
  element.disabled = true;
  console.log('this.selectedRec: ', this.selectedRec);

  let url = 'Token/DismissList';

  let userDetails = this._GeneralService.getUserDetails();

  console.log('userDetails: ', userDetails);


  let val = {
    ListOprTokenDTO: getSelected,
    serviceId: this.serviceId,
    loginUserName: userDetails.userName,
    deptId: userDetails.deptId,
    userId: userDetails.userId,
  }

    this._GeneralService.post(val, url).subscribe(
      (data: any) => 
      {
        element.disabled = false;
        this.actionLoaderDismiss =  false;

        let getUserDetails =  this._GeneralService.getUserDetails();
        console.log('getUserDetails token', getUserDetails)
        this.load(getUserDetails);
       
     
        Swal('', data.sErrorText, 'success');
      },
      (error: any) => {
        
        element.disabled = false;
        this.actionLoaderDismiss =  false;
     
        Swal('', error.error.message, 'error');
    });



      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });

  
}

radio(event)
{
   console.log('radio', event.value)

   if(event.value === 'All'){
      let UnAuth = new List<any>(this.temp).Where(c=> c.itbId > 0).ToArray();
      this.rows  =  UnAuth.slice(0, this.pageLmit);
   }
   if(event.value === 'Processed'){

      let proc = new List<any>(this.temp).Where(c=> c.serviceStatus === "Unauthorized").ToArray();
      this.rows  =  proc.slice(0, this.pageLmit);
   }


   console.log('this.rows: ', this.rows)

 
   this.changePage(this.current_page);

  
}

 removeBatches(): void {
  let getSelected = new List<BatchControl>(this.rows).Where(c=> c.select === true).ToArray();

  if(getSelected.length === 0) {

    Swal('', this.selectTransMsg, 'warning');

    return;
  }
    Swal({

      title: '',
      text: 'Are you Sure you want to Reject the Selected Batch(es)?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Cancel'

    }).then((result) => {

      if (result.value) 
      {
        
        this.loadPage = true;
        this.actionLoaderUpdate = true;
        let element = <HTMLInputElement> document.getElementById("btnRemoveBatch");
        
        element.disabled = true;
        console.log('this.selectedRec: ', this.selectedRec);
      
        let url = 'BatchControl/RemoveBatch';

        for(let i = 0; i <  getSelected.length; i++ )
        {
          getSelected[i].loadedBy = '0';
          getSelected[i].processingDept = '0';
        }
      
        let val = 
        {
          ListBatchControl: getSelected,
          loginUserName: this.userDetails.userName,
          LoginUserId: this.userDetails.userId,
        }
      
        console.log('remove batch: ', val);
      
          this._GeneralService.post(val, url).subscribe(
            (data: any) => 
            {
              element.disabled = false;
              this.actionLoaderUpdate =  false;
              this.loadPage = false;
      
              let getUserDetails =  this._GeneralService.getUserDetails();
              console.log('getUserDetails token', getUserDetails)
              this.load(getUserDetails);
             
           
              Swal('', data.responseMessage, 'success');
            },
            (error: any) => {
              
              this.loadPage = false;
              element.disabled = false;
              this.actionLoaderUpdate =  false;

              console.log('error 11: ', error.error);
              console.log('error 22: ', error.error.responseMessage);
              console.log('error responseMessage1: ', error.responseMessage);
              
              Swal('', error.error.responseMessage, 'error');
          });
      } 
      else if (result.dismiss === Swal.DismissReason.cancel) 
      {
        
      }
    });

  
 }

  undoRemoveBatches(): void {
    let getSelected = new List<BatchControl>(this.rows).Where(c => c.select === true).ToArray();

    if (getSelected.length === 0) {

      Swal('', this.selectTransMsg, 'warning');

      return;
    }
    Swal({

      title: '',
      text: 'Are you Sure you want to Undo the Rejected Selected Batch(es)?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'Cancel'

    }).then((result) => {

      if (result.value) {

        this.loadPage = true;
        this.actionLoaderUpdate = true;
        let element = <HTMLInputElement>document.getElementById("btnRemoveBatch");

        element.disabled = true;
        console.log('this.selectedRec: ', this.selectedRec);

        let url = 'BatchControl/UndoRejectBatch';

        for (let i = 0; i < getSelected.length; i++) {
          getSelected[i].loadedBy = '0';
          getSelected[i].processingDept = '0';
        }

        let val =
        {
          ListBatchControl: getSelected,
          loginUserName: this.userDetails.userName,
          LoginUserId: this.userDetails.userId,
        }

        console.log('remove batch: ', val);

        this._GeneralService.post(val, url).subscribe(
          (data: any) => {
            element.disabled = false;
            this.actionLoaderUpdate = false;
            this.loadPage = false;

            let getUserDetails = this._GeneralService.getUserDetails();
            console.log('getUserDetails token', getUserDetails)
            this.load(getUserDetails);


            Swal('', data.responseMessage, 'success');
          },
          (error: any) => {

            this.loadPage = false;
            element.disabled = false;
            this.actionLoaderUpdate = false;

            console.log('error 11: ', error.error);
            console.log('error 22: ', error.error.responseMessage);
            console.log('error responseMessage1: ', error.responseMessage);

            Swal('', error.error.responseMessage, 'error');
          });
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });


  }

 downloadFormat()
 {
let data = [];

  for(let i = 1; i < 7; i++)
  {
    let drOrCr = i > 3 ? 'CR' : 'DR';
    let tranCode = i > 3 ? '101' : '152';
    data.push({
      'A/C No': `${601010001}${i}`,
      'A/C Type ': 'CA',
      'DR/CR': drOrCr,
      'Amount': 5000,
      'Currency': 'GMD',
      'Narration': 'Transfer Narration',
      'Chq No': 200,
      'TranCode': tranCode,
      'Value Date':'dd/MM/yyyy',
      'ReferenceNo': null
    });
  }


   this._GeneralService.exportAsExcelFile1(data, 'BulkPaymentUploadFormat');
 }

gotoUpload(action: any, record: any, createdBy: any): void
{

 let dialogRef = this.dialog.open(ApproveBatchDetailsComponent, {

   // width: '3500px',
   // height: '800px',
   // hasBackdrop: true,
    disableClose: true,
   // autoFocus: true,
   data: { 
           actionName: action, record:  record, createdBy: createdBy, 
           chargeSetup: this.chargeSetup, serviceId:  this.serviceId, 
           serviceName: 'BATCH  BULK UPLOAD',  admService :  this.admService
         },
  
 });

 dialogRef.afterClosed().subscribe(result => {
   
   if(result === 'Y')
   {
     this.swapTab(2);
     this.inCompleteBatch(this.userDetails);
   }
  
 });
}

processFileUpload(): void 
{

  let getSelected = new List<BatchControl>(this.rows).Where(c=> c.select === true).ToArray();

  if(getSelected.length === 0) 
  {
    Swal('', this.selectTransMsg, 'warning');
    return;
  }
    Swal({

      title: '',
      text: 'Are you Sure you want to Process the Selected Batch(es)?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Cancel'

    }).then((result) => {

      if (result.value) 
      {
        
        this.loadPage = true;
        this.actionLoaderUpdate = true;
        let element = <HTMLInputElement> document.getElementById("btnprocessFileUpload");
        
        element.disabled = true;
        console.log('this.selectedRec: ', this.selectedRec);
      
        let url = 'BatchControlFileUpload/ProcessFileUpload';
      
        let userDetails = this._GeneralService.getUserDetails();
      
        console.log('userDetails: ', userDetails);

      
      
        let val = 
        {
          ListBatchControl: getSelected,
          loginUserName: userDetails.userName,
          userId: userDetails.userId,
          LoginUserId: this.userDetails.userId
        }
      
          console.log('val process: ', val);
      
          this._GeneralService.post(val, url).subscribe(
            (data: any) => 
            {
              element.disabled = false;
              this.actionLoaderUpdate =  false;
              this.loadPage = false;
      
              let getUserDetails =  this._GeneralService.getUserDetails();
              console.log('getUserDetails token', getUserDetails)
              this.swapTab(2);
              this.load(getUserDetails);
             
           
              Swal('', data.responseMessage, 'success');
            },
            (error: any) => {
              
              this.loadPage = false;
              element.disabled = false;
              this.actionLoaderUpdate =  false;

              console.log('error 11: ', error.error);
              console.log('error 22: ', error.error.responseMessage);
              console.log('error responseMessage1: ', error.responseMessage);
              
              Swal('', error.error.responseMessage, 'error');
          });
      } 
      else if (result.dismiss === Swal.DismissReason.cancel) 
      {
        
      }
    });
}

approvePostTrans(): void 
{

  let getSelected = new List<BatchControl>(this.rows).Where(c=> c.select === true).ToArray();

  if(getSelected.length === 0) 
  {
    Swal('', this.selectTransMsg, 'warning');
    return;
  }
    Swal({

      title: '',
      text: 'Are you Sure you want to Approve/Post the Selected Batch(es)?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Cancel'

    }).then((result) => {

      if (result.value) 
      {
        
        this.loadPage = true;
     
        let element = <HTMLInputElement> document.getElementById("btnprocessAllItem");
        
        element.disabled = true;
        console.log('this.selectedRec: ', this.selectedRec);
      
        let url = 'ApproveBatch/ApproveTrans';
      
        let userDetails = this._GeneralService.getUserDetails();
      
        console.log('userDetails: ', userDetails);

       
      
        let val = 
        {
          listBatchControl: getSelected,
          loginUserName: userDetails.userName,
          userId: userDetails.userId,
          loginUserId: this.userDetails.userId,
          serviceId: this.serviceId,
          transactionDate: this.userDetails.bankingDate
        }
      
          
      
          this._GeneralService.post(val, url).subscribe(
            (data: any) => 
            {
              console.log('process succ batch ', val);

             // Swal('', data.responseMessage, 'success');
              element.disabled = false;
              this.loadPage = false;
              let getUserDetails =  this._GeneralService.getUserDetails();
              this.load(getUserDetails);

              this.postTransResponse = data;
              this.postTransResponseList = data.subtringClass;

              console.log('this.postTransResponse: ', this.postTransResponse);

              console.log('this.postTransResponse: ', this.postTransResponseList);

              this.closeAlertPostTrans();
              
            },
            (error: any) => {
              
              this.loadPage = false;
              element.disabled = false;
             

              console.log('error 11: ', error.error);
              console.log('error 22: ', error.error.responseMessage);
              console.log('error responseMessage1: ', error.responseMessage);
              
              Swal('', error.error.responseMessage, 'error');
          });
      } 
      else if (result.dismiss === Swal.DismissReason.cancel) 
      {
        
      }
    });

  
}

  closeAlertPostTrans() {
    console.log('closeAlertPostTrans', this.alertPostTrans);
    if (this.alertPostTrans === false) {
      console.log('closeAlertPostTran 1');
      this.alertPostTrans = true;
    }
    else if (this.alertPostTrans === true) {
      console.log('closeAlertPostTran 2');
      this.alertPostTrans = false;
    }

    this.viewTransDetails = false;

  }

reApprovePostTrans(): void 
{

  let getSelected = new List<BatchControl>(this.rows).Where(c=> c.select === true).ToArray();

  if(getSelected.length === 0) 
  {
    Swal('', this.selectTransMsg, 'warning');
    return;
  }
    Swal({

      title: '',
      text: 'Are you Sure you want to Re-Approve/Post the Selected Batch(es)?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Cancel'

    }).then((result) => {

      if (result.value) 
      {
        
        this.loadPage = true;
     
        let element = <HTMLInputElement> document.getElementById("btnReProcessAllItem");
        
        element.disabled = true;
        console.log('this.selectedRec: ', this.selectedRec);
      
        let url = 'ApproveBatch/ReApproveTrans';
      
        let userDetails = this._GeneralService.getUserDetails();
      
        console.log('userDetails: ', userDetails);

       
      
        let val = 
        {
          listBatchControl: getSelected,
          loginUserName: userDetails.userName,
          userId: userDetails.userId,
          loginUserId: this.userDetails.userId,
          serviceId: this.serviceId,
          transactionDate: this.userDetails.bankingDate
        }
      
          
      
          this._GeneralService.post(val, url).subscribe(
            (data: any) => 
            {
              console.log('process succ batch ', val);

              Swal('', data.responseMessage, 'success');
              element.disabled = false;
              this.loadPage = false;
              let getUserDetails =  this._GeneralService.getUserDetails();
              this.load(getUserDetails);
              
            },
            (error: any) => {
              
              this.loadPage = false;
              element.disabled = false;
             

              console.log('error 11: ', error.error);
              console.log('error 22: ', error.error.responseMessage);
              console.log('error responseMessage1: ', error.responseMessage);
              
              Swal('', error.error.responseMessage, 'error');
          });
      } 
      else if (result.dismiss === Swal.DismissReason.cancel) 
      {
        
      }
    });

  
}


}

