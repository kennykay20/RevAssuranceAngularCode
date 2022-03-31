
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
  selector: 'app-currency-details',
  templateUrl: './currency-details.component.html',
  styleUrls: ['./currency-details.component.scss']
})
export class CurrencyDetailsComponent implements OnInit {

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
  reloadLoad: any;

  userFullName: any
 
  createdBy: any;
  actionTaken = 'N';
  getUserDetails: any;
  listCurrencies: any;
  IsoCode: any;
  currencyValue: string = '';
  tableName = "admCurrency";
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
              public dialogRef: MatDialogRef<CurrencyDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, 
        )
        {

        this.settings = this.appSettings.settings; 
    
        
      if(this.data.actionName === 'Add')
      {

        console.log('ccyS " " ',this.currencyValue);
        this.loadGlobalListedCurrencies();
        //console.log('output Currencies ', this.data.record);
        //this.listCurrencies = this.data.record;
        this.basicForm = this.fb.group({
          currencyNo: [null, Validators.compose([Validators.required,Validators.maxLength(3)])],
          isoCode: [null],
          description: [null, Validators.compose([Validators.required])],
          isLocalCurrency: [null],
          numberOfDecimal: [null, Validators.compose([Validators.required])],
          weight: [null, Validators.compose([Validators.required])],
          UserId : 0,
          countryCode2: ['']
        });		 
      }
      else
      {
        this.basicForm = this.fb.group({
          currencyNo: [null],
          isoCode: [null],
          description: new FormControl(null),
          isLocalCurrency: new FormControl(false),
          numberOfDecimal: new FormControl(null),
          weight: new FormControl(null),
         // server: new FormControl(null),
          //status: new FormControl(null),
          //userName: new FormControl(null),
          dateCreated: new FormControl(null),
          itbid: new FormControl(null),
          status: new FormControl(null),
          userId: new FormControl(null),
          createdBy: new FormControl(null),
          countryCode2: new FormControl(null)
          //webServiceUrl: new FormControl(null),
        });		 
    
        this.loadGlobalCurrencies();
        this.currencyValue = data.record.countryCode2;
        console.log('ccyS ',this.currencyValue);
       this.basicForm.patchValue({
        currencyNo: data.record.currencyNo,
        isoCode: data.record.isoCode,
        description:  data.record.description,
        isLocalCurrency: data.record.isLocalCurrency,
        numberOfDecimal: data.record.numberOfDecimal,
        weight: data.record.weight,
        dateCreated: this._GeneralService.dateCreated(data.record.dateCreated),
        itbid: data.record.itbid,
        //createdBy: data.record.userId,
        status : data.record.status,
        UserId : data.record.userId,
        countryCode2: data.record.countryCode2
        });	
        //this.selectedCurrency(data.record.isoCode);
        this.getCreatedBy(data);
       
      }
 }

  ngOnInit() 
  {
      this.loadPage = false;
      this.getUserDetails =  this._GeneralService.getUserDetails();
  }

  check(){
    
  }

  loadGlobalListedCurrencies(){
    let url = 'Currency/GetAllListedCurrency';


    this._GeneralService.get(url).subscribe(
      (data: any) => 
      {
        this.listCurrencies = data;
        console.log('globalListedCurrency ', data);
      },
      (error: any) => 
      {
        console.log('error while fetching global currencies By: ', error)
    
    });
  }

  loadGlobalCurrencies(){
    let url = 'Currency/GetAllGlobal';


    this._GeneralService.get(url).subscribe(
      (data: any) => 
      {
        this.listCurrencies = data;
        console.log('globalCurrency ', data);
      },
      (error: any) => 
      {
        console.log('error while fetching global currencies By: ', error)
    
    });
  }

  selectedCurrency(value): void{
    console.log('ca ', value);

    let url = 'Currency/GetAllGlobalByValue';

    
    let val = {
      vals: value
    }

    this._GeneralService.post(val,url).subscribe(
      (data: any) => 
      {
        //this.listCurrencies = data;
        //console.log('globalCurrency ', data);
        //this.basicForm.value.currencyNo = data.ccyNo;

        this.basicForm.patchValue({
          currencyNo: data.ccyNo,
          description:  data.currencyName,
          itbid: data.itbId,
          isoCode: data.ccyCode
        });	
      },
      (error: any) => 
      {
        console.log('error while fetching global currencies By: ', error)
    
    });
  }

  getCreatedBy(rec: any){

    let url = 'Currency/GetBy';

    let val = {
      UserId: rec.record.userId
    }


    this._GeneralService.post(val, url).subscribe(
      (data: any) => 
      {
        this.createdBy = data.fullName;
      },
      (error: any) => 
      {
        console.log('error while fetching created By: ', error)
    
    });
  }


  getSingleGlobalCurrency(){
    let url = 'Currency/GetAllGlobalByValue';

    
    let val = {
      valId: this.basicForm.value.isoCode
    }

    this._GeneralService.post(val,url).subscribe(
      (data: any) => 
      {
        //this.listCurrencies = data;
        console.log('globalCurrency2222 ', data);
        this.IsoCode = data.countryCode3;
        console.log('this.IsoCode ', this.IsoCode);
      },
      (error: any) => 
      {
        console.log('error while fetching global currencies By: ', error)
    
      });
 
  }


  add(values: Object): void {

    this.actionLoaderSave = true;
    let element = <HTMLInputElement> document.getElementById("btnSave");
    element.disabled = true;

    //this.getSingleGlobalCurrency();
    // this.basicForm.patchValue({
    //   isoCode : this.IsoCode
    // });

    if (this.basicForm.valid) 
    {

      

      this.basicForm.value.userId = this.getUserDetails.userId;
      
      console.log('this.basicForm.value :: ',  this.basicForm.value);

      let url = 'Currency/Add';
      // let val = {
      //   admCurrency: this.basicForm.value, 
      //   LoginUserId: this.getUserDetails.userId
      // }

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
          console.log('error while adding: ', error)
          this.actionLoaderSave = false;
          element.disabled = false;

          Swal('', error.error.responseMessage, 'error');

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
      let url = 'Currency/Update';

      this.basicForm.value.userId = this.getUserDetails.userId;

      this._GeneralService.post(this.basicForm.value, url).subscribe(
        (data: any) => 
        {

          console.log('Save Result: ', data);


          element.disabled = false;
          this.actionLoaderUpdate =  false;
          this.reloadLoad = 'Y';
          if(data.responseCode == 0)
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




