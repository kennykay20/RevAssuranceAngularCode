import { RejReasonComponent } from './../../RejectionReason/rej-reason/rej-reason.component';
import { AuthDetailsComponent } from './../auth-details/auth-details.component';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BankservicesetupDetailsComponent } from './../../../admin/bankServiceSetUp/bankservicesetup-details/bankservicesetup-details.component';
import { GenModel } from './../../../../model/gen.model';
import Swal from 'sweetalert2';
import { GeneralService } from './../../../../services/genservice.service';
import { Component, ViewChild, OnInit, ElementRef, Directive, Input, } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { List } from 'linqts';
import { WaitingDialog } from '../../../../services/services';
import { LocalStorageService } from 'angular-2-local-storage';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { CbsTransaction } from '../../../../model/cbsTransaction.model';


declare var $;


@Component({
  selector: 'app-auth-list',
  templateUrl: './auth-list.component.html',
  styleUrls: ['./auth-list.component.scss']
})
export class AuthListComponent implements OnInit {

  @ViewChild('dataTable') table: ElementRef;

  dataTable: any;

  editing = {};

  rows: CbsTransaction[];
  columns = [];
  temp: CbsTransaction[];
  current_page = 1;
  loderTimer = GenModel.LoderTimer;
  selectAllText: any;
  actionLoaderDismiss = false;
  actionLoaderUpdate = false;
  tabVlues = 1;
  selectedAll = false;

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
  retryService: number = GenModel.retryService;
  retryMessage: any;
  retryDelayServiceInterval: number = GenModel.retryDelayServiceInterval;
  internetConMsg = GenModel.internetConMsg;
  RetryAttmMsg = GenModel.RetryAttmMsg;

  pageLmit = GenModel.pageLmit;
  btnConfirm = GenModel.btnConfirm;
  searchUserColumns: any;
  ItemsPerPage: any;
  columnId: any
  statusTrack: any;
  errorOccur = GenModel.errorOccur;

  selectedAllTrans = false;

  unAuthorized = false;


  tab1 = '';
  tab2 = '';



  coinwallet: string[] = ['wallet1', 'wallet2'];
  selectedwallet = this.coinwallet[0];


  origMobile = [];

  step = 'brown';

  apiIsDown = GenModel.apiIsDown;

  selectedCalss = 'selected nav-item cursorPointer';
  selectedCalss2 = 'selected nav-item cursorPointer';
  selectedCalss3 = 'selected nav-item cursorPointer';

  serviceId = 14;

  chargeSetup: any;
  assignRole: any
  menuId: any

  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public _GeneralService: GeneralService,
    private _localStorageService: LocalStorageService,
    private route: ActivatedRoute) {
    this.settings = this.appSettings.settings;

    let queryString = this.route.snapshot.params.mid;
    this.menuId = _GeneralService.menuId(queryString);
    //   console.log('**data param4', param4);
  }

  ngOnInit() {

    this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    let getUserDetails = this._GeneralService.getUserDetails();

    this.load(getUserDetails);

    this.swapTab(1);


  }

  load(param: any): void {

    this.loadPage = true;

    let track = 0;
    let url = 'AuthTrans/GetAll';

    let val =
    {
      pdtCurrentDate: param.bankingDate,
      psBranchNo: param.branchNo,
      pnDeptId: param.deptId,
      pnGlobalView: 'N', // hard code will later get this from role Assing
      serviceId: this.serviceId,
      roleId: param.roleId,
      menuId: this.menuId,
      userId: param.userId
    }

    console.log('bank guarantee', val);

    this._GeneralService.post(val, url)
      .retryWhen((err) => {

        return err.scan((retryCount) => {

          retryCount += 1;
          track = retryCount;
          if (retryCount < this.retryService) {

            this.retryMessage = this.RetryAttmMsg;

            return retryCount;
          }
          else {
            this.retryMessage = this.errorOccur;
            throw (err);
          }
        }, 0).delay(this.retryDelayServiceInterval);
      }).subscribe(
        (data: any) => {

          /*this.loadPage = false;
          this.chargeSetup = data.charge;
          this.loadPage = false;
          this.assignRole = data.roleAssign;
          if (data._response.length > 0) {
            this.temp = data._response;
            // this.rows = data._response;
            console.log('Auth list: ', data);
            this.rows = data._response.slice(0, this.pageLmit);
            this.changePage(this.current_page);
          }
   */
          //console.log('servces', data);
          this.loadPage = false;
          this.temp = data._response;
          this.rows = data;
         
          this.assignRole = data.roleAssign

          if (data._response.length > 0) {
            this.rows = data._response.slice(0, this.pageLmit);
            this.changePage(this.current_page);
          }

        },
        (error: any) => {
          if (track === this.retryService) {
            Swal('', this.apiIsDown, 'error');
          }
          else {
            Swal('', this.errorOccur, 'error');

          }
        });
  }


  // From BElow is the Pagination on Mobile ///

  prevPage() {

    if (this.current_page > 1) {
      this.current_page--;
      this.changePage(this.current_page);
    }
  }

  nextPage() {

    if (this.current_page < this.numPages()) {
      this.current_page++;
      this.changePage(this.current_page);
    }
  }

  changePage(page) {
    console.log('changePage', page);
    let btn_next = document.getElementById("btn_next");
    let btn_prev = document.getElementById("btn_prev");
    // let listing_table = document.getElementById("listingTable");
    let page_span = document.getElementById("page");

    let linePages = this.numPages();
    // Validate page
    if (page < 1) page = 1;

    if(linePages != null)
    {
      if (page > this.numPages()) page = this.numPages();
    }

    let tem = [];

    for (let i = (page - 1) * this.pageLmit; i < (page * this.pageLmit) && i < this.temp.length; i++) {
      tem.push(this.temp[i]);
    }

    this.rows = tem;
    if(linePages != null)
    {
      page_span.innerHTML = page + "/" + linePages;
    }

  }

  numPages(): any {

    let numberOfPages = null;
    if(this.temp != null)
    {
      numberOfPages = Math.ceil(this.temp.length / this.pageLmit);
      return numberOfPages;
    }
    return numberOfPages;
  }

  // onload = function () {
  //   this.changePage(1);
  // };




  select(row) {
    console.log('selected row', row);

    let valRe = new List<any>(this.rows).FirstOrDefault(c => c.itbid === row.itbId);

    if (row.serviceStatus === "Unauthorized") {
      swal('', 'This request has already been Processed', 'error')
      return;
    }

    const objIndex = this.selectedRec.findIndex(obj => obj.itbId === row.itbId);

    if (objIndex > -1) {
      this.selectedRec.splice(objIndex, 1);
    }
    else {
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


    let selonlyLoadedStatus = new List<any>(this.rows).Where(c => c.serviceStatus != 'Unauthorized').ToArray();

    //console.log('selonlyLoadedStatus: ', selonlyLoadedStatus);

    let seletAuth = new List<any>(this.rows).Where(c => c.serviceStatus === 'Unauthorized').ToArray();

    //console.log('selonly Auth: ', seletAuth);

    for (let i = 0; i < selonlyLoadedStatus.length; i++) {

      selonlyLoadedStatus[i].select = this.selectedAllTrans;

      this.rows[i].select = this.selectedAllTrans;

      const objIndex = this.selectedRec.findIndex(obj => obj.itbId === selonlyLoadedStatus[i].itbId);

      if (objIndex > -1) {
        this.selectedRec.splice(objIndex, 1);
      }
      else {
        this.selectedRec.push({
          itbId: selonlyLoadedStatus[i].itbId,
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

      this.rows[i].select = this.selectedAllTrans;
      //console.log('rows[i].select: = ', this.selectedAllTrans);
    }

    //console.log('selectAll this.rows: ', this.rows);

  }

  checkUnChecked(row: CbsTransaction) {

    let valRe = new List<any>(this.rows).FirstOrDefault(c=> c.transTracer === row.transTracer);
    //console.log('valRe ', valRe);
    //console.log('selected row', row);
    for (let i of this.rows) {
      //console.log('i select ', i.transTracer);
      if (i.transTracer == row.transTracer)
        i.select = row.select;
        //console.log('i select ', i.select);
        //console.log(' row select ', row.select);
    }
  }

  userAction(status: any): any {
    // this.displayloader = true;
    if (this.selectedRec.length == 0) {
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
      this.loadPage = true;

      let url = `auth/authorize-user?token=` + token;


      this._GeneralService.post(value, url).subscribe(
        (data: any) => {

          // this.displayloader =  false;
          this.loadPage = false;
          this.statusTrack = '';
          this.selectedRec = [];

          let msg = 'Action Completed Successfully!';
          Swal('', data.message, 'success');
          let getUserDetails = this._GeneralService.getUserDetails();
          this.load(getUserDetails);
          // this.btnActionApprove =  'Approve';


        },
        (error: any) => {


          this.displayloader = false;
          this.loadPage = false;

          Swal('', error.error.message, 'error');

        });

    }




  }


  updateFilter1(event, value: any) {

    console.log('updateFilter1 value', value);

    if (value === 'TRANS DATE') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.transactionDate.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'TRANS TRACER') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.transTracer.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'SERVICE TYPE') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.servicename.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'DR ACCT NO') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.drAcctNo.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'DR ACCT TYPE') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.drAcctType.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'DR ACCT NAME') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.drAcctName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'CR ACCT NAME') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.crAcctName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'DR TC') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.drAcctTC.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'AMOUNT') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.amount.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'CHARGE AMOUNT') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.drAcctChargeAmt.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'CCY') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.ccyCode.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'CR ACCT NO') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.crAcctNo.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'CR ACCT TYPE') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.crAcctType.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'CR ACCT NAME') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.crAcctName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'STATUS') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.status.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'DEPT') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.deptName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'ORIG BRANCH') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.originatingBranchName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }




  }


  action(actionName: any, record: any) {

    this.loadPage = true;
    setTimeout(() => {
      
      this.loadPage = false;
      let dialogRef = this.dialog.open(AuthDetailsComponent, {
        width: '1400px !important',
        height: '600px !important',
        data: {
          actionName: actionName, record: record, createdBy: '',
          chargeSetup: this.chargeSetup, serviceId: this.serviceId
        },

      });

      dialogRef.afterClosed().subscribe(result => {

        if (result === 'Y') {
          let getUserDetails = this._GeneralService.getUserDetails();
          this.load(getUserDetails);
        }

      });

    }, this.loderTimer);
  }







  swapTab(value) {
    console.log('swapTab: ', value);

    if (value === 1) {
      this.tab1 = 'active';
      // this.selectedCalss = 'selected nav-item cursorPointer';
      // this.selectedCalss2 = 'notselected';
      this.tab2 = '';

    }
    if (value === 2) {
      this.tab1 = '';
      this.tab2 = 'active';
      // this.selectedCalss = 'notselected';
      // this.selectedCalss2 = 'selected nav-item cursorPointer';


    }

    this.tabVlues = value;
  }

  public onOptionsSelected(event) {
    // console.log('onOptionsSelected', event);
    this.pageLmit = event.target.value;
    console.log('pageLimit: ', this.pageLmit);

    this.rows = this.temp.slice(0, this.pageLmit);

    console.log('allRow: ', this.rows);


    this.changePage(this.current_page);
  }

  authTrans(): void {

    let getSelected = new List<any>(this.rows).Where(c => c.select === true).ToArray();

    if (getSelected.length === 0) {

      Swal('', this.selectTransMsg, 'warning');

      return;
    }



    Swal({

      title: '',
      text: 'Are you Sure you want to Authorize  the Selected Transaction(s)?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'Cancel'

    }).then((result) => {

      if (result.value) {

        this.loadPage = true;
        //  let element = <HTMLInputElement> document.getElementById("btnProcess");

        //  element.disabled = true;
        console.log('this.selectedRec: ', this.selectedRec);

        let url = 'AuthTrans/AuthTrans';

        let userDetails = this._GeneralService.getUserDetails();

        console.log('userDetails: ', userDetails);

        let val =
        {
          ListCbsTransactionDTO: getSelected,
          loginUserName: userDetails.userName,
          deptId: userDetails.deptId,
          userId: userDetails.userId,
        }

        this._GeneralService.post(val, url).subscribe(
          (data: any) => {
            //element.disabled = false;
            this.loadPage = false;
            console.log("after post ", data)
            if (data.responseCode !== 0) {

              Swal('', data.responseMessage, 'error');
              return;
            }

            let getUserDetails = this._GeneralService.getUserDetails();
            console.log('getUserDetails token', getUserDetails)
            this.load(getUserDetails);

            Swal('', data.responseMessage, 'success');
          },
          (error: any) => {

            //  element.disabled = false;
            //  this.actionLoaderUpdate =  false;
            this.loadPage = false;
            Swal('', error.error.responseMessage, 'error');
          });


      }
      else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });






  }

  openRejectionReason(): void {

    let getSelected = new List<any>(this.rows).Where(c => c.select === true).ToArray();

    if (getSelected.length === 0) {

      Swal('', this.selectTransMsg, 'warning');

      return;
    }
    let dialogRef = this.dialog.open(RejReasonComponent, {
      width: '600px',
      height: '600px',
      // hasBackdrop: true,
      // autoFocus: true,
      disableClose: true,
      // data: { actionName: action, record:  record, createdBy: createdBy, chargeSetup: this.chargeSetup},

    });
    dialogRef.afterClosed().subscribe(result => {

      if (result === undefined) {
        return;
      }
      console.log('result Selected Rejecteion', result);
      this.loadPage = true;
      if (result.length > 0) {
        this.reject(result);
      }


    });
  }

  reject(result): void {

    let getSelected = new List<any>(this.rows).Where(c => c.select === true).ToArray();

    if (getSelected.length === 0) {

      Swal('', this.selectTransMsg, 'warning');

      return;
    }

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement>document.getElementById("btnProcess");

    element.disabled = true;
    console.log('this.selectedRec: ', this.selectedRec);

    let url = 'AuthTrans/RejectTrans';

    let userDetails = this._GeneralService.getUserDetails();

    console.log('userDetails: ', userDetails);


    let val =
    {
      ListCbsTransactionDTO: getSelected,
      loginUserName: userDetails.userName,
      deptId: userDetails.deptId,
      userId: userDetails.userId,
      listRejectionReasonDTO: result
    }

    this.loadPage = true;

    console.log('url: ', url);

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {
        element.disabled = false;
        this.actionLoaderUpdate = false;

        let getUserDetails = this._GeneralService.getUserDetails();
        console.log('getUserDetails token', getUserDetails)
        this.load(getUserDetails);


        Swal('', data.sErrorText, 'success');
        this.loadPage = false;
      },
      (error: any) => {

        element.disabled = false;
        this.actionLoaderUpdate = false;
        this.loadPage = false;
        Swal('', error.error.message, 'error');
      });


  }


  postTras(): void {

    let getSelected = new List<any>(this.rows).Where(c => c.serviceStatus !== 'Unauthorized' && c.select === true).ToArray();

    if (getSelected.length === 0) {

      Swal('', this.selectTransMsg, 'warning');

      return;
    }

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement>document.getElementById("btnProcess");

    element.disabled = true;
    console.log('this.selectedRec: ', this.selectedRec);

    let url = 'PostTrans/PostTrans';

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
      (data: any) => {
        element.disabled = false;
        this.actionLoaderUpdate = false;

        let getUserDetails = this._GeneralService.getUserDetails();
        console.log('getUserDetails token', getUserDetails)
        this.load(getUserDetails);


        Swal('', data.sErrorText, 'success');
      },
      (error: any) => {

        element.disabled = false;
        this.actionLoaderUpdate = false;

        Swal('', error.error.message, 'error');
      });


  }

  






}

