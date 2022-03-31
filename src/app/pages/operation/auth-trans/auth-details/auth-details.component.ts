
import { TokenDetailsComponent } from './../../token/token-details/token-details.component';
import { GenModel } from './../../../../model/gen.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { CbsTransaction } from '../../../../model/cbsTransaction.model';
import { ApgDetailsComponent } from '../../apg/apg-details/apg-details.component';
import { ChqBookReqDetailsComponent } from '../../chq-book-req/chq-book-req-details/chq-book-req-details.component';
import { CounterChqReqDetailsComponent } from '../../counter-chq-req/counter-chq-req-details/counter-chq-req-details.component';
import { StopChqDetailsComponent } from '../../stop-chq/stop-chq-details/stop-chq-details.component';
import { BusinessSearchDetailsComponent } from '../../business-search/business-search-details/business-search-details.component';
import { AccountClosureDetailsComponent } from '../../account-closure/account-closure-details/account-closure-details.component';
import { CardReqDetailsComponent } from '../../card-req/card-req-details/card-req-details.component';
import { StatementReqDetailsComponent } from '../../statement-req/statement-req-details/statement-req-details.component';
import { TradeRefDetailsComponent } from '../../trade-ref/trade-ref-details/trade-ref-details.component';
import { RefLetterDetailsComponent } from '../../ref-letter/ref-letter-details/ref-letter-details.component';
import { OverdraftReqDetailsComponent } from '../../overdraft-req/overdraft-req-details/overdraft-req-details.component';
import { DocRetrievalDetailsComponent } from '../../doc-retrieval/doc-retrieval-details/doc-retrieval-details.component';
import { PinResetDetailsComponent } from '../../pin-reset/pin-reset-details/pin-reset-details.component';
import { AmortizationDetailsComponent } from '../../amortization/amortization-details/amortization-details.component';
  

@Component({
  selector: 'app-auth-details',
  templateUrl: './auth-details.component.html',
  styleUrls: ['./auth-details.component.scss']
})
export class AuthDetailsComponent implements OnInit {

  public form: FormGroup;
  actionTaken = 'N';
  basicForm: CbsTransaction;


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
chargeSetup:any[];

selectedCalss = 'selected nav-item cursorPointer';
selectedCalss2 = 'selected nav-item cursorPointer';

notServiceChargeYet =  false;

serviceId: Number;
retryService = GenModel.retryService;
retryMessage: any;
RetryAttmMsg = GenModel.RetryAttmMsg;
apiIsDown = GenModel.apiIsDown;
retryDelayServiceInterval  = GenModel.retryDelayServiceInterval;

departments = [];
users = [];
acttypes = [];
btnConfirm  = GenModel.btnConfirm;
recordDetails: any;
constructor(public appSettings: AppSettings, 
              public fb: FormBuilder,public fbSer: FormBuilder, public router: Router,
              public snackBar: MatSnackBar,
              public _waitingDialog: WaitingDialog,
              private _localStorageService: LocalStorageService,
              public _GeneralService: GeneralService,
              private http: HttpClient,
              private route: ActivatedRoute,
              private activatedRoute: ActivatedRoute,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<AuthDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any)
        {
           this.GetById(data.record);
    
        }

  ngOnInit() 
  {
       this.loadPage = false;
       this.statuses = this._GeneralService.Statuses;
       this.loadDepartment();
       this.loadUsers();
       this.loadAcctTypes();
  }

  GetById(val)
  {
   console.log('GetById statr');
    
    let values = {
      itbId: val.itbId
     }
    let url = 'PostTrans/GetById';

    this._GeneralService.post(values, url).subscribe(
      (data: any) => 
      {
        this.loadPage = false;
        this.recordDetails = data.get;
        console.log(' data.get CBS',  data.get);
        //console.log(' data.get CBS1',  data.allUsers);

        this.basicForm = data.get;

        this.basicForm.dateCreated =  this.basicForm.dateCreated != null ? this._GeneralService.dateCreated( this.basicForm.dateCreated):  this.basicForm.dateCreated;
        this.basicForm.amount =  this.basicForm.amount != null ? this._GeneralService.formatMoney( this.basicForm.amount):  this.basicForm.amount;
        this.basicForm.drAcctChargeAmt =  this.basicForm.drAcctChargeAmt != null ? this._GeneralService.formatMoney( this.basicForm.drAcctChargeAmt):  this.basicForm.amount;
       
        
      },
      (error: any) => {

        console.log('error: ', error);
        Swal('', this.errorOccur, 'error');
     });
  }

  gotoService(recordDetails: CbsTransaction)
  {
    this.loadPage = true;
    setTimeout(() => {
     this.loadPage = false;

     console.log('gotoService recordDetails: ', recordDetails.serviceId);

     if(recordDetails.serviceId == 1)
     {
     let dialogRef = this.dialog.open(TokenDetailsComponent, {
       width: '1200px',
       height: '650px',
     // hasBackdrop: true,
     
       // autoFocus: true,
       disableClose: true,
       data: { actionName: 'View', record:  recordDetails, createdBy: 1,
       itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId},
       
     });
 
     dialogRef.afterClosed().subscribe(result => {

     });

     }
     if(recordDetails.serviceId == 2)
     {

     let dialogRef = this.dialog.open(ChqBookReqDetailsComponent, {

      width: '1200px',
      height: '650px',
     // hasBackdrop: true,
     
       // autoFocus: true,
       disableClose: true,
       data: { actionName: 'View', record:  recordDetails, createdBy: 1,
       itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId},
       
     });
 
     dialogRef.afterClosed().subscribe(result => {

     });

     }
     if(recordDetails.serviceId == 3)
     {

     let dialogRef = this.dialog.open(CounterChqReqDetailsComponent, {

      width: '1200px',
      height: '650px',
     // hasBackdrop: true,
     
       // autoFocus: true,
       disableClose: true,
       data: { actionName: 'View', record:  recordDetails, createdBy: 1,
       itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId},
       
     });
 
     dialogRef.afterClosed().subscribe(result => {

     });

     }
     if(recordDetails.serviceId == 4)
     {

     let dialogRef = this.dialog.open(StopChqDetailsComponent, {

      width: '1200px',
       height: '650px',
     // hasBackdrop: true,
     
       // autoFocus: true,
       disableClose: true,
       data: { actionName: 'View', record:  recordDetails, createdBy: 1,
       itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId},
       
     });
 
     dialogRef.afterClosed().subscribe(result => {

     });

     }
     if(recordDetails.serviceId == 5)
     {

     let dialogRef = this.dialog.open(BusinessSearchDetailsComponent, {

      width: '1200px',
      height: '650px',
     // hasBackdrop: true,
     
       // autoFocus: true,
       disableClose: true,
       data: { actionName: 'View', record:  recordDetails, createdBy: 1,
       itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId},
       
     });
 
     dialogRef.afterClosed().subscribe(result => {

     });

     }
     if(recordDetails.serviceId == 6)
     {

     let dialogRef = this.dialog.open(AccountClosureDetailsComponent, {

      width: '1200px',
      height: '650px',
     // hasBackdrop: true,
     
       // autoFocus: true,
       disableClose: true,
       data: { actionName: 'View', record:  recordDetails, createdBy: 1,
       itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId},
       
     });
 
     dialogRef.afterClosed().subscribe(result => {

     });

     }
     if(recordDetails.serviceId == 7)
     {

     let dialogRef = this.dialog.open(CardReqDetailsComponent, {

      width: '1400px',
      height: '650px',
     // hasBackdrop: true,
     
       // autoFocus: true,
       disableClose: true,
       data: { actionName: 'View', record:  recordDetails, createdBy: 1,
       itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId},
       
     });
 
     dialogRef.afterClosed().subscribe(result => {

     });

     }
     if(recordDetails.serviceId == 8)
     {

     let dialogRef = this.dialog.open(StatementReqDetailsComponent, {

      width: '1400px',
      height: '650px',
     // hasBackdrop: true,
     
       // autoFocus: true,
       disableClose: true,
       data: { actionName: 'View', record:  recordDetails, createdBy: 1,
       itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId},
       
     });
 
     dialogRef.afterClosed().subscribe(result => {

     });

     }
     if(recordDetails.serviceId == 9)
     {

     let dialogRef = this.dialog.open(TradeRefDetailsComponent, {

      width: '1400px',
      height: '650px',
     // hasBackdrop: true,
     
       // autoFocus: true,
       disableClose: true,
       data: { actionName: 'View', record:  recordDetails, createdBy: 1,
       itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId},
       
     });
 
     dialogRef.afterClosed().subscribe(result => {

     });

     }
     if(recordDetails.serviceId == 10)
     {

     let dialogRef = this.dialog.open(RefLetterDetailsComponent, {

      width: '1400px',
      height: '650px',
     // hasBackdrop: true,
     
       // autoFocus: true,
       disableClose: true,
       data: { actionName: 'View', record:  recordDetails, createdBy: 1,
       itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId},
       
     });
 
     dialogRef.afterClosed().subscribe(result => {

     });

     }
     if(recordDetails.serviceId == 11 || 
        recordDetails.serviceId == 14 || 
        recordDetails.serviceId == 18 || 
        recordDetails.serviceId == 19|| 
        recordDetails.serviceId == 20)
     {

     let dialogRef = this.dialog.open(ApgDetailsComponent, {

      width: '1400px',
      height: '650px',
     // hasBackdrop: true,
     
       // autoFocus: true,
       disableClose: true,
       data: { actionName: 'View', record:  recordDetails, createdBy: 1,
       itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId},
       
     });
 
     dialogRef.afterClosed().subscribe(result => {

     });

     }
 
     if(recordDetails.serviceId == 13)
     {

     let dialogRef = this.dialog.open(OverdraftReqDetailsComponent, {

      width: '1400px',
      height: '650px',
     // hasBackdrop: true,
     
       // autoFocus: true,
       disableClose: true,
       data: { actionName: 'View', record:  recordDetails, createdBy: 1,
       itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId},
       
     });
 
     dialogRef.afterClosed().subscribe(result => {

     });

     }
   
     if(recordDetails.serviceId == 15)
     {

     let dialogRef = this.dialog.open(AmortizationDetailsComponent, {

      width: '1400px',
      height: '650px',
     // hasBackdrop: true,
     
       // autoFocus: true,
       disableClose: true,
       data: { actionName: 'View', record:  recordDetails, createdBy: 1,
       itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId},
       
     });
 
     dialogRef.afterClosed().subscribe(result => {

     });

     }
     if(recordDetails.serviceId == 16)
     {

     let dialogRef = this.dialog.open(DocRetrievalDetailsComponent, {

      width: '1400px',
      height: '650px',
     // hasBackdrop: true,
     
       // autoFocus: true,
       disableClose: true,
       data: { actionName: 'View', record:  recordDetails, createdBy: 1,
       itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId},
       
     });
 
     dialogRef.afterClosed().subscribe(result => {

     });

     }

     if(recordDetails.serviceId == 21)
     {

     let dialogRef = this.dialog.open(PinResetDetailsComponent, {

      width: '1400px',
      height: '650px',
     // hasBackdrop: true,
     
       // autoFocus: true,
       disableClose: true,
       data: { actionName: 'View', record:  recordDetails, 
       createdBy: 1, itbId: recordDetails.primaryId, serviceId: recordDetails.serviceId},
       
     });
 
     dialogRef.afterClosed().subscribe(result => {

     });

     }
     
   }, 100);
  }

  
  loadDepartment(): void {

    this.loadPage = true;
    let track = 0;
    let url = 'TradeReference/GetAll';


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
//data.record
  serviceChage(param:  any, record: any): any {

    this.loadPage = true;

    console.log('ServiceCharge param', param);

    console.log('ServiceCharge record', record);
    
    console.log('ServiceCharge param this.basicForm.value.itbid', this.basicForm.itbId);

    let val = {
      serviceId : this.basicForm.serviceId,
      serviceItbId:  this.basicForm.itbId
    }

      let url = 'ServiceCharge/GetAll';


      console.log('ServiceCharge val', val);
     
      this._GeneralService.post(val, url).subscribe(
        (data: any) => 
        {
            console.log('service Processed data: ',data);

            this.loadPage = false;
            if(data.length === 0)
            {
              console.log('service charge already not yet Processed: ',data);
                this.chargeSetup = this.chargeSetupTem;
                
                this.notServiceChargeYet = true;
               
            }
            else
            {
              console.log('service charge already Processed: ',data);

              this.chargeSetup = data;
              
            }

            for (let i = 0; i < this.chargeSetup.length; i++) 
            {

               
              
              
              
            }


 

            console.log('servive Charge ', this.chargeSetup);
        },
        (error: any) => 
        {
          this.loadPage = false;
         console.log(error); 

      });
  }



  update(): void {

    console.log('update chargeSetup: ', this.chargeSetup);

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement> document.getElementById("btnUpdate");

    element.disabled = true;
      let url = 'StatementReq/Update';
      let values = {

           oprToken: this.basicForm,
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


    let values =  {  

              acctNo :   event.target.value,
            //  acctType : this.basicForm.acctType,
        //      transAmout: this.basicForm.amount,
              ListoprServiceCharge : this.chargeSetup,
              loginUserName: userDetails.userName,
              deptId: userDetails.deptId,
              userId: userDetails.userId,
              serviceId: this.serviceId
    }


        this.loadPage = true;

        let url = 'GenChargeCal/CalCulateCharge';

        this._GeneralService.post(values, url).subscribe(
          (data: any) => 
          {
              console.log('Cal Charges: ', data);

            

            //  this.chargeSetup = [] || [];

            //  this.chargeSetup = data.chgList

             // console.log('Val this.chargeSetup: ', this.chargeSetup);

             // console.log('this.chargeSetup after nulify', this.chargeSetup);
            
              for (let i = 0; i < data.chgList.length; i++) 
              {

              }

              this.loadPage = false;

              if(data.instrumentAcctDetails.nErrorCode !== 0)
              {
                console.log('instrumentForm: ' , instrumentForm);
              
                
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
    let userDetails = this._GeneralService.getUserDetails(); 
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

}





