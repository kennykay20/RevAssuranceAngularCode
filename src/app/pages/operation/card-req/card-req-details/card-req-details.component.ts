
import { GenModel } from './../../../../model/gen.model';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { GeneralService } from './../../../../services/genservice.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, 
          FormGroupDirective, NgForm } from '@angular/forms';
import { emailValidator } from '../../../../theme/utils/app-validators';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import {  WaitingDialog } from '../../../../services/services';
import {MatSnackBar} from '@angular/material';
import { LocalStorageService } from 'angular-2-local-storage';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ChargeForm } from '../../../../model/instrumentForms.model';


@Component({
  selector: 'app-card-req-details',
  templateUrl: './card-req-details.component.html',
  styleUrls: ['./card-req-details.component.scss']
})
export class CardReqDetailsComponent implements OnInit {
  
  public form: FormGroup;
  actionTaken = 'N';
  basicForm: FormGroup;
  basicFormSer: FormGroup;

  public settings: Settings;
  durationsnack = 3000;
  displayloader = false;
  lblProcess: any;
  selectedPrepCat: any;
  religionlist = [];

  stateList:any;
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

  statuses: any;

  
tab1 = 'active'
tab2 = ''
tab3 = ''
chargeSetupTem = [] = [];
//chargeSetup = [] = [];
chargeSetup: ChargeForm[];
chargeListTem: ChargeForm[];

selectedCalss = 'selected nav-item cursorPointer';
selectedCalss2 = 'selected nav-item cursorPointer';

notServiceChargeYet =  false;

serviceId = 1;
retryService = GenModel.retryService;
retryMessage: any;
RetryAttmMsg = GenModel.RetryAttmMsg;
apiIsDown = GenModel.apiIsDown;
retryDelayServiceInterval  = GenModel.retryDelayServiceInterval;

departments = [];
users = [];
acttypes = [];
btnConfirm  = GenModel.btnConfirm;


dismissedBy: any;
rejectedBy: any;

constructor(public appSettings: AppSettings, 
              public fb: FormBuilder,public fbSer: FormBuilder, public router: Router,
              public snackBar: MatSnackBar,
              public _waitingDialog: WaitingDialog,
              private _localStorageService: LocalStorageService,
              public _GeneralService: GeneralService,
              private http: HttpClient,
              private route: ActivatedRoute,
              private activatedRoute: ActivatedRoute,
              public dialogRef: MatDialogRef<CardReqDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, 
        )
        {
        //   let param4 = this.route.snapshot.params.mid;
        //   console.log('**data param4', param4);

        //   console.log('**data Details', data);

        //   let returnAss =  this._GeneralService.ReturnAssingned(param4);
        //   console.log('**data returnAss', returnAss);
        
        //  this.userFullName = this._GeneralService.ReturnUserDetails();
        // console.log('**data  this.userFullName',  this.userFullName);
   
      this.settings = this.appSettings.settings; 

      console.log('data details; ', data);
      this.chargeSetupTem =  this.data.chargeSetup;
     
      console.log('data chargeSetup for; ', this.chargeSetup);
    
      if(this.data.actionName === 'Add')
      {

        this.basicForm = this.fb.group({
              serviceId: this.serviceId,
              origDeptId: [null, Validators.compose([Validators.required])],
              referenceNo: null,
              branchNo: null,
              acctNo: [null, Validators.compose([Validators.required])],
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
              chgAcctNo: null,
              chgAcctType: null,
              chgAcctName: null,
              chgAvailBal: null,
              chgAcctCcy: null,
              chgAcctStatus: null,
              chargeCode: null,
              chargeRate: null,
              origChargeAmount: null,
              exchangeRate: null,
              equivChargeAmount: null,
              taxAcctNo: null,
              taxAcctType: null,
              chgNarration: null,
              taxRate: null,
              taxAmount: null,
              taxNarration: null,
              incomeBranch: null,
              incomeAcctNo: null,
              incomeAcctType: null,
              incomeAcctName: null,
              incomeAcctBalance: null,
              incomeAcctStatus: null,
              incomeAcctCcy: null,
              incomeAcctNarr: null,
              rsmId: null,
              status: null,
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

        
        });		 

          //Will later use this for the ones that has add function
          this.basicFormSer = this.fbSer.group({
                  serviceId: this.serviceId
          });

          this.loadPage = false;
      }
      else
      {
        this.ActionHeaderMsg = '';
        this.ActionDisplay = this.ActionViewHeaderMsg;

        this.basicForm = this.fb.group({
          
              itbid: [null],
              serviceId: [null],
              origDeptId: [null, Validators.compose([Validators.required])],
              referenceNo: null,
              branchNo: null,
              acctNo: [null, Validators.compose([Validators.required])],
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
              createdBy: new FormControl(null),
              dateCreated: null, 
              branchName: null,
              
        
        });	
        
      
   

       
        this.getById(data.record.itbId, data);



        console.log('basic form', this.basicForm.value);
        
        this.createdBy = data.createdBy


        this.basicFormSer = this.fbSer.group({
            itbId :  [null],
            serviceId: [null],
            serviceItbId		 :  [null],   
            chgAcctNo			 :  [null],
            chgAcctType			 :  [null],
            chgAcctName			 :  [null],
            chgAvailBal			 :  [null],
            chgAcctCcy			 :  [null],
            chgAcctStatus		 :  [null],
            chargeCode			 :  [null],
            chargeRate			 :  [null],
            origChgAmount		 :  [null],
            origChgCCy			 :  [null],
            exchangeRate		 :  [null],
            equivChgAmount		 :  [null],
            equivChgCcy			 :  [null],
            chgNarration		 :  [null],
            taxAcctNo			 :  [null],
            taxAcctType			 :  [null],
            taxRate				 :  [null],
            taxAmount			 :  [null],
            taxNarration		 :  [null],
            incBranch			 :  [null],
            incAcctNo			 :  [null],
            incAcctType			 :  [null],
            incAcctName			 :  [null],
            incAcctBalance		 :  [null],
            incAcctStatus		 :  [null],
            incAcctNarr			 :  [null],
            seqNo				 :  [null],
            status				 :  [null],
            dateCreated			 :  [null],
            transactionDate:  [null], 
            valueDate:  [null],
            branchName: null,


        });

       
      }
 }

  ngOnInit() 
  {
      this.loadPage = false;
      this.statuses = this._GeneralService.Statuses;

      this.loadDepartment();
      this.loadUsers();
      this.loadAcctTypes();
  }

  getById(id, rec): void {

    console.log('get by id param id: ', id);

    this.loadPage = true;

    let track = 0;
    let url = 'Cards/GetById';

      let val = {
        "oprCard": {
          "itbId": id
        }
      };
     
        console.log('card getById', val);

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

      this.loadPage = false;
      console.log('get by id res', data);

      this.basicForm.patchValue({
          
        itbid: data.get.itbId,
        serviceId:  data.get.serviceId,
        origDeptId: data.get.origDeptId,
        referenceNo: data.get.referenceNo,
        branchNo: data.get.branchNo,
        acctNo: data.get.acctNo,
        acctType: data.get.acctType,
        acctName: data.get.acctName,
        availBal:  data.get.availBal,
        acctSic:  data.get.acctSic,
        acctStatus:  data.get.acctStatus,
        ccyCode:  data.get.ccyCode,
        serialNo:  data.get.serialNo,
        wkfId:  data.get.wkfId,
        
        recordDate:   data.get.recordDate != null ? this._GeneralService.dateconvertion(data.get.recordDate): data.get.recordDate,
        serviceStatus:  data.get.serviceStatus,
        chgAcctNo:  data.get.chgAcctNo,
        chgAcctType:  data.get.chgAcctType,
        chgAcctName:  data.get.chgAcctName,
        chgAvailBal:  data.get.chgAvailBal,
        chgAcctCcy:  data.get.chgAcctCcy,
        chgAcctStatus:  data.get.chgAcctStatus,
        chargeCode:  data.get.chargeCode,
        chargeRate:  data.get.chargeRate,
        origChargeAmount:  data.get.origChargeAmount,
        exchangeRate:  data.get.exchangeRate,
        equivChargeAmount:  data.get.equivChargeAmount,
        taxAcctNo:  data.get.taxAcctNo,
        taxAcctType:  data.get.taxAcctType,
        chgNarration:  data.get.chgNarration,
        taxRate:  data.get.taxRate,
        taxAmount:  data.get.taxAmount,
        taxNarration:  data.get.taxNarration,
        incomeBranch:  data.get.incomeBranch,
        incomeAcctNo:  data.get.incomeAcctNo,
        incomeAcctType:  data.get.incomeAcctType,
        incomeAcctName:  data.get.incomeAcctName,
        incomeAcctBalance:  data.get.incomeAcctBalance,
        incomeAcctStatus:  data.get.incomeAcctStatus,
        incomeAcctCcy:  data.get.incomeAcctCcy,
        incomeAcctNarr:  data.get.incomeAcctNarr,
        rsmId:  data.get.rsmId,
        status:  data.get.status,
        originatingBranchId:  data.get.originatingBranchId,
        processingDeptId:  data.get.processingDeptId,
        transactionDate:  data.get.transactionDate != null ? this._GeneralService.dateconvertion(data.get.transactionDate): data.get.transactionDate,
        valueDate:   data.get.valueDate != null ? this._GeneralService.dateconvertion(data.get.valueDate): data.get.valueDate,
        userId : data.get.userId,
        valAcctError:  data.get.valAcctError,
        errorCode:  data.get.errorCode,
        errorMsg:  data.get.errorMsg,
        dismissedBy:  data.get.acctNo,
        dismissedDate:  data.get.dismissedDate,
        rejected:  data.get.acctNo,
        rejectionIds:  data.get.acctNo,
        rejectionDate:  data.get.acctNo,
        rejectedBy:  data.get.acctNo,
        createdBy: data.allUsers.createdBy,
        dateCreated: data.get.dateCreated != null ? this._GeneralService.dateCreated(data.get.dateCreated) : data.get.dateCreated,
      //  branchName: data.record.branchName,
      });
      


      this.createdBy= data.allUsers.createdBy;
      this.dismissedBy= data.allUsers.dismissedBy;
      this.rejectedBy = data.allUsers.rejectedBy;

     
      if(data.getSer.length === 0){
        console.log('this.chargeSetup 1111',);
        this.chargeSetup = data.chargeSetUp
        this.notServiceChargeYet = true;
      }
      else
      {
        console.log('this.chargeSetup 2222',);
        this.chargeSetup = data.getSer;
      }
      
      console.log('this.chargeSetup after getting Details', this.chargeSetup);

      for (let i = 0; i < this.chargeSetup.length; i++) 
      {

        this.basicFormSer.patchValue({
    
          itbId :   this.chargeSetup[i].itbId,
          serviceId: this.chargeSetup[i].serviceId,
          serviceItbId	:	 this.chargeSetup[i].serviceItbId,  
          chgAcctNo			 :    this.chargeSetup[i].chgAcctNo,
          chgAcctType			 :  this.chargeSetup[i].chgAcctType,
          chgAcctName			 :  this.chargeSetup[i].chgAcctName,
          chgAvailBal			 :  this.chargeSetup[i].chgAvailBal != null ? this._GeneralService.convertToMoney(this.chargeSetup[i].chgAvailBal) : this.chargeSetup[i].chgAvailBal,
          chgAcctCcy			 :  this.chargeSetup[i].chgAcctCcy,
          chgAcctStatus		 :  this.chargeSetup[i].chgAcctStatus,
          chargeCode			 :  this.chargeSetup[i].chargeCode,
          chargeRate			 :  this.chargeSetup[i].chargeRate,
          origChgAmount		 :  this.chargeSetup[i].origChgAmount != null ? this._GeneralService.convertToMoney(this.chargeSetup[i].origChgAmount) : this.chargeSetup[i].origChgAmount,
          origChgCCy			 :  this.chargeSetup[i].origChgCCy,
          exchangeRate		 :  this.chargeSetup[i].exchangeRate,
          equivChgAmount		 :  this.chargeSetup[i].equivChgAmount != null ? this._GeneralService.convertToMoney(this.chargeSetup[i].equivChgAmount) : this.chargeSetup[i].equivChgAmount,
          equivChgCcy			 :  this.chargeSetup[i].equivChgCcy,
          chgNarration		 :  this.chargeSetup[i].chgNarration,
          taxAcctNo			 :  this.chargeSetup[i].taxAcctNo,
          taxAcctType			 :  this.chargeSetup[i].taxAcctType,
          taxRate				 :  this.chargeSetup[i].taxRate,
          taxAmount			 :  this.chargeSetup[i].taxAmount != null ? this._GeneralService.convertToMoney(this.chargeSetup[i].taxAmount) : this.chargeSetup[i].taxAmount,
          taxNarration		 :  this.chargeSetup[i].taxNarration,
          incBranch			 :  this.chargeSetup[i].incBranch,
          incAcctNo			 :  this.chargeSetup[i].incAcctNo,
          incAcctType			 :  this.chargeSetup[i].incAcctType,
          incAcctName			 :  this.chargeSetup[i].incAcctName,
          incAcctBalance		 :  this.chargeSetup[i].incAcctBalance,
          incAcctStatus		 :  this.chargeSetup[i].incAcctStatus,
          incAcctNarr			 :  this.chargeSetup[i].incAcctNarr,
          seqNo				 :  this.chargeSetup[i].seqNo,
          status				 :  this.chargeSetup[i].status,
          dateCreated			 :  this.chargeSetup[i].dateCreated,
         // transactionDate:  record.record.transactionDate != null ? this._GeneralService.dateconvertion(record.record.transactionDate): record.record.transactionDate,
         // valueDate:   record.record.valueDate != null ? this._GeneralService.dateconvertion(record.record.valueDate): record.record.valueDate,
         
          });
        
      }

      console.log('get by id res this.basicForm.value',  this.basicForm.value);

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

  private handleError(error: HttpErrorResponse) {
   
    console.log('handleError: ', error);

   if (error.error instanceof ErrorEvent) {
   // A client-side or network error occurred. Handle it accordingly.
   console.error('An error occurred:', error.error.message);
   } else {
   // The backend returned an unsuccessful response code.
   // The response body may contain clues as to what went wrong,
   console.error(
   `Backend returned code ${error.status}, ` +
   `body was: ${error.error}`);
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

        console.log('token param load', val);

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
  
      
      this.departments = data;
        
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

    this.users = data;

      
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

    this.acttypes = data;

      
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
  check(){
    
  }



  add(values: Object): void {

    this.actionLoaderSave = true;
    let element = <HTMLInputElement> document.getElementById("btnSave");
    element.disabled = true;
 
    if (this.basicForm.valid) 
    {

      this.basicForm.value.userId  = this._GeneralService.getUserId();

  
      let url = 'BankServiceSetup/Add';


      this._GeneralService.homePage(this.basicForm.value, url).subscribe(
        (data: any) => 
        {
        
          this.actionTaken = 'Y';
          element.disabled = false;
          this.basicForm.reset();

          this.actionLoaderSave = false;
          this.reloadLoad= 'Y'; 

          Swal('', data.sErrorText, 'success');
            
        },
        (error: any) => 
        {
         
          this.actionLoaderSave = false;
          element.disabled = true;

          Swal('', this.errorOccur, 'error');

      });


    }
    else 
    {
      element.disabled = true;
     // Swal('Note:', 'Kindly Fill your Credential!', 'error');
    }
  }

  update(): void {

    console.log('update chargeSetup: ', this.chargeSetup);

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement> document.getElementById("btnUpdate");

    element.disabled = true;
      let url = 'Token/Update';
      let values = {

           oprToken: this.basicForm.value,
           listoprServiceCharge: this.chargeSetup
      }

      
      console.log('update values: ', this.chargeSetup);

      this._GeneralService.post(values, url).subscribe(
        (data: any) => 
        {

       

          this.actionTaken = 'Y';
          element.disabled = false;
          this.actionLoaderUpdate =  false;
           this.reloadLoad= 'Y'; 
       
          Swal('', data.sErrorText, 'success');
        },
        (error: any) => {
          
          element.disabled = false;
          this.actionLoaderUpdate =  false;
       
          Swal('', error.error.message, 'error');
      });

    
  }


  processTrans(): void {

   //console.log('processTrans chargeSetup: ', this.chargeSetup);

    console.log('this.basicform itbid Process: ' , this.basicForm.value.itbid);
   // console.log('this.basicFormSer: ' , this.basicFormSer.value);

    if(this.basicFormSer.value.chgAcctNo === undefined){

      Swal('', 'Charge details is required', 'error');
      return;
    }

    this.actionLoaderUpdate = true;

    let element = <HTMLInputElement> document.getElementById("btnProcess");
    
    element.disabled = true;
  
  
    let url = 'Cards/Process';
  
    let userDetails = this._GeneralService.getUserDetails();
  
    console.log('userDetails: ', userDetails);

    this.chargeListTem.push({

       // itbId: this.basicFormSer.value.ii,
        itbId: 0,
        serviceId: this.serviceId,
        serviceItbId: 0 ,
        chgAcctNo: this.basicFormSer.value.chgAcctNo,
        chgAcctType: this.basicFormSer.value.chgAcctType,
        chgAcctName: this.basicFormSer.value.chgAcctName,
        chgAvailBal: this.basicFormSer.value.chgAvailBal,
        chgAcctCcy: this.basicFormSer.value.chgAcctCcy,
        chgAcctStatus: this.basicFormSer.value.chgAcctStatus,
        chargeCode: this.basicFormSer.value.chargeCode,
        chargeRate: this.basicFormSer.value.chargeRate,
        origChgAmount: this.basicFormSer.value.origChgAmount,
        origChgCCy: this.basicFormSer.value.origChgCCy,
        exchangeRate: this.basicFormSer.value.exchangeRate,
        equivChgAmount: this.basicFormSer.value.equivChgAmount,
        equivChgCcy: this.basicFormSer.value.equivChgCcy,
        chgNarration: this.basicFormSer.value.chgNarration,
        taxAcctNo: null,// this.basicFormSer.value.ii,
        taxAcctType: null,// this.basicFormSer.value.ii,
        taxRate: this.basicFormSer.value.taxRate,
        taxAmount: this.basicFormSer.value.taxAmount,
        taxNarration: this.basicFormSer.value.taxNarration,
        incBranch: this.basicFormSer.value.incBranch,
        incAcctNo: this.basicFormSer.value.incAcctNo,
        incAcctType: this.basicFormSer.value.incAcctType,
        incAcctName: this.basicFormSer.value.incAcctName,
        incAcctBalance: this.basicFormSer.value.incAcctBalance,
        incAcctStatus: this.basicFormSer.value.incAcctStatus,
        incAcctNarr: this.basicFormSer.value.incAcctNarr,
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

    this.chargeSetup = this.chargeListTem;


//     BranchNo
// OrigDeptId
// ItbId

    let OprCardVal = {
         ItbId:  this.basicForm.value.itbid,
         ServiceId: this.serviceId,
         OrigDeptId: this.basicForm.value.processingDeptId,
         ReferenceNo: null,
         BranchNo: 1, // this.basicForm.value.branchNo, hard coded
         AcctNo: this.basicForm.value.acctNo,
         AcctType: this.basicForm.value.acctType,
         AcctName: this.basicForm.value.acctName,
         AvailBal: this.basicForm.value.availBal,
        // AcctSic: this.basicForm.value.ii,
         AcctStatus: this.basicForm.value.acctStatus,
         CcyCode: this.basicForm.value.ccyCode,
         SerialNo: this.basicForm.value.serialNo,
        // TransId: this.basicForm.value.ii,
       //  WkfId: this.basicForm.value.ii,
       //  RecordDate: this.basicForm.value.ii,
        // ServiceStatus: this.basicForm.value.ii,
         RsmId: this.basicForm.value.rsmId,
        // Status: this.basicForm.value.ii,
        // OriginatingBranchId: this.basicForm.value.ii,
         ProcessingDeptId: this.basicForm.value.processingDeptId,
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
      OprCard: OprCardVal,// ,
      serviceId: this.serviceId,
      loginUserName: userDetails.userName,
      deptId: userDetails.deptId,
      userId: userDetails.userId,
      ListoprServiceCharge : this.chargeSetup,
    }

    console.log('values for process: ', val);
  
      this._GeneralService.post(val, url).subscribe(
        (data: any) => 
        {
          element.disabled = false;
          this.actionLoaderUpdate =  false;
          this.actionTaken = 'Y';
          Swal('', data.sErrorText, 'success');
        },
        (error: any) => {
          
          element.disabled = false;
          this.actionLoaderUpdate =  false;
       
          Swal('', error.error.message, 'error');
      });
  
    
  }
  
  dismissTrans(): void {
  
      Swal({
        title: '',
        text: 'Are you sure you want Dismiss this Request? ' ,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'YES',
        confirmButtonColor: this.btnConfirm,
        cancelButtonText: 'NO',
        allowEscapeKey : false,
        allowOutsideClick: false
      }).then((result) => {
        if (result.value) 
        {
  
    this.actionLoaderDismiss = true;
    let element = <HTMLInputElement> document.getElementById("btnDismiss");
    
    element.disabled = true;
 
    let url = 'Token/Dismiss';
  
    let userDetails = this._GeneralService.getUserDetails();
  
    console.log('userDetails: ', userDetails);
  
  
    let oprTokenVal = {
      ItbId: 1,// this.basicForm.value.itbid, hard coded
      ServiceId: this.serviceId,
      OrigDeptId: this.basicForm.value.processingDeptId,
      ReferenceNo: null,
      BranchNo: 1, // this.basicForm.value.branchNo, hard coded
      AcctNo: this.basicForm.value.acctNo,
      AcctType: this.basicForm.value.acctType,
      AcctName: this.basicForm.value.acctName,
      AvailBal: this.basicForm.value.availBal,
     // AcctSic: this.basicForm.value.ii,
      AcctStatus: this.basicForm.value.acctStatus,
      CcyCode: this.basicForm.value.ccyCode,
      SerialNo: this.basicForm.value.serialNo,
     // TransId: this.basicForm.value.ii,
    //  WkfId: this.basicForm.value.ii,
    //  RecordDate: this.basicForm.value.ii,
     // ServiceStatus: this.basicForm.value.ii,
      RsmId: this.basicForm.value.rsmId,
     // Status: this.basicForm.value.ii,
     // OriginatingBranchId: this.basicForm.value.ii,
      ProcessingDeptId: this.basicForm.value.processingDeptId,
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
   ListoprServiceCharge : this.chargeSetup,
 }
  
      this._GeneralService.post(val, url).subscribe(
        (data: any) => 
        {
          element.disabled = false;
          this.actionLoaderDismiss =  false;
          this.actionTaken = 'Y';
          Swal('', data.sErrorText, 'success');
        },
        (error: any) => {
          
          element.disabled = false;
          this.actionLoaderDismiss =  false;
       
          Swal('', error.error.message, 'error');
      });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
  
        }
      });
  }
  


  keyPress(event: any) {

    console.log('keyPress', this.basicForm.value.acctNo);
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  validateAcct(event)
  {

    let userDetails = this._GeneralService.getUserDetails();

   // console.log('userDetails: ', userDetails);

   let instrumentForm = this.basicForm.value;
   let chgForm = this.basicFormSer.value;

    let values =  {  

              acctNo :   event.target.value,
              acctType : this.basicForm.value.acctType,
              transAmout: '0',
              ListoprServiceCharge : this.chargeSetup,
              loginUserName: userDetails.userName,
              deptId: userDetails.deptId,
              userId: userDetails.userId,
              serviceId: this.serviceId
    }


        this.loadPage = true;

        let url = 'Token/CalCulateCharge';

        this._GeneralService.post(values, url).subscribe(
          (data: any) => 
          {
              console.log('Cal Charges: ', data);

             
              this.basicForm.patchValue({
          
                itbid: null,
                serviceId:  null,
                origDeptId: null,
                referenceNo: null,
                branchNo: data.instrumentAcctDetails.nBranch,
                acctType: data.instrumentAcctDetails.sAccountType,  //
                acctName: data.instrumentAcctDetails.sName,
                availBal:  data.instrumentAcctDetails.nBalanceDec,
                availBalString:  data.instrumentAcctDetails.nBalance,
                acctSic:  data.instrumentAcctDetails.sSector,
                acctStatus:  data.instrumentAcctDetails.sStatus,
                ccyCode:  data.instrumentAcctDetails.sCrncyIso,
                serialNo:  instrumentForm.serialNo,
                rsmId:  data.instrumentAcctDetails.sRsmId,
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
                branchName: data.instrumentAcctDetails.sBranchName,
              });	

            //  this.chargeSetup = [] || [];

            //  this.chargeSetup = data.chgList

             // console.log('Val this.chargeSetup: ', this.chargeSetup);

             // console.log('this.chargeSetup after nulify', this.chargeSetup);
            
              for (let i = 0; i < data.chgList.length; i++) 
              {
                this.basicFormSer.patchValue({
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
                //  transactionDate:  data.chgList[i].select, 
                 // valueDate:  data.chgList[i].select,       
                });



                 
                
             
             
             
             
              }

              this.loadPage = false;

              if(data.instrumentAcctDetails.nErrorCode !== 0)
              {
                console.log('instrumentForm: ' , instrumentForm);
                console.log('chgForm: ' , chgForm);
                
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

  validateAcctChg(event)
  {
   // console.log('validateAcct event', event);

   // console.log('validateAcct target', event.target.value);

    let userDetails = this._GeneralService.getUserDetails();

   // console.log('userDetails: ', userDetails);

   let instrumentForm = this.basicForm.value;
   let chgForm = this.basicFormSer.value;



    let values =  {  

              acctNo :   this.basicForm.value.acctNo,
              acctType : this.basicForm.value.acctType,
              transAmout: '0',
              ListoprServiceCharge : this.chargeSetup,
              loginUserName: userDetails.userName,
              deptId: userDetails.deptId,
              userId: userDetails.userId,
              serviceId: this.serviceId
    }

  //  console.log('validateAcct values', values);
        this.loadPage = true;

        let url = 'Token/CalCulateCharge';

        this._GeneralService.post(values, url).subscribe(
          (data: any) => 
          {
              console.log('Cal Charges: ', data);

             

            

              this.basicForm.patchValue({
          
                itbid: instrumentForm.itbid,
                serviceId:  null,
                origDeptId: null,
                referenceNo: null,
                branchNo: data.instrumentAcctDetails.nBranch,
                acctType: data.instrumentAcctDetails.sAccountType,  //
                acctName: data.instrumentAcctDetails.sName,
                availBal:  data.instrumentAcctDetails.nBalanceDec,
                availBalString:  data.instrumentAcctDetails.nBalance,
                acctSic:  data.instrumentAcctDetails.sSector,
                acctStatus:  data.instrumentAcctDetails.sStatus,
                ccyCode:  data.instrumentAcctDetails.sCrncyIso,
                serialNo:  instrumentForm.serialNo,
                rsmId:  data.instrumentAcctDetails.sRsmId,
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
                branchName: data.instrumentAcctDetails.sBranchName,
              });	

              for (let i = 0; i < data.chgList.length; i++) 
              {

                this.basicFormSer.patchValue({
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
                //  transactionDate:  data.chgList[i].select, 
                 // valueDate:  data.chgList[i].select,       
                });
              }

              console.log('this.basicform: ' , this.basicForm.value);
              console.log('this.basicFormSer: ' , this.basicFormSer.value);

              this.loadPage = false;

              if(data.instrumentAcctDetails.nErrorCode !== 0)
              {
                console.log('instrumentForm: ' , instrumentForm);
                console.log('chgForm: ' , chgForm);
                
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

  chgChargeCalculate(event)
  {
   // console.log('validateAcct event', event);

   // console.log('validateAcct target', event.target.value);

    let userDetails = this._GeneralService.getUserDetails();

   // console.log('userDetails: ', userDetails);

   let instrumentForm = this.basicForm.value;
   let chgForm = this.basicFormSer.value;

   let chrgeList = [
     {
      ChgAcctNo: event.target.value,
      ChgAcctType : null,
      // ChgAcctName : ,
      // ChgAvailBal: ,
      // ChgAcctCcy : ,
      ChargeCode : this.basicFormSer.value.chargeCode,
     }
   ]



    let values =  {  

              acctNo :   this.basicForm.value.acctNo,
              acctType : this.basicForm.value.acctType,
              transAmout: '0',
              ListoprServiceCharge : chrgeList , //this.chargeSetup,
              loginUserName: userDetails.userName,
              deptId: userDetails.deptId,
              userId: userDetails.userId,
              serviceId: this.serviceId
    }

        this.loadPage = true;

        let url = 'Cards/CalCulateCharge';

        console.log('CalCulateCharge values: ', values);

       

        this._GeneralService.post(values, url).subscribe(
          (data: any) => 
          {
              console.log('Cal Charges: ', data);

              this.basicForm.patchValue({
          
                itbid: instrumentForm.itbid,
                serviceId:  null,
                origDeptId: null,
                referenceNo: null,
                branchNo: data.instrumentAcctDetails.nBranch,
                acctType: data.instrumentAcctDetails.sAccountType,  //
                acctName: data.instrumentAcctDetails.sName,
                availBal:  data.instrumentAcctDetails.nBalanceDec,
                availBalString:  data.instrumentAcctDetails.nBalance,
                acctSic:  data.instrumentAcctDetails.sSector,
                acctStatus:  data.instrumentAcctDetails.sStatus,
                ccyCode:  data.instrumentAcctDetails.sCrncyIso,
                serialNo:  instrumentForm.serialNo,
                rsmId:  data.instrumentAcctDetails.sRsmId,
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
                branchName: data.instrumentAcctDetails.sBranchName,
              });	

              for (let i = 0; i < data.chgList.length; i++) 
              {

                this.basicFormSer.patchValue({
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
                });
              }

              console.log('this.basicform after Cal: ' , this.basicForm.value);
              console.log('this.basicFormSer: ' , this.basicFormSer.value);

              this.loadPage = false;

              if(data.instrumentAcctDetails.nErrorCode !== 0)
              {
                console.log('instrumentForm: ' , instrumentForm);
                console.log('chgForm: ' , chgForm);
                
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

  returnForm(intrumentForm, chgForm){

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

  ngAfterViewInit()  
  {
    this.settings.loadingSpinner = false; 
  }

  close(): void 
  {

    this.dialogRef.close(this.actionTaken);
  }

  
  swapTab(value){
    console.log('swapTab: ', value);

    
    if(value === 1){
      this.tab1 = 'active';
      this.tab2 = '';
      this.tab3 = '';
    }
    if(value === 2){
      this.tab1 = '';
      this.tab2 =  'active';
      this.tab3 = '';
    }

    if(value === 3){
      this.tab1 = '';
      this.tab2 = '';
      this.tab3 =  'active';
    }

    
    
    this.tabVlues = value;
  }

  calCharges()
  {

    let values = {

    }
    let url = 'Token/CalCulateCharge';

    this._GeneralService.post(values, url).subscribe(
      (data: any) => 
      {
       console.log('Cal Charges', data)
     
        Swal('', data.sErrorText, 'success');
      },
      (error: any) => {
        
       
     
        Swal('', error.error.message, 'error');
    });

  }

}




