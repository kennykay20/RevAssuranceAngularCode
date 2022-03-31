import {GenModel} from './../../../../model/gen.model'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { GeneralService } from './../../../../services/genservice.service';
import { Component, OnInit } from '@angular/core';
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
import { UserDetails } from '../../../../model/userDetails';
import { ChangePwdDTO } from '../../../../model/changepassword.model';
import swal from 'sweetalert2';

@Component({
  selector: 'app-change-pwd',
  templateUrl: './change-pwd.component.html',
  styleUrls: ['./change-pwd.component.scss']
})
export class ChangePwdComponent implements OnInit {

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
  loadPage = false;

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
  userId :number;
  loginId:string;
  oldPass :string;
  newPass: string;
  confirmPass:string;
  valid:boolean = true;
  username:string;
  userDetails: UserDetails
  changePwdDTO:  ChangePwdDTO;
  btnConfirm = GenModel.btnConfirm;
  resultData: any;
  format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  pattern = /[A-Z]/;
  constructor(public appSettings: AppSettings, 
              public fb: FormBuilder, public router: Router,
              public snackBar: MatSnackBar,
              public _waitingDialog: WaitingDialog,
              private _localStorageService: LocalStorageService,
              public _GeneralService: GeneralService,
              private http: HttpClient,
              private route: ActivatedRoute,
              private activatedRoute: ActivatedRoute,
        )
        {
          let param4 = this.route.snapshot.params.mid;
          console.log('**data param4', param4);
         
    this.settings = this.appSettings.settings; 
   
 }
  ngOnInit() 
  {

    this.userDetails = this._GeneralService.getUserDetails();
    
    //this.resultData = this._GeneralService.setClientProfile();

    this.getClientProfile();
    //console.log('this yyy ', this.resultData);
    this.changePwdDTO =
    {  
      loginId : '',
      oldPassword : '',
      newPassword : '',
      confirmPassword : ''  	
   }


    this.changePwdDTO.loginId = this.userDetails.userName.toUpperCase();
    
  }

  getClientProfile(): void
  {
    var url = 'ClientProfile/GetProfile';
    this._GeneralService.postT(url).subscribe(
      (data: any) => {
        this.resultData = data._response;
        //console.log('this.resultData ', this.resultData);
      });
  }

  update(): void {
    
    //console.log('another resultData2 ', this.resultData);
    if(this.resultData !== undefined)
    {
      this.updatePassword(this.resultData);
    }
  }

  updatePassword(value:any): void
  {
    //console.log('values this ', value);
    if(this.changePwdDTO.oldPassword.trim() === ''){

      swal('', 'Kindly Enter Your Old Password', 'error');
      return;
    }

    if(this.changePwdDTO.newPassword.trim() === ''){

      swal('', 'Kindly Enter Your New Password', 'error');
      return;
    }
    if(this.changePwdDTO.newPassword.length > value.maxiPasswordLength)
    {
      swal('', 'Your New Password cannot be more than maximum length of ' + value.maxiPasswordLength, 'error');
      return;
    }

    if(this.changePwdDTO.newPassword.length < value.miniPasswordLength)
    {
      swal('', 'Your New Password cannot be less than minimum length of ' + value.miniPasswordLength, 'error');
      return;
    }
    if(this.changePwdDTO.confirmPassword.trim() === ''){

      swal('', 'Kindly Enter Your Confirm Password', 'error');
      return;
    }
    
    if(this.changePwdDTO.newPassword !== this.changePwdDTO.confirmPassword){

      swal('', 'Your New Password and Confirm Password is not the same', 'error');
      return;
    }
    if(value.complexPassword == "C")
    {
      if(value.uppercase > 0){
        if(!this.pattern.test(this.changePwdDTO.newPassword))
        {
          swal('', 'Your New Password must contain atleast one Upper case letter', 'error');
          return;
        }
        
      }
      if(value.specialCharacter > 0){
        if(!this.format.test(this.changePwdDTO.newPassword))
        {
          //true match
          swal('', 'Your New Password does not contain a special character', 'error');
          return;
        }
        
      }
      if(value.numericNumber > 0){

      }
    }
    this.actionLoaderSave = true;
    let element = <HTMLInputElement> document.getElementById("btnUpdate");
    element.disabled = true;
    let url = 'ChangePassword/ChgPwd';
    
    this._GeneralService.post(this.changePwdDTO, url).subscribe(
      (data: any) => 
      {
        console.log('Save Result: ', data);

        element.disabled = false;
        this.actionLoaderSave = false;
        this.logoutOrCont();
      // Swal('', data.responseMessage, 'success'); 
      },
      (error: any) => 
      {
        this.actionLoaderSave = false;
        element.disabled = false;

        Swal('', error.error.responseMessage, 'error');

    });
      
  }


  logoutOrCont(){
    Swal({
      title: '',
      text: 'Your New Password Changed Successfully. Kindly Click On Log Out to relogin or Click On Continue to stay Logged in',
      type: 'success',
      showCancelButton: true,
      confirmButtonText: ' Log Out',
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Continue'
    }).then((result) => 
    {
      if (result.value) 
      {
        this._localStorageService.clearAll();
        this.router.navigate(['./login']);
      } else if (result.dismiss === Swal.DismissReason.cancel)
       {
        
      }
    });
  }


  ngAfterViewInit()  {
    this.settings.loadingSpinner = false; 
  }
}
