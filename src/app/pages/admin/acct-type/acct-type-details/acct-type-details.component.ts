
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
  selector: 'app-acct-type-details',
  templateUrl: './acct-type-details.component.html',
  styleUrls: ['./acct-type-details.component.scss']
})
export class AcctTypeDetailsComponent implements OnInit {

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


  ActionEditHeaderMsg = GenModel.ActionEditHeaderMsg;
  ActionViewHeaderMsg  = GenModel.ActionViewHeaderMsg;

  userFullName: any

  ActionDisplay : any;

  reloadLoad: any;

  createdBy: any;
  authBy: any;

  statuses: any;

  getUserDetails: any;
  tableName = "admAccountType"

  constructor(public appSettings: AppSettings, 
              public fb: FormBuilder, public router: Router,
              public snackBar: MatSnackBar,
              public dialog: MatDialog,
              public _waitingDialog: WaitingDialog,
              private _localStorageService: LocalStorageService,
              public _GeneralService: GeneralService,
              private http: HttpClient,
              private route: ActivatedRoute,
              private activatedRoute: ActivatedRoute,
              public dialogRef: MatDialogRef<AcctTypeDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, 
        )
        {
        //   let param4 = this.route.snapshot.params.mid;
        //   console.log('**data param4', param4);

        //   console.log('**data Details', data);

         
        //   let returnAss =  this._GeneralService.ReturnAssingned(param4);
        //   console.log('**data returnAss', returnAss);
        
        //  this.userFullName = this._GeneralService.ReturnUserDetails();
        // console.log('**data  this.userFullName',  this.userFullName);
       
       
        this.settings = this.appSettings.settings; 


      



    
      if(this.data.actionName === 'Add')
      {

        this.basicForm = this.fb.group({
          

          accountTypeCode: [null, Validators.compose([Validators.required])],
          description: [null, Validators.compose([Validators.required])]
        });		 
      }
      else
      {

        this.ActionHeaderMsg = '';
        this.ActionDisplay = this.ActionViewHeaderMsg;
        this.basicForm = this.fb.group({
         

          accountTypeCode : [null, Validators.compose([Validators.required])],
          description: [null, Validators.compose([Validators.required])],
          accountFormat: new FormControl(null),
          delimeter: new FormControl(null),
          acctLenght: new FormControl(null),
          userId: new FormControl(null),
          userDetails: new FormControl(null),
          dateCreatedDetails:  new FormControl(null),
          dateCreated: new FormControl(null),
          status: new FormControl(null),
          itbId: new FormControl(null),
        });		 
    
    
       this.basicForm.patchValue({
         

          accountTypeCode : data.record.accountTypeCode,
          description: data.record.description,
          accountFormat: data.record.accountFormat,
          delimeter: data.record.delimeter,
          acctLenght: data.record.acctLenght,
          userId:  data.record.userId,
          dateCreatedDetails: this._GeneralService.dateCreated(data.record.dateCreated),
          dateCreated: data.record.dateCreated,
          status: data.record.status,
          itbId:  data.record.itbId,

        });	

        
        this.loadCreatedByUserDetails(this.basicForm.value.userId);
     


      }
 }

 loadCreatedByUserDetails(UserId: any): any {

  let url = 'Users/GetUserById';
    let val = 
      {
        "aId": 0,
        "userName": "string",
        "password": "string",
        "dateCreated": "2020-05-12T12:08:01.854Z",
        UserId: UserId
      }

this._GeneralService.homePage(val, url)
  .subscribe(
  (data: any) => 
  {
   

    this.createdBy = data.fullName;

  },
  (error: any) => 
  {
  
   

});
}

loadAuthByUserDetails(UserId: any): any {

  let url = 'Users/GetUserById';
    let val = 
      {
        "aId": 0,
        "userName": "string",
        "password": "string",
        "dateCreated": "2020-05-12T12:08:01.854Z",
        UserId: UserId
      }

this._GeneralService.post(val, url)
  .subscribe(
  (data: any) => 
  {
   

    this.authBy = data.fullName;

  },
  (error: any) => 
  {
  
  

});
}

  ngOnInit() 
  {
      this.loadPage = false;
      this.statuses = this._GeneralService.Statuses;
      this.getUserDetails =  this._GeneralService.getUserDetails();

  }
  check(){
    
  }


  add(values: Object): void {

    this.actionLoaderSave = true;
    let element = <HTMLInputElement> document.getElementById("btnSave");
    element.disabled = true;
 
    if (this.basicForm.valid) 
    {

      this.basicForm.value.userId  = this._GeneralService.getUserId();

      let url = 'AccountType/Add';

     

      this._GeneralService.homePage(this.basicForm.value, url).subscribe(
        (data: any) => 
        {
         

          element.disabled = false;
          this.basicForm.reset();

          this.actionLoaderSave = false;
          this.reloadLoad= 'Y';
          if(data.responseCode === 0)
            Swal('', data.sErrorText, 'success');
          else
            Swal('', data.sErrorText, 'error');
        },
        (error: any) => 
        {
        
          this.actionLoaderSave = false;
          element.disabled = false;

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

    this.basicForm.value.userId = this.getUserDetails.userId;

    let url = 'AccountType/Update';

      this._GeneralService.post(this.basicForm.value, url).subscribe(
        (data: any) => 
        {

         


          element.disabled = false;
          this.actionLoaderUpdate =  false;
          this.reloadLoad= 'Y';
          if(data.responseCode == 2){
            Swal('', data.sErrorText, 'success');
          }
          else{
            Swal('', data.sErrorText, 'error');
          }
        },
        (error: any) => {
          
          //alert('error ' + error);
          console.log('erros ', error);
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




