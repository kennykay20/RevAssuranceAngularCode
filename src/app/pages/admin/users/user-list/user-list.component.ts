import { UserDetailsComponent } from './../user-details/user-details.component';
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
import { UserLimitComponent } from '../user-limit/user-limit.component';


declare var $;



@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  @ViewChild('dataTable') table: ElementRef;
  
  dataTable: any;

  editing = {};

  rows = [];
  columns = [];
  temp = [];
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

  selectedAllTrans =  false;
  
  unAuthorized =  false;
  pageListVal = '';

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
 
  serviceId = 14;

  chargeSetup: any;
  roleAssign: any
  menuId: any
  getUserDetails: any;
  tableName = '';

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
      //this.ItemsPerPage = this._GeneralService.ItemsPerPage;
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;
      this.getUserDetails =  this._GeneralService.getUserDetails();
      this.pageLmit  = GenModel.pageLmit;
      console.log('getUserDetails token', this.getUserDetails);

      this.load(this.getUserDetails);

      this.swapTab(1);

  }

  load(param: any): void {

    this.loadPage = true;

    let track = 0;
    let url = 'Users/GetAll';

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
      console.log('Users data: ', data);
      this.loadPage = false;
      this.temp = data._response;
     // this.rows = data._response;
      console.log('this.temp test - ', this.temp);
    
      this.roleAssign = data.roleAssign;
      if(data._response.length > 0)
      {

        //console.log('greater')

        this.tableName = data.tableName;
        this.rows  =  data._response.slice(0, this.pageLmit);
        console.log('this.rows user', this.rows)
        this.changePage(this.current_page); 
      
      }  
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
  //From BElow is the Pagination on Mobile ///

  prevPage()
  {;
    
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
  
    let page_span =  document.getElementById("page");

    console.log('page55:', page);
     // console.log('page_span222 .innerHTML', page_span.innerHTML);
      // Validate page
      if (page < 1) 
          page = 1;

      if (page > this.numPages()) page = this.numPages();

      let tem = []; 

      for (let i = ( page - 1 ) * this.pageLmit; i < (page * this.pageLmit) && i < this.temp.length; i++) 
      {
          tem.push(this.temp[i]);
      }

      this.rows = tem;

      
      //console.log('page_span111', page_span);
      //console.log('page_span.innerHTML', page_span.innerHTML)
      console.log('this.numPages()', this.numPages());
      //let div = page + "/" + this.numPages();
      //console.log('div: ', div);
      //page_span.innerHTML = page + "/" + this.numPages();
      this.pageListVal = page + "/" + this.numPages();

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
  
             if(this.rows[i].instrumentStatus !== 'Unauthorized')
             {
                this.rows[i].select =  this.selectedAllTrans;
             }

             if(this.rows[i].instrumentStatus === 'Unauthorized')
             {
                this.rows[i].select =  false;
             }
             
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
        return d.transactionDate.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
     //this.table.offset = 0;
    }
    if (value === 5) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.recordDate.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
    }
    if (value === 6) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.serialNo.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
    }
    if (value === 7) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.acctNo.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
    }
    if (value === 8) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.acctType.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
    }
    if (value === 9) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.acctName.toLowerCase().indexOf(val) !== -1 || !val;
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
    if (value === 11) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.referenceNo.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
    }
    if (value === 12) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.ccyCode.toLowerCase().indexOf(val) !== -1 || !val;
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
      let dialogRef = this.dialog.open(UserDetailsComponent, {

        disableClose: true,
        width: "1200px",
        height: "560px",
        data: { actionName: actionName, record:  record, createdBy: '', chargeSetup: this.chargeSetup, serviceId:  this.serviceId},
        
      });
  
      dialogRef.afterClosed().subscribe(result => {
        
        if(result === 'Y'){
          let getUserDetails =  this._GeneralService.getUserDetails();
          this.load(getUserDetails);
        }
       
      });
      
    }, 100);
  }


  actionLimit(actionName: any, record: any)
  {
   
    this.loadPage = true;
     setTimeout(() => {
      this.loadPage = false;
      let dialogRef = this.dialog.open(UserLimitComponent, {

        disableClose: true,
        width: "1400px",
        height: "650px",
        data: { actionName: actionName, record:  record, createdBy: '', chargeSetup: this.chargeSetup, serviceId:  this.serviceId},
        
      });
  
      dialogRef.afterClosed().subscribe(result => {
        
        if(result === 'Y'){
          let getUserDetails =  this._GeneralService.getUserDetails();
          this.load(getUserDetails);
        }
       
      });
      
    }, 100);
  }







  swapTab(value){
    console.log('swapTab: ', value);

    if(value === 1){
      this.tab1 = 'active';
      // this.selectedCalss = 'selected nav-item cursorPointer';
      // this.selectedCalss2 = 'notselected';
      this.tab2 = '';
    
    }
    if(value === 2){
      this.tab1 = '';
      this.tab2 =  'active';
      // this.selectedCalss = 'notselected';
      // this.selectedCalss2 = 'selected nav-item cursorPointer';
    
      
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

updateFilter1(event, value: any) {
    
  let temp1   = this.temp;

  console.log('updateFilter1 serach: ', this.temp);
  console.log('value ', value);
if (value === 'loginId') {
  const val = event.target.value.toLowerCase();
  console.log('vale ', val);
  const temps = this.temp.filter(function(d) {
    return d.loginId.toLowerCase().indexOf(val) !== -1 || !val;
  });

  console.log('temps ', temps);
  this.rows = temps;

 // this.table.offset = 0;
}

else if (value === 'fullname') {
  const val = event.target.value.toLowerCase();

  const temp = this.temp.filter(function(d) {
    return d.fullName.toLowerCase().indexOf(val) !== -1 || !val;
  });

  console.log('temps ', temp);
  this.rows = temp;

 // this.table.offset = 0;
}
else if (value === 'roleName') {
 console.log('RoleName');
  const val = event.target.value.toLowerCase();

  const temp = this.temp.filter(function(d) {
    return d.roleName.toLowerCase().indexOf(val) !== -1 || !val;
  });

  this.rows = temp;

}

else if (value === 'branchName') {
  const val = event.target.value.toLowerCase();

  console.log('branchName value ', value);
  console.log('branchName ', val);
  const temp = this.temp.filter(function(d) {
    return d.branchName.toLowerCase().indexOf(val) !== -1 || !val;
  });

  this.rows = temp;

}
else if (value === 'dept') {
  const val = event.target.value.toLowerCase();

  const temp = this.temp.filter(function(d) {
    return d.deptName.toLowerCase().indexOf(val) !== -1 || !val;
  });

  this.rows = temp;
}

else if (value === 'status') {
     const val = event.target.value.toLowerCase();
     const temp = this.temp.filter(function(d) {
    return d.status.toLowerCase().indexOf(val) !== -1 || !val;
  });

  this.rows = temp;

}

  // swal('','Record not found','error');
  // this.rows = temp1;


}


resetPwd(): void {

  let getSelected = new List<any>(this.rows).Where(c=> c.select === true).ToArray();

  if(getSelected.length === 0){

    Swal('', 'Kindly Select User', 'warning');

    return;
  }

    Swal({
      title: '',
      text: `Are you sure you want to Reset Password for the Selected User(s)?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) 
      {
        this.loadPage = true;
        let element = <HTMLInputElement> document.getElementById("btnProcess");
        
        element.disabled = true;
        console.log('this.selectedRec: ', this.selectedRec);
      
        let url = 'Users/ResetPassword';
      
        let userDetails = this._GeneralService.getUserDetails();
      
        console.log('userDetails: ', userDetails);
      
        let val = 
        {
          admUserProfileDTO: getSelected,
          loginUserId: userDetails.userId,
        }
      
          this._GeneralService.post(val, url).subscribe(
            (data: any) => 
            {
              element.disabled = false;
              this.loadPage = false;
      
              let getUserDetails =  this._GeneralService.getUserDetails();
              console.log('getUserDetails token', getUserDetails)
              this.load(getUserDetails);
      
              Swal('', data.responseMessage, 'success');
            },
            (error: any) => {
              
              element.disabled = false;
              this.actionLoaderUpdate =  false;
           
              Swal('', error.error.message, 'error');
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });

  
}

unlockUser(): void {

  let getSelected = new List<any>(this.rows).Where(c=> c.select === true).ToArray();

  if(getSelected.length === 0) {

    Swal('', 'Kindly Select User', 'warning');

    return;
  }

    Swal({
      title: '',
      text: `Are you sure you want to Reset Password for the Selected User(s)?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) 
      {
        this.loadPage = true;
        let element = <HTMLInputElement> document.getElementById("btnProcess");
        
        element.disabled = true;
        console.log('this.selectedRec: ', this.selectedRec);
      
        let url = 'Users/ResetLocked';
      
        let userDetails = this._GeneralService.getUserDetails();
      
        console.log('userDetails: ', userDetails);
      
        let val = 
        {
          admUserProfileDTO: getSelected,
          loginUserId: userDetails.userId,
        }
      
          this._GeneralService.post(val, url).subscribe(
            (data: any) => 
            {
              element.disabled = false;
              this.loadPage = false;

              let getUserDetails =  this._GeneralService.getUserDetails();
              console.log('getUserDetails token', getUserDetails)
              this.load(getUserDetails);
      
              Swal('', data.responseMessage, 'success');
            },
            (error: any) => {
              
              element.disabled = false;
              this.actionLoaderUpdate =  false;
           
              Swal('', error.error.message, 'error');
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });
}

}