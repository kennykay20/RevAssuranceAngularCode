


import { TokenDetailsComponent } from './../../token/token-details/token-details.component';

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
import { CbsTransaction } from '../../../../model/cbsTransaction.model';
import { ApgDetailsComponent } from '../../apg/apg-details/apg-details.component';
import { OprArmortizationSchedule } from '../../../../model/OprArmortizationSchedule.model';
import { admService } from '../../../../model/admService';
import { UserDetails } from '../../../../model/userDetails';
import { List } from 'linqts';
import { RejReasonComponent } from '../../RejectionReason/rej-reason/rej-reason.component';
import { auditTrailDetailComponent } from '../../../admin/auditTrail/auditTrail-details/audittrail-detail.component';


@Component({
  selector: 'app-amortization-details',
  templateUrl: './amortization-details.component.html',
  styleUrls: ['./amortization-details.component.scss']
})
export class AmortizationDetailsComponent implements OnInit {

  public form: FormGroup;
  actionTaken = 'N';
  basicForm: OprArmortizationSchedule;
  admService: admService[];
  currencies = []
  branches = []
  period = []
  TC = []
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
  loadPage = false;
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

  statuses: any;


  tab1 = 'active'
  tab2 = ''
  tab3 = ''
  chargeSetupTem = [] = [];
  chargeSetup: any[];

  selectedCalss = 'selected nav-item cursorPointer';
  selectedCalss2 = 'selected nav-item cursorPointer';

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
  recordDetails: any;
  userDetails: UserDetails;
  scheduleId: number;

  currentYear = new Date().getUTCFullYear();
  startDateVal = new Date(this.currentYear, 0, 1);
  minDate = new Date();

  getSelected: OprArmortizationSchedule[];
  tableName= "OprAmortizationSchedule";

  constructor(public appSettings: AppSettings,
    public fb: FormBuilder, public fbSer: FormBuilder, public router: Router,
    public snackBar: MatSnackBar,
    public _waitingDialog: WaitingDialog,
    private _localStorageService: LocalStorageService,
    public _GeneralService: GeneralService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AmortizationDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.userDetails = this._GeneralService.getUserDetails();
      this.serviceId = data.serviceId;
    console.log('data ', data);
    if(data.actionName == 'Add'){
      this.resetForm(); 
    }

    if(data.actionName !== 'Add')
    {
      this.basicForm = data.record;
      this.scheduleId  = this.basicForm.scheduleId;
      this.GetById(this.scheduleId);
      
      if (data.actionName == 'Authorize') {
        this.getSelected = data.getSelected

        console.log('this.getSelected View Auth', this.getSelected);
      }
    }

  }

  ngOnInit() {
    this.loadPage = false;
    this.statuses = this._GeneralService.Statuses;
    this.loadDepartment();
    this.loadUsers();
    this.loadAcctTypes();
    this.loadAll();
    this.period = this._GeneralService.period;
    this.TC = this._GeneralService.TC


  }

  resetForm() {
    this.basicForm = new OprArmortizationSchedule();
  }

  GetById(scheduleId) {
    console.log('GetById statr');

    let values = {
      OprAmortizationSchedule: {
        scheduleId: scheduleId
      },
      serviceId: this.serviceId
    };

    let url = 'Armortization/GetById';

    this._GeneralService.post(values, url).subscribe(
      (data: any) => {
        
        this.loadPage = false;
     
        console.log(' data.get Armotization', data);
       // console.log(' data.get Armotization', data.allUsers);

        this.basicForm = data.instrumentDetails;

        this.basicForm.dateCreated =  this.basicForm.dateCreated != null ? this._GeneralService.dateCreated( this.basicForm.dateCreated):  this.basicForm.dateCreated;
        this.basicForm.effectiveDate =  this.basicForm.effectiveDate != null ? this._GeneralService.dateconvertion( this.basicForm.effectiveDate):  this.basicForm.effectiveDate;
        this.basicForm.expiryDate =  this.basicForm.expiryDate != null ? this._GeneralService.dateconvertion( this.basicForm.expiryDate):  this.basicForm.expiryDate;
        this.basicForm.firstInstlmtDate =  this.basicForm.firstInstlmtDate != null ? this._GeneralService.dateconvertion( this.basicForm.firstInstlmtDate):  this.basicForm.firstInstlmtDate;
        this.basicForm.nextInstlmtDate =  this.basicForm.nextInstlmtDate != null ? this._GeneralService.dateconvertion( this.basicForm.nextInstlmtDate):  this.basicForm.nextInstlmtDate;
        this.basicForm.finalInstlmtDate =  this.basicForm.finalInstlmtDate != null ? this._GeneralService.dateconvertion( this.basicForm.finalInstlmtDate):  this.basicForm.finalInstlmtDate;
        
        this.basicForm.totalAmount =  this.basicForm.totalAmount != null ? this._GeneralService.formatMoney( this.basicForm.totalAmount):  this.basicForm.totalAmount;
        

        this.basicForm.dracctStatus = data.valDRInstrumentAcct.sStatus
        this.basicForm.dracctName =   data.valDRInstrumentAcct.sName
        this.basicForm.dracctBal  =   data.valDRInstrumentAcct.nBalance
        this.basicForm.dracctCcy  =   data.valDRInstrumentAcct.sCrncyIso

        //

        this.basicForm.cracctStatus =   data.valCRInstrumentAcct.sStatus
        this.basicForm.cracctName =   data. valCRInstrumentAcct.sName
        this.basicForm.cracctBal  =   data.valCRInstrumentAcct.nBalance
        this.basicForm.cracctCcy  =   data.valCRInstrumentAcct.sCrncyIso
       
        if(data.allUsers != undefined)
        {
          this.basicForm.createdBy = data.allUsers.createdBy;
         // this.dismissedBy= data.allUsers.dismissedBy;
         // this.rejectedBy = data.allUsers.rejectedBy;
        }

      },
      (error: any) => {

        console.log('error: ', error);
        Swal('', this.errorOccur, 'error');
      });
  }

  gotoService(recordDetails: CbsTransaction) {
    this.loadPage = true;
    setTimeout(() => {
      this.loadPage = false;

      console.log('gotoService recordDetails: ', recordDetails.serviceId);

      if (recordDetails.serviceId == 1) {


        let dialogRef = this.dialog.open(TokenDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,

          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: 'View', record: recordDetails, createdBy: 1,
            itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId
          },

        });

        dialogRef.afterClosed().subscribe(result => {

        });

      }
      if (recordDetails.serviceId == 2) {

        let dialogRef = this.dialog.open(TokenDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,

          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: 'View', record: recordDetails, createdBy: 1,
            itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId
          },

        });

        dialogRef.afterClosed().subscribe(result => {

        });

      }
      if (recordDetails.serviceId == 3) {

        let dialogRef = this.dialog.open(TokenDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,

          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: 'View', record: recordDetails, createdBy: 1,
            itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId
          },

        });

        dialogRef.afterClosed().subscribe(result => {

        });

      }
      if (recordDetails.serviceId == 4) {

        let dialogRef = this.dialog.open(TokenDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,

          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: 'View', record: recordDetails, createdBy: 1,
            itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId
          },

        });

        dialogRef.afterClosed().subscribe(result => {

        });

      }
      if (recordDetails.serviceId == 5) {

        let dialogRef = this.dialog.open(TokenDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,

          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: 'View', record: recordDetails, createdBy: 1,
            itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId
          },

        });

        dialogRef.afterClosed().subscribe(result => {

        });

      }
      if (recordDetails.serviceId == 6) {

        let dialogRef = this.dialog.open(TokenDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,

          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: 'View', record: recordDetails, createdBy: 1,
            itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId
          },

        });

        dialogRef.afterClosed().subscribe(result => {

        });

      }
      if (recordDetails.serviceId == 7) {

        let dialogRef = this.dialog.open(TokenDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,

          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: 'View', record: recordDetails, createdBy: 1,
            itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId
          },

        });

        dialogRef.afterClosed().subscribe(result => {

        });

      }
      if (recordDetails.serviceId == 8) {

        let dialogRef = this.dialog.open(TokenDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,

          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: 'View', record: recordDetails, createdBy: 1,
            itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId
          },

        });

        dialogRef.afterClosed().subscribe(result => {

        });

      }
      if (recordDetails.serviceId == 9) {

        let dialogRef = this.dialog.open(TokenDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,

          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: 'View', record: recordDetails, createdBy: 1,
            itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId
          },

        });

        dialogRef.afterClosed().subscribe(result => {

        });

      }
      if (recordDetails.serviceId == 10) {

        let dialogRef = this.dialog.open(TokenDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,

          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: 'View', record: recordDetails, createdBy: 1,
            itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId
          },

        });

        dialogRef.afterClosed().subscribe(result => {

        });

      }
      if (recordDetails.serviceId == 11) {

        let dialogRef = this.dialog.open(TokenDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,

          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: 'View', record: recordDetails, createdBy: 1,
            itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId
          },

        });

        dialogRef.afterClosed().subscribe(result => {

        });

      }
      if (recordDetails.serviceId == 12) {

        let dialogRef = this.dialog.open(TokenDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,

          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: 'View', record: recordDetails, createdBy: 1,
            itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId
          },

        });

        dialogRef.afterClosed().subscribe(result => {

        });

      }
      if (recordDetails.serviceId == 13) {

        let dialogRef = this.dialog.open(TokenDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,

          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: 'View', record: recordDetails, createdBy: 1,
            itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId
          },

        });

        dialogRef.afterClosed().subscribe(result => {

        });

      }
      if (recordDetails.serviceId == 14) {

        let dialogRef = this.dialog.open(TokenDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,

          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: 'View', record: recordDetails, createdBy: 1,
            itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId
          },

        });

        dialogRef.afterClosed().subscribe(result => {

        });

      }
      if (recordDetails.serviceId == 15) {

        let dialogRef = this.dialog.open(TokenDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,

          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: 'View', record: recordDetails, createdBy: 1,
            itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId
          },

        });

        dialogRef.afterClosed().subscribe(result => {

        });

      }
      if (recordDetails.serviceId == 16) {

        let dialogRef = this.dialog.open(TokenDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,

          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: 'View', record: recordDetails, createdBy: 1,
            itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId
          },

        });

        dialogRef.afterClosed().subscribe(result => {

        });

      }
      if (recordDetails.serviceId == 17) {

        let dialogRef = this.dialog.open(TokenDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,

          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: 'View', record: recordDetails, createdBy: 1,
            itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId
          },

        });

        dialogRef.afterClosed().subscribe(result => {

        });

      }
      if (recordDetails.serviceId == 18) {

        let dialogRef = this.dialog.open(TokenDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,

          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: 'View', record: recordDetails, createdBy: 1,
            itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId
          },

        });

        dialogRef.afterClosed().subscribe(result => {

        });

      }
      if (recordDetails.serviceId == 19) {

        let dialogRef = this.dialog.open(ApgDetailsComponent, {

          // width: '3500px',
          // height: '800px',
          // hasBackdrop: true,

          // autoFocus: true,
          disableClose: true,
          data: {
            actionName: 'View', record: recordDetails,
            createdBy: 1, itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId
          },

        });

        dialogRef.afterClosed().subscribe(result => {

        });

      }

    }, 100);
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
      this.departments = data._response;
      console.log('this.departments: ', this.departments);
        
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

          this.users = data;


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
  //data.record
  serviceChage(param: any, record: any): any {

    this.loadPage = true;

    console.log('ServiceCharge param', param);

    console.log('ServiceCharge record', record);

    //console.log('ServiceCharge param this.basicForm.value.itbid', this.basicForm.itbId);

    let val = {
      //  serviceId : this.basicForm.serviceId,
      // serviceItbId:  this.basicForm.itbId
    }

    let url = 'ServiceCharge/GetAll';


    console.log('ServiceCharge val', val);

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {
        console.log('service Processed data: ', data);

        this.loadPage = false;
        if (data.length === 0) {
          console.log('service charge already not yet Processed: ', data);
          this.chargeSetup = this.chargeSetupTem;

          this.notServiceChargeYet = true;

        }
        else {
          console.log('service charge already Processed: ', data);

          this.chargeSetup = data;

        }

        for (let i = 0; i < this.chargeSetup.length; i++) {





        }




        console.log('servive Charge ', this.chargeSetup);
      },
      (error: any) => {
        this.loadPage = false;
        console.log(error);

      });
  }


  add(basicForm): void {

    if(this.basicForm.instrumentType == null)
    {
      Swal('', 'Instrument type is required', 'error');
      return;
    }
    if(this.basicForm.totalAmount == null || this.basicForm.totalAmount == "")
    {
      Swal('', 'Total Amount is required', 'error');
      return;
    }
    if(this.basicForm.currencyCode == undefined ){

      Swal('', 'Instrument Currency is required', 'error');
      return;
    }
    // if(this.basicForm.dracctCcy == undefined){

    //   Swal('', 'Dr Acct Currency are required', 'error');
    //   return;
    // }
    
    if(this.basicForm.effectiveDate == null || this.basicForm.effectiveDate == "")
    {
      Swal('', 'Effective date is required', 'error');
      return;
    }
    
    
    if(this.basicForm.term == null || this.basicForm.term == "")
    {
      Swal('', 'Term is required', 'error');
      return;
    }
    
    if(this.basicForm.termPeriod == null || this.basicForm.termPeriod == "")
    {
      Swal('', 'Time Basis is required', 'error');
      return;
    }
    if(this.basicForm.processingDept == null){
      
      Swal('', 'Processing Dept is required', 'error');
      return;
    }
    
    
    if(this.basicForm.drAcctType == null)
    {
      Swal('', 'Debit Account Type is required', 'error');
      return;
    }
    if(this.basicForm.drAcctNo == null)
    {
      Swal('', 'Debit Account No is required', 'error');
      return;
    }
    if(this.basicForm.currencyCode != this.basicForm.dracctCcy){

      Swal('', 'Instrument Currency and Dr Acct Currency Must be the Same', 'error');
      return;
    }
    if(this.basicForm.crAcctType == null)
    {
      Swal('', 'Credit Account Type is required', 'error');
      return;
    }
    if(this.basicForm.crAcctNo == null)
    {
      Swal('', 'Credit Account No is required', 'error');
      return;
    }

    this.basicForm.deptId = this.userDetails.deptId;
    this.basicForm.serviceId = this.serviceId;
    this.basicForm.originBranch = this.userDetails.branchNo; 

    this.actionLoaderSave = true;
    let element = <HTMLInputElement>document.getElementById("btnSave");
    element.disabled = true;

    let url = 'Armortization/Add';
   
   
    let values = {

      OprAmortizationSchedule: this.basicForm,
      LoginUserId:  this.userDetails.userId,

    }

    console.log('add values: ', values);

    this._GeneralService.post(values, url).subscribe(
      (data: any) => {
    
       Swal('', data.responseMessage, 'success');
       this.actionLoaderSave = false;

       this.basicForm = new OprArmortizationSchedule();
       this.reloadLoad = 'Y'
     
       element.disabled = false; 
      },
      (error: any) => 
      {
        this.actionLoaderSave = false;
        this.reloadLoad= 'Y'
        element.disabled = false; 
        // console.log(' error.error',  error.error);
        // this.actionLoaderSave = false;
        // element.disabled = false;
        Swal('', error.error.responseMessage, 'error');
    });

  
  }

  update(): void {

    // if(this.basicForm.currencyCode != this.basicForm.dracctCcy){

    //   Swal('', 'Instrument Currency and Dr Acct Currency Must be the Same', 'error');
    //   return;
    // }

    // if(this.basicForm.processingDept == null){

    //   Swal('', 'Processing Dept is required', 'error');
    //   return;
    // }

    if(this.basicForm.currencyCode == undefined ){

      Swal('', 'Instrument Currency is required', 'error');
      return;
    }
    // if(this.basicForm.dracctCcy == undefined){

    //   Swal('', 'Dr Acct Currency are required', 'error');
    //   return;
    // }
    if(this.basicForm.currencyCode != this.basicForm.dracctCcy){

      Swal('', 'Instrument Currency and Dr Acct Currency Must be the Same', 'error');
      return;
    }

    if(this.basicForm.effectiveDate == null || this.basicForm.effectiveDate == "")
    {
      Swal('', 'Effective date is required', 'error');
      return;
    }

    if(this.basicForm.processingDept == null){

      Swal('', 'Processing Dept is required', 'error');
      return;
    }

    if(this.basicForm.term == null || this.basicForm.term == "")
    {
      Swal('', 'Term is required', 'error');
      return;
    }

    if(this.basicForm.termPeriod == null || this.basicForm.termPeriod == "")
    {
      Swal('', 'Time Basis is required', 'error');
      return;
    }

    if(this.basicForm.instrumentType == null)
    {
      Swal('', 'Instrument type is required', 'error');
      return;
    }
    if(this.basicForm.totalAmount == null || this.basicForm.totalAmount == "")
    {
      Swal('', 'Total Amount is required', 'error');
      return;
    }
    if(this.basicForm.drAcctType == null)
    {
      Swal('', 'Debit Account Type is required', 'error');
      return;
    }
    if(this.basicForm.drAcctNo == null)
    {
      Swal('', 'Debit Account No is required', 'error');
      return;
    }
    if(this.basicForm.crAcctType == null)
    {
      Swal('', 'Credit Account Type is required', 'error');
      return;
    }
    if(this.basicForm.crAcctNo == null)
    {
      Swal('', 'Credit Account No is required', 'error');
      return;
    }


    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement>document.getElementById("btnUpdate");
    element.disabled = true;

    let url = 'Armortization/Update';
   
   
    let values = {

      OprAmortizationSchedule: this.basicForm,
      LoginUserId:  this.userDetails.userId,

    }

    console.log('update values: ', values);

    this._GeneralService.post(values, url).subscribe(
      (data: any) => {
    
       if(data.responseCode == 0){
        Swal('', data.responseMessage, 'success');
       }
       else{
        Swal('', data.responseMessage, 'error');
       }
       

       this.actionLoaderUpdate = false;

       this.reloadLoad = 'Y'
     
       element.disabled = false; 
      },
      (error: any) => 
      {
        this.actionLoaderUpdate = false;
        this.reloadLoad= 'Y'
        element.disabled = false; 
        Swal('', error.error.responseMessage, 'error');
        
    });

  
  }




  keyPress(event: any) {


    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  validateAcct(event) {

    let userDetails = this._GeneralService.getUserDetails();

    // console.log('userDetails: ', userDetails);

    let instrumentForm = this.basicForm;


    let values = {

      acctNo: event.target.value,
      //  acctType : this.basicForm.acctType,
      //      transAmout: this.basicForm.amount,
      ListoprServiceCharge: this.chargeSetup,
      loginUserName: userDetails.userName,
      deptId: userDetails.deptId,
      userId: userDetails.userId,
      serviceId: this.serviceId
    }


    this.loadPage = true;

    let url = 'GenChargeCal/CalCulateCharge';

    this._GeneralService.post(values, url).subscribe(
      (data: any) => {
        console.log('Cal Charges: ', data);



        //  this.chargeSetup = [] || [];

        //  this.chargeSetup = data.chgList

        // console.log('Val this.chargeSetup: ', this.chargeSetup);

        // console.log('this.chargeSetup after nulify', this.chargeSetup);

        for (let i = 0; i < data.chgList.length; i++) {

        }

        this.loadPage = false;

        if (data.instrumentAcctDetails.nErrorCode !== 0) {
          console.log('instrumentForm: ', instrumentForm);


          //  this.returnForm(instrumentForm, chgForm)

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
    let userDetails = this._GeneralService.getUserDetails();
  }

  returnForm(intrumentForm, chgForm) {

    // this.basicForm = instrumentForm;
    // this.basicFormSer =   chgForm;

    // this.basicFormSer.patchValue({
    //   itbId :  [null],
    //   serviceId: this.serviceId,
    //   serviceItbId		 :  [null],   
    //   chgAcctNo			 :   data.chgList[i].chgAcctNo,
    //   chgAcctType			 :  data.chgList[i].chgAcctType,
    //   chgAcctName			 :  data.chgList[i].chgAcctName,
    //   chgAvailBal			 :  data.chgList[i].chgAvailBal,
    //   chgAcctCcy			 :  data.chgList[i].chgAcctCcy,
    //   chgAcctStatus		 :  data.chgList[i].chgAcctStatus,
    //   chargeCode			 :  data.chgList[i].chargeCode,
    //   chargeRate			 :  data.chgList[i].nChargeRate,
    //   origChgAmount		 :  data.chgList[i].nOrigChargeAmount,
    //   origChgCCy			 :  data.chgList[i].sTransCurrency,
    //   exchangeRate		 :  data.chgList[i].nExchRate,
    //   equivChgAmount		 :  data.chgList[i].nActualChgAmt,
    //   equivChgCcy			 :  data.chgList[i].sTransCurrency,
    //   chgNarration		 :  data.chgList[i].sNarration,
    //  // taxAcctNo			 :  data.chgList[i].select,
    //  // taxAcctType			 :  data.chgList[i].select,
    //   taxRate				 :  data.chgList[i].nTaxRate,
    //   taxAmount			 :  data.chgList[i].nTaxAmt,
    //   taxNarration		 :  data.chgList[i].sTaxNarration,
    //   incBranch			 :  data.chgList[i].incBranch,
    //   incAcctNo			 :  data.chgList[i].sChargeIncAcctNo,
    //   incAcctType			 :  data.chgList[i].sChargeIncAcctType,
    //   incAcctName			 :  data.chgList[i].incAcctName,
    //   incAcctBalance		 :  data.chgList[i].incAcctBalance,
    //   incAcctStatus		 :  data.chgList[i].incAcctStatus,
    //   incAcctNarr			 :  data.chgList[i].sNarration,
    //   seqNo				 :  null,
    //   status				 : null,
    // //  dateCreated			 :  data.chgList[i].select,
    // //  transactionDate:  data.chgList[i].select, 
    //  // valueDate:  data.chgList[i].select,       
    // });
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

  effDate(event) {

    this.basicForm.effectiveDate = this._GeneralService.dateconvertion(event.target.value);
    this.endDate();
  }

  effDate1(event) {

    this.basicForm.effectiveDate = this._GeneralService.dateconvertion(event);
    this.endDate();
  }

  formatAmt(event) {

    this.basicForm.totalAmount = this._GeneralService.formatMoney(event.target.value);
    this.endDate();
  }

  formatAmt1(event) {

    this.basicForm.dracctBal = this._GeneralService.formatMoney(event.target.value);
   
  }
  formatAmt2(event) {

    this.basicForm.cracctBal = this._GeneralService.formatMoney(event.target.value);
   
  }

  expDate(event) {

    this.basicForm.expiryDate = this._GeneralService.dateconvertion(event.target.value);
  }

  firstInsDate(event) {

    this.basicForm.firstInstlmtDate = this._GeneralService.dateconvertion(event.target.value);
  }

  nxtInsDate(event) {

    this.basicForm.nextInstlmtDate = this._GeneralService.dateconvertion(event.target.value);
  }


  finalInsDate(event) {

    this.basicForm.finalInstlmtDate = this._GeneralService.dateconvertion(event.target.value);
  }


  loadAll(): void {

    this.loadPage = true;
    let track = 0;
    let url = 'AdmGetAll/GetAll';

    this._GeneralService.post(null, url).subscribe(
      (data: any) => {


        this.currencies = data.currencies;
        this.admService = data.admService;
        this.branches = data.branch;
        this.loadPage = false;

        console.log('this.admService 1', this.admService);
        let getser = new List<admService>(this.admService).FirstOrDefault(c => c.serviceId == this.serviceId);
        console.log('getser 1', getser);
        if (getser != null)
          if (getser.defaultDept != null)
            this.basicForm.processingDept = getser.defaultDept;

            this.basicForm.instrumentType = this.serviceId;

        console.log('this.basicForm.processingDept 2', this.basicForm.processingDept);
      },
      (error: any) => {
        console.log('error: ', error)

      });
  }

  public onOptionsSelected(event) {
    this.basicForm.termPeriod = event.target.value;
    this.endDate();
  }


  endDate(): void {
    console.log('endDate start;')
    let val = {

      effectiveDate: this.basicForm.effectiveDate,
      tenorPeriod: this.basicForm.term,
      timeBasis: this.basicForm.termPeriod,
      tenure:  this.basicForm.term,
      startDate: this.basicForm.effectiveDate,
      totalAmount: this.basicForm.totalAmount
    }

    console.log('endDate this.val', val)

    this.loadPage = true;

    let url = 'Armortization/GetReadEndDate';

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {

        console.log('endDate data', data);

        this.basicForm.expiryDate = data.expiryDate
        this.basicForm.finalInstlmtDate = data.finalInstlmtDate
        this.basicForm.instlmtAmount = data.instlmtAmount
        this.basicForm.firstInstlmtDate = data.firstInstlmtDate

        this.basicForm.noInstalmt = data.noInstalmt
        this.basicForm.instlmtProcessed = data.instlmtProcessed

        this.basicForm.nextInstlmtDate = data.nextInstlmtDate
        this.basicForm.instlmtRem = data.noInstalmt
        
        
        this.loadPage = false;
      },
      (error: any) => {

        this.loadPage = false;

       // Swal('', error.error.responseMessage, 'error');
      });

  }

  validateDrAcct(event): any {

    if(this.basicForm.drAcctType == null)
      return  Swal('', 'Select Dr Acct Type', 'error');
    let userDetails = this._GeneralService.getUserDetails();
    
    
    
    let values = {

      acctNo: this.basicForm.drAcctNo,
      acctType: this.basicForm.drAcctType,
      Username: userDetails.userName,
      CrncyCode: ''
    }



    console.log('validateDrAcct dr  acct values: ', values);

    this.loadPage = true;

    let url = 'ServiceCharge/ActtVal';

    this._GeneralService.post(values, url).subscribe(
      (data: any) => {

        console.log('validateDrAcct dr  acct: ', data);
        this.loadPage = false;

        
        this.basicForm.dracctName = data.acctName;
        this.basicForm.dracctCcy = data.acctCCy;
        this.basicForm.dracctStatus = data.acctStatus;
        this.basicForm.dracctBal = data.availBal;
        if(this.basicForm.drAcctType.trim().toLowerCase() == 'ca')
        this.basicForm.drAcctTC = 152;


      },
      (error: any) => {

        this.loadPage = false;

        Swal('', this.errorOccur, 'error');
      });


  }

  validateDrAcct2(): any {

    if(this.basicForm.drAcctType == null || this.basicForm.drAcctType == '')
      return  Swal('', 'Select Dr Acct Type', 'error');
    let userDetails = this._GeneralService.getUserDetails();
    
    
    
    let values = {

      acctNo: this.basicForm.drAcctNo,
      acctType: this.basicForm.drAcctType,
      Username: userDetails.userName,
      CrncyCode: ''
    }



    console.log('validateDrAcct dr  acct values: ', values);

    

    let url = 'ServiceCharge/ActtVal';

    if(this.basicForm.drAcctNo != null || this.basicForm.drAcctNo != ''){
      this.loadPage = true;
      this._GeneralService.post(values, url).subscribe(
        (data: any) => {
  
          console.log('validateDrAcct dr  acct: ', data);
          this.loadPage = false;
  
          
          this.basicForm.dracctName = data.acctName;
          this.basicForm.dracctCcy = data.acctCCy;
          this.basicForm.dracctStatus = data.acctStatus;
          this.basicForm.dracctBal = data.availBal;
          if(this.basicForm.drAcctType.trim().toLowerCase() == 'ca')
          this.basicForm.drAcctTC = 152;
  
  
        },
        (error: any) => {
  
          this.loadPage = false;
  
          Swal('', this.errorOccur, 'error');
        });
    }
    


  }

  validateCrAcct(event) {
    if(this.basicForm.crAcctType == null)
    return  Swal('', 'Select Cr Acct Type', 'error');
    let userDetails = this._GeneralService.getUserDetails();
   

    let values = {

      acctNo: this.basicForm.crAcctNo,
      acctType: this.basicForm.crAcctType,
      Username: userDetails.userName,
      CrncyCode: ''
    }




    this.loadPage = true;

    let url = 'ServiceCharge/ActtVal';

    console.log('validateCrAcct dr  acct values: ', values);
    this.loadPage = true;


    this._GeneralService.post(values, url).subscribe(
      (data: any) => {

        console.log('validateCrAcct cr  acct: ', data);
        this.basicForm.cracctName = data.acctName;
        this.basicForm.cracctCcy = data.acctCCy;
        this.basicForm.cracctStatus = data.acctStatus;
        this.basicForm.cracctBal = data.availBal;

        if(this.basicForm.crAcctType.trim().toLowerCase() == 'ca')
        this.basicForm.crAcctTC = 101;
        this.loadPage = false;
      },
      (error: any) => {

        this.loadPage = false;

        Swal('', this.errorOccur, 'error');
      });


  }

  validateCrAcct2(event) {
    if(this.basicForm.crAcctType == null || this.basicForm.crAcctType == '')
    return  Swal('', 'Select Cr Acct Type', 'error');
    let userDetails = this._GeneralService.getUserDetails();
   

    let values = {

      acctNo: this.basicForm.crAcctNo,
      acctType: this.basicForm.crAcctType,
      Username: userDetails.userName,
      CrncyCode: ''
    }




    //this.loadPage = true;

    let url = 'ServiceCharge/ActtVal';

    console.log('validateCrAcct dr  acct values: ', values);
    //this.loadPage = true;

    if(this.basicForm.crAcctNo != null || this.basicForm.crAcctNo != ''){
      this.loadPage = true;
      this._GeneralService.post(values, url).subscribe(
        (data: any) => {
  
          console.log('validateCrAcct cr  acct: ', data);
          this.basicForm.cracctName = data.acctName;
          this.basicForm.cracctCcy = data.acctCCy;
          this.basicForm.cracctStatus = data.acctStatus;
          this.basicForm.cracctBal = data.availBal;
  
          if(this.basicForm.crAcctType.trim().toLowerCase() == 'ca')
          this.basicForm.crAcctTC = 101;
          this.loadPage = false;
        },
        (error: any) => {
  
          this.loadPage = false;
  
          Swal('', this.errorOccur, 'error');
        });
    }
    


  }

  openRejectionReason(): void {

    Swal({

      title: '',
      text: 'Are you Sure you want to Reject this Armotization?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'Cancel'

    }).then((result) => {

      if (result.value) {

        let dialogRef = this.dialog.open(RejReasonComponent, {

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
      else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });

    
 
  }

  reject(result): void {

    
    this.actionLoaderUpdate = true;


    let url = 'AuthArmortization/RejectTrans';

    let userDetails = this._GeneralService.getUserDetails();

    console.log('userDetails: ', userDetails);


    // let val =
    // {
    //   ListOprAmortizationScheduleDTO: this.getSelected,
    //   loginUserName: userDetails.userName,
    //   userId: userDetails.userId,
    //   listRejectionReasonDTO: result,
    //   loginUserId: userDetails.userId,
    // }

    let val =
    {
      ListOprAmortizationScheduleDTO: this.getSelected,
      LoginUserId: userDetails.userId,
      listRejectionReasonDTO: result,
    }

    this.loadPage = true;

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {
      
        this.actionLoaderUpdate = false;

        let getUserDetails = this._GeneralService.getUserDetails();
        console.log('getUserDetails token', getUserDetails)
        // this.load(getUserDetails);
        Swal('', data.responseMessage, 'success');
        this.loadPage = false;
        this.reloadLoad = 'Y'
        this.close();
      },
      (error: any) => {

       
        this.actionLoaderUpdate = false;
        this.loadPage = false;
        Swal('', error.error.message, 'error');
      });


  }

  approve(): void {
 
    Swal({

      title: '',
      text: 'Are you Sure you want to Approve this Armotization?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'Cancel'

    }).then((result) => {

      if (result.value) {

        this.loadPage = true;

        let url = 'AuthArmortization/Approve';

        let userDetails = this._GeneralService.getUserDetails();

        console.log('userDetails: ', userDetails);

        let val =
        {
          ListOprAmortizationScheduleDTO: this.getSelected,
          LoginUserId: userDetails.userId,
        }

        console.log('val approve: ', val);

        this._GeneralService.post(val, url).subscribe(
          (data: any) => {


            this.loadPage = false;
           // this.load();


            Swal('', data.responseMessage, 'success');
            this.reloadLoad = 'Y'
            this.close();
          },
          (error: any) => {

            this.loadPage = false;
            Swal('', error.error.responseMessage, 'error');
          });
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });


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





