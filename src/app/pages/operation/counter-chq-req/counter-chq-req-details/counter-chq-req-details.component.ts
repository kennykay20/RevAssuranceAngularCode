
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
import { admService } from '../../../../model/admService';
import { TemplateComponent } from '../../../ui/dialog/template/template.component';
import { AccountValidation } from '../../../../model/acctValidation';
import { Action } from '../../../../model/Action';
import { ApiResponse } from '../../../../model/apiResponse.model';
import { OprBusinessSearchForm } from '../../../../model/oprBusinessSearchForm.model';
import { CounterChequeForm } from '../../../../model/CounterChqReqForm.model';
import { admAmendReprintReason } from '../../../../model/admAmendReprintReason';
import { Mandate } from '../../../../model/mandate.model';
import { ViewMandateDetailsComponent } from '../../view-mandate/view-mandate-details/view-mandate-details.component';
import { SweetAlertService } from '../../../../services/sweetAlert.service';
import { AlertifyService } from '../../../../services/alertify.service';
import { admAccountTypeModel } from '../../../../model/admAccountTypeDTO.model';

@Component({
  selector: 'app-counter-chq-req-details',
  templateUrl: './counter-chq-req-details.component.html',
  styleUrls: ['./counter-chq-req-details.component.scss']
})

export class CounterChqReqDetailsComponent implements OnInit {
  cbsOfflineMsg = GenModel.cbsOfflineMsg;
  admAmendReprintReason: admAmendReprintReason[]
  admAmendReprintReasonTemp: admAmendReprintReason[]
  singleadmAmendReprintReason: admAmendReprintReason
  accountValidation: AccountValidation;
  period = [] = ["DAY(S)", "MONTH(S)", "YEAR(S)",]
  apiResponse: ApiResponse;
  collTypeselect = null;
  userDetails: UserDetails
  actionTaken = 'N';
  //basicForm: FormGroup;
  currencies = [];
  sectors = [];
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
  noMandateMsg = GenModel.noMandateMsg
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


  dismissedBy: any;
  rejectedBy: any;
  instrumentForm: CounterChequeForm;
  serviceName: any;
  chargeFormList: ChargeForm[];
  chargeFormListTemporal: ChargeForm[];
  admService: admService;
  templateContent: any;
  action: Action

  actionName: string;

  btnAmendOrReprint = ''

  checkValue = false; 
  maxLength = GenModel.acctmaxLengthDefault;
  accountFormat = ''; 
  Delimeter = '';

  lengthMessage = '';
  acct1 = '';
  glAccountType = false;
  admAccountTypeModel: admAccountTypeModel;
  
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
    public dialogRef: MatDialogRef<CounterChqReqDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,

    private alertify: AlertifyService,
    private sweetAlertService: SweetAlertService
  ) {

    this.userDetails = this._GeneralService.getUserDetails();
    this.settings = this.appSettings.settings;

    this.resetAction(data);

    console.log('data details; ', data);

    this.chargeFormList = data.chargeSetup;
    this.admService = data.admService;
    console.log('data this.admService; ', this.admService);

    this.serviceId = data.serviceId;
    this.serviceName = data.serviceName;

    this.actionName = data.actionName;
    if (data.actionName === 'Ammend' || data.actionName === 'Reprint') {
      this.reformInstrumentForm();

      this.btnAmendOrReprint = this.actionName;

    }

    if (this.data.actionName === 'Add') {
      this.reformInstrumentForm();
      this.resetCharge();
      this.loadPage = false;
      let getOnyly = new List<any>(this.chargeFormList).Where(c => c.serviceId === data.serviceId).ToArray();
      console.log('getOnyly', getOnyly);

      this.chargeFormList = getOnyly;
      console.log('getOnyly 22', this.chargeFormList);
      for (let i = 0; i <= this.chargeFormList.length; i++) {
        if (this.chargeFormList[i] !== undefined) {
          this.chargeFormList[i].transactionDate = this.userDetails.bankingDate;
          this.chargeFormList[i].valueDate = this.userDetails.bankingDate;
        }
      }

      this.chargeFormListTemporal = this.chargeFormList;
    }
    else {
      this.ActionHeaderMsg = '';
      this.ActionDisplay = this.ActionViewHeaderMsg;

      this.showIni = true;
      this.getById(data);
      //  this.createdBy = data.createdBy
      // this.resetCharge();

    }
  }

  resetAction(data) {
    this.action = {
      actionName: data.actionName
    }

    console.log('data resetAction this.action; ', this.action);
  }
  reformInstrumentForm() {

    this.instrumentForm = {


      itbId: 0,
      serviceId: this.serviceId,
      origDeptId: null,
      referenceNo: null,
      branchNo: null,
      acctNo: null,
      acctType: null,
      acctName: null,
      availBal: null,
      acctSic: null,
      acctStatus: null,
      ccyCode: null,
      productCode: null,
      rsmId: 0,
      serviceStatus: null,
      status: null,
      originatingBranchId: null,
      processingDeptId: this.admService.defaultDept.toString(),
      userProcessingDept: null,
      originBranch: null,
      transactionDate: null,
      valueDate: null,
      dateCreated: null,
      userId: null,
      supervisorId: null,
      dismissedBy: null,
      dismissedDate: null,
      rejectedBy: null,
      rejected: null,
      rejectionIds: null,
      rejectionDate: null,
      printCount: null,
      branchName: null,
      select: false,
      userName: null,
      chqWidrawalAmount: null,
      beneficiaryName: null,
      transAmout: 0,
      cheqNo: null,
      reqReason: null,
      ammendOrRepreintReasonId: null
    };

    console.log('new', this.instrumentForm);
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

  ngOnInit() {
    this.loadPage = false;
    this.statuses = this._GeneralService.Statuses;

    this.loadDepartment();
    this.loadUsers();
    this.loadAcctTypes();
    this.loadCollateralTypes();
  }



  getById(record): void {

    console.log('getById id', record.record.itbId);

    this.loadPage = true;

    let track = 0;
    let url = 'CounterCheque/GetById';

    let val = {
      oprCounterChq: {
        itbId: record.record.itbId
      },
      serviceId: this.serviceId
    };


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
        (data: any) => {

          console.log('get instrument ret data', data);

          this.loadPage = false;
          this.instrumentForm = data.instrumentDetails;
          // this.instrumentForm.amount = this.instrumentForm.amount != null ? this._GeneralService.formatMoney(this.instrumentForm.amount) : this.instrumentForm.amount;
          this.instrumentForm.availBal = this.instrumentForm.availBal != null ? this._GeneralService.formatMoney(this.instrumentForm.availBal) : this.instrumentForm.availBal;
          this.instrumentForm.branchName = data.valInstrumentAcct.sBranchName;
          this.instrumentForm.chqWidrawalAmount = this.instrumentForm.chqWidrawalAmount != null ? this._GeneralService.formatMoney(this.instrumentForm.chqWidrawalAmount) : this.instrumentForm.chqWidrawalAmount;
          this.templateContent = data.template.templateContent;
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

          this.chargeFormListTemporal = this.chargeFormList;

          if (data.allUsers != undefined) {
            this.createdBy = data.allUsers.createdBy;
            this.dismissedBy = data.allUsers.dismissedBy;
            this.rejectedBy = data.allUsers.rejectedBy;
          }

          if (this.actionName.trim().toLowerCase() === 'ammend') {
            const reasons = data._response;
            const selectedReason = new List<admAmendReprintReason>(reasons).Where(c => c.reasonType.toLowerCase() === 'ammend').ToArray();
            this.admAmendReprintReason = selectedReason;
            this.admAmendReprintReasonTemp = selectedReason

          }
          if (this.actionName.trim().toLowerCase() === 'reprint') {
            const reasons = data._response;
            const selectedReason = new List<admAmendReprintReason>(reasons).Where(c => c.reasonType.toLowerCase() === 'reprint').ToArray();
            this.admAmendReprintReason = selectedReason;
            this.admAmendReprintReasonTemp = selectedReason

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
          console.log('data IssuranceCoverTypes: ', this.currencies);

          this.loadPage = false;

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

  add(values: Object): void {
    let valAcct;

    valAcct = this.validationAcctToPost(this.serviceId);

    if (valAcct === true) {
      return;
    }
    if (this.templateContent == null) {
      swal('', 'Supply Template Content', 'error');
      return;
    }


    this.actionLoaderSave = true;
    let element = <HTMLInputElement>document.getElementById("btnSave");
    element.disabled = true;

    this.instrumentForm.userId = this.userDetails.userId;
    this.instrumentForm.originatingBranchId = this.userDetails.branchNo;
    this.instrumentForm.transactionDate = this.userDetails.bankingDate;
    this.instrumentForm.valueDate = this.userDetails.bankingDate;
    this.instrumentForm.origDeptId = this.userDetails.deptId;

    this.instrumentForm.itbId = 0;

    let val =
    {
      oprCounterChq: this.instrumentForm,
      listoprServiceCharge: this.chargeFormList,
      templateContent: this.templateContent,
      loginUserId: this.userDetails.userId,
      serviceId: this.serviceId,
      transactionDate: this.userDetails.bankingDate,
      ValueDate: this.userDetails.bankingDate,
      LoginUserName: this.userDetails.userName,
    }

    console.log('val to add: ', val);

    let url = 'CounterCheque/Add';

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {


        this.reformInstrumentForm();
        this.resetChargeAfterAdd();

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


    if (this.templateContent == null) {
      swal('', 'Supply Template Content', 'error');
      return;
    }
    console.log('update chargeFormList: ', this.chargeFormList);

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement>document.getElementById("btnUpdate");

    element.disabled = true;
    let url = 'CounterCheque/Update';


    let val =
    {
      oprCounterChq: this.instrumentForm,
      listoprServiceCharge: this.chargeFormList,
      templateContent: this.templateContent,
      loginUserId: this.userDetails.userId,
      serviceId: this.serviceId,
      transactionDate: this.userDetails.bankingDate,
      ValueDate: this.userDetails.bankingDate,
      LoginUserName: this.userDetails.userName,
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

        //Swal('', this.apiResponse.responseMessage, 'success');
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

  keyPress(event: any) {

    console.log('keyPress', this.instrumentForm.acctNo);
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

  validateAcct(value) {
    console.log('validateAcct', value);
    // if(this.instrumentForm.amount === null)
    // {
    //   Swal('', 'Enter Transaction Amount', 'error');
    //   return;
    // }
    if (value !== null) {
      this.initiate();
    }

  }


  initiate(): void {

    if (this.instrumentForm.acctNo === null) {

      swal('', 'Enter  Acct No', 'error');
      return;

    }

    // if (this.instrumentForm.chqWidrawalAmount === null) {

    //   swal('', 'Enter  Withdrawal Amount', 'error');
    //   return;

    // }

    console.log('this.chargeFormList.length: ', this.chargeFormList);

    for (let i = 0; i <= this.chargeFormList.length; i++) {
      console.log('this.chargeFormListTTT: ', this.chargeFormList[i]);

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

    let col = {
      collTypeId: 0,
      userId: 0
    }

    let values = {

      acctNo: this.instrumentForm.acctNo,
      acctType: this.instrumentForm.acctType,
      ListoprServiceCharge: this.chargeFormList,
      loginUserName: this.userDetails.userName,
      deptId: this.userDetails.deptId,
      userId: this.userDetails.userId,
      serviceId: this.serviceId,
      oprCollateral: col,
      transAmout: this.instrumentForm.chqWidrawalAmount
    }


    this.loadPage = true;

    console.log('GenCal Charges values', values)

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
        this.instrumentForm.origDeptId = null;
        this.instrumentForm.referenceNo = null;
        this.instrumentForm.branchNo = data.instrumentAcctDetails.nBranch;
        this.instrumentForm.acctType = data.instrumentAcctDetails.sAccountType;  //
        this.instrumentForm.acctName = data.instrumentAcctDetails.sName;

        if (data.instrumentAcctDetails.sCustomerType != undefined
          && data.instrumentAcctDetails.sCustomerType.toLowerCase() === 'personal')
          this.instrumentForm.beneficiaryName = this.instrumentForm.acctName;


        this.instrumentForm.availBal = data.instrumentAcctDetails.nBalance;

        this.instrumentForm.acctSic = data.instrumentAcctDetails.sSector;
        this.instrumentForm.acctStatus = data.instrumentAcctDetails.sStatus;
        this.instrumentForm.ccyCode = data.instrumentAcctDetails.sCrncyIso;
        this.instrumentForm.productCode = data.instrumentAcctDetails.productCode;

        this.instrumentForm.rsmId = data.instrumentAcctDetails.sRsmId == null ? 0 : data.instrumentAcctDetails.sRsmId;


        this.instrumentForm.branchName = data.instrumentAcctDetails.sBranchName;

        this.chargeFormList = data.chgList;


        for (let i = 0; i <= this.chargeFormList.length; i++) {
          if (this.chargeFormList[i] !== undefined) {
            this.chargeFormList[i].transactionDate = this.userDetails.bankingDate;
            this.chargeFormList[i].valueDate = this.userDetails.bankingDate;
            this.chargeFormList[i].chgNarration = this.chargeFormList[i].incAcctNarr

            this.chargeFormList[i].origChgAmount = this._GeneralService.formatMoney(this.chargeFormList[i].origChgAmount);
            this.chargeFormList[i].equivChgAmount = this._GeneralService.formatMoney(this.chargeFormList[i].equivChgAmount);

            this.chargeFormList[i].taxRate = this.chargeFormList[i].nTaxRate;
            this.chargeFormList[i].taxNarration = this.chargeFormList[i].sTaxNarration;
            this.chargeFormList[i].taxAcctNo = this.chargeFormList[i].sTaxAcctNo;
            this.chargeFormList[i].equivChgCcy = this.chargeFormList[i].sChgCurrency;
            this.chargeFormList[i].origChgCCy = this.chargeFormList[i].sChgCurrency;
            this.chargeFormList[i].taxAcctType = this.chargeFormList[i].sTaxAcctType;



          }
        }


        this.loadPage = false;

        if (data.instrumentAcctDetails.nErrorCode !== 0) {

          Swal('', data.instrumentAcctDetails.sErrorText, 'error');
          return;
        }

        if (data.colAcctDetails != null) {


        }
        this.actionbtnInitiate = false;


      },
      (error: any) => {

        this.loadPage = false;
        this.actionbtnInitiate = false;
        Swal('', error.error.responseMessage, 'error');
      });
  }

  formatAmount(event) {
    this.instrumentForm.chqWidrawalAmount = this._GeneralService.formatMoney(event.target.value)
    this.initiate();
  }

  inputFormat(event)
  {
    this.instrumentForm.chqWidrawalAmount = this._GeneralService.formatMoney(event.target.value)
    //this.initiate();
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

    this.dialogRef.close(this.reloadLoad);
  }


  swapTab(value) {
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
    if (value === 3) {
      this.tab1 = '';
      this.tab2 = '';
      this.tab3 = 'active';
      this.tab4 = '';
      this.tab5 = '';
    }
    if (value === 4) {
      this.tab1 = '';
      this.tab2 = '';
      this.tab3 = '';
      this.tab4 = 'active';
      this.tab5 = '';
    }
    if (value === 5) {
      this.tab1 = '';
      this.tab2 = '';
      this.tab3 = '';
      this.tab4 = '';
      this.tab5 = 'active';
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

    if(this.instrumentForm.acctNo == null){
      swal("", "Enter Account Number", 'warning');
      return;
    }
    let val = {

      serviceId: this.serviceId,

    }

    this.loadPage = true;

    let url = 'Instrument/viewTemp';

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {

        //console.log('endDate data', data);
        this.loadPage = false;
        this.openTemp(data);

      },
      (error: any) => {

        this.loadPage = false;

        Swal('', error.error.responseMessage, 'error');
      });

  }

  openTemp(data: any): void {

    let replaceVal = {
      beneficiary : this.instrumentForm.beneficiaryName,
      dateNow : Date.now,
      acctNo: this.instrumentForm.acctNo,
      acctName: this.instrumentForm.acctName,
      ccyCode: this.instrumentForm.ccyCode,
      reason: this.instrumentForm.reqReason,
      acctBalance: this.instrumentForm.availBal,
      amount: this.instrumentForm.chqWidrawalAmount,
      branchName: this.instrumentForm.branchName,
      acctStatus: this.instrumentForm.acctStatus,
      chargeAmount: this.chargeFormList[0].origChgAmount
    }
    if (this.templateContent != null) {
      console.log('1');
      let dialogRef = this.dialog.open(TemplateComponent, {
        data: { data: this.templateContent, level:1, serviceId: this.serviceId }
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
        data: { data: data.template.templateContent, level:2, replaceVal: replaceVal, serviceId: this.serviceId }
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

    if (this.instrumentForm.branchName == null) {
      swal('', 'Instrument acct Branch is required', 'error')
      return true;
    }
    if(this.instrumentForm.beneficiaryName == null){
      swal('', 'Beneficiary Name is required', 'error')
      return true;
    }
    if(this.instrumentForm.chqWidrawalAmount == null){
      swal('', 'Withdrawal Amount is required', 'error')
      return true;
    }
    if(this.instrumentForm.reqReason == null){
      swal('', 'Select Reason below beneficiary input', 'error')
      return true;
    }
  }

  onAmmend(event) {
    let id = Number(event.target.value);
    // console.log(' onAmmend id',  id);
    this.singleadmAmendReprintReason = new List<admAmendReprintReason>(this.admAmendReprintReason).FirstOrDefault(c => c.reasonId === id)
    // console.log(' this.singleadmAmendReprintReason',  this.singleadmAmendReprintReason);
    //  console.log(' this.singleadmAmendReprintReason',  this.admAmendReprintReason);
    if (this.singleadmAmendReprintReason.chargeable === true) {
      Swal({

        title: '',
        text: 'This reason requires Charges. Are you Sure you want to Continue?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: this.btnConfirm,
        cancelButtonText: 'Cancel',
        allowEscapeKey: false,
        allowOutsideClick: false

      }).then((result) => {

        if (result.value) {
          this.reAmmend();
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
          this.admAmendReprintReason = this.admAmendReprintReasonTemp;
          this.instrumentForm.ammendOrRepreintReasonId = undefined;
        }
      });
    }

  }

  reAmmend(): void {

    if (this.instrumentForm.acctNo === null) {

      swal('', 'Enter  Acct No', 'error');
      return;

    }

    if (this.instrumentForm.chqWidrawalAmount === null) {

      swal('', 'Enter  Withdrawal Amount', 'error');
      return;

    }

    console.log('this.chargeFormList.length: ', this.chargeFormList);

    for (let i = 0; i <= this.chargeFormList.length; i++) {
      console.log('this.chargeFormListTTT: ', this.chargeFormList[i]);

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

    let col = {
      collTypeId: 0,
      userId: 0
    }

    const ammendOrReprint = this.actionName.toLocaleLowerCase() == 'ammend' ? true : false


    let values = {

      acctNo: this.instrumentForm.acctNo,
      acctType: this.instrumentForm.acctType,
      ListoprServiceCharge: this.chargeFormList,
      loginUserName: this.userDetails.userName,
      deptId: this.userDetails.deptId,
      userId: this.userDetails.userId,
      serviceId: this.serviceId,
      oprCollateral: col,
      transAmout: this.instrumentForm.chqWidrawalAmount,
      IsAmmendment: ammendOrReprint
    }


    this.loadPage = true;

    console.log('GenCal Charges values', values)

    let url = 'ServiceCharge/CalCulateChargeAmmendReprint';

    this._GeneralService.post(values, url).subscribe(
      (data: any) => {
        console.log('Initiate data : ', data);

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

        this.chargeFormList = data.chgList;


        for (let i = 0; i <= this.chargeFormList.length; i++) {
          if (this.chargeFormList[i] !== undefined) {
            this.chargeFormList[i].transactionDate = this.userDetails.bankingDate;
            this.chargeFormList[i].valueDate = this.userDetails.bankingDate;
            this.chargeFormList[i].chgNarration = this.chargeFormList[i].incAcctNarr

            this.chargeFormList[i].origChgAmount = this._GeneralService.formatMoney(this.chargeFormList[i].origChgAmount);
            this.chargeFormList[i].equivChgAmount = this._GeneralService.formatMoney(this.chargeFormList[i].equivChgAmount);

            this.chargeFormList[i].taxRate = this.chargeFormList[i].nTaxRate;
            this.chargeFormList[i].taxNarration = this.chargeFormList[i].sTaxNarration;
            this.chargeFormList[i].taxAcctNo = this.chargeFormList[i].sTaxAcctNo;
            this.chargeFormList[i].equivChgCcy = this.chargeFormList[i].sChgCurrency;
            this.chargeFormList[i].origChgCCy = this.chargeFormList[i].sChgCurrency;
            this.chargeFormList[i].taxAcctType = this.chargeFormList[i].sTaxAcctType;



          }
        }


        this.loadPage = false;

        if (data.instrumentAcctDetails.nErrorCode !== 0) {

          Swal('', data.instrumentAcctDetails.sErrorText, 'error');
          return;
        }

        if (data.colAcctDetails != null) {


        }
        this.actionbtnInitiate = false;


      },
      (error: any) => {

        this.loadPage = false;
        this.actionbtnInitiate = false;
        Swal('', error.error.responseMessage, 'error');
      });
  }


  openMandate(data: Mandate[]) {
    let dialogRef = this.dialog.open(ViewMandateDetailsComponent, {

      // width: '3500px',
      // height: '800px',
      // hasBackdrop: true,
      disableClose: true,
      // autoFocus: true,
      data: {
        data: data,

      },

    });

    dialogRef.afterClosed().subscribe(result => {



    });
  }

  getMandate(): void {

    let val = {

      acctNo: this.instrumentForm.acctNo,
      AcctType: this.instrumentForm.acctType
    }

    if (this.instrumentForm.acctNo == null && this.instrumentForm.acctType == null) {
      Swal('', 'Supply Details', 'error');
      return;
    }

    let url = 'Mandate/GetMandate';

    let element = <HTMLInputElement>document.getElementById("btnMandate");
    element.disabled = true;

    this.loadPage = true;


    this._GeneralService.post(val, url).subscribe(
      (data: any) => {
        //console.log('view mandate', data.length);
        this.loadPage = false;
        element.disabled = false;

        if (data.length === 0) {
          this.sweetAlertService.errorAlert(this.noMandateMsg);
          return;
        }

        this.openMandate(data);
      },
      (error: any) => {

        element.disabled = false;
        this.loadPage = false;
        Swal('', error.error.responseMessage, 'error');
      });

  }

  test() {
    this.alertify.success('test()');
  }

  public TestForAlert(values: any): any {

    /*
     The commented below is for AlertifyJs alert, if Ok button is clicked, the the test() will be called
    this.alertify.confirm('Are you sure you want to delete this photo', () => {
      this.test();
    });
    */
    // The commented below is for Sweet alert, if Ok button is clicked, the the test() will be called
    this.sweetAlertService.confirm("title", "alert Text", "Yes, Continue", "Cancel", () => {
      this.test();
    });

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
       //console.log('this.this.maxLength ', this.maxLength);
       //console.log('this.Delimeter ' + this.Delimeter + ' this.accountFormat ' + this.accountFormat + ' maxLength ' + this.maxLength);
       
     });
 
     ///console.log('this.this.maxLength ', this.maxLength);
    }
 
    //console.log('this.this.maxLength ', this.maxLength);
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

  acctFormatType(value: any, acctType: any) {
    let val = value;
    let accountTp = acctType;
    

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




