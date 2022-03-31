

import { GenModel } from './../../../../model/gen.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { GeneralService } from './../../../../services/genservice.service';
import { Component, OnInit, Inject } from '@angular/core';
import {
  FormGroup, FormBuilder, Validators, FormControl,
  FormGroupDirective, NgForm
} from '@angular/forms';
import { emailValidator } from '../../../../theme/utils/app-validators';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { WaitingDialog } from '../../../../services/services';
import { MatSnackBar, _MatChipListMixinBase } from '@angular/material';
import { LocalStorageService } from 'angular-2-local-storage';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoginType } from '../../../../model/LoginType.model';
import { AuditTrailComponent } from '../../../reports/audit-trail/audit-trail.component';
import { auditTrailDetailComponent } from '../../auditTrail/auditTrail-details/audittrail-detail.component';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  branches: any;
  createdByString: string;
  roles: any;
  public form: FormGroup;
  basicForm: FormGroup;
  public settings: Settings;
  durationsnack = 3000;
  displayloader = false;
  lblProcess: any;
  selectedPrepCat: any;
  religionlist = [];
  cbs: any;
  stateList: any;
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
  actionFetchDetails = false;
  bankingSystem: any;

  createdBy: any;
  reloadLoad: any;
  userFullName: any
  statuses: any;
  depts: any;
  ActionViewHeaderMsg = GenModel.ActionViewHeaderMsg;
  ActionDisplay: any;
  getUserDetails: any;
  loginId = '';
  staffId = '';
  dataSource = '';
  loginTypes: LoginType;
  cpLogValues: string = '';
  bankCoreName: string = '';
  status: any;
  tableName = "admUserProfile";

  constructor(public appSettings: AppSettings,
    public dialog: MatDialog,
    public fb: FormBuilder, public router: Router,
    public snackBar: MatSnackBar,
    public _waitingDialog: WaitingDialog,
    private _localStorageService: LocalStorageService,
    public _GeneralService: GeneralService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<UserDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.settings = this.appSettings.settings;

    //console.log('this.data.actionName', this.data.actionName)

    if (this.data.actionName === 'Add') {

      this.ActionDisplay = 'ADD NEW USER'
      this.basicForm = this.fb.group({

        authUser: null,// [null, Validators.compose([Validators.required])],
        branchName: null,
        branchNo: '',
        canApprove: null,
        canPrintBidSecurity: null,
        canPrintBond: null,
        canPrintOD: null,
        canPrintRefLetter: null,
        canPrintStatement: null,
        canPrintTradeRef: null,
        canReverse: null,
        createdBy: null,
        dateCreated: null,
        deptId: '',
        emailAddress: null,
        enforcePswdChange: null,
        fullName: null,
        isFirstLogin: null,
        isSupervisor: null,
        lockcount: null,
        loggedOn: null,
        loginId: null,
        staffId: null,
        loginType: null,
        logincount: null,
        loginstatus: null,
        mobileNo: null,
        password: null,
        passwordExpiryDate: null,
        roleId: '',
        roleName: null,
        rsmId: null,
        select: null,
        status: '',
        useCbsAuth: true,
        useCbsLimit: false,
        userId: null,
        bankingSystem: null,
        loginUserId: null,
        checkValidate: false

      });
      //alert('patchValue ' + this._GeneralService.getLoginType());
      this.basicForm.patchValue({
        loginType: this._GeneralService.getCpLoginType()
      })
    }
    else {

      this.ActionDisplay = 'USER DETAILS'

      this.basicForm = this.fb.group({

        authUser: null,
        branchName: null,
        branchNo: '',
        canApprove: null,
        canPrintBidSecurity: null,
        canPrintBond: null,
        canPrintOD: null,
        canPrintRefLetter: null,
        canPrintStatement: null,
        canPrintTradeRef: null,
        canReverse: null,
        createdBy: null,
        createdByString: null,
        dateCreated: '',
        deptId: '',
        emailAddress: null,
        enforcePswdChange: null,
        fullName: null,
        isFirstLogin: null,
        isSupervisor: null,
        lockcount: null,
        loggedOn: null,
        loginId: null,
        staffId: null,
        loginType: '',
        logincount: null,
        loginstatus: null,
        mobileNo: null,
        password: null,
        passwordExpiryDate: null,
        roleId: '',
        roleName: null,
        rsmId: null,
        select: null,
        status: '',
        useCbsLimit: null,
        userId: null

      });

      console.log("data.record ", data.record);
      this.status = data.record.status;
      //this.dataSource = data.record.dataSources;
      this.basicForm.patchValue({
        
        authUser: data.record.authUser,
        branchName: data.record.branchName,
        branchNo: data.record.branchNo != null ? data.record.branchNo : "",
        canApprove: data.record.canApprove,
        canPrintBidSecurity: data.record.canPrintBidSecurity,
        canPrintBond: data.record.canPrintBond,
        canPrintOD: data.record.canPrintOD,
        canPrintRefLetter: data.record.canPrintRefLetter,
        canPrintStatement: data.record.canPrintStatement,
        canPrintTradeRef: data.record.canPrintTradeRef,
        canReverse: data.record.canReverse,
        createdBy: data.record.createdBy,
        createdByString: null,
        dateCreated: this._GeneralService.dateCreated(data.record.dateCreated),
        deptId: data.record.deptId != null ? data.record.deptId : "",
        emailAddress: data.record.emailAddress,
        enforcePswdChange: data.record.enforcePswdChange,
        fullName: data.record.fullName,
        isFirstLogin: data.record.isFirstLogin,
        isSupervisor: data.record.isSupervisor,
        lockcount: data.record.lockcount,
        loggedOn: data.record.loggedOn,
        loginId: data.record.loginId,
        staffId: data.record.staffId != null ? data.record.staffId : "",
        logincount: data.record.logincount,
        loginstatus: data.record.loginstatus,
        mobileNo: data.record.mobileNo,
        password: data.record.password,
        passwordExpiryDate: data.record.passwordExpiryDate,
        roleId: data.record.roleId != null ? data.record.roleId : "",
        roleName: data.record.roleName,
        rsmId: data.record.rsmId,
        select: data.record.select,
        status: data.record.status != null ? data.record.status : "",
        useCbsAuth: data.record.useCbsAuth,
        userId: data.record.userId,
        loginType: data.record.loginType != null ? data.record.loginType : "",
        useCbsLimit: data.record.useCbsLimit != null ? (data.record.useCbsLimit == 'Y' ? true : false) : false

      });

      this.getCreatedBy(data);
    }
  }

  ngOnInit() {
    this.loadPage = false;
    this.statuses = this._GeneralService.Statuses;
    this.loadBankingSystem();
    this.loadService();
    this.getUserDetails = this._GeneralService.getUserDetails();
    this.loadDept(this.getUserDetails);
    this.loadLoginType();
    this.cpLogValues = this._GeneralService.getCpLoginType();
    //alert(this.userLogValues);
  }

  getCreatedBy(values: any): void {

    this.loadPage = true;

    let url = 'Users/GetUser';
    let val =
    {
      CreatedBy: values.record.userId,

    };

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {
        console.log('created by Data: ', data);
        this.createdByString = data.fullName;
        this.loadPage = false;

      },
      (error: any) => {
        console.log('created error by while adding: ', error);
      });

  }

  add(values: Object): void {

    //console.log('his.basicForm.value.useCbsAuth: ', this.basicForm.value.useCbsAuth);
    //console.log('his.basicForm.value.dataSources: ', this.basicForm.value.dataSources);
    if (this.basicForm.value.useCbsAuth == true) {
      // Swal('', 'Select the Data Source', 'error');
      // return;

      // if (this.basicForm.value.dataSources == null) {
      //   Swal('', 'Select the Data Source', 'error');
      //   return;
      // }
    }

   

    if (this.basicForm.value.roleId == 'Select Role') {
      Swal('', 'Select the Role', 'error');
      return;
    }
    if (this.basicForm.value.roleId == null || this.basicForm.value.roleId == '') {
      Swal('', 'Select the Role', 'error');
      return;
    }
    if (this.basicForm.value.deptId == null || this.basicForm.value.deptId == '') {
      Swal('', 'Select the Department', 'error');
      return;
    }

    this.actionLoaderSave = true;
    let element = <HTMLInputElement>document.getElementById("btnSave");
    element.disabled = true;

    if (this.basicForm.valid) {
      let user = this._GeneralService.getUserDetails();
      this.basicForm.value.loginUserId = user.userId;
      this.basicForm.value.createdBy = user.userId;
      this.basicForm.value.useCbsLimit = this.basicForm.value.useCbsLimit == true ? "Y" : "N";

      //console.log('this.basicForm.value: ', this.basicForm.value);

      let url = 'Users/Add';
      this._GeneralService.post(this.basicForm.value, url).subscribe(
        (data: any) => {
          console.log(data);
          element.disabled = false;
          this.actionLoaderSave = false;
          this.reloadLoad = 'Y';

          this.basicForm.reset();
          document.getElementById('loginId').setAttribute('disabled', 'false');

          Swal('', data.responseMessage, 'success');

        },
        (error: any) => {
          console.log('error while adding: ', error)
          this.actionLoaderSave = false;
          element.disabled = false;
          Swal('', error.error.responseMessage, 'error');
        });
    }
    else {
      element.disabled = true;
      // Swal('Note:', 'Kindly Fill your Credential!', 'error');
    }
  }

  loadLoginType()
  {
    //console.log("inside the loadLoginType");

    this.loadPage = true;

    let url= 'ClientProfile/GetAllLoginType';
  
    this._GeneralService.postT(url).subscribe(
      (data: any) => {
        //console.log('loginType data ', data);  
        
        this.loginTypes = data;
        //console.log('this. loginTypes', this.loginTypes);
      });
  }

  update(values: Object): void {

    // if (this.basicForm.value.dataSources == null || this.basicForm.value.dataSources === "") {
    //   Swal('', 'Select the Data Source', 'error');
    //   return;
    // }

    if (this.basicForm.value.roleId == 'Select Role') {
      Swal('', 'Select the Role', 'error');
      return;
    }
    if (this.basicForm.value.roleId == "" || this.basicForm.value.roleId == null) {
      Swal('', 'Select the Role', 'error');
      return;
    }
    if (this.basicForm.value.deptId == "" || this.basicForm.value.deptId == null) {
      Swal('', 'Select the Department', 'error');
      return;
    }

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement>document.getElementById("btnUpdate");
    element.disabled = true;

    if (this.basicForm.valid) {
      let user = this._GeneralService.getUserDetails();
      this.basicForm.value.loginUserId = user.userId;
      this.basicForm.value.useCbsLimit = this.basicForm.value.useCbsLimit == true ? "Y" : "N";
      //this.basicForm.value.createdBy  = user.userId; 


      //console.log('this.basicForm.value: ', this.basicForm.value);

      let url = 'Users/update';
      this._GeneralService.post(this.basicForm.value, url).subscribe(
        (data: any) => {
          console.log(data);
          element.disabled = false;
          this.actionLoaderUpdate = false;
          this.reloadLoad = 'Y';
          if(data.responseCode == 0)
            Swal('', data.responseMessage, 'success');
          else
            Swal('', data.responseMessage, 'error');
        },
        (error: any) => {
          console.log('error while adding: ', error)
          this.actionLoaderUpdate = false;
          element.disabled = false;
          Swal('', error.error.responseMessage, 'error');
        });
    }
    else {
      element.disabled = true;
      // Swal('Note:', 'Kindly Fill your Credential!', 'error');
    }
  }

  loadDept(param: any): void {

    let url = 'Department/GetAllDepAndbranch';
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

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {


        this.loadPage = false;

        this.depts = data._response;
        this.branches = data._response1;
        this.roles = data._response2;

        console.log('dept: ', data);


      },
      (error: any) => {

      });

  }

 

  getUserDetailCoreBanking(event: any): void {

    //alert('yyyys ');
    console.log("start validate ");
    let url = 'Users/FetchUserDetailsCoreBanking';

    let loginUserId = this.basicForm.value.loginId;
    let staffUserId = this.basicForm.value.staffId;

    if (loginUserId == null && staffUserId == null) {
      Swal('', 'Enter Login Id or Staff ID ', 'error');
      console.log("staff id && login id null");
      if(event.checked)
      {
        this.basicForm.patchValue({
          checkValidate: false
        })
      }
      return;
    }
    if (loginUserId != null && staffUserId == null) {
      // validate for staff Id
      console.log("staff id null");
      if(event.checked)
      {
        this.basicForm.patchValue({
          checkValidate: false
        })
      }
      this.actionFetchDetails = true;
      this.validateLoginId(loginUserId);
    }
    if (loginUserId == null && staffUserId != null) {
      //validate for login Id
      console.log("login id null");
      if(event.checked)
      {
        this.basicForm.patchValue({
          checkValidate: false
        })
      }
      
      this.actionFetchDetails = true;
      this.validateStaffId(staffUserId);
    }
    else if(loginUserId != null && staffUserId != null){
      console.log("staff id is not null && login id is not null");
      console.log("login id null");
      if(event.checked)
      {
        this.basicForm.patchValue({
          checkValidate: false
        })
      }
      
      this.actionFetchDetails = true;
      this.validateAll(loginUserId, staffUserId);
    }
    

    
  }

  validateLoginId(value:string):void {

    let url = 'Users/FetchUserDetailsCoreBanking';
    console.log('call this method , paramValue = ', value);
    let val =
    {
      loginId: value,
      staffId: '',
      BankServiceItbId: this.basicForm.value.dataSources,
    }

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {
        //console.log('Get USer info Cor Banking Result: ', data);

        this.reloadLoad = 'Y';
        //element.disabled = false;
        this.actionFetchDetails = false;

        if(data != null)
        {
          this.basicForm.patchValue({

            branchNo: data.branchNo,
            emailAddress: data.email,
            rsmId: data.employeeId,
            fullName: data.fullName,
            loginId: data.loginId,
            
            status: data.userStatus,
  
  
          });
          document.getElementById('loginId').setAttribute('disabled', 'true');
        }
        document.getElementById('loginId').setAttribute('disabled', 'false');

      },
      (error: any) => {

        //element.disabled = false;
        this.actionFetchDetails = false;
        
        Swal('', error.error.responseMessage, 'error');
        
    });
  }

  validateStaffId(value:string): void{

    let url = 'Users/FetchUserDetailsCoreBanking';
    console.log('call this method , paramValue = ', value);
    let val =
    {
      loginId: '',
      staffId: value,
      BankServiceItbId: this.basicForm.value.dataSources,
    }

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {
        //console.log('Get USer info Cor Banking Result: ', data);

        this.reloadLoad = 'Y';
        //element.disabled = false;
        this.actionFetchDetails = false;

        if(data != null)
        {
          this.basicForm.patchValue({

            branchNo: data.branchNo,
            emailAddress: data.email,
            rsmId: data.employeeId,
            fullName: data.fullName,
            loginId : data.loginId,
            staffId: data.staffId,
            status: data.userStatus,
          });
          document.getElementById('loginId').setAttribute('disabled', 'true');
          document.getElementById('staffId').setAttribute('disabled', 'true');
        }
        document.getElementById('loginId').setAttribute('disabled', 'false');
        document.getElementById('staffId').setAttribute('disabled', 'false');
      },
      (error: any) => {

        //element.disabled = false;
        this.actionFetchDetails = false;
        //document.getElementById('loginId').setAttribute('disabled', 'false');
        Swal('', error.error.responseMessage, 'error');
    });
  }

  validateAll(loginId, staffId)
  {
    console.log('call this method , paramValue loginId = ' + loginId);
    console.log('call this method , paramValue staffId = ' + staffId);
    
    let url = 'Users/FetchUserDetailsCoreBanking';
    let val =
    {
      loginId: loginId,
      staffId: staffId,
      BankServiceItbId: this.basicForm.value.dataSources,
    }

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {
        //console.log('Get USer info Cor Banking Result: ', data);

        this.reloadLoad = 'Y';
        //element.disabled = false;
        this.actionFetchDetails = false;

        if(data != null)
        {
          this.basicForm.patchValue({

            branchNo: data.branchNo,
            emailAddress: data.email,
            rsmId: data.employeeId,
            fullName: data.fullName,
            loginId : data.loginId,
            staffId: data.staffId,
            status: data.userStatus,
          });
          document.getElementById('loginId').setAttribute('disabled', 'true');
          document.getElementById('staffId').setAttribute('disabled', 'true');
        }
        document.getElementById('loginId').setAttribute('disabled', 'false');
        document.getElementById('staffId').setAttribute('disabled', 'false');
      },
      (error: any) => {

        //element.disabled = false;
        this.actionFetchDetails = false;
        //document.getElementById('loginId').setAttribute('disabled', 'false');
        Swal('', error.error.responseMessage, 'error');
    });
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  ngAfterViewInit() {
    this.settings.loadingSpinner = false;
  }

  close(): void {

    this.dialogRef.close(this.reloadLoad);
  }


  loadBankingSystem(): void {


    this.loadPage = true;

    let url = 'BankServiceSetUp/GetAll';

    let val =
    {
      "aId": 0,
      "userName": "string",
      "password": "string",
      "dateCreated": "2020-05-12T12:08:01.854Z"
    }

    this._GeneralService.post(val, url)
      // .retryWhen((err) => {

      //   return err.scan((retryCount) =>  {

      //     retryCount  += 1;
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
        (data: any) => {

          this.bankingSystem = data;
          this.loadPage = false;

        },
        (error: any) => {


          this.actionLoaderSave = false;

          //  Swal('', this.errorOccur, 'error');

        });
  }


  loadService(): void {

    this.loadPage = true;

    let url = 'BankServiceSetUp/GetAll';

    let val =
    {
      "aId": 0,
      "userName": "string",
      "password": "string",
      "dateCreated": "2020-05-12T12:08:01.854Z"
    }

    this._GeneralService.homePage(val, url)
      // .retryWhen((err) => {

      //   return err.scan((retryCount) =>  {

      //     retryCount  += 1;
      //     if (retryCount < this.retryService) {

      //         this.retryMessage = this.RetryAttmMsg; // #'  + retryCount;

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
        (data: any) => {
          this.loadPage = false;
          this.cbs = data._response;
          console.log('loadService cbs', data)

        },
        (error: any) => {

          //  Swal('', error.message, 'error');

        });
  }

  onOptionsDataSourse(event) {
    //console.log('onOptionsDataSourse', event.target.value);
    if (event.target.value !== 'Select Banking System')
      this.dataSource = event.target.value
    if (event.target.value === 'Select Banking System')
      this.dataSource = ''

    if(this.data.actionName === 'Add'){
     
    }
    else{
      
    }
    
  }

  changeValLoginId(event) {
    console.log('changeValLoginId: ', event.target.value);
    let val = event.target.value;
    console.log('changeValLoginId val: ', val);

    if (event.target.value.length !== null && event.target.value.trim() !== '')
      this.loginId = 'a'

  }

  changeValStaffId(event) {
    //console.log('changeValStaffId: ', event.target.value);
    let val = event.target.value;
    //console.log('changeValStaffId val: ', val);

    if (event.target.value.length !== null && event.target.value.trim() !== '')
      this.staffId = 'a'

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




