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


@Component({
  selector: 'app-charge-concession-details',
  templateUrl: './charge-concession-details.component.html',
  styleUrls: ['./charge-concession-details.component.scss']
})
export class ChargeConcessionDetailsComponent implements OnInit {
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
  services =[];
  currencies = [];
  acctTypes = [];
  templates =[];
  
  chargeObj : any;
  reloadLoad: any;
  userFullName: any;

  //pre-fill
  code : any;
  desr : any;
  ctype : any;
  rbranch : any;
  curr : any;
  subTax : any;
  direc : any;
  cAcctNo : any;
  cAccttype: any;
  servi : any;

//okay
  constructor(public appSettings: AppSettings, 
              public fb: FormBuilder, public router: Router,
              public snackBar: MatSnackBar,
              public _waitingDialog: WaitingDialog,
              private _localStorageService: LocalStorageService,
              public _GeneralService: GeneralService,
              private http: HttpClient,
              private route: ActivatedRoute,
              private activatedRoute: ActivatedRoute,
              public dialogRef: MatDialogRef<ChargeConcessionDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, 
        )
        {
      
        this.settings = this.appSettings.settings; 
    
      if(this.data.actionName === 'Add')
      {

        this.basicForm = this.fb.group({
            //servicename: [null, Validators.compose([Validators.required])],
            chargeCode: [null, Validators.compose([Validators.required])],
            description: [null, Validators.compose([Validators.required])],
            serviceId: [null],
            recipientBranch: [null],
            chargeType: [null, Validators.compose([Validators.required])],
            chargeBasis: [null],
            direction: [null],
            currencyIso: [null],
            chargeValue: [null],
            chargeAcctType: [null],
            chargeAcctNo: [null],
            minimumChargeCurr: [null],
            minimumCharge: [null],
            maximumChargeCurr: [null],
            maximumCharge: [null],
            chargeFloorCurr: [null],
            chargeFloor: [null],
            acctType: [null],
            customerNo: [null],
            acctNumber: [null],
            subjectToTax: [null],
            exempted: [null],
            productCode: [null],
            narration: [null],
            UserId : 0
        });		 
      }
      else
      {
        this.basicForm = this.fb.group({
         
          //servicename: [null],
          chargeCode: [null],
          description: new FormControl(null),
          dateCreated: new FormControl(null),
          serviceId: new FormControl(null),
          recipientBranch: new FormControl(null),
          chargeType: new FormControl(null),
          itbId : new FormControl(null),
          status: new FormControl(null),
          drcr: new FormControl(null),
          UserId : 0,
          chargeBasis: new FormControl(null),
          direction: new FormControl(null),
          createdBy : new FormControl(null),
          currencyIso: new FormControl(null),
          chargeValue: new FormControl(null),
          chargeAcctType: new FormControl(null),
          chargeAcctNo: new FormControl(null),
          minimumChargeCurr: new FormControl(null),
          minimumCharge: new FormControl(null),
          maximumChargeCurr: new FormControl(null),
          maximumCharge: new FormControl(null),
          chargeFloorCurr: new FormControl(null),
          chargeFloor: new FormControl(null),
          acctType: new FormControl(null),
          customerNo: new FormControl(null),
          exempted: new FormControl(null),
          subjectToTax: new FormControl(null),
          productCode: new FormControl(null),
          acctNumber: new FormControl(null),
          narration : new FormControl(null)


        });		 
    
    
       this.basicForm.patchValue({
          
        //servicename: data.record.servicename,
        chargeCode:  data.record.chargeCode,
        description:  data.record.description,
        dateCreated: this._GeneralService.dateCreated(data.record.dateCreated),
        serviceId: data.record.serviceId,
        recipientBranch: data.record.recipientBranch,
        chargeType: data.record.chargeType,
        status: data.record.status,
        itbId: data.record.itbId,
        drcr: data.record.drcr,
        chargeBasis: data.record.chargeBasis,
        direction : data.record.direction,
        createdBy : data.record.userId,
        currencyIso: data.record.currencyIso,
        chargeValue: data.record.chargeValue,
        chargeAcctType: data.record.chargeAcctType,
        chargeAcctNo: data.record.chargeAcctNo,
        minimumChargeCurr: data.record.minimumChargeCurr,
        minimumCharge: data.record.minimumCharge,
        maximumChargeCurr: data.record.maximumChargeCurr,
        maximumCharge: data.record.maximumCharge,
        chargeFloorCurr: data.record.chargeFloorCurr,
        chargeFloor: data.record.chargeFloor,
        acctType: data.record.acctType,
        customerNo: data.record.customerNo,
        productCode: data.record.productCode,
        subjectToTax: data.record.subjectToTax,
        acctNumber: data.record.acctNumber,
        exempted : data.record.exempted,
        narration : data.record.narration
        });	
        this.getUserName(data.record.userId);
        
     
      }
 }

  ngOnInit() 
  {
      this.loadPage = false;
      this.getServices();
      this.getCurrencies();
      this.getAcctTypes();
      this.getTemplates();
      this.getCharges();
  }
  check(){
    
  }

  //to get services
  getServices():void{
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
        this.services = data._response;
      },
      (error: any) => { 
    });
  }
//  to get branches
getCharges():void{
  let code = localStorage.getItem("ChargeCode");
  let url = 'Charge/GetByChargeCode';
  let val = 
  {
    "chargeCode": code
  }

  this._GeneralService.post(val, url)
  .subscribe(
    (data: any) => {
      this.loadPage = false;
      this.chargeObj = data;

      //pre-fill
      if(this.data.actionName === "Add")
      {
        this.code = data.chargeCode;
        this.desr = data.description;
        this.ctype = data.chargeType;
        this.rbranch = data.recipientBranch;
        this.curr = data.currencyIso;
        this.subTax = data.subjectToTax;
        this.direc = data.direction;
        this.cAcctNo = data.chargeAcctNo;
        this.cAccttype = data.chargeAcctType;
        this.servi = data.serviceId;
      }
      
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
            this.userFullName = "";
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
 
  getTemplates():void{
    let url = 'Template/GetAll';
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
        this.templates = data;
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

      console.log('this.basicForm.value: ',  this.basicForm.value);

      let url = 'Charge/AddConcession';


      this._GeneralService.post(this.basicForm.value, url).subscribe(
        (data: any) => 
        {
          console.log(data);
          element.disabled = false;
          this.basicForm.reset();

          this.actionLoaderSave = false;
          this.reloadLoad= 'Y'; 

          Swal('', data.sErrorText, 'success');
            
        },
        (error: any) => 
        {
          console.log('error while adding: ', error)
          this.actionLoaderSave = false;
          element.disabled = true;

          Swal('', error.message, 'error');

      });

    }
    else 
    {
      element.disabled = true;
     // Swal('Note:', 'Kindly Fill your Credential!', 'error');
    }
  }

  update(values: Object): void {

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement> document.getElementById("btnUpdate");
    
    element.disabled = true;
      let url = 'Charge/UpdateConcession';

      this._GeneralService.post(values, url).subscribe(
        (data: any) => 
        {

          console.log('Save Result: ', data);


          element.disabled = false;
          this.actionLoaderUpdate =  false;
       
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

  close(): void 
    {
  
      this.dialogRef.close(this.reloadLoad);
  }

}
