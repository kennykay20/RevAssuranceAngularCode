
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
import { OprTradeReference } from '../../../../model/OprTradeReference.model';
import { OverDraft } from '../../../../model/overDraft.model';
import { OprAcctStatment } from '../../../../model/OprAcctStatment.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { admBankServiceSetUp } from '../../../../model/admBankServiceSetUp';
import { Template } from '../../../../model/Template.model';
import { AcctStatmentResultCoreBanking } from '../../../../model/AcctStatmentResultCoreBanking';
import { admAmendReprintReason } from '../../../../model/admAmendReprintReason';
import { Mandate } from '../../../../model/mandate.model';
import { ViewMandateDetailsComponent } from '../../view-mandate/view-mandate-details/view-mandate-details.component';
import { admStatementChg } from '../../../../model/admStatementChg';
import { SweetAlertService } from '../../../../services/sweetAlert.service';
import { admAccountTypeModel } from '../../../../model/admAccountTypeDTO.model';
import { D } from '@angular/core/src/render3';

@Component({
  selector: 'app-statement-req-details',
  templateUrl: './statement-req-details.component.html',
  styleUrls: ['./statement-req-details.component.scss']
})

export class StatementReqDetailsComponent implements OnInit {
  cbsOfflineMsg = GenModel.cbsOfflineMsg;
  totalRecPull = 0;
  recordPerPage: number = 0;
  parentTemplateName = ''
  totalDebit: string = '';
  totalCredit: string = '';
  totalBalance: number = 0;
  admAmendReprintReason: admAmendReprintReason[]
  admAmendReprintReasonTemp: admAmendReprintReason[]
  singleadmAmendReprintReason: admAmendReprintReason

  chgAmount = 0;
  templateId = 0;
  recordNotFoundMsg = GenModel.recordNotFoundMsg;
  cbs: admBankServiceSetUp[];
  rows: AcctStatmentResultCoreBanking[];
  temp: AcctStatmentResultCoreBanking[];
  accountValidation: AccountValidation;
  OdType = ['', 'NEW', 'RENEWAL', 'CANCEL', 'TOD']
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
  temporaltemplateTypes: Template[];
  templateTypes: Template[];
  templateTypesChild: Template[];
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
  actionLoaderSpool = false
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
  instrumentForm: OprAcctStatment;
  serviceName: any;
  chargeFormList: ChargeForm[];
  chargeFormListTem: ChargeForm[];
  admService: admService;
  templateContent: any;
  action: Action
  actionName: string;
  btnAmendOrReprint = ""

  admStatementChg: admStatementChg[];

  noMandateMsg = GenModel.noMandateMsg;

  checkValue = false; 
  maxLength = GenModel.acctmaxLengthDefault;
  Delimeter = '';
  accountFormat = '';

  lengthMessage = '';
  acct1 = '';
  glAccountType = false;
  admAccountTypeModel: admAccountTypeModel;

  current_page = 1;
  pageLmit = GenModel.pageLmit;

  currentYear = new Date().getUTCFullYear();
  startDateVal = new Date(this.currentYear, 0, 1);
  minDate = new Date();
  pageListVal = "0";
  ItemsPerPage: any;

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
    public dialogRef: MatDialogRef<StatementReqDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, private sweetAlertService: SweetAlertService
  ) {
    this.rows = new Array<AcctStatmentResultCoreBanking>();
    this.userDetails = this._GeneralService.getUserDetails();
    this.settings = this.appSettings.settings;

    this.resetAction(data);

    console.log('apg data details; ', data);

    let initSelectEdCol = [{
      collateralName: null,
      selected: true
    }]

    this.chargeFormList = data.chargeSetup;
    this.admService = data.admService;
    //console.log('data this.admService; ', this.admService);
    this.serviceId = data.serviceId;
    this.serviceName = data.serviceName;

    this.actionName = data.actionName;

    this.admStatementChg = data.admStatementChg
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

      this.chargeFormListTem = this.chargeFormList;
    }
    else {
      this.ActionHeaderMsg = '';
      this.ActionDisplay = this.ActionViewHeaderMsg;

      this.showIni = true;
      this.getById(data);



    }
  }

  resetAction(data) {
    this.action = {
      actionName: data.actionName
    }

    // console.log('data resetAction this.action; ', this.action);
  }
  reformInstrumentForm() {

    this.instrumentForm = new OprAcctStatment();
    this.instrumentForm.serviceId = this.serviceId,
      this.instrumentForm.processingDeptId = this.admService.defaultDept.toString(),
    this.instrumentForm.originatingBranchId = this.userDetails.branchNo,
    this.instrumentForm.origDeptId = this.userDetails.deptId
    this.instrumentForm.fromDate = this.userDetails.bankingDate
    this.instrumentForm.toDate = this.userDetails.bankingDate
    this.instrumentForm.templateId = 0;

    // console.log('kujhd**', this.instrumentForm);
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
    this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    this.loadDepartment();
    this.loadUsers();
    this.loadAcctTypes();
    this.loadCollateralTypes();
    this.userDetails = this._GeneralService.getUserDetails();
    this.loadService(this.userDetails)
  }


  loadService(param): void {

    this.loadPage = true;

    let url = 'BankServiceSetUp/GetAll';

    let val =
    {
      pdtCurrentDate: param.bankingDate,
      psBranchNo: param.branchNo,
      pnDeptId: param.deptId,
      pnGlobalView: 'N',
      serviceId: 0,
      menuId: 0,
      roleId: param.roleId
    }

    this._GeneralService.post(val, url)

      /*.retryWhen((err) => {
    
        return err.scan((retryCount) =>  {
    
          retryCount  += 1;
          if (retryCount < this.retryService) {
    
              this.retryMessage = this.RetryAttmMsg; // #'  + retryCount;
    
              return retryCount;
          }
          else 
          {
            this.retryMessage = this.errorOccur;
             throw(err);
          }
        }, 0).delay(this.retryDelayServiceInterval); 
      }).*/

      .subscribe(
        (data: any) => {
          this.loadPage = false;
          this.cbs = data._response;
        },
        (error: any) => {

          Swal('', error.message, 'error');

        });
  }



  getById(record): void {

    // console.log('getById id', record.record.itbId);

    this.loadPage = true;

    let track = 0;
    let url = 'AccountStatement/GetById';

    let val = {
      OprAcctStatment: {
        itbId: record.record.itbId
      },
      serviceId: this.serviceId,
      LoginUserName: this.userDetails.userName
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
          this.chargeFormList = data.serviceChargeslist;


          if (data.allUsers != undefined) {
            this.instrumentForm.createdBy = data.allUsers.createdBy;
            this.dismissedBy = data.allUsers.dismissedBy;
            this.rejectedBy = data.allUsers.rejectedBy;
          }

          this.instrumentForm.availBal = this.instrumentForm.availBal != null ? this._GeneralService.formatMoney(this.instrumentForm.availBal) : this.instrumentForm.availBal;
          this.instrumentForm.branchName = data.valInstrumentAcct.sBranchName;
          this.templateContent = data.template.templateContent;

          this.instrumentForm.dateCreated = this.instrumentForm.dateCreated != null ? this._GeneralService.dateCreated(this.instrumentForm.dateCreated) : this.instrumentForm.dateCreated;
          this.instrumentForm.fromDate = this.instrumentForm.fromDate != null ? this._GeneralService.dateconvertion(this.instrumentForm.fromDate) : this.instrumentForm.fromDate;
          this.instrumentForm.toDate = this.instrumentForm.toDate != null ? this._GeneralService.dateconvertion(this.instrumentForm.toDate) : this.instrumentForm.toDate;



          for (let i = 0; i < this.chargeFormList.length; i++) {
            if (this.chargeFormList[i] != null) {
              this.chargeFormList[i].transactionDate = this.instrumentForm.transDate != null ? this._GeneralService.dateconvertion(this.instrumentForm.transDate) : this.instrumentForm.transDate;
              this.chargeFormList[i].valueDate = this.instrumentForm.valueDate != null ? this._GeneralService.dateconvertion(this.instrumentForm.valueDate) : this.instrumentForm.valueDate;
              this.chargeFormList[i].origChgAmount = this.chargeFormList[i].origChgAmount != null ? this._GeneralService.formatMoney(this.chargeFormList[i].origChgAmount) : this.chargeFormList[i].origChgAmount;
              this.chargeFormList[i].equivChgAmount = this.chargeFormList[i].equivChgAmount != null ? this._GeneralService.formatMoney(this.chargeFormList[i].equivChgAmount) : this.chargeFormList[i].equivChgAmount;
              this.chargeFormList[i].taxAmount = this.chargeFormList[i].taxAmount != null ? this._GeneralService.formatMoney(this.chargeFormList[i].taxAmount) : this.chargeFormList[i].taxAmount;

            }
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

  bindCollaterGebById(rec: CollateralForm[]) {

    for (let i = 0; i < this.CollateralForm.length; i++) {
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
          this.temporaltemplateTypes = data.temp;
          this.templateTypes = data.temp;

          let tmp = new List<Template>(data.temp).Where(c => c.serviceId == this.serviceId && c.parentId == null).ToArray();

          console.log('data tmp: ', tmp);
          this.templateTypes = tmp;

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

    // if(this.serviceId == 14)
    // {
    //   valAcct = this.validationForBankGuarantee(this.serviceId);

    //   if(valAcct === true) {
    //    return;
    //   }

    // }

    if (this.templateContent == null) {
      swal('', 'Supply Template Content', 'error');
      return;
    }

    if (valAcct === true) {
      return;
    }

    this.actionLoaderSave = true;
    let element = <HTMLInputElement>document.getElementById("btnSave");
    element.disabled = true;

    this.instrumentForm.userId = this.userDetails.userId;
    this.instrumentForm.originatingBranchId = this.userDetails.branchNo;

    this.instrumentForm.itbId = 0;
    this.instrumentForm.origDeptId = this.userDetails.deptId


    let val =
    {
      OprAcctStatment: this.instrumentForm,
      listoprServiceCharge: this.chargeFormList,
      templateContent: this.templateContent,
      loginUserId: this.userDetails.userId,
      serviceId: this.serviceId,
      transactionDate: this.userDetails.bankingDate,
      ValueDate: this.userDetails.bankingDate,
      LoginUserName: this.userDetails.userName,
    }

    console.log('val to add: ', val);

    let url = 'AccountStatement/Add';

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {


        this.reformInstrumentForm();
        this.resetCollateralForm();
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

    if (this.templateContent == null) {
      swal('', 'Supply Template Content', 'error');
      return;
    }

    console.log('update chargeFormList: ', this.chargeFormList);

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement>document.getElementById("btnUpdate");

    element.disabled = true;




    this.instrumentForm.origDeptId = this.userDetails.deptId;

    let val =
    {
      OprAcctStatment: this.instrumentForm,
      listoprServiceCharge: this.chargeFormList,
      templateContent: this.templateContent,
      loginUserId: this.userDetails.userId,
      serviceId: this.serviceId,
      transactionDate: this.userDetails.bankingDate,
      ValueDate: this.userDetails.bankingDate,
      LoginUserName: this.userDetails.userName,
    }

    console.log('val to add: ', val);

    let url = 'AccountStatement/Update';

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {
        console.log('Update data:', data)
        this.actionTaken = 'Y';
        element.disabled = false;
        this.actionLoaderUpdate = false;
        this.reloadLoad = 'Y';


       if(data.responseCode == 0)
        Swal('', data.responseMessage, 'success');
       else
        Swal('', data.responseMessage, 'error');

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
    //this.initiate();
  }

  validateAcct(event) {

    // if(this.instrumentForm.amount === null)
    // {
    //   Swal('', 'Enter Transaction Amount', 'error');
    //   return;
    // }

    this.initiate();

    //this.genCalChg(event.target.value)
  }



  formatAmount(event) {
    // this.instrumentForm.creditAmount =  this._GeneralService.formatMoney(event.target.value)
    this.initiate();
  }

  fromDate(event) {

    this.instrumentForm.fromDate = this._GeneralService.dateconvertion(event.target.value);

  }
  fromGetDate(value) {

    this.instrumentForm.fromDate = this._GeneralService.dateconvertion(value);

  }

  toDate(event) {

    this.instrumentForm.toDate = this._GeneralService.dateconvertion(event.target.value);

  }
  toGetDate(value) {

    this.instrumentForm.toDate = this._GeneralService.dateconvertion(value);

  }

  // endDate(event){
  //   let val = this._GeneralService.dateconvertion(event.target.value);
  //   this.instrumentForm.startDate = val;
  // }

  tenor(event) {
    console.log('tenor event.target.value;', event.target.value)
    // this.instrumentForm.tenor  = event.target.value;
    this.endDate1();
  }

  endDate1(): void {
    console.log('endDate start;')

    console.log('endDate this.instrumentForm', this.instrumentForm)
    // if(this.instrumentForm.startDate == null)
    // {
    //   swal('', 'Select Effective Date', 'error');
    //   return ;
    // }

    let val = {

      // effectiveDate : this.instrumentForm.startDate,
      // tenorPeriod:  this.instrumentForm.tenor,
      // timeBasis:   this.instrumentForm.tenorPeriod
    }

    this.loadPage = true;

    let url = 'Instrument/GetEndDate';

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {

        console.log('endDate data', data);
        //  this.instrumentForm.endDate =   data.expiryDate

        this.loadPage = false;
      },
      (error: any) => {

        this.loadPage = false;

        Swal('', error.error.responseMessage, 'error');
      });

  }

  newExpiryDate(event) {

    let val = this._GeneralService.dateconvertion(event.target.value);

    // this.instrumentForm.newExpiryDate = val;

  }

  formatAmtLimit(event) {
    // this.instrumentForm.approvedLimit =  this._GeneralService.formatMoney(event.target.value)
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


  reAmmend(): void {

    if (this.instrumentForm.acctNo == null) {
      swal('', 'Enter Instrument Acct No ', 'error');
      return;
    }





    //  if(this.instrumentForm.acctType == null) {
    //    swal('','Select Instrument Acct Type ', 'error');
    //    return;
    //  }

    //  if(this.instrumentForm.ccyCode == null) {
    //   swal('','Select Instrument Currency', 'error');
    //   return;
    // }

    //  if(this.instrumentForm.amount == null) {
    //   swal('','Enter Instrument Amount ', 'error');
    //   return;
    // }

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

        //   if (this.chargeFormList[i].chgAcctType === undefined) {

        //     swal('','Select Charge AcctType', 'error');
        //     return;

        //   }

        //   if (this.chargeFormList[i].chgAcctNo === undefined) {

        //     swal('','Enter  Charge Acct No', 'error');
        //     return;

        // }

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

        // if (this.chargeFormList[i].chgAcctType === null) {

        //   swal('','Select  Charge Acct Type', 'error');
        //   return;

        // }

      }


    }

    // let col = {
    //   collTypeId: 0,
    //   acctNo: this.CollateralForm.acctNo,
    //   ccyCode: this.CollateralForm.acctCCy,
    //   userId: 0
    // }   

    //console.log('gen calc this.basicForm.value.amount11: ', this.instrumentForm.creditAmount);

    const ammendOrReprint = this.actionName.toLocaleLowerCase() == 'ammend' ? true : false

    let values = {

      acctNo: this.instrumentForm.acctNo,
      acctType: this.instrumentForm.acctType,
      transAmout: '0',// this.instrumentForm.creditAmount,
      ListoprServiceCharge: this.chargeFormList,
      loginUserName: this.userDetails.userName,
      deptId: this.userDetails.deptId,
      userId: this.userDetails.userId,
      serviceId: this.serviceId,
      IsAmmendment: ammendOrReprint

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
        this.instrumentForm.availBal = data.instrumentAcctDetails.nBalance;
        this.instrumentForm.rsmId = data.instrumentAcctDetails.sRsmId == null ? 0 : data.instrumentAcctDetails.sRsmId;

        this.instrumentForm.availBal = data.instrumentAcctDetails.nBalance;
        // this.instrumentForm.availBalString = data.instrumentAcctDetails.nBalance ;
        this.instrumentForm.acctSic = data.instrumentAcctDetails.sSector;
        this.instrumentForm.acctStatus = data.instrumentAcctDetails.sStatus;
        this.instrumentForm.ccyCode = data.instrumentAcctDetails.sCrncyIso;
        // this.instrumentForm.serialNo = this.instrumentForm.serialNo ;

        //this.instrumentForm.instrumentCcy = this.instrumentForm.ccyCode;
        this.instrumentForm.acctProductCode = data.instrumentAcctDetails.sProductCode;

        this.instrumentForm.acctCustNo = data.instrumentAcctDetails.sCustomerId;
        // Contigent

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

      },
      (error: any) => {
        this.loadPage = false;
        Swal('', error.error.responseMessage, 'error');
      });
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

          this.instrumentForm.acctSic = data.instrumentAcctDetails.sSector,
          this.instrumentForm.acctStatus = data.instrumentAcctDetails.sStatus,
          this.instrumentForm.ccyCode = data.instrumentAcctDetails.sCrncyIso,

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

      if (this.templateId == 0) {
        this.tab1 = 'active';
        this.tab2 = '';
        this.tab3 = '';
        this.tab4 = '';
        this.tab5 = '';
        swal('', 'Select Template Type', 'error')
        return;
      }
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

    let val = {

      serviceId: this.serviceId,

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

    console.log('colSelected collTypeId ', rec.collTypeId);

    let get = new List<CollateralType>(this.CollateralTypes).FirstOrDefault(c => c.collTypeId === rec.collTypeId);


    if (get !== undefined) {
      let check = new List<CollateralForm>(this.CollateralForm).FirstOrDefault(c => c.collateralName === get.collateralName);

      if (check === undefined) {

        this.CollateralForm.push({
          itbId: 0,
          serviceId: null,
          serviceItbId: null,
          collTypeId: rec.collTypeId,
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
        return;
      }
      else {
        console.log('colSelected check 2 this.CollateralForm', this.CollateralForm);
        for (let i = 0; i < this.CollateralForm.length; i++) {

          if (this.CollateralForm[i].collTypeId === rec.collTypeId) {

            this.CollateralForm.splice(i, 1)


            console.log('colSelected 333');
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

  public onOptionsSelected(event) {
    console.log('hh***', event.target.value);
    // this.instrumentForm.tenorPeriod = event.target.value;
    this.endDate1()
  }

  public onNumberSelected(event) 
  {
   // console.log('onOptionsSelected', event);
    this.pageLmit = event.target.value;
    //console.log('pageLimit: ', this.pageLmit);

    this.rows =  this.temp.slice(0, this.pageLmit);
    
    //console.log('allRow: ', this.rows);


    this.changePage(this.current_page);    
 }

  getStatement(param): void {

    var validate = false;
    validate = this.validateGetStatement();
    if (validate) {
      Swal('', 'Kindly Fill All the Necessary Information', 'error');
      return;
    }

    this.actionLoaderSpool = true;

    let url = 'AccountStatement/AcctStatement';

    let element = <HTMLInputElement>document.getElementById("btnSpoolAcctStatetemt");
    element.disabled = true;

    let val =
    {
      AccountNo: this.instrumentForm.acctNo,
      AcctType: this.instrumentForm.acctType,
      dateFrom: this.instrumentForm.fromDate,
      dateTo: this.instrumentForm.toDate,
      FromAmount: 0,
      ToAmount: 0,
      CoreBankingState: this.instrumentForm.coreBankingType
    }

    let postParam = {
      AcctStateCoreBankParam: val
    }

    console.log('postParam**: ', postParam);

    this._GeneralService.post(postParam, url)
      .subscribe(
        (data: any) => {
          console.log('Statement Result: ', data);

          element.disabled = false;



          this.rows = data.statement;
          this.temp = data.statement;

          const debit = new List<any>(data.statement).Sum(x => Number(x.debit));
          console.log('Statement debit: ', debit);
          const credit = new List<any>(data.statement).Sum(x => Number(x.credit));
          this.actionLoaderSpool = false;
          this.loadPage = false;

          this.totalDebit = this._GeneralService.formatMoney(debit);
          this.totalCredit = this._GeneralService.formatMoney(credit);

          console.log('Statement this.totalDebit: ', this.totalDebit);
          console.log('Statement this.totalCredit: ', this.totalCredit);

          this.totalRecPull = this.rows.length;
          this.initiate();

          if(data.statement.length > 0)
          {
            this.rows  =  data.statement.slice(0, this.pageLmit);
            this.changePage(this.current_page);
          }

        },
        (error: any) => {
          console.log('Statement error: ', error);
          
          element.disabled = false;
          this.actionLoaderSpool = false;
          this.loadPage = false;
          Swal('', error.error.responseMessage, 'error');


        });
  }

  validateGetStatement(): any {

    if (this.instrumentForm.acctNo == null) {
      return true;
    }
    if (this.instrumentForm.acctType == null) {
      return true;
    }
    if (this.instrumentForm.fromDate == null) {
      return true;
    }
    if (this.instrumentForm.toDate == null) {
      return true;
    }

    if (this.instrumentForm.coreBankingType == null) {
      return true;
    }


  }



  getSelectedCharge(templateId) {

    if (this.instrumentForm.acctNo == null) {
      swal('', 'Enter Instrument Acct No ', 'error');
      this.instrumentForm.templateId = null;
      return;
    }

    let num = Number(templateId.target.value);
    //console.log('parent 1 num converted selected: ', num);
    console.log('parent 2 this.chargeFormListTem: ', this.chargeFormListTem);
    let get = new List<ChargeForm>(this.chargeFormListTem).Where(c => c.templateId === num).ToArray();
    this.chargeFormList = get;
    console.log('parent 3 this.chargeFormListTem filtered: ', this.chargeFormList);

    this.templateId = num;

    let getParent = new List<Template>(this.temporaltemplateTypes).FirstOrDefault(c => c.itbId === num);
    let getChild = new List<Template>(this.temporaltemplateTypes).Where(c => c.parentId === getParent.itbId).ToArray();

    this.recordPerPage = getParent.recordPerPage;
    console.log('getParent 99: ', getParent);
    console.log('getChild 99: ', getChild);
    
    if (getChild.length > 0) {
      this.templateTypesChild = getChild;
      this.parentTemplateName = `Select ${getParent.templateName} Category`;
    }
    if (getChild.length === 0) {
      this.parentTemplateName = '';
      this.instrumentForm.templateChildId = null;
      let getChargeAmount = new List<admStatementChg>(this.admStatementChg).FirstOrDefault(c => c.serviceId === this.serviceId && c.templateId === this.templateId);
      console.log('getChargeAmount getSelectedCharge', getChargeAmount)
      this.chgAmount = getChargeAmount.cghAmount;
      this.initiate();
    }
    
  }

  getChildTemp(templateId) {
    let num = Number(templateId.target.value);
    console.log('getChildTemp num', num)
    console.log('getChildTemp this.chargeFormListTem', this.chargeFormListTem)
    let get = new List<ChargeForm>(this.chargeFormListTem).Where(c => c.templateId === num).ToArray();
    this.chargeFormList = get;
    console.log('getChargeAmount getChildTemp', this.chargeFormList)

    this.templateId = num;

    let getParent = new List<Template>(this.temporaltemplateTypes).FirstOrDefault(c => c.itbId === num);
    let getChargeAmount = new List<admStatementChg>(this.admStatementChg).FirstOrDefault(c => c.serviceId === this.serviceId && c.templateId === this.templateId);
    this.chgAmount = getChargeAmount.cghAmount;
    this.initiate();
  }

  updateFilter(event, value: any) {
    let temp1 = this.temp;

    if (value === 'ACCT NO') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.acct_no.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'ACCT TYPE') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.acct_type.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'TRANS DATE') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.transDate.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'VALUE DATE') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.valueDate.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'NARRATION') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.narration.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'DR AMOUNT') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.debit.toString().toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'CR AMOUNT') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.credit.toString().toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'BALANCE') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.balance.toString().toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }

    if (value === 'CCY') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.iso_code.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }

    if (value === 'CHANGE FLAG') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.changeFlag.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'UNCLEARED FLAG') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.changeFlag.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }

    if (this.rows.length === 0) {
      swal('', this.recordNotFoundMsg, 'error');

      this.rows = temp1;

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


  initiate(): void {

    if (this.instrumentForm.acctNo == null) {
      swal('', 'Enter Instrument Acct No ', 'error');
      return;
    }
    console.log('this.chargeFormList.length: ', this.chargeFormList);
    console.log('this.chargeFormList.length: ', this.chargeFormList.length);
    for (let i = 0; i < this.chargeFormList.length; i++) {
      console.log('this.chargeFormListTTT: ', this.chargeFormList[i]);

      if (this.chargeFormList[i] != undefined) {

        console.log('not undefined: ', this.chargeFormList);
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
        // if (this.chargeFormList[i].chgAcctType === null) {

        //   swal('','Select  Charge Acct Type', 'error');
        //   return;

        // }
      }
    }

    console.log('Spool this.totalRecPull: ', this.totalRecPull);
    console.log('Spool this.recordPerPage: ', this.recordPerPage);
    let chgAmount = 0;
    if (this.parentTemplateName === '') {
      let totalrec = this.totalRecPull / this.recordPerPage;
      totalrec = Math.ceil(totalrec)
      console.log('Spool totalrec: ', totalrec);
      let res = new List<admStatementChg>(this.admStatementChg).FirstOrDefault(c => c.startingNo === totalrec || c.endingNo < totalrec + 1);
      console.log('Spool res1: ', res);

      if (res !== undefined)
        chgAmount = res.cghAmount
    }

    if (this.parentTemplateName !== '') {
      chgAmount = this.chgAmount
    }

    console.log('chgAmount: ', chgAmount);

    let values = {

      acctNo: this.instrumentForm.acctNo,
      acctType: this.instrumentForm.acctType,
      transAmout: '0',
      ListoprServiceCharge: this.chargeFormList,
      loginUserName: this.userDetails.userName,
      deptId: this.userDetails.deptId,
      userId: this.userDetails.userId,
      serviceId: this.serviceId,
      pnCalcAmt: chgAmount

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
        this.instrumentForm.availBal = data.instrumentAcctDetails.nBalance;
        this.instrumentForm.rsmId = data.instrumentAcctDetails.sRsmId == null ? 0 : data.instrumentAcctDetails.sRsmId;

        this.instrumentForm.availBal = data.instrumentAcctDetails.nBalance;
        // this.instrumentForm.availBalString = data.instrumentAcctDetails.nBalance ;
        this.instrumentForm.acctSic = data.instrumentAcctDetails.sSector;
        this.instrumentForm.acctStatus = data.instrumentAcctDetails.sStatus;
        this.instrumentForm.ccyCode = data.instrumentAcctDetails.sCrncyIso;
        // this.instrumentForm.serialNo = this.instrumentForm.serialNo ;

        //this.instrumentForm.instrumentCcy = this.instrumentForm.ccyCode;
        this.instrumentForm.acctProductCode = data.instrumentAcctDetails.sProductCode;

        this.instrumentForm.acctCustNo = data.instrumentAcctDetails.sCustomerId;
        // Contigent

        this.instrumentForm.branchName = data.instrumentAcctDetails.sBranchName;

        this.chargeFormList = data.chgList;

        console.log("this.chargeFormList inside data = ", this.chargeFormList);
        console.log("this.chargeFormList length inside data = ", this.chargeFormList.length);
        for (let i = 0; i < this.chargeFormList.length; i++) {
          console.log("defined or undefine ", this.chargeFormList[i]);
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

        console.log("this.chargeFormList after = ", this.chargeFormList);

        this.loadPage = false;

        if (data.instrumentAcctDetails.nErrorCode !== 0) {

          Swal('', data.instrumentAcctDetails.sErrorText, 'error');
          return;
        }

      },
      (error: any) => {
        this.loadPage = false;
        Swal('', error.error.responseMessage, 'error');
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

      //page_span.innerHTML = page + "/" + this.numPages();
      this.pageListVal = page + "/" + this.numPages();

  }

  numPages()
  {
      return Math.ceil(this.temp.length / this.pageLmit);
  }

}