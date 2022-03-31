

import { GeneralService } from './../../../services/genservice.service';
import { AuthModel } from './../../../model/auth.model';
import { GenModel } from './../../../model/gen.model';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { emailValidator, matchingPasswords } from '../../../theme/utils/app-validators';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import {MatSnackBar} from '@angular/material';
import { LocalStorageModule } from 'angular-2-local-storage';
import { LocalStorageService } from 'angular-2-local-storage';
import Swal from 'sweetalert2';
import { resetFakeAsyncZone } from '@angular/core/testing';


@Component({
  selector: 'app-ver-email',
    templateUrl: './ver-email.component.html',
    styleUrls: ['./ver-email.component.scss']
})
export class VerEmailComponent implements OnInit {
  public form:FormGroup;
  public settings: Settings;
  durationsnack: number = 3000;
  displayloader: boolean = false;
  btnlogtxt: string = 'SIGN IN';
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
retryService: number =  GenModel.retryService;
retryMessage: any;
retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
internetConMsg = GenModel.internetConMsg;

userLoginInfo = GenModel.userLoginInfo;
btnConfirm = GenModel.btnConfirm;
errorOccur = GenModel.errorOccur;
loginRoleId = GenModel.loginRoleId;
msg: string;
showbtn = false;
loader = false;


  constructor(public appSettings: AppSettings, 
              public fb: FormBuilder, 
              public router: Router,
              private route: ActivatedRoute,
              private activatedRoute: ActivatedRoute,
              public snackBar: MatSnackBar,
              private storage: LocalStorageService,
              public _GeneralService: GeneralService
              )    
           {

  
    this.settings = this.appSettings.settings;

        this.form = this.fb.group({

          'password': ['', Validators.required], 
          'confirmPassword': ['', Validators.required], 
         
        },
        {  validator: matchingPasswords('password', 'confirmPassword')}  );
  }


  ngOnInit() {
  }

  gotoLogin()
  {
    this.router.navigate(['./login']);
  }


  ngAfterViewInit()  {
    this.settings.loadingSpinner = false; 
  }
}