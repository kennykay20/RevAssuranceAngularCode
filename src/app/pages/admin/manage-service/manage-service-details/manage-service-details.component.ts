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
  selector: 'app-manage-service-details',
  templateUrl: './manage-service-details.component.html',
  styleUrls: ['./manage-service-details.component.scss']
})
export class ManageServiceDetailsComponent implements OnInit {

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
  dept = [];
  userFullName: any

  statuses: any;
  getUserDetails: any;
  createdBy: any;
  tableName = "admService";

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
              public dialogRef: MatDialogRef<ManageServiceDetailsComponent>,
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
         //servicename: [null, Validators.compose([Validators.required])],
          serviceDesciption: [null, Validators.compose([Validators.required])],
          contDrAcctNo: [null],
          contDrAcctType: [null],
          contCrAcctNo: [null],
          contCrAcctType: [null],
          contDrAcctNarr: [null],
          contCrAcctNarr: [null],
          defaultDept: [null],
          incomeAcctNo: [null],
          incomeAcctType: [null],
          channel: [null],
          frequency: [null],
          sequence: [null],
          refPrefix: [null],
          custAcctDrTC: [null],
          glAcctDrTC: [null],
          custAcctCrTC: [null],
          glAcctCrTC: [null],
          reqAmortSched: [null],
          UserId : 0
          
        });		 
      }
      else
      {
        this.basicForm = this.fb.group({
          //servicename: [null],
          serviceDescription: new FormControl(null),
          contDrAcctNo: new FormControl(null),
          dateCreated: new FormControl(null),
          serviceId: new FormControl(null),
          contDrAcctType: new FormControl(null),
          contCrAcctType: new FormControl(null),
          status: new FormControl(null),
          contCrAcctNarr: new FormControl(null),
          UserId : new FormControl(null),
          contCrAcctNo: new FormControl(null),
          contDrAcctNarr: new FormControl(null),
          createdBy : new FormControl(null),
          incomeAcctNo: new FormControl(null),
          incomeAcctType: new FormControl(null),
          channel: new FormControl(null),
          frequency: new FormControl(null),
          sequence: new FormControl(null),
          refPrefix: new FormControl(null),
          custAcctDrTC: new FormControl(null),
          glAcctDrTC: new FormControl(null),
          custAcctCrTC: new FormControl(null),
          glAcctCrTC: new FormControl(null),
          reqAmortSched: new FormControl(null),
          defaultDept: new FormControl(null),
        });		 
    
    
       this.basicForm.patchValue({
        //servicename: data.record.servicename,
         serviceDescription: data.record.serviceDescription,
        contDrAcctNo:  data.record.contDrAcctNo,
        dateCreated: this._GeneralService.dateCreated(data.record.dateCreated),
        serviceId: data.record.serviceId,
        contDrAcctType: data.record.contDrAcctType,
        contCrAcctType: data.record.contCrAcctType,
        status: data.record.status,
        contCrAcctNarr: data.record.contCrAcctNarr,
        contCrAcctNo: data.record.contCrAcctNo,
        contDrAcctNarr : data.record.contDrAcctNarr,
        createdBy : data.record.userId,
        incomeAcctNo: data.record.incomeAcctNo,
        incomeAcctType: data.record.incomeAcctType,
        channel: data.record.channel,
        frequency: data.record.frequency,
        sequence:data.record.sequence,
        refPrefix: data.record.refPrefix,
        custAcctDrTC: data.record.custAcctDrTC,
        glAcctDrTC: data.record.glAcctDrTC,
        custAcctCrTC: data.record.custAcctCrTC,
        glAcctCrTC: data.record.glAcctCrTC,
        reqAmortSched: data.record.reqAmortSched,
        defaultDept: data.record.defaultDept
        });
        
         this.getCreatedBy(data);
      }
 }

  ngOnInit() 
  {
      this.loadPage = false;
     
      this.statuses = this._GeneralService.Statuses;

      this.getUserDetails =  this._GeneralService.getUserDetails();
      this.getDept(this.getUserDetails)
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

  getDept(param: any):void{
    let url = 'Department/GetAll';
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

    this._GeneralService.post(val, url)
    .subscribe(
      (data: any) => {
        this.loadPage = false;
        this.dept = data._response;
      },
      (error: any) => { 
    });
  }

  getDeptDes(id : number): String{
    let dep  = this.dept.find(p=>p.itbId == id); 
    return dep.deptname;
  }

  add(values: Object): void {

    this.actionLoaderSave = true;
    let element = <HTMLInputElement> document.getElementById("btnSave");
    element.disabled = true;
 
    if (this.basicForm.valid) 
    {

      this.basicForm.value.UserId  = this._GeneralService.getUserId();

      console.log('this.basicForm.value: ',  this.basicForm.value);

      let url = 'Service/Add';

      this._GeneralService.post(this.basicForm.value, url).subscribe(
        (data: any) => 
        {
          console.log('add Result: ', data);

          element.disabled = false;
          this.basicForm.reset();

          this.actionLoaderSave = false;

          Swal('', data.responseMessage, 'success');
            
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
      let url = 'Service/Update';
      
      this.basicForm.value.UserId  = this._GeneralService.getUserId();

      this._GeneralService.post(this.basicForm.value, url).subscribe(
        (data: any) => 
        {
          console.log('Save Result: ', data);
          element.disabled = false;
          this.actionLoaderUpdate =  false;
       
          if(data.responseCode == 0)
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




