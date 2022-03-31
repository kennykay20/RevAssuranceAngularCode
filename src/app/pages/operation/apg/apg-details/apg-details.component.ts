

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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { InstrumentForm, CollateralForm, ChargeForm, CollateralType, CollateralCheckList } from '../../../../model/instrumentForms.model';
import { UserDetails } from '../../../../model/userDetails';
import swal from 'sweetalert2';
import { admService } from '../../../../model/admService';
import { TemplateComponent } from '../../../ui/dialog/template/template.component';
import { AccountValidation } from '../../../../model/acctValidation';
import { Action } from '../../../../model/Action';
import { CbsTransaction } from '../../../../model/cbsTransaction.model';
import { Mandate } from '../../../../model/mandate.model';
import { ViewMandateDetailsComponent } from '../../view-mandate/view-mandate-details/view-mandate-details.component';
import { admAmendReprintReason } from '../../../../model/admAmendReprintReason';
import { AllActionUser } from '../../../../model/AllActionUser.model';
import { AlertifyService } from '../../../../services/alertify.service';
import { SweetAlertService } from '../../../../services/sweetAlert.service';
import { admAccountTypeModel } from '../../../../model/admAccountTypeDTO.model';
import { auditTrailDetailComponent } from '../../../admin/auditTrail/auditTrail-details/audittrail-detail.component';

@Component({
  selector: 'app-apg-details',
  templateUrl: './apg-details.component.html',
  styleUrls: ['./apg-details.component.scss']
})

export class ApgDetailsComponent implements OnInit {
  allActionUser: AllActionUser;
  btnAmendOrReprint: string;
  accountValidation: AccountValidation;
  period = [] = ["DAY(S)", "MONTH(S)", "YEAR(S)",]
  info = 'INFORMATION'
  collTypeselect = null;
  userDetails: UserDetails
  public form: FormGroup;
  actionTaken = 'N';
  //basicForm: FormGroup;
  currencies = [];
  sectors = [];
  CollateralForm: CollateralForm[];
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
  stateList: any;
  NationalityList: any;
  localGovernmentsList: any;
  private baseUrl = environment.apiURL;
  Email: any;
  loadPage = true;
  token = GenModel.tokenName;
  cbsOfflineMsg = GenModel.cbsOfflineMsg;

  ActionHeaderMsg = GenModel.ActionHeaderMsg
  ActionViewHeaderMsg = GenModel.ActionViewHeaderMsg;
  noMandateMsg = GenModel.noMandateMsg;
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

  collateralNameSelected = "";
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
  admAmendReprintReason: admAmendReprintReason[]
  admAmendReprintReasonTemp: admAmendReprintReason[]
  singleadmAmendReprintReason: admAmendReprintReason
  users = [];
  acttypes = [];
  btnConfirm = GenModel.btnConfirm;
  dismissedBy: any;
  rejectedBy: any;
  instrumentForm: InstrumentForm;
  serviceName: any;
  chargeFormList: ChargeForm[];
  chargeFormListTempAfterAdd: ChargeForm[];
  admService: admService;
  templateContent: any;
  action: Action

  itbId: number;
  userId: number;
  actionName: string;
  checkValue = false;
  maxLength = GenModel.acctmaxLengthDefault;
  accountFormat = '';
  Delimeter = '';
  lengthMessage = '';
  acct1 = '';
  glAccountType = false;
  admAccountTypeModel: admAccountTypeModel;
  emptyString = '';
  CollateralTypeNameList = [];
  CollateralTypeIndex: number;
  tableName = "OprInstrument";

  currentYear = new Date().getUTCFullYear();
  startDateVal = new Date();
  minDate = new Date();

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
    public dialogRef: MatDialogRef<ApgDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private alertify: AlertifyService,
    private sweetAlertService: SweetAlertService
  ) {

    //console.log('apg data details; ', data);

    this.userDetails = this._GeneralService.getUserDetails();
    //console.log("this.userDetails ", this.userDetails);
    this.settings = this.appSettings.settings;

    this.itbId = data.itbId;
    this.userId = data.userId;
    this.resetAction(data);
    let initSelectEdCol = [
      {
        collateralName: null,
        selected: true
      }
    ];

    this.chargeFormList = data.chargeSetup;

    //console.log('this.chargeFormList ', this.chargeFormList);
    this.admService = data.admService;

    this.actionName = data.actionName;
    //console.log('this.actionName  1', this.actionName);

    if (data.actionName === 'Amend' || data.actionName === 'Reprint') {
      this.reformInstrumentForm();

      this.btnAmendOrReprint = this.actionName;

    }

    this.serviceId = data.serviceId;

    //console.log('this.serviceId for apg details Page', this.serviceId);

    this.serviceName = data.serviceName;

    if (this.data.actionName === 'Add') {
      this.reformInstrumentForm();
      this.resetCollateralForm();
      this.resetCharge();
      this.loadPage = false;
      let getFilterChargeList = new List<any>(this.chargeFormList).Where(c => c.serviceId === data.serviceId).ToArray();


      this.chargeFormList = getFilterChargeList;

      //console.log(`getFilterChargeList = ${getFilterChargeList}`);

      for (let i = 0; i <= this.chargeFormList.length; i++) {
        if (this.chargeFormList[i] !== undefined) {
          this.chargeFormList[i].transactionDate = this.userDetails.bankingDate;
          this.chargeFormList[i].valueDate = this.userDetails.bankingDate;
        }
      }

      this.chargeFormListTempAfterAdd = this.chargeFormList;
    }
    else {
      this.ActionHeaderMsg = '';
      this.ActionDisplay = this.ActionViewHeaderMsg;

      this.showIni = true;
      this.getById(this.itbId);
    }
  }

  clearIni() {
    this.instrumentForm.acctType = this.emptyString;
    this.instrumentForm.acctNo = this.emptyString;
    this.instrumentForm.amount = this.emptyString;
    this.instrumentForm.ccyCode = this.emptyString;

    for (let i = 0; i <= this.chargeFormList.length; i++) {
      if (this.chargeFormList[i] !== undefined) {
        this.chargeFormList[i].chgAcctType = this.emptyString;
        this.chargeFormList[i].chgAcctNo = this.emptyString;

        this.chargeFormList[i].chgAcctCcy = this.emptyString;


      }
    }

  }

  resetChgAfterAdd() {
    for (let i = 0; i <= this.chargeFormListTempAfterAdd.length; i++) {
      if (this.chargeFormList[i] !== undefined) {
        this.chargeFormList[i].transactionDate = this.userDetails.bankingDate;
        this.chargeFormList[i].valueDate = this.userDetails.bankingDate;
      }
    }

    //this.chargeFormListTempAfterAdd = this.chargeFormList;
  }

  resetAction(data) {
    this.action = {
      actionName: data.actionName
    }

    //console.log('data resetAction this.action; ', this.action);
  }
  reformInstrumentForm() {

    this.instrumentForm = new InstrumentForm();

    this.instrumentForm.serviceId = this.serviceId;
    this.instrumentForm.processingDeptId = this.admService.defaultDept;
    //this.instrumentForm.effectiveDate = this.userDetails.bankingDate;
    //alert("effectiveDate " + this.startDateVal);
    this.instrumentForm.effectiveDate = this._GeneralService.dateconvertion(this.startDateVal);
    
    this.instrumentForm.tenorPeriod = "MONTH(S)";
    this.instrumentForm.ammendOrRepreintReasonId = 0;
  }

  resetCollateralForm() {

    this.CollateralForm = [{

      itbId: 0,
      serviceId: this.serviceId,
      serviceItbId: null,
      collTypeId: 0,
      collDescription: null,
      acctNo: null,
      acctType: null,
      availBal: null,
      acctName: null,
      acctStatus: null,
      acctCCy: null,
      holdId: null,
      lienAmount: null,
      collStatus: null,
      forcedSaleValue: null,
      effectiveDate: this.instrumentForm.effectiveDate,
      expiryDate: this.instrumentForm.expiryDate,
      location: null,
      ccyCode: null,
      valuer: null,
      verifiedBy: null,
      verificationDate: null,
      marketValue: null,
      insCoyName: null,
      insured: null,
      insCoverTypeId: null,
      policyNo: null,
      sumAssured: null,
      premiumPayable: null,
      collMortgageNo: null,
      userId: null,
      status: null,
      dateCreated: null,
      placeHoldBoolean: false,
      placeHold: null,
      selected: false,
      collateralName: null
    }];

    //this.CollateralForm = init;



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

    for (let i = 0; i <= this.chargeFormList.length; i++) {
      if (this.chargeFormList[i] != undefined) {

        this.chargeFormList[i].itbId = 0;
        this.chargeFormList[i].serviceId = 0;
        this.chargeFormList[i].serviceItbId = 0;
        this.chargeFormList[i].chgAcctNo = null;
        this.chargeFormList[i].chgAcctType = null;
        this.chargeFormList[i].chgAcctName = null;
        this.chargeFormList[i].chgAvailBal = null;
        this.chargeFormList[i].chgAcctCcy = null;
        this.chargeFormList[i].chgAcctStatus = null;
        this.chargeFormList[i].chargeCode = null;
        this.chargeFormList[i].chargeRate = null;
        this.chargeFormList[i].origChgAmount = null;
        this.chargeFormList[i].origChgCCy = null;
        this.chargeFormList[i].exchangeRate = null;
        this.chargeFormList[i].equivChgAmount = null;
        this.chargeFormList[i].equivChgCcy = null;
        this.chargeFormList[i].chgNarration = null;
        this.chargeFormList[i].taxAcctNo = null;
        this.chargeFormList[i].taxAcctType = null;
        this.chargeFormList[i].taxRate = null;
        this.chargeFormList[i].taxAmount = null;
        this.chargeFormList[i].taxNarration = null;
        this.chargeFormList[i].incBranch = null;
        this.chargeFormList[i].incAcctNo = null;
        this.chargeFormList[i].incAcctType = null;
        this.chargeFormList[i].incAcctName = null;
        this.chargeFormList[i].incAcctBalance = null;
        this.chargeFormList[i].incAcctStatus = null;
        this.chargeFormList[i].incAcctNarr = null;
        this.chargeFormList[i].seqNo = 0;
        this.chargeFormList[i].status = null;
        this.chargeFormList[i].dateCreated = null;
        this.chargeFormList[i].transactionDate = this.userDetails.bankingDate;
        this.chargeFormList[i].valueDate = this.userDetails.bankingDate;
        this.chargeFormList[i].nTaxRate = null;
        this.chargeFormList[i].sTaxNarration = null;
        this.chargeFormList[i].sTaxAcctNo = null;
        this.chargeFormList[i].sChgCurrency = null;
        this.chargeFormList[i].sTaxAcctType = null


      }
    }
  }

  ngOnInit() {
    this.loadPage = false;
    this.statuses = this._GeneralService.Statuses;

    this.loadDepartment();
    this.loadUsers();
    this.loadAcctTypes();
    this.loadCollateralTypes();
  }



  getById(itbId): void {

    console.log('getById id', itbId);
    console.log('service id', this.serviceId);

    this.loadPage = true;

    let track = 0;
    let url = 'Instrument/GetById';

    let val = {
      OprInstrument: {
        itbId: itbId,
        userId: this.userId
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

          console.log('get 1**', this.actionName.trim().toLowerCase());

          this.loadPage = false;

          if (this.actionName.trim().toLowerCase() === 'amend') {
            const reasons = data._response;
            const selectedReason = new List<admAmendReprintReason>(reasons).Where(c => c.reasonType.toLowerCase() === 'amend').ToArray();
            this.admAmendReprintReason = selectedReason;
            this.admAmendReprintReasonTemp = selectedReason

          }
          if (this.actionName.trim().toLowerCase() === 'reprint') {
            const reasons = data._response;
            const selectedReason = new List<admAmendReprintReason>(reasons).Where(c => c.reasonType.toLowerCase() === 'reprint').ToArray();
            this.admAmendReprintReason = selectedReason;
            this.admAmendReprintReasonTemp = selectedReason

          }
          this.instrumentForm = data.instrumentDetails;
          this.chargeFormList = data.serviceChargeslist;

          console.log('data.collateral ', data.collateral);
          this.CollateralForm = data.collateral;

          console.log('this.CollateralForm get ', this.CollateralForm);
          this.bindCollaterGebById(this.CollateralForm)

          console.log('get instrument this.CollateralForm', this.CollateralForm);

          this.instrumentForm.amount = this.instrumentForm.amount != null ? this._GeneralService.formatMoney(this.instrumentForm.amount) : this.instrumentForm.amount;
          this.instrumentForm.availBal = this.instrumentForm.availBal != null ? this._GeneralService.formatMoney(this.instrumentForm.availBal) : this.instrumentForm.availBal;
          this.instrumentForm.branchName = data.valInstrumentAcct.sBranchName;
          this.templateContent = data.template.templateContent;
          
          this.CollateralForm = data.collateral;

          for (let i = 0; i < this.CollateralForm.length; i++) {
            if (this.CollateralForm[i] != null) {

              this.CollateralForm[i].lienAmount = this.CollateralForm[i].lienAmount != null ? this._GeneralService.formatMoney(this.CollateralForm[i].lienAmount) : this.CollateralForm[i].lienAmount;

              this.CollateralForm[i].forcedSaleValue = this.CollateralForm[i].forcedSaleValue != null ? this._GeneralService.formatMoney(this.CollateralForm[i].forcedSaleValue) : this.CollateralForm[i].forcedSaleValue;

              this.CollateralForm[i].marketValue = this.CollateralForm[i].marketValue != null ? this._GeneralService.formatMoney(this.CollateralForm[i].marketValue) : this.CollateralForm[i].marketValue;

              this.CollateralForm[i].availBal = this.CollateralForm[i].availBal != null ? this._GeneralService.formatMoney(this.CollateralForm[i].availBal) : this.CollateralForm[i].availBal;


              this.CollateralForm[i].effectiveDate = this.CollateralForm[i].effectiveDate != null ? this._GeneralService.dateconvertion(this.CollateralForm[i].effectiveDate) : this.CollateralForm[i].effectiveDate;

              this.CollateralForm[i].expiryDate = this.CollateralForm[i].expiryDate != null ? this._GeneralService.dateconvertion(this.CollateralForm[i].expiryDate) : this.CollateralForm[i].expiryDate;


            }
          }

         
          this.instrumentForm.insuranceEffectiveDate = this.instrumentForm.insuranceEffectiveDate != null ? this._GeneralService.dateconvertion(this.instrumentForm.insuranceEffectiveDate) : this.instrumentForm.insuranceEffectiveDate;
          this.instrumentForm.insuranceExpiryDate = this.instrumentForm.insuranceExpiryDate != null ? this._GeneralService.dateconvertion(this.instrumentForm.insuranceExpiryDate) : this.instrumentForm.insuranceExpiryDate;

        

          this.instrumentForm.effectiveDate = this.instrumentForm.effectiveDate != null ? this._GeneralService.dateconvertion(this.instrumentForm.effectiveDate) : this.instrumentForm.effectiveDate;
          this.instrumentForm.expiryDate = this.instrumentForm.expiryDate != null ? this._GeneralService.dateconvertion(this.instrumentForm.expiryDate) : this.instrumentForm.expiryDate;
          this.instrumentForm.contractDate = this.instrumentForm.contractDate != null ? this._GeneralService.dateconvertion(this.instrumentForm.contractDate) : this.instrumentForm.contractDate;
          this.instrumentForm.dateCreated = this.instrumentForm.dateCreated != null ? this._GeneralService.dateCreated(this.instrumentForm.dateCreated) : this.instrumentForm.dateCreated;

          console.log('this.instrumentForm ', this.instrumentForm);

          for (let i = 0; i < this.chargeFormList.length; i++) {
            if (this.chargeFormList[i] != null) {
              this.chargeFormList[i].transactionDate = this.instrumentForm.transactionDate != null ? this._GeneralService.dateconvertion(this.instrumentForm.transactionDate) : this.instrumentForm.transactionDate;
              this.chargeFormList[i].valueDate = this.instrumentForm.valueDate != null ? this._GeneralService.dateconvertion(this.instrumentForm.valueDate) : this.instrumentForm.valueDate;
              this.chargeFormList[i].origChgAmount = this.chargeFormList[i].origChgAmount != null ? this._GeneralService.formatMoney(this.chargeFormList[i].origChgAmount) : this.chargeFormList[i].origChgAmount;
              this.chargeFormList[i].equivChgAmount = this.chargeFormList[i].equivChgAmount != null ? this._GeneralService.formatMoney(this.chargeFormList[i].equivChgAmount) : this.chargeFormList[i].equivChgAmount;
              this.chargeFormList[i].taxAmount = this.chargeFormList[i].taxAmount != null ? this._GeneralService.formatMoney(this.chargeFormList[i].taxAmount) : this.chargeFormList[i].taxAmount;

            }
          }

          if (data.allUsers != undefined) {
            // console.log('data.allUsers: ', data.allUsers);

            this.allActionUser = data.allUsers;
            this._GeneralService.saveRejandDismissDetails(data.allUsers);
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

  bindCollaterGebById(rec: CollateralForm[]) {

    for (let i = 0; i < this.CollateralForm.length; i++) {
      if (this.CollateralForm[i] != null || this.CollateralForm[i] != undefined) {
      if (this.CollateralForm[i].collTypeId == 1) {
        this.CollateralForm[i].collateralName = 'CASH';
        this.CollateralForm[i].selected = true;
      }

      if (this.CollateralForm[i].collTypeId == 2) {
        this.CollateralForm[i].collateralName = 'LEGAL MORTGAGE';
        this.CollateralForm[i].selected = true;
      }

      if (this.CollateralForm[i].collTypeId == 3) {
        this.CollateralForm[i].collateralName = 'DEBENTURE MORTGAGE';
        this.CollateralForm[i].selected = true;
      }
      if (this.CollateralForm[i].collTypeId == 4) {
        this.CollateralForm[i].collateralName = 'OTHERS';
        this.CollateralForm[i].selected = true;
      }
      if (this.CollateralForm[i].collTypeId == 5) {
        this.CollateralForm[i].collateralName = 'INSURANCE';
        this.CollateralForm[i].selected = true;
      }


      this.CollateralForm[i].placeHoldBoolean = this.CollateralForm[i].placeHold == 'Y' ? true : false;

     }
   }
  }

  loadreason1(): void {

    console.log('loadreason start');

    this.loadPage = true;
    let track = 0;
    let url = 'AmendReprintReason/GetAll';


    let val =
    {
      pdtCurrentDate: this.userDetails,
      psBranchNo: this.userDetails.branchNo,
      pnDeptId: this.userDetails.deptId,
      pnGlobalView: 'N', // hard code will later get this from role Assing
      serviceId: this.serviceId,
      roleId: this.userDetails.roleId,
      menuId: 20
    }



    this._GeneralService.post(val, url)
      .subscribe(
        (data: any) => {
          console.log('loadreason: ', data._response);

          this.admAmendReprintReason = data._response;

        },
        (error: any) => {

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

          this.CollateralTypes = data.colType;
          this.templateTypes = data.temp;
          this.IssuranceCoverTypes = data.issuranceCoverType;
          this.currencies = data.currencies;
          this.sectors = data.sectors;
          //console.log('data IssuranceCoverTypes: ', this.currencies);
          //console.log('data templateTypes loadCollateralTypes: ', this.templateTypes);

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


  acctFormatType(value: any, acctType: any) {
    let val = value;
    let accountTp = acctType;
    // console.log('acctFormatType val**', val);
    // console.log('acctFormatType accountTp**', accountTp);
    // console.log('acctFormatType acctType**', acctType);
    // console.log('acctFormatType maxLength**', this.maxLength);

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


  onChangeAcctType11(acctype: any): any {

    console.log(acctype);

    this.acct1 = acctype.trim();

    //this.accountNumber = '';
    //this.instrumentForm.acctNo = '';
    //this.maxLength = 0;
    this.Delimeter = '';


    if (this.acct1 == '' || this.acct1 == undefined) {

      Swal('', 'select an account Type', 'error');
      return;
    }
    else {
      this._GeneralService.onChangeAcctTypeFormat(acctype, "").
        subscribe((result: any) => {
          this.admAccountTypeModel = result;

          console.log('onChangeAcctType this.admAccountTypeModel:  ', this.admAccountTypeModel);
          this.maxLength = this.admAccountTypeModel.acctLenght;
          this.Delimeter = this.admAccountTypeModel.delimeter;
          this.accountFormat = this.admAccountTypeModel.accountFormat;
          console.log('this.Delimeter ' + this.Delimeter + ' this.accountFormat ' + this.accountFormat);
        });

    }
  }

  onChangeAcctType(acctype: any): any {


    //console.log(acctype);

    this.acct1 = acctype.trim();

    //this.accountNumber = '';
    this.instrumentForm.acctNo = '';
    this.maxLength = 0;
    this.Delimeter = '';

    for (let i = 0; i < this.chargeFormList.length; i++){
      if (this.chargeFormList != undefined){
        this.chargeFormList[i].chgAcctType = null;
        this.chargeFormList[i].chgAcctNo = null;
      }
      
    }


    if (this.acct1 == '' || this.acct1 == undefined) {

      Swal('', 'select an account Type', 'error');
      return;
    }
    else {
      this._GeneralService.onChangeAcctTypeFormat(acctype, "").
        subscribe((result: any) => {

          this.admAccountTypeModel = result;

          console.log('onChangeAcctType this.admAccountTypeModel:  ', this.admAccountTypeModel);
          this.maxLength = this.admAccountTypeModel.acctLenght;
          this.Delimeter = this.admAccountTypeModel.delimeter;
          this.accountFormat = this.admAccountTypeModel.accountFormat;
          console.log('this.this.maxLength ', this.maxLength);
          console.log('this.Delimeter ' + this.Delimeter + ' this.accountFormat ' + this.accountFormat + ' maxLength ' + this.maxLength);

        });

      console.log('this.this.maxLength ', this.maxLength);
    }

    console.log('this.this.maxLength ', this.maxLength);
  }




  /*Thos method is used for add new request
     Ammendment and reprint
     */
  add(values: Object): void {
    let valAcct;
    let element;
    let url: string;
    let val;

    if (this.serviceId == 11) {
      valAcct = this.validationForBidSecurity(this.serviceId);

      if (valAcct === true) {
        return;
      }

    }

    if (this.serviceId == 14) {
      valAcct = this.validationForBankGuarantee(this.serviceId);

      if (valAcct === true) {
        return;
      }

    }

    if (this.serviceId == 18) {
      valAcct = this.validationForPerfBond(this.serviceId);

      if (valAcct === true) {
        return;
      }

    }

    if (this.serviceId == 19) {
      valAcct = this.validationForAPG(this.serviceId);

      if (valAcct === true) {
        return;
      }

    }

    if (this.serviceId == 22) {
      valAcct = this.validationForAPG(this.serviceId);

      if (valAcct === true) {
        return;
      }

    }

    if (this.serviceId == 23) {
      valAcct = this.validationForAPG(this.serviceId);

      if (valAcct === true) {
        return;
      }

    }

    if(this.serviceId == 11)
    {
      if (this.templateContent == null) {
        swal('', 'Supply Template Content', 'error');
        return;
      }
    }

    valAcct = this.valCol();

    if (valAcct === true) {
      return;
    }

    this.instrumentForm.origDeptId = this.userDetails.deptId;

    if (this.actionName.toLocaleLowerCase() === 'amend' || this.actionName.toLocaleLowerCase() === 'reprint') {
      if (this.singleadmAmendReprintReason === undefined) {
        swal('', 'Select Amendment Reason', 'error');
        return;
      }

      let btnName = this.actionName.toLocaleLowerCase() === 'amend' ? "btnAmend" : "btnReprint"
      this.actionLoaderSave = true;
      element = <HTMLInputElement>document.getElementById(btnName);
      element.disabled = true;

      let ammendORReprintText = this.actionName.toLocaleLowerCase() === 'amend' ? 'Amend' : 'Reprint'
      for (let i = 0; i < this.CollateralForm.length; i++) {
        let chkPlaceHold = this.CollateralForm[i].placeHoldBoolean == true ? 'Y' : 'N'
        this.CollateralForm[i].placeHold = chkPlaceHold;
      }

      let collateralFilterList = this.CollateralForm.filter(c => c.collTypeId > 0);

    
      console.log('collateralFilterList', collateralFilterList);
      
      this.instrumentForm.status = null;

      val =
      {
        oprInstrument: this.instrumentForm,
        listoprServiceCharge: this.chargeFormList,
        ListoprCollateral: collateralFilterList,
        templateContent: this.templateContent,
        loginUserId: this.userDetails.userId,
        serviceId: this.serviceId,
        transactionDate: this.userDetails.bankingDate,
        ValueDate: this.userDetails.bankingDate,
        loginUserName: this.userDetails.userName,
        admAmendReprintReason: this.singleadmAmendReprintReason,
        ammendmentOrReprintTxt: ammendORReprintText
      }

      url = 'Instrument/AmmendOrReprint';
    }

    if (this.actionName.toLocaleLowerCase() === 'add') {
      this.actionLoaderSave = true;
      element = <HTMLInputElement>document.getElementById("btnSave");
      element.disabled = true;

      this.instrumentForm.userId = this.userDetails.userId;
      this.instrumentForm.originatingBranchId = this.userDetails.branchNo;


      for (let i = 0; i < this.CollateralForm.length; i++) {
        let chkPlaceHold = this.CollateralForm[i].placeHoldBoolean == true ? 'Y' : 'N'
        this.CollateralForm[i].placeHold = chkPlaceHold;
      }

      var collateralFilterList = this.CollateralForm.filter(c => c.collTypeId > 0);
      console.log('getWHere', collateralFilterList);

      val =
      {
        oprInstrument: this.instrumentForm,
        listoprServiceCharge: this.chargeFormList,
        ListoprCollateral: collateralFilterList,  // this.CollateralForm,
        templateContent: this.templateContent,
        loginUserId: this.userDetails.userId,
        serviceId: this.serviceId,
        transactionDate: this.userDetails.bankingDate,
        ValueDate: this.userDetails.bankingDate,
        LoginUserName: this.userDetails.userName,


      }
      url = 'Instrument/Add'
    }


    console.log('val to add: ', val);

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {

        if (this.actionName.toLocaleLowerCase() === 'add') {
          this.reformInstrumentForm();
          this.resetCollateralForm();
          this.resetChargeAfterAdd();
          element.disabled = false;
          this.templateContent = null;
          this.chargeFormList = this.chargeFormListTempAfterAdd;

          this.reloadLoad = 'Y';
        }
        this.actionLoaderSave = false;
        element.disabled = false;
        Swal('', data.responseMessage, 'success');
      },
      (error: any) => {
        console.log(' error.error', error.error);
        this.actionLoaderSave = false;
        element.disabled = false;
        Swal('', error.error.responseMessage, 'error');
      });
  }

  update(instrumentVal:any): void {

    console.log('instrumentVal ', instrumentVal);
    let valAcct;

    if (this.serviceId == 11) {
      valAcct = this.validationForBidSecurity(this.serviceId);

      if (valAcct === true) {
        return;
      }

    }


    if (this.serviceId == 14) {
      valAcct = this.validationForBankGuarantee(this.serviceId);

      if (valAcct === true) {
        return;
      }

    }

    if (this.serviceId == 18) {
      valAcct = this.validationForPerfBond(this.serviceId);

      if (valAcct === true) {
        return;
      }

    }

    if (this.serviceId == 19) {
      valAcct = this.validationForAPG(this.serviceId);

      if (valAcct === true) {
        return;
      }

    }

    if(this.serviceId == 22)
    {
      console.log("service id = ", this.serviceId);
      console.log("Retention bond");
      valAcct = this.validationForRetentionBond(this.serviceId);

      if(valAcct === true)
      {
        return;
      }
    }
    
    if(this.serviceId == 11)
    {
      if (this.templateContent == null) {
        swal('', 'Supply Template Content', 'error');
        return;
      }
    }

    console.log('update chargeFormList: ', this.chargeFormList);

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement>document.getElementById("btnUpdate");

    element.disabled = true;
    let url = 'Instrument/Update';

    //let chkPlaceHold = this.CollateralForm.placeHoldBoolean == true ? 'Y' : 'N'
    // this.CollateralForm.placeHold = chkPlaceHold;

    this.instrumentForm.origDeptId = this.userDetails.deptId;

    let val =
    {
      oprInstrument: this.instrumentForm,
      listoprServiceCharge: this.chargeFormList,
      ListoprCollateral: this.CollateralForm,
      templateContent: this.templateContent,
      loginUserId: this.userDetails.userId,
      UserId: this.userDetails.userId,
      loginUserName: this.userDetails.userName
    }


    console.log('update values: ', val);

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {
        console.log('Update data:', data)
        this.actionTaken = 'Y';
        element.disabled = false;
        this.actionLoaderUpdate = false;
        this.reloadLoad = 'Y';

        //this.CollateralForm.holdId = data.oprCollateral.holdId;

        if(data.apiResponse.responseCode == 0)
          Swal('', data.apiResponse.responseMessage, 'success');
        else
          Swal('', data.apiResponse.responseMessage, 'error');
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

  validateAcct(event) {

    if (this.instrumentForm.amount === null) {
      Swal('', 'Enter Transaction Amount', 'error');
      return;
    }

    //this.genCalChg(event.target.value)

    //this.initiate();
  }



  formatAmount(event) {
    this.instrumentForm.amount = this._GeneralService.formatMoney(event.target.value)

  }

  inputFormat(event) {
    this.instrumentForm.amount = this._GeneralService.formatMoney(event.target.value)
  }

  formatLientAmount(rec: CollateralForm) {

    let lienAmt = Number(rec.lienAmount);
    console.log('lienAmt rec', lienAmt);

    for (let i = 0; i < this.CollateralForm.length; i++) {
      if (this.CollateralForm[i].collTypeId === rec.collTypeId) {
        this.CollateralForm[i].lienAmount = this._GeneralService.formatMoney(rec.lienAmount)


        let availBal = this._GeneralService.replaceAll(this.CollateralForm[i].availBal, ',', '');
        console.log('availBal rec', availBal);
        if (lienAmt > availBal) {
          swal('', `Lien Amount Couldn't be greater than the Available Balance`, 'error');

          this.CollateralForm[i].lienAmount = null;
        }


        return;
      }

    }


  }



  formatSumAssured(event) {
    this.instrumentForm.insuranceSumAssured = this._GeneralService.formatMoney(event.target.value)
  }

  formatColAmount(event) {
    // this.CollateralForm.lienAmount =  this._GeneralService.formatMoney(event.target.value)
  }

  colMarketValAmount(rec: CollateralForm) {
    console.log('market value', rec);
    for (let i = 0; i < this.CollateralForm.length; i++) {
      console.log('market value 1');
      if (this.CollateralForm[i].collTypeId === rec.collTypeId) {
        console.log('market value 2');
        this.CollateralForm[i].marketValue = this._GeneralService.formatMoney(rec.marketValue)
        return;
      }

    }
  }

  colforceSaleValAmount(rec: CollateralForm) {
    console.log('forcedSaleValue value', rec);
    for (let i = 0; i < this.CollateralForm.length; i++) {

      if (this.CollateralForm[i].collTypeId === rec.collTypeId) {

        this.CollateralForm[i].forcedSaleValue = this._GeneralService.formatMoney(rec.forcedSaleValue)
        return;
      }

    }
  }


  initiate(): void {

    console.log('Test Retention Bond');
    if (this.instrumentForm.acctType == '') {
      swal('', 'Select Instrument Acct Type ', 'error');
      return;
    }

    if (this.instrumentForm.ccyCode == '') {
      swal('', 'Select Instrument Currency', 'error');
      return;
    }

    if (this.instrumentForm.acctNo == '') {
      swal('', 'Enter Instrument Account No. ', 'error');
      return;
    }

    if (this.instrumentForm.amount == '') {
      swal('', 'Enter Instrument Amount ', 'error');
      return;
    }
    //console.log('this.chargeFormList.length: ', this.chargeFormList);

    for (let i = 0; i <= this.chargeFormList.length; i++) {
      console.log('this.chargeFormListTTT: ', this.chargeFormList[i]);

      if (this.chargeFormList[i] != undefined) {

        if (this.chargeFormList[i].chgAcctType === undefined) {

          swal('', 'Select Charge AcctType', 'error');
          return;

        }

        if (this.chargeFormList[i].chgAcctNo === undefined) {

          swal('', 'Enter  Charge Acct No', 'error');
          return;

        }

        if (this.chargeFormList[i].chargeCode === undefined) {

          swal('', 'Enter  Charge Code', 'error');
          return;

        }

        if (this.chargeFormList[i].chargeCode === null) {

          swal('', 'Enter  Charge Code', 'error');
          return;

        }

        if (this.chargeFormList[i].chgAcctType === null) {

          swal('', 'Select  Charge Acct Type', 'error');
          return;

        }

        if (this.chargeFormList[i].chgAcctCcy === null) {

          swal('', 'Select  Charge Currency Type', 'error');
          return;

        }

      }


    }   

    //console.log('gen calc this.basicForm.value.amount11: ', this.instrumentForm.amount);



    let values = {

      acctNo: this.instrumentForm.acctNo,
      acctType: this.instrumentForm.acctType,
      transAmout: this.instrumentForm.amount,
      ListoprServiceCharge: this.chargeFormList,
      loginUserName: this.userDetails.userName,
      deptId: this.userDetails.deptId,
      userId: this.userDetails.userId,
      serviceId: this.serviceId,
      // oprCollateral: col
    }


    if (this.userDetails.cbsStatus.toLowerCase() === 'offline') {
      Swal('', this.cbsOfflineMsg, 'error');
      return;
    }

    //this.loadPage = true;

    //console.log('GenCal Charges values', values)

    let url = 'instrument/CalCulateCharge';

    
    //  this.actionLoaderSave = true;
    this.actionbtnInitiate = true;
    let element = <HTMLInputElement>document.getElementById("btnInitiate");
    element.disabled = true;

    this._GeneralService.post(values, url).subscribe(
      (data: any) => {
        console.log('Initiate data : ', data);

        this.actionbtnInitiate = false;
        element.disabled = false;
        this.showIni = true;

        this.instrumentForm.itbId = null;
        this.instrumentForm.serviceId = this.serviceId;
        this.instrumentForm.origDeptId = null;
        this.instrumentForm.referenceNo = null;
        this.instrumentForm.branchNo = data.instrumentAcctDetails.nBranch;
        this.instrumentForm.acctType = data.instrumentAcctDetails.sAccountType;  //
        this.instrumentForm.acctName = data.instrumentAcctDetails.sName;
        this.instrumentForm.availBal = data.instrumentAcctDetails.nBalance;
        this.instrumentForm.availBalString = data.instrumentAcctDetails.nBalance;
        this.instrumentForm.acctSic = data.instrumentAcctDetails.sSector == null ? '' : data.instrumentAcctDetails.sSector;
        this.instrumentForm.acctStatus = data.instrumentAcctDetails.sStatus;
        this.instrumentForm.ccyCode = data.instrumentAcctDetails.sCrncyIso;
        this.instrumentForm.serialNo = this.instrumentForm.serialNo;
        this.instrumentForm.rsmId = data.instrumentAcctDetails.sRsmId == null ? 0 : data.instrumentAcctDetails.sRsmId;
        this.instrumentForm.instrumentCcy = this.instrumentForm.ccyCode;
        this.instrumentForm.acctProductCode = data.instrumentAcctDetails.sProductCode;
        this.instrumentForm.acctCustNo = data.instrumentAcctDetails.sCustomerId;
        // Contigent
        this.instrumentForm.contDrAcctType = data.oprInstrument.contCrAcctType;
        this.instrumentForm.contDrAcctNo = data.oprInstrument.contDrAcctNo;
        this.instrumentForm.contDrAcctName = data.oprInstrument.contDrAcctName;
        this.instrumentForm.contDrCcyCode = data.oprInstrument.contDrCcyCode;
        this.instrumentForm.contDrAvailBal = data.oprInstrument.contDrAvailBal;
        this.instrumentForm.contDrAcctStatus = data.oprInstrument.contDrAcctStatus;
        this.instrumentForm.contCrAcctType = data.oprInstrument.contCrAcctType;
        this.instrumentForm.contCrAcctNo = data.oprInstrument.contCrAcctNo;
        this.instrumentForm.contCrAcctName = data.oprInstrument.contCrAcctName;
        this.instrumentForm.contCrCcyCode = data.oprInstrument.contCrCcyCode;
        this.instrumentForm.contCrAvailBal = data.oprInstrument.contCrAvailBal;
        this.instrumentForm.contCrAcctStatus = data.oprInstrument.contCrAcctStatus;

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

            this.instrumentForm.contDrAcctNarration = this.chargeFormList[i].incAcctNarr;
            this.instrumentForm.contCrAcctNarration = this.chargeFormList[i].incAcctNarr;


          }
        }


        this.loadPage = false;

        if (data.instrumentAcctDetails.nErrorCode !== 0) {

          Swal('', data.instrumentAcctDetails.sErrorText, 'error');
          return;
        }

        if (data.colAcctDetails != null) {
         
        }
        

      },
      (error: any) => {
        console.log('Error Validate: ', error);
        this.loadPage = false;
        this.actionbtnInitiate = false;
        element.disabled = false;
        Swal('', error.error.responseMessage, 'error');
      });
  }

  shortInitiate(acctNumber): void{


    let values =  {  
 
      acctNo :   this.instrumentForm.acctNo,
      acctType : this.instrumentForm.acctType,
      loginUserName: this.userDetails.userName,
      userId: this.userDetails.userId,
      CcyCode: this.instrumentForm.ccyCode
    }

    this.loadPage = true;

    let url = 'ServiceCharge/ValidateAccountCall';

    if (this.userDetails.cbsStatus.toLowerCase() === 'offline') {
      Swal('', this.cbsOfflineMsg, 'error');
      return;
    }

    this._GeneralService.post(values, url).subscribe(
      (data: any)=> {
        //console.log('Initiate data : ', data);
        this.loadPage = false;

        if(data.instrumentAcctDetails.nErrorCode !== 0)
        {
                  
          Swal('', data.instrumentAcctDetails.sErrorText, 'error');
          return;
        }

        this.instrumentForm.acctType = data.instrumentAcctDetails.sAccountType;  //
        this.instrumentForm.ccyCode = data.instrumentAcctDetails.sCrncyIso;

        for (let i = 0; i <= this.chargeFormList.length; i++) {
          if (this.chargeFormList[i] !== undefined) {
            this.chargeFormList[i].chgAcctNo = acctNumber;
            this.chargeFormList[i].chgAcctType = data.instrumentAcctDetails.sAccountType;
            this.chargeFormList[i].chgAcctCcy = data.instrumentAcctDetails.sCrncyIso;
          }
    
        }
    },
    (error: any) => {
      //console.log('Error Validate: ', error);
      this.loadPage = false;
      
      Swal('', error.error.responseMessage, 'error');
    });
  }

  reAmmend(): void {

    if (this.instrumentForm.acctType == null) {
      swal('', 'Select Instrument Acct Type ', 'error');
      return;
    }

    if (this.instrumentForm.ccyCode == null) {
      swal('', 'Select Instrument Currency', 'error');
      return;
    }

    if (this.instrumentForm.amount == null) {
      swal('', 'Enter Instrument Amount ', 'error');
      return;
    }

    /*if(this.CollateralForm.acctNo == null) {
      swal('','Enter Collateral Acct ', 'error');
      return;
    }
  
    
    if(this.CollateralForm.lienAmount == null) {
      swal('','Enter Collateral Amount ', 'error');
      return;
    }
  */
    console.log('this.chargeFormList.length: ', this.chargeFormList);

    for (let i = 0; i <= this.chargeFormList.length; i++) {
      console.log('this.chargeFormListTTT: ', this.chargeFormList[i]);

      if (this.chargeFormList[i] != undefined) {

        if (this.chargeFormList[i].chgAcctType === undefined) {

          swal('', 'Select Charge AcctType', 'error');
          return;

        }

        if (this.chargeFormList[i].chgAcctNo === undefined) {

          swal('', 'Enter  Charge Acct No', 'error');
          return;

        }

        if (this.chargeFormList[i].chargeCode === undefined) {

          swal('', 'Enter  Charge Code', 'error');
          return;

        }

        if (this.chargeFormList[i].chargeCode === null) {

          swal('', 'Enter  Charge Code', 'error');
          return;

        }

        if (this.chargeFormList[i].chargeCode === null) {

          swal('', 'Enter  Charge Code', 'error');
          return;

        }

        if (this.chargeFormList[i].chgAcctType === null) {

          swal('', 'Select  Charge Acct Type', 'error');
          return;

        }

      }


    }

    // let col = {
    //   collTypeId: 0,
    //   acctNo: this.CollateralForm.acctNo,
    //   ccyCode: this.CollateralForm.acctCCy,
    //   userId: 0
    // }   

    console.log('gen calc this.basicForm.value.amount11: ', this.instrumentForm.amount);

    const ammendOrReprint = this.actionName.toLocaleLowerCase() == 'amend' ? true : false

    let values = {

      acctNo: this.instrumentForm.acctNo,
      acctType: this.instrumentForm.acctType,
      transAmout: this.instrumentForm.amount,
      ListoprServiceCharge: this.chargeFormList,
      loginUserName: this.userDetails.userName,
      deptId: this.userDetails.deptId,
      userId: this.userDetails.userId,
      serviceId: this.serviceId,
      oprInstrument: this.instrumentForm,
      IsAmmendment: ammendOrReprint
    }


    this.loadPage = true;

    // console.log('GenCal Charges values', values)

    let url = 'instrument/CalCulateChargeAmmendReprint';

    this.actionbtnInitiate = true;


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
        this.instrumentForm.availBalString = data.instrumentAcctDetails.nBalance;
        this.instrumentForm.acctSic = data.instrumentAcctDetails.sSector;
        this.instrumentForm.acctStatus = data.instrumentAcctDetails.sStatus;
        this.instrumentForm.ccyCode = data.instrumentAcctDetails.sCrncyIso;
        this.instrumentForm.serialNo = this.instrumentForm.serialNo;
        this.instrumentForm.rsmId = data.instrumentAcctDetails.sRsmId == null ? 0 : data.instrumentAcctDetails.sRsmId;
        this.instrumentForm.instrumentCcy = this.instrumentForm.ccyCode;
        this.instrumentForm.acctProductCode = data.instrumentAcctDetails.sProductCode;
        this.instrumentForm.acctCustNo = data.instrumentAcctDetails.sCustomerId;
        // Contigent
        this.instrumentForm.contDrAcctType = data.oprInstrument.contCrAcctType;
        this.instrumentForm.contDrAcctNo = data.oprInstrument.contDrAcctNo;
        this.instrumentForm.contDrAcctName = data.oprInstrument.contDrAcctName;
        this.instrumentForm.contDrCcyCode = data.oprInstrument.contDrCcyCode;
        this.instrumentForm.contDrAvailBal = data.oprInstrument.contDrAvailBal;
        this.instrumentForm.contDrAcctStatus = data.oprInstrument.contDrAcctStatus;
        this.instrumentForm.contCrAcctType = data.oprInstrument.contCrAcctType;
        this.instrumentForm.contCrAcctNo = data.oprInstrument.contCrAcctNo;
        this.instrumentForm.contCrAcctName = data.oprInstrument.contCrAcctName;
        this.instrumentForm.contCrCcyCode = data.oprInstrument.contCrCcyCode;
        this.instrumentForm.contCrAvailBal = data.oprInstrument.contCrAvailBal;
        this.instrumentForm.contCrAcctStatus = data.oprInstrument.contCrAcctStatus;

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

            this.instrumentForm.contDrAcctNarration = this.chargeFormList[i].incAcctNarr;
            this.instrumentForm.contCrAcctNarration = this.chargeFormList[i].incAcctNarr;


          }
        }


        this.loadPage = false;

        if (data.instrumentAcctDetails.nErrorCode !== 0) {

          Swal('', data.instrumentAcctDetails.sErrorText, 'error');
          return;
        }

        if (data.colAcctDetails != null) {
          /*this.CollateralForm.itbId				= 0;
          this.CollateralForm.serviceId			 =  this.serviceId;
          this.CollateralForm.serviceItbId		 =  0;
          this.CollateralForm.collDescription		 =  null;
          this.CollateralForm.acctNo				 = this.instrumentForm.acctNo;
          this.CollateralForm.acctType			 =  data.colAcctDetails.sAccountType;
          this.CollateralForm.availBal			 =  data.colAcctDetails.nBalanceDec;
          this.CollateralForm.acctName			 =  data.colAcctDetails.sName;
          this.CollateralForm.acctStatus			 =  data.colAcctDetails.sStatus;
          this.CollateralForm.acctCCy				 =  data.colAcctDetails.sCrncyIso;
          this.CollateralForm.holdId				 =  null;
          this.CollateralForm.collStatus			 =  null;
          this.CollateralForm.forcedSaleValue		 =  null;
          this.CollateralForm.effectiveDate		 =  null;
          this.CollateralForm.expiryDate			 =  null;
          this.CollateralForm.location			 =  null;
          this.CollateralForm.ccyCode				 =  null;
          this.CollateralForm.valuer				 =  null;
          this.CollateralForm.verifiedBy			 =  null;
          this.CollateralForm.verificationDate	 =  null;
          this.CollateralForm.marketValue			 =  null;
          this.CollateralForm.collMortgageNo		 =  null;
          this.CollateralForm.userId				 =  null;
          this.CollateralForm.status				 =  null;
          this.CollateralForm.dateCreated			= null;

          */
        }
        this.actionbtnInitiate = false;

        this.showIni = true;

      },
      (error: any) => {

        this.loadPage = false;
        this.actionbtnInitiate = false;
        //element.disabled = false;
        Swal('', error.error.responseMessage, 'error');
      });
  }

  checkAccountNo(value: any) {
    console.log('values ' + value);
    if (value != '' || value != undefined) {
      this.autoPopulate(value);
      this.checkValue = false;
      this.lengthMessage = '';
    }
  }

  checkLength(acctNumber: any, acctType: any, currencyCode: any) {
    this.checkValue = false;
    this.lengthMessage = '';

    const retval = this._GeneralService.checkLength(acctNumber, acctType, currencyCode);
    if (retval) {
      this.shortInitiate(acctNumber);
      this.checkValue = false;
      this.lengthMessage = '';
    }

  }


  autoPopulate(event) {
    console.log('autoPopulateEven', event);
    // var val = event.target.value;
    // console.log('autoPopulate', val);

    console.log('autoPopulate this.chargeFormLis', this.chargeFormList);

    // this.CollateralForm.acctNo = val;

    // for (let i = 0; i <= this.chargeFormList.length; i++) {
    //   if (this.chargeFormList[i] !== undefined) {
    //     this.chargeFormList[i].chgAcctNo = event;
    //   }

    // }

    this.shortInitiate(event);
  }

  chgChargeCalculate(event) {

    let userDetails = this._GeneralService.getUserDetails();

    let instrumentForm = this.instrumentForm;






    let values = {

      acctNo: this.instrumentForm.acctNo,
      acctType: this.instrumentForm.acctType,
      transAmout: '0',
      ListoprServiceCharge: this.chargeFormList, //this.chargeSetup,
      loginUserName: userDetails.userName,
      deptId: userDetails.deptId,
      userId: userDetails.userId,
      serviceId: this.serviceId
    }

    this.loadPage = true;

    let url = 'Cards/CalCulateCharge';

    console.log('CalCulateCharge values: ', values);



    this._GeneralService.post(values, url).subscribe(
      (data: any) => {
        console.log('Cal Charges: ', data);

        this.instrumentForm.itbId = instrumentForm.itbId,
          this.instrumentForm.serviceId = null,
          this.instrumentForm.origDeptId = null,
          this.instrumentForm.referenceNo = null,
          this.instrumentForm.branchNo = data.instrumentAcctDetails.nBranch,
          this.instrumentForm.acctType = data.instrumentAcctDetails.sAccountType,  //
          this.instrumentForm.acctName = data.instrumentAcctDetails.sName,
          this.instrumentForm.availBal = data.instrumentAcctDetails.nBalanceDec,
          this.instrumentForm.availBalString = data.instrumentAcctDetails.nBalance,
          this.instrumentForm.acctSic = data.instrumentAcctDetails.sSector,
          this.instrumentForm.acctStatus = data.instrumentAcctDetails.sStatus,
          this.instrumentForm.ccyCode = data.instrumentAcctDetails.sCrncyIso,
          this.instrumentForm.serialNo = instrumentForm.serialNo,
          this.instrumentForm.rsmId = data.instrumentAcctDetails.sRsmId,
          /*
          wkfId: null,
          recordDate:  this._GeneralService.dateconvertion(dataDate),
          serviceStatus:  null,
           chgAcctNo:  data.chgAcctNo,
          chgAcctType:  data.chgAcctType,
          chgAcctName:  data.chgAcctName,
          chgAvailBal:  data.chgAvailBal,
          chgAcctCcy:  data.chgAcctCcy,
          chgAcctStatus:  data.chgAcctStatus,
          chargeCode:  data.chargeCode,
          chargeRate:  data.chargeRate,
          origChargeAmount:  data.origChargeAmount,
          exchangeRate:  data.exchangeRate,
          equivChargeAmount:  data.equivChargeAmount,
          taxAcctNo:  data.taxAcctNo,
          taxAcctType:  data.taxAcctType,
          chgNarration:  data.chgNarration,
          taxRate:  data.taxRate,
          taxAmount:  data.taxAmount,
          taxNarration:  data.taxNarration,
          incomeBranch:  data.incomeBranch,
          incomeAcctNo:  data.incomeAcctNo,
          incomeAcctType:  data.incomeAcctType,
          incomeAcctName:  data.incomeAcctName,
          incomeAcctBalance:  data.incomeAcctBalance,
          incomeAcctStatus:  data.incomeAcctStatus,
          incomeAcctCcy:  data.incomeAcctCcy,
          incomeAcctNarr:  data.incomeAcctNarr,
          rsmId:  data.instrumentAcctDetails.sRsmId,
          status:  data.status,
          originatingBranchId:  data.originatingBranchId,
          processingDeptId:  data.processingDeptId,
          transactionDate:  data.transactionDate != null ? this._GeneralService.dateconvertion(data.transactionDate): data.transactionDate,
          valueDate:   data.valueDate != null ? this._GeneralService.dateconvertion(data.valueDate): data.valueDate,
          userId : data.userId,
          valAcctError:  data.valAcctError,
          errorCode:  data.errorCode,
          errorMsg:  data.errorMsg,
          dismissedBy:  data.acctNo,
          dismissedDate:  data.dismissedDate,
          rejected:  data.acctNo,
          rejectionIds:  data.acctNo,
          rejectionDate:  data.acctNo,
          rejectedBy:  data.acctNo,
          createdBy: new FormControl(null),
          dateCreated: this._GeneralService.dateCreated(data.datecreated),
          */
          this.instrumentForm.branchName = data.instrumentAcctDetails.sBranchName;
        this.chargeFormList = data.chgList;
        /*for (let i = 0; i < data.chgList.length; i++) 
        {

          this.chargeForm  = {
            itbId :  [null],
            serviceId: this.serviceId,
            serviceItbId		 :  [null],   
            chgAcctNo			 :   data.chgList[i].chgAcctNo,
            chgAcctType			 :  data.chgList[i].chgAcctType,
            chgAcctName			 :  data.chgList[i].chgAcctName,
            chgAvailBal			 :  data.chgList[i].chgAvailBal,
            chgAcctCcy			 :  data.chgList[i].chgAcctCcy,
            chgAcctStatus		 :  data.chgList[i].chgAcctStatus,
            chargeCode			 :  data.chgList[i].chargeCode,
            chargeRate			 :  data.chgList[i].nChargeRate,
            origChgAmount		 :  data.chgList[i].nOrigChargeAmount,
            origChgCCy			 :  data.chgList[i].sTransCurrency,
            exchangeRate		 :  data.chgList[i].nExchRate,
            equivChgAmount		 :  data.chgList[i].nActualChgAmt,
            equivChgCcy			 :  data.chgList[i].sTransCurrency,
            chgNarration		 :  data.chgList[i].sNarration,
           // taxAcctNo			 :  data.chgList[i].select,
           // taxAcctType			 :  data.chgList[i].select,
            taxRate				 :  data.chgList[i].nTaxRate,
            taxAmount			 :  data.chgList[i].nTaxAmt,
            taxNarration		 :  data.chgList[i].sTaxNarration,
            incBranch			 :  data.chgList[i].incBranch,
            incAcctNo			 :  data.chgList[i].sChargeIncAcctNo,
            incAcctType			 :  data.chgList[i].sChargeIncAcctType,
            incAcctName			 :  data.chgList[i].incAcctName,
            incAcctBalance		 :  data.chgList[i].incAcctBalance,
            incAcctStatus		 :  data.chgList[i].incAcctStatus,
            incAcctNarr			 :  data.chgList[i].sNarration,
            seqNo				 :  null,
            status				 : null,
          //  dateCreated			 :  data.chgList[i].select,
            transactionDate: data.chgList[i].bankingDate, 
            valueDate:  data.chgList[i].bankingDate     
          };
        }
        */
        console.log('this.basicform after Cal: ', this.instrumentForm);


        this.loadPage = false;

        if (data.instrumentAcctDetails.nErrorCode !== 0) {
          console.log('instrumentForm: ', instrumentForm);


          Swal('', data.instrumentAcctDetails.sErrorText, 'error');
          return;
        }



      },
      (error: any) => {

        this.loadPage = false;

        Swal('', this.errorOccur, 'error');
      });
  }



  ngAfterViewInit() {
    this.settings.loadingSpinner = false;
  }

  close(): void {

    this.dialogRef.close(this.reloadLoad);
  }


  swapTab(value) {
    console.log('swapTab: ', value);
    console.log('this.CollateralForm.length ', this.CollateralForm.length);

    for(let i = 1; i < this.CollateralForm.length; i++)
    {
        console.log('true > 1');
        console.log('this.CollateralForm.length 2 ', this.CollateralForm.length);
        //this.CollateralForm.pop();
    }
    

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
      console.log("this.collateralNameSelected ", this.collateralNameSelected);
      if(this.collateralNameSelected != ""){
        console.log("selected name ", this.collateralNameSelected);
      }
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

  changeEffectdate1(event) {

    let val = this._GeneralService.dateconvertion(event.target.value);
    console.log('changeEffectdate1 val', val);
    // let id = event.target.id;
    // console.log('changeEffectdate1 this.instrumentForm', this.instrumentForm);
    this.instrumentForm.effectiveDate = val;
    if(this.instrumentForm.tenor != null){
      this.endDate();
    }
    //this.endDate();
  }


  changeExpiryDate1(event): void {
    console.log('changeExpiryDate1 tenor', this.instrumentForm.tenor);

    if (this.instrumentForm.tenor != null) {
      let val = this._GeneralService.dateconvertion(event.target.value);
      this.instrumentForm.expiryDate = val;
      this.endDate();
    }

    if (this.instrumentForm.tenor == null) {
      swal('', 'Enter Instrument Tenor', 'error');
      this.instrumentForm.expiryDate = null;
      return;
    }

  }

  changeContractDate1(event) {

    let val = this._GeneralService.dateconvertion(event);
    //console.log('changeEffectdate1 val', val);
    // let id = event.target.id;

    this.instrumentForm.contractDate = val;
    // let todayDate = new Date();
    // let today  = this.datepipe.transform(val, 'yyyy-MM-dd');
    // console.log('datepipe  today', today);
  }

  instrumentInsuranceEffectiveDate1(event) {

    let val = this._GeneralService.dateconvertion(event.target.value);
    //console.log('changeEffectdate1 val', val);
    // let id = event.target.id;

    this.instrumentForm.insuranceEffectiveDate = val;
    // let todayDate = new Date();
    // let today  = this.datepipe.transform(val, 'yyyy-MM-dd');
    // console.log('datepipe  today', today);
  }

  instrumentInsuranceExpireDate1(event): void {



    let effectiveDate = this._GeneralService.dateCompare(this.instrumentForm.insuranceEffectiveDate);
    let expiryDate = this._GeneralService.dateCompare(event.target.value);
    if (effectiveDate > expiryDate) {
      swal('', `Insurance Effective Date Could'nt be greater than it Expiry Date `, 'error');
      // this.CollateralForm.expiryDate = null;
      return;
    }

    this.instrumentForm.insuranceExpiryDate = this._GeneralService.dateconvertion(event.target.value);

  }

  // Insurance Date Below

  insuranceEffectiveDate1(event) {

    let date = this._GeneralService.dateconvertion(event.target.value);
    console.log('effectiveDate date', date);
    this.instrumentForm.insuranceEffectiveDate = date;

  }

  insuranceExpiryDate1(event) {

    let date = this._GeneralService.dateconvertion(event.target.value);
    console.log('effectiveDate date', date);
    this.instrumentForm.insuranceExpiryDate = date;

  }

  insuranceGetEffectiveDate1(value) {

    let date = this._GeneralService.dateconvertion(value);
    console.log('effectiveDate date', date);
    this.instrumentForm.insuranceEffectiveDate = date;

  }

  insuranceGetExpiryDate1(value) {

    let date = this._GeneralService.dateconvertion(value);
    console.log('effectiveDate date', date);
    this.instrumentForm.insuranceExpiryDate = date;

  }

  // Collaterat Date Below

  colEffectiveGetDate(value, rec: CollateralForm) {

    let date = this._GeneralService.dateconvertion(value);
    console.log('effectiveDate date', date);
    for (let i = 0; i < this.CollateralForm.length; i++) {

      if (this.CollateralForm[i].collTypeId === rec.collTypeId) {

        this.CollateralForm[i].effectiveDate = date;
        return;
      }

    }

  }

  colEffectiveDate1(event, rec: CollateralForm) {

    let date = this._GeneralService.dateconvertion(event.target.value);
    console.log('effectiveDate date', date);
    for (let i = 0; i < this.CollateralForm.length; i++) {

      if (this.CollateralForm[i].collTypeId === rec.collTypeId) {

        this.CollateralForm[i].effectiveDate = date;
        return;
      }

    }

  }

  colEffectiveDateChange(event) {

    let val = this._GeneralService.dateconvertion(event);
    //console.log('changeEffectdate1 val', val);
    // let id = event.target.id;
    // console.log('changeEffectdate1 this.instrumentForm', this.instrumentForm);
    this.instrumentForm.effectiveDate = val;
    if(this.instrumentForm.tenor != null){
      this.endDate();
    }

  }

  colExpiryDate1(event, rec: CollateralForm): void {

    let date = this._GeneralService.dateconvertion(event.target.value);
    console.log('effectiveDate date', date);
    for (let i = 0; i < this.CollateralForm.length; i++) {

      if (this.CollateralForm[i].collTypeId === rec.collTypeId) {
        this.CollateralForm[i].expiryDate = date;

        let effectiveDate = this._GeneralService.dateCompare(this.CollateralForm[i].effectiveDate);
        let expiryDate = this._GeneralService.dateCompare(this.CollateralForm[i].expiryDate);
        if (effectiveDate > expiryDate) {
          swal('', `Collateral Effective Date Could'nt be greater than Expiry Date `, 'error');
          this.CollateralForm[i].expiryDate = null;
          return;
        }
        return;
      }

    }

  }
  colExpiryGetDate(value, rec: CollateralForm): void {

    let date = this._GeneralService.dateconvertion(value);
    console.log('effectiveDate date', date);
    for (let i = 0; i < this.CollateralForm.length; i++) {

      if (this.CollateralForm[i].collTypeId === rec.collTypeId) {
        this.CollateralForm[i].expiryDate = date;

        let effectiveDate = this._GeneralService.dateCompare(this.CollateralForm[i].effectiveDate);
        let expiryDate = this._GeneralService.dateCompare(this.CollateralForm[i].expiryDate);
        if (effectiveDate > expiryDate) {
          swal('', `Collateral Effective Date Could'nt be greater than Expiry Date `, 'error');
          this.CollateralForm[i].expiryDate = null;
          return;
        }
        return;
      }

    }

  }
  colVerificationDate1(event, rec: CollateralForm) {

    let date = this._GeneralService.dateconvertion(event.target.value);

    for (let i = 0; i < this.CollateralForm.length; i++) {

      if (this.CollateralForm[i].collTypeId === rec.collTypeId) {

        this.CollateralForm[i].verificationDate = date;
        return;
      }

    }


  }
  //// Collaterat Date End here
  tenor(event) {
    //console.log('tenor event.target.value;', event.target.value)
    this.instrumentForm.tenor = event.target.value;
    this.endDate();
  }



  endDate(): void {
    //console.log('endDate start;')

    //console.log('endDate this.instrumentForm', this.instrumentForm)
    if (this.instrumentForm.effectiveDate == null) {
      swal('', 'Select Effective Date', 'error');
      return;
    }

    let val = {

      effectiveDate: this.instrumentForm.effectiveDate,
      tenorPeriod: this.instrumentForm.tenor,
      timeBasis: this.instrumentForm.tenorPeriod
    }

    this.loadPage = true;

    let url = 'Instrument/GetEndDate';

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {

        //console.log('endDate data', data);
        this.instrumentForm.expiryDate = data.expiryDate

        this.loadPage = false;
      },
      (error: any) => {

        this.loadPage = false;

        Swal('', error.error.responseMessage, 'error');
      });

  }

  public onOptionsSelected(event) {
    this.instrumentForm.tenorPeriod = event.target.value;
    if(this.instrumentForm.tenor != null){
      this.endDate();
    }
    
  }

  viewTemp(): void {

    if(this.instrumentForm.acctNo == null){
      swal("", "Enter Account Number", 'warning');
      return;
    }
    let val = {

      serviceId: this.serviceId,
      ServiceItbId: this.instrumentForm.itbId == null ? 0 : this.instrumentForm.itbId
    }

    console.log('viewTemp data val', val);

    this.loadPage = true;

    let url = 'Instrument/viewTemp';

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {

        //console.log('data', data);
        this.loadPage = false;
        this.openTemp(data, data);

      },
      (error: any) => {

        this.loadPage = false;

        Swal('', error.error.responseMessage, 'error');
      });

  }

  openTemp(data: any, serviceDetail): void {
    let replaceVal = {
      dateIssued : new Date(),
      acctNo: this.instrumentForm.acctNo,
      acctName: this.instrumentForm.acctName,
      ccyCode: this.instrumentForm.ccyCode,
      beneficiary: this.instrumentForm.beneficiary,
      beneficiaryNameAndAddress: (this.instrumentForm.beneficiary !== "" ? this.instrumentForm.beneficiary.toUpperCase() : "(Name") + " and " + (this.instrumentForm.addressLine1 !== "" ? this.instrumentForm.addressLine1.toUpperCase() : "Address of Beneficiary)"),
      acctBalance: this.instrumentForm.availBal,
      addressLine1: this.instrumentForm.addressLine1,
      purpose:this.instrumentForm.purpose,
      branchName: this.instrumentForm.branchName,
      acctStatus: this.instrumentForm.acctStatus,
      chargeAmount: this.chargeFormList[0].origChgAmount,
      amount: this.instrumentForm.amount,
      amountInWords: ""
    }

    if (this.templateContent != null) {
      //console.log('1');
      //console.log("this.templateContent ", this.templateContent);
      if(this.serviceId == 19)
        this.templateContent = this.replaceTemplateApg("", replaceVal);
      if(this.serviceId == 14)
        this.templateContent = this.replaceTemplateBankGuar("", replaceVal);
      //console.log("templateContent ", this.templateContent);
      let dialogRef = this.dialog.open(TemplateComponent, {
        data: { data: this.templateContent, serviceId: this.serviceId, serviceDetail: serviceDetail, level:1, replaceVal: replaceVal}
      });

      dialogRef.afterClosed().subscribe(result => {

        //console.log('tem  close res', result);

        if (result !== undefined) {
          this.templateContent = result;
        }
      });
    }
    else {
      //console.log('2');
      let replaceData = data.template.templateContent;
      if(this.serviceId == 19)
        replaceData = this.replaceTemplateApg(data.template.templateContent, replaceVal);
      if(this.serviceId == 14)
        replaceData = this.replaceTemplateBankGuar(data.template.templateContent, replaceVal);
      //console.log("replaceData ", replaceData);
      let dialogRef = this.dialog.open(TemplateComponent, {
        data: { data: replaceData, serviceId: this.serviceId, serviceDetail: serviceDetail, level:2, replaceVal: replaceVal }
      });

      dialogRef.afterClosed().subscribe(result => {

        //console.log('tem  close res', result);

        if (result !== undefined) {
          this.templateContent = result;
        }
      });
    }

  }

  replaceTemplateApg(templateContent, replaceVal:any){
    if(templateContent !== ""){
      return `${templateContent.replace('(Name and Address of Beneficiary)', replaceVal.beneficiaryNameAndAddress).
      replace('(Contract/Purpose)', replaceVal.purpose !== null ? replaceVal.purpose.toUpperCase() : '(Contract/Purpose)').
      replace('{{DateIssued}}', replaceVal.dateIssued !== null ? this._GeneralService.dateconvertion(replaceVal.dateIssued) : '{{DateIssued}}').
      replace(new RegExp('(Amount in Figures)', 'g'), replaceVal.amount !== null ? replaceVal.amount : '(Amount in Figures)').
      replace('(NAME OF CUSTOMER/CONTRACTOR)', replaceVal.acctName !== null ? replaceVal.acctName.toUpperCase() : '(NAME OF CUSTOMER/CONTRACTOR)').
      replace('(NAME OF CUSTOMER/CONTRACTOR’s)', replaceVal.acctName !== null ? replaceVal.acctName.toUpperCase() : '(NAME OF CUSTOMER/CONTRACTOR’s)').
      replace('(Address of Customer)', replaceVal.addressLine1 !== '' ? replaceVal.addressLine1.toUpperCase() : '(Address of Customer)').
      replace('(NAME OF BENEFICIARY)', replaceVal.beneficiary !== '' ? replaceVal.beneficiary.toUpperCase() : '(NAME OF BENEFICIARY)').
      replace(new RegExp('(Amount in words)', 'g'), "Thousands")}`;
    }
    return `${this.templateContent.replace('(Name and Address of Beneficiary)', replaceVal.beneficiaryNameAndAddress).
    replace('(Contract/Purpose)', replaceVal.purpose !== null ? replaceVal.purpose.toUpperCase() : '(Contract/Purpose)').
    replace('{{DateIssued}}', replaceVal.dateIssued !== null ? this._GeneralService.dateconvertion(replaceVal.dateIssued) : '{{DateIssued}}').
    replace(new RegExp('(Amount in Figures)', 'g'), replaceVal.amount !== null ? replaceVal.amount : '(Amount in Figures)').
    replace('(NAME OF CUSTOMER/CONTRACTOR)', replaceVal.acctName !== null ? replaceVal.acctName.toUpperCase() : '(NAME OF CUSTOMER/CONTRACTOR)').
    replace('(NAME OF CUSTOMER/CONTRACTOR’s)', replaceVal.acctName !== null ? replaceVal.acctName.toUpperCase() : '(NAME OF CUSTOMER/CONTRACTOR’s)').
    replace('(Address of Customer)', replaceVal.addressLine1 !== '' ? replaceVal.addressLine1.toUpperCase() : '(Address of Customer)').
    replace('(NAME OF BENEFICIARY)', replaceVal.beneficiary !== '' ? replaceVal.beneficiary.toUpperCase() : '(NAME OF BENEFICIARY)').
    replace(new RegExp('(Amount in words)', 'g'), "Thousands")}`;
  }
  replaceTemplateBankGuar(templateContent, replaceVal:any){
    if(templateContent !== ""){
      return `${templateContent.replace('(Name and Address of Beneficiary)', replaceVal.beneficiaryNameAndAddress).
      replace('(Contract/Purpose)', replaceVal.purpose !== null ? replaceVal.purpose.toUpperCase() : '(Contract/Purpose)').
      replace('{{DateIssued}}', replaceVal.dateIssued !== null ? this._GeneralService.dateconvertion(replaceVal.dateIssued) : '{{DateIssued}}').
      replace(new RegExp('(Amount in Figures)', 'g'), replaceVal.amount !== null ? replaceVal.amount : '(Amount in Figures)').
      replace('(NAME OF CUSTOMER/CONTRACTOR)', replaceVal.acctName !== null ? replaceVal.acctName.toUpperCase() : '(NAME OF CUSTOMER/CONTRACTOR)').
      replace('(NAME OF CUSTOMER/CONTRACTOR’s)', replaceVal.acctName !== null ? replaceVal.acctName.toUpperCase() : '(NAME OF CUSTOMER/CONTRACTOR’s)').
      replace('(Address of Customer)', replaceVal.addressLine1 !== '' ? replaceVal.addressLine1.toUpperCase() : '(Address of Customer)').
      replace('(NAME OF BENEFICIARY)', replaceVal.beneficiary !== '' ? replaceVal.beneficiary.toUpperCase() : '(NAME OF BENEFICIARY)').
      replace(new RegExp('(Amount in words)', 'g'), "Thousands")}`;
    }
    return `${this.templateContent.replace('(Name and Address of Beneficiary)', replaceVal.beneficiaryNameAndAddress).
    replace('(Contract/Purpose)', replaceVal.purpose !== null ? replaceVal.purpose.toUpperCase() : '(Contract/Purpose)').
    replace('{{DateIssued}}', replaceVal.dateIssued !== null ? this._GeneralService.dateconvertion(replaceVal.dateIssued) : '{{DateIssued}}').
    replace(new RegExp('(Amount in Figures)', 'g'), replaceVal.amount !== null ? replaceVal.amount : '(Amount in Figures)').
    replace('(NAME OF CUSTOMER/CONTRACTOR)', replaceVal.acctName !== null ? replaceVal.acctName.toUpperCase() : '(NAME OF CUSTOMER/CONTRACTOR)').
    replace('(NAME OF CUSTOMER/CONTRACTOR’s)', replaceVal.acctName !== null ? replaceVal.acctName.toUpperCase() : '(NAME OF CUSTOMER/CONTRACTOR’s)').
    replace('(Address of Customer)', replaceVal.addressLine1 !== '' ? replaceVal.addressLine1.toUpperCase() : '(Address of Customer)').
    replace('(NAME OF BENEFICIARY)', replaceVal.beneficiary !== '' ? replaceVal.beneficiary.toUpperCase() : '(NAME OF BENEFICIARY)').
    replace(new RegExp('(Amount in words)', 'g'), "Thousands")}`;
  }
  //Below is for Bid Security service Id 11
  validationForBidSecurity(serviceId): any {

    if (this.instrumentForm.acctNo == null || this.instrumentForm.acctNo == "") {
      swal('', 'Instrument acct No is required', 'error')
      return true;
    }

    if (this.instrumentForm.acctType == null || this.instrumentForm.acctType == "") {
      swal('', 'Instrument  acct Type is required', 'error')
      return true;
    }

    if (this.instrumentForm.acctName == null || this.instrumentForm.acctName == "") {
      swal('', 'Instrument acct Name is required', 'error')
      return true;
    }

    if (this.instrumentForm.ccyCode == null || this.instrumentForm.ccyCode == "") {
      swal('', 'Instrument acct Currency is required', 'error')
      return true;
    }

    if (this.instrumentForm.availBal == null || this.instrumentForm.availBal == "") {
      swal('', 'Instrument acct Available Balance is required', 'error')
      return true;
    }

    if (this.instrumentForm.acctSic == null || this.instrumentForm.acctSic == "") {
      swal('', 'Instrument acct sector is required', 'error')
      return true;
    }

    if (this.instrumentForm.branchName == null || this.instrumentForm.branchName == "") {
      swal('', 'Instrument acct Branch is required', 'error')
      return true;
    }

    if (this.instrumentForm.effectiveDate == null || this.instrumentForm.effectiveDate == "") {
      swal('', 'Instrument Effective Date  is required', 'error')
      return true;
    }

    if (this.instrumentForm.tenor == null || this.instrumentForm.tenor == "") {
      swal('', 'Instrument Tenor  is required', 'error')
      return true;
    }

    // if (this.instrumentForm.tenorPeriod == null) {
    //   swal('', 'Instrument Tenor Period is required', 'error')
    //   return true;
    // }

    if (this.instrumentForm.expiryDate == null || this.instrumentForm.expiryDate == "") {
      swal('', 'Instrument Expiry Date is required', 'error')
      return true;
    }

    if (this.instrumentForm.ccyCode == null) {
      swal('', 'Instrument Curreny is required', 'error')
      return true;
    }

    if (this.instrumentForm.amount == null || this.instrumentForm.amount == "") {
      swal('', 'Instrument Amount is required', 'error')
      return true;
    }

    // if(this.instrumentForm.contractNo == null){
    //   swal('','Instrument Contract No is required', 'error')
    //   return true;
    // }

    // if(this.instrumentForm.contractDate == null){
    //   swal('','Instrument Contract Date  is required', 'error')
    //   return true;
    // }

    if (this.instrumentForm.beneficiary == null || this.instrumentForm.beneficiary == "") {
      swal('', 'Instrument Beneficiary  is required', 'error')
      return true;
    }
    if (this.instrumentForm.purpose == null || this.instrumentForm.purpose == "") {
      swal('', 'Instrument Purpose  is required', 'error')
      return true;
    }
    if (this.instrumentForm.adresseeName == null || this.instrumentForm.adresseeName == "") {
      swal('', 'Instrument Adressee Name  is required', 'error')
      return true;
    }
    
    //collateral Start here
    //if CollateralType check is selected and name is cash
    if(this.CollateralTypeNameList.length > 0)
    {
      if(this.CollateralTypeNameList.includes("CASH"))
      {
        //let filterNum = this.CollateralForm.filter(x => x.collateralName == "CASH");
        let indexNums = this.CollateralForm.findIndex(x => x.collateralName == "CASH");

        console.log('cash yes');
        
        if(this.CollateralForm[indexNums].acctType == ''){
          swal('','CASH Account Type is required', 'error')
          return true;
        }

        if(this.CollateralForm[indexNums].acctNo == ''){
          swal('','CASH Account No is required', 'error')
          return true;
        }

        if(this.CollateralForm[indexNums].lienAmount == null || this.CollateralForm[indexNums].lienAmount == ''){
          swal('','CASH Lien Amount is required', 'error')
          return true;
        }

        if(this.CollateralForm[indexNums].expiryDate == null){
          swal('','CASH expiry date is required', 'error')
          return true;
        }
      }
    }
    
    
    //collateral End  here


    //Insurance start here

    if(this.CollateralTypeNameList.length > 0)
    {
      if(this.CollateralTypeNameList.includes("INSURANCE"))
      {
        console.log('Yes Insurance');
        if(this.instrumentForm.insured == null || this.instrumentForm.insured == ''){
          swal('','Insurance Insured is required', 'error')
          return true;
        }
    
        if(this.instrumentForm.insuranceCoverTypeId == null || this.instrumentForm.insuranceCoverTypeId == ''){
          swal('','Insurance Cover Type is required', 'error')
          return true;
        }
    
        if(this.instrumentForm.insuranceEffectiveDate == null){
          swal('','Insurance Effective Date No is required', 'error')
          return true;
        }
      
        if(this.instrumentForm.insuranceExpiryDate == null){
          swal('','Insurance Expire Date is required', 'error')
          return true;
        }
    
        if(this.instrumentForm.insurancePolicyNo == null || this.instrumentForm.insurancePolicyNo == ''){
          swal('','Insurance Policy No is required', 'error')
          return true;
        }
    
        if(this.instrumentForm.insuranceSumAssured == null ){
          swal('','Insurance Sum Assured is required', 'error')
          return true;
        }
        
        //insuranceLocationOfProperty

        if(this.instrumentForm.insuranceLocationOfProperty == null || this.instrumentForm.insuranceLocationOfProperty == ''){
          swal('','Insurance Location Of Property is required', 'error')
          return true;
        }
      }
    }

  }

  //Below is for BankGuarantee service Id 14
  validationForBankGuarantee(serviceId): any {

    if (this.instrumentForm.acctType == '') {
      swal('', 'Instrument  acct Type is required', 'error')
      return true;
    }

    if (this.instrumentForm.acctNo == '') {
      swal('', 'Instrument acct No is required', 'error')
      return true;
    }

    

    if (this.instrumentForm.acctName == '') {
      swal('', 'Instrument acct Name is required', 'error')
      return true;
    }

    if (this.instrumentForm.ccyCode == '') {
      swal('', 'Instrument acct Currency is required', 'error')
      return true;
    }

    if (this.instrumentForm.availBal == null) {
      swal('', 'Instrument acct Available Balance is required', 'error')
      return true;
    }

    if (this.instrumentForm.acctSic == '') {
      swal('', 'Instrument acct sector is required', 'error')
      return true;
    }

    if (this.instrumentForm.branchName == null) {
      swal('', 'Instrument acct Branch is required', 'error')
      return true;
    }

    if (this.instrumentForm.effectiveDate == null) {
      swal('', 'Instrument Effective Date  is required', 'error')
      return true;
    }

    if (this.instrumentForm.tenor == null) {
      swal('', 'Instrument Tenor  is required', 'error')
      return true;
    }

    // if (this.instrumentForm.tenorPeriod == null) {
    //   swal('', 'Instrument Tenor Period is required', 'error')
    //   return true;
    // }

    if (this.instrumentForm.expiryDate == null) {
      swal('', 'Instrument Expiry Date is required', 'error')
      return true;
    }

    if (this.instrumentForm.ccyCode == null) {
      swal('', 'Instrument Curreny is required', 'error')
      return true;
    }

    if (this.instrumentForm.amount == null) {
      swal('', 'Instrument Amount is required', 'error')
      return true;
    }

    if (this.instrumentForm.contractNo == '') {
      swal('', 'Instrument Contract No is required', 'error')
      return true;
    }

    if (this.instrumentForm.contractDate == null) {
      swal('', 'Instrument Contract Date  is required', 'error')
      return true;
    }

    if (this.instrumentForm.beneficiary == '') {
      swal('', 'Instrument Beneficiary  is required', 'error')
      return true;
    }
    if (this.instrumentForm.purpose == null) {
      swal('', 'Instrument Purpose  is required', 'error')
      return true;
    }
    if (this.instrumentForm.adresseeName == '') {
      swal('', 'Instrument Adressee Name  is required', 'error')
      return true;
    }
    if (this.instrumentForm.addressLine1 == '') {
      swal('', 'Instrument Address Line 1 is required', 'error')
      return true;
    }

    if(this.instrumentForm.addressLine2 == ''){
      swal('','Instrument Address Line 2 is required', 'error')
      return true;
    }


    //collateral Start here
    //if CollateralType check is selected and name is cash
    if(this.CollateralTypeNameList.length > 0)
    {
      if(this.CollateralTypeNameList.includes("CASH"))
      {
        //let filterNum = this.CollateralForm.filter(x => x.collateralName == "CASH");
        let indexNums = this.CollateralForm.findIndex(x => x.collateralName == "CASH");

        console.log('cash yes');
        
        if(this.CollateralForm[indexNums].acctType == ''){
          swal('','CASH Account Type is required', 'error')
          return true;
        }

        if(this.CollateralForm[indexNums].acctNo == ''){
          swal('','CASH Account No is required', 'error')
          return true;
        }

        if(this.CollateralForm[indexNums].lienAmount == null || this.CollateralForm[indexNums].lienAmount == ''){
          swal('','CASH Lien Amount is required', 'error')
          return true;
        }

        if(this.CollateralForm[indexNums].expiryDate == null){
          swal('','CASH expiry date is required', 'error')
          return true;
        }
      }
    }
    
    
    //collateral End  here


    //Insurance start here

    if(this.CollateralTypeNameList.length > 0)
    {
      if(this.CollateralTypeNameList.includes("INSURANCE"))
      {
        console.log('Yes Insurance');
        if(this.instrumentForm.insured == null || this.instrumentForm.insured == ''){
          swal('','Insurance Insured is required', 'error')
          return true;
        }
    
        if(this.instrumentForm.insuranceCoverTypeId == null || this.instrumentForm.insuranceCoverTypeId == ''){
          swal('','Insurance Cover Type is required', 'error')
          return true;
        }
    
        if(this.instrumentForm.insuranceEffectiveDate == null){
          swal('','Insurance Effective Date No is required', 'error')
          return true;
        }
      
        if(this.instrumentForm.insuranceExpiryDate == null){
          swal('','Insurance Expire Date is required', 'error')
          return true;
        }
    
        if(this.instrumentForm.insurancePolicyNo == null || this.instrumentForm.insurancePolicyNo == ''){
          swal('','Insurance Policy No is required', 'error')
          return true;
        }
    
        if(this.instrumentForm.insuranceSumAssured == null ){
          swal('','Insurance Sum Assured is required', 'error')
          return true;
        }
        
        //insuranceLocationOfProperty

        if(this.instrumentForm.insuranceLocationOfProperty == null || this.instrumentForm.insuranceLocationOfProperty == ''){
          swal('','Insurance Location Of Property is required', 'error')
          return true;
        }
      }
    }
    
    
  }

  //Below is for PerfBond service Id  18
  validationForPerfBond(serviceId): any {

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

    if (this.instrumentForm.effectiveDate == null) {
      swal('', 'Instrument Effective Date  is required', 'error')
      return true;
    }

    if (this.instrumentForm.tenor == null) {
      swal('', 'Instrument Tenor  is required', 'error')
      return true;
    }

    // if (this.instrumentForm.tenorPeriod == null) {
    //   swal('', 'Instrument Tenor Period is required', 'error')
    //   return true;
    // }

    if (this.instrumentForm.expiryDate == null) {
      swal('', 'Instrument Expiry Date is required', 'error')
      return true;
    }

    if (this.instrumentForm.ccyCode == null) {
      swal('', 'Instrument Curreny is required', 'error')
      return true;
    }

    if (this.instrumentForm.amount == null) {
      swal('', 'Instrument Amount is required', 'error')
      return true;
    }

    if (this.instrumentForm.contractNo == null) {
      swal('', 'Instrument Contract No is required', 'error')
      return true;
    }

    if (this.instrumentForm.contractDate == null) {
      swal('', 'Instrument Contract Date  is required', 'error')
      return true;
    }

    if (this.instrumentForm.beneficiary == null) {
      swal('', 'Instrument Beneficiary  is required', 'error')
      return true;
    }
    if (this.instrumentForm.purpose == null) {
      swal('', 'Instrument Purpose  is required', 'error')
      return true;
    }
    if (this.instrumentForm.adresseeName == null) {
      swal('', 'Instrument Adressee Name  is required', 'error')
      return true;
    }
    if (this.instrumentForm.addressLine1 == null) {
      swal('', 'Instrument Address Line 1 is required', 'error')
      return true;
    }

    if (this.instrumentForm.addressLine2 == null) {
      swal('', 'Instrument Address Line 2 is required', 'error')
      return true;
    }

    
    //collateral Start here
    //if CollateralType check is selected and name is cash
    if(this.CollateralTypeNameList.length > 0)
    {
      if(this.CollateralTypeNameList.includes("CASH"))
      {
        //let filterNum = this.CollateralForm.filter(x => x.collateralName == "CASH");
        let indexNums = this.CollateralForm.findIndex(x => x.collateralName == "CASH");

        console.log('cash yes');
        
        if(this.CollateralForm[indexNums].acctType == ''){
          swal('','CASH Account Type is required', 'error')
          return true;
        }

        if(this.CollateralForm[indexNums].acctNo == ''){
          swal('','CASH Account No is required', 'error')
          return true;
        }

        if(this.CollateralForm[indexNums].lienAmount == null || this.CollateralForm[indexNums].lienAmount == ''){
          swal('','CASH Lien Amount is required', 'error')
          return true;
        }

        if(this.CollateralForm[indexNums].expiryDate == null){
          swal('','CASH expiry date is required', 'error')
          return true;
        }
      }
    }
    
    
    //collateral End  here


    //Insurance start here

    if(this.CollateralTypeNameList.length > 0)
    {
      if(this.CollateralTypeNameList.includes("INSURANCE"))
      {
        console.log('Yes Insurance');
        if(this.instrumentForm.insured == null || this.instrumentForm.insured == ''){
          swal('','Insurance Insured is required', 'error')
          return true;
        }
    
        if(this.instrumentForm.insuranceCoverTypeId == null || this.instrumentForm.insuranceCoverTypeId == ''){
          swal('','Insurance Cover Type is required', 'error')
          return true;
        }
    
        if(this.instrumentForm.insuranceEffectiveDate == null){
          swal('','Insurance Effective Date No is required', 'error')
          return true;
        }
      
        if(this.instrumentForm.insuranceExpiryDate == null){
          swal('','Insurance Expire Date is required', 'error')
          return true;
        }
    
        if(this.instrumentForm.insurancePolicyNo == null || this.instrumentForm.insurancePolicyNo == ''){
          swal('','Insurance Policy No is required', 'error')
          return true;
        }
    
        if(this.instrumentForm.insuranceSumAssured == null ){
          swal('','Insurance Sum Assured is required', 'error')
          return true;
        }
        
        //insuranceLocationOfProperty

        if(this.instrumentForm.insuranceLocationOfProperty == null || this.instrumentForm.insuranceLocationOfProperty == ''){
          swal('','Insurance Location Of Property is required', 'error')
          return true;
        }
      }
    }

    
  }

  //Below is for PerfBond service Id  18
  validationForRetentionBond(serviceId): any {

    if (this.instrumentForm.acctNo == null || this.instrumentForm.acctNo == "") {
      swal('', 'Instrument acct No is required', 'error')
      return true;
    }

    if (this.instrumentForm.acctType == null || this.instrumentForm.acctType == "") {
      swal('', 'Instrument  acct Type is required', 'error')
      return true;
    }

    if (this.instrumentForm.acctName == null || this.instrumentForm.acctName == "") {
      swal('', 'Instrument acct Name is required', 'error')
      return true;
    }

    if (this.instrumentForm.ccyCode == null || this.instrumentForm.ccyCode == "") {
      swal('', 'Instrument acct Currency is required', 'error')
      return true;
    }

    if (this.instrumentForm.availBal == null || this.instrumentForm.availBal == "") {
      swal('', 'Instrument acct Available Balance is required', 'error')
      return true;
    }

    if (this.instrumentForm.acctSic == null || this.instrumentForm.acctSic == "") {
      swal('', 'Instrument acct sector is required', 'error')
      return true;
    }

    if (this.instrumentForm.branchName == null || this.instrumentForm.branchName == "") {
      swal('', 'Instrument acct Branch is required', 'error')
      return true;
    }

    if (this.instrumentForm.effectiveDate == null || this.instrumentForm.effectiveDate == "") {
      swal('', 'Instrument Effective Date  is required', 'error')
      return true;
    }

    if (this.instrumentForm.tenor == null || this.instrumentForm.tenor == "") {
      swal('', 'Instrument Tenor  is required', 'error')
      return true;
    }

    // if (this.instrumentForm.tenorPeriod == null) {
    //   swal('', 'Instrument Tenor Period is required', 'error')
    //   return true;
    // }

    if (this.instrumentForm.expiryDate == null || this.instrumentForm.expiryDate == "") {
      swal('', 'Instrument Expiry Date is required', 'error')
      return true;
    }

    if (this.instrumentForm.ccyCode == null || this.instrumentForm.ccyCode == "") {
      swal('', 'Instrument Curreny is required', 'error')
      return true;
    }

    if (this.instrumentForm.amount == null || this.instrumentForm.amount == "") {
      swal('', 'Instrument Amount is required', 'error')
      return true;
    }

    if (this.instrumentForm.contractNo == null || this.instrumentForm.contractNo == "") {
      swal('', 'Instrument Contract No is required', 'error')
      return true;
    }

    if (this.instrumentForm.contractDate == null || this.instrumentForm.contractDate == "") {
      swal('', 'Instrument Contract Date  is required', 'error')
      return true;
    }

    if (this.instrumentForm.beneficiary == null || this.instrumentForm.beneficiary == "") {
      swal('', 'Instrument Beneficiary  is required', 'error')
      return true;
    }
    if (this.instrumentForm.purpose == null || this.instrumentForm.purpose == "") {
      swal('', 'Instrument Purpose  is required', 'error')
      return true;
    }
    if (this.instrumentForm.adresseeName == null || this.instrumentForm.adresseeName == "") {
      swal('', 'Instrument Adressee Name  is required', 'error')
      return true;
    }
    if (this.instrumentForm.addressLine1 == null || this.instrumentForm.addressLine1 == "") {
      swal('', 'Instrument Address Line 1 is required', 'error')
      return true;
    }

    if (this.instrumentForm.addressLine2 == null || this.instrumentForm.addressLine2 == "") {
      swal('', 'Instrument Address Line 2 is required', 'error')
      return true;
    }

    
    //collateral Start here
    //if CollateralType check is selected and name is cash
    if(this.CollateralTypeNameList.length > 0)
    {
      if(this.CollateralTypeNameList.includes("CASH"))
      {
        //let filterNum = this.CollateralForm.filter(x => x.collateralName == "CASH");
        let indexNums = this.CollateralForm.findIndex(x => x.collateralName == "CASH");

        console.log('cash yes');
        
        if(this.CollateralForm[indexNums].acctType == ''){
          swal('','CASH Account Type is required', 'error')
          return true;
        }

        if(this.CollateralForm[indexNums].acctNo == ''){
          swal('','CASH Account No is required', 'error')
          return true;
        }

        if(this.CollateralForm[indexNums].lienAmount == null || this.CollateralForm[indexNums].lienAmount == ''){
          swal('','CASH Lien Amount is required', 'error')
          return true;
        }

        if(this.CollateralForm[indexNums].expiryDate == null){
          swal('','CASH expiry date is required', 'error')
          return true;
        }
      }
    }
    
    
    //collateral End  here


    //Insurance start here

    if(this.CollateralTypeNameList.length > 0)
    {
      if(this.CollateralTypeNameList.includes("INSURANCE"))
      {
        console.log('Yes Insurance');
        if(this.instrumentForm.insured == null || this.instrumentForm.insured == ''){
          swal('','Insurance Insured is required', 'error')
          return true;
        }
    
        if(this.instrumentForm.insuranceCoverTypeId == null || this.instrumentForm.insuranceCoverTypeId == ''){
          swal('','Insurance Cover Type is required', 'error')
          return true;
        }
    
        if(this.instrumentForm.insuranceEffectiveDate == null){
          swal('','Insurance Effective Date No is required', 'error')
          return true;
        }
      
        if(this.instrumentForm.insuranceExpiryDate == null){
          swal('','Insurance Expire Date is required', 'error')
          return true;
        }
    
        if(this.instrumentForm.insurancePolicyNo == null || this.instrumentForm.insurancePolicyNo == ''){
          swal('','Insurance Policy No is required', 'error')
          return true;
        }
    
        if(this.instrumentForm.insuranceSumAssured == null ){
          swal('','Insurance Sum Assured is required', 'error')
          return true;
        }
        
        //insuranceLocationOfProperty

        if(this.instrumentForm.insuranceLocationOfProperty == null || this.instrumentForm.insuranceLocationOfProperty == ''){
          swal('','Insurance Location Of Property is required', 'error')
          return true;
        }
      }
    }

    
  }

  //Below is for APG service Id 19
  validationForAPG(serviceId): any {

    if (this.instrumentForm.acctType == '') {
      swal('', 'Instrument  acct Type is required', 'error')
      return true;
    }
    if (this.instrumentForm.acctNo == '') {
      swal('', 'Instrument acct No is required', 'error')
      return true;
    }

    if (this.instrumentForm.acctName == '') {
      swal('', 'Instrument acct Name is required', 'error')
      return true;
    }

    if (this.instrumentForm.ccyCode == '') {
      swal('', 'Instrument acct Currency is required', 'error')
      return true;
    }

    if (this.instrumentForm.availBal == null) {
      swal('', 'Instrument acct Available Balance is required', 'error')
      return true;
    }

    if (this.instrumentForm.acctSic == '') {
      swal('', 'Instrument acct sector is required', 'error')
      return true;
    }

    if (this.instrumentForm.branchName == null) {
      swal('', 'Instrument acct Branch is required', 'error')
      return true;
    }

    if (this.instrumentForm.effectiveDate == null) {
      swal('', 'Instrument Effective Date  is required', 'error')
      return true;
    }

    if (this.instrumentForm.tenor == null) {
      swal('', 'Instrument Tenor  is required', 'error')
      return true;
    }

    // if (this.instrumentForm.tenorPeriod == null) {
    //   swal('', 'Instrument Tenor Period is required', 'error')
    //   return true;
    // }

    if (this.instrumentForm.expiryDate == null) {
      swal('', 'Instrument Expiry Date is required', 'error')
      return true;
    }

    if (this.instrumentForm.ccyCode == null) {
      swal('', 'Instrument Curreny is required', 'error')
      return true;
    }

    if (this.instrumentForm.amount == null) {
      swal('', 'Instrument Amount is required', 'error')
      return true;
    }

    if(this.instrumentForm.contractNo == ''){
      swal('','Instrument Contract No is required', 'error')
      return true;
    }

    if(this.instrumentForm.contractDate == null){
      swal('','Instrument Contract Date  is required', 'error')
      return true;
    }

    if (this.instrumentForm.beneficiary == '') {
      swal('', 'Instrument Beneficiary  is required', 'error')
      return true;
    }
    if (this.instrumentForm.purpose == null) {
      swal('', 'Instrument Purpose  is required', 'error')
      return true;
    }
    if (this.instrumentForm.adresseeName == '') {
      swal('', 'Instrument Adressee Name  is required', 'error')
      return true;
    }
    if (this.instrumentForm.addressLine1 == '') {
      swal('', 'Instrument Address Line 1 is required', 'error')
      return true;
    }
    if (this.instrumentForm.addressLine2 == '') {
      swal('', 'Instrument Address Line 2 is required', 'error')
      return true;
    }
  



    //collateral Start here
    //if CollateralType check is selected and name is cash
    if(this.CollateralTypeNameList.length > 0)
    {
      if(this.CollateralTypeNameList.includes("CASH"))
      {
        //let filterNum = this.CollateralForm.filter(x => x.collateralName == "CASH");
        let indexNums = this.CollateralForm.findIndex(x => x.collateralName == "CASH");

        console.log('cash yes');
        
        if(this.CollateralForm[indexNums].acctType == ''){
          swal('','CASH Account Type is required', 'error')
          return true;
        }

        if(this.CollateralForm[indexNums].acctNo == ''){
          swal('','CASH Account No is required', 'error')
          return true;
        }

        if(this.CollateralForm[indexNums].lienAmount == null || this.CollateralForm[indexNums].lienAmount == ''){
          swal('','CASH Lien Amount is required', 'error')
          return true;
        }

        if(this.CollateralForm[indexNums].expiryDate == null){
          swal('','CASH expiry date is required', 'error')
          return true;
        }
      }
    }
    
    
    //collateral End  here


    //Insurance start here

    if(this.CollateralTypeNameList.length > 0)
    {
      if(this.CollateralTypeNameList.includes("INSURANCE"))
      {
        console.log('Yes Insurance');
        if(this.instrumentForm.insured == null || this.instrumentForm.insured == ''){
          swal('','Insurance Insured is required', 'error')
          return true;
        }
    
        if(this.instrumentForm.insuranceCoverTypeId == null || this.instrumentForm.insuranceCoverTypeId == ''){
          swal('','Insurance Cover Type is required', 'error')
          return true;
        }
    
        if(this.instrumentForm.insuranceEffectiveDate == null){
          swal('','Insurance Effective Date No is required', 'error')
          return true;
        }
      
        if(this.instrumentForm.insuranceExpiryDate == null){
          swal('','Insurance Expire Date is required', 'error')
          return true;
        }
    
        if(this.instrumentForm.insurancePolicyNo == null || this.instrumentForm.insurancePolicyNo == ''){
          swal('','Insurance Policy No is required', 'error')
          return true;
        }
    
        if(this.instrumentForm.insuranceSumAssured == null ){
          swal('','Insurance Sum Assured is required', 'error')
          return true;
        }
        
        //insuranceLocationOfProperty

        if(this.instrumentForm.insuranceLocationOfProperty == null || this.instrumentForm.insuranceLocationOfProperty == ''){
          swal('','Insurance Location Of Property is required', 'error')
          return true;
        }
      }
    }
    

  }

  valCol(): any {
    if (this.collTypeselect === "CASH") {
      console.log('CASH  selected');
    }
    for (let i = 0; i < this.CollateralForm.length; i++) {
      if (this.collTypeselect === "LEGAL MORTGAGE") {
        console.log('LEGAL MORTGAGE  selected');
        if (this.CollateralForm[i].lienAmount === null) {
          swal('', 'Enter Collateral Lien Amount', 'error');
          return true;
        }

        if (this.CollateralForm[i].forcedSaleValue === null) {
          swal('', 'Enter Collateral Forced Sale Value', 'error');
          return true;
        }

        if (this.CollateralForm[i].effectiveDate === null) {
          swal('', 'Enter Collateral Effective Date ', 'error');
          return true;
        }

        if (this.CollateralForm[i].expiryDate === null) {
          swal('', 'Enter Collateral Expiry Date', 'error');
          return true;
        }

        if (this.CollateralForm[i].location === null) {
          swal('', 'Enter Collateral Location', 'error');
          return true;
        }
        if (this.CollateralForm[i].ccyCode === null) {
          swal('', 'Enter Collateral Currency', 'error');
          return true;
        }

        if (this.CollateralForm[i].valuer === null) {
          swal('', 'Enter Collateral Valuer', 'error');
          return true;
        }

        if (this.CollateralForm[i].verifiedBy === null) {
          swal('', 'Enter Collateral Verified By', 'error');
          return true;
        }

        if (this.CollateralForm[i].verificationDate === null) {
          swal('', 'Enter Collateral Verification Date', 'error');
          return true;
        }
        if (this.CollateralForm[i].marketValue === null) {
          swal('', 'Enter Collateral Market Value', 'error');
          return true;
        }

        if (this.CollateralForm[i].collMortgageNo === null) {
          swal('', 'Enter Collateral Mortgage No', 'error');
          return true;
        }

      }
      // let lienAmt = this._GeneralService.replaceAll(this.CollateralForm[i].lienAmount, ',', '');
      // let availBal = this._GeneralService.replaceAll(this.CollateralForm[i].availBal, ',', '');  
      // console.log('lienAmt: ', lienAmt);
      // console.log('availBal: ', availBal);

      // if(lienAmt > availBal) 
      // {
      //   swal('',`Enter Lien Amount Could'nt be greater than Avalable balabnce No`,'error');
      //   return true;
      // }

    }


    if (this.collTypeselect === "DEBENTURE MORTGAGE") {
      console.log('DEBENTURE MORTGAGE  selected');
    }

    if (this.collTypeselect === "OTHERS") {
      console.log('OTHERS  selected');
    }
  }

  valAssingCol(event): any {
    let val = Number(event.target.value);
    console.log('valcol', val);
    console.log(' this.CollateralTypes', this.CollateralTypes);

    let get = new List<CollateralType>(this.CollateralTypes).FirstOrDefault(c => c.collTypeId === val);

    console.log('valcol get1', get);

    this.collTypeselect = get.collateralName;


  }

  collateralValidation(rec: CollateralForm) {
    console.log('collateralValidation start');
    this.loadPage = true;
    let url = 'AccountValidation/GetAll';
    let val =
    {
      acctType: rec.acctType,
      acctNo: rec.acctNo,
      crncyCode: rec.acctCCy,
      Username: this.userDetails.userName
    }

    console.log('get vali ret data', val);

    this._GeneralService.post(val, url)
      .subscribe(
        (data: any) => {
          this.loadPage = false;
          console.log('get instrument ret data', data);

          this.accountValidation = data;

          rec.acctNo = this.accountValidation.acctNo;
          rec.acctType = this.accountValidation.acctType;
          rec.availBal = this.accountValidation.availBal;
          rec.acctStatus = this.accountValidation.acctStatus;
          rec.acctCCy = this.accountValidation.acctCCy;
          rec.acctName = this.accountValidation.acctName;
          //this.CollateralForm  = rec;

          for (let i = 0; i < this.CollateralForm.length; i++) {

            var getRec = this.CollateralForm.filter(c => c.collateralName === this.CollateralForm[i].collateralName);
            if (getRec != undefined) {
              this.CollateralForm[i].acctNo = this.accountValidation.acctNo;
              this.CollateralForm[i].acctType = this.accountValidation.acctType;
              this.CollateralForm[i].availBal = this.accountValidation.availBal;
              this.CollateralForm[i].acctStatus = this.accountValidation.acctStatus;
              this.CollateralForm[i].acctCCy = this.accountValidation.acctCCy;
              this.CollateralForm[i].acctName = this.accountValidation.acctName;

              return;
            }

          }
          //getRec.


          console.log('this.CollateralForm', this.CollateralForm);

        },
        (error: any) => {
          console.log('getById: ', error.error);

        });

  }

  updateHold(rec: CollateralForm): any {

    console.log('updateHold this.CollateralForm.placeHoldBoolean', rec.placeHoldBoolean);
    console.log('updateHold this.CollateralForm.holdId', rec.holdId);


    if (rec.placeHoldBoolean === false && rec.placeHold === 'Y') {


      Swal({
        title: '',
        text: `Are you sure you want Remove the Hold on the Collateral Account (${rec.acctNo})?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: this.btnConfirm,
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.value) {
          // this.CollateralForm.placeHold = 'N';
          // this.CollateralForm.placeHoldBoolean = false;
          for (let i = 0; i < this.CollateralForm.length; i++) {

            if (this.CollateralForm[i].collTypeId === rec.collTypeId) {
              this.CollateralForm[i].placeHoldBoolean = true;
            }

          }

        } else if (result.dismiss === Swal.DismissReason.cancel) {
          //  this.CollateralForm.placeHold = 'Y';
          //this.CollateralForm.placeHoldBoolean = true;
        }
      });
    }
  }

  colSelected(rec: CollateralType) {

    console.log('colSelected param this ', rec);
    //console.log('colSelected collTypeId this ', rec.collTypeId);
    
    //console.log('this.collTypeselect ', this.collTypeselect);
    //get the list of all CollateralType
    let get = new List<CollateralType>(this.CollateralTypes).FirstOrDefault(c => c.collTypeId === rec.collTypeId);

    console.log('get this collateralTypes ', get);
    //console.log('this.CollateralForm 1 ', this.CollateralForm);
    this.collateralNameSelected = rec.collateralName;
    //console.log('this.collateralNameSelected ', this.collateralNameSelected);
    if (get !== undefined) {
      // use check to get the export CollateralForm class by the get.collateralName which was selected and convert it to list
      let check = new List<CollateralForm>(this.CollateralForm).FirstOrDefault(c => c.collateralName === get.collateralName);

      //console.log('is check undefined ', check);
      //console.log('before check this 2 this.CollateralForm 2', this.CollateralForm);
      if (check === undefined) {

        
        this.CollateralTypeNameList.push(rec.collateralName);
        console.log('this.CollateralTypeNameList.push()) before ', this.CollateralTypeNameList);
        //console.log('check this 2 ', check);
        // by default the CollateralForm, has not collateralName so the check is undefined which is true
        // and another CollateralForm is added to the collateralForm to make it a list, and set a collateralName 
        // by the get.collateralName
        this.CollateralForm.push({
          itbId: 0,
          serviceId: null,
          serviceItbId: null,
          collTypeId: rec.collTypeId,
          collDescription: null,
          acctNo: '',
          acctType: '',
          availBal: null,
          acctName: null,
          acctStatus: null,
          acctCCy: '',
          holdId: null,
          lienAmount: null,
          collStatus: null,
          forcedSaleValue: null,
          effectiveDate: null,
          expiryDate: null,
          location: null,
          ccyCode: null,
          valuer: null,
          verifiedBy: null,
          verificationDate: null,
          marketValue: null,
          insCoyName: null,
          insured: null,
          insCoverTypeId: null,
          policyNo: null,
          sumAssured: null,
          premiumPayable: null,
          collMortgageNo: null,
          userId: null,
          status: null,
          dateCreated: null,
          placeHoldBoolean: null,
          placeHold: null,
          selected: true,
          collateralName: get.collateralName

        })

        this.orderby();
        console.log('this.CollateralForm.push()) after ', this.CollateralForm);
        return;
      }
      else {

        console.log('this.CollateralTypeNameList.length ', this.CollateralTypeNameList.length);
        for (let i = 0; i < this.CollateralTypeNameList.length; i++)
        {
            let indexLine = this.CollateralTypeNameList.indexOf(rec.collateralName.toUpperCase().toString());
            //console.log('indexLine ', indexLine);
            //console.log('name === true ');
            this.CollateralTypeNameList.splice(indexLine, 1);
            //console.log('removed CollateralTypeNameList name ' + rec.collateralName + ' - length = ' + this.CollateralTypeNameList.length);
          
        }

        //console.log('after removed CollateralTypeNameList name ' + rec.collateralName + ' - length = ' + this.CollateralTypeNameList.length);
        //console.log('this.CollateralTypeNameList list ', this.CollateralTypeNameList);

        
        //console.log('colSelected check 2 this.CollateralForm', this.CollateralForm);
        for (let i = 0; i < this.CollateralForm.length; i++) {

          if (this.CollateralForm[i].collTypeId === rec.collTypeId) {

            this.CollateralForm.splice(i, 1)

            
            //console.log('removed collateralForm - length = ', this.CollateralForm.length);
            break;
          }
        }


        this.orderby();
        return;

      }




    }

  }

  orderby() {
    this.CollateralForm = new List<CollateralForm>(this.CollateralForm).OrderBy(c => c.collTypeId).ToArray();

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


  auditList()
{
  let tableName = this.tableName;
  let dialogRef = this.dialog.open(auditTrailDetailComponent, {

    width: '1400px',
    height: '650px',
    // hasBackdrop: true,
    disableClose: true,
    // autoFocus: true,
    data: { actionName: "audit", record:  tableName},
    
  });

  dialogRef.afterClosed().subscribe(result => {
    //console.log('role list refresh result', result)
    if(result == 'Y'){
      let getUserDetails =  this._GeneralService.getUserDetails();
      //this.load(getUserDetails);
    }
  });
}

}




