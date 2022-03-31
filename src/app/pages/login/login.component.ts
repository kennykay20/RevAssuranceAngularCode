/*Login*/

import { TermandConComponent } from './termand-con/termand-con.component';
import { GeneralService } from './../../services/genservice.service';
import { AuthModel } from './../../model/auth.model';
import { GenModel } from './../../model/gen.model';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { emailValidator, matchingPasswords } from '../../theme/utils/app-validators';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { MatSnackBar } from '@angular/material';
import { LocalStorageModule } from 'angular-2-local-storage';
import { LocalStorageService } from 'angular-2-local-storage';
import Swal from 'sweetalert2';
import { resetFakeAsyncZone } from '@angular/core/testing';
import { List } from 'linqts';
import { MatDialog } from '@angular/material/dialog';
import { LoginResponse } from '../../model/loginResponse.model';
import { AlertifyService } from '../../services/alertify.service';
import { SweetAlertService } from '../../services/sweetAlert.service';
import { ThrowStmt } from '@angular/compiler';
import { LoginType } from '../../model/LoginType.model';
import { VerifyotpComponent } from './verifyOtp/verifyotp.component';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public formApplication: FormGroup;
  public selectGroup: FormGroup;
  public form1: FormGroup;
  public formSignUp: FormGroup;
  public formVerify: FormGroup;
  public formStaff: FormGroup;
  public formCbs: FormGroup;
  public form2Fotp: FormGroup;

  hideLoginBack = GenModel.hideLoginBack;

  version = GenModel.Version;

  public settings: Settings;
  durationsnack: number = 3000;
  displayloader: boolean = false;
  btnlogtxt: string = 'SIGN IN';
  btnStaffLogin: string = 'SIGN IN';
  btn2FPinLogin: string = 'SIGN IN';
  btn2FOtpLogin: string = 'SIGN IN';
  btnverifyCode: string = 'VERIFY';
  religionlist = [
    'Muslim',
    'Christianity'
  ];

  tokenExpiryTime = GenModel.tokenExpiryTime;
  tokenCheckTimeInterval = GenModel.tokenCheckTimeInterval;
  loginSucc = false;

  userName = AuthModel.userName;
  password = AuthModel.password;
  token = GenModel.tokenName;
  retryService: number = GenModel.retryService;
  retryMessage: any;
  retryDelayServiceInterval: number = GenModel.retryDelayServiceInterval;
  internetConMsg = GenModel.internetConMsg;

  userLoginInfo = GenModel.userLoginInfo;
  btnConfirm = GenModel.btnConfirm;
  errorOccur = GenModel.errorOccur;
  loginRoleId = GenModel.loginRoleId;
  encryptKey = GenModel.EncryptKey;
  roles: any[];
  roleMorethan1 = false;
  selectedRoleId: any;
  displayloaderRole = false;
  btnlogtxtContine = 'Continue';
  btn = 'SIGN UP';
  role = GenModel.role;
  showLogin = false;
  showSignUp = false;
  hideLogin = true;

  imgId = 0;

  hide = true;
  
  loadTimeDif = 6000;
  apiIsDown = GenModel.apiIsDown;
  loginResponse: LoginResponse;
  enforcePassword = false;
  resultData: any;
  selectTypeList: LoginType;

  selectedClass = 'selected nav-item cursorPointer';
  selectedClass2 = 'selected nav-item cursorPointer';
  tab1 = '';
  tab2 = '';
  tabVlues: string = '';
  swabTabValues: string = '';
  clientLogType: string = '';
  dialogUserDetails: string;
  userNameOtp: string = '';

  constructor(public appSettings: AppSettings,
    public fb: FormBuilder,
    public fb1: FormBuilder,
    public fbSignUp: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private storage: LocalStorageService,
    public _GeneralService: GeneralService,
    public dialog: MatDialog,
    private alertify: AlertifyService,
    private sweetAlertService: SweetAlertService

  ) {

    this.settings = this.appSettings.settings;

    this.loginResponse = new LoginResponse();

    this.clientProfile();

    this.selectGroup = this.fb.group({
      selectfrm: [null]
    });
    this.formApplication = this.fb.group({
      userName: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });

    this.formStaff = this.fb.group({
      staffId: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });

    this.formCbs = this.fb.group({
      userName: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });

    this.form2Fotp = this.fb.group({
      userName: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });

    this.form1 = this.fb1.group({
      loginId: [null],
      newPassword: [null, Validators.compose([Validators.required])],
      oldPassword: [null, Validators.compose([Validators.required])],
      confirmPassword: [null, Validators.compose([Validators.required])]
    }, { validator: this.checkPasswords });


  }

  checkPasswords(group: FormGroup) {
    let pass = group.get('newPassword').value;
    let confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true }
  }

  openDialog() {
    const dialogRef = this.dialog.open(TermandConComponent);

    dialogRef.afterClosed().subscribe(result => {

    });
  }


  ngOnInit() {

    this.settings.loadingSpinner = true;
    this._GeneralService.clearAllLocalStorage();

    this.getClientProfile();
    this.router.navigate(['.']);
    //this.getVersion();
    //console.log('this.swabTabValues', this.swabTabValues);
    //this.swapTab(this.swabTabValues);
    this.loadLoginType();
  }

  getVersion()
  {
    let url= 'License/GetAppVersion';

    this._GeneralService.postT(url).subscribe(
    (data: any) => {
      console.log('loginType data ', data);  
      
      this.version = data.version;
      
    });
  }

  

  getClientProfile()
  {
    var url = 'ClientProfile/GetProfile';
    this._GeneralService.postT(url).subscribe(
      (data: any) => {
        //console.log('another data ', data);  
        
        this.resultData = data;

        if(this.resultData._response.loginType != null)
        {
          this.clientLogType = this.resultData._response.loginType;
          //alert(this.clientLogType);

          this.selectGroup.patchValue({
            selectfrm : this.resultData._response.loginType
          });
        }
        
        //console.log('another data ', this.resultData); 
        if(this.resultData._response.encryptLogin === true)
        {
          //console.log("SS")
          // document.getElementById('userName').setAttribute('type', 'password');
          // document.getElementById('staffId').setAttribute('type', 'password');
        }
        else
        {
          //console.log("YY")
          // document.getElementById('userName').setAttribute('type', 'text');
          // document.getElementById('staffId').setAttribute('type', 'text');
        }
        //console.log('another data 2 ', this.resultData);
        if(this.resultData._response.loginType === null || this.resultData._response.loginType === "")
        {
            //console.log("YY logintype null");
            this.swabTabValues = '';

            this.swapTab(this.swabTabValues);
        }
        else if(this.resultData._response.loginType === "App")
        {
          //console.log("TT logintype App");
          this.swabTabValues = 'App';
          this.swapTab(this.swabTabValues);
          
        }
        else if(this.resultData._response.loginType === "2Fpin")
        {
          //console.log("TT logintype 2f");
          this.swabTabValues = '2Fpin';
          this.swapTab(this.swabTabValues);
          
        }
        else if(this.resultData._response.loginType === "2Fotp")
        {
            //console.log("TT logintype cbs");
            this.swabTabValues = '2Fotp';
            this.swapTab(this.swabTabValues);
        }
        else if(this.resultData._response.loginType === "CBS")
        {
            //console.log("TT logintype cbs");
            this.swabTabValues = 'CBS';
            this.swapTab(this.swabTabValues);
        }
      });
  }

  loadLoginType()
  {
    //console.log("inside the loadLoginType");
    
    //this.loadPage = true;

    let url= 'ClientProfile/GetAllLoginType';
  
    this._GeneralService.postT(url).subscribe(
      (data: any) => {
        //console.log('loginType data ', data);  
        
        this.selectTypeList = data;
        
      });
  }

  swapTab(value){

    //alert('values ' + value);
    if(value === ''){
      this.tabVlues = ""; 
    }
    else if(value === 'App')
    {
      this.tabVlues = "App";
    }
    else if(value === 'CBS')
    {
      this.tabVlues = "CBS";
    }
    else if(value === '2Fpin'){
      this.tabVlues = "2Fpin";      
    }
    else if(value === '2Fotp'){
      this.tabVlues = "2Fotp";      
    }
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  public clientProfile(): any {


    let url = 'Licence/License';

    let values = {
      userName: "",
      password: ""
    }

    this.loginSucc = true;

    this._GeneralService.login(values, url)
      .subscribe((data: any) => {

        this.loginSucc = false;
        this.loginResponse = data._response;

        //console.log('this.loginResponse: ', this.loginResponse);

        if (this.loginResponse.errorCode === -1000) {

          this.licenseExpires(this.loginResponse.errorMessage)
          return;
        }

      },
        (error: any) => {

          console.log('error Login', error);


        });

  }

  formChange(event: any){
    //console.log("events ", event.target.value);
    this.swapTab(event.target.value);
  }
  test() {
    this.alertify.success('test()');
  }

  public TestForAlert(values: any): any {

    /*
     The commented below is for AlertifyJs alert, if Ok button is clicked, the the test() will be called
    this.alertify.confirm('Are you sure you want to delete this photo', () => {
      this.test();
    });
    */
    // The commented below is for Sweet alert, if Ok button is clicked, the the test() will be called
    this.sweetAlertService.confirm("title", "alert Text", "Yes, Continue", "Cancel", () => {
      this.test();
    });

  }
  public onSubmitApplication(values: any): any {

    //console.log('onSubmit values: ', values);
    let trackRetryAPi = 0;
    let url = 'Authentication/AAuth';
    let loginTp = "App"

    let val = {
      userName: values.userName,
      password: values.password,
      loginType: loginTp
    };
    
   // console.log('url values: ', url);


    this.btnlogtxt = 'Authenticating...';

    //console.log('onSubmit values: ', values);

    this.displayloader = true;

    if (this.formApplication.valid) {

      //console.log('swapTabVal ', this.swabTabValues);
      this._GeneralService.login(val, url)
        .subscribe((data: any) => {

         console.log('sucess Login data', data);

          

          if (data.errorCode != 0) {
            this.resetSign();
            if (data.licenseErrMsg != undefined) {
              Swal('', data.licenseErrMsg, 'error');
            }
          }

          if (data.response.errorCode != undefined) {

            if (data.response.errorCode == 0) {
              
              console.log('app login ', data);
              this._GeneralService.saveMenu(data);
              this._GeneralService.saveUserDetails(data);
              this._GeneralService.setCpLoginType(data.userDetails.loginType);
              this._GeneralService.setUserLoginType(data.userDetails.userLoginType);

              this.loginSucc = true;
              setTimeout(() => {
                this.router.navigate(['./dashboard']);
              }, 50);
            }
          }

        },
          (error: any) => {

            console.log('error Login', error)

            
            this.resetSign();
            
            if (error.error.errorCode == -5) {
              //console.log('ghghgh ')
              Swal('', error.error.errorMessage, 'error');
              //this.loginSucc = true;
              this.enforcePassword = true;
              this.btnlogtxt = 'CHANGE PASSWORD';
              return;

            }

            if (error.error.licenseErrorCode === -1000) {

              this.licenseExpires(error.error.errorMessage)
              return;
            }

            Swal('', error.error.errorMessage, 'error');

          });
    }
  }

  public onSubmitCbs(values: any): any{
    //console.log('onSubmitCbs values: ', values);
    let trackRetryAPi = 0;
    let url = 'Authentication/AAuth';

    let loginTp = "CBS";

    let val = {
      userName: values.userName,
      password: values.password,
      loginType: loginTp
    };
   // console.log('url values: ', url);


    this.btnlogtxt = 'Authenticating...';

    //console.log('onSubmit values: ', values);

    this.displayloader = true;

    if (this.formCbs.valid) {

      //console.log('swapTabVal ', this.swabTabValues);
      this._GeneralService.login(val, url)
        .subscribe((data: any) => {

          if (data.errorCode != 0) {
            this.resetSign();
            if (data.licenseErrMsg != undefined) {
              Swal('', data.licenseErrMsg, 'error');
            }
          }

          if (data.response.errorCode != undefined) {

            if (data.response.errorCode == 0) {
              console.log('csb login data ', data);
              this._GeneralService.saveMenu(data);
              this._GeneralService.saveUserDetails(data);
              this._GeneralService.setCpLoginType(data.userDetails.loginType);
              this._GeneralService.setUserLoginType(data.userDetails.userLoginType);
              this.loginSucc = true;
              setTimeout(() => {
                this.router.navigate(['./dashboard']);
              }, 50);
            }
          }

        },
          (error: any) => {

            //console.log('error Login', error)

           
            this.resetSign();
            
            if (error.error.errorCode == -5) {
              //console.log('ghghgh ')
              Swal('', error.error.errorMessage, 'error');
              //this.loginSucc = true;
              this.enforcePassword = true;
              this.btnlogtxt = 'CHANGE PASSWORD';
              return;

            }

            if (error.error.licenseErrorCode === -1000) {

              this.licenseExpires(error.error.errorMessage)
              return;
            }

            Swal('', error.error.errorMessage, 'error');

          });
    }
  }

  onSubmitTwoFactorPin(values: any): any
  {
    let trackRetryAPi = 0;
    let url = 'Authentication/AAuth';

    let loginTp = "2Fpin";
    let val = {
      staffId: values.staffId,
      password: values.password,
      loginType: loginTp
    };
   // console.log('url values: ', url);


    this.btn2FPinLogin = 'Authenticating...';

    //console.log('onSubmit values: ', values);

    this.displayloader = true;

    if (this.formStaff.valid) {

      //console.log('swapTabVal ', this.swabTabValues);
      this._GeneralService.login(val, url)
        .subscribe((data: any) => {

         //  console.log('sucess Login data', data);

          // console.log('error Login error.error.errorCode = ', data.errorCode);
         

          if (data.errorCode != 0) {
            this.resetSign();
            if (data.licenseErrMsg != undefined) {
              Swal('', data.licenseErrMsg, 'error');
            }
          }

          if (data.response.errorCode != undefined) {

            if (data.response.errorCode == 0) {
              //console.log('2fpin login data ', data);
              this._GeneralService.saveMenu(data);
              this._GeneralService.saveUserDetails(data);
              this._GeneralService.setCpLoginType(data.userDetails.loginType);
              this._GeneralService.setUserLoginType(data.userDetails.userLoginType);
              this.loginSucc = true;
              setTimeout(() => {
                this.router.navigate(['./dashboard']);
              }, 50);
            }
          }

        },
          (error: any) => {

            //console.log('error Login', error)

            // console.log('error Login error.error.errorCode', error.error.errorCode);
           
            this.resetSign();
            
            if (error.error.errorCode == -5) {
              //console.log('ghghgh ')
              Swal('', error.error.errorMessage, 'error');
              //this.loginSucc = true;
              this.enforcePassword = true;
              this.btn2FPinLogin = 'CHANGE PASSWORD';
              return;

            }

            if (error.error.licenseErrorCode === -1000) {

              this.licenseExpires(error.error.errorMessage)
              return;
            }

            Swal('', error.error.errorMessage, 'error');

          });
    }
  }

  onSubmitTwoFactorOtp(values: any): any
  {
    let trackRetryAPi = 0;
    let url = 'Authentication/AAuth';

    let loginTp = "2Fotp";

    let val = {
      userName: values.userName,
      password: values.password,
      loginType: loginTp
    };
   //console.log('url values: ', url);


    this.btn2FOtpLogin = 'Authenticating...';

    //console.log('onSubmit values: ', values);

    this.displayloader = true;

    if (this.form2Fotp.valid) {

      //console.log('swapTabVal ', this.swabTabValues);
      this._GeneralService.login(val, url)
        .subscribe((data: any) => {

         console.log('sucess Login data', data);

          // console.log('error Login error.error.errorCode = ', data.errorCode);
          
          if (data.errorCode != 0) {
            this.resetSign();
            if (data.licenseErrMsg != undefined) {
              Swal('', data.licenseErrMsg, 'error');
            }
          }

          if (data.response.errorCode != undefined) {

            console.log('2fotp login data ', data.response);
            if (data.response.errorCode == 0) {
              
              this._GeneralService.saveMenu(data);
              this._GeneralService.saveUserDetails(data);
              this._GeneralService.setCpLoginType(data.userDetails.loginType);
              this._GeneralService.setUserLoginType(data.userDetails.userLoginType);
              this.loginSucc = true;
              setTimeout(() => {
                this.router.navigate(['./dashboard']);
              }, 50);
            }
            else if(data.response.errorCode == 9)
            {
              this._GeneralService.saveMenu(data);
              this._GeneralService.saveUserDetails(data);
              this._GeneralService.setCpLoginType(data.userDetails.loginType);
              this._GeneralService.setUserLoginType(data.userDetails.userLoginType);
              console.log('2fotp login data response === 9');
              Swal('Success!', data.response.errorMessage, 'success');
              //show the verification box
              //alert('call action dialog method');
              this.action(values.userName, "");
            }
          }

        },
          (error: any) => {

            console.log('error Login', error)

            // console.log('error Login error.error.errorCode', error.error.errorCode);
            
            this.resetSign();
            
            if (error.error.errorCode == -5) {
              //console.log('ghghgh ')
              Swal('', error.error.errorMessage, 'error');
              //this.loginSucc = true;
              this.enforcePassword = true;
              this.btn2FOtpLogin = 'CHANGE PASSWORD';
              return;

            }

            if (error.error.licenseErrorCode === -1000) {

              this.licenseExpires(error.error.errorMessage)
              return;
            }

            Swal('', error.error.errorMessage, 'error');

          });
    }
  }


  onVerify(value: any): any{

    this.btnverifyCode = 'Loading...';

    //console.log('onSubmit values: ', values);

    this.displayloader = true;
    if(this.formVerify.valid)
    {
      //console.log('values ', value);
      this.displayloader = false;
    }
    else{
      //console.log('Please enter verify code ');
      this.displayloader = false;
      this.btnverifyCode = 'VERIFY';
    }
    
  }

  licenseExpires(message) {

    let msg = `${message} or Click Renew License to renew it`
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

        this.loginSucc = true;
        setTimeout(() => {
          this.router.navigate(['./license']);
          //this.router.navigate(['./dashboard']);
        }, 50);
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
  ngAfterViewInit() {
    this.settings.loadingSpinner = false;
  }

  resetSign() {

    this.btnlogtxt = 'SIGN IN';
    this.btnStaffLogin = 'SIGN IN';
    this.btn2FOtpLogin = 'SIGN IN';
    this.btn2FPinLogin = 'SIGN IN';
    this.loginSucc = false;
    this.displayloader = false;

  }

  public onChangePassword(values: any): any {

    //console.log('onSubmit values: ', values);
    let trackRetryAPi = 0;
    let url = 'ChangePassword/ChgPwd';


    //console.log('url values: ', url);

    let vals = {
      loginId: this.formApplication.value.userName == null ? this.form2Fotp.value.userName : this.formApplication.value.userName,
      OldPassword: this.form1.value.oldPassword,
      NewPassword: this.form1.value.newPassword,
      ConfirmPassword: this.form1.value.confirmPassword
    }

    this.btnlogtxt = 'Changing Password...';

    //console.log('onChange values: ', vals);

    this.displayloader = true;

    if (this.form1.valid) {

      this._GeneralService.post(vals, url)
        .subscribe((data: any) => {

          //console.log('error Login data', data);
          //this.loginSucc = true;
          this.enforcePassword = false;
          Swal('', 'Password Changed Successfully', 'success');

          this.btnlogtxt = 'SIGN IN';
          this.resetSign();

        },
          (error: any) => {

            //console.log('error Login', error)

            //console.log('error Login error.error.errorCode', error.error.errorCode);
            //console.log('error Login error.error.licenseErrorCode', error.error.licenseErrorCode);
            console.log('error Login error.error.errorMessage', error.error.errorMessage)
            //this.resetSign();
            if (error.error.licenseErrorCode === -1000) {

              //this.licenseExpires(error.error.errorMessage)
              return;
            }

            Swal('', error.error.errorMessage, 'error');

          });
    }
  }

  loadPage = false;
  action(loginId: any, record: any): void
  {
   
    console.log('loginId ', loginId);
    this.loadPage = true;
     setTimeout(() => {
      this.loadPage = false;
      let dialogRef = this.dialog.open(VerifyotpComponent, {
         width: '500px',
          height: '220px',
        data: { userName: loginId, record:  record},
        
      });
  
      dialogRef.afterClosed().subscribe(result => {
        
        if(result === 'Y'){
          //let getUserDetails =  this._GeneralService.getUserDetails();
          //this.dialogUserDetails = getUserDetails;
          //this.load(getUserDetails);
        }
       
      });
      
    }, 100);
  }
}