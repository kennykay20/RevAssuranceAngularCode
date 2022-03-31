import { List } from 'linqts';
import { roleLimit } from './../../../../model/roleLimit.model';
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
import { UserDetails } from '../../../../model/userDetails';
import { RoleAssign } from '../../../../model/roleAssign';
  

@Component({
  selector: 'app-role-limit',
  templateUrl: './role-limit.component.html',
  styleUrls: ['./role-limit.component.scss']
})
export class RoleLimitComponent implements OnInit {
  statuses: any;
  
  rows = [];
  columns = [];
  temp = [];

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
  token = GenModel.tokenName;
  ActionHeaderMsg = GenModel.ActionHeaderMsg
  requiredFieldMsg = GenModel.requiredFieldMsg;
  actionLoaderSave = false;
  actionLoaderUpdate = false;

  userFullName: any
  createdBy : any;
  reload: any;
  creditLimit: any;
   debitLimit: any;
   getUserDetails: UserDetails;
   rowDetails: roleLimit;
   currencies: any;
   branches: any;
   userRoleAssign: RoleAssign;
   actionName = '';
  constructor(public appSettings: AppSettings, 
              public fb: FormBuilder, public router: Router,
              public snackBar: MatSnackBar,
              public _waitingDialog: WaitingDialog,
              private _localStorageService: LocalStorageService,
              public _GeneralService: GeneralService,
              private http: HttpClient,
              private route: ActivatedRoute,
              private activatedRoute: ActivatedRoute,
              public dialogRef: MatDialogRef<RoleLimitComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, 
        )
        {
        this.settings = this.appSettings.settings; 
      
        this.resetRole();		 

        console.log('data limit details: ', data);
      
          this.actionName  = data.actionName;
          
          this.rowDetails.itbId = 0;
          this.rowDetails.roleId = data.record.roleId;
          this.rowDetails.roleName = data.record.roleName;
   
          this.rowDetails.userId = data.record.userId;

          this.getUserDetails =  this._GeneralService.getUserDetails();
          this.load(this.getUserDetails, data.record.roleId);
         
      
 }

  ngOnInit() 
  {
      this.loadPage = false;
      this.statuses = this._GeneralService.Statuses;
      this.rowDetails.status = "Active";
  }

  resetRole()
  {

    this.rowDetails = {
      itbId: 0,
      roleId: 0,
      roleName: '',
      currencyIso: null,
      creditLimit     : null,
      debitLimit: null,
      gLDebitLimit: null,
      gLCreditLimit: null,
      dateCreated: null,
      status: null,
      userId: null,
      createdBy: null,
      loginUserId: null
    }

  }


  load(param: any, roleId: any): void {

    this.loadPage = true;

    let val = 
    {
      pdtCurrentDate: param.bankingDate,
      psBranchNo: param.branchNo,
      pnDeptId: param.deptId,
      pnGlobalView: 'N',
      serviceId: 0,
      menuId: 6,
      roleId: roleId,
      loginUserRoleId: this.getUserDetails.roleId
    }

    console.log('roles limit val', val);

    let url = 'Roles/GetRoleLimit';

    this._GeneralService.post(val, url)
 
    
    .subscribe(
      (data: any) => {

        console.log('roles limit', data);
        this.loadPage = false;
        this.temp = data._response;
        this.rows = data._response;
        this.currencies = data.currencies;
        this.branches  = data.branches;
        this.userRoleAssign = data.roleAssign;

      },
      (error: any) => { 

    });
 
   }

   action(action, data)
   {
     console.log('action: ', data);

      this.actionName = action;
 
      this.rowDetails.itbId  = data.itbId;
      this.rowDetails.roleId = data.roleId;
      this.rowDetails.roleName =  data.roleName;
      this.rowDetails.currencyIso =  data.currencyIso;
      this.rowDetails.creditLimit  = this._GeneralService.formatMoney(data.creditLimit.toString());
     this.rowDetails.debitLimit = this._GeneralService.formatMoney(data.debitLimit.toString());
     this.rowDetails.gLDebitLimit = this._GeneralService.formatMoney(data.glDebitLimit.toString());
     this.rowDetails.gLCreditLimit = this._GeneralService.formatMoney(data.glCreditLimit.toString());
     this.rowDetails.dateCreated = this._GeneralService.dateCreated(data.dateCreated.toString());
      this.rowDetails.status =  data.status;
      this.rowDetails.userId = data.userId;
      console.log('action this.rowDetails details: ', data);
      this.getCreatedBy(data);
      
    
      
   }

  getCreatedBy(values: any): void {

       this.loadPage = true;

      let url = 'Users/GetUser';
      let val = 
      {
        CreatedBy: values.userId,
        
      };

      this._GeneralService.post(val, url).subscribe(
        (data: any) => 
        {
          console.log('created by Data: ', data);
          this.rowDetails.createdBy = data.fullName;
          this.loadPage = false;
            
        },
        (error: any) => 
        {
          console.log('created error by while adding: ', error);
      });

  }


  add(values: Object): void {

    if(this.rowDetails.currencyIso == null){
      Swal('', 'Select Currency', 'error');
      return;
    }

    if(this.rowDetails.currencyIso == null){
      Swal('', 'Select Currency', 'error');
      return;
    }
    

    this.actionLoaderSave = true;
    let element = <HTMLInputElement> document.getElementById("btnSave");
    element.disabled = true;
 

      let user  = this._GeneralService.getUserDetails();

      this.rowDetails.loginUserId = user.userId;

      let url = 'Roles/AddRoleLimit';

      console.log('this.rowDetails: ', this.rowDetails);

      this._GeneralService.post(this.rowDetails, url).subscribe(
        (data: any) => 
        {
          console.log('Save Limit Successful: ', data);

          element.disabled = false;
         this.actionLoaderSave = false;
          this.reload = 'Y';

          this.getUserDetails =  this._GeneralService.getUserDetails();
          this.load(this.getUserDetails, this.rowDetails.roleId);

          Swal('', data.responseMessage, 'success');
            
        },
        (error: any) => 
        {
          console.log('error while adding: ', error)
          this.actionLoaderSave = false;
          element.disabled = false;
          this.basicForm.valid;
          Swal('', error.error.responseMessage, 'error');

      });

  }

  update(values: Object): void {

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement> document.getElementById("btnUpdate");
    
    element.disabled = true;
      let url = 'Roles/Update';
      let user  = this._GeneralService.getUserDetails();
   let val = {
        admRole: this.basicForm.value,
        LoginUserId:user.userId
      }
      this._GeneralService.post(val, url).subscribe(
        (data: any) => 
        {

          console.log('Save Result: ', data);

          this.reload = 'Y';
          element.disabled = false;
          this.actionLoaderUpdate =  false;
       
          Swal('', data.responseMessage, 'success');
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

  convert(event){

    let val = this._GeneralService.formatMoney(event.target.value);
    console.log('val pp',val);
    this.rowDetails.creditLimit = val;
  }

  convert1(event){

    let val = this._GeneralService.formatMoney(event.target.value);
    console.log('val pp',val);

    this.rowDetails.debitLimit = val;
  }

  convert2(event){

    let val = this._GeneralService.formatMoney(event.target.value);
    console.log('val pp',val);

    this.rowDetails.gLDebitLimit = val;
  }

  convert3(event){

    let val = this._GeneralService.formatMoney(event.target.value);
    console.log('val pp',val);

    this.rowDetails.gLCreditLimit = val;
  }


  ngAfterViewInit()  
  {
    this.settings.loadingSpinner = false; 
  }

  close(): void 
  {
    this.dialogRef.close();
  }

  public onOptionsSelected(event) 
  {

    let data   = new List<any>(this.rows).FirstOrDefault(c=> c.currencyIso ===  event.target.value);
    if(data != null) 
    {

      this.rowDetails.itbId  = data.itbId;
      this.rowDetails.roleId = data.roleId;
      this.rowDetails.roleName =  data.roleName;
      this.rowDetails.currencyIso =  data.currencyIso;
      this.rowDetails.creditLimit  = this._GeneralService.formatMoney(data.creditLimit);
      this.rowDetails.debitLimit = this._GeneralService.formatMoney(data.debitLimit);
      this.rowDetails.gLDebitLimit = this._GeneralService.formatMoney(data.glDebitLimit);
      this.rowDetails.gLCreditLimit = this._GeneralService.formatMoney(data.glCreditLimit);
      this.rowDetails.dateCreated = this._GeneralService.dateCreated(data.dateCreated);
      this.rowDetails.status =  data.status;
      this.rowDetails.userId = data.userId;
      console.log('action this.rowDetails details: ', data);

      this.actionName = 'Edit';
      this.getCreatedBy(data);
    }
    else
    {
      this.rowDetails.debitLimit = '0.00';
      this.rowDetails.creditLimit = '0.00';
      this.rowDetails.gLDebitLimit = '0.00';
      this.rowDetails.gLCreditLimit = '0.00';

      this.actionName = 'Limit';
    }
    console.log(' this.rowDetails: ',  this.rowDetails);

 }

}




