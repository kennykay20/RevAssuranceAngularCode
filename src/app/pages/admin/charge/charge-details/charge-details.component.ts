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
import { List } from 'linqts';
import swal from 'sweetalert2';
import { admBankBranch } from '../../../../model/admBankBranch';
import { auditTrailDetailComponent } from '../../auditTrail/auditTrail-details/audittrail-detail.component';
  

@Component({
  selector: 'app-charge-details',
    templateUrl: './charge-details.component.html',
    styleUrls: ['./charge-details.component.scss']
})
export class ChargeDetailsComponent implements OnInit {

  public form: FormGroup;
  basicForm: FormGroup;
  public settings: Settings;
  durationsnack = 3000;
  displayloader = false;
  lblProcess: any;
  selectedPrepCat: any;
  religionlist = [];
  admBankBranch: admBankBranch[]
  chargeBasisTem = [
          {
            value: 'TA',
            text: 'Transaction Amount'
          },
          {
            value: 'TC',
            text: 'Transaction Count'

          },
          {
            value: 'IC',
            text: 'Initial Charge'

          }
]

chargeBasis = []

chargeType = ['Percentage', 'Amount'] ;

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
  reloadLoad: any;
  userFullName: any
  tableName = "admCharge";


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
              public dialogRef: MatDialogRef<ChargeDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, 
        )
        {
        
        console.log('**data details', data);

        
       
       
        this.settings = this.appSettings.settings; 
    
      if(this.data.actionName === 'Add')
      {

        this.basicForm = this.fb.group({
            //servicename: [null, Validators.compose([Validators.required])],
            chargeCode: [null, Validators.compose([Validators.required])],
            description: ['', Validators.compose([Validators.required])],
            serviceId: [''],
            recipientBranch: [''],
            chargeType: ['', Validators.compose([Validators.required])],
            drcr: ['', Validators.compose([Validators.required])],
            chargeBasis: ['', Validators.compose([Validators.required])],
            direction: ['', Validators.compose([Validators.required])],
            currencyIso: [''],
            chargeValue: [null],
            chargeAcctType: [''],
            chargeAcctNo: [null],
            minimumChargeCurr: [null],
            minimumCharge: [null],
            maximumChargeCurr: [null],
            maximumCharge: [null],
            chargeFloorCurr: [null],
            chargeFloor: [null],
            ammendment: [null],
            rePrint: [null],
            templateId: [null],
            subjectToTax: [null],
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
          chargeFlatCurr: new FormControl(null),
          chargeFlat: new FormControl(null),
          ammendment: new FormControl(null),
          rePrint: new FormControl(null),
          templateId: new FormControl(null),
          subjectToTax: new FormControl(null)
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
        drcr: data.record.drcr,
        itbId : data.record.itbId,
        chargeBasis: data.record.chargeBasis,
        direction : data.record.direction,
        createdBy : data.record.userId,
        currencyIso: data.record.currencyIso,
        chargeValue: data.record.chargeValue !== null ? this._GeneralService.formatMoney(data.record.chargeValue) : data.record.chargeValue,
        chargeAcctType: data.record.chargeAcctType,
        chargeAcctNo: data.record.chargeAcctNo,
        minimumChargeCurr: data.record.minimumChargeCurr,
        minimumCharge: data.record.minimumCharge !== null ? this._GeneralService.formatMoney(data.record.minimumCharge) : data.record.minimumCharge,
        maximumChargeCurr: data.record.maximumChargeCurr,
        maximumCharge: data.record.maximumCharge !== null ? this._GeneralService.formatMoney(data.record.maximumCharge) : data.record.maximumCharge,
        chargeFloorCurr: data.record.chargeFloorCurr,
        chargeFloor: data.record.chargeFloor,
        ammendment: data.record.ammendment,
        rePrint: data.record.rePrint,
        templateId: data.record.templateId,
        subjectToTax: data.record.subjectToTax,
        UserId: data.record.userId,
        });	
        this.getUserName(data.record.userId);

        this.chargeBasis = [
          {
            value: 'TA',
            text: 'Transaction Amount'
          },
          {
            value: 'TC',
            text: 'Transaction Count'

          },
          {
            value: 'IC',
            text: 'Initial Charge'

          }
        ];
      }
 }

  ngOnInit() 
  {
      this.loadPage = false;
      this.getServices();
      this.getCurrencies();
      this.getAcctTypes();
      this.getTemplates();
      this.loadBranch();
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

  getCurrencies():void{
    let url = 'Currency/GetAll';
    let val = 
    {
      "aId": 0,
      "userName": "string",
      "password": "string",
      "dateCreated": "2020-05-12T12:08:01.854Z"
    }

    this._GeneralService.homePage(val, url)
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

    this._GeneralService.homePage(val, url)
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

    this._GeneralService.homePage(val, url)
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

      let url = 'Charge/Add';


      this._GeneralService.homePage(this.basicForm.value, url).subscribe(
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

    if (this.basicForm.value.chargeCode === null || this.basicForm.value.chargeCode === '') {

      swal('', 'Enter Charge Code', 'error');
      return;
    }
    if (this.basicForm.value.description === null || this.basicForm.value.description === '') {

      swal('', 'Enter Description', 'error');
      return;
    }
    if (this.basicForm.value.chargeType === null || this.basicForm.value.chargeType === '') {

      swal('', 'Select Charge Type', 'error');
      return;
    }

    if (this.basicForm.value.chargeBasis === null || this.basicForm.value.chargeBasis === '') {

      swal('', 'Select Charge Basis', 'error');
      return;
    }
    if(this.basicForm.valid)

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement> document.getElementById("btnUpdate");
    
    element.disabled = true;
      let url = 'Charge/Update';

      this._GeneralService.post(values, url).subscribe(
        (data: any) => 
        {
          console.log('Save Result: ', data);
          element.disabled = false;
          this.actionLoaderUpdate =  false;
          //Swal('', data.responseMessage, 'success');
          if(data.responseCode == 2)
            Swal('', data.responseMessage, 'success');
          else
            Swal('', data.responseMessage, 'error');
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
  convertValue(event, formValue){

    //console.log("event.val ", event.target.value);
    let val = this._GeneralService.formatMoney(event.target.value);
    console.log('val pp ',val);
    console.log('formValue ',formValue);
    if(formValue == "chargeValue"){
      this.basicForm.patchValue({chargeValue: val});
    }
    else if(formValue == "minimumCharge"){
      this.basicForm.patchValue({minimumCharge: val});
    }
    else if(formValue == "maximumCharge")
    {
      this.basicForm.patchValue({maximumCharge: val});
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

  
  loadBranch1(): void {

    this.loadPage = true;

    let url = 'Branch/GetAll';

      let val = 
        {
          "aId": 0,
          "userName": "string",
          "password": "string",
          "dateCreated": "2020-05-12T12:08:01.854Z"
        }

  this._GeneralService.post(val, url).subscribe(
    (data: any) => 
    {
      this.loadPage = false;
      this.admBankBranch = data;
      
      this.loadPage = false;
        
    },
    (error: any) => 
    {
    
      Swal('', error.message, 'error');

  });
}


loadBranch(): void { 

  this.loadPage = true;
  let track = 0;
  let url = 'AdmGetAll/GetAll';


this._GeneralService.post(null, url).subscribe(
  (data: any) => 
  {

    this.admBankBranch = data.branch;
    
    console.log('data admBankBranch: ', this.currencies);

    this.loadPage = false;
      
  },
  (error: any) => 
  {
   
});
}

  ngAfterViewInit()  
  {
    this.settings.loadingSpinner = false; 
  }

    close(): void 
    {
  
      this.dialogRef.close('close');
    }

    chargetype(event){
      
      const val = event.target.value;

      //['Percentage', 'Amount'] ;
      if(val === 'Percentage')
        this.chargeBasis =  new List<any>( this.chargeBasisTem).Where(c=> c.value !== 'TC').ToArray();
      
      if(val === 'Amount') {
        this.chargeBasis =  new List<any>( this.chargeBasisTem).Where(c=> c.value === 'TC').ToArray();
       

        this.basicForm.value.chargeBasis = this.chargeBasis[0].value
      }
      
    
      }

      branchSelect(event){
        console.log('branchSelect3: ',  event);
        console.log('branchSelect1: ',  event.target.value);
        this.basicForm.value.recipientBranch = event.target.value;
       //console.log('branchSelect: ',  this.basicForm.value.recipientBranch);
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




