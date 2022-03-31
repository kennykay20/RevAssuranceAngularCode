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
import { admService } from '../../../../model/admService';
import { TemplateComponent } from '../../../ui/dialog/template/template.component';
import { AccountValidation } from '../../../../model/acctValidation';
import { Action } from '../../../../model/Action';
import { OprTradeReference } from '../../../../model/OprTradeReference.model';
import { admAmendReprintReason } from '../../../../model/admAmendReprintReason';
import { SweetAlertService } from '../../../../services/sweetAlert.service';
import { Mandate } from '../../../../model/mandate.model';
import { ViewMandateDetailsComponent } from '../../view-mandate/view-mandate-details/view-mandate-details.component';
import { admAccountTypeModel } from '../../../../model/admAccountTypeDTO.model';
import { ApproveServiceList } from '../../../../model/apprService.model';
import { ApiResponse } from '../../../../model/apiResponse.model';

@Component({
  selector: 'app-trade-ref-details',
  templateUrl: './trade-ref-details.component.html',
  styleUrls: ['./trade-ref-details.component.scss']
})

export class TradeRefDetailsComponent implements OnInit {
  
  accountValidation: AccountValidation;
  cbsOfflineMsg = GenModel.cbsOfflineMsg;
  period = [] = [ "DAY(S)", "MONTH(S)" , "YEAR(S)",]
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
  CollateralTypes: CollateralType [];
  templateTypes = [];
  stateList:any;
  NationalityList: any;
  localGovernmentsList: any;
  private baseUrl = environment.apiURL;
  Email: any;
  loadPage = true;
  token = GenModel.tokenName;
  approveFromServiceMsg = GenModel.approveFromServiceMsg;
  apiResponse: ApiResponse;

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

  noMandateMsg = GenModel.noMandateMsg

 
  
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
dismissedBy: any;
rejectedBy: any;
instrumentForm: OprTradeReference;
serviceName:any;
chargeFormList: ChargeForm[];
admService: admService;
templateContent: any;
action: Action

actionName: string;
btnAmendOrReprint = ''

admAmendReprintReason: admAmendReprintReason[]
admAmendReprintReasonTemp: admAmendReprintReason[]
singleadmAmendReprintReason: admAmendReprintReason

itbId: number;

//new variable
checkValue = false; 
maxLength = GenModel.acctmaxLengthDefault;

lengthMessage = '';
acct1 = '';
glAccountType = false;
admAccountTypeModel: admAccountTypeModel;
instrumentForms: OprTradeReference;
rowsApprove: ApproveServiceList[];
  
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
              public dialogRef: MatDialogRef<TradeRefDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog,  private sweetAlertService: SweetAlertService
        )
      {

        this.userDetails = this._GeneralService.getUserDetails();
        this.settings = this.appSettings.settings; 
       
        this.resetAction(data);

        console.log('apg data details; ', data);

        let initSelectEdCol = [{collateralName: null,
                      selected: true}
                    ]

      this.chargeFormList =  data.chargeSetup;
      this.admService = data.admService;
      //console.log('data this.admService; ', this.admService);

      this.serviceId = data.serviceId;
      this.serviceName = data.serviceName;

      this.actionName = data.actionName;	
   if(data.actionName === 'Ammend' || data.actionName === 'Reprint')
   {
     this.reformInstrumentForm();

     this.btnAmendOrReprint = this.actionName;
    
   }
     
      if(this.data.actionName === 'Add')
      {
          this.reformInstrumentForm();
          this.resetCollateralForm();
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
      }
      else
      {
        this.ActionHeaderMsg = '';
        this.ActionDisplay = this.ActionViewHeaderMsg;

        this.showIni = true;

        console.log('trade ref; ', data);

        this.itbId = data.record.itbId;

        //this.itbId = data.itbId,
        this.serviceId = data.serviceId

        //console.log("datass ", data);
        this.rowsApprove = data.rowsApprove;
        this.getById(this.itbId);

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

    this.instrumentForm =  new OprTradeReference();
    this.instrumentForm.serviceId	= this.serviceId,
    this.instrumentForm.processingDeptId = this.admService.defaultDept
    this.instrumentForm.originatingBranchId = this.userDetails.branchNo
    this.instrumentForm.origDeptId = this.userDetails.deptId
    console.log('new**', this.instrumentForm);
 }



 resetCollateralForm() {

  this.CollateralForm = [{

    itbId				: 0,
    serviceId			: this.serviceId,
    serviceItbId		: null,
    collTypeId			: 0,
    collDescription		: null,
    acctNo				: null,
    acctType			: null,
    availBal			: null,
    acctName			: null,
    acctStatus			: null,
    acctCCy				: null,
    holdId				: null,
    lienAmount			: null,
    collStatus			: null,
    forcedSaleValue		: null,
    effectiveDate		: null,
    expiryDate			: null,
    location			: null,
    ccyCode				: null,
    valuer				: null,
    verifiedBy			: null,
    verificationDate	: null,
    marketValue			: null,
    insCoyName		: null,
    insured :  null,
    insCoverTypeId :  null,
    policyNo : null,
    sumAssured : null,
    premiumPayable :  null,
    collMortgageNo		: null,
    userId				: null,
    status				: null,
    dateCreated			: null,
    placeHoldBoolean: false,
    placeHold: null,
    selected: false,
    collateralName: null
   }];

  //this.CollateralForm = init;

 
 
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
    templateId: 0,

   });
 }

 resetChargeAfterAdd()
 {

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


getById(itbId): void {

   // console.log('getById id', record.record.itbId);
    this.loadPage = true;

    let track = 0;
    let url = 'TradeReference/GetById';

      let val = {
        OprTradeReference: {
          itbId: itbId
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
    (data: any) => 
    {

      console.log('get trade  ref data', data);
    
      this.loadPage = false;
      this.instrumentForm = data.instrumentDetails;
      this.chargeFormList = data.serviceChargeslist;

      

      this.instrumentForm.creditAmount = this.instrumentForm.creditAmount != null ? this._GeneralService.formatMoney(this.instrumentForm.creditAmount) : this.instrumentForm.creditAmount;
      this.instrumentForm.availBal = this.instrumentForm.availBal != null ? this._GeneralService.formatMoney(this.instrumentForm.availBal) : this.instrumentForm.availBal;
      this.instrumentForm.branchName = data.valInstrumentAcct.sBranchName ;
      this.templateContent =   data.template.templateContent;


      /*this.CollateralForm.lienAmount = this.CollateralForm.lienAmount != null ? this._GeneralService.formatMoney(this.CollateralForm.lienAmount) : this.CollateralForm.lienAmount;
      this.CollateralForm.availBal = this.CollateralForm.availBal != null ? this._GeneralService.formatMoney(this.CollateralForm.availBal) : this.CollateralForm.availBal;
      this.CollateralForm.effectiveDate = this.CollateralForm.effectiveDate != null ? this._GeneralService.dateconvertion(this.CollateralForm.effectiveDate) : this.CollateralForm.effectiveDate;
      this.CollateralForm.expiryDate = this.CollateralForm.expiryDate != null ? this._GeneralService.dateconvertion(this.CollateralForm.expiryDate ) : this.CollateralForm.effectiveDate;
      this.CollateralForm.verificationDate = this.CollateralForm.verificationDate != null ? this._GeneralService.dateconvertion(this.CollateralForm.verificationDate ) : this.CollateralForm.verificationDate;
      this.CollateralForm.marketValue = this.CollateralForm.marketValue != null ? this._GeneralService.formatMoney(this.CollateralForm.marketValue) : this.CollateralForm.marketValue;
      this.CollateralForm.forcedSaleValue = this.CollateralForm.forcedSaleValue != null ? this._GeneralService.formatMoney(this.CollateralForm.forcedSaleValue) : this.CollateralForm.forcedSaleValue;
      this.CollateralForm.placeHoldBoolean = this.CollateralForm.placeHold == 'Y' ?  true : false;
      */
   
      this.instrumentForm.dateCreated = this.instrumentForm.dateCreated != null ? this._GeneralService.dateCreated(this.instrumentForm.dateCreated) : this.instrumentForm.dateCreated;

      for(let i  = 0; i < this.chargeFormList.length; i++){
        if(this.chargeFormList[i] != null){
          this.chargeFormList[i].transactionDate = this.instrumentForm.transactionDate != null ? this._GeneralService.dateconvertion(this.instrumentForm.transactionDate) : this.instrumentForm.transactionDate;
          this.chargeFormList[i].valueDate = this.instrumentForm.valueDate != null ? this._GeneralService.dateconvertion(this.instrumentForm.valueDate) : this.instrumentForm.valueDate;
          this.chargeFormList[i].origChgAmount =  this.chargeFormList[i].origChgAmount != null ? this._GeneralService.formatMoney(this.chargeFormList[i].origChgAmount) : this.chargeFormList[i].origChgAmount;
          this.chargeFormList[i].equivChgAmount = this.chargeFormList[i].equivChgAmount != null ?  this._GeneralService.formatMoney(this.chargeFormList[i].equivChgAmount) : this.chargeFormList[i].equivChgAmount;
          this.chargeFormList[i].taxAmount = this.chargeFormList[i].taxAmount != null ?  this._GeneralService.formatMoney(this.chargeFormList[i].taxAmount) : this.chargeFormList[i].taxAmount;
        
        }
      }

      if(data.allUsers != undefined)
      {
        this.createdBy = data.allUsers.createdBy;
        this.dismissedBy= data.allUsers.dismissedBy;
        this.rejectedBy = data.allUsers.rejectedBy;
      }

      if( this.actionName.trim().toLowerCase() === 'ammend'){
        const reasons = data._response;
        const selectedReason =  new List<admAmendReprintReason>(reasons).Where(c=> c.reasonType.toLowerCase() === 'ammend').ToArray();
        this.admAmendReprintReason = selectedReason;
        this.admAmendReprintReasonTemp = selectedReason
         
        }
        if ( this.actionName.trim().toLowerCase() === 'reprint'){
        const reasons = data._response; 
        const selectedReason =  new List<admAmendReprintReason>(reasons).Where(c=> c.reasonType.toLowerCase() === 'reprint').ToArray();
        this.admAmendReprintReason = selectedReason;
        this.admAmendReprintReasonTemp = selectedReason
       
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

bindCollaterGebById(rec: CollateralForm[]){
   
  for(let i =0; i < this.CollateralForm.length; i++)
  {
     if(this.CollateralForm[i].collTypeId == 1)
     {
       this.CollateralForm[i].collateralName = 'CASH';
       this.CollateralForm[i].selected = true;
     }

     if(this.CollateralForm[i].collTypeId == 2)
     {
      this.CollateralForm[i].collateralName = 'LEGAL MORTGAGE';
      this.CollateralForm[i].selected = true;
     }

     if(this.CollateralForm[i].collTypeId == 3)
     {
      this.CollateralForm[i].collateralName = 'DEBENTURE MORTGAGE';
      this.CollateralForm[i].selected = true;
     }
     if(this.CollateralForm[i].collTypeId == 4)
     {
      this.CollateralForm[i].collateralName = 'OTHERS';
      this.CollateralForm[i].selected = true;
     }
     if(this.CollateralForm[i].collTypeId == 5)
     {
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
    
    this.CollateralTypes = data.colType;
    this.templateTypes = data.temp;
    this.IssuranceCoverTypes = data.issuranceCoverType;
    this.currencies = data.currencies;
    this.sectors = data.sectors;
    console.log('data IssuranceCoverTypes: ', this.currencies);

    this.loadPage = false;
      
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




  add(values: Object): void {
  let  valAcct ;

  let element;
  let url: string;
  let val;
 

  
  // if(this.serviceId == 14)
  // {
  //   valAcct = this.validationForBankGuarantee(this.serviceId);
   
  //   if(valAcct === true) {
  //    return;
  //   }

  // }

    if(this.templateContent == null)
    {
       swal('', 'Supply Template Content','error');
       return;
    }

   

    if(valAcct === true) {
      return;
      }
    this.instrumentForm.userId  = this.userDetails.userId;
    this.instrumentForm.originatingBranchId = this.userDetails.branchNo;
  
  // console.log('instrumentForm val', getWHere);

   if(this.actionName.toLocaleLowerCase() ===  'ammend' || this.actionName.toLocaleLowerCase() ===  'reprint')
   {
     if(this.singleadmAmendReprintReason === undefined)
     {
       swal('', 'Select Ammendment Reason','error');
       return;
     }

     let btnName = this.actionName.toLocaleLowerCase() ===  'ammend' ? "btnAmend" : "btnReprint"
     this.actionLoaderSave = true;
     element = <HTMLInputElement> document.getElementById(btnName);
     element.disabled = true;

     let ammendORReprintText = this.actionName.toLocaleLowerCase() ===  'ammend' ? 'Ammend' : 'Reprint'
    //  for(let i = 0; i < this.CollateralForm.length; i++)
    //  {
    //      let chkPlaceHold = this.CollateralForm[i].placeHoldBoolean == true ? 'Y' : 'N'
    //      this.CollateralForm[i].placeHold = chkPlaceHold;
    //  }
     
    //    var getWHere = this.CollateralForm.filter(c=> c.collTypeId > 0);
     //  console.log('getWHere', getWHere);
       this.instrumentForm.origDeptId = this.userDetails.deptId;
       this.instrumentForm.status = null;
       
    val = 
    { 
          oprTradeReference: this.instrumentForm,
          listoprServiceCharge: this.chargeFormList,
          templateContent: this.templateContent,
          loginUserId: this.userDetails.userId,
          serviceId : this.serviceId,
          transactionDate: this.userDetails.bankingDate,
          ValueDate: this.userDetails.bankingDate,
          LoginUserName: this.userDetails.userName,
          admAmendReprintReason: this.singleadmAmendReprintReason,
          ammendmentOrReprintTxt: ammendORReprintText
    }

      url = 'TradeReference/AmmendOrReprint';
   }

   if(this.actionName.toLocaleLowerCase() ===  'add')
   {



    this.actionLoaderSave = true;
    element = <HTMLInputElement> document.getElementById("btnSave");
    element.disabled = true;

    // for(let i = 0; i < this.CollateralForm.length; i++)
    // {
    //    let chkPlaceHold = this.CollateralForm[i].placeHoldBoolean == true ? 'Y' : 'N'
    //    this.CollateralForm[i].placeHold = chkPlaceHold;
    // }
   
  // var getWHere = this.CollateralForm.filter(c=> c.collTypeId > 0);
        this.instrumentForm.itbId = 0;
        this.instrumentForm.origDeptId = this.userDetails.deptId


       val = 
      { 
            oprTradeReference: this.instrumentForm,
            listoprServiceCharge: this.chargeFormList,
            templateContent: this.templateContent,
            loginUserId: this.userDetails.userId,
            serviceId : this.serviceId,
            transactionDate: this.userDetails.bankingDate,
            ValueDate: this.userDetails.bankingDate,
            LoginUserName: this.userDetails.userName,
      }

      console.log('val to add: ', val);

       url = 'TradeReference/Add';
    }


      this._GeneralService.post(val, url).subscribe(
        (data: any) => {
        
          if(this.actionName.toLocaleLowerCase() ===  'add')
          {
            this.reformInstrumentForm();
            this.resetCollateralForm();
            this.resetChargeAfterAdd();

            element.disabled = false;
          
            this.templateContent = null;
            this.actionLoaderSave = false;
            this.reloadLoad= 'Y'; 
          }

          this.actionLoaderSave = false;
          element.disabled = false;         
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

      if(this.templateContent == null)
      {
         swal('', 'Supply Template Content','error');
         return;
      }

    console.log('update chargeFormList: ', this.chargeFormList);

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement> document.getElementById("btnUpdate");

    element.disabled = true;
      let url = 'TradeReference/Update';


     let val = 
     { 
           oprTradeReference: this.instrumentForm,
           listoprServiceCharge: this.chargeFormList,
           templateContent: this.templateContent,
           loginUserId: this.userDetails.userId,
           serviceId : this.serviceId,
           transactionDate: this.userDetails.bankingDate,
           ValueDate: this.userDetails.bankingDate,
           LoginUserName: this.userDetails.userName,
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

          if(data.responseCode == 0)
            Swal('', data.responseMessage, 'success');
          else
            Swal('', data.responseMessage, 'error');
        },
        (error: any) => {
          
          element.disabled = false;
          this.actionLoaderUpdate =  false;
       
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
  
  trigerAfterAmt(event)
  {
    console.log('trigerAfterAmt');
    this.initiate();
  }

  validateAcct(event)
  {
    
    this.initiate();

  }

  formatAmount(event){
    this.instrumentForm.creditAmount =  this._GeneralService.formatMoney(event.target.value)
     this.initiate();
  }

  formatColAmount(event){
   // this.CollateralForm.lienAmount =  this._GeneralService.formatMoney(event.target.value)
  }

  colMarketValAmount(rec: CollateralForm)  {
    console.log('market value', rec);
    for(let i = 0; i < this.CollateralForm.length; i++)
    {
      console.log('market value 1');
      if(this.CollateralForm[i].collTypeId === rec.collTypeId)
      {
        console.log('market value 2');
         this.CollateralForm[i].marketValue =  this._GeneralService.formatMoney(rec.marketValue)
        return;
      }
    
    }
  }

  colforceSaleValAmount(rec: CollateralForm)  {
    console.log('forcedSaleValue value', rec);
    for(let i = 0; i < this.CollateralForm.length; i++)
    {
     
      if(this.CollateralForm[i].collTypeId === rec.collTypeId)
      {
      
         this.CollateralForm[i].forcedSaleValue =  this._GeneralService.formatMoney(rec.forcedSaleValue)
        return;
      }
    
    }
  }


  initiate() : void
  {
   
    if(this.instrumentForm.acctNo == null || this.instrumentForm.acctNo == "") {
      swal('','Enter Instrument Acct No ', 'error');
      return;
    }

  
  //console.log('this.chargeFormList.length: ', this.chargeFormList);

  for(let i = 0; i <= this.chargeFormList.length; i++){
    console.log('this.chargeFormListTTT: ', this.chargeFormList[i]);

     if(this.chargeFormList[i] != undefined)
     {

        

        if (this.chargeFormList[i].chargeCode === undefined) {

          swal('','Enter  Charge Code', 'error');
          return;

        }

        if (this.chargeFormList[i].chargeCode === null) {

          swal('','Enter  Charge Code', 'error');
          return;

        }

        if (this.chargeFormList[i].chargeCode === null) {

          swal('','Enter  Charge Code', 'error');
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
    
    console.log('gen calc this.basicForm.value.amount11: ', this.instrumentForm.creditAmount);



     let values =  {  
 
               acctNo :   this.instrumentForm.acctNo,
               acctType : this.instrumentForm.acctType,
               transAmout: this.instrumentForm.creditAmount,
               ListoprServiceCharge : this.chargeFormList,
               loginUserName: this.userDetails.userName,
               deptId: this.userDetails.deptId,
               userId: this.userDetails.userId,
               serviceId: this.serviceId,
              
     }
 
 
         this.loadPage = true;

         console.log('GenCal Charges values', values)
 
         let url = 'ServiceCharge/CalCulateCharge';

         
	
         if (this.userDetails.cbsStatus.toLowerCase() === 'offline') {
            Swal('', this.cbsOfflineMsg, 'error');
            return;
          }
 
         this._GeneralService.post(values, url).subscribe(
           (data: any) => 
           {
                 console.log('Initiate data : ', data);

                 this.instrumentForm.itbId = null;
                 this.instrumentForm.serviceId =  this.serviceId;
                 this.instrumentForm.origDeptId = null;
                 this.instrumentForm.referenceNo =  null;
                 this.instrumentForm.branchNo = data.instrumentAcctDetails.nBranch;
                 this.instrumentForm.acctType = data.instrumentAcctDetails.sAccountType;  //
                 this.instrumentForm.acctName = data.instrumentAcctDetails.sName;
                 this.instrumentForm.availBal =  data.instrumentAcctDetails.nBalance;

                 this.instrumentForm.availBal =  data.instrumentAcctDetails.nBalance;
                // this.instrumentForm.availBalString = data.instrumentAcctDetails.nBalance ;
                 this.instrumentForm.acctSic =  data.instrumentAcctDetails.sSector ;
                 this.instrumentForm.acctStatus =  data.instrumentAcctDetails.sStatus ;
                 this.instrumentForm.ccyCode = data.instrumentAcctDetails.sCrncyIso ;
                // this.instrumentForm.serialNo = this.instrumentForm.serialNo ;
                 this.instrumentForm.rsmId =  data.instrumentAcctDetails.sRsmId == null ? 0 : data.instrumentAcctDetails.sRsmId ;
                 //this.instrumentForm.instrumentCcy = this.instrumentForm.ccyCode;
                 this.instrumentForm.acctProductCode = data.instrumentAcctDetails.sProductCode;
                 this.instrumentForm.acctCustNo = data.instrumentAcctDetails.sCustomerId;
                 // Contigent
                  
                  this.instrumentForm.branchName =  data.instrumentAcctDetails.sBranchName ;

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
           
               
               this.loadPage = false;
 
               if(data.instrumentAcctDetails.nErrorCode !== 0)
               {
                 
                 Swal('', data.instrumentAcctDetails.sErrorText, 'error');
                 return;
               }
             
           },
           (error: any) => 
           {
             this.loadPage = false;
             Swal('', error.error.responseMessage, 'error');
         });
  }

  reAmmend() : void
  {
   
    if(this.instrumentForm.acctNo == null) {
      swal('','Enter Instrument Acct No ', 'error');
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

  for(let i = 0; i <= this.chargeFormList.length; i++){
    console.log('this.chargeFormListTTT: ', this.chargeFormList[i]);

     if(this.chargeFormList[i] != undefined)
     {

        //   if (this.chargeFormList[i].chgAcctType === undefined) {

        //     swal('','Select Charge AcctType', 'error');
        //     return;

        //   }

        //   if (this.chargeFormList[i].chgAcctNo === undefined) {

        //     swal('','Enter  Charge Acct No', 'error');
        //     return;

        // }

        if (this.chargeFormList[i].chargeCode === undefined) {

          swal('','Enter  Charge Code', 'error');
          return;

        }

        if (this.chargeFormList[i].chargeCode === null) {

          swal('','Enter  Charge Code', 'error');
          return;

        }

        if (this.chargeFormList[i].chargeCode === null) {

          swal('','Enter  Charge Code', 'error');
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
    
    console.log('gen calc this.basicForm.value.amount11: ', this.instrumentForm.creditAmount);
    
    const ammendOrReprint = this.actionName.toLocaleLowerCase() == 'ammend' ? true : false
     
    let values =  {  
 
               acctNo :   this.instrumentForm.acctNo,
               acctType : this.instrumentForm.acctType,
               transAmout: this.instrumentForm.creditAmount,
               ListoprServiceCharge : this.chargeFormList,
               loginUserName: this.userDetails.userName,
               deptId: this.userDetails.deptId,
               userId: this.userDetails.userId,
               serviceId: this.serviceId,
               isAmmendment: ammendOrReprint
              
     }
         this.loadPage = true;

         console.log('GenCal Charges values', values)
 
         let url = 'ServiceCharge/CalCulateChargeAmmendReprint';

         this._GeneralService.post(values, url).subscribe(
           (data: any) => 
           {
                 console.log('Initiate data : ', data);

                 this.instrumentForm.itbId = null;
                 this.instrumentForm.serviceId =  this.serviceId;
                 this.instrumentForm.origDeptId = null;
                 this.instrumentForm.referenceNo =  null;
                 this.instrumentForm.branchNo = data.instrumentAcctDetails.nBranch;
                 this.instrumentForm.acctType = data.instrumentAcctDetails.sAccountType;  //
                 this.instrumentForm.acctName = data.instrumentAcctDetails.sName;
                 this.instrumentForm.availBal =  data.instrumentAcctDetails.nBalance;

                 this.instrumentForm.availBal =  data.instrumentAcctDetails.nBalance;
                // this.instrumentForm.availBalString = data.instrumentAcctDetails.nBalance ;
                 this.instrumentForm.acctSic =  data.instrumentAcctDetails.sSector ;
                 this.instrumentForm.acctStatus =  data.instrumentAcctDetails.sStatus ;
                 this.instrumentForm.ccyCode = data.instrumentAcctDetails.sCrncyIso ;
                // this.instrumentForm.serialNo = this.instrumentForm.serialNo ;
                 this.instrumentForm.rsmId =  data.instrumentAcctDetails.sRsmId == null ? 0 : data.instrumentAcctDetails.sRsmId ;
                 //this.instrumentForm.instrumentCcy = this.instrumentForm.ccyCode;
                 this.instrumentForm.acctProductCode = data.instrumentAcctDetails.sProductCode;
                 this.instrumentForm.acctCustNo = data.instrumentAcctDetails.sCustomerId;
                 // Contigent
                  
                  this.instrumentForm.branchName =  data.instrumentAcctDetails.sBranchName ;

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
           
               
               this.loadPage = false;
 
               if(data.instrumentAcctDetails.nErrorCode !== 0)
               {
                 
                 Swal('', data.instrumentAcctDetails.sErrorText, 'error');
                 return;
               }
             
           },
           (error: any) => 
           {
             this.loadPage = false;
             Swal('', error.error.responseMessage, 'error');
         });
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

    let userDetails = this._GeneralService.getUserDetails();

   let instrumentForm = this.instrumentForm;
  

 



    let values =  {  

              acctNo :   this.instrumentForm.acctNo,
              acctType : this.instrumentForm.acctType,
              transAmout: '0',
              ListoprServiceCharge : this.chargeFormList, //this.chargeSetup,
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

                this.instrumentForm.itbId = instrumentForm.itbId,
                this.instrumentForm.serviceId =  null,
                this.instrumentForm.origDeptId  = null,
                this.instrumentForm.referenceNo  = null,
                this.instrumentForm.branchNo  = data.instrumentAcctDetails.nBranch,
                this.instrumentForm.acctType  = data.instrumentAcctDetails.sAccountType,  //
                this.instrumentForm.acctName  = data.instrumentAcctDetails.sName,
                this.instrumentForm.availBal  =  data.instrumentAcctDetails.nBalanceDec,
             
                this.instrumentForm.acctSic  =  data.instrumentAcctDetails.sSector,
                this.instrumentForm.acctStatus  =  data.instrumentAcctDetails.sStatus,
                this.instrumentForm.ccyCode  =  data.instrumentAcctDetails.sCrncyIso,
              
                this.instrumentForm.rsmId  =   data.instrumentAcctDetails.sRsmId,
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
              console.log('this.basicform after Cal: ' , this.instrumentForm);
              

              this.loadPage = false;

              if(data.instrumentAcctDetails.nErrorCode !== 0)
              {
                console.log('instrumentForm: ' , instrumentForm);
               
        
                Swal('', data.instrumentAcctDetails.sErrorText, 'error');
                return;
              }
          

            
          },
          (error: any) => {
            
            this.loadPage = false;
         
            Swal('', this.errorOccur, 'error');
        });
  }



  ngAfterViewInit()  
  {
    this.settings.loadingSpinner = false; 
  }

  close(): void 
  {

    this.dialogRef.close(this.reloadLoad);
  }

  
  swapTab(value){
    console.log('swapTab: ', value);

    
    if(value === 1){
      this.tab1 = 'active';
      this.tab2 = '';
      this.tab3 = '';
      this.tab4 = '';
      this.tab5 = '';
    }
    if(value === 2){
      this.tab1 = '';
      this.tab2 = 'active';
      this.tab3 = '';
      this.tab4 = '';
      this.tab5 = '';
    }
    if(value === 3){
      this.tab1 = '';
      this.tab2 = '';
      this.tab3 = 'active';
      this.tab4 = '';
      this.tab5 = '';
    }
    if(value === 4){
      this.tab1 = '';
      this.tab2 = '';
      this.tab3 = '';
      this.tab4 = 'active';
      this.tab5 = '';
    }
    if(value === 5){
      this.tab1 = '';
      this.tab2 = '';
      this.tab3 = '';
      this.tab4 = '';
      this.tab5 = 'active';
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

   //Below is for PerfBond service Id  18
   validationForPerfBond(serviceId) : any {
     
    if(this.instrumentForm.acctNo == null){
      swal('','Instrument acct No is required', 'error')
      return true;
    }

    if(this.instrumentForm.acctType == null){
      swal('','Instrument  acct Type is required', 'error')
      return true;
    }

    if(this.instrumentForm.acctName == null){
      swal('','Instrument acct Name is required', 'error')
      return true;
    }

    if(this.instrumentForm.ccyCode == null){
      swal('','Instrument acct Currency is required', 'error')
      return true;
    }

    if(this.instrumentForm.availBal == null){
      swal('','Instrument acct Available Balance is required', 'error')
      return true;
    }

    if(this.instrumentForm.acctSic  == null){ 
      swal('','Instrument acct sector is required', 'error')
      return true;
    }

    if(this.instrumentForm.branchName == null){
      swal('','Instrument acct Branch is required', 'error')
      return true;
    }

    if(this.instrumentForm.ccyCode == null){
      swal('','Instrument Curreny is required', 'error')
      return true;
    }

    if(this.instrumentForm.creditAmount == null){
      swal('','Instrument Credit Amount is required', 'error')
      return true;
    }

 


    if(this.instrumentForm.addresseeName == null){
      swal('','Instrument Adressee Name  is required', 'error')
      return true;
    }
    if(this.instrumentForm.addr1 == null){
      swal('','Instrument Address Line 1 is required', 'error')
      return true;
    }

    // if(this.instrumentForm.addressLine2 == null){
    //   swal('','Instrument Address Line 2 is required', 'error')
    //   return true;
    // }

    // if(this.instrumentForm.addressLine3 == null){
    //   swal('','Instrument Address Line 3 is required', 'error')
    //   return true;
    // }
    // if(this.instrumentForm.addressLine4 == null){
    //   swal('','Instrument Address Line 4 is required', 'error')
    //   return true;
    // }


    //collateral Start here
    /*if(this.CollateralForm.collTypeId == null){
      swal('','Collateral Type is required', 'error')
      return true;
    }
    if(this.CollateralForm.acctType == null){
      swal('','Collateral Acct Type is required', 'error')
      return true;
    }
    if(this.CollateralForm.acctNo == null){
      swal('','Collateral Acct acctNo is required', 'error')
      return true;
    }

    if(this.CollateralForm.availBal == null){
      swal('','Collateral Acct Avail Balance is required', 'error')
      return true;
    }

    if(this.CollateralForm.acctCCy == null){
      swal('','Collateral Acct Type is required', 'error')
      return true;
    }

    if(this.CollateralForm.acctStatus == null){
      swal('','Collateral Acct status is required', 'error')
      return true;
    }

    if(this.CollateralForm.acctName == null){
      swal('','Collateral Acct Name is required', 'error')
      return true;
    }

    if(this.CollateralForm.holdId == null){
      swal('','Collateral Hold Id is required', 'error')
      return true;
    }

    if(this.CollateralForm.lienAmount == null){
      swal('','Collateral Lien Amount is required', 'error')
      return true;
    }

    if(this.CollateralForm.effectiveDate == null){
      swal('','Collateral Effective Date is required', 'error')
      return true;
    }

    if(this.CollateralForm.expiryDate == null){
      swal('','Collateral Expiry Date is required', 'error')
      return true;
    }

    if(this.CollateralForm.collMortgageNo == null){
      swal('','Collateral Mortgage No is required', 'error')
      return true;
    }

    if(this.CollateralForm.valuer == null){
      swal('','Collateral Valuer is required', 'error')
      return true;
    }
    if(this.CollateralForm.verifiedBy == null){
      swal('','Collateral Verified By is required', 'error')
      return true;
    }
    if(this.CollateralForm.verificationDate == null){
      swal('','Collateral Verification Date is required', 'error')
      return true;
    }
    if(this.CollateralForm.marketValue == null){
      swal('','Collateral Market Value is required', 'error')
      return true;
    }

    if(this.CollateralForm.forcedSaleValue == null){
      swal('','Collateral Forced Sale Value is required', 'error')
      return true;
    }
    if(this.CollateralForm.ccyCode == null){
      swal('','Collateral Currency is required', 'error')
      return true;
    }
    if(this.CollateralForm.location == null){
      swal('','Collateral location is required', 'error')
      return true;
    }
    if(this.CollateralForm.collDescription == null){
      swal('','Collateral Description is required', 'error')
      return true;
    }*/
 //collateral End  here
   //Insurance
/*
   if(this.instrumentForm.insuranceCoyName == null){
    swal('','Insurance Coy Name is required', 'error')
    return true;
  }

  if(this.instrumentForm.insuranceCoyName == null){
    swal('','Insurance insured is required', 'error')
    return true;
  }

  if(this.instrumentForm.insuranceSumAssured == null){
    swal('','Insurance Sum Assured is required', 'error')
    return true;
  }

  
  if(this.instrumentForm.insuranceCurrency == null){
    swal('','Insurance Currency is required', 'error')
    return true;
  }
  if(this.instrumentForm.insuranceLocationOfProperty == null){
    swal('','Insurance Property Location is required', 'error')
    return true;
  }

  if(this.instrumentForm.insuranceCoverTypeId == null){
    swal('','Insurance Cover Type is required', 'error')
    return true;
  }

  if(this.instrumentForm.insurancePolicyNo == null){
    swal('','Insurance Policy No is required', 'error')
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

  if(this.instrumentForm.insurancePremiumPayable == null){
    swal('','Insurance Premium Payable is required', 'error')
    return true;
  }
     */       
  
   }
  
   valAssingCol(event) : any
   {
    let val = Number(event.target.value);
     console.log('valcol', val);
     console.log(' this.CollateralTypes',  this.CollateralTypes);
     
     let get = new List<CollateralType>(this.CollateralTypes).FirstOrDefault(c=> c.collTypeId === val);
    
     console.log('valcol get1', get);

      this.collTypeselect = get.collateralName;


   }

   collateralValidation(rec: CollateralForm)
   {
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
      (data: any) => 
      {
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
        
       for(let i = 0; i < this.CollateralForm.length; i++){
       
        var getRec = this.CollateralForm.filter(c=> c.collateralName === this.CollateralForm[i].collateralName);
        if(getRec != undefined)
        {
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


        console.log('this.CollateralForm',  this.CollateralForm);
  
      },
      (error: any) => 
      {
        console.log('getById: ' ,error.error);
        
    });
       
   }

   updateHold(rec: CollateralForm): any{

    console.log('updateHold this.CollateralForm.placeHoldBoolean', rec.placeHoldBoolean);
    console.log('updateHold this.CollateralForm.holdId', rec.holdId);
    

    if(rec.placeHoldBoolean === false && rec.placeHold === 'Y')
    {
    
    
    Swal({
      title: '',
      text: `Are you sure you want Remove the Hold on the Collateral Account (${rec.acctNo})?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Cancel'
    }).then((result) => {
       if (result.value) 
       {
       // this.CollateralForm.placeHold = 'N';
       // this.CollateralForm.placeHoldBoolean = false;
       for(let i = 0; i < this.CollateralForm.length; i++){

        if( this.CollateralForm[i].collTypeId === rec.collTypeId)
        {
          this.CollateralForm[i].placeHoldBoolean = true;
        }

       }

        } else if (result.dismiss === Swal.DismissReason.cancel) 
        {
      //  this.CollateralForm.placeHold = 'Y';
        //this.CollateralForm.placeHoldBoolean = true;
        }
      });
     }
   }

    colSelected(rec: CollateralType) {
      
     console.log('colSelected collTypeId ', rec.collTypeId);

     let get = new List<CollateralType>(this.CollateralTypes).FirstOrDefault(c=> c.collTypeId === rec.collTypeId);

     
     if(get !== undefined)
     { 
          let check = new List<CollateralForm>(this.CollateralForm).FirstOrDefault(c=> c.collateralName === get.collateralName);
 
          if(check === undefined)
          {
         
            this.CollateralForm.push({
                    itbId				: 0,
                    serviceId			:  null,
                    serviceItbId		:    null,
                    collTypeId			:    rec.collTypeId,
                    collDescription		:  null,
                    acctNo				:      null,
                    acctType			:  null,
                    availBal			:  null,
                    acctName			:  null,
                    acctStatus			:  null,       
                    acctCCy				:    null,        
                    holdId				:    null,        
                    lienAmount			:  null,        
                    collStatus			:  null,       
                    forcedSaleValue		:  null, 
                    effectiveDate		:    null, 
                    expiryDate			:    null, 
                    location			:      null, 
                    ccyCode				:      null, 
                    valuer				:      null,
                    verifiedBy			:    null, 
                    verificationDate	:  null, 
                    marketValue			:    null, 
                    insCoyName		:      null, 
                    insured :            null, 
                    insCoverTypeId :     null, 
                    policyNo :           null, 
                    sumAssured :         null, 
                    premiumPayable :     null, 
                    collMortgageNo		:  null, 
                    userId				:  null,
                    status				:  null, 
                    dateCreated			:  null,
                    placeHoldBoolean: null, 
                    placeHold:  null, 
                    selected: true, 
                    collateralName:  get.collateralName
   
            })

            this.orderby();
            return;
          }
          else
          {
               console.log('colSelected check 2 this.CollateralForm', this.CollateralForm);
               for(let i = 0; i < this.CollateralForm.length; i++ )
               {
                 
                    if(this.CollateralForm[i].collTypeId === rec.collTypeId)
                    {
                     
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

   orderby()
   {
     this.CollateralForm = new List<CollateralForm>(this.CollateralForm).OrderBy(c => c.collTypeId).ToArray();
  
   }

   onAmmend(event)  {
    let id = Number(event.target.value);
   // console.log(' onAmmend id',  id);
    this.singleadmAmendReprintReason = new List<admAmendReprintReason>(this.admAmendReprintReason).FirstOrDefault(c=> c.reasonId === id)
   // console.log(' this.singleadmAmendReprintReason',  this.singleadmAmendReprintReason);
  //  console.log(' this.singleadmAmendReprintReason',  this.admAmendReprintReason);
    if(this.singleadmAmendReprintReason.chargeable === true){
      Swal({

        title: '',
        text: 'This reason requires Charges. Are you Sure you want to Continue?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: this.btnConfirm, 
        cancelButtonText: 'Cancel',
        allowEscapeKey : false,
        allowOutsideClick: false
  
      }).then((result) => {
  
        if (result.value) 
        {
          this.reAmmend();
        }
        else if (result.dismiss === Swal.DismissReason.cancel) 
        {
          this.admAmendReprintReason = this.admAmendReprintReasonTemp; 
          this.instrumentForm.ammendOrRepreintReasonId = undefined;
        }
      });
    }

    
   
      
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

  openMandate(data:Mandate[]){
    let dialogRef = this.dialog.open(ViewMandateDetailsComponent, {
  
      // width: '3500px',
      // height: '800px',
      // hasBackdrop: true,
       disableClose: true,
      // autoFocus: true,
      data: {  data: data, 
            
            },
     
    });
  
    dialogRef.afterClosed().subscribe(result => {
      
      
     
    });
  }

  // for currencyCode

  onChangeAcctType(acctype: any): any {


    //console.log(acctype.target.value);
 
    this.acct1 = acctype.target.value.trim();
 
    //this.accountNumber = '';
    //this.maxLength = 0;
    this.instrumentForm.acctNo = '';
   
   if(this.acct1 == '' || this.acct1 == undefined){
 
      Swal('', 'select an account Type', 'error');
      return;
    }
    else{
     this._GeneralService.onChangeAcctTypeFormat(acctype, "").
     subscribe((result:any ) => {
         this.admAccountTypeModel = result;
             
         //console.log('onChangeAcctType this.admAccountTypeModel:  ' , this.admAccountTypeModel);
         //this.maxLength = 20;
     });
 
    
    }
 
 
  }
 

  acctFormatType(value: any, acctType: any)
  {
     let val = value.target.value;
     this.checkValue = false;
     
    if(acctType !== undefined)
    {
 
      //console.log("account type defined ");
 
      if(this.admAccountTypeModel.accountFormat.includes('-')){
 
       const lengt = this.admAccountTypeModel.accountFormat.split('-');
       const maxLength = this.admAccountTypeModel.acctLenght;
       //console.log('lengt: ', lengt);
 
       
 
       if(lengt.length > 0 && lengt.length == lengt.length) {
 
         const fistArraValue0 = lengt[0].length;
         const fistArraValue1 = lengt[1].length;
         const fistArraValue2 = lengt[2].length;
         const fistArraValue3 = lengt[3].length;
 
 
         var v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
         
       // ##-###-#-#####
       //console.log('fistArraValue0: ', fistArraValue0);
       if (v.length > fistArraValue0) {
         v = [v.slice(0, fistArraValue0), '-', v.slice(fistArraValue0)].join('');
       }
 
       const next = fistArraValue0 + fistArraValue1 + 1;
       //console.log('next: ', next);
        
       if (v.length > next){
         v = [v.slice(0, next), '-', v.slice(next)].join('');
       }
 
       const next1 = fistArraValue0 + fistArraValue1 + fistArraValue2 + 2;
 
       //console.log('next1: ', next1);
         
       if (v.length > next1){
         v = [v.slice(0, next1), '-', v.slice(next1)].join('');
       }
       const next2 = maxLength;
       //console.log('next2: ', next2);
       if (v.length > next2) {
         v = v.slice(0, next2);
       }
         
        
       this.instrumentForm.acctNo = v;
      
       }
 
       //return v;
 
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
     //console.log('values ' + value);
     if(value != '' || value != undefined){
      //console.log('values ' + value);
      //console.log('account ' + this.instrumentForm.acctNo);
      this.validateAcct(value);
     }
  }


 getAccountFormat(accountType: any){

  let url = `AccountType/GetAccountFormat/${accountType}`;
  
  this._GeneralService.get(url).
  subscribe((result : any) => {
    console.log('account format ' + result);
  });

}

approve(): void {


  Swal({
    title: '',
    text: this.approveFromServiceMsg,
    type: 'warning',
    // input: 'number',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    confirmButtonColor: this.btnConfirm,
    cancelButtonText: 'Cancel'
  }).then((result) => {

    if (result.value) {

      this.loadPage = true;
      this.actionLoaderUpdate = true;
      let element = <HTMLInputElement>document.getElementById("btnApprove");

      element.disabled = true;

      let url = 'ApproveTrans/ApproveTrans';

      let val =
      {
        listGetApproveServiceDTO: this.rowsApprove,
        loginUserName: this.userDetails.userName,
        userId: this.userDetails.userId,
        transactionDate: this.userDetails.bankingDate
      }

      this._GeneralService.post(val, url).subscribe(
        (data: any) => {
          console.log('approve res: ', val);

          element.disabled = false;
          this.actionLoaderUpdate = false;
          this.loadPage = false;

          this.apiResponse = data;
          Swal('', this.apiResponse.responseMessage, 'success');
          this.reloadLoad = 'Y';
          this.close();
        },
        (error: any) => {

          this.loadPage = false;
          element.disabled = false;
          this.actionLoaderUpdate = false;

          Swal('', error.error.responseMessage, 'error');
        });
    }
    else if (result.dismiss === Swal.DismissReason.cancel) {

    }
  });


}

}




