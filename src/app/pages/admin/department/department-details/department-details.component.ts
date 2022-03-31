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
  selector: 'app-department-details',
  templateUrl: './department-details.component.html',
  styleUrls: ['./department-details.component.scss']
})
export class DepartmentDetailsComponent implements OnInit {

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
  ActionHeaderMsg = "";
  requiredFieldMsg = GenModel.requiredFieldMsg;
  actionLoaderSave = false;
  actionLoaderUpdate = false;

  
  createdBy: any;
  reloadLoad: any;
  userFullName: any
  statuses: any;
  tableName = "admDepartment";

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
              public dialogRef: MatDialogRef<DepartmentDetailsComponent>,
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
          deptName: [null, Validators.compose([Validators.required])],
          deptCode: [null, Validators.compose([Validators.required])],
          HODName: [null, Validators.compose([Validators.required])],
          HODEmail: [null, Validators.compose([Validators.required])],
          HODAddress: [null, Validators.compose([Validators.required])],
          UserId : 0
        
        });	
        this.ActionHeaderMsg = GenModel.ActionHeaderMsg;	 
      }
      else
      {
        // dateCreated: "2018-10-23T09:12:14.543"
        // deptCode: "MSC"
        // deptId: 1
        // deptname: "IT"
        // status: "Active"
        // userId: 2
        this.ActionHeaderMsg = this.data.actionName;
        this.basicForm = this.fb.group({
          
          deptId: [null],
          deptName: new FormControl(null),
          deptCode: new FormControl(null),
          HODName: new FormControl(null),
          HODEmail: new FormControl(null),
          HODAddress: new FormControl(null),
          userId: new FormControl(null),
          dateCreated: new FormControl(null),
          status: new FormControl(null),
          createdBy: null
         
        });		 
        
        console.log("records, ", data.record);
       this.basicForm.patchValue({
        
          
        
          deptId: data.record.deptId,
          deptName: data.record.deptname,
          HODName: data.record.hodName,
          HODEmail: data.record.hodEmail,
          HODAddress: data.record.hodAddress,
          userId: data.record.userId,
          dateCreated: this._GeneralService.dateCreated(data.record.dateCreated),
          status: data.record.status,
          deptCode: data.record.deptCode,
          //createdBy : data.record.userId
          
        });	

        this.getCreatedBy(data);
      }
 }

  ngOnInit() 
  {
      this.loadPage = false;
      this.statuses = this._GeneralService.Statuses;
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
       //console.log('created by Data: ', data);
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
      this.basicForm.value.userId  = user.userId ;

     let val = { 
       admDepartment: this.basicForm.value,
      
      LoginUserId:  user.userId
     }
      console.log('this.basicForm.value: ',  this.basicForm.value);

      let url = 'Department/Add';
      this._GeneralService.post(val, url).subscribe(
        (data: any) => 
        {
          console.log(data);
          element.disabled = false;
          this.actionLoaderSave = false;
          this.reloadLoad = 'Y'; 

          this.basicForm.reset();

         
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

      let url = 'Department/Update';

      let user =this._GeneralService.getUserDetails();
      let val = { 
        admDepartment: this.basicForm.value,
        LoginUserId:  user.userId
      }

      this._GeneralService.post(val, url).subscribe(
        (data: any) => 
        {
          console.log('Save Result: ', data);

          this.reloadLoad= 'Y';
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




