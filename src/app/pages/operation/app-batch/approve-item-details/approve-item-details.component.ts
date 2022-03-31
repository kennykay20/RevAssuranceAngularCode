 
import { List } from 'linqts';
// import { GenModel } from './../../../../../../model/gen.model';
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
import { AdmTransactionConfiguration } from '../../../../model/admTransactionConfiguration.model';
import { GenModel } from '../../../../model/gen.model';
import { CbsTransaction } from '../../../../model/cbsTransaction.model';

@Component({
  selector: 'app-approve-item-details',
  templateUrl: './approve-item-details.component.html',
  styleUrls: ['./approve-item-details.component.scss']
})

export class ApproveItemDetailsComponent  implements OnInit {
  
  cbsTransaction: CbsTransaction;
  admTransactionConfiguration: AdmTransactionConfiguration;
  acctTypeRetain = true;
  amountRetain = true;
  narrationRetain = true;
  tranCodeRetain = true;

  chargeThisAcct = false;
  
  DrOrCr = ['DR', 'CR'];
  transCode = ['101','117', '152', '157','161','500', '550' ]
  accountValidation: AccountValidation;
  period = [] = [ "DAY(S)", "MONTH(S)" , "YEAR(S)",]
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
  CollateralTypes: CollateralType [];
  templateTypes = [];
  reqReason = [];
  stateList:any;
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

notServiceChargeYet =  false;

serviceId: number;
retryService = GenModel.retryService;
retryMessage: any;
RetryAttmMsg = GenModel.RetryAttmMsg;
apiIsDown = GenModel.apiIsDown;
retryDelayServiceInterval  = GenModel.retryDelayServiceInterval;

departments = [];
users = [];
acttypes = [];
btnConfirm  = GenModel.btnConfirm;
chequeProduct: ChequeProduct;

dismissedBy: any;
rejectedBy: any;
instrumentForm: BatchItem;
rows: BatchItem[];
temp: BatchItem[];
serviceName:any;
chargeFormList: ChargeForm[];
chargeFormListTemporal: ChargeForm[];

admService: admService;
templateContent: any;
action: Action

batchStatus = ['Loaded', 'Close']

keepItem: any[];

batchNo: any;
narration = '';

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
              public dialogRef: MatDialogRef<ApproveItemDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog, 
        )
      {

        this.userDetails = this._GeneralService.getUserDetails();
        this.settings = this.appSettings.settings; 
       // this.resetChqProduct();
       // this.resetAction(data);

        console.log('data details upload item; ', data);
       
        this.chargeFormList =  data.chargeSetup;

        console.log('this.chargeFormList load; ', this.chargeFormList);

      this.serviceId = data.serviceId;

      if(this.data.actionName === 'Add')
      {

        this.batchNo = data.record.batchNo
         this.narration = data.record.defaultNar

         console.log('data details this.batchNo**: ', this.batchNo);
         console.log('data details this.narration**: ', this.narration);
        
          this.reformInstrumentForm();
          this.resetCharge();
          this.loadPage = false;
          let getOnyly  = new List<any>(this.chargeFormList).Where(c=> c.serviceId === data.serviceId).ToArray();
          console.log('getOnyly', getOnyly);

          this.chargeFormList =  getOnyly;
          console.log('getOnyly 22', this.chargeFormList);
          for(let i = 0; i <= this.chargeFormList.length; i++){
            if(this.chargeFormList[i] !== undefined )
            {
              this.chargeFormList[i].transactionDate = this.userDetails.bankingDate;
              this.chargeFormList[i].valueDate = this.userDetails.bankingDate;
            }
         }

         this.chargeFormListTemporal = this.chargeFormList; 
         console.log('data details item added2222; ', data);
         
         
         
        
      }
      else
      {
        
        this.ActionHeaderMsg = '';
        this.ActionDisplay = this.ActionViewHeaderMsg;
        this.batchNo = data.record.record.batchNo
        this.narration =  this.data.record.record.defaultNar;
        this.getById(data);
      }
 }

 resetAction(data)
{
  this.action = {
    actionName : data.actionName
  }

  console.log('data resetAction this.action; ', this.action);
}
 reformInstrumentForm() {

     let hhh = new BatchItem();
  
    this.instrumentForm =  hhh;

    this.instrumentForm.serviceId = this.serviceId;
    this.instrumentForm.branchNo = this.userDetails.branchNo, 
    this.instrumentForm.serviceId = this.serviceId;
    this.instrumentForm.narration	 = this.narration;
    this.instrumentForm.transactionDate	=  this.userDetails.bankingDate
    this.instrumentForm.valueDate			=this.userDetails.bankingDate
    this.instrumentForm.deptId				= this.userDetails.deptId
    this.instrumentForm.processingDept		 =this.userDetails.deptId 
    this.instrumentForm.originatingBranchId = this.userDetails.branchNo, 
    /*{
      itbId				: 0, 
      batchNo				: 0, 		: 
      acctNo				: null, 
      acctType			: null, 
      acctName			: null, 
      acctBalance			: null, 
      acctStatus			: null, 
      cbsTC				: null, 
      chequeNo			: null, 
      ccyCode				: null, 
      amount				: null, 
      drCr				: null, 
      chargeCode			: null, 
      chargeAmount		: null, 
      chgNarration		: null, 
      taxAcctNo			: null, 
      taxAcctType			: null, 
      taxRate				: null, 
      taxAmount			: null, 
      taxNarration		: null, 
      incBranch			: null, 
      incAcctNo			: null, 
      incAcctType			: null, 
      incAcctName			: null, 
      incAcctBalance		: null, 
      incAcctStatus		: null, 
      incAcctNarr			: null, 
      classCode			: null, 
      openingDate			: null, 
      indusSector			: null, 
      custType			: null, 
      custNo				: null, 
      rsmId				: null, 
      cashBalance			: null, 
      cashAmt				: null, 
      city				: null, 
      valUserId			: null, 
      valErrorCode		: null, 
      valErrorMsg			: null, 
     
      dateCreated			: null, 
      serviceStatus		: null, 
      status				: null, 
     
      batchSeqNo			: null, 
      userId				: null, 
      supervisorId		: null, 
      direction			: null, 
      
      dismissedBy			: null, 
      dismissedDate		: null, 
      rejected			: null, 
      rejectionIds		: null, 
      rejectionDate		: null,
      ReferenceNo: null


    };
   */
    console.log('new', this.instrumentForm);
 }

 resetChqProduct()
{
  this.chequeProduct = {
    itbId: 0,
    chqProductCode : null,
    chqProductDescr :null,
    userId :null,
    dateCreated :null,
    status :null,
    vendorId :null,
    productId :null,
    noOfChqPerUnit :null,
    unit : null,
  }
}


 resetCharge()
 {

  this.chargeFormList.push({
    
    itbId: 0,
    serviceId : 0,
    serviceItbId: 0 ,
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
    incBranch:  null,
    incAcctNo:  null,
    incAcctType:  null,
    incAcctName:  null,
    incAcctBalance:  null,
    incAcctStatus:  null,
    incAcctNarr:  null,
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

 resetChargeAfterAdd()
 {
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

  ngOnInit() 
  {
      this.loadPage = false;
      this.statuses = this._GeneralService.Statuses;

      this.loadDepartment();
      this.loadUsers();
      this.loadAcctTypes();
      this.loadCollateralTypes();
  }



getById(record): void {
    
    console.log('getById record', record);
  //  console.log('getById itbid Item', record.record.record.batchNo);
    console.log('getById itbid itemdetails1', record.itemdetails.itbId); 
    this.loadPage = true;

    let track = 0;
    let url = 'BatchControl/GetByIdItem';

      let val = {
        batchItems: {
          itbId:  record.itemdetails.itbId
        },
        serviceId: this.serviceId
      };


  this._GeneralService.post(val, url)
  .subscribe(
    (data: any) => 
    {

      console.log('get batch items', data);
     
      this.loadPage = false;


      this.instrumentForm = data.instrumentDetails;


      this.instrumentForm.amount = this.instrumentForm.amount != null ? this._GeneralService.formatMoney(this.instrumentForm.amount) : this.instrumentForm.amount;
      this.instrumentForm.dateCreated = this.instrumentForm.dateCreated != null ? this._GeneralService.dateCreated(this.instrumentForm.dateCreated) : this.instrumentForm.dateCreated;
      this.instrumentForm.transactionDate = this.instrumentForm.transactionDate != null ? this._GeneralService.dateconvertion(this.instrumentForm.transactionDate) : this.instrumentForm.transactionDate;
      this.instrumentForm.valueDate = this.instrumentForm.valueDate != null ? this._GeneralService.dateconvertion(this.instrumentForm.valueDate) : this.instrumentForm.valueDate;
      
      this.cbsTransaction = data.cbs;

      this.instrumentForm.postingErrorCode = this.cbsTransaction.postingErrorCode;
      this.instrumentForm.postingErrorDescr = this.cbsTransaction.postingErrorDescr;

      console.log('this.cbsTransaction.postingErrorDescr: ', this.cbsTransaction.postingErrorDescr);
      
      

     if(data.serviceChargeslist != null)
     {
       this.chargeThisAcct = true;
       this.chargeFormList = data.serviceChargeslist;
     }
      
  
     
        if(data.allUsers != undefined)
        {
          this.createdBy = data.allUsers.createdBy;
          this.dismissedBy= data.allUsers.dismissedBy;
          this.rejectedBy = data.allUsers.rejectedBy;
        }
    },
    (error: any) => 
    {
     // alert(2)
      console.log('getById: ' ,error.error);
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

    this.users = data._response;

      
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
    console.log('this.acttypes: ', this.acttypes);
      
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
loadCollateralTypes(): void { 

  this.loadPage = true;
  let track = 0;
  let url = 'AdmGetAll/GetAll';


this._GeneralService.post(null, url)
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
  (error: any) => 
  {
    if(track === this.retryService)
    {
     // Swal('', this.apiIsDown, 'error');
    }
    else
    {
     // Swal('', this.errorOccur, 'error');

    }
});
}

  add(values: Object): void {
  let  valAcct ;

     if(this.instrumentForm.acctNo == null)
    {
       swal('', 'Kindly Supply Acct Number','error');
       return;
    }

    if(this.instrumentForm.cbsTC == null)
    {
       swal('', 'Select Trans Code','error');
       return;
    }

    if(this.instrumentForm.drCr == null)
    {
       swal('', 'Select DR/CR','error');
       return;
    }

    this.actionLoaderSave = true;
    let element = <HTMLInputElement> document.getElementById("btnSaveItem");
    element.disabled = true;

    // this.instrumentForm.userId  = this.userDetails.userId;
    // this.instrumentForm.originatingBranchId = this.userDetails.branchNo;
    // this.instrumentForm.transactionDate =  this.userDetails.bankingDate;
    // this.instrumentForm.valueDate =  this.userDetails.bankingDate;

   // this.instrumentForm.itbId = 0;
     let tem = this.instrumentForm;
      let val = 
      { 
            BatchItemsTemp: this.instrumentForm,
            loginUserId: this.userDetails.userId,
            serviceId : this.serviceId,
            transactionDate: this.userDetails.bankingDate,
            ValueDate: this.userDetails.bankingDate,
            LoginUserName: this.userDetails.userName,
            BatchNo: this.batchNo,
            ChargeThisAcct: this.chargeThisAcct,
            ListoprServiceCharge: this.chargeFormList
      }

      console.log('val to add: ', val);

      let url = 'BatchControlFileUpload/AddBatchItem';

      this._GeneralService.post(val, url).subscribe(
        (data: any) => {
        
          console.log('After save Item Add: ', data);
          this.reformInstrumentForm();
          this.resetChargeAfterAdd();

          element.disabled = false;
         
          this.templateContent = null;
          this.actionLoaderSave = false;
          this.reloadLoad= 'Y'; 
         // this.data.actionName = 'Edit';

        //  this.rows = data.getAll;

        this.retaiNChk(tem);

          Swal('', data.responseMessage, 'success');
            
        },
        (error: any) => 
        {
          console.log(' error.error',  error.error);
          this.actionLoaderSave = false;
          element.disabled = false;
          Swal('', error.error.responseMessage, 'error');
      });
  }

  update(): void {

    let valAcct;

    if(this.instrumentForm.acctNo == null)
    {
       swal('', 'Kindly Supply Acct Number','error');
       return;
    }

    if(this.instrumentForm.cbsTC == null)
    {
       swal('', 'Select Trans Code','error');
       return;
    }

    if(this.instrumentForm.drCr == null)
    {
       swal('', 'Select DR/CR','error');
       return;
    }


    console.log('update chargeFormList: ', this.chargeFormList);

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement> document.getElementById("btnUpdateItem");

    element.disabled = true;
      let url = 'BatchControlFileUpload/UpdateBatchItem';
      

      let val = 
      { 
            BatchItemsTemp: this.instrumentForm,
            loginUserId: this.userDetails.userId,
            serviceId : this.serviceId,
            transactionDate: this.userDetails.bankingDate,
            ValueDate: this.userDetails.bankingDate,
            LoginUserName: this.userDetails.userName,
            BatchNo: this.data.record.record.batchNo,
            ChargeThisAcct: this.chargeThisAcct,
            ListoprServiceCharge: this.chargeFormList
      }

      console.log('update values: ', val);

      this._GeneralService.post(val, url).subscribe(
        (data: any) => 
        {
          console.log('Update data:', data)
          this.actionTaken = 'Y';
          element.disabled = false;
          this.actionLoaderUpdate =  false;
          this.reloadLoad= 'Y'; 

          this.apiResponse = data;

          Swal('',  this.apiResponse.responseMessage, 'success');
          
        },
        (error: any) => {
          
          element.disabled = false;
          this.actionLoaderUpdate =  false;
       
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
  
  trigerAfterAmt(event)
  {
    console.log('trigerAfterAmt');
    
  }


  chqAmt(event)
  {
     console.log('validateAcct', event.target.value);
 

  }
 

  resetChage(data){
    this.chargeFormListTemporal = data; 
  }




  formatAmount(event){
  //  this.instrumentForm.chqAmt =  this._GeneralService.formatMoney(event.target.value)
    
  }

  
  chqdate(event){

    let val = this._GeneralService.dateconvertion(event.target.value);

    //this.instrumentForm.chqDate = val;
   
  
   
  }

  autoPopulate(event)
  {
    var val =  event.target.value;
    console.log('autoPopulate', val);

    console.log('autoPopulate this.chargeFormLis', this.chargeFormList);

   // this.CollateralForm.acctNo = val;
    
    for(let i = 0; i <= this.chargeFormList.length; i++){
      if(this.chargeFormList[i] !== undefined)
      {
        this.chargeFormList[i].chgAcctNo = val;
      }
     
    }
  }


  chgChargeCalculate(event)
  {

     

  }



  ngAfterViewInit()  
  {
    this.settings.loadingSpinner = false; 
  }

  close(): void 
  {
    let ret = {
      batchNo: this.batchNo,
      reloadLoad: this.reloadLoad
    }
    this.dialogRef.close(ret);
  }

  
  swapTab(value): any{
    console.log('swapTab: ', value);

    
    if(value === 1){
      this.tab1 = 'active';
      this.tab2 = '';
      this.tab3 = '';
      this.tab4 = '';
      this.tab5 = '';
    }
    if(value === 2)
    {
     
     
      this.tab1 = '';
      this.tab2 = 'active';
      this.tab3 = '';
      this.tab4 = '';
      this.tab5 = '';
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

  swapView()
  {
    if(this.showIni ===  false)
    {
      this.showIni  = true;
    }
    else
    {
      this.showIni = false;
    }

  }


  viewTemp(): void
  {

    let val = {
      
      serviceId : this.serviceId,
      
    }

    this.loadPage = true;

    let url = 'Instrument/viewTemp';

    this._GeneralService.post(val, url).subscribe(
      (data: any) => 
      {

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


    if(this.templateContent != null){
      console.log('1');
      let dialogRef = this.dialog.open(TemplateComponent, {
        data: { data: this.templateContent }
      });
  
      dialogRef.afterClosed().subscribe(result => {
  
           console.log('tem  close res',   result);
  
           if (result !== undefined)
           {
             this.templateContent =  result;
           }
      });
    }
    else
    {
      console.log('2');
      let dialogRef = this.dialog.open(TemplateComponent, {
        data: { data: data.template.templateContent }
      });
  
      dialogRef.afterClosed().subscribe(result => {
  
           console.log('tem  close res',   result);
  
           if (result !== undefined)
           {
             this.templateContent =  result;
           }
      });
    }
  
  }



   radChage(event){

     // console.log('radChage3', this.instrumentForm.hitOption)


   }

   
  
   chqProductSelected(templateId)
   {

        let num = Number(templateId);
        let get = new List<ChargeForm>(this.chargeFormListTemporal).Where(c=> c.templateId === num).ToArray();
        this.chargeFormList =  get;

        for(let i = 0 ; i < this.chargeFormList.length; i++){
            if(this.chargeFormList != undefined)
            this.chargeFormList[i].templateId = num;
        }

        

    }


    
  updateFilter(event, value: any) {
    let temp1 = this.temp;
    if (value === 'BATCH NO') {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.batchNo.toString().toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }

    if (value === 'ACCT NO') 
    {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.acctNo.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }
    if (value === 'ACCT TYPE') 
    {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.acctType.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }
    if (value === 'ACCT NAME') 
    {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.acctName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }
    if (value === 'CHQ. NO') 
    {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.chequeNo.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }
    if (value === 'TC') 
    {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.cbsTC.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }
    if (value === 'DR AMT') 
    {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.amount.toString().toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }
    if (value === 'CR AMT') 
    {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.amount.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }
    if (value === 'CCY') 
    {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.ccyCode.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }

    if (value === 'SERVICESTATUS') 
    {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.serviceStatus.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }

    if (value === 'TXNSTATUS') 
    {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.status.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
  
    }
   
   

    if(this.rows.length === 0){
      swal('',this.recordNotFoundMsg, 'error');

      this.rows = temp1;
      
    }

  }


  actionItem(action: any, record: any): void  //////
  {

   let dialogRef = this.dialog.open(ApproveItemDetailsComponent, {

     // width: '3500px',
     // height: '800px',
     // hasBackdrop: true,
      disableClose: true,
     // autoFocus: true,
     data: { actionName: action, record:  record,
              serviceId:  this.serviceId, 
              admService :  this.admService
           },
    
   });

   dialogRef.afterClosed().subscribe(result => {
     
   
   });
 }

 keep(data: any){
   console.log('Keep ', data);
   let chk = this.keepItem.includes(data);
   if(chk === undefined){
    this.keepItem.push(data);
   }
   else{
    this.keepItem.slice(data, 1);
   }

 }

 chargeInit(chargeThisAcct: any)
 {
    if(chargeThisAcct){
      this.initiate();
    }
 }

 
 initiate() : void
 {

  if(this.instrumentForm.acctNo == null) {
   swal('','Enter Acct No ', 'error');
   return;
  }

 console.log('this.chargeFormList.length: ', this.chargeFormList);



   
   console.log('gen calc this.basicForm.value.amount11: ', this.instrumentForm.amount);
    if(this.instrumentForm.amount == null){
      this.instrumentForm.amount  = '0';
    }
    let values =  {  

              acctNo :   this.instrumentForm.acctNo,
              acctType : this.instrumentForm.acctType,
              transAmout: this.instrumentForm.amount,
              ListoprServiceCharge : this.chargeFormList,
              loginUserName: this.userDetails.userName,
              deptId: this.userDetails.deptId,
              userId: this.userDetails.userId,
              serviceId: this.serviceId,
              chargeThisAcct: this.chargeThisAcct
    }


        this.loadPage = true;

        console.log('GenCal Charges values', values)

        let url = 'BatchControl/CalCulateCharge';
        this._GeneralService.post(values, url).subscribe(
          (data: any) => 
          {
                console.log('Initiate data item: ', data);

                this.instrumentForm.itbId = null;
               // this.instrumentForm.serviceId =  this.serviceId;
                //this.instrumentForm.origDeptId = null;
               // this.instrumentForm.referenceNo =  null;
                this.instrumentForm.branchNo = data.instrumentAcctDetails.nBranch;
                this.instrumentForm.acctType = data.instrumentAcctDetails.sAccountType;  //
                this.instrumentForm.acctName = data.instrumentAcctDetails.sName;
                this.instrumentForm.acctBalance =  data.instrumentAcctDetails.nBalance;
               // this.instrumentForm.availBalString = data.instrumentAcctDetails.nBalance ;
               // this.instrumentForm.acctSic =  data.instrumentAcctDetails.sSector ;
                this.instrumentForm.acctStatus =  data.instrumentAcctDetails.sStatus ;
                this.instrumentForm.ccyCode = data.instrumentAcctDetails.sCrncyIso ;
              //  this.instrumentForm.serialNo = this.instrumentForm.serialNo ;
                this.instrumentForm.rsmId =  data.instrumentAcctDetails.sRsmId;// == null ? 0 : data.instrumentAcctDetails.sRsmId ;
              //  this.instrumentForm.instrumentCcy = this.instrumentForm.ccyCode;
               // this.instrumentForm.acctProductCode = data.instrumentAcctDetails.sProductCode;
               // this.instrumentForm.acctCustNo = data.instrumentAcctDetails.sCustomerId;
                
                
                // Contigent
                
               //  this.instrumentForm.branchName =  data.instrumentAcctDetails.sBranchName ;
               
               if( data.chgList != null)
                {
                  this.chargeFormList = data.chgList;
                 
         
                  for(let i = 0; i <= this.chargeFormList.length; i++)
                  {
                      if(this.chargeFormList[i] !== undefined){
                        this.chargeFormList[i].transactionDate = this.userDetails.bankingDate;
                        this.chargeFormList[i].valueDate = this.userDetails.bankingDate;
                        this.chargeFormList[i].chgNarration =  this.chargeFormList[i].incAcctNarr
                        
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
                }
                
          
              
              this.loadPage = false;

              if(data.instrumentAcctDetails.nErrorCode !== 0)
              {
                
                Swal('', data.instrumentAcctDetails.sErrorText, 'error');
                return;
              }

            
               this.actionbtnInitiate = false;
              
             
            
          },
          (error: any) => 
          {
            console.log('bat ini error', error)

            this.loadPage = false;
            this.actionbtnInitiate = false;
          
            Swal('', error.error.responseMessage, 'error');
        });
 }


 validateAcct(event)
 {
    console.log('validateAcct', event.target.value);
   // if(this.instrumentForm.amount === null)
   // {
   //   Swal('', 'Enter Transaction Amount', 'error');
   //   return;
   // }

  
   if(event.target.value !== null)
   {
     this.initiate();
   }

 }


 formatAmt(event)
 {
    console.log('formatAmt', event.target.value);

   this.instrumentForm.amount =  this._GeneralService.formatMoney(event.target.value)
   if(event.target.value !== null)
   {
    // this.initiate();
   }

 }

 
 retaiNChk(data: BatchItem) {


    if(this.acctTypeRetain == true)
    {
      this.instrumentForm.acctType = data.acctType;
    }
    else
    {
      this.instrumentForm.acctType = null;
    }
    
    if(this.amountRetain == true){
      this.instrumentForm.amount = data.amount;
    }
    else
    {
      this.instrumentForm.amount = null;
    }
    if(this.narrationRetain == true)
    {
      this.instrumentForm.narration = data.narration;
    }
    else
    {
      this.instrumentForm.narration = null;
    }
    if(this.tranCodeRetain == true)
    {
      this.instrumentForm.cbsTC = data.cbsTC;
    }
    else
    {
      this.instrumentForm.cbsTC = null;
    }
    
}


getTranConfigByServiceId(drCr): void {

  console.log('getById id', drCr);

  this.loadPage = true;

  let track = 0;
  let url = 'BatchControl/GetTransConfig';

    let val = {
      serviceId: this.serviceId
    };

this._GeneralService.post(val, url)
.subscribe(
  (data: any) => 
  {
 
    this.loadPage = false;

    this.admTransactionConfiguration = data;
      if(drCr === 'DR')
      {
        this.instrumentForm.cbsTC = this.admTransactionConfiguration.customerAcctDrTC
      }
      if(drCr === 'CR')
      {
        this.instrumentForm.cbsTC = this.admTransactionConfiguration.customerAcctCrTC
      }
  },
  (error: any) => 
  {
    console.log('eror admTransactionConfiguration: ' , error.error);
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


   
}







