

//import { RejReasonComponent } from './../RejectionReason/rej-reason/rej-reason.component';
import { GenModel } from './../../../model/gen.model';
import Swal from 'sweetalert2';
import { GeneralService } from './../../../services/genservice.service';
import { Component, ViewChild, OnInit, ElementRef, Directive, Input, } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { List } from 'linqts';
import { WaitingDialog } from '../../../services/services';
import { LocalStorageService } from 'angular-2-local-storage';
import swal from 'sweetalert2';
import { UserDetails } from '../../../model/userDetails';
import { CbsTransaction } from '../../../model/cbsTransaction.model';
import { TransEnquiry } from '../../../model/TransEnquiry.model';
import { admService } from '../../../model/admService';
//import { AmortizationDetailsComponent } from '../amortization-details/amortization-details.component';
//import { ArmortizationParam } from '../../../../model/ArmortizationParam.model';
import { OprArmortizationSchedule } from '../../../model/OprArmortizationSchedule.model';
import { ArmortizationParam } from '../../../model/ArmortizationParam.model';
import { AllActionUser } from '../../../model/AllActionUser.model';


declare var $;

@Component({
  selector: 'app-txn-rep',
  templateUrl: './txn-rep.component.html',
  styleUrls: ['./txn-rep.component.scss']
})
export class TxnRepComponent implements OnInit {

  @ViewChild('dataTable') table: ElementRef;

  statuses = ['Posted', 'Not Validated', 'Unposted']
  totalRec = 0;
  admService: admService[];
  currencies = []
  branches = []
  dataTable: any;
  loderTimer = GenModel.LoderTimer;
  editing = {};
  rows: CbsTransaction[];
  temp: CbsTransaction[];
  // rows: OprArmortizationSchedule [];
  columns = [];

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
  loadPage = false;
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

  pageLmit = 100;// GenModel.pageLmit;
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

  serviceId = 15;

  chargeSetup: any;
  PostTransCount: Number = 0;
  SeekAppCount: Number = 0;
  userDetails: UserDetails;

  armortizationParam: ArmortizationParam;

  constructor(public appSettings: AppSettings,
    public dialog: MatDialog,
    public _GeneralService: GeneralService,
    private _localStorageService: LocalStorageService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    this.userDetails = this._GeneralService.getUserDetails();
    this.swapTab(1);
    this.armortizationParam = new ArmortizationParam();

    this.armortizationParam.pdtStartDate = this.userDetails.bankingDate;
    this.armortizationParam.pdtEndDate = this.userDetails.bankingDate

    this.loadAll();

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

  fromDate(event) {
    this.armortizationParam.pdtStartDate = this._GeneralService.dateconvertion(event.target.value);
  }

  toDate(event) {
    this.armortizationParam.pdtEndDate = this._GeneralService.dateconvertion(event.target.value);
  }

  formAmt(event) {

    this.armortizationParam.totalAmt = this._GeneralService.formatMoney(event.target.value);
  }

  loadAll(): void {

    this.loadPage = true;
    let track = 0;
    let url = 'AdmGetAll/GetAll';

    this._GeneralService.post(null, url).subscribe(
      (data: any) => {
        console.log('rows: ', this.rows)

        this.currencies = data.currencies;
        this.admService = data.admService;
        this.branches = data.branch;
        this.loadPage = false;
      },
      (error: any) => {
        console.log('error: ', error)

      });
  }

  download() {

   

    let arr: any[] = [];


    for (let i = 0; i < this.temp.length; i++) {

      arr.push({

        'DR ACCT': this.temp[i].drAcctNo != null ? this.temp[i].drAcctNo : '',
        'DR ACCT TYPE': this.temp[i].drAcctType != null ? this.temp[i].drAcctType : '',
        'DR ACCT NAME': this.temp[i].drAcctName != null ? this.temp[i].drAcctName : '',
        'DR ACCT TC': this.temp[i].drAcctTC != null ? this.temp[i].drAcctTC : '',
        'DR ACCT CHG CODE': this.temp[i].drAcctChargeCode != null ? this.temp[i].drAcctChargeCode : '',
        'DR ACCT CHG AMOUNT': this.temp[i].drAcctChargeAmt != null ? this.temp[i].drAcctChargeAmt : '',
        'DR ACCT TAX AMOUNT': this.temp[i].drAcctTaxAmt != null ? this.temp[i].drAcctTaxAmt : '',
        'DR ACCT CHG NARRATION': this.temp[i].drAcctChargeNarr != null ? this.temp[i].drAcctChargeNarr : '',
        'DR ACCT NARRATION': this.temp[i].drAcctNarration != null ? this.temp[i].drAcctNarration : '',
        'AMOUNT': this.temp[i].amount != null ? this._GeneralService.formatMoney(this.temp[i].amount) : 0.00,
        'STATUS': this.temp[i].status != null ? this.temp[i].status : '',
        'CR ACCT BRANCH CODE': this.temp[i].crAcctBranchCode != null ? this.temp[i].crAcctBranchCode : '',
        'CR ACCT NO': this.temp[i].crAcctNo != null ? this.temp[i].crAcctNo : '',
        'CR ACCT TYPE': this.temp[i].crAcctType != null ? this.temp[i].crAcctType : '',
        'CR ACCT TC': this.temp[i].crAcctTC != null ? this.temp[i].crAcctTC : '',
        'CR ACCT NAME': this.temp[i].crAcctName != null ? this.temp[i].crAcctName : '',
        'CR ACCT CHG CODE': this.temp[i].crAcctChargeCode != null ? this.temp[i].crAcctChargeCode : '',
        'CR ACCT CHG AMOUNT': this.temp[i].crAcctChargeAmt != null ? this.temp[i].crAcctChargeAmt : '',
        'CR ACCT TAX AMOUNT': this.temp[i].crAcctTaxAmt != null ? this.temp[i].crAcctTaxAmt : '',
        'CR ACCT CHG NARRATION': this.temp[i].crAcctChargeNarr != null ? this.temp[i].crAcctChargeNarr : '',
        'CR ACCT NARRATION': this.temp[i].crAcctNarration != null ? this.temp[i].crAcctNarration : '',
        'TRANS. REF': this.temp[i].transReference != null ? this.temp[i].transReference : '',
        'BATCH ID': this.temp[i].batchId != null ? this.temp[i].batchId : '',
        'CURRENCY': this.temp[i].ccyCode != null ? this.temp[i].ccyCode : '',
        'POSTING DATE': this.temp[i].postingDate != null ? this.temp[i].postingDate : '',
        'TRANS. DATE': this.temp[i].transactionDate != null ? this._GeneralService.dateconvertion(this.temp[i].transactionDate) : '',
        'VALUE DATE': this.temp[i].valueDate != null ? this.temp[i].valueDate : '',
        'CHANNEL': this.temp[i].channelId != null ? this.temp[i].channelId : '',
        'SERVICE DESCRIPTION': this.temp[i].serviceDescription != null ? this.temp[i].serviceDescription : '',
        'DEPT': this.temp[i].deptName != null ? this.temp[i].deptName : '',
        'POSTED BY': this.temp[i].fullName != null ? this.temp[i].fullName : ''

      });
    }

    let total = new List<CbsTransaction>(this.temp).Sum(c => Number(c.amount));
   

    arr.push({

      'DR ACCT': '',
      'DR ACCT TYPE': '',
      'DR ACCT NAME': '',
      'DR ACCT TC': '',
      'DR ACCT CHG CODE': '',
      'DR ACCT CHG AMOUNT': '',
      'DR ACCT TAX AMOUNT': '',
      'DR ACCT CHG NARRATION': '',
      'TOTAL': '',
      'AMOUNT': this._GeneralService.formatMoney(total),
      'STATUS': '',
      'CR ACCT BRANCH CODE': '',
      'CR ACCT NO': '',
      'CR ACCT TYPE': '',
      'CR ACCT TC': '',
      'CR ACCT NAME': '',
      'CR ACCT CHG CODE': '',
      'CR ACCT CHG AMOUNT': '',
      'CR ACCT TAX AMOUNT': '',
      'CR ACCT CHG NARRATION': '',
      'CR ACCT NARRATION': '',
      'TRANS. REF': '',
      'BATCH ID': '',
      'CURRENCY': '',
      'POSTING DATE': '',
      'TRANS. DATE': '',
      'VALUE DATE': '',
      'CHANNEL': '',
      'SERVICE DESCRIPTION': '',
      'DEPT': '',
      'POSTED BY': ''

    });

  

    this._GeneralService.exportAsExcelFile1(arr, `Transaction-Report- ${this.armortizationParam.pdtStartDate}- ${this.armortizationParam.pdtEndDate}`);

  }

  executeTrans(): void {

    
    if (this.armortizationParam.pdtStartDate === null) {
      Swal('', 'Select Start Date', 'error');

      return;
    }

    if (this.armortizationParam.pdtEndDate === null) {
      Swal('', 'Select End Date', 'error');

      return;
    }

    this.loadPage = true;

    let url = 'Reports/Transaction'

    this._GeneralService.post(this.armortizationParam, url)
      .subscribe(
        (data: any) => {

          this.temp = data._response;
          this.totalRec = this.temp.length;

          if (data._response.length > 0) {

            this.rows = data._response.slice(0, this.pageLmit);
            this.changePage(this.current_page);
          }

          this.loadPage = false;

        },
        (error: any) => {

          console.log('excute data result Transaction error: ', error);

          this.loadPage = false;
          Swal('', error.error.responseMessage, 'error');

        });
  }

  swapTab(value) {
    console.log('swapTab: ', value);

    if (value === 1) {
      this.tab1 = 'active';
      this.tab2 = '';
    }
    if (value === 2) {
      this.tab1 = '';
      this.tab2 = 'active';
    }

    if (value === 3) {
      this.tab1 = '';
      this.tab2 = '';
    }
    this.tabVlues = value;
  }

  public onOptionsSelected(event) {
    this.pageLmit = event.target.value;
    this.rows = this.temp.slice(0, this.pageLmit);
    this.changePage(this.current_page);
  }

}




