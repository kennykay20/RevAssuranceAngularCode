


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
import { MatSnackBar } from '@angular/material';
import { LocalStorageService } from 'angular-2-local-storage';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-batch-control-details',
  templateUrl: './batch-control-details.component.html',
  styleUrls: ['./batch-control-details.component.scss']
})
export class BatchControlDetailsComponent implements OnInit {

  public form: FormGroup;
  basicForm: FormGroup;
  public settings: Settings;
  durationsnack = 3000;
  displayloader = false;
  lblProcess: any;
  selectedPrepCat: any;
  religionlist = [];

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

  userFullName: any;

  batchNo: any;
  ccyCode: any;
  postedTransCount: any;
  recordCount: any;
  serviceId: any;
  totalDrCount: any;
  totalCrCount: any;
  UserId: any;
  totalDr: any;
  totalCr: any;
  tDifference: any;
  loadedBy: any;
  dept: any;
  isBalanced: any;
  verifiedBy: any;
  approvedBy: any;
  filename: any;
  dateVerified: any;
  dateApproved:any;
  processingDept: any;
  dateCreated: any;
  status: any;
  createdBy : any;
  services = [];
  users = [];
  depts = [];
  comming : any;
  batches : any;

  constructor(public appSettings: AppSettings,
    public fb: FormBuilder, public router: Router,
    public snackBar: MatSnackBar,
    public _waitingDialog: WaitingDialog,
    private _localStorageService: LocalStorageService,
    public _GeneralService: GeneralService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<BatchControlDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.settings = this.appSettings.settings;

  }

  ngOnInit() {
    this.loadPage = false;
    this.getUser();
    this.getDept();
    this.getService();
    this.getBatchControl();
   
  }
  check() {

  }


  //to get service, users, dept
  getService(): void {
    let url = 'Service/GetAllServices';
    let val =
    {
      "aId": 0,
      "userName": "string",
      "password": "string",
      "dateCreated": "2020-05-12T12:08:01.854Z"
    }

    this._GeneralService.post(val, url)
      .subscribe(
        (data: any) => {
          this.loadPage = false;
          this.services = data;
        },
        (error: any) => {
        });
  }

  getDept(): void {
    let url = 'Department/GetAll';
    let val =
    {
      "aId": 0,
      "userName": "string",
      "password": "string",
      "dateCreated": "2020-05-12T12:08:01.854Z"
    }

    this._GeneralService.post(val, url)
      .subscribe(
        (data: any) => {
          this.loadPage = false;
          this.depts = data;
          console.log('dept',this.depts)
        },
        (error: any) => {
        });
  }

  //get dept Name
  getDeptById(id:number):string{
    if(id!=null){
      if(this.depts.length > 0){
        var d = this.depts.find(p=>p.deptId == id);
        return d.deptname;
      }
      else{
        this.getDept();
        var d = this.depts.find(p=>p.deptId == id);
        return d.deptname;
      }
    }
    return "";
  }

  getUser(){
    let url = 'Users/GetAll';
    let val =
    {
      "aId": 0,
      "userName": "string",
      "password": "string",
      "dateCreated": "2020-05-12T12:08:01.854Z"
    }

    this._GeneralService.post(val, url)
      .subscribe(
        (data: any) => {
         
          this.loadPage = false;
          this.users = data;
          console.log(this.users);
        },
        (error: any) => {
          
        });
  }

  getUserNameById(id:number):string{
    if(id!=null)
    {
        var f = this.users.find(p=>p.userId == id);
        return f.fullName;
    }
    return "";
  }

  getBatchControl()
  {
    this.comming  = localStorage.getItem("bid");
    let url = 'BatchControl/GetAll';
    let val =
    {
      "aId": 0,
      "userName": "string",
      "password": "string",
      "dateCreated": "2020-05-12T12:08:01.854Z"
    }

    this._GeneralService.post(val, url)
      .subscribe(
        (data: any) => {
          this.loadPage = false;
          this.batches = data;

          var batch = this.batches.find(p=>p.itbid == this.comming);
          this.ccyCode = batch.ccyCode;
          this.batchNo= batch.batchNo;
          this.postedTransCount = batch.postedTransCount;
          this.recordCount = batch.recordCount;
          this.serviceId = batch.serviceId;
          this.totalDrCount = batch.totalDrCount;
          this.totalCrCount = batch.totalCrCount;
          this.UserId  = batch.UserId;
          this.totalDr = batch.totalDr;
          this.totalCr = batch.totalCr;
          this.tDifference = batch.tDifference;
          this.loadedBy = this.getUserNameById(batch.loadedBy);
          this.dept= this.getDeptById(batch.dept);
          this.isBalanced= batch.isBalanced;
          this.verifiedBy= this.getUserNameById(batch.verifiedBy);
          this.approvedBy= this.getUserNameById(batch.approvedBy);
          this.filename= batch.filename;
          this.dateVerified= batch.dateVerified != null ? this._GeneralService.dateCreated(batch.dateVerified): batch.dateVerified;
          this.processingDept= this.getDeptById(batch.processingDept);
          this.dateCreated= batch.dateCreated != null ? this._GeneralService.dateCreated(batch.dateCreated) : batch.dateCreated;
          this.status= batch.status;
          this.createdBy = batch.userId;
          this.dateApproved = batch.dateApproved != null ? this._GeneralService.dateCreated(batch.dateApproved) : batch.dateApproved;
        },
        (error: any) => {
        });
  }
  add(values: Object): void {

    this.actionLoaderSave = true;
    let element = <HTMLInputElement>document.getElementById("btnSave");
    element.disabled = true;

    if (this.basicForm.valid) {

      this.basicForm.value.UserId = this._GeneralService.getUserId();

      console.log('this.basicForm.value: ', this.basicForm.value);

      let url = 'BankServiceSetup';

      let val =
      {

        WebServiceUrl: 'ywyhww',
        ConnectionName: 'Conn',
        DataBaseName: 'DB',
        DatabasePort: 'kdkdk',
        Server: '89900',
        UserName: 'sa',
        Password: 'oappapa',
        Status: 'Active',
        UserId: 0,
      };

      this._GeneralService.homePage(val, url).subscribe(
        (data: any) => {
          console.log('Save Result: ', data);

          element.disabled = false;
          this.basicForm.reset();

          this.actionLoaderSave = false;

          Swal('', data.sErrorText, 'success');

        },
        (error: any) => {
          console.log('error while adding: ', error)
          this.actionLoaderSave = false;
          element.disabled = true;

          Swal('', error.message, 'error');

        });


    }
    else {
      element.disabled = true;
      // Swal('Note:', 'Kindly Fill your Credential!', 'error');
    }
  }

  update(values: Object): void {

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement>document.getElementById("btnUpdate");

    element.disabled = true;
    let url = 'BankServiceSetup/Update';

    this._GeneralService.post(values, url).subscribe(
      (data: any) => {

        console.log('Save Result: ', data);


        element.disabled = false;
        this.actionLoaderUpdate = false;

        Swal('', data.sErrorText, 'success');
      },
      (error: any) => {

        element.disabled = false;
        this.actionLoaderUpdate = false;

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

  post(postValue: any, url: any): Observable<any> {

    let token = this._localStorageService.get(this.token);

    let postingurl = `${this.baseUrl}/${url}?token=${token}`;

    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'application/json',
      // 'Authorization': 'Bearer ' + token
    });


    return this.http.post<any>(postingurl, postValue, {
      headers: header
    }).pipe();

  }

  timeOutRes(txt) {
    this.lblProcess = txt;
    this.displayloader = true;
    setTimeout(() => {
      this.displayloader = false;
      this.lblProcess = '';
    }, 3000);
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: this.durationsnack,
    });
  }

  ngAfterViewInit() {
    this.settings.loadingSpinner = false;
  }

  close(): void {

    this.dialogRef.close('close');
  }

}




