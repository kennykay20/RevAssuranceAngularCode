
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
  selector: 'app-template-set-up-details',
  templateUrl: './template-set-up-details.component.html',
  styleUrls: ['./template-set-up-details.component.scss']
})
export class TemplateSetUpDetailsComponent implements OnInit {

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
  errorOccur = GenModel.errorOccur;
  reloadLoad: any;
  userFullName: any;
  services = [];
  getUserDetails: any;
  createdBy: any;
  serviceDisabled:any = false;

  statuses: any;	  
  tableName = "admTemplate";

  constructor(public appSettings: AppSettings, 
              public fb: FormBuilder, public router: Router,
              public snackBar: MatSnackBar,
              public _waitingDialog: WaitingDialog,
              public dialog: MatDialog,
              private _localStorageService: LocalStorageService,
              public _GeneralService: GeneralService,
              private http: HttpClient,
              private route: ActivatedRoute,
              private activatedRoute: ActivatedRoute,
              public dialogRef: MatDialogRef<TemplateSetUpDetailsComponent>,
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
          templateCode: [null, Validators.compose([Validators.required])],
          templateName: [null, Validators.compose([Validators.required])],
          serviceId: ['', Validators.compose([Validators.required])],
          templateContent: [null, Validators.compose([Validators.required])],
          UserId : 0
        
        });		 
      }
      else
      {
        this.basicForm = this.fb.group({
          templateCode: [null],
          templateName: [null],
          serviceId: new FormControl(''),
          dateCreated: new FormControl(null),
          itbId: new FormControl(null),
          templateContent: new FormControl(null),
          status: new FormControl(null),
          createdBy : new FormControl(null)
        
        });		 
    
        this.serviceDisabled = true;
       this.basicForm.patchValue({
        templateCode: data.record.templateCode,
        templateName:  data.record.templateName,
        serviceId:  data.record.serviceId,
         dateCreated: data.record.dateCreated != null ? this._GeneralService.dateCreated(data.record.dateCreated): '',
         itbId: data.record.itbId,
          templateContent: data.record.templateContent,
          status: data.record.status,
          createdBy : data.record.userId, // this._GeneralService.getUserLoginId(data.record.userId),    
        
        });	

        this.loadCreatedByUserDetails(data.record.userId);

      }
 }

  loadCreatedByUserDetails(UserId): any {

    let url = 'Users/GetUserById';
    let val =
    {
      "UserId": UserId
     
    }

    this._GeneralService.homePage(val, url)
      .subscribe(
        (data: any) => {


          this.createdBy = data.fullName;

        },
        (error: any) => {



        });
  }

  ngOnInit() 
  {
      this.loadPage = false;
      this.getUserDetails =  this._GeneralService.getUserDetails();
      this.getServices(this.getUserDetails);
    this.statuses = this._GeneralService.Statuses;
   
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

  
      let url = 'Template/Add';


      this._GeneralService.homePage(this.basicForm.value, url).subscribe(
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

  getServices(param: any):void{
    let url = 'Service/GetAllServices';

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
    //console.log(`this.services`)

    this._GeneralService.post(val, url)
    .subscribe(
      (data: any) => {

        console.log('this.services: ',this.services);

        this.loadPage = false;
        this.services = data._response;

        console.log(this.services)
      },
      (error: any) => { 
    });
  }

   getServiceName(id : number): string{
     if(id != null && id != undefined)
     {
      let serv  = this.services.find(p=> p.serviceId == id); 
      return serv.servicename;
     }
    return "";
  
 }

  getUsers(param: any) {
    //do validations
    //call apii to execute script

    let url = 'Service/GetAllServices';
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
    this.loadPage = true;
    //make call to update api and pass obj
    this._GeneralService.post(val, url)
      .subscribe(
        (data: any) => {

          //console.log(data);

        },
        (error: any) => {
        });
  }
  
  

  update(values: Object): void {

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement> document.getElementById("btnUpdate");
   

    this.basicForm.value.userId = this.getUserDetails.userId;
    element.disabled = true;
      let url = 'Template/Update';

    this._GeneralService.post(this.basicForm.value, url).subscribe(
        (data: any) => 
        {
          console.log('Save Result: ', data);

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




