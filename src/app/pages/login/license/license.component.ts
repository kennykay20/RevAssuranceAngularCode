import { GeneralService } from './../../../services/genservice.service';
import { AuthModel } from './../../../model/auth.model';
import { GenModel } from './../../../model/gen.model';
import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { emailValidator, matchingPasswords } from '../../../theme/utils/app-validators';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
// import {  WaitingDialog } from '../../services/services';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageModule } from 'angular-2-local-storage';
import { LocalStorageService } from 'angular-2-local-storage';
import Swal from 'sweetalert2';
import { resetFakeAsyncZone } from '@angular/core/testing';
import swal from 'sweetalert2';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})
export class LicenseComponent implements OnInit {
  public form: FormGroup;
  public settings: Settings;
  durationsnack: number = 3000;
  displayloader: boolean = false;
  btnChangPwd: string = 'SUBMIT';
  btnReturn: string = 'Return';

  tokenExpiryTime = GenModel.tokenExpiryTime;
  tokenCheckTimeInterval = GenModel.tokenCheckTimeInterval;
  loginSucc = true;

  userName = AuthModel.userName;
  password = AuthModel.password;
  token = GenModel.tokenName;
  retryService: number = GenModel.retryService;
  retryMessage: any;
  retryDelayServiceInterval: number = GenModel.retryDelayServiceInterval;
  internetConMsg = GenModel.internetConMsg;
  reloadLoad: any;

  userLoginInfo = GenModel.userLoginInfo;
  btnConfirm = GenModel.btnConfirm;
  errorOccur = GenModel.errorOccur;
  loginRoleId = GenModel.loginRoleId;
  roles: any[];
  roleMorethan1 = false;
  selectedRoleId: any;
  displayloaderRole = false;
  btnChangPwdContine = 'Continue';
  role = GenModel.role;
  tokenEmailCon: any;
  displayloaderLogin = false;
  actionDiaplayName = "";
  constructor(public appSettings: AppSettings,
    public fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private storage: LocalStorageService,
    public _GeneralService: GeneralService,
    public dialogRef: MatDialogRef<LicenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.settings = this.appSettings.settings;
    this.form = this.fb.group(
      {
        licenseKey: [null, Validators.compose([Validators.required])],
      });
    this.actionDiaplayName = data.actionName;
  }
  pageLoad() {
    setTimeout(() => {
      this.loginSucc = false;
    }, 100);
  }

  ngOnInit() {

    this.pageLoad();
  }

  ngOnInit1() {
    this.pageLoad();
  }

  gologin() {
    this.router.navigate(['./login']);

  }

  public onSubmit(values: any): any {

    console.log('onSubmit change Start: ', values);
    let url = 'Licence/NewLicense';
    this.loginSucc = true;

    let Body = {
      LicenseKey: values.licenseKey,

    };

    console.log('Body change Body: ', Body);

    this._GeneralService.post(Body, url).subscribe(
      (data: any) => {

        console.log('onSubmit change Sucess: ', data);
        this.btnChangPwd = 'SUBMIT';
        this.loginSucc = false;
        this.form.reset();
        swal('', data.responseMessage, 'success');


      },
      (error: any) => {
        this.btnChangPwd = 'SUBMIT';
        this.loginSucc = false;
        Swal('', error.error.responseMessage, 'error');

      });
  }

  getMenubyRole(roleInfo: any): any {
    //// console.log('getMenubyRole selected Records: ', roleInfo);
    this.selectedRoleId = roleInfo;
    //// console.log('getMenubyRole for role id this.selectedRoleId: ', this.selectedRoleId);
  }

  contineAfterSelectRole(): any {

    // console.log('contineAfterSelectRole: ', this.selectedRoleId);


    if (this.selectedRoleId === undefined) {
      return Swal('', 'Select the Role you want to work with', 'error');
    }
    //// console.log('contineAfterSelectRole this.selectedRoleId : ', this.selectedRoleId);

    let values =
    {
      "role_id": this.selectedRoleId.id
    };


    let token = this.storage.get(this.token);

    let url = `auth/menu-assigned-roles?token=` + token;

    this._GeneralService.post(values, url)

      //  .retryWhen((err) => {

      //    return err.scan((retryCount) =>  {

      //      retryCount  += 1;
      //      if (retryCount < this.retryService) {

      //          this.btnChangPwdContine = 'Preparing your Role...'; 

      //          return retryCount;
      //      }
      //      else 
      //      {
      //        Swal('', this.errorOccur, 'error');
      //         throw(err);
      //      }
      //    }, 0).delay(this.retryDelayServiceInterval); 
      //  }).
      .subscribe(
        (data: any) => {


          this.displayloaderRole = true;
          //  this._GeneralService.SaveMenu(data);
          // this._GeneralService.SaveRoleId(this.selectedRoleId.id);

          this.storage.set(this.role, null);

          this.storage.set(this.role, this.selectedRoleId.role_name);

          let rol: any[] = this.storage.get(this.role);


          // console.log('contineAfterSelectRole rol: ', rol);


          this.btnChangPwdContine = 'Loggin In...';
          this.loginSucc = true;
          setTimeout(() => {
            this.router.navigate(['./dashboard']);
          }, 100);

        },
        (error: any) => {

          //// console.log('error when assigned', error);
          this.displayloaderRole = false;
          if (error.error.message != undefined) {
            Swal('', error.error.message, 'error');
          }
          else {
            Swal('', this.errorOccur, 'error');
          }


        });

  }


  getMenu(roleInfo: any): any {

    // // console.log('menu assign start : ', roleInfo);
    //// console.log('getMenu for role id : ', roleInfo.data.role_id);

    let values =
    {
      "role_id": roleInfo.data.role_id
    };


    let token = this.storage.get(this.token);

    let url = `auth/menu-assigned-roles?token=` + token;

    this._GeneralService.post(values, url).subscribe(
      (data: any) => {


        //  // console.log('menu assign res: ', data);

        //  this._GeneralService.SaveMenu(data);
        // this._GeneralService.SaveRoleId(roleInfo.data.role_id);
        this.btnChangPwd = 'Loggin In...';
        this.loginSucc = true;
        setTimeout(() => {
          this.router.navigate(['./dashboard']);
        }, 100);

      },
      (error: any) => {

        // // console.log('error when assigned', error);

        if (error.error.message != undefined) {
          Swal('', error.error.message, 'error');
        }
        else {
          Swal('', this.errorOccur, 'error');
        }


      });

  }




  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: this.durationsnack,
    });
  }

  ngAfterViewInit() {
    this.settings.loadingSpinner = false;
  }

  backToLogin() {
    this.router.navigate(['./login']);
  }

  close(): void {

    this.dialogRef.close(this.reloadLoad);
  }
}
