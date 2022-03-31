
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
  selector: 'app-execute-scripts-details',
  templateUrl: './execute-scripts-details.component.html',
  styleUrls: ['./execute-scripts-details.component.scss']
})
export class ExecuteScriptsDetailsComponent implements OnInit {

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


  constructor(public appSettings: AppSettings, 
              public fb: FormBuilder, public router: Router,
              public snackBar: MatSnackBar,
              public _waitingDialog: WaitingDialog,
              private _localStorageService: LocalStorageService,
              public _GeneralService: GeneralService,
              private http: HttpClient,
              private route: ActivatedRoute,
              private activatedRoute: ActivatedRoute,
              public dialogRef: MatDialogRef<ExecuteScriptsDetailsComponent>,
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
          UserId : 0
        
        });		 
      }
      else
      {
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
          UserId : 0,
          webServiceUrl: new FormControl(null),
        
        });		 
    
    
       this.basicForm.patchValue({
          connectionName: data.record.connectionName,
          dataBaseName:  data.record.dataBaseName,
          databasePort:  data.record.databasePort,
          dateCreated: data.record.dateCreated,
          itbid: data.record.itbid,
          password: data.record.password,
          server: data.record.server,
          status: data.record.status,
          userName: data.record.userName,
          webServiceUrl: data.record.webServiceUrl,
          UserId : data.record.userId,
        
        });	
      }
 }

  ngOnInit() 
  {
      this.loadPage = false;
  }
  check(){
    
  }




  add(values: Object): void {

    this.actionLoaderSave = true;
    let element = <HTMLInputElement> document.getElementById("btnSave");
    element.disabled = true;
 
    if (this.basicForm.valid) 
    {

      this.basicForm.value.UserId  = this._GeneralService.getUserId();

      console.log('this.basicForm.value: ',  this.basicForm.value);

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
        (data: any) => 
        {
          console.log('Save Result: ', data);

          element.disabled = false;
          this.basicForm.reset();

          this.actionLoaderSave = false;

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
      let url = 'BankServiceSetup/Update';

      this._GeneralService.post(values, url).subscribe(
        (data: any) => 
        {

          console.log('Save Result: ', data);


          element.disabled = false;
          this.actionLoaderUpdate =  false;
       
          Swal('', data.sErrorText, 'success');
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
  
      this.dialogRef.close('close');
    }

}




