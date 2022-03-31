  
import { List } from 'linqts';
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
import { DatePipe } from '@angular/common';
import { InstrumentForm, CollateralForm, ChargeForm, CollateralType } from '../../../../model/instrumentForms.model';
import { UserDetails } from '../../../../model/userDetails';
import swal from 'sweetalert2';
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
import { ApproveItemDetailsComponent } from '../approve-item-details/approve-item-details.component';


@Component({
  selector: 'app-approve-batch-details',
  templateUrl: './approve-batch-details.component.html',
  styleUrls: ['./approve-batch-details.component.scss']
})

export class ApproveBatchDetailsComponent  implements OnInit {
  totalChargeAmount: number;
  admTransactionConfiguration: AdmTransactionConfiguration
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
instrumentForm: BatchControl;
rows: BatchItem[];
temp: BatchItem[];
serviceName:any;
chargeFormList: ChargeForm[];
chargeFormListTemporal: ChargeForm[];

admService: admService;
templateContent: any;
action: Action

batchStatus = ['Loaded', 'Close']

BatchControl: BatchControl[];



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
              public dialogRef: MatDialogRef<ApproveBatchDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog, 
        )
      {

        this.userDetails = this._GeneralService.getUserDetails();
        this.settings = this.appSettings.settings; 
       
        this.resetChqProduct();
        this.resetAction(data);

        console.log('data details', data);

      this.chargeFormList =  data.chargeSetup;
      this.admService = data.admService;
     // console.log('data this.admService; ', this.admService);

      this.serviceId = data.serviceId;
      this.serviceName = data.serviceName;
     
      if(this.data.actionName === 'Add')
      {
          this.reformInstrumentForm();
      }
      else
      {
        this.ActionHeaderMsg = '';
        this.ActionDisplay = this.ActionViewHeaderMsg;
        let batchNo = data.record.batchNo;
        
        this.getById(batchNo);
        if (data.row != undefined){
          this.BatchControl = data.row

          console.log('data this.BatchControl; ', this.BatchControl);
        }
        
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

  let ini = new BatchControl();

  this.instrumentForm =  ini;
  this.instrumentForm.serviceId = this.serviceId
  this.instrumentForm.loadedBy	= this.userDetails.userId, 
  this.instrumentForm.dept	= this.userDetails.deptId, 
  this.instrumentForm.originBranchNo = this.userDetails.branchNo,
  this.instrumentForm.processingDept	= this.userDetails.deptId, 
 
    /*this.instrumentForm =  
    {
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



getById(batchNo): void {

    console.log('getById id', batchNo);

    this.loadPage = true;

    let track = 0;
    let url = 'BatchControl/GetById';

      let val = {
        batchControl: {
          batchNo: batchNo
        },
        serviceId: this.serviceId
      };

  this._GeneralService.post(val, url)
  .subscribe(
    (data: any) => 
    {
      console.log('get batch items data', data);
     
      this.loadPage = false;
      this.instrumentForm = data.instrumentDetails;
      this.rows = data.batchItems
      
      this.temp = data.batchItems;
      let calDChgr = 0;
     for(let i = 0; i < this.rows.length; i++)
     {
          if(this.rows[i].chargeAmount !== undefined)
          {
            if(Number(this.rows[i].chargeAmount) > 0)
            {
            
              calDChgr += Number(this.rows[i].chargeAmount)
              this.totalChargeAmount = calDChgr;
            }
          }

          if(this.rows[i].drCr.toLocaleLowerCase().trim() == 'dr')
          {
            this.instrumentForm.totalDr += Number(this.rows[i].amount);
          }
      
          if(this.rows[i].drCr.toLocaleLowerCase().trim() == 'cr')
          {
            this.instrumentForm.totalCr += Number(this.rows[i].amount);
          }
     }
      

     // this.instrumentForm.amount = this.instrumentForm.amount != null ? this._GeneralService.formatMoney(this.instrumentForm.amount) : this.instrumentForm.amount;
     // this.instrumentForm.availBal = this.instrumentForm.availBal != null ? this._GeneralService.formatMoney(this.instrumentForm.availBal) : this.instrumentForm.availBal;
     // this.instrumentForm.branchName = data.valInstrumentAcct.sBranchName ;
    //  this.instrumentForm.chqWidrawalAmount = this.instrumentForm.chqWidrawalAmount != null ?  this._GeneralService.formatMoney(this.instrumentForm.chqWidrawalAmount) : this.instrumentForm.chqWidrawalAmount;

      this.instrumentForm.dateCreated = this.instrumentForm.dateCreated != null ? this._GeneralService.dateCreated(this.instrumentForm.dateCreated) : this.instrumentForm.dateCreated;

      if(data.allUsers != undefined)
      {
        this.createdBy = data.allUsers.createdBy;
        this.dismissedBy= data.allUsers.dismissedBy;
        this.rejectedBy = data.allUsers.rejectedBy;
      }
    },
    (error: any) => 
    {
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

  
    // if(this.templateContent == null)
    // {
    //    swal('', 'Supply Template Content','error');
    //    return;
    // }


    this.actionLoaderSave = true;
    let element = <HTMLInputElement> document.getElementById("btnSave");
    element.disabled = true;

    // this.instrumentForm.userId  = this.userDetails.userId;
    // this.instrumentForm.originatingBranchId = this.userDetails.branchNo;
    // this.instrumentForm.transactionDate =  this.userDetails.bankingDate;
    // this.instrumentForm.valueDate =  this.userDetails.bankingDate;

   // this.instrumentForm.itbId = 0;

      let val = 
      { 
            batchControl: this.instrumentForm,
            loginUserId: this.userDetails.userId,
            serviceId : this.serviceId,
            transactionDate: this.userDetails.bankingDate,
            ValueDate: this.userDetails.bankingDate,
            LoginUserName: this.userDetails.userName,
      }

      console.log('val to add: ', val);

      let url = 'BatchControl/Add';

      this._GeneralService.post(val, url).subscribe(
        (data: any) => {
        
  
         // this.reformInstrumentForm();
         // this.resetChargeAfterAdd();

         this.instrumentForm = data.batch;

         this.instrumentForm.dateCreated = this._GeneralService.dateCreated(this.instrumentForm.dateCreated);

          element.disabled = false;
         
          this.templateContent = null;
          this.actionLoaderSave = false;
          this.reloadLoad= 'Y'; 

          console.log('added batch No: ', this.instrumentForm.batchNo);

          this.getById(this.instrumentForm.batchNo);

          this.data.actionName = 'Edit';

          Swal('', data.apiResponse.responseMessage, 'success');

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

  

    // if(this.templateContent == null)
    // {
    //    swal('', 'Supply Template Content','error');
    //    return;
    // }
   // console.log('update chargeFormList: ', this.chargeFormList);

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement> document.getElementById("btnUpdate");

    element.disabled = true;
     
      

      let val = 
      { 
            batchControl: this.instrumentForm,
            loginUserId: this.userDetails.userId,
            serviceId : this.serviceId,
            transactionDate: this.userDetails.bankingDate,
            ValueDate: this.userDetails.bankingDate,
            LoginUserName: this.userDetails.userName,
      }

      console.log('val to add: ', val);

      let url = 'BatchControl/Update';


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

          Swal('', data.responseMessage, 'success');
          
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
     
    }

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

    this.dialogRef.close(this.reloadLoad);
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
        return d.amount.toLowerCase().indexOf(val) !== -1 || !val;
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

    if (value === 'STATUS') 
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

  actionAddItem(action: any, record: any): void  
  {

   let dialogRef = this.dialog.open(ApproveBatchDetailsComponent, {

     // width: '3500px',
     // height: '800px',
     // hasBackdrop: true,
      disableClose: true,
     // autoFocus: true,
     data: { actionName: action, record:  this.instrumentForm,
              serviceId:  this.serviceId, 
              admService :  this.admService,
              chargeSetup: this.data.chargeSetup,
              itemdetails: record
           },
    
   });

   dialogRef.afterClosed().subscribe(result => {
     
    if(result.reloadLoad ==='Y')
    {
     
      this.getById(result.batchNo);
     
    }
   
   });
 }


  actionItem(action: any, record: any): void  
  {

   let dialogRef = this.dialog.open(ApproveItemDetailsComponent, {

      width: '1400px',
      height: '600px',
     // hasBackdrop: true,
      disableClose: true,
     // autoFocus: true,
     data: { actionName: action, record:  this.data,
              serviceId:  this.serviceId, 
              admService :  this.admService,
              chargeSetup: this.data.chargeSetup,
              itemdetails: record
           },
    
   });

   dialogRef.afterClosed().subscribe(result => {
     
    if(result.reloadLoad ==='Y')
    {
     
      this.getById(result.batchNo);
     
    }
   
   });
 }

  removeBatches(): void {
    let getSelected = this.BatchControl;// = new List<BatchControl>(this.rows).Where(c => c.select === true).ToArray();

   
    Swal({

      title: '',
      text: 'Are you Sure you want to Reject this Batch and it Item?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'Cancel'

    }).then((result) => {

      if (result.value) {

        this.loadPage = true;
        this.actionLoaderUpdate = true;
        let element = <HTMLInputElement>document.getElementById("btnRemoveBatch");

        element.disabled = true;
       // console.log('this.selectedRec: ', this.selectedRec);

        let url = 'BatchControl/RemoveBatch';

        for (let i = 0; i < getSelected.length; i++) {
          getSelected[i].loadedBy = '0';
          getSelected[i].processingDept = '0';
        }

        let val =
        {
          ListBatchControl: getSelected,
          loginUserName: this.userDetails.userName,
          LoginUserId: this.userDetails.userId,
        }

        console.log('remove batch: ', val);

        this._GeneralService.post(val, url).subscribe(
          (data: any) => {
            element.disabled = false;
            this.actionLoaderUpdate = false;
            this.loadPage = false;

            let getUserDetails = this._GeneralService.getUserDetails();
            console.log('getUserDetails token', getUserDetails)
           // this.load(getUserDetails);


            Swal('', data.responseMessage, 'success');
          },
          (error: any) => {

            this.loadPage = false;
            element.disabled = false;
            this.actionLoaderUpdate = false;

            console.log('error 11: ', error.error);
            console.log('error 22: ', error.error.responseMessage);
            console.log('error responseMessage1: ', error.responseMessage);

            Swal('', error.error.responseMessage, 'error');
          });
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });


  }
  undoRemoveBatches(): void {
    let getSelected = this.BatchControl;// new List<BatchControl>(this.rows).Where(c => c.select === true).ToArray();

    // if (getSelected.length === 0) {

    //   Swal('', this.selectTransMsg, 'warning');

    //   return;
    // }
    Swal({

      title: '',
      text: 'Are you Sure you want to Undo the Previous Rejected action Batch(es)?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'Cancel'

    }).then((result) => {

      if (result.value) {

        this.loadPage = true;
        this.actionLoaderUpdate = true;
        let element = <HTMLInputElement>document.getElementById("btnRemoveBatch");

        element.disabled = true;
       // console.log('this.selectedRec: ', this.selectedRec);

        let url = 'BatchControl/UndoRejectBatch';

        for (let i = 0; i < getSelected.length; i++) {
          getSelected[i].loadedBy = '0';
          getSelected[i].processingDept = '0';
        }

        let val =
        {
          ListBatchControl: getSelected,
          loginUserName: this.userDetails.userName,
          LoginUserId: this.userDetails.userId,
        }

        console.log('remove batch: ', val);

        this._GeneralService.post(val, url).subscribe(
          (data: any) => {
            element.disabled = false;
            this.actionLoaderUpdate = false;
            this.loadPage = false;

            let getUserDetails = this._GeneralService.getUserDetails();
            console.log('getUserDetails token', getUserDetails)
            //this.load(getUserDetails);


            Swal('', data.responseMessage, 'success');
          },
          (error: any) => {

            this.loadPage = false;
            element.disabled = false;
            this.actionLoaderUpdate = false;

            console.log('error 11: ', error.error);
            console.log('error 22: ', error.error.responseMessage);
            console.log('error responseMessage1: ', error.responseMessage);

            Swal('', error.error.responseMessage, 'error');
          });
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });


  }
  approvePostTrans(): void {

    let getSelected = this.BatchControl;//// = new List<BatchControl>(this.rows).Where(c => c.select === true).ToArray();

    // if (getSelected.length === 0) {
    //   Swal('', this.selectTransMsg, 'warning');
    //   return;
    // }
    Swal({

      title: '',
      text: 'Are you Sure you want to Approve/Post this Batch?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'Cancel'

    }).then((result) => {

      if (result.value) {

        this.loadPage = true;

        let element = <HTMLInputElement>document.getElementById("btnprocessAllItem");

        element.disabled = true;
        //console.log('this.selectedRec: ', this.selectedRec);

        let url = 'ApproveBatch/ApproveTrans';

        let userDetails = this._GeneralService.getUserDetails();

        console.log('userDetails: ', userDetails);



        let val =
        {
          listBatchControl: getSelected,
          loginUserName: userDetails.userName,
          userId: userDetails.userId,
          loginUserId: this.userDetails.userId,
          serviceId: this.serviceId,
          transactionDate: this.userDetails.bankingDate
        }



        this._GeneralService.post(val, url).subscribe(
          (data: any) => {
            console.log('process succ batch ', val);

            Swal('', data.responseMessage, 'success');
            element.disabled = false;
            this.loadPage = false;
            let getUserDetails = this._GeneralService.getUserDetails();
           // this.load(getUserDetails);

          },
          (error: any) => {

            this.loadPage = false;
            element.disabled = false;


            console.log('error 11: ', error.error);
            console.log('error 22: ', error.error.responseMessage);
            console.log('error responseMessage1: ', error.responseMessage);

            Swal('', error.error.responseMessage, 'error');
          });
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });


  }

  reApprovePostTrans(): void {

    let getSelected = this.BatchControl;// new List<BatchControl>(this.rows).Where(c => c.select === true).ToArray();


    Swal({

      title: '',
      text: 'Are you Sure you want to Re-Approve/Post this  Batch and it items?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'Cancel'

    }).then((result) => {

      if (result.value) {

        this.loadPage = true;

        let element = <HTMLInputElement>document.getElementById("btnReProcessAllItem");

        element.disabled = true;
        //console.log('this.selectedRec: ', this.selectedRec);

        let url = 'ApproveBatch/ReApproveTrans';

        let userDetails = this._GeneralService.getUserDetails();

        console.log('userDetails: ', userDetails);



        let val =
        {
          listBatchControl: getSelected,
          loginUserName: userDetails.userName,
          userId: userDetails.userId,
          loginUserId: this.userDetails.userId,
          serviceId: this.serviceId,
          transactionDate: this.userDetails.bankingDate
        }



        this._GeneralService.post(val, url).subscribe(
          (data: any) => {
            console.log('process succ batch ', val);

            Swal('', data.responseMessage, 'success');
            element.disabled = false;
            this.loadPage = false;
            let getUserDetails = this._GeneralService.getUserDetails();
            //this.load(getUserDetails);

          },
          (error: any) => {

            this.loadPage = false;
            element.disabled = false;


            console.log('error 11: ', error.error);
            console.log('error 22: ', error.error.responseMessage);
            console.log('error responseMessage1: ', error.responseMessage);

            Swal('', error.error.responseMessage, 'error');
          });
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });


  }



   
}





