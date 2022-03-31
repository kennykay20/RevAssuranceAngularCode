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
import { auditTrailDetailComponent } from '../../auditTrail/auditTrail-details/audittrail-detail.component';

@Component({
  selector: 'app-cheque-vendor-details',
  templateUrl: './cheque-vendor-details.component.html',
  styleUrls: ['./cheque-vendor-details.component.scss']
})
export class ChequeVendorDetailsComponent implements OnInit {

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
  services = [];
  acctTypes = [];
  currencies =[];
  reloadLoad: any;
  errorOccur = GenModel.errorOccur;
  userFullName: any
  tableName = 'admChqVendor';

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
              public dialogRef: MatDialogRef<ChequeVendorDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, 
        )
        {
      
        this.settings = this.appSettings.settings; 
    
      if(this.data.actionName === 'Add')
      {

        this.basicForm = this.fb.group({
          vendorId: [null, Validators.compose([Validators.required])], //
          vendorName: [null, Validators.compose([Validators.required])],
          venAcctNo: [null, Validators.compose([Validators.required])],
          venAcctType: ['', Validators.compose([Validators.required])],
          venEmail: [null, Validators.compose([Validators.required])],
          UserId:0,
          venAltEmail: [null],
          venAcctCcyCode: ['', Validators.compose([Validators.required])],
          apiEndPoint: [null],
          soapDefinition: [null],
          email: [null],
          api: [null],
          webService: [null],
          twenty: [null],
          fifty: [null],
          hundred: [null],
        });		 
      }
      else
      {
        this.basicForm = this.fb.group({
          vendorId: new FormControl(null),
          vendorName: new FormControl(null),
          venAcctNo: new FormControl(null),
          venAcctType: new FormControl(null),
          venEmail: new FormControl(null),
          UserId : 0,
          venAltEmail: new FormControl(null),
          createdBy: new FormControl(null),
          status: new FormControl(null),
          venAcctCcyCode : new FormControl(null),
          apiEndPoint : new FormControl(null),
          soapDefinition : new FormControl(null),
          itbId : new FormControl(null),
          email: new FormControl(false),
          api: new FormControl(false),
          webservice: new FormControl(false),
          twenty: new FormControl(false),
          fifty: new FormControl(false),
          hundred: new FormControl(false),
          dateCreated : new FormControl(null)
        });		 
    
    
       this.basicForm.patchValue({
        vendorId: data.record.vendorId,
        vendorName:  data.record.vendorName,
        venAcctNo:  data.record.venAcctNo,
        venAcctType: data.record.venAcctType,
        venEmail: data.record.venEmail,                                                                                                           
        venAltEmail: data.record.venAltEmail,
          createdBy: data.record.userId,
          status : data.record.status,
          venAcctCcyCode : data.record.venAcctCcyCode,
          apiEndPoint : data.record.apiEndPoint,
          soapDefinition : data.record.soapDefinition,
          itbId : data.record.itbId,
          email: data.record.email,
          api: data.record.api,
          webservice: data.record.webservice,
          twenty: data.record.twenty,
          fifty: data.record.fifty,
          hundred: data.record.hundred,
          dateCreated : this._GeneralService.dateCreated(data.record.dateCreated),
          UserId : data.record.userId
        });	
        this.getUserName(data.record.userId)

        console.log('this.basicForm value', this.basicForm.value);
      }
 }

  ngOnInit() 
  {
      this.loadPage = false;
      this.getAcctTypes();
      this.getCurrencies();
  }
  check(){
    
  }

  getUserName(id: any) {
    if (id != null) {


      let url = 'Users/GetUserById';
      let val =
      {
        "aId": 0,
        "userName": "string",
        "password": "string",
        "dateCreated": "2020-05-12T12:08:01.854Z",
        "userId": id
      }
      this._GeneralService.post(val, url)
        .subscribe(
          (data: any) => {
            this.loadPage = false;
            this.userFullName = data.fullName;
          },
          (error: any) => {
          });
    }
    
  }

  getAcctTypes():void{
    let url = 'AccountType/GetAll';
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
        this.acctTypes = data;
      },
      (error: any) => { 
    });
  }


  getCurrencies():void{
    let url = 'Currency/GetAll';
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
        this.currencies = data;
      },
      (error: any) => { 
    });
  }
  add(values: Object): void {

    this.actionLoaderSave = true;
    let element = <HTMLInputElement> document.getElementById("btnSave");
    element.disabled = true;
 
    if (this.basicForm.valid) 
    {

      this.basicForm.value.userId  = this._GeneralService.getUserId();

  
      let url = 'ChequeVendor/Add';


      this._GeneralService.post(this.basicForm.value, url).subscribe(
        (data: any) => 
        {
        

          element.disabled = false;
          this.basicForm.reset();

          this.actionLoaderSave = false;
          this.reloadLoad= 'Y'; 

          Swal('', data.sErrorText, 'success');
            
        },
        (error: any) => 
        {
         
          this.actionLoaderSave = false;
          element.disabled = true;

          Swal('', this.errorOccur, 'error');

      });


    }
    else 
    {
      element.disabled = true;
     // Swal('Note:', 'Kindly Fill your Credential!', 'error');
    }
  }

  update(values: Object): void {

    console.log('update: ', values);

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement>document.getElementById("btnUpdate");
    
    element.disabled = true;
      let url = 'ChequeVendor/Update';

      this._GeneralService.post(values, url).subscribe(
        (data: any) => 
        {

          console.log('Save Result: ', data);


          element.disabled = false;
          this.actionLoaderUpdate =  false;
          this.reloadLoad = 'Y';
       
          if(data.responseCode == 2)
            Swal('', data.sErrorText, 'success');
          else
            Swal('', data.sErrorText, 'error');
          
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

  post(postValue: any, url: any): Observable<any> 
  {      
   
      let token = this._localStorageService.get(this.token);

       let postingurl = `${this.baseUrl}/${url}?token=${token}`;
     
      let header = new HttpHeaders({
        'Content-Type':  'application/json',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers':'application/json',
       // 'Authorization': 'Bearer ' + token
      });


       return  this.http.post<any>(postingurl, postValue, {
             headers:  header
           }).pipe();
     
 }

  timeOutRes(txt) 
  {
    this.lblProcess = txt;
    this.displayloader = true;
      setTimeout(() => {
        this.displayloader =  false;
        this.lblProcess = '';
      }, 3000);
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


  close(): void {
    this.dialogRef.close(this.reloadLoad);
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
