
import { GenModel } from './../../../model/gen.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { GeneralService } from './../../../services/genservice.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, 
          FormGroupDirective, NgForm } from '@angular/forms';
import { emailValidator } from '../../../theme/utils/app-validators';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import {  WaitingDialog } from '../../../services/services';
import {MatDialog, MatSnackBar} from '@angular/material';
import { LocalStorageService } from 'angular-2-local-storage';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SweetAlertService } from '../../../services/sweetAlert.service';
import { admBankServiceSetUp } from '../../../model/admBankServiceSetUp';
import { LoginType } from '../../../model/LoginType.model';
import { LicenseComponent } from '../../login/license/license.component';
   

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss']
})
export class ClientProfileComponent implements OnInit {

  public form: FormGroup;
  basicForm: FormGroup;
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

  retryService: number =  GenModel.retryService;
  retryMessage: any;
  retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
  internetConMsg = GenModel.internetConMsg;
  RetryAttmMsg = GenModel.RetryAttmMsg;
  errorOccur= GenModel.errorOccur;
  actionLoaderSave: any;

  token = GenModel.tokenName;

  dateCreated: any;
  currentProcessingDate: any;

  bankingSystem: any[] = [];
  countries: any[] = [];
  cbs: admBankServiceSetUp[];
  statuses: any;
  loginTypes: LoginType;
  clientLogValues: string = '';
  createdBy: any;
  getUserDetails: any;
  broadCastMessage = 'Hey testing';
  showForm = false;
  showTwoFactorSelected = false;
  btnConfirm = GenModel.btnConfirm;
  
  constructor(public appSettings: AppSettings, 
              public fb: FormBuilder, public router: Router,
              public snackBar: MatSnackBar,
              public _waitingDialog: WaitingDialog,
              public dialog: MatDialog,
              private _localStorageService: LocalStorageService,
              public _GeneralService: GeneralService,
              private http: HttpClient,
              private route: ActivatedRoute,
              private activatedRoute: ActivatedRoute,
              private _sweetAlertService: SweetAlertService
        )
        {
    

    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      userName: [null, Validators.compose([Validators.required])],
      institutionCode: [null, Validators.compose([Validators.required])],
      password:  [null, Validators.compose([Validators.required])]
    });		 



 
 }
  pageLoad() {
    setTimeout(() => {
      this.loadPage = false;
    }, 500);

  }
  
  ngOnInit() {
   
      this.basicForm = new FormGroup({
        
        allowPrint:  new FormControl(null),
        bankAddress: new FormControl(null),
        bankCode: new FormControl(null),
        bankName: new FormControl(null),
        bankingSystemId: new FormControl(null),
        bbanNo: new FormControl(null),
        channelId: new FormControl(null),
        countryCode:new FormControl(null),
        currencyCode:new FormControl(null),
        currentProcessingDate: new FormControl(null),
        customerAccountNumFormat: new FormControl(null),
        dateCreated: new FormControl(null),
        enforcePasswordChangeDays: new FormControl(null),
        enforceStrngPwd: new FormControl(null),
        licenceKey: new FormControl(null),
        loginCount: new FormControl(null),
        loginIdEncryption: new FormControl(null),
        status: new FormControl(null),
        subjectToAuthorization: new FormControl(null),
        systemIdleTimeout: new FormControl(null),
        txnSubjectToApproval: new FormControl(null),
        useCBSAuth: new FormControl(null),
        useCbsLimit: new FormControl(null),
        userId: new FormControl(null),
        vaxTaxRate: new FormControl(null), 
        createdBy: new FormControl(null),
        miniPasswordLength: new FormControl(null),
        maxiPasswordLength: new FormControl(null),
        numericNumber: new FormControl(null),
        specialCharacter: new FormControl(null),
        uppercase: new FormControl(null),
        complexPassword: new FormControl(null),
        encryptLogin: new FormControl(null),
        loginType: new FormControl('')
      });
      this.getUserDetails =  this._GeneralService.getUserDetails();
    this.load();
    this.loadBankingSystem();
    this.loadCountry();
    this.statuses = this._GeneralService.Statuses;
    //this.loginTypes = this._GeneralService.loginTypes;
    this.clientLogValues = this._GeneralService.getCpLoginType();
    this.loadService(this.getUserDetails);
    console.log('call loadLoginType');
    this.loadLoginType();
  }

  check(){
    
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
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

  this._GeneralService.homePage(val, url)
  .retryWhen((err) => {

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
  }).subscribe(
    (data: any) => 
    {
      this.loadPage = false;
      this.cbs = data._response;
      console.log('this.cbs', this.cbs);
    },
    (error: any) => 
    {
    
      Swal('', error.message, 'error');

  });
}

  load(): void {

    this.loadPage = true;

    let url= 'ClientProfile/GetAll';
    console.log('call client profile');
    let val = 
      {
        "aId": 0,
        "userName": "string",
        "password": "string",
        "dateCreated": "2020-05-12T12:08:01.854Z"
      }
    
      this._GeneralService.post(val, url)
      .retryWhen((err) => {
    
        console.log('retry call ');
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
      }).subscribe(
        (data: any) => 
        {
          console.log('client', data);

          this.basicForm.patchValue({
              allowPrint:  data._response.allowPrint,
              bankAddress: data._response.bankAddress,
              bankCode: data._response.bankCode,
              bankName: data._response.bankName,
              bankingSystemId: data._response.bankingSystemId,
              channelId: data._response.channelId,
              countryCode:data._response.countryCode,
              currencyCode:data._response.currencyCode,
              enforcePasswordChangeDays: data._response.enforcePasswordChangeDays,
              enforceStrngPwd: data._response.enforceStrngPwd,
              licenceKey: data._response.licenceKey,
              loginCount: data._response.loginCount,
              loginIdEncryption: data._response.loginIdEncryption,
              status: data._response.status,
              subjectToAuthorization: data._response.subjectToAuthorization,
              systemIdleTimeout: data._response.systemIdleTimeout,
              txnSubjectToApproval: data._response.txnSubjectToApproval,
              createdBy:  data.getUSer.fullName,
              miniPasswordLength: data._response.miniPasswordLength,
              maxiPasswordLength: data._response.maxiPasswordLength,
              numericNumber: data._response.numericNumber,
              specialCharacter: data._response.specialCharacter,
              uppercase: data._response.uppercase,
              complexPassword: data._response.complexPassword,
              encryptLogin: data._response.encryptLogin,
              loginType: data._response.loginType == null ? "" : data._response.loginType
          });
          //this.clientLogValues = data._response.loginType == null ? "" : data._response.loginType;
          console.log('this.clientLogValues', this.clientLogValues);
          //this._GeneralService.setLoginType(this.clientLogValues);

          this.showForm = data._response.complexPassword == "C" ? true : false;
          this.showTwoFactorSelected = data._response.twoFactorOn == true ? true : false;
          //console.log('this.showForm1 ', this.showForm);
          this.currentProcessingDate = 
           this._GeneralService.dateconvertion(data._response.currentProcessingDate);
          this.dateCreated = this._GeneralService.dateCreated(data._response.dateCreated);
         this.createdBy = data.getUSer.fullName;
          this.loadPage = false;
            
        },
        (error: any) => 
        {
         
          this.actionLoaderSave = false;
          Swal('', error.message, 'error');

      });
  }

  
  loadLoginType()
  {
    console.log("inside the loadLoginType");

    this.loadPage = true;

    let url= 'ClientProfile/GetAllLoginType';
  
    this._GeneralService.postT(url).subscribe(
      (data: any) => {
        console.log('loginType data ', data);  
        
        this.loginTypes = data;
        console.log('this. loginTypes', this.loginTypes);
      });
  }

// Ethix,Phoenix, Finacle, Bancs, flexcube
  loadBankingSystem(): void {


    this.loadPage = true;

    let url= 'BankServiceSetUp/GetAll';
  
    let val = 
      {
        "aId": 0,
        "userName": "string",
        "password": "string",
        "dateCreated": "2020-05-12T12:08:01.854Z"
      }
    
      this._GeneralService.post(val, url)
      .retryWhen((err) => {
    
        return err.scan((retryCount) =>  {
  
          retryCount  += 1;
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
          
            this.bankingSystem =  data;
            this.loadPage = false;
            
        },
        (error: any) => 
        {
        

          this.actionLoaderSave = false;

          Swal('', this.errorOccur, 'error');

      });
  }
  

  loadCountry(): void {


    this.loadPage = true;

    let url= 'Country/GetAll';
  
    let val = 
      {
        "aId": 0,
        "userName": "string",
        "password": "string",
        "dateCreated": "2020-05-12T12:08:01.854Z"
      }
    
      this._GeneralService.post(val, url)
      .retryWhen((err) => {
    
        return err.scan((retryCount) =>  {
  
          retryCount  += 1;
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
          
            this.countries =  data;
            this.loadPage = false;
            
        },
        (error: any) => 
        {
         
          this.actionLoaderSave = false;

          Swal('', this.errorOccur, 'error');

      });
  }

  getCurrency(code: any) {

  }

  setPassword(value: any){
    if(value == "C")
     {
       this.showForm = true;
     }
    else
    {
       this.showForm = false;
       this.basicForm.get('numericNumber').patchValue(0);
       this.basicForm.get('specialCharacter').patchValue(0);
       this.basicForm.get('uppercase').patchValue(0);
    }
  }

  setTwoFactorTrue(value: any) : void
  {
    console.log('twofactor value ', value);
    this.showTwoFactorSelected = true;
  }

  setTwoFactorFalse(value: any) : void
  {
    console.log('twofactor value ', value);
    this.showTwoFactorSelected = false;
    
  }

  numberOnly(event)
  {
    const charCode = (event.which) ? event.which : event.keyCode;
    if(charCode > 31 && (charCode < 48 || charCode > 57))
    {
      return false;
    }
      return true;
  }


  update(values: Object): void {


    this.actionLoaderSave = true;
    let element = <HTMLInputElement> document.getElementById("btnUpdate");
    element.disabled = true;

  
      let url = 'ClientProfile/Update';
      let userDetails = this._GeneralService.getUserDetails();
      let val = 
      {
        admClientProfile: this.basicForm.value,
        LoginUserId: userDetails.userId
      }
    
      this._GeneralService.post(val, url).subscribe(
        (data: any) => 
        {
        
          element.disabled = false;
          this.actionLoaderSave = false;

          if(data.responseCode == 2)
            Swal('', data.responseMessage, 'success');
          else
            Swal('', data.responseMessage, 'error');
        },
        (error: any) => 
        {
          this.actionLoaderSave = false;
          element.disabled = false;

          if (error.error.responseMessage !== undefined){
            
            Swal('', error.error.responseMessage, 'error');
            return;
          }

          Swal('', this.errorOccur, 'error');

      });
  }


  ngAfterViewInit()  {
    this.settings.loadingSpinner = false; 
  }

  renewLicence(actionName, record) {

    let msg = `Click Renew License to renew it`
    Swal({

      title: '',
      text: msg,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Renew License',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'Cancel',
      allowEscapeKey: false,
      allowOutsideClick: false

    }).then((result) => {

      if (result.value) {

        //this.loginSucc = true;
        // setTimeout(() => {
        //   this.router.navigate(['./license']);
        //   //this.router.navigate(['./dashboard']);
        // }, 50);

        let dialogRef = this.dialog.open(LicenseComponent, {

          width: "1200px",
          height: "600px",
          disableClose: true,
          data: {
            actionName: actionName, record: record
          },
  
        });
  
        dialogRef.afterClosed().subscribe(result => {
  
          if (result === 'Y') {
            let getUserDetails = this._GeneralService.getUserDetails();
            //this.load(getUserDetails);
          }
        });
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
}



