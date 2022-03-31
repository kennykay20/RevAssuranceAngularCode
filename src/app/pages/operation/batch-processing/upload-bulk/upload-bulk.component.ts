
import { List } from 'linqts';
import { GenModel } from './../../../../model/gen.model';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { GeneralService } from './../../../../services/genservice.service';
import { Component, OnInit, Inject } from '@angular/core';
import {
  FormGroup, FormBuilder, Validators, FormControl,
  FormGroupDirective, NgForm
} from '@angular/forms';
import { emailValidator } from '../../../../theme/utils/app-validators';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { WaitingDialog } from '../../../../services/services';
import { MatSnackBar } from '@angular/material';
import { LocalStorageService } from 'angular-2-local-storage';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DatePipe } from '@angular/common';
import { InstrumentForm, CollateralForm, ChargeForm, CollateralType } from '../../../../model/instrumentForms.model';
import { UserDetails } from '../../../../model/userDetails';
import swal from 'sweetalert2';
//import { admService } from '../../../../model/admService';
import { TemplateComponent } from '../../../ui/dialog/template/template.component';
import { AccountValidation } from '../../../../model/acctValidation';
import { Action } from '../../../../model/Action';
import { ApiResponse } from '../../../../model/apiResponse.model';
import { OprBusinessSearchForm } from '../../../../model/oprBusinessSearchForm.model';
import { CounterChequeForm, StopChequeForm } from '../../../../model/CounterChqReqForm.model';
import { admService } from '../../../../model/admService';
import { ChqBookReqForm } from '../../../../model/ChqBookReqForm.model';
import { ChequeProduct } from '../../../../model/ChequeProduct.model';
import { BatchControl, BatchItem } from '../../../../model/BatchControl';
import { BatchItemAddEditComponent } from '../batch-item-add-edit/batch-item-add-edit.component';
import * as XLSX from 'xlsx';
import { UploadBulkFiles, UploadBulkFilesValidator } from '../../../../model/uploadBulkFiles.model';
import { RevCharge } from '../../../../model/revCharge.model';
import { UploadItemDetailsComponent } from './upload-item-details/upload-item-details.component';


@Component({
  selector: 'app-upload-bulk',
  templateUrl: './upload-bulk.component.html',
  styleUrls: ['./upload-bulk.component.scss']
})

export class UploadBulkComponent implements OnInit {

  validationError = false
  totalChargeAmount: number;
  RevCharge: RevCharge[];
  uploadBulkFiles: UploadBulkFiles[];
  uploadBulkFilesValidator: UploadBulkFilesValidator[];
  accountValidation: AccountValidation;
  period = [] = ["DAY(S)", "MONTH(S)", "YEAR(S)",]
  apiResponse: ApiResponse;
  collTypeselect = null;
  userDetails: UserDetails
  actionTaken = 'N';
  currencies = [];
  sectors = [];
  branch = []
  chqProduct: ChequeProduct[];
  IssuranceCoverTypes = [];
  showIni = false
  public settings: Settings;
  durationsnack = 3000;
  displayloader = false;
  lblProcess: any;
  selectedPrepCat: any;
  religionlist = [];
  CollateralTypes: CollateralType[];
  templateTypes = [];
  reqReason = [];
  stateList: any;
  NationalityList: any;
  localGovernmentsList: any;
  private baseUrl = environment.apiURL;
  Email: any;
  loadPage = true;
  token = GenModel.tokenName;
  recordNotFoundMsg = GenModel.recordNotFoundMsg;
  ActionHeaderMsg = GenModel.ActionHeaderMsg
  ActionViewHeaderMsg = GenModel.ActionViewHeaderMsg;

  tabVlues = 1;

  requiredFieldMsg = GenModel.requiredFieldMsg;
  errorOccur = GenModel.errorOccur;
  actionLoaderSave = false;
  actionLoaderUpdate = false;
  actionLoaderDismiss = false;
  actionbtnInitiate = false;
  userFullName: any

  errorDisableUpload: false;

  ActionDisplay: any;

  reloadLoad: any;
  createdBy: any;

  statuses: any;


  tab1 = 'active'
  tab2 = ''
  tab3 = ''
  tab4 = ''
  tab5 = ''

  //chargeSetup = [] = [];

  selectedCalss = 'selected nav-item cursorPointer';
  selectedCalss2 = 'selected nav-item cursorPointer';
  selectedCalss3 = 'selected nav-item cursorPointer';
  selectedCalss4 = 'selected nav-item cursorPointer';
  selectedCalss5 = 'selected nav-item cursorPointer';
  selectedCalss6 = 'selected nav-item cursorPointer';

  notServiceChargeYet = false;

  serviceId: number;
  retryService = GenModel.retryService;
  retryMessage: any;
  RetryAttmMsg = GenModel.RetryAttmMsg;
  apiIsDown = GenModel.apiIsDown;
  retryDelayServiceInterval = GenModel.retryDelayServiceInterval;

  departments = [];
  users = [];
  acttypes = [];
  btnConfirm = GenModel.btnConfirm;
  chequeProduct: ChequeProduct;

  dismissedBy: any;
  rejectedBy: any;
  instrumentForm: BatchControl;
  rows: UploadBulkFiles[];
  temp: UploadBulkFiles[];
  serviceName: any;
  chargeFormList: ChargeForm[];
  chargeFormListTemporal: ChargeForm[];

  admService: admService;
  templateContent: any;
  action: Action

  batchStatus = ['Loaded', 'Close']



  constructor(public appSettings: AppSettings,
    public fb: FormBuilder,
    public fbSer: FormBuilder,
    public fbCol: FormBuilder,
    public router: Router,
    public snackBar: MatSnackBar,
    public _waitingDialog: WaitingDialog,
    private _localStorageService: LocalStorageService,
    public _GeneralService: GeneralService,
    private http: HttpClient,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<UploadBulkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
  ) {

    this.userDetails = this._GeneralService.getUserDetails();
    this.settings = this.appSettings.settings;

    this.resetChqProduct();
    this.resetAction(data);

    console.log('data details', data);

    this.chargeFormList = data.chargeSetup;
    this.admService = data.admService;
    // console.log('data this.admService; ', this.admService);

    this.serviceId = data.serviceId;
    this.serviceName = data.serviceName;

    if (this.data.actionName === 'Add') {
      this.reformInstrumentForm();
    }
    else {

      this.ActionHeaderMsg = '';
      this.ActionDisplay = this.ActionViewHeaderMsg;
      let batchNo = data.record.batchNo;
      this.getById(batchNo);
    }
  }

  resetAction(data) {
    this.action = {
      actionName: data.actionName
    }

    console.log('data resetAction this.action; ', this.action);
  }
  reformInstrumentForm() {
    let ini = new BatchControl();

    this.instrumentForm = ini;
    this.instrumentForm.serviceId = this.serviceId
    this.instrumentForm.loadedBy = this.userDetails.userId,
      this.instrumentForm.dept = this.userDetails.deptId,
      this.instrumentForm.originBranchNo = this.userDetails.branchNo,
      this.instrumentForm.processingDept = this.userDetails.deptId,


      /*{
        batchNo				: 0,	
        serviceId				: this.serviceId, 
        description:null,
        ccyCode				: null, 
        postedTransCount		: null, 
        recordCount			: null, 
        totalDrCount			: null, 
        totalCrCount			: null, 
        totalDr				: null, 
        totalCr				: null, 
        tDifference			: null, 
        loadedBy				:  this.userDetails.userId, 
        dept					: this.userDetails.deptId, 
        originBranchNo		: this.userDetails.branchNo, 
        originBranch			: null, 
        isBalanced			: null, 
        verifiedBy			: null, 
        approvedBy			: null, 
        postedDrCount			: null, 
        postedCrCount			: null, 
        isManual				: 'N', 
        status				: 'Loaded', 
        filename				: null, 
        dateCreated			: null, 
        dateVerified			: null, 
        dateApproved			: null, 
        processingDept		: this.userDetails.deptId, 
        rejected				: null, 
        rejectedBy			: null, 
        rejectionReason		: null, 
        rejectionDate			: null, 
        closedBy				: null, 
        dateClosed			: null, 
        postingDate			: null, 
        select: null, 
        defaultNar: null,
        createdBy:  null,
        approvedDate:  null,
        transStatus:  null,
        verifiedDate: null
  
        };
      */
      console.log('new', this.instrumentForm);
  }

  resetChqProduct() {
    this.chequeProduct = {
      itbId: 0,
      chqProductCode: null,
      chqProductDescr: null,
      userId: null,
      dateCreated: null,
      status: null,
      vendorId: null,
      productId: null,
      noOfChqPerUnit: null,
      unit: null,
    }
  }


  resetCharge() {

    this.chargeFormList.push({

      itbId: 0,
      serviceId: 0,
      serviceItbId: 0,
      chgAcctNo: null,
      chgAcctType: null,
      chgAcctName: null,
      chgAvailBal: null,
      chgAcctCcy: null,
      chgAcctStatus: null,
      chargeCode: null,
      chargeRate: null,
      origChgAmount: null,
      origChgCCy: null,
      exchangeRate: null,
      equivChgAmount: null,
      equivChgCcy: null,
      chgNarration: null,
      taxAcctNo: null,// this.chargeForm.ii,
      taxAcctType: null,// this.chargeForm.ii,
      taxRate: null,
      taxAmount: null,
      taxNarration: null,
      incBranch: null,
      incAcctNo: null,
      incAcctType: null,
      incAcctName: null,
      incAcctBalance: null,
      incAcctStatus: null,
      incAcctNarr: null,
      seqNo: 0,
      status: null,
      dateCreated: null,
      transactionDate: null,
      valueDate: null,
      nTaxRate: null,
      sTaxNarration: null,
      sTaxAcctNo: null,
      sChgCurrency: null,
      sTaxAcctType: null,
      templateId: 0
    });
  }

  resetChargeAfterAdd() {
    this.chargeFormList = this.chargeFormListTemporal;
  }

  ngOnInit() {
    this.loadPage = false;
    this.statuses = this._GeneralService.Statuses;
    this.loadDepartment();
    this.loadUsers();
    this.loadAcctTypes();
    this.loadCollateralTypes();
    this.validationError = false;
    console.log('this.validationError', this.validationError);
  }



  getById(batchNo): void {

    console.log('getById bathcNo FileUpload', batchNo);

    this.loadPage = true;

    let track = 0;
    let url = 'BatchControlFileUpload/GetById';

    let val = {
      batchControlTemp: {
        batchNo: batchNo
      },
      serviceId: this.serviceId
    };

    this._GeneralService.post(val, url)
      .subscribe(
        (data: any) => {
          console.log('get batch Upload data', data);

          this.loadPage = false;
          this.instrumentForm = data.instrumentDetails;
          this.rows = data.batchItems
          console.log('get batch Upload this.rows', this.rows);

          this.temp = data.batchItems;

          let calDChgr = 0;
          for (let i = 0; i < this.rows.length; i++) {
            if (this.rows[i].chargeAmount !== undefined) {

              if (this.rows[i].chargeAmount > 0) {

                calDChgr += this.rows[i].chargeAmount
                this.totalChargeAmount = calDChgr;
              }
            }

          }


          // this.instrumentForm.amount = this.instrumentForm.amount != null ? this._GeneralService.formatMoney(this.instrumentForm.amount) : this.instrumentForm.amount;
          // this.instrumentForm.availBal = this.instrumentForm.availBal != null ? this._GeneralService.formatMoney(this.instrumentForm.availBal) : this.instrumentForm.availBal;
          // this.instrumentForm.branchName = data.valInstrumentAcct.sBranchName ;
          //  this.instrumentForm.chqWidrawalAmount = this.instrumentForm.chqWidrawalAmount != null ?  this._GeneralService.formatMoney(this.instrumentForm.chqWidrawalAmount) : this.instrumentForm.chqWidrawalAmount;

          this.instrumentForm.dateCreated = this.instrumentForm.dateCreated != null ? this._GeneralService.dateCreated(this.instrumentForm.dateCreated) : this.instrumentForm.dateCreated;

          if (data.allUsers != undefined) {
            this.createdBy = data.allUsers.createdBy;
            this.dismissedBy = data.allUsers.dismissedBy;
            this.rejectedBy = data.allUsers.rejectedBy;
          }
        },
        (error: any) => {
          console.log('getById: ', error.error);
          if (track === this.retryService) {
            Swal('', this.apiIsDown, 'error');
          }
          else {
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


          this.departments = data._response;

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


  loadUsers(): void {

    this.loadPage = true;
    let track = 0;
    let url = 'Users/GetAll';


    let val =
    {
      AId: 1,
    }



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

          this.users = data._response;


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

          this.acttypes = data;
          console.log('this.acttypes: ', this.acttypes);

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
  loadCollateralTypes(): void {

    this.loadPage = true;
    let track = 0;
    let url = 'AdmGetAll/GetAll';


    this._GeneralService.post(null, url)
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
          console.log('data ddd: ', data);
          this.CollateralTypes = data.colType;
          this.templateTypes = data.temp;
          this.reqReason = data.reqReason
          this.IssuranceCoverTypes = data.issuranceCoverType;
          this.currencies = data.currencies;
          this.sectors = data.sectors;
          this.branch = data.branch;
          this.chqProduct = data.chqProduct;
          console.log('this.chqProduct: ', this.chqProduct);

          this.loadPage = false;

        },
        (error: any) => {
          if (track === this.retryService) {
            // Swal('', this.apiIsDown, 'error');
          }
          else {
            // Swal('', this.errorOccur, 'error');

          }
        });
  }





  update(): void {

    let valAcct;



    // if(this.templateContent == null)
    // {
    //    swal('', 'Supply Template Content','error');
    //    return;
    // }
    // console.log('update chargeFormList: ', this.chargeFormList);

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement>document.getElementById("btnUpdate");

    element.disabled = true;



    let val =
    {
      BatchControlTemp: this.instrumentForm,
      loginUserId: this.userDetails.userId,
      serviceId: this.serviceId,
      transactionDate: this.userDetails.bankingDate,
      ValueDate: this.userDetails.bankingDate,
      LoginUserName: this.userDetails.userName,
    }

    console.log('val to add: ', val);

    let url = 'BatchControlFileUpload/Update';


    console.log('update values: ', val);

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {
        console.log('Update data:', data)
        this.actionTaken = 'Y';
        element.disabled = false;
        this.actionLoaderUpdate = false;
        this.reloadLoad = 'Y';

        this.apiResponse = data;

        Swal('', data.responseMessage, 'success');

      },
      (error: any) => {

        element.disabled = false;
        this.actionLoaderUpdate = false;

        Swal('', error.error.responseMessage, 'error');
      });


  }

  keyPress(event: any) {

    // console.log('keyPress', this.instrumentForm.acctNo);
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  trigerAfterAmt(event) {
    console.log('trigerAfterAmt');

  }


  chqAmt(event) {
    console.log('validateAcct', event.target.value);


  }
  validateAcct(event) {
    console.log('validateAcct', event.target.value);
    // if(this.instrumentForm.amount === null)
    // {
    //   Swal('', 'Enter Transaction Amount', 'error');
    //   return;
    // }
    if (event.target.value !== null) {

    }

  }

  resetChage(data) {
    this.chargeFormListTemporal = data;
  }




  formatAmount(event) {
    //  this.instrumentForm.chqAmt =  this._GeneralService.formatMoney(event.target.value)

  }


  chqdate(event) {

    let val = this._GeneralService.dateconvertion(event.target.value);

    //this.instrumentForm.chqDate = val;



  }

  autoPopulate(event) {
    var val = event.target.value;
    console.log('autoPopulate', val);

    console.log('autoPopulate this.chargeFormLis', this.chargeFormList);

    // this.CollateralForm.acctNo = val;

    for (let i = 0; i <= this.chargeFormList.length; i++) {
      if (this.chargeFormList[i] !== undefined) {
        this.chargeFormList[i].chgAcctNo = val;
      }

    }
  }


  chgChargeCalculate(event) {



  }



  ngAfterViewInit() {
    this.settings.loadingSpinner = false;
  }

  close(): void {

    this.dialogRef.close(this.reloadLoad);
  }


  swapTab(value): any {
    console.log('swapTab: ', value);


    if (value === 1) {
      this.tab1 = 'active';
      this.tab2 = '';
      this.tab3 = '';
      this.tab4 = '';
      this.tab5 = '';
    }
    if (value === 2) {


      this.tab1 = '';
      this.tab2 = 'active';
      this.tab3 = '';
      this.tab4 = '';
      this.tab5 = '';
    }

    this.tabVlues = value;

  }

  calCharges() {

    let values = {

    }
    let url = 'Token/CalCulateCharge';

    this._GeneralService.post(values, url).subscribe(
      (data: any) => {
        console.log('Cal Charges', data)

        Swal('', data.sErrorText, 'success');
      },
      (error: any) => {



        Swal('', error.error.message, 'error');
      });

  }

  swapView() {
    if (this.showIni === false) {
      this.showIni = true;
    }
    else {
      this.showIni = false;
    }

  }


  viewTemp(): void {

    let val = {

      serviceId: this.serviceId,
     // ServiceItbId: this.instrumentForm.itbId

    }

    this.loadPage = true;

    let url = 'Instrument/viewTemp';

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {

        console.log('endDate data', data);
        this.loadPage = false;
        this.openTemp(data);

      },
      (error: any) => {

        this.loadPage = false;

        Swal('', error.error.responseMessage, 'error');
      });

  }

  openTemp(data: any): void {


    if (this.templateContent != null) {
      console.log('1');
      let dialogRef = this.dialog.open(TemplateComponent, {
        data: { data: this.templateContent }
      });

      dialogRef.afterClosed().subscribe(result => {

        console.log('tem  close res', result);

        if (result !== undefined) {
          this.templateContent = result;
        }
      });
    }
    else {
      console.log('2');
      let dialogRef = this.dialog.open(TemplateComponent, {
        data: { data: data.template.templateContent }
      });

      dialogRef.afterClosed().subscribe(result => {

        console.log('tem  close res', result);

        if (result !== undefined) {
          this.templateContent = result;
        }
      });
    }

  }



  radChage(event) {

    // console.log('radChage3', this.instrumentForm.hitOption)


  }



  chqProductSelected(templateId) {

    let num = Number(templateId);
    let get = new List<ChargeForm>(this.chargeFormListTemporal).Where(c => c.templateId === num).ToArray();
    this.chargeFormList = get;

    for (let i = 0; i < this.chargeFormList.length; i++) {
      if (this.chargeFormList != undefined)
        this.chargeFormList[i].templateId = num;
    }



  }



  updateFilter(event, value: any) {
    let temp1 = this.temp;
    if (value === 'BATCH NO') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.batchNo.toString().toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }

    if (value === 'ACCT NO') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.acctNo.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'ACCT TYPE') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.acctType.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'ACCT NAME') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.acctName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'CHQ. NO') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.chequeNo.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'TC') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.cbsTC.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'DRORCR') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.drCr.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'AMT') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.amount.toString().toLowerCase().indexOf(val) !== -1 || !val;
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

    if (value === 'STATUS') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.serviceStatus.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }



    if (this.rows.length === 0) {
      swal('', this.recordNotFoundMsg, 'error');

      this.rows = temp1;

    }

  }

  actionAddItemUpload(action: any, record: any): void {

    let dialogRef = this.dialog.open(UploadItemDetailsComponent, {

      // width: '3500px',
      // height: '800px',
      // hasBackdrop: true,
      disableClose: true,
      // autoFocus: true,
      data: {
        actionName: action, record: this.instrumentForm,
        serviceId: this.serviceId,
        admService: this.admService,
        chargeSetup: this.data.chargeSetup,
        itemdetails: record
      },

    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.reloadLoad === 'Y') {

        this.getById(result.batchNo);

      }

    });
  }


  actionUploadItem(action: any, record: any): void {

    let dialogRef = this.dialog.open(UploadItemDetailsComponent, {

      // width: '3500px',
      // height: '800px',
      // hasBackdrop: true,
      disableClose: true,
      // autoFocus: true,
      data: {
        actionName: action, record: this.data,
        serviceId: this.serviceId,
        admService: this.admService,
        chargeSetup: this.data.chargeSetup,
        itemdetails: record
      },

    });

    dialogRef.afterClosed().subscribe(result => {
     
      console.log('kkk 111 result.batchNo', result.batchNo);
      if (result.reloadLoad === 'Y') {

        this.getById(result.batchNo);

      }

    });
  }


  onFileChange(event: any): any {

    console.log("event ", event);
    this.instrumentForm.filename = event.target.files[0].name;

    
    const name = event.target.files[0].name;
    const lastDot = name.lastIndexOf('.');

    const fileName = name.substring(0, lastDot);
    const ext = name.substring(lastDot + 1);

    if (ext !== 'xlsx') {
      swal('', 'Select an Excel File', 'error');
      //  throw new Error('Cannot use multiple files');

      return;
    }



    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(event.target);
    
    console.log('target ', target.files);
    if (target.files.length !== 1) {
      swal('', 'You can Only Select a File', 'error');
      //  throw new Error('Cannot use multiple files');

      return;
    }
    const reader: FileReader = new FileReader();
    const selectedFile = event.target.files[0]
    reader.readAsBinaryString(selectedFile);
    console.log("target.files[0])", selectedFile);
    //console.log("reader.readAsBinaryString(target.files[0]) ", reader.readAsBinaryString(target.files[0]))
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
      console.log("workbook ", wb);

      wb.SheetNames.forEach(sheet => {
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheet]);
        console.log('data - ', data);
      })
      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      console.log("workSheetName ", wsname);
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      console.log('data  ws*: ',  ws);

      //convert workheet to json
      const hhh = XLSX.utils.sheet_to_json(ws);

      console.log('data  hhh*: ',  hhh);
      /* save data */
      this.uploadBulkFiles = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
      // Data will be logged in array format containing objects

      let calDChgr = 0;
      console.log("this.uploadBulkFiles ", this.uploadBulkFiles);
      console.log("this.uploadBulkFiles.length ", this.uploadBulkFiles.length);
      for (let i = 0; i < this.uploadBulkFiles.length; i++) {
        console.log("this.uploadBulkFiles[i][Value Date] ",this.uploadBulkFiles[i]["Value Date"]);
        this.uploadBulkFiles[i].acctNo = this.uploadBulkFiles[i]["A/C No"];
        this.uploadBulkFiles[i].acctType = this.uploadBulkFiles[i]["A/C Type "]
        this.uploadBulkFiles[i].drCr = this.uploadBulkFiles[i]["DR/CR"]
        this.uploadBulkFiles[i].Currency = this.uploadBulkFiles[i].Ccy;
        //this.uploadBulkFiles[i].ccyCode = this.uploadBulkFiles[i].Ccy;
        this.uploadBulkFiles[i].ccyCode = this.uploadBulkFiles[i].Ccy;
        this.uploadBulkFiles[i].narration = this.uploadBulkFiles[i].Narration;
        this.uploadBulkFiles[i].valueDate =  this.uploadBulkFiles[i]["Value Date"];
        this.uploadBulkFiles[i].cbsTC = this.uploadBulkFiles[i].TranCode;
        this.uploadBulkFiles[i].chequeNo = this.uploadBulkFiles[i]["Chq No"];
        this.uploadBulkFiles[i].amount = this.uploadBulkFiles[i].Amount;
        this.uploadBulkFiles[i].chargeAmount = this.uploadBulkFiles[i].ChargeAmount;
        this.uploadBulkFiles[i].ChgNarration = this.uploadBulkFiles[i].ChargeNarration;

        if (this.uploadBulkFiles[i].chargeAmount !== undefined) {

          if (this.uploadBulkFiles[i].chargeAmount > 0) {

            calDChgr += this.uploadBulkFiles[i].chargeAmount
            this.totalChargeAmount = calDChgr;
          }
        }

        console.log('this.uploadBulkFiles[i].drCr:;::', this.uploadBulkFiles[i].drCr)
        if (this.uploadBulkFiles[i].drCr != undefined) {

          if (this.uploadBulkFiles[i].drCr.toLowerCase().trim() == 'dr') {
            this.instrumentForm.totalDr += this.uploadBulkFiles[i].amount;
          }

          if (this.uploadBulkFiles[i].drCr.toLowerCase().trim() == 'cr') {
            this.instrumentForm.totalCr += this.uploadBulkFiles[i].amount;
          }

        }

      }

      this.uploadBulkFilesValidator = new Array<UploadBulkFilesValidator>();

      

      for (let i = 0; i < this.uploadBulkFiles.length; i++) {
        //console.log("this.uploadBulkFiles[i].valueDate.toString() ", this.uploadBulkFiles[i].valueDate.toString());
        this.uploadBulkFilesValidator.push({
          acctNo: this.uploadBulkFiles[i].acctNo,
          acctType: this.uploadBulkFiles[i].acctType,
          cbsTC: this.uploadBulkFiles[i].cbsTC,
          narration: this.uploadBulkFiles[i].narration,
          amount: this.uploadBulkFiles[i].amount != null ? this.uploadBulkFiles[i].amount.toString() : null,
          drCr: this.uploadBulkFiles[i].drCr,
          chargeCode: this.uploadBulkFiles[i].chargeCode,
          chargeAmount: this.uploadBulkFiles[i].chargeAmount != null ? this.uploadBulkFiles[i].chargeAmount.toString() : null,
          chgNarration: this.uploadBulkFiles[i].chgNarration,
          valueDate: this.uploadBulkFiles[i].valueDate != null ? this.uploadBulkFiles[i].valueDate.toString() : null,
          chequeNo: this.uploadBulkFiles[i].chequeNo,
          ccyCode: this.uploadBulkFiles[i].ccyCode,
          valErrorMessage: null,
          dontSave: false
        });
      }

      console.log('this.uploadBulkFilesValidator', this.uploadBulkFilesValidator);

      let val =
      {
        UploadBulkFilesValidatorList: this.uploadBulkFilesValidator,
        loginUserId: this.userDetails.userId,
        serviceId: this.serviceId,
        transactionDate: this.userDetails.bankingDate,
        ValueDate: this.userDetails.bankingDate,
        LoginUserName: this.userDetails.userName,
        OriginBranchNo: this.userDetails.branchNo,
        BatchControlTemp: this.instrumentForm
      }

      console.log('value to add upload batch items : ', val);

      let url = 'BatchControlFileUpload/ValidateUpload';

      this.loadPage = true;

      this._GeneralService.post(val, url).subscribe(
        (data: any) => {

          console.log('UploadBulkFilesValidatorList11: ', data);
          this.loadPage = false;

         // this.validationError = true;

          this.actionLoaderSave = false;
          this.reloadLoad = 'Y';
          var getInf = new List<UploadBulkFilesValidator>(data).FirstOrDefault(c => c.valErrorMessage !== null)
          console.log('UploadBulkFilesValidatorList55 getInf: ', getInf);
          if (getInf != null || undefined) {
            this.rows = data;
            this.validationError = true;
            Swal('', 'The Uploaded File has Some Issues. Kindly re-adjust and upload again!', 'error');
          }

        },
        (error: any) => {
          this.loadPage = false;
          console.log(' error.error', error.error);
          this.actionLoaderSave = false;

          Swal('', error.error.responseMessage, 'error');
        });

    };
  }

  addUpload(values: Object): void {
    let valAcct;
    console.log('val to WWW: ', this.uploadBulkFiles);
    if (this.uploadBulkFiles === undefined) {
      swal('', 'Kindly Select a File', 'error');
      return;
    }


    const lastDot = this.instrumentForm.filename.lastIndexOf('.');
    const fileName = this.instrumentForm.filename.substring(0, lastDot);
    const ext = this.instrumentForm.filename.substring(lastDot + 1);

    if (ext !== 'xlsx') {
      swal('', 'Select an Excel File', 'error');
      //  throw new Error('Cannot use multiple files');

      return;
    }



    this.actionLoaderSave = true;
    let element = <HTMLInputElement>document.getElementById("btnSaveUpload");
    element.disabled = true;

    // this.instrumentForm.userId  = this.userDetails.userId;
    // this.instrumentForm.originatingBranchId = this.userDetails.branchNo;
    // this.instrumentForm.transactionDate =  this.userDetails.bankingDate;
    // this.instrumentForm.valueDate =  this.userDetails.bankingDate;

    // this.instrumentForm.itbId = 0;




    for (let i = 0; i < this.uploadBulkFiles.length; i++) {
      this.uploadBulkFiles[i].processingDept = this.instrumentForm.processingDept;
      this.uploadBulkFiles[i].deptId = this.userDetails.deptId;
      this.uploadBulkFiles[i].originatingBranchId = this.userDetails.branchNo;
      this.uploadBulkFiles[i].transactionDate = this.userDetails.bankingDate;



    }

    this.instrumentForm.dept = this.userDetails.deptId;

    console.log("this.bankingdate", this.userDetails);
    let val =
    {
      //ListBatchItemsTemp: this.uploadBulkFiles,
      BatchParamsItemTempDTOs: this.uploadBulkFiles,
      loginUserId: this.userDetails.userId,
      serviceId: this.serviceId,
      transactionDate: this.userDetails.bankingDate,
      ValueDate: this.userDetails.bankingDate,
      LoginUserName: this.userDetails.userName,
      OriginBranchNo: this.userDetails.branchNo,
      BatchControlTemp: this.instrumentForm
    }

    console.log('value to add upload batch items again : ', val);

    let url = 'BatchControlFileUpload/Add';

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {

        // this.reformInstrumentForm();
        // this.resetChargeAfterAdd();

        this.instrumentForm = data.batch;



        this.instrumentForm.dateCreated = this._GeneralService.dateCreated(this.instrumentForm.dateCreated);

        element.disabled = false;

        this.templateContent = null;
        this.actionLoaderSave = false;
        this.reloadLoad = 'Y';

        this.rows = this.uploadBulkFiles;

        console.log('added batch No: ', this.instrumentForm.batchNo);

        this.getById(this.instrumentForm.batchNo);

        this.data.actionName = 'Edit';
        this.validationError = false;

        Swal('', data.apiResponse.responseMessage, 'success');

      },
      (error: any) => {
        console.log("error.erros", error);
        console.log(' error.error', error.error);
        this.actionLoaderSave = false;
        element.disabled = false;
        Swal('', error.error.responseMessage, 'error');
      });
  }

  dateValue(date) {
    console.log("date param", date);
    var d = new Date(Date.parse(date));
    var retVal = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
    console.log("retrunVal ", retVal);
    return retVal;
 }

}





