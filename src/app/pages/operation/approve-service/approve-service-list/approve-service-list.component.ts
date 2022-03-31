import { TokenDetailsComponent } from './../../token/token-details/token-details.component';
import { RejReasonComponent } from './../../RejectionReason/rej-reason/rej-reason.component';
import { ApproveServiceDetailsComponent } from './../approve-service-details/approve-service-details.component';

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
import { ApproveServiceList } from '../../../../model/apprService.model';
import { UserDetails } from '../../../../model/userDetails';
import { ApiResponse } from '../../../../model/apiResponse.model';
import { ChqBookReqDetailsComponent } from '../../chq-book-req/chq-book-req-details/chq-book-req-details.component';
import { CounterChqReqDetailsComponent } from '../../counter-chq-req/counter-chq-req-details/counter-chq-req-details.component';
import { StopChqDetailsComponent } from '../../stop-chq/stop-chq-details/stop-chq-details.component';
import { BusinessSearchDetailsComponent } from '../../business-search/business-search-details/business-search-details.component';
import { AccountClosureDetailsComponent } from '../../account-closure/account-closure-details/account-closure-details.component';
import { CardReqDetailsComponent } from '../../card-req/card-req-details/card-req-details.component';
import { StatementReqDetailsComponent } from '../../statement-req/statement-req-details/statement-req-details.component';
import { TradeRefDetailsComponent } from '../../trade-ref/trade-ref-details/trade-ref-details.component';
import { RefLetterDetailsComponent } from '../../ref-letter/ref-letter-details/ref-letter-details.component';
import { ApgDetailsComponent } from '../../apg/apg-details/apg-details.component';
import { OverdraftReqDetailsComponent } from '../../overdraft-req/overdraft-req-details/overdraft-req-details.component';
import { AmortizationDetailsComponent } from '../../amortization/amortization-details/amortization-details.component';
import { DocRetrievalDetailsComponent } from '../../doc-retrieval/doc-retrieval-details/doc-retrieval-details.component';
import { PinResetDetailsComponent } from '../../pin-reset/pin-reset-details/pin-reset-details.component';

declare var $;



@Component({
  selector: 'app-approve-service-list',
  templateUrl: './approve-service-list.component.html',
  styleUrls: ['./approve-service-list.component.scss']
})
export class ApproveServiceListComponent implements OnInit {
  //  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('dataTable') table: ElementRef;

  dataTable: any;

  editing = {};
  apiResponse: ApiResponse;
  userDetails: UserDetails;

  loderTimer = GenModel.LoderTimer;
  rows: ApproveServiceList[];
  columns = [];
  temp = [];
  current_page = 1;


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

  serviceId = 1;

  chargeSetup: any;
  showPagination = false;

  menuId: any
  constructor(
        public appSettings: AppSettings, 
        public dialog: MatDialog,
        public _GeneralService: GeneralService, 
        private _localStorageService: LocalStorageService,
        private route: ActivatedRoute) {
        this.settings = this.appSettings.settings;
        let queryString = this.route.snapshot.params.mid;
        this.menuId = _GeneralService.menuId(queryString);
  }




  ngOnInit() {
    // console.log()

    this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    this.userDetails = this._GeneralService.getUserDetails();
    // console.log('getUserDetails token', getUserDetails)
    this.load(this.userDetails);

    this.swapTab(1);


  }

  load(param: any): void {

    this.loadPage = true;
    let track = 0;
    let url = 'ApproveTrans/GetAll';
    let val =
    {
      pdtCurrentDate: param.bankingDate,
      psBranchNo: param.branchNo,
      pnDeptId: param.deptId,
      serviceId: this.serviceId,
      roleId: param.roleId,
      menuId: this.menuId
    }

    console.log('token param load', val);

    this._GeneralService.post(val, url)
      /* .retryWhen((err) => {
 
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
       }).
       */
      .subscribe(
        (data: any) => {
          console.log('data APPROVES: ', data);
          this.loadPage = false;
          this.temp = data._response;
          this.rows = data._response;

          this.chargeSetup = data.charge;
          this.loadPage = false;
          if (this.rows.length > 0) {
            this.rows = data._response.slice(0, this.pageLmit);
            this.changePage(this.current_page);
            this.showPagination = true;
          } 
          else 
          {
            this.showPagination = false;
          }

          console.log(' this.rows: ', this.rows);

        },
        (error: any) => {
          console.log('error: ', error)
          if (track === this.retryService) {
            // Swal('', this.apiIsDown, 'error');
          }
          else {
            // Swal('', this.errorOccur, 'error');
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
    let btn_next = document.getElementById("btn_next");
    let btn_prev = document.getElementById("btn_prev");
    // let listing_table = document.getElementById("listingTable");
    let page_span = document.getElementById("page");

    // Validate page
    if (page < 1) page = 1;

    if (page > this.numPages()) page = this.numPages();

    let tem = [];

    for (let i = (page - 1) * this.pageLmit; i < (page * this.pageLmit) && i < this.temp.length; i++) {
      tem.push(this.temp[i]);
    }

    this.rows = tem;

    page_span.innerHTML = page + "/" + this.numPages();

  }

  numPages() {
    return Math.ceil(this.temp.length / this.pageLmit);
  }

  onload = function () {
    this.changePage(1);
  };

  selectAll() {

    for (let i = 0; i < this.rows.length; i++) {

      this.rows[i].select = this.selectedAllTrans;

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






    if (value === 'transDate') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.transactionDate.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      //this.table.offset = 0;
    }
    if (value === 'servicename') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.servicename.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'acctNo') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.acctNo.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'acctName') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.acctName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'acctType') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.acctType.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'amount') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.amount.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'status') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.status.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'origBranch') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.branchName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'user') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.tellersName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }

  }



  action(actionName: any, record: any) {

    let rowsApprove = new List<any>(this.rows).Where(c => c.itbId === record.itbId).ToArray();


    
    console.log('record ', record);
    console.log('record.serviceId', record.serviceId);
    console.log('rowsApprove ', rowsApprove);
    this.loadPage = true;
    setTimeout(() => {
      this.loadPage = false;
      if (record.serviceId == 1) {

        let dialogRef = this.dialog.open(TokenDetailsComponent, {
          width: '1500px',
          height: '650px',

          disableClose: true,
          data: {
            actionName: actionName, record: record,
            chargeSetup: this.chargeSetup,
            itbId: record.itbId,
            serviceId: record.serviceId,
            rowsApprove: rowsApprove
          },

        });

        dialogRef.afterClosed().subscribe(result => {

          if (result === 'Y') {
            let getUserDetails = this._GeneralService.getUserDetails();
            this.load(getUserDetails);
          }
        });

      }

      if (record.serviceId == 2) {

        let dialogRef = this.dialog.open(ChqBookReqDetailsComponent, {

          width: '1500px',
          height: '650px',
          disableClose: true,
          data: {
            actionName: actionName, record: record,
            chargeSetup: this.chargeSetup,
            itbId: record.itbId,
            serviceId: record.serviceId,
            rowsApprove: rowsApprove
          },

        });

        dialogRef.afterClosed().subscribe(result => {

          if (result === 'Y') {
            let getUserDetails = this._GeneralService.getUserDetails();
            this.load(getUserDetails);
          }
        });


      }
      if (record.serviceId == 3) {

        let dialogRef = this.dialog.open(CounterChqReqDetailsComponent, {

          width: '1500px',
          height: '650px',
          disableClose: true,
          data: {
            actionName: actionName, record: record,
            chargeSetup: this.chargeSetup,
            itbId: record.itbId,
            serviceId: record.serviceId,
            rowsApprove: rowsApprove
          },

        });

        dialogRef.afterClosed().subscribe(result => {

          if (result === 'Y') {
            let getUserDetails = this._GeneralService.getUserDetails();
            this.load(getUserDetails);
          }
        });


      }
      if (record.serviceId == 4) {

        console.log('serviceId 4 for stopchque');
        let dialogRef = this.dialog.open(StopChqDetailsComponent, {

          width: '1500px',
          height: '650px',
          disableClose: true,
          data: {
            actionName: actionName, record: record,
            chargeSetup: this.chargeSetup,
            itbId: record.itbId,
            serviceId: record.serviceId,
            rowsApprove: rowsApprove
          },

        });

        dialogRef.afterClosed().subscribe(result => {

          if (result === 'Y') {
            let getUserDetails = this._GeneralService.getUserDetails();
            this.load(getUserDetails);
          }
        });


      }
      if (record.serviceId == 5) {

        console.log('service for busines search 5');
        let dialogRef = this.dialog.open(BusinessSearchDetailsComponent, {

          width: '1500px',
          height: '650px',
          disableClose: true,
          data: {
            actionName: actionName, record: record,
            chargeSetup: this.chargeSetup,
            itbId: record.itbId,
            serviceId: record.serviceId,
            rowsApprove: rowsApprove
          },

        });

        dialogRef.afterClosed().subscribe(result => {

          if (result === 'Y') {
            let getUserDetails = this._GeneralService.getUserDetails();
            this.load(getUserDetails);
          }
        });


      }
      if (record.serviceId == 6) {

        let dialogRef = this.dialog.open(AccountClosureDetailsComponent, {

          width: '1500px',
          height: '650px',
          disableClose: true,
          data: {
            actionName: actionName, record: record,
            chargeSetup: this.chargeSetup,
            itbId: record.itbId,
            serviceId: record.serviceId,
            rowsApprove: rowsApprove
          },

        });

        dialogRef.afterClosed().subscribe(result => {

          if (result === 'Y') {
            let getUserDetails = this._GeneralService.getUserDetails();
            this.load(getUserDetails);
          }
        });


      }
      if (record.serviceId == 7) {

        let dialogRef = this.dialog.open(CardReqDetailsComponent, {

          width: '1500px',
          height: '650px',
          disableClose: true,
          data: {
            actionName: actionName, record: record,
            chargeSetup: this.chargeSetup,
            itbId: record.itbId,
            serviceId: record.serviceId,
            rowsApprove: rowsApprove
          },

        });

        dialogRef.afterClosed().subscribe(result => {

          if (result === 'Y') {
            let getUserDetails = this._GeneralService.getUserDetails();
            this.load(getUserDetails);
          }
        });


      }
      if (record.serviceId == 8) {

        let dialogRef = this.dialog.open(StatementReqDetailsComponent, {

          width: '1500px',
          height: '650px',
          disableClose: true,
          data: {
            actionName: actionName, record: record,
            chargeSetup: this.chargeSetup,
            itbId: record.itbId,
            serviceId: record.serviceId,
            rowsApprove: rowsApprove
          },

        });

        dialogRef.afterClosed().subscribe(result => {

          if (result === 'Y') {
            let getUserDetails = this._GeneralService.getUserDetails();
            this.load(getUserDetails);
          }
        });


      }
      if (record.serviceId == 9) {

        let dialogRef = this.dialog.open(TradeRefDetailsComponent, {

          width: '1500px',
          height: '650px',
          disableClose: true,
          data: {
            actionName: actionName, record: record,
            chargeSetup: this.chargeSetup,
            itbId: record.itbId,
            serviceId: record.serviceId,
            rowsApprove: rowsApprove
          },

        });

        dialogRef.afterClosed().subscribe(result => {

          if (result === 'Y') {
            let getUserDetails = this._GeneralService.getUserDetails();
            this.load(getUserDetails);
          }
        });


      }
      if (record.serviceId == 10) {

        let dialogRef = this.dialog.open(RefLetterDetailsComponent, {

          width: '1500px',
          height: '650px',
          disableClose: true,
          data: {
            actionName: actionName, record: record,
            chargeSetup: this.chargeSetup,
            itbId: record.itbId,
            serviceId: record.serviceId,
            rowsApprove: rowsApprove
          },

        });

        dialogRef.afterClosed().subscribe(result => {

          if (result === 'Y') {
            let getUserDetails = this._GeneralService.getUserDetails();
            this.load(getUserDetails);
          }
        });

        //this.View(actionName, record, '')
      }
      if (record.serviceId == 11
        || record.serviceId == 14
        || record.serviceId == 18
        || record.serviceId == 19
        || record.serviceId == 20
        || record.serviceId == 22
        || record.serviceId == 23) {

        let dialogRef = this.dialog.open(ApgDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,
          // autoFocus: true,
          width: '1500px',
          height: '650px',
          disableClose: true,
          data: {
            actionName: actionName, record: record,
            chargeSetup: this.chargeSetup,
            itbId: record.itbId,
            serviceId: record.serviceId,
            rowsApprove: rowsApprove
          },

        });

        dialogRef.afterClosed().subscribe(result => {

          if (result === 'Y') {
            let getUserDetails = this._GeneralService.getUserDetails();
            this.load(getUserDetails);
          }
        });

        //this.View(actionName, record, '')
      }
      if (record.serviceId == 13) {

        let dialogRef = this.dialog.open(OverdraftReqDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,
          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: actionName, record: record,
            chargeSetup: this.chargeSetup,
            itbId: record.itbId,
            serviceId: record.serviceId,
            rowsApprove: rowsApprove
          },

        });

        dialogRef.afterClosed().subscribe(result => {

          if (result === 'Y') {
            let getUserDetails = this._GeneralService.getUserDetails();
            this.load(getUserDetails);
          }
        });

        //this.View(actionName, record, '')
      }
      if (record.serviceId == 15) {

        let dialogRef = this.dialog.open(AmortizationDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,
          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: actionName, record: record,
            chargeSetup: this.chargeSetup,
            itbId: record.itbId,
            serviceId: record.serviceId,
            rowsApprove: rowsApprove
          },

        });

        dialogRef.afterClosed().subscribe(result => {

          if (result === 'Y') {
            let getUserDetails = this._GeneralService.getUserDetails();
            this.load(getUserDetails);
          }
        });

        //this.View(actionName, record, '')
      }
      if (record.serviceId == 16) {

        let dialogRef = this.dialog.open(DocRetrievalDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,
          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: actionName, record: record,
            chargeSetup: this.chargeSetup,
            itbId: record.itbId,
            serviceId: record.serviceId,
            rowsApprove: rowsApprove
          },

        });

        dialogRef.afterClosed().subscribe(result => {

          if (result === 'Y') {
            let getUserDetails = this._GeneralService.getUserDetails();
            this.load(getUserDetails);
          }
        });

        //this.View(actionName, record, '')
      }
      if (record.serviceId == 21) {

        let dialogRef = this.dialog.open(PinResetDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,
          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: actionName, record: record,
            chargeSetup: this.chargeSetup,
            itbId: record.itbId,
            serviceId: record.serviceId,
            rowsApprove: rowsApprove
          },

        });

        dialogRef.afterClosed().subscribe(result => {

          if (result === 'Y') {
            let getUserDetails = this._GeneralService.getUserDetails();
            this.load(getUserDetails);
          }
        });

        //this.View(actionName, record, '')
      }



    }, this.loderTimer);



  }

  View(action: any, record: any, createdBy: any): void {
    console.log('openToken  record', record);
    console.log('openToken  record.serviceId', record.serviceId);
    if (record.serviceId === 1) {
      //this.openToken(action, record, createdBy);
      console.log('openToken View1');

      let dialogRef = this.dialog.open(TokenDetailsComponent, {

        // width: '3500px',
        // height: '800px',
        // hasBackdrop: true,
        // autoFocus: true,
        disableClose: true,
        data: { actionName: action, record: record, createdBy: createdBy, chargeSetup: this.chargeSetup },
      });
      dialogRef.afterClosed().subscribe(result => {

        if (result === 'Y') {
          let getUserDetails = this._GeneralService.getUserDetails();
          this.load(getUserDetails);
        }
      });
    }

  }

  openToken(action: any, record: any, createdBy: any) {

    console.log('openToken star');

    let dialogRef = this.dialog.open(TokenDetailsComponent, {

      // width: '3500px',
      // height: '800px',
      // hasBackdrop: true,
      // autoFocus: true,
      disableClose: true,
      data: { actionName: action, record: record, createdBy: createdBy, chargeSetup: this.chargeSetup },
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result === 'Y') {
        let getUserDetails = this._GeneralService.getUserDetails();
        this.load(getUserDetails);
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


      console.log('result Selected Rejecteion', result);
      if (result === undefined) {
        return;
      }
      if (result.length > 0) {
        this.loadPage = true;
        this.reject(result);
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

    this._GeneralService.homePage(val, url)
      .subscribe(
        (data: any) => {


          this.View(action, record, data.fullName)


        },
        (error: any) => {



        });
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



  approve(): void {

    let getSelected = new List<any>(this.rows).Where(c => c.select === true).ToArray();

    if (getSelected.length === 0) {

      Swal('', this.selectTransMsg, 'warning');

      return;
    }
    Swal({
      title: '',
      text: 'Are you Sure you want to Approve the Selected Transaction(s)?',
      type: 'warning',
      // input: 'number',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'Cancel'
    }).then((result) => {

      if (result.value) {

        this.loadPage = true;
        this.actionLoaderUpdate = true;
        let element = <HTMLInputElement>document.getElementById("btnProcess");

        element.disabled = true;
        console.log('this.selectedRec: ', this.selectedRec);

        let url = 'ApproveTrans/ApproveTrans';

        let val =
        {
          listGetApproveServiceDTO: getSelected,
          loginUserName: this.userDetails.userName,
          userId: this.userDetails.userId,
          transactionDate: this.userDetails.bankingDate
        }

        this._GeneralService.post(val, url).subscribe(
          (data: any) => {
            console.log('approve res: ', val);

            element.disabled = false;
            this.actionLoaderUpdate = false;
            this.loadPage = false;

            this.apiResponse = data;

            this.load(this.userDetails);

            Swal('', this.apiResponse.responseMessage, 'success');
          },
          (error: any) => {

            this.loadPage = false;
            element.disabled = false;
            this.actionLoaderUpdate = false;

            Swal('', error.error.responseMessage, 'error');
          });
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });


  }

  reject(result): void {

    let getSelected = new List<any>(this.rows).Where(c => c.select === true).ToArray();

    if (getSelected.length === 0) {

      Swal('', this.selectTransMsg, 'warning');

      return;
    }

    //this.actionLoaderUpdate = true;
    // let element = <HTMLInputElement>document.getElementById("btnProcess");

    // element.disabled = true;
    console.log('this.selectedRec: ', this.selectedRec);

    let url = 'ApproveTrans/RejectTrans';

    let userDetails = this._GeneralService.getUserDetails();

    console.log('userDetails: ', userDetails);


    let val =
    {
      listGetApproveServiceDTO: getSelected,
      loginUserName: userDetails.userName,
      userId: userDetails.userId,
      listRejectionReasonDTO: result
    }

    this.loadPage = true;

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {
       // element.disabled = false;
        //this.actionLoaderUpdate = false;

        let getUserDetails = this._GeneralService.getUserDetails();
        console.log('getUserDetails token', getUserDetails)
        this.load(getUserDetails);


        Swal('', data.sErrorText, 'success');
        this.loadPage = false;
      },
      (error: any) => {
        //element.disabled = false;
        //this.actionLoaderUpdate = false;
        this.loadPage = false;
        Swal('', error.error.message, 'error');
      });
  }

  dismissTrans(): void {

    let getSelected = new List<any>(this.rows).Where(c => c.serviceStatus !== 'Unauthorized' && c.select === true).ToArray();

    if (getSelected.length === 0) {

      Swal('', this.selectTransMsg, 'warning');

      return;
    }



    Swal({
      title: '',
      text: 'Are you sure you want Dismiss the Selected Request? ',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'YES',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'NO'
    }).then((result) => {
      if (result.value) {

        this.actionLoaderDismiss = true;
        let element = <HTMLInputElement>document.getElementById("btnDismiss");

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
          (data: any) => {
            element.disabled = false;
            this.actionLoaderDismiss = false;

            let getUserDetails = this._GeneralService.getUserDetails();
            console.log('getUserDetails token', getUserDetails)
            this.load(getUserDetails);


            Swal('', data.sErrorText, 'success');
          },
          (error: any) => {

            element.disabled = false;
            this.actionLoaderDismiss = false;

            Swal('', error.error.message, 'error');
          });



      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });


  }






  radio(event) {
    console.log('radio', event.value)

    if (event.value === 'All') {
      let UnAuth = new List<any>(this.temp).Where(c => c.itbId > 0).ToArray();
      this.rows = UnAuth.slice(0, this.pageLmit);
    }
    if (event.value === 'Processed') {

      let proc = new List<any>(this.temp).Where(c => c.serviceStatus === "Unauthorized").ToArray();
      this.rows = proc.slice(0, this.pageLmit);
    }


    console.log('this.rows: ', this.rows)


    this.changePage(this.current_page);


  }

  public onOptionsSelected(event) {

    this.pageLmit = event.target.value;
    console.log('pageLimit: ', this.pageLmit);

    if (this.temp.length > 0) {

      this.rows = this.temp.slice(0, this.pageLmit);

      console.log('allRow: ', this.rows);

      this.changePage(this.current_page);
    }

  }



}
