

import { List } from 'linqts';
import { roleLimit, UserLimit } from './../../../../model/roleLimit.model';
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
import { auditTrailDetailComponent } from '../../auditTrail/auditTrail-details/audittrail-detail.component';
  

@Component({
  selector: 'app-user-limit',
  templateUrl: './user-limit.component.html',
  styleUrls: ['./user-limit.component.scss']
})
export class UserLimitComponent implements OnInit {
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
   rowDetails: UserLimit;
   currencies: any;
   branches: any;

   userRoleAssign: RoleAssign;
   actionName = '';
   tableName = "admUserLimit";

  constructor(public appSettings: AppSettings, 
              public fb: FormBuilder, public router: Router,
              public snackBar: MatSnackBar,
              public _waitingDialog: WaitingDialog,
              private _localStorageService: LocalStorageService,
              public _GeneralService: GeneralService,
              private http: HttpClient,
              private route: ActivatedRoute,
              private activatedRoute: ActivatedRoute,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<UserLimitComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, 
        )
        {
        this.settings = this.appSettings.settings; 
      
        this.resetRow();		 

        console.log('data limit details: ', data);
      
      
          this.actionName = data.actionName;
          this.rowDetails.itbId = 0;
          this.rowDetails.roleId = data.record.roleId;


          this.rowDetails.userItbId = data.record.userId;
         
          this.getUserDetails =  this._GeneralService.getUserDetails();
          this.load(this.getUserDetails, data);
         
      
 }

  ngOnInit() 
  {
      this.loadPage = false;
      this.statuses = this._GeneralService.Statuses;

  }

  resetRow()
  {

    this.rowDetails = {
      itbId: 0,
      roleId: 0,
      userItbId: 0,
      fullName: '',
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


  load(param: any, param2: any): void {

    this.loadPage = true;

  
    let val = 
    {
      pdtCurrentDate: param.bankingDate,
      psBranchNo: param.branchNo,
      pnDeptId: param.deptId,
      pnGlobalView: 'N',
      serviceId: 0,
      menuId: 14,
      roleId: this.getUserDetails.roleId,
      userItbId:  param2.record.userId
    }

    console.log('Users limit val', val);

    let url = 'Users/GetUserLimitNew';

    this._GeneralService.post(val, url)
 
    
    .subscribe(
      (data: any) => {

        console.log('roles limit', data);
        this.loadPage = false;
        this.temp = data._response;
        this.rows = data._response;
        this.currencies = data.currencies;
        this.userRoleAssign = data.roleAssign;

        console.log('roles limit this.userRoleAssign', this.userRoleAssign);
      },
      (error: any) => { 

    });
 
   }

   action(action, data)
   {
     console.log('action: ', data);

      this.actionName = action;
      
      console.log('action this.actionName: ', this.actionName);
      console.log('action userRoleAssign: ', this.userRoleAssign);
 
      this.rowDetails.itbId  = data.itbId;
      this.rowDetails.roleId = data.roleId;
      this.rowDetails.fullName =  data.roleName;
      this.rowDetails.currencyIso =  data.currencyIso;
      this.rowDetails.creditLimit  = this._GeneralService.formatMoney(data.creditLimit);
      this.rowDetails.debitLimit = this._GeneralService.formatMoney(data.debitLimit);
      this.rowDetails.gLDebitLimit = this._GeneralService.formatMoney(data.glDebitLimit);
      this.rowDetails.gLCreditLimit = this._GeneralService.formatMoney(data.glCreditLimit);
      this.rowDetails.dateCreated = this._GeneralService.dateCreated(data.dateCreated);
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


  add(): void {

    console.log('this.rowDetails: ', this.rowDetails);

    if(this.rowDetails.currencyIso == null){
      Swal('', 'Select Currency', 'error');
      return;
    }
    

    this.actionLoaderSave = true;
    let element = <HTMLInputElement> document.getElementById("btnSave");
    element.disabled = true;
 

      let user  = this._GeneralService.getUserDetails();

      this.rowDetails.loginUserId = user.userId;

      let url = 'Users/AddUserLimit';

      let val = 
      {
        UserLimitDTO: this.rowDetails,
        LoginUserId: user.userId
      }

      console.log('this.rowDetails val: ', val);

      this._GeneralService.post(val, url).subscribe(
        (data: any) => 
        {
          console.log('Save Limit Successful: ', data);

          element.disabled = false;
          this.actionLoaderSave = false;

          this.load(this.getUserDetails, this.data);

          if(data.responseCode == 0)
            Swal('', data.responseMessage, 'success');
          else if(data.responseCode == 2)
            Swal('', data.responseMessage, 'success');
          else
            Swal('', data.responseMessage, 'error');
            
        },
        (error: any) => 
        {
          console.log('error while adding: ', error)
          this.actionLoaderSave = false;
          element.disabled = false;
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




  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration:  this.durationsnack,
    });
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
      this.rowDetails.fullName =  data.roleName;
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
      //this.resetRow();

      this.rowDetails.debitLimit = '0.00';
      this.rowDetails.creditLimit = '0.00';
      this.rowDetails.gLDebitLimit = '0.00';
      this.rowDetails.gLCreditLimit = '0.00';
      this.actionName = 'Limit';
    }
    console.log(' this.rowDetails: ',  this.rowDetails);

 }

 auditList()
  {
    let tableName = this.tableName;
    let dialogRef = this.dialog.open(auditTrailDetailComponent, {

      width: '1400px',
      height: '650px',
      // hasBackdrop: true,
      disableClose: true,
      // autoFocus: true,
      data: { actionName: "audit", record:  tableName},
      
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('role list refresh result', result)
      if(result == 'Y'){
        let getUserDetails =  this._GeneralService.getUserDetails();
        //this.load(getUserDetails);
      }
    });
  }

}




