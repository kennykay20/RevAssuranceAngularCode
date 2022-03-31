
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
import { OprTradeReference } from '../../../../model/OprTradeReference.model';
import { UserDetails } from '../../../../model/userDetails';
import { RefLetterDetailsComponent } from '../ref-letter-details/ref-letter-details.component';
import { ReferenceLetter } from '../../../../model/ReferenceLetter.model';


declare var $;



@Component({
  selector: 'app-ref-letter-list',
  templateUrl: './ref-letter-list.component.html',
  styleUrls: ['./ref-letter-list.component.scss']
})
export class RefLetterListComponent implements OnInit {
 //  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('dataTable') table: ElementRef;
  
  dataTable: any;

  editing = {};


  rows: ReferenceLetter[];
  rowSearch: ReferenceLetter[];
  columns = [];
  temp:ReferenceLetter[];
  current_page = 1;

  refLetterBound: ReferenceLetter;

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

  selectedAllTrans =  false;
  
  unAuthorized =  false;

  currencies = [];
  branches = [];
  acttypes = [];
  departments = [];
  statusItem = [];
  serviceStatus = [];
  currentDate = '';


tab1 = '';
tab2 = '';
tab3 = ""


coinwallet: string[] = ['wallet1','wallet2'];
selectedwallet = this.coinwallet[0];


origMobile = [];

step = 'brown';

apiIsDown = GenModel.apiIsDown;

 selectedCalss = 'selected nav-item cursorPointer';
 selectedCalss2 = 'selected nav-item cursorPointer';
 selectedCalss3 = 'selected nav-item cursorPointer';
 selectedCalss4 = 'selected nav-item cursorPointer';
 serviceId = 10;

 chargeSetup: any;
assignRole: any
menuId: any
admService: admService;
loderTimer = GenModel.LoderTimer;
userDetails: UserDetails;

   

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
     
      this.refLetterBound = new ReferenceLetter;
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;
      this.userDetails =  this._GeneralService.getUserDetails();
     
      this.load(this.userDetails);
      this.loadAll();
      this.loadAllStatus();
      this.loadAcctTypes();
      this.loadDepartment();
      this.swapTab(1);

   
  }


load(param: any): void {

    console.log('load param', param);

    this.loadPage = true;


    let track = 0;
    let url = 'ReferenceLetter/GetAll';


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
  }).subscribe(
    (data: any) => 
    {
      console.log('data apg: ', data);
      this.loadPage = false;
      this.temp = data._response;
      this.rows = data._response;
      this.admService = data.admService;
      
      this.chargeSetup = data.charge;
      this.loadPage = false;

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

loadHis(param: any): void {

  console.log('load param', param);

  this.loadPage = true;


  let track = 0;
  let url = 'ReferenceLetter/GetAll';


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
}).subscribe(
  (data: any) => 
  {
    console.log('data apg: ', data);
    this.loadPage = false;
    this.temp = data._response;
    this.rows = data._response;
    this.admService = data.admService;
    
    this.chargeSetup = data.charge;
    this.loadPage = false;

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

fromDate(events)
{
  var dateCon = this._GeneralService.dateconvertion(events.target.value);
    console.log(events);
    this.currentDate = dateCon;
    this.refLetterBound.transactionDate = dateCon;
    console.log("DateCon ", this.currentDate);
}

loadAll(): void { 

  this.loadPage = true;
  let track = 0;
  let url = 'AdmGetAll/GetAll';
  console.log("Url LoadAll" +url);
  this._GeneralService.post(null, url).subscribe(
    (data: any) => 
    {
      console.log('rows: ', this.rows);
      
      this.currencies = data.currencies;
      //this.admServiceList =  data.admService;
      this.branches = data.branch;
      this.loadPage = false;
      //console.log('admServiceList: ', this.admServiceList);
    },
    (error: any) => 
    {
      console.log('error: ', error)
      
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
  
      console.log("status " ,data);
      this.statusItem = data;
      this.serviceStatus = data;
        
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
    console.log("Acct Type " + data);
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

search()
{
  this.searchHistory();
}

searchHistory()
{
  this.loadPage = true;
  let track = 0;

  let element = <HTMLInputElement> document.getElementById("btnSearchEnq");
  element.disabled = true;

  let val = 
        {
          transactionDate: this.refLetterBound.transactionDate,
          psAcctNo: this.refLetterBound.acctNo,
          accountName: this.refLetterBound.acctName,
          psAcctType: this.refLetterBound.acctType,
          //pnGlobalView: 'N',
          ServiceId: this.serviceId,
          RoleId: this.assignRole.roleId,
          MenuId:  this.menuId,
          serviceStatus: this.refLetterBound.serviceStatus,
          referenceNo : this.refLetterBound.referenceNo,
          accountStatus: this.refLetterBound.acctStatus,
          psCcyCode: this.refLetterBound.ccyCode,
          pnDeptId: this.refLetterBound.processingDeptId,
          psBranchNo: this.refLetterBound.branchNo,
        }
        //this.assignRole.roleId
    console.log('Ref Letter param search', val);

    let url = 'ReferenceLetter/GetAllSearchHistory';

    this._GeneralService.post(val, url)
    .subscribe((response: any) => {
     
      this.rowSearch = response._response;
      this.loadPage = false;
      element.disabled = false;
    }, error => {
      this.loadPage = false;
      element.disabled = false;
    })
}


clearItem()
{
  this.refLetterBound.transactionDate = '';
  this.refLetterBound.acctName = '';
  this.refLetterBound.acctNo = '';
  this.refLetterBound.acctType = '';
  this.refLetterBound.ccyCode = '';
  this.refLetterBound.branchNo = '';
  this.refLetterBound.processingDeptId = null;
  this.refLetterBound.acctStatus = '';
  this.refLetterBound.serviceStatus = '';

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

      for (let i = ( page - 1 ) * this.pageLmit; i < (page * this.pageLmit) && i < this.temp.length; i++) 
      {
          tem.push(this.temp[i]);
      }

      this.rows = tem;

      page_span.innerHTML = page + "/" + this.numPages();

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

      for (let i = 0; i < this.rows.length; i++) {
  
               this.rows[i].select =  this.selectedAllTrans;
             
          }
  
         console.log('selectAll this.rows: ', this.rows);
  
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
        //return d.connectionName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
     
     // this.table.offset = 0;
    }

    if (value === 2) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
       // return d.server.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      
    
     // this.table.offset = 0;
    }

    if (value === 3) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        //return d.dataBaseName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
 

      
     // this.table.offset = 0;
    }

    if (value === 4) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.transactionDate.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
     //this.table.offset = 0;
    }
    if (value === 5) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.acctNo.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
    }
    if (value === 6) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.acctType.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
    }
    if (value === 7) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.acctName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
    }
    if (value === 8) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.creditAmount.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
    }
    if (value === 9) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.ccyCode.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
    }
    if (value === 10) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.serviceStatus.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
    }
    
    if (value === 12) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.userName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
    }
    if (value === 13) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.dateCreated.toLowerCase().indexOf(val) !== -1 || !val;
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
      
    }, this.loderTimer);
  }

  View(action: any, record: any, createdBy: any): void
   {

    let dialogRef = this.dialog.open(RefLetterDetailsComponent, {

      width: '1500px',
      height: '650px',
      // hasBackdrop: true,
       disableClose: true,
      // autoFocus: true,
      data: { actionName: action, record:  record, createdBy: createdBy, 
              chargeSetup: this.chargeSetup, serviceId:  this.serviceId, 
              serviceName: 'Reference Letter',  admService :  this.admService
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

    if(value === 1){
      this.tab1 = 'active';
      this.tab2 =  '';
      this.tab3 =  '';
      // this.selectedCalss = 'selected nav-item cursorPointer';
      // this.selectedCalss2 = 'notselected';

      let getUserDetails =  this._GeneralService.getUserDetails();      
      this.load(getUserDetails);
    }
    if(value === 2){
      this.tab1 = '';
      this.tab2 =  'active';
      this.tab3 =  '';
      // this.selectedCalss = 'notselected';
      // this.selectedCalss2 = 'selected nav-item cursorPointer';
      let getUserDetails =  this._GeneralService.getUserDetails();
      //console.log('getUserDetails token', getUserDetails)
      this.loadHis(getUserDetails);
    }

    if(value === 3){
      this.tab1 = '';
      this.tab2 = '';
      this.tab3 =  'active';
      // this.selectedCalss = 'notselected';
      // this.selectedCalss2 = 'selected nav-item cursorPointer';
      let getUserDetails =  this._GeneralService.getUserDetails();
      //console.log('getUserDetails token', getUserDetails)
      this.loadHis(getUserDetails);
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

  

}
