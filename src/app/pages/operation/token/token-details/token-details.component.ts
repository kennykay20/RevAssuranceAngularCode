

import { GenModel } from './../../../../model/gen.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { Token } from '../../../../model/token.model';
import { ChargeForm } from '../../../../model/instrumentForms.model';
import { ServiceModelGen } from '../../../../model/servicesModelGen.model';


@Component({
  selector: 'app-token-details',
  templateUrl: './token-details.component.html',
  styleUrls: ['./token-details.component.scss']
})
export class TokenDetailsComponent implements OnInit {

  rejectedBy: any;
  dismissedBy: any;
  public form: FormGroup;
  actionTaken = 'N';
  basicForm: Token;

  chargeFormList: ChargeForm[];
  public settings: Settings;
  durationsnack = 3000;
  displayloader = false;
  lblProcess: any;
  selectedPrepCat: any;
  religionlist = [];

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

  userFullName: any

  ActionDisplay: any;

  reloadLoad: any;
  createdBy: any;




  tab1 = 'active'
  tab2 = ''
  tab3 = ''

  selectedCalss = 'selected nav-item cursorPointer';
  selectedCalss2 = 'selected nav-item cursorPointer';

  notServiceChargeYet = false;

  serviceId = 1;
  retryService = GenModel.retryService;
  retryMessage: any;
  RetryAttmMsg = GenModel.RetryAttmMsg;
  apiIsDown = GenModel.apiIsDown;
  retryDelayServiceInterval = GenModel.retryDelayServiceInterval;

  departments = [];
  users = [];
  acttypes = [];
  btnConfirm = GenModel.btnConfirm;

  serviceStatuses = [
    {
      status: 'Loaded'
    },
    {
      status: 'Unauthorized'
    },

  ];


  itbId: number;
  constructor(public appSettings: AppSettings,
    public fb: FormBuilder, public fbSer: FormBuilder, public router: Router,
    public snackBar: MatSnackBar,
    public _waitingDialog: WaitingDialog,
    private _localStorageService: LocalStorageService,
    public _GeneralService: GeneralService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<TokenDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.settings = this.appSettings.settings;


    if (this.data.actionName === 'Add') {

      this.resetTokenForm();
      this.resetCharge();

    }
    else {
      // this.resetCharge();
      this.ActionHeaderMsg = '';
      this.ActionDisplay = this.ActionViewHeaderMsg;

      this.itbId = data.itbId;
      this.serviceId = data.serviceId;
      this.getById();

    }
  }

  ngOnInit() {

    this.loadPage = false;
    this.loadDepartment();
    this.loadUsers();
    this.loadAcctTypes();
  }


  getById(): void {


    this.loadPage = true;

    let track = 0;
    let url = 'Token/GetById';

    let val = {

      itbId: this.itbId,
      serviceId: this.serviceId
    };

    console.log('getById val', val);

    this._GeneralService.post(val, url)

      .subscribe(
        (data: any) => {

          console.log('get token ret data', data);

          this.loadPage = false;

          this.basicForm = data.serviceDetails;

          this.basicForm.dateCreated = this.basicForm.dateCreated != null ? this._GeneralService.dateCreated(this.basicForm.dateCreated) : this.basicForm.dateCreated;
          this.basicForm.createdBy = data.allUsers.createdBy;
          this.basicForm.branchName = data.valServiceAcct.branchName

          this.chargeFormList = data.serviceChargeslist;


          for (let i = 0; i <= this.chargeFormList.length; i++) {
            if (this.chargeFormList[i] != null) {
              this.chargeFormList[i].transactionDate = this.basicForm.transactionDate != null ? this._GeneralService.dateconvertion(this.basicForm.transactionDate) : this.basicForm.transactionDate;
              this.chargeFormList[i].valueDate = this.basicForm.valueDate != null ? this._GeneralService.dateconvertion(this.basicForm.valueDate) : this.basicForm.valueDate;
              this.chargeFormList[i].origChgAmount = this.chargeFormList[i].origChgAmount != null ? this._GeneralService.formatMoney(this.chargeFormList[i].origChgAmount) : this.chargeFormList[i].origChgAmount;
              this.chargeFormList[i].equivChgAmount = this.chargeFormList[i].equivChgAmount != null ? this._GeneralService.formatMoney(this.chargeFormList[i].equivChgAmount) : this.chargeFormList[i].equivChgAmount;
              this.chargeFormList[i].taxAmount = this.chargeFormList[i].taxAmount != null ? this._GeneralService.formatMoney(this.chargeFormList[i].taxAmount) : this.chargeFormList[i].taxAmount;



            }
          }

          // if(data.allUsers != undefined)
          // {
          //   this.createdBy = data.allUsers.createdBy;
          //   this.dismissedBy= data.allUsers.dismissedBy;
          //   this.rejectedBy = data.allUsers.rejectedBy;
          // }

          /*this.basicForm = data.instrumentDetails;
          this.instrumentForm.amount = this.instrumentForm.amount != null ? this._GeneralService.formatMoney(this.instrumentForm.amount) : this.instrumentForm.amount;
          this.instrumentForm.availBal = this.instrumentForm.availBal != null ? this._GeneralService.formatMoney(this.instrumentForm.availBal) : this.instrumentForm.availBal;
          this.instrumentForm.branchName = data.valInstrumentAcct.sBranchName ;
      
       
          this.instrumentForm.insuranceEffectiveDate  = this.instrumentForm.insuranceEffectiveDate != null ? this._GeneralService.dateconvertion(this.instrumentForm.insuranceEffectiveDate) : this.instrumentForm.insuranceEffectiveDate;
          this.instrumentForm.insuranceExpiryDate  = this.instrumentForm.insuranceExpiryDate != null ? this._GeneralService.dateconvertion(this.instrumentForm.insuranceExpiryDate) : this.instrumentForm.insuranceExpiryDate;
          
          console.log('this.CollateralForm ',  this.CollateralForm);
          this.chargeFormList = data.serviceChargeslist;
          this.instrumentForm.effectiveDate = this.instrumentForm.effectiveDate != null ? this._GeneralService.dateconvertion(this.instrumentForm.effectiveDate) : this.instrumentForm.effectiveDate
      
          this.instrumentForm.dateCreated = this.instrumentForm.dateCreated != null ? this._GeneralService.dateCreated(this.instrumentForm.dateCreated) : this.instrumentForm.dateCreated;
      
          console.log('this.instrumentForm ',  this.instrumentForm);
      
         
          */
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

  resetTokenForm() {
    this.basicForm = {
      itbId: 0,
      roleId: 0,
      roleName: null,
      currencyIso: null,
      itbid: null,
      serviceId: null,
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
      serialNo: null,
      wkfId: null,
      recordDate: null,
      serviceStatus: null,
      serviceItbId: null,
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
      taxAcctNo: null,
      taxAcctType: null,
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
      seqNo: null,
      status: null,
      rsmId: null,
      originatingBranchId: null,
      processingDeptId: null,
      transactionDate: null,
      valueDate: null,
      userId: 0,
      valAcctError: null,
      errorCode: null,
      errorMsg: null,
      ErrorCode: null,
      ErrorMsg: null,
      DismissedBy: null,
      DismissedDate: null,
      Rejected: null,
      RejectionIds: null,
      RejectionDate: null,
      RejectedBy: null,
      createdBy: null,
      dateCreated: null,
      branchName: null,
      userProcessingDept: null,
      originBranch: null,
      username: null
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
      templateId: 0,
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

    //  console.log('token param load', val);

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


          this.departments = data;

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

    console.log('token param load', val);

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

    console.log('token param load', val);

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
  check() {

  }

  serviceChage(param: any, record: any): any {

    this.loadPage = true;

    let serv: ServiceModelGen = param;

    console.log('ServiceCharge token serv', serv);


    let val =
    {
      serviceId: serv.serviceId,
      serviceItbId: serv.serviceItbId
    }

    let url = 'ServiceCharge/GetAll';

    console.log('ServiceCharge val token param', val);

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {
        console.log('service Processed data: ', data);

        this.chargeFormList = data._response;
        console.log('service this.chargeFormList: ', this.chargeFormList);
        this.loadPage = false;

      },
      (error: any) => {
        this.loadPage = false;
        console.log(error);

      });
  }


  add(values: Object): void {

    this.actionLoaderSave = true;
    let element = <HTMLInputElement>document.getElementById("btnSave");
    element.disabled = true;


    this.basicForm.userId = this._GeneralService.getUserId();


    let url = 'BankServiceSetup/Add';


    this._GeneralService.homePage(this.basicForm, url).subscribe(
      (data: any) => {

        this.actionTaken = 'Y';
        element.disabled = false;
        this.resetTokenForm();

        this.actionLoaderSave = false;
        this.reloadLoad = 'Y';

        Swal('', data.sErrorText, 'success');

      },
      (error: any) => {

        this.actionLoaderSave = false;
        element.disabled = true;

        Swal('', this.errorOccur, 'error');

      });



  }

  update(): void {

    console.log('update chargeSetup: ', this.chargeFormList);

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement>document.getElementById("btnUpdate");

    element.disabled = true;
    let url = 'Token/Update';
    let values = {

      oprToken: this.basicForm,
      listoprServiceCharge: this.chargeFormList
    }


    console.log('update values: ', this.chargeFormList);

    this._GeneralService.post(values, url).subscribe(
      (data: any) => {



        this.actionTaken = 'Y';
        element.disabled = false;
        this.actionLoaderUpdate = false;
        this.reloadLoad = 'Y';

        Swal('', data.sErrorText, 'success');
      },
      (error: any) => {

        element.disabled = false;
        this.actionLoaderUpdate = false;

        Swal('', error.error.message, 'error');
      });


  }


  processTrans(): void {

    //console.log('processTrans chargeSetup: ', this.chargeSetup);

    console.log('this.basicform itbid: ', this.basicForm.itbid);
    // console.log('this.basicFormSer: ' , this.basicFormSer.value);

    if (this.chargeFormList === undefined) {

      Swal('', 'Charge details is required', 'error');
      return;
    }

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement>document.getElementById("btnProcess");

    element.disabled = true;


    let url = 'Token/Process';

    let userDetails = this._GeneralService.getUserDetails();

    console.log('userDetails: ', userDetails);


    let oprTokenVal = {
      ItbId: this.basicForm.itbid,
      ServiceId: this.serviceId,
      OrigDeptId: this.basicForm.processingDeptId,
      ReferenceNo: null,
      BranchNo: 1, // this.basicForm.value.branchNo, hard coded
      AcctNo: this.basicForm.acctNo,
      AcctType: this.basicForm.acctType,
      AcctName: this.basicForm.acctName,
      AvailBal: this.basicForm.availBal,
      AcctStatus: this.basicForm.acctStatus,
      CcyCode: this.basicForm.ccyCode,
      SerialNo: this.basicForm.serialNo,
      RsmId: this.basicForm.rsmId,
      ProcessingDeptId: this.basicForm.processingDeptId,

    }


    let val =
    {
      OprToken: oprTokenVal,// ,
      serviceId: this.serviceId,
      loginUserName: userDetails.userName,
      deptId: userDetails.deptId,
      userId: userDetails.userId,
      ListoprServiceCharge: this.chargeFormList,
    }

    console.log('values for process: ', val);

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {
        element.disabled = false;
        this.actionLoaderUpdate = false;
        this.actionTaken = 'Y';
        Swal('', data.sErrorText, 'success');
      },
      (error: any) => {

        element.disabled = false;
        this.actionLoaderUpdate = false;

        Swal('', error.error.message, 'error');
      });


  }

  dismissTrans(): void {

    Swal({
      title: '',
      text: 'Are you sure you want Dismiss this Request? ',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'YES',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'NO',
      allowEscapeKey: false,
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {

        this.actionLoaderDismiss = true;
        let element = <HTMLInputElement>document.getElementById("btnDismiss");

        element.disabled = true;

        let url = 'Token/Dismiss';

        let userDetails = this._GeneralService.getUserDetails();

        console.log('userDetails: ', userDetails);


        let oprTokenVal = {
          ItbId: 1,// this.basicForm.value.itbid, hard coded
          ServiceId: this.serviceId,
          OrigDeptId: this.basicForm.processingDeptId,
          ReferenceNo: null,
          BranchNo: 1, // this.basicForm.value.branchNo, hard coded
          AcctNo: this.basicForm.acctNo,
          AcctType: this.basicForm.acctType,
          AcctName: this.basicForm.acctName,
          AvailBal: this.basicForm.availBal,
          // AcctSic: this.basicForm.value.ii,
          AcctStatus: this.basicForm.acctStatus,
          CcyCode: this.basicForm.ccyCode,
          SerialNo: this.basicForm.serialNo,
          // TransId: this.basicForm.value.ii,
          //  WkfId: this.basicForm.value.ii,
          //  RecordDate: this.basicForm.value.ii,
          // ServiceStatus: this.basicForm.value.ii,
          RsmId: this.basicForm.rsmId,
          // Status: this.basicForm.value.ii,
          // OriginatingBranchId: this.basicForm.value.ii,
          ProcessingDeptId: this.basicForm.processingDeptId,
          // TransactionDate: this.basicForm.value.ii,
          // ValueDate: this.basicForm.value.ii,
          // DateCreated: this.basicForm.value.ii,
          /* UserId: this.basicForm.value.ii,
           SupervisorId: this.basicForm.value.ii,
           ValAcctError: this.basicForm.value.ii,
           ErrorCode: this.basicForm.value.ii,
           ErrorMsg: this.basicForm.value.ii,
           DismissedBy: this.basicForm.value.ii,
           DismissedDate: this.basicForm.value.ii,
           Rejected: this.basicForm.value.ii,
           RejectionIds: this.basicForm.value.ii,
           RejectionDate: this.basicForm.value.ii,
           RejectedBy: this.basicForm.value.ii,
           */
        }

        let val =
        {
          OprToken: oprTokenVal,// ,
          serviceId: this.serviceId,
          loginUserName: userDetails.userName,
          deptId: userDetails.deptId,
          userId: userDetails.userId,
          ListoprServiceCharge: this.chargeFormList,
        }

        this._GeneralService.post(val, url).subscribe(
          (data: any) => {
            element.disabled = false;
            this.actionLoaderDismiss = false;
            this.actionTaken = 'Y';
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



  keyPress(event: any) {

    console.log('keyPress', this.basicForm.acctNo);
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  validateAcct(event) {

    let userDetails = this._GeneralService.getUserDetails();

    // console.log('userDetails: ', userDetails);


    let values = {

      acctNo: event.target.value,
      acctType: this.basicForm.acctType,
      transAmout: '0',
      ListoprServiceCharge: this.chargeFormList,
      loginUserName: userDetails.userName,
      deptId: userDetails.deptId,
      userId: userDetails.userId,
      serviceId: this.serviceId
    }


    this.loadPage = true;

    let url = 'Token/CalCulateCharge';

    this._GeneralService.post(values, url).subscribe(
      (data: any) => {
        console.log('Cal Charges: ', data);

        this.basicForm = data.instrumentAcctDetails;
        this.chargeFormList = data.chgList
        this.loadPage = false;

        if (data.instrumentAcctDetails.nErrorCode !== 0) {


          Swal('', data.instrumentAcctDetails.sErrorText, 'error');
          return;
        }



      },
      (error: any) => {

        this.loadPage = false;

        Swal('', this.errorOccur, 'error');
      });


  }

  validateAcctChg(event) {
    // console.log('validateAcct event', event);

    // console.log('validateAcct target', event.target.value);

    let userDetails = this._GeneralService.getUserDetails();

    // console.log('userDetails: ', userDetails);


    let values = {

      acctNo: this.basicForm.acctNo,
      acctType: this.basicForm.acctType,
      transAmout: '0',
      ListoprServiceCharge: this.chargeFormList,
      loginUserName: userDetails.userName,
      deptId: userDetails.deptId,
      userId: userDetails.userId,
      serviceId: this.serviceId
    }

    //  console.log('validateAcct values', values);
    this.loadPage = true;

    let url = 'Token/CalCulateCharge';

    this._GeneralService.post(values, url).subscribe(
      (data: any) => {
        console.log('Cal Charges: ', data);

        this.basicForm = data.instrumentAcctDetails;
        this.chargeFormList = data.chgList;


        if (data.instrumentAcctDetails.nErrorCode !== 0) {

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

    this.dialogRef.close(this.actionTaken);
  }


  swapTab(value) {
    console.log('swapTab: ', value);


    if (value === 1) {
      this.tab1 = 'active';
      this.tab2 = '';
      this.tab3 = '';
    }
    if (value === 2) {
      this.tab1 = '';
      this.tab2 = 'active';
      this.tab3 = '';
    }

    if (value === 3) {
      this.tab1 = '';
      this.tab2 = '';
      this.tab3 = 'active';
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

}




