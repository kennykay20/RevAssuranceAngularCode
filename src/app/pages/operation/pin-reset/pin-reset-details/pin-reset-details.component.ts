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
import { DocRetrieval, admDocumentChg } from '../../../../model/DocumentRetrival.model';
import { oprPinItems } from '../../../../model/pinResetItem';
import { PinReset } from '../../../../model/PinReset.model';
import { admAccountTypeModel } from '../../../../model/admAccountTypeDTO.model';

@Component({
  selector: 'app-pin-reset-details',
  templateUrl: './pin-reset-details.component.html',
  styleUrls: ['./pin-reset-details.component.scss']
})

export class PinResetDetailsComponent implements OnInit {
  
  cbsOfflineMsg = GenModel.cbsOfflineMsg;
	
  oprPinItems: oprPinItems[];
  tempoprPinItems: oprPinItems[];
  tempTrackSelectedoprPinItems: oprPinItems[];
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

  ActionDisplay: any;

  reloadLoad: any;
  createdBy: any;

  statuses: any;


  tab1 = 'active'
  tab2 = ''
  tab3 = ''
  tab4 = ''
  tab5 = ''
  pnCalcAmt: string = ''
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
  instrumentForm: PinReset;
  serviceName: any;
  chargeFormListParam: ChargeForm[];
  chargeFormList: ChargeForm[];
  chargeFormListConcatenate: ChargeForm[];
  chargeFormListTemporal: ChargeForm[];

  chargeFormListAppend: ChargeForm[];
  chargeFormListAppend1: ChargeForm[];

  admService: admService;
  templateContent: any;
  action: Action

  checkValue = false; 
  maxLength = GenModel.acctmaxLengthDefault;
  Delimeter = '';
  accountFormat = '';

  lengthMessage = '';
  acct1 = '';
  glAccountType = false;
  admAccountTypeModel: admAccountTypeModel;

  itbId: number;
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
    public dialogRef: MatDialogRef<PinResetDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
  ) {

    this.userDetails = this._GeneralService.getUserDetails();
    this.settings = this.appSettings.settings;

    this.resetChqProduct();
    this.resetAction(data);

    console.log('data details; ', data);

    //  this.chargeFormList = data.chargeSetup;
    this.chargeFormListParam = data.chargeSetup;

    this.admService = data.admService;
    console.log('data this.admService document retrieval; ', this.admService);

    this.serviceId = data.serviceId;
    this.serviceName = data.serviceName;

    if (this.data.actionName === 'Add') {

      this.oprPinItems = data.oprPinItems;
      this.tempoprPinItems = data.oprPinItems;

      for (let i = 0; i < this.oprPinItems.length; i++) {
        this.oprPinItems[i].select = false;
      }

      this.reformInstrumentForm();
      this.resetCharge();
      this.loadPage = false;
      let getOnyly = new List<any>(this.chargeFormListParam).Where(c => c.serviceId === data.serviceId).ToArray();
      console.log('getOnyly', getOnyly);

      this.chargeFormListParam = getOnyly;
      console.log('getOnyly 22', this.chargeFormListParam);
      for (let i = 0; i <= this.chargeFormListParam.length; i++) {
        if (this.chargeFormListParam[i] !== undefined) {
          this.chargeFormListParam[i].transactionDate = this.userDetails.bankingDate;
          this.chargeFormListParam[i].valueDate = this.userDetails.bankingDate;
        }
      }

      this.chargeFormListTemporal = this.chargeFormListParam;

    }
    else {
      this.ActionHeaderMsg = '';
      this.ActionDisplay = this.ActionViewHeaderMsg;

      this.showIni = true;
      this.itbId = data.record.itbId
      console.log('this.itbId**: ', this.itbId);
      this.getById();


    }
  }

  resetAction(data) {
    this.action = {
      actionName: data.actionName
    }

    console.log('data resetAction this.action; ', this.action);
  }
  reformInstrumentForm() {

    this.instrumentForm = new DocRetrieval();

    this.instrumentForm.itbId = 0;
    this.instrumentForm.serviceId = this.serviceId,
      this.instrumentForm.processingDeptId = this.admService.defaultDept.toString(),
      this.instrumentForm.transactionDate = this.userDetails.bankingDate,
      this.instrumentForm.valueDate = this.userDetails.bankingDate,
      this.instrumentForm.origDeptId == this.userDetails.deptId

    this.oprPinItems = this.tempoprPinItems;
    this.pnCalcAmt = ''
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

    this.chargeFormList = [] || [];
  }

  resetChargeAfterAdd() {
    /*
    for(let i = 0; i <= this.chargeFormList.length; i++ )
    {
        if(this.chargeFormList[i] != undefined)
        {

          this.chargeFormList[i].itbId = 0;
          this.chargeFormList[i].serviceId =  0;
          this.chargeFormList[i].serviceItbId=  0 ;
          this.chargeFormList[i].chgAcctNo=  null;
          this.chargeFormList[i].chgAcctType=  null;
          this.chargeFormList[i].chgAcctName=  null;
          this.chargeFormList[i].chgAvailBal=  null;
          this.chargeFormList[i].chgAcctCcy =  null;
          this.chargeFormList[i].chgAcctStatus =  null;
          this.chargeFormList[i].chargeCode =  null;
          this.chargeFormList[i].chargeRate =  null;
          this.chargeFormList[i].origChgAmount =  null;
          this.chargeFormList[i].origChgCCy =  null;
          this.chargeFormList[i].exchangeRate =  null;
          this.chargeFormList[i].equivChgAmount =  null;
          this.chargeFormList[i].equivChgCcy =  null;
          this.chargeFormList[i].chgNarration =  null;
          this.chargeFormList[i].taxAcctNo =  null;
          this.chargeFormList[i].taxAcctType =  null;
          this.chargeFormList[i].taxRate =  null;
          this.chargeFormList[i].taxAmount =  null;
          this.chargeFormList[i].taxNarration =  null;
          this.chargeFormList[i].incBranch =   null;
          this.chargeFormList[i].incAcctNo =   null;
          this.chargeFormList[i].incAcctType =   null;
          this.chargeFormList[i].incAcctName =   null;
          this.chargeFormList[i].incAcctBalance =   null;
          this.chargeFormList[i].incAcctStatus =   null;
          this.chargeFormList[i].incAcctNarr =   null;
          this.chargeFormList[i].seqNo =  0;
          this.chargeFormList[i].status =  null;
          this.chargeFormList[i].dateCreated =  null;
          this.chargeFormList[i].transactionDate =  this.userDetails.bankingDate;
          this.chargeFormList[i].valueDate =  this.userDetails.bankingDate;
          this.chargeFormList[i].nTaxRate =  null;
          this.chargeFormList[i].sTaxNarration =  null;
          this.chargeFormList[i].sTaxAcctNo =  null;
          this.chargeFormList[i].sChgCurrency =  null;
          this.chargeFormList[i].sTaxAcctType = null
        
      
        }
      }

      */

    this.chargeFormList = this.chargeFormListTemporal;
  }

  resetPinItem() {
    this.oprPinItems
    for (let i = 0; i < this.oprPinItems.length; i++)
      this.oprPinItems[i].select = false;
  }

  ngOnInit() {
    this.loadPage = false;
    this.statuses = this._GeneralService.Statuses;

    this.loadDepartment();
    this.loadUsers();
    this.loadAcctTypes();
    this.loadCollateralTypes();
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

  add(values: Object): void {
    let valAcct;



    valAcct = this.validationAcctToPost(this.serviceId);

    if (valAcct === true) {
      return;
    }
    // if(this.templateContent == null)
    // {
    //    swal('', 'Supply Template Content','error');
    //    return;
    // }


    this.actionLoaderSave = true;
    let element = <HTMLInputElement>document.getElementById("btnSave");
    element.disabled = true;

    this.instrumentForm.userId = this.userDetails.userId;
    this.instrumentForm.originatingBranchId = this.userDetails.branchNo;
    this.instrumentForm.transactionDate = this.userDetails.bankingDate;
    this.instrumentForm.valueDate = this.userDetails.bankingDate;
    this.instrumentForm.origDeptId = this.userDetails.deptId;

    this.instrumentForm.itbId = null;// 0;

    let getSelectedItems = new List<any>(this.oprPinItems).Where(c => c.select === true).ToArray();


    if (getSelectedItems.length === 0) {
      Swal('', 'Select the Item(s) to Reset', 'error');
      return;
    }

    let val =
    {
      oprPinReset: this.instrumentForm,
      listoprServiceCharge: this.chargeFormList,
      templateContent: this.templateContent,
      loginUserId: this.userDetails.userId,
      serviceId: this.serviceId,
      transactionDate: this.userDetails.bankingDate,
      ValueDate: this.userDetails.bankingDate,
      LoginUserName: this.userDetails.userName,
      ListoprPinItems: getSelectedItems
    }

    console.log('val to add: ', val);

    let url = 'PinReset/Add';

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {


        this.reformInstrumentForm();
        this.resetChargeAfterAdd();
        this.resetPinItem();

        this.swapTab(1);

        element.disabled = false;

        this.templateContent = null;
        this.actionLoaderSave = false;
        this.reloadLoad = 'Y';

        Swal('', data.responseMessage, 'success');

      },
      (error: any) => {
        console.log(' error.error', error.error);
        this.actionLoaderSave = false;
        element.disabled = false;
        Swal('', error.error.responseMessage, 'error');
      });
  }

  update(): void {

    let valAcct;

    valAcct = this.validationAcctToPost(this.serviceId);

    if (valAcct === true) {
      return;
    }

    // if(this.templateContent == null)
    // {
    //    swal('', 'Supply Template Content','error');
    //    return;
    // }
    console.log('update chargeFormList: ', this.chargeFormList);

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement>document.getElementById("btnUpdate");

    element.disabled = true;
    let url = 'PinReset/Update';

    let getSelectedItems = new List<any>(this.oprPinItems).Where(c => c.select === true).ToArray();
    if (getSelectedItems.length === 0) {
      Swal('', 'Select the Item(s) to Reset', 'error');
      return;
    }

    this.instrumentForm.itbId = this.itbId;


    let val =
    {
      oprPinReset: this.instrumentForm,
      listoprServiceCharge: this.chargeFormList,
      templateContent: this.templateContent,
      loginUserId: this.userDetails.userId,
      serviceId: this.serviceId,
      transactionDate: this.userDetails.bankingDate,
      ValueDate: this.userDetails.bankingDate,
      LoginUserName: this.userDetails.userName,
      ListoprPinItems: getSelectedItems
    }

    console.log('update values: ', val);

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {
        console.log('Update data:', data)
        this.actionTaken = 'Y';
        element.disabled = false;
        this.actionLoaderUpdate = false;
        this.reloadLoad = 'Y';

        this.apiResponse = data;

        if(this.apiResponse.responseCode == 0)
          Swal('', this.apiResponse.responseMessage, 'success');
        else
          Swal('', this.apiResponse.responseMessage, 'error');
      },
      (error: any) => {

        element.disabled = false;
        this.actionLoaderUpdate = false;

        Swal('', error.error.responseMessage, 'error');
      });


  }


  getById(): void {

    console.log('getById itbId', this.itbId);

    this.loadPage = true;

    let track = 0;

    let url = 'PinReset/GetById';

    let val = {
      oprPinReset: {
        itbId: this.itbId
      },
      serviceId: this.serviceId
    };

    this._GeneralService.post(val, url)
      .subscribe(
        (data: any) => {

          console.log('get doc retrieval ret data', data);
          // console.log('data.allUsers.createdBy', data.allUsers.createdBy)
          this.loadPage = false;
          this.instrumentForm = data.instrumentDetails;


          this.oprPinItems = data.oprPinItems


          // this.instrumentForm.amount = this.instrumentForm.amount != null ? this._GeneralService.formatMoney(this.instrumentForm.amount) : this.instrumentForm.amount;
          this.instrumentForm.availBal = this.instrumentForm.availBal != null ? this._GeneralService.formatMoney(this.instrumentForm.availBal) : this.instrumentForm.availBal;
          this.instrumentForm.branchName = data.valInstrumentAcct.sBranchName;
          //  this.instrumentForm.chqWidrawalAmount = this.instrumentForm.chqWidrawalAmount != null ?  this._GeneralService.formatMoney(this.instrumentForm.chqWidrawalAmount) : this.instrumentForm.chqWidrawalAmount;

          this.chargeFormList = data.serviceChargeslist;

          this.instrumentForm.dateCreated = this.instrumentForm.dateCreated != null ? this._GeneralService.dateCreated(this.instrumentForm.dateCreated) : this.instrumentForm.dateCreated;

          console.log('this.instrumentForm ', this.instrumentForm);

          for (let i = 0; i <= this.chargeFormList.length; i++) {
            if (this.chargeFormList[i] != null) {
              this.chargeFormList[i].transactionDate = this.instrumentForm.transactionDate != null ? this._GeneralService.dateconvertion(this.instrumentForm.transactionDate) : this.instrumentForm.transactionDate;
              this.chargeFormList[i].valueDate = this.instrumentForm.valueDate != null ? this._GeneralService.dateconvertion(this.instrumentForm.valueDate) : this.instrumentForm.valueDate;
              this.chargeFormList[i].origChgAmount = this.chargeFormList[i].origChgAmount != null ? this._GeneralService.formatMoney(this.chargeFormList[i].origChgAmount) : this.chargeFormList[i].origChgAmount;
              this.chargeFormList[i].equivChgAmount = this.chargeFormList[i].equivChgAmount != null ? this._GeneralService.formatMoney(this.chargeFormList[i].equivChgAmount) : this.chargeFormList[i].equivChgAmount;
              this.chargeFormList[i].taxAmount = this.chargeFormList[i].taxAmount != null ? this._GeneralService.formatMoney(this.chargeFormList[i].taxAmount) : this.chargeFormList[i].taxAmount;

            }
          }

          this.updatecharParameterOnGetbyId(data)

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

  updatecharParameterOnGetbyId(data) {

    console.log('updatecharParameterOnGetbyId', data);

    this.chargeFormListParam = data.charge;

    let getOnyly = new List<any>(this.chargeFormListParam).Where(c => c.serviceId === this.serviceId).ToArray();
    console.log('getOnyly', getOnyly);

    this.chargeFormListParam = getOnyly;
    console.log('getOnyly 22', this.chargeFormListParam);
    for (let i = 0; i <= this.chargeFormListParam.length; i++) {
      if (this.chargeFormListParam[i] !== undefined) {
        this.chargeFormListParam[i].transactionDate = this.userDetails.bankingDate;
        this.chargeFormListParam[i].valueDate = this.userDetails.bankingDate;
      }
    }

    this.chargeFormListTemporal = this.chargeFormListParam;
  }

  keypress(event: any) {


    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  trigerAfterAmt(event) {
    console.log('trigerAfterAmt');
    this.initiate();
  }


  chqAmt(event) {
    console.log('validateAcct', event.target.value);
    if (event.target.value !== null) {
      // this.instrumentForm.chqAmt =  this._GeneralService.formatMoney(event.target.value)
      this.initiate();
    }

  }
  validateAcct(value) {
    console.log('validateAcct', value);
    // if(this.instrumentForm.amount === null)
    // {
    //   Swal('', 'Enter Transaction Amount', 'error');
    //   return;
    // }
    if (value !== null) {
      this.initiateAcctValidate();
    }

  }

  resetChage(data) {
    this.chargeFormListTemporal = data;
  }

  submit() {
    if (this.pnCalcAmt.trim() === '') {

      swal('', 'Enter  Quantity for Respective Charge', 'error');
      return;
    }

    this.initiate();
  }

  initiateAcctValidate(): void {


    if (this.instrumentForm.acctNo === null) {

      swal('', 'Enter  Acct No', 'error');
      return;
    }

    //console.log('this.chargeFormList.length: ', this.chargeFormList);

    for (let i = 0; i <= this.chargeFormList.length; i++) {
      //console.log('this.chargeFormListTTT: ', this.chargeFormList[i]);

      if (this.chargeFormList[i] != undefined) {
        if (this.chargeFormList[i].chargeCode === undefined) {

          swal('', 'Enter  Charge Code', 'error');
          return;

        }

        if (this.chargeFormList[i].chargeCode === "") {

          swal('', 'Enter  Charge Code', 'error');
          return;

        }

        if (this.chargeFormList[i].chargeCode === null) {

          swal('', 'Enter  Charge Code', 'error');
          return;

        }
      }
    }

    let values = {

      acctNo: this.instrumentForm.acctNo,
      acctType: this.instrumentForm.acctType,
      ListoprServiceCharge: this.chargeFormList,
      loginUserName: this.userDetails.userName,
      deptId: this.userDetails.deptId,
      userId: this.userDetails.userId,
      serviceId: this.serviceId,
      transAmout: '0',
      pnCalcAmt: '0'
    }

    // this.actionLoaderSave = true;
    //  let element = <HTMLInputElement>document.getElementById("btnInistiateDocRet");
    // element.disabled = true;


    this.loadPage = true;

    console.log('GenCal Charges values Documnet Retrieval', values)

    let url = 'ServiceCharge/AccountNoVal';



    this._GeneralService.post(values, url).subscribe(
      (data: any) => {

        console.log('Initiate data acctVal : ', data);

        this.instrumentForm.itbId = null;
        this.instrumentForm.serviceId = this.serviceId;
        this.instrumentForm.origDeptId = null;
        this.instrumentForm.referenceNo = null;
        this.instrumentForm.branchNo = data.instrumentAcctDetails.nBranch;
        this.instrumentForm.acctType = data.instrumentAcctDetails.sAccountType;  //
        this.instrumentForm.acctName = data.instrumentAcctDetails.sName;
        this.instrumentForm.availBal = data.instrumentAcctDetails.nBalance;

        this.instrumentForm.acctSic = data.instrumentAcctDetails.sSector;
        this.instrumentForm.acctStatus = data.instrumentAcctDetails.sStatus;
        this.instrumentForm.ccyCode = data.instrumentAcctDetails.sCrncyIso;
        this.instrumentForm.productCode = data.instrumentAcctDetails.productCode;

        this.instrumentForm.rsmId = data.instrumentAcctDetails.sRsmId == null ? 0 : data.instrumentAcctDetails.sRsmId;

        this.instrumentForm.branchName = data.instrumentAcctDetails.sBranchName;

        this.loadPage = false;

        if (data.instrumentAcctDetails.nErrorCode !== 0) {
          Swal('', data.instrumentAcctDetails.sErrorText, 'error');
          return;
        }
        this.actionbtnInitiate = false;
      },
      (error: any) => {

        this.loadPage = false;
        this.actionbtnInitiate = false;
        // element.disabled = false;
        Swal('', error.error.responseMessage, 'error');
      });
  }


  initiate(): void {


    if (this.instrumentForm.acctNo === null) {

      swal('', 'Enter  Acct No', 'error');
      return;
    }

    //console.log('this.chargeFormList.length: ', this.chargeFormList);

    for (let i = 0; i <= this.chargeFormList.length; i++) {
      //console.log('this.chargeFormListTTT: ', this.chargeFormList[i]);

      if (this.chargeFormListParam[i] != undefined) {
        if (this.chargeFormListParam[i].chargeCode === undefined) {

          swal('', 'Enter  Charge Code', 'error');
          return;

        }

        if (this.chargeFormListParam[i].chargeCode === "") {

          swal('', 'Enter  Charge Code', 'error');
          return;

        }

        if (this.chargeFormListParam[i].chargeCode === null) {

          swal('', 'Enter  Charge Code', 'error');
          return;

        }
      }
    }

    let values = {

      acctNo: this.instrumentForm.acctNo,
      acctType: this.instrumentForm.acctType,
      listoprServiceCharge: this.chargeFormListParam,
      loginUserName: this.userDetails.userName,
      deptId: this.userDetails.deptId,
      userId: this.userDetails.userId,
      serviceId: this.serviceId,
      transAmout: '0',
      pnCalcAmt: '0'
    }

    // this.actionLoaderSave = true;
    //  let element = <HTMLInputElement>document.getElementById("btnInistiateDocRet");
    // element.disabled = true;


    this.loadPage = true;

    console.log('GenCal Charges values Documnet Retrieval', values)

    let url = 'ServiceCharge/CalCulateCharge';

    
    if (this.userDetails.cbsStatus.toLowerCase() === 'offline') {
       Swal('', this.cbsOfflineMsg, 'error');
       return;
     }

    this._GeneralService.post(values, url).subscribe(
      (data: any) => {
        console.log('Initiate data : ', data);

        this.instrumentForm.itbId = null;
        this.instrumentForm.serviceId = this.serviceId;
        this.instrumentForm.branchNo = data.instrumentAcctDetails.nBranch;
        this.instrumentForm.acctType = data.instrumentAcctDetails.sAccountType;  //
        this.instrumentForm.acctName = data.instrumentAcctDetails.sName;
        this.instrumentForm.availBal = data.instrumentAcctDetails.nBalance;

        this.instrumentForm.acctSic = data.instrumentAcctDetails.sSector;
        this.instrumentForm.acctStatus = data.instrumentAcctDetails.sStatus;
        this.instrumentForm.ccyCode = data.instrumentAcctDetails.sCrncyIso;
        this.instrumentForm.productCode = data.instrumentAcctDetails.productCode;

        this.instrumentForm.rsmId = data.instrumentAcctDetails.sRsmId == null ? 0 : data.instrumentAcctDetails.sRsmId;


        this.instrumentForm.branchName = data.instrumentAcctDetails.sBranchName;

        this.addToChargeAcctList(data.chgList);

        this.loadPage = false;

        if (data.instrumentAcctDetails.nErrorCode !== 0) {
          Swal('', data.instrumentAcctDetails.sErrorText, 'error');
          return;
        }
        this.actionbtnInitiate = false;
      },
      (error: any) => {

        this.loadPage = false;
        this.actionbtnInitiate = false;
        // element.disabled = false;
        Swal('', error.error.responseMessage, 'error');
      });
  }



  addToChargeAcctList(chgList) {

    this.chargeFormListAppend = chgList

    let tem = [];

    for (let i = 0; i < this.chargeFormListAppend.length; i++) {

      if (this.chargeFormListAppend[i] !== undefined) {
        this.chargeFormListAppend[i].transactionDate = this.userDetails.bankingDate;
        this.chargeFormListAppend[i].valueDate = this.userDetails.bankingDate;
        this.chargeFormListAppend[i].chgNarration = this.chargeFormListAppend[i].incAcctNarr

        this.chargeFormListAppend[i].origChgAmount = this._GeneralService.formatMoney(this.chargeFormListAppend[i].origChgAmount);
        this.chargeFormListAppend[i].equivChgAmount = this._GeneralService.formatMoney(this.chargeFormListAppend[i].equivChgAmount);

        this.chargeFormListAppend[i].taxRate = this.chargeFormListAppend[i].nTaxRate;
        this.chargeFormListAppend[i].taxNarration = this.chargeFormListAppend[i].sTaxNarration;
        this.chargeFormListAppend[i].taxAcctNo = this.chargeFormListAppend[i].sTaxAcctNo;
        this.chargeFormListAppend[i].equivChgCcy = this.chargeFormListAppend[i].sChgCurrency;
        this.chargeFormListAppend[i].origChgCCy = this.chargeFormListAppend[i].sChgCurrency;
        this.chargeFormListAppend[i].taxAcctType = this.chargeFormListAppend[i].sTaxAcctType;

        this.chargeFormList.push(this.chargeFormListAppend[i]);

      }
    }

    console.log('this.chargeFormList', this.chargeFormList)


  }



  chqdate(event) {

    let val = this._GeneralService.dateconvertion(event.target.value);

    //this.instrumentForm.chqDate = val;



  }

  formatAmount(event) {
    //  this.instrumentForm.chqAmt =  this._GeneralService.formatMoney(event.target.value)
    this.initiate();
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

    this.initiate();

  }



  ngAfterViewInit() {
    this.settings.loadingSpinner = false;
  }

  close(): void {

    for (let i = 0; i < this.oprPinItems.length; i++) {
      this.oprPinItems[i].select = false;

    }


    this.pnCalcAmt = '';
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

      console.log('lllee', this.pnCalcAmt);
      if (this.instrumentForm.acctNo.trim() === '') {
        swal('', 'Enter Account Number', 'error');
        return;
      }

      let getSelectedItem = new List<oprPinItems>(this.oprPinItems).Where(c => c.select === true).ToArray()

      if (getSelectedItem.length === 0) {
        swal('', ' Select Item(s) to Reset ', 'error');
        return;
      }

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
      ServiceItbId: this.instrumentForm.itbId

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
  //Below is for Bid Security service Id 11
  validationAcctToPost(serviceId): any {

    if (this.instrumentForm.acctNo == null) {
      swal('', 'Instrument acct No is required', 'error')
      return true;
    }

    if (this.instrumentForm.acctType == null) {
      swal('', 'Instrument  acct Type is required', 'error')
      return true;
    }

    if (this.instrumentForm.acctName == null) {
      swal('', 'Instrument acct Name is required', 'error')
      return true;
    }

    if (this.instrumentForm.ccyCode == null) {
      swal('', 'Instrument acct Currency is required', 'error')
      return true;
    }

    if (this.instrumentForm.availBal == null) {
      swal('', 'Instrument acct Available Balance is required', 'error')
      return true;
    }

    if (this.instrumentForm.acctSic == null) {
      swal('', 'Instrument acct sector is required', 'error')
      return true;
    }

    // if (this.instrumentForm.branchName == null) {
    //   swal('', 'Instrument acct Branch is required', 'error')
    //   return true;
    // }

    let getSelected = new List<any>(this.oprPinItems).Where(c => c.select === true).ToArray();


    if (getSelected.length === 0) {
      swal('', 'Select the Items you want to Reset', 'error')
      return true;
    }

    if (this.chargeFormList.length === 0) {
      swal('', 'Submit your Charge List First', 'error');
      return true;
    }
  }


  radChage(event) {

    // console.log('radChage3', this.instrumentForm.hitOption)


  }


  chqProductSelected(templateId) {
    console.log('chqProductSelected quantity: ', templateId);
    console.log('chqProductSelected chqProduct: ', this.chqProduct);

    let getVen = new List<ChequeProduct>(this.chqProduct).FirstOrDefault(c => c.chqProductCode === templateId); //.ToArray();

    let num = Number(templateId);
    let get = new List<ChargeForm>(this.chargeFormListTemporal).Where(c => c.templateId === num).ToArray();
    this.chargeFormList = get;

    for (let i = 0; i < this.chargeFormList.length; i++) {
      if (this.chargeFormList != undefined)
        this.chargeFormList[i].templateId = num;
    }

    //  this.instrumentForm.vendorId = 

    this.initiate();

  }

  quantity(event) {
    console.log('quantity: ', event.target.value);
    this.initiate();
  }

  calculatePerQty(event, row: admDocumentChg) {

  }
  pinReset(rec: oprPinItems) {

    if (this.instrumentForm.acctNo === '') {

      swal('', 'Enter Instrument Account', 'error')
      return;
    }

    for (let i = 0; i < this.oprPinItems.length; i++) {
      if (rec.pinId === this.oprPinItems[i].pinId)
        this.oprPinItems[i].select = rec.select;
    }
    let getTem = new List<ChargeForm>(this.chargeFormListTemporal).Where(c => c.templateId === rec.pinId).ToArray()
    console.log('pinReset getTem', getTem);
    this.chargeFormListParam = [] || [];
    this.chargeFormListParam = getTem;

    for (let i = 0; i < getTem.length; i++) {

      this.chargeFormListParam[i].chgAcctNo = null;
      this.chargeFormListParam[i].chgAcctType = null;
      this.chargeFormListParam[i].chgAcctCcy = null;
      this.chargeFormListParam[i].templateId = getTem[0].templateId;

    }


    console.log('pinReset this.chargeFormListParam', this.chargeFormListParam);

    if (rec.select === true) {
      this.initiate();
    }
    if (rec.select === false) {

      console.log('pinReset this.chargeFormList false', this.chargeFormList);

      for (let i = 0; i < this.chargeFormList.length; i++) {

        if (this.chargeFormList[i].templateId === rec.pinId) {
          this.chargeFormList.splice(i, 1);
        }

      }
      // this.chargeFormList = concat;
    }

  }

  onChangeAcctType(acctype: any): any {


    console.log(acctype);
 
    this.acct1 = acctype.trim();
 
    //this.accountNumber = '';
    this.instrumentForm.acctNo = '';
    this.maxLength = 0;
    this.Delimeter = '';
    
   
   if(this.acct1 == '' || this.acct1 == undefined){
 
      Swal('', 'select an account Type', 'error');
      return;
    }
    else{
     this._GeneralService.onChangeAcctTypeFormat(acctype, "").
     subscribe((result:any ) => {
         this.admAccountTypeModel = result;
             
         console.log('onChangeAcctType this.admAccountTypeModel:  ' , this.admAccountTypeModel);
         this.maxLength = this.admAccountTypeModel.acctLenght;
         this.Delimeter = this.admAccountTypeModel.delimeter;
         this.accountFormat = this.admAccountTypeModel.accountFormat;
         console.log('this.Delimeter ' + this.Delimeter + ' this.accountFormat ' + this.accountFormat);
     });
 
    
    }
 
 
  }

  acctFormatType(value: any, acctType: any) {
    let val = value;
    let accountTp = acctType;
    console.log('acctFormatType val**', val);
    console.log('acctFormatType accountTp**', accountTp);
    console.log('acctFormatType acctType**', acctType);
    console.log('acctFormatType maxLength**', this.maxLength);

    if (accountTp == undefined || accountTp == null || accountTp == '') {

      let getDelimeter = new List<any>(this.acttypes).Where(c => c.accountTypeCode == 'GL').FirstOrDefault();

      console.log('accountTp getDelimeter', getDelimeter);
      console.log('accountTp ', accountTp);

      if (val.includes(getDelimeter.delimeter)) {
        this.instrumentForm.acctType = getDelimeter.accountTypeCode;
      }
      else {

      }
    }
    else {
      if (accountTp.trim().toUpperCase() === "GL") {
        let accounNoForGL = this._GeneralService.appendDelimeter(val, accountTp, this.accountFormat, this.Delimeter, this.maxLength);

        this.instrumentForm.acctNo = accounNoForGL;
      }
    }
  }

  
 checkLength(value: any, acctType: any, currencyCode: any)
 {
  const retval = this._GeneralService.checkLength(value, acctType, currencyCode);
  if(retval)
  {
    this.validateAcct(value);
    this.checkValue = false;
   this.lengthMessage = '';
  }

   
 }

 
 checkAccountNo(value: any)
 {
     console.log('values ' + value);
     if(value != '' || value != undefined){
      console.log('values ' + value);
      console.log('account ' + this.instrumentForm.acctNo);
      this.validateAcct(value);
     }
  }


}





