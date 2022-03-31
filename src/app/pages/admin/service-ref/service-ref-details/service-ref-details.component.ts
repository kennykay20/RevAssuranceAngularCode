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
import {ServiceModel} from '../../../../model/service.model';
import { auditTrailDetailComponent } from '../../auditTrail/auditTrail-details/audittrail-detail.component';
  

@Component({
  selector: 'app-service-ref-details',
    templateUrl: './service-ref-details.component.html',
    styleUrls: ['./service-ref-details.component.scss']
})
export class ServiceRefDetailsComponent implements OnInit {

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
  services : Array<any>;
  retryService: number =  GenModel.retryService;
  RetryAttmMsg = GenModel.RetryAttmMsg;
  retryMessage: any;

  reload = ''
  userFullName: any
  statuses: any;
  createdBy: any;
  tableName = "admServiceReference";

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
              public dialogRef: MatDialogRef<ServiceRefDetailsComponent>,
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
        //  console.log()
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
          UserId : this._GeneralService.getUserId()
        
        });		 
      }

      else
      {
        this.basicForm = this.fb.group({
          serviceName: new FormControl(null),
          serviceDescription: new FormControl(null),
          serviceCode: new FormControl(null),
          dateCreated: new FormControl(null),
          itbId: new FormControl(null),
          bankAbbrv: new FormControl(null),
          frequency: new FormControl(null),
          status: new FormControl(null),
          refFormat: new FormControl(null),
          bankAbreviation: null,
          countryCode: null,
          datecreated: null,
          servicId: null,
          referenceFormat: null,
          referenceFormatDisplay: null,
          transactionDate: null,
          userId: null,
          createdBy: null,
         
        });	
        

        
    
      console.log(' data details', data);
       this.basicForm.patchValue({
              serviceName: data.record.serviceCode,
              serviceDescription: data.record.serviceDescription,
              serviceCode:  data.record.serviceCode,
              bankAbreviation: data.record.bankAbreviation,
              frequency: data.record.frequency,
              refFormat: data.record.referenceFormat,
              referenceFormat: data.record.referenceFormat,
              datecreated: this._GeneralService.dateCreated(data.record.datecreated),
              itbId: data.record.itbId,
              status: data.record.status,
              userId: data.record.userId,
              createdBy: null,
              serviceId: data.record.serviceId,
        });	

        this.getCreatedBy(data);
      }
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
  ngOnInit() 
  {
      this.loadPage = false;
      this.statuses = this._GeneralService.Statuses;
  }
  check(){
    
  }

  getServices()
  {
    let url = 'ServiceRef/GetServices';
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

        console.log('services data', data);
        this.loadPage = false;
        this.services = data;
       // this.rows = data;
      },
      (error: any) => { 

    });
 
  }

  getServiceById(id): ServiceModel
  {
    let serv = this.services.find(p=>p.serviceId == id);
    return {name : serv.servicename,
            descr : serv.serviceDesciption
          };
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

          this.reload = 'Y';

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

    console.log("values ", values);
    console.log("basicForm.value ", this.basicForm.value);
    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement> document.getElementById("btnUpdate");
    
    element.disabled = true;
    
    let url = 'ServiceRef/Update';

      this._GeneralService.post(values, url).subscribe(
        (data: any) => 
        {

          //console.log('Save Result: ', data);

          this.reload = 'Y';
          element.disabled = false;
          this.actionLoaderUpdate =  false;
       
          if(data.responseCode == 0)
            Swal('', data.sErrorText, 'success');
          else
            Swal('', data.sErrorText, 'error');
        },
        (error: any) => {
          
          element.disabled = false;
          this.actionLoaderUpdate =  false;
       
          Swal('', error.error.sErrorText, 'error');
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
  
      this.dialogRef.close(this.reload);
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




