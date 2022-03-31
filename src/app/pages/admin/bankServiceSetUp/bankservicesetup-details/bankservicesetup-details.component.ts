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
  selector: 'app-bankservicesetup-details',
     templateUrl: './bankservicesetup-details.component.html',
   styleUrls: ['./bankservicesetup-details.component.scss']
})
export class BankservicesetupDetailsComponent implements OnInit {

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
  ActionViewHeaderMsg = GenModel.ActionViewHeaderMsg;


  requiredFieldMsg = GenModel.requiredFieldMsg;
  errorOccur = GenModel.errorOccur;
  actionLoaderSave = false;
  actionLoaderUpdate = false;

  userFullName: any

  ActionDisplay: any;

  reloadLoad: any;
  createdBy: any;

  statuses: any;
  passwordHide = false;
  tableName = "admBankServiceSetup";
  constructor(public appSettings: AppSettings, 
              public fb: FormBuilder, public router: Router,
              public dialog: MatDialog,
              public snackBar: MatSnackBar,
              public _waitingDialog: WaitingDialog,
              private _localStorageService: LocalStorageService,
              public _GeneralService: GeneralService,
              private http: HttpClient,
              private route: ActivatedRoute,
              private activatedRoute: ActivatedRoute,
              public dialogRef: MatDialogRef<BankservicesetupDetailsComponent>,
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
          connectionName: [null, Validators.compose([Validators.required])],
          dataBaseName: [null, Validators.compose([Validators.required])],
          databasePort: [null, Validators.compose([Validators.required])],
          password: [null, Validators.compose([Validators.required])],
          server: [null, Validators.compose([Validators.required])],
          userName: [null, Validators.compose([Validators.required])],
          webServiceUrl: [null, Validators.compose([Validators.required])],
          userId : 0
        
        });		 
      }
      else
      {
        this.ActionHeaderMsg = '';
        this.ActionDisplay = this.ActionViewHeaderMsg;

        this.basicForm = this.fb.group({
          connectionName: [null],
          dataBaseName: [null],
          databasePort: new FormControl(null),
          dateCreated: new FormControl(null),
          itbid: new FormControl(null),
          password: new FormControl(null),
          server: new FormControl(null),
          status: new FormControl(null),
          userName: new FormControl(null),
          userId : 0,
          webServiceUrl: new FormControl(null),
          createdBy: new FormControl(null)
        
        });		 
    
    
       this.basicForm.patchValue({
          connectionName: data.record.connectionName,
          dataBaseName:  data.record.dataBaseName,
          databasePort:  data.record.databasePort,
          dateCreated: this._GeneralService.dateCreated(data.record.dateCreated),
          itbid: data.record.itbid,
          password: data.record.password,
          server: data.record.server,
          status: data.record.status,
          userName: data.record.userName,
          webServiceUrl:  data.record.webServiceUrl,
          userId : data.record.userId,
        
        });	

        this.getCreatedBy(data);
      }
 }

  ngOnInit() 
  {
      this.loadPage = false;
      this.statuses = this._GeneralService.Statuses;
  }
  check(){
    
  }

  getCreatedBy(values: any): void {

    this.loadPage = true;

   let url = 'Users/GetUser';
   let val = 
   {
     CreatedBy: values.record.userId,
     
   };

   this._GeneralService.post(val, url).subscribe(
     (data: any) => 
     {
       console.log('created by Data: ', data);
       this.createdBy = data.fullName;
       this.loadPage = false;
         
     },
     (error: any) => 
     {
       console.log('created error by while adding: ', error);
   });

}




  add(values: Object): void {

    this.actionLoaderSave = true;
    let element = <HTMLInputElement> document.getElementById("btnSave");
    element.disabled = true;
 
    if (this.basicForm.valid) 
    {

      let user =this._GeneralService.getUserDetails();
      let val = {
          admBankServiceSetup: this.basicForm.value, 
          LoginUserId:user.userId
      }
  
  
      let url = 'BankServiceSetup/Add';


      this._GeneralService.post(val, url).subscribe(
        (data: any) => 
        {
        

          element.disabled = false;
          this.basicForm.reset();

          this.actionLoaderSave = false;
          this.reloadLoad= 'Y'; 

          Swal('', data.responseMessage, 'success');
            
        },
        (error: any) => 
        {
         
          this.actionLoaderSave = false;
          element.disabled = false;

          Swal('', error.error.responseMessage, 'error');

      });
    }
    else 
    {
      element.disabled = false;
     // Swal('Note:', 'Kindly Fill your Credential!', 'error');
    }
  }

  update(values: Object): void {

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement> document.getElementById("btnUpdate");
    
    element.disabled = true;
      let url = 'BankServiceSetup/Update';
      let user =this._GeneralService.getUserDetails();
    let val = {
        admBankServiceSetup: this.basicForm.value, 
        LoginUserId:user.userId
    }

      this._GeneralService.post(val, url).subscribe(
        (data: any) => 
        {
          element.disabled = false;
          this.actionLoaderUpdate =  false;
           this.reloadLoad= 'Y'; 
          if(data.responseCode == 2)
            Swal('', data.responseMessage, 'success');
          else
            Swal('', data.responseMessage, 'error');
        },
        (error: any) => {
          
          element.disabled = false;
          this.actionLoaderUpdate =  false;
       
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





 


  ngAfterViewInit()  
  {
    this.settings.loadingSpinner = false; 
  }

    close(): void 
    {
  
      this.dialogRef.close(this.reloadLoad);
    }

    toggoleHidePwd()
    {
     // console.log('toggoleHidePwd this.passwordHide', this.passwordHide)
        if(this.passwordHide == false)
        {
          this.passwordHide = true;
          console.log('toggoleHidePwd this.passwordHide1', this.passwordHide)
        }
        else
        {
          this.passwordHide = false;
          console.log('toggoleHidePwd this.passwordHide2', this.passwordHide)
        }
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




