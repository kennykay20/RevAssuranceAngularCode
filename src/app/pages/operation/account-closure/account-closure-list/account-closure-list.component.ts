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
import { OprBusinessSearchForm } from '../../../../model/oprBusinessSearchForm.model';
import { CounterChequeForm } from '../../../../model/CounterChqReqForm.model';
import { ChqBookReqForm } from '../../../../model/ChqBookReqForm.model';
import { AccountClosureDetailsComponent } from '../account-closure-details/account-closure-details.component';
import { OprAcctClosure } from '../../../../model/oprAcctClosure.model';
import { AccountClosureParam } from '../../../../model/AccountClosureParam';


declare var $;



@Component({
  selector: 'app-account-closure-list',
  templateUrl: './account-closure-list.component.html',
  styleUrls: ['./account-closure-list.component.scss']
})
export class AccountClosureListComponent implements OnInit {

  @ViewChild('dataTable') table: ElementRef;
  
  dataTable: any;

  editing = {};
  //rows: any; // = [];
  //temp = [];


  currencies = [];
  branches = [];

  rows: OprAcctClosure[];
  rowSearch : OprAcctClosure[];
  columns = [];
  temp:OprAcctClosure[];
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
  accountStatus = '';

  selectedAllTrans =  false;
  
  unAuthorized =  false;

  accountClosureParam: AccountClosureParam;

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
 
  serviceId = 6;

  chargeSetup: any;
  assignRole: any
  menuId: any
  admService: admService;
  admServiceList: admService;
  loderTimer = GenModel.LoderTimer;

  checkValue = false;
  lengthMessage = '';
  accountNumber ='';
  maxLength = '';
  acct1 = '';
  currentDate = '';
  departments = [];
  statusItem = [];
  acttypes = [];
  rowList = [];
  pageListVal = '0';

  constructor(public appSettings: AppSettings, 
              public dialog: MatDialog,
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
      //this.ItemsPerPage = this._GeneralService.ItemsPerPage;
      let getUserDetails =  this._GeneralService.getUserDetails();
      //console.log('getUserDetails token', getUserDetails);

      this.accountClosureParam = new AccountClosureParam();
      this.load(getUserDetails);
      this.loadDepartment();
      this.loadAcctTypes();
      this.swapTab(1);
      this.loadAll();
      this.loadAllStatus();
      //this.loadHistory(getUserDetails);
   
  }

  loadHistory(): void {

    this.loadPage = true;


    let track = 0;
    let url = 'AccountClosure/GetAll';


      

  this._GeneralService.post(null, url)
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
  }).subscribe(
    (data: any) => 
    {
      console.log('data apg load: ', data);
      this.loadPage = false;
      this.temp = data._response;
      this.rows = data._response;
      
      this.chargeSetup = data.charge;
      this.admService = data.admService;
      this.loadPage = false;

      // let UnAuth = new List<any>(data._response).Where(c=> c.serviceStatus == "Unauthorized").ToArray();

      // let NotUnAuth = new List<any>(data._response).Where(c=> c.serviceStatus != "Unauthorized").ToArray();
     
      // console.log
      // let pus = [] ;
      // pus.push(NotUnAuth);

      this.assignRole = data.roleAssign;

      if(data._response.length > 0)
      {
        this.rows  =  data._response.slice(0, this.pageLmit);
        this.changePage(this.current_page);
      }
        
    },
    (error: any) => 
    {

      //this.handleError(error);

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

load(param: any): void {

    this.loadPage = true;

    //console.log('rows length ', this.rows);
    let track = 0;
    let url = 'AccountClosure/GetAll';


      let val = 
        {
          pdtCurrentDate: param.bankingDate,
          psBranchNo: param.branchNo,
          pnDeptId: param.deptId,
          pnGlobalView: 'N',
          serviceId: this.serviceId,
          roleId: param.roleId,
          menuId:  this.menuId
        }

        //console.log('token param load', val);

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
  }).subscribe(
    (data: any) => 
    {
      //console.log('rows ', this.rowList);
      //console.log('data apg load: ', data);
      //console.log('data response : ', data._response);
      this.loadPage = false;
      this.temp = data._response;
      this.rows = data._response;
      this.rowList = data._response;
      //console.log('rows length2 ', this.rowList);
      //console.log('this.rows 2 ', this.rows);
      this.chargeSetup = data.charge;
      this.admService = data.admService;
      this.loadPage = false;

      let UnAuth = new List<any>(data._response).Where(c=> c.serviceStatus == "Unauthorized").ToArray();

      let NotUnAuth = new List<any>(data._response).Where(c=> c.serviceStatus != "Unauthorized").ToArray();
     
      //console.log
      let pus = [] ;
      pus.push(NotUnAuth);

      //console.log('rows length3 ', this.rows);
      this.assignRole = data.roleAssign;
      //console.log('data._response.length 1 ', data._response);
      
      if(data._response.length > 0)
      {
        //console.log("data length ", data._response);
        //console.log("this.pageLmit ", this.pageLmit);
        //console.log('this.rows ', this.rows);
        this.rows  =  data._response.slice(0, this.pageLmit);
        //console.log('this.rows ', this.rows);
        //console.log('rows length4 ', this.rows);
        this.changePage(this.current_page);

      }else{

      }
        
    },
    (error: any) => 
    {

      //this.handleError(error);

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

loadDepartment(): void {

    this.loadPage = true;
    let track = 0;
    let url = 'Department/GetAll';

      let val = 
        {
          AId: 1,
        }

      

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
  }).subscribe(
    (data: any) => 
    {
  
      
      this.departments = data._response;
        
    },
    (error: any) => 
    {
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

loadAllStatus()
{
  // ServiceCharge/GetAllStatus

  this.loadPage = true;
    let track = 0;
  let url = 'ServiceCharge/GetAllStatus';


      let val = 
        {
          itbid: 1,
        }

      

  this._GeneralService.post(val, url)
  .subscribe(
    (data: any) => 
    {
  
      //console.log("status " ,data);
      this.statusItem = data;
      
        
    },
    (error: any) => 
    {
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
loadAcctTypes(): void {

  this.loadPage = true;
  let track = 0;
  let url = 'AccountType/GetAll';


    let val = 
      {
        AId: 1,
      }

     

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
}).subscribe(
  (data: any) => 
  {
    //console.log("Acct Type ", data);
    this.acttypes = data;
    //console.log('this.acttypes: ', this.acttypes);
      
  },
  (error: any) => 
  {
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

fromDate(event)
{
    
    var dateCon = this._GeneralService.dateconvertion(event.target.value);
    this.currentDate = dateCon;
    this.accountClosureParam.transactionDate = dateCon;
    //console.log("DateCon ", this.currentDate);
}

loadAll(): void { 

  this.loadPage = true;
  let track = 0;
  let url = 'AdmGetAll/GetAll';
  //console.log("Url LoadAll" +url);
  this._GeneralService.post(null, url).subscribe(
    (data: any) => 
    {
      //console.log('rows: ', this.rows);
      //console.log('data first ', data);
      this.currencies = data.currencies;
      this.admServiceList =  data.admService;
      this.branches = data.branch;
      this.loadPage = false;
      //console.log('admServiceList: ', this.admServiceList);
    },
    (error: any) => 
    {
      console.log('error: ', error)
      
    });
}

search()
{
  this.loadPage = true;
  let track = 0;

  let element = <HTMLInputElement> document.getElementById("btnSearchEnq");
  element.disabled = true;
  //console.log("user id " + this.admService + ' MenuId ' + this.menuId + " role Id " + this.assignRole + " serviceId " + this.serviceId);

  let val = 
        {
          transactionDate: this.accountClosureParam.transactionDate,
          psBranchNo: this.accountClosureParam.psBranchNo,
          pnDeptId: this.accountClosureParam.pnDeptId,
          pnGlobalView: 'N',
          serviceId: this.serviceId,
          RoleId: this.assignRole.roleId,
          MenuId:  this.menuId,
          psStatus: this.accountClosureParam.psStatus,
          referenceNo : this.accountClosureParam.referenceNo,
          Amount: this.accountClosureParam.amount,
          psAcctType: this.accountClosureParam.psAcctType,
          psCcyCode : this.accountClosureParam.psCcyCode,
          psAcctNo: this.accountClosureParam.psAcctNo,
          accountName: this.accountClosureParam.AccountName
          //Amount : this.accountClosureParam.amount
          //pnDeptId : this.accountClosureParam.pnDeptId
        }
        //this.assignRole.roleId
    //console.log('AccountClosure param search', val);
    
    let url = 'AccountClosure/GetAllSearchHistory';

    this._GeneralService.post(val, url)
    .subscribe((data: any) => {
      
      this.loadPage = false;
      element.disabled = false;
      
      this.rowSearch = data._response;
      
      
    }, error => {
      element.disabled = false;
      this.loadPage = false;
    })

}

clearItem()
{
  this.accountClosureParam.transactionDate = '';
  this.accountClosureParam.psBranchNo = '';
  this.accountClosureParam.pnDeptId = '';

  // this.assignRole.roleId,
  // this.menuId,
  this.accountClosureParam.psAcctNo = '';
  this.accountClosureParam.AccountName = '';
  this.accountClosureParam.psStatus = '';
  this.accountClosureParam.referenceNo = '';
  this.accountClosureParam.amount = '';
  this.accountClosureParam.psAcctType = '';
  this.accountClosureParam.psCcyCode = '';
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

      let numPages = this.numPages();
      console.log('numPages ', numPages);
      // Validate page
      if (page < 1) page = 1;

      if(numPages != undefined)
      {
        if (page > this.numPages()) page = this.numPages();
      }
      
      //console.log('this.numPages() ', this.numPages());
      let tem = []; 

      if(numPages != undefined){
        for (let i = ( page - 1 ) * this.pageLmit; i < (page * this.pageLmit) && i < this.temp.length; i++) 
        {
            tem.push(this.temp[i]);
        }
      }
      

      this.rows = tem;
      console.log('tem', tem);
      console.log('page ', page)
      if(tem.length > 0)
      {
        console.log('yes test ');
        //page_span.innerHTML = page + "/" + numPages;
        this.pageListVal = page + "/" + numPages;
        console.log('this.pageListVal ', this.pageListVal);
      }
      

  }

  numPages()
  {
      console.log('numPages() this.temp ',this.temp);
      let numPage: number;
      if(this.temp != null)
      {
        numPage = Math.ceil(this.temp.length / this.pageLmit);
        //console.log('numPage ', numPage);
        return numPage;
      }
      return numPage;
  }

  onload = function() {
    this.changePage(1);
  };

  select(row)
  {
        //console.log('selected row', row);

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

        //console.log('selected this.selectedRec', this.selectedRec);
  }

  
  selectAll1() {


    let selonlyLoadedStatus = new List<any>(this.rows).Where(c=> c.serviceStatus != 'Unauthorized').ToArray();
    
    //console.log('selonlyLoadedStatus: ', selonlyLoadedStatus);

    let seletAuth = new List<any>(this.rows).Where(c=> c.serviceStatus === 'Unauthorized').ToArray();

    //console.log('selonly Auth: ', seletAuth);

    for (let i = 0; i < selonlyLoadedStatus.length; i++) {

          selonlyLoadedStatus[i].select = this.selectedAllTrans;
          
       //   this.rows[i].select =  this.selectedAllTrans;

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

        //console.log('selonlyLoadedStatus after: ', selonlyLoadedStatus);

        //console.log('this.selectedRec after: ', this.selectedRec); 

       

       //console.log('selectAll this.rows: ', this.rows);

    }

    selectAll() {

      for (let i = 0; i < this.rows.length; i++) {
  
            //  if(this.rows[i].serviceStatus !== 'Unauthorized')
            //  {
            //     this.rows[i].select =  this.selectedAllTrans;
            //  }

            //  if(this.rows[i].serviceStatus === 'Unauthorized')
            //  {
            //     this.rows[i].select =  false;
            //  }
             
          }
  
         //console.log('selectAll this.rows: ', this.rows);
  
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
    
    let temp1  = this.temp;
     if (value === 'transDate') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
       return d.transDate.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
     //this.table.offset = 0;
    }
    else if (value ==='acctNo') {
      console.log('1');
      const val = event.target.value.toLowerCase();
    
      console.log('this.tempssss ', this.temp);
      const temp = this.temp.filter(function(d) {
        return d.acctNo.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      console.log('this.rows search ', this.rows);
    }
    else if (value === 'acctType') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.acctType.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
    }
    else if (value ==='acctName') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.acctName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
    }
    else if (value ==='amtWidthdraw') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
       // return d.chqWidrawalAmount.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
    }
    else if (value === 'acctCCy') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.ccyCode.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
    }
    else if (value === 'Status') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.serviceStatus.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
    }
    else if (value === 'user') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.userName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
    }
    else
    {
      console.log('2');
      
    }


    // if(this.rows.length == 0)
    // {
    //     //swal('','No record matches your search!','error')
    //     console.log('No record matches your search', this.temp);
    //     this.rows = this.temp;
    // }
  

  }


  action(actionName: any, record: any)
  {
   
    //console.log('action ' + actionName);
    //console.log('record ' + record);
    this.loadPage = true;
     setTimeout(() => {
      this.loadPage = false;
      if(record != '')
      {
        this.openDialog(actionName, record);
      }
      else
      {
        //console.log('view function');
        this.View(actionName, record, '')
      }
      
    }, this.loderTimer);
  }

  View(action: any, record: any, createdBy: any): void
   {
      let dialogRef = this.dialog.open(AccountClosureDetailsComponent, {

      height: '650px',
      width: '1500px',
      // hasBackdrop: true,
        disableClose: true,
      // autoFocus: true,
        data: { actionName: action, record:  record, createdBy: createdBy, 
        chargeSetup: this.chargeSetup, serviceId:  this.serviceId, 
        serviceName: 'ACCOUNT CLOSURE',  admService :   this.admService
      },
      
    });

    dialogRef.afterClosed().subscribe(result => {
      
      if(result === 'Y'){
        let getUserDetails =  this._GeneralService.getUserDetails();
        this.load(getUserDetails);
      }
     
    });
  }

  openDialog(action: any, record: any): any {

    let url = 'Users/GetUserById';
      let val = 
        {
          "aId": 0,
          "userName": "string",
          "password": "string",
          "dateCreated": "2020-05-12T12:08:01.854Z",
          UserId: record.userId
        }
  
    this._GeneralService.post(val, url)
    .subscribe(
    (data: any) => 
    {
        this.View(action, record, data.fullName);
    },
    (error: any) => 
    {
    
     
  
    });
  }

  swapTab(value){
    console.log('swapTab: ', value);

    if(value === 1){
      this.tab1 = 'active';
      // this.selectedCalss = 'selected nav-item cursorPointer';
      // this.selectedCalss2 = 'notselected';
      this.changePage(this.current_page);
      let getUserDetails =  this._GeneralService.getUserDetails();
      //console.log('getUserDetails token', getUserDetails);

      //this.accountClosureParam = new AccountClosureParam();
      this.load(getUserDetails);
      this.tab2 = '';
      

    }
    if(value === 2){
      this.tab1 = '';
      this.tab2 =  'active';

      // this.selectedCalss = 'notselected';
      // this.selectedCalss2 = 'selected nav-item cursorPointer';
      this.changePage(this.current_page)
      
    }

    this.tabVlues = value;
  }

  public onOptionsSelected(event) 
  {
   // console.log('onOptionsSelected', event);
    this.pageLmit = event.target.value;
    //console.log('pageLimit: ', this.pageLmit);

    this.rows =  this.temp.slice(0, this.pageLmit);
    
    //console.log('allRow: ', this.rows);


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
  //console.log('this.selectedRec: ', this.selectedRec);

  let url = 'Token/ProcessList';

  let userDetails = this._GeneralService.getUserDetails();

  //console.log('userDetails: ', userDetails);


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
        //console.log('getUserDetails token', getUserDetails)
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
  //console.log('this.selectedRec: ', this.selectedRec);

  let url = 'Token/DismissList';

  let userDetails = this._GeneralService.getUserDetails();

  //console.log('userDetails: ', userDetails);


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
        //console.log('getUserDetails token', getUserDetails)
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
   //console.log('radio', event.value)

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

  // New added Functions For Account Validation
 checkLength(value: any, acctType: any)
 {
   this.checkValue = false;
   this.lengthMessage = '';
   if(acctType === '')
   {
     if(value.includes('-')){
       let valueReplace1 = value.replace(/[0-9]/g, '#');
       //console.log(valueReplace1);
       if(value.length < 23)
       {
         this.checkValue = true;
         this.lengthMessage = "Account number must not be less than 23";
       }
     }
     else{
       let valueReplace2 = value.replace(/[0-9]/g, '#');
       //console.log(valueReplace2);
       if(value.length < 12)
       {
         this.checkValue = true;
         this.lengthMessage = "Account number must not be less than 12";
       }
     }

   }
   if(acctType.trim() === "CA" || acctType.trim() === "SA"){
     var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
     if(v.length < 12)
     {
       this.checkValue = true;
       this.lengthMessage = "Account number must not be less than 12";
     }
     if(v.length >= 12){
       this.checkValue = false;
       this.lengthMessage = '';
     }
   }
   else if(acctType.trim() === "GL"){
     var m = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
     if(m.length < 23)
     {
       this.checkValue = true;
       this.lengthMessage = "Account number must not be less than 23";
     }
     else if(m.length >= 23){
       this.checkValue = false;
       this.lengthMessage = '';
     }
   }

 }
 acctFormatType(value: any, acctType: any)
 {

   if(acctType.trim() == "CA" || acctType.trim() == "SA"){

   }
   if(acctType.trim() == "GL")
   {

     var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
     if (v.length > 1)
       v = [v.slice(0, 2), '-', v.slice(2)].join('');
     if (v.length > 4)
       v = [v.slice(0, 5), '-', v.slice(5)].join('');
     if (v.length > 7)
       v = [v.slice(0, 8), '-', v.slice(8)].join('');
     if (v.length > 11)
       v = [v.slice(0, 12), '-', v.slice(12)].join('');
     if (v.length > 22)
       v = v.slice(0, 24);
       console.log(v);
       this.accountNumber = v;
     return v;


   }

 }

 onChangeAcctType(acctype: any) {



   this.accountNumber = '';
   this.maxLength = '';

   //this.acct1 = '';
   this.acct1 = acctype.trim();
   //console.log("acctType " + this.acct1);


   if(this.acct1 == ''){
     alert('select an account Type');
     return;
   }
   if(this.acct1 === "GL"){

     // this.accountService.getAccountFormat(this.acct1)
     // .subscribe(res =>{
     //   console.log("Format ", res);

     //   this.glAccountType = true;

     //   this.maxLength = '23';
     // });
   }
   if(this.acct1 === "CA" || this.acct1 === "SA")
   {

     // this.accountService.getAccountFormat(this.acct1)
     // .subscribe(response =>{
     //   console.log("Format ", response);

     //   this.glAccountType = false;
     //   this.maxLength = '12'
     // });
   }

 }

 // Ends here...

}

