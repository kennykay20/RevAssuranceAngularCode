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
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss']
})
export class RoleDetailsComponent implements OnInit {
  statuses: any;
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
  createdBy : any;
  reload: any;
  creditLimit: any;
   debitLimit: any;
  constructor(public appSettings: AppSettings, 
              public fb: FormBuilder, public router: Router,
              public snackBar: MatSnackBar,
              public _waitingDialog: WaitingDialog,
              private _localStorageService: LocalStorageService,
              public _GeneralService: GeneralService,
              private http: HttpClient,
              private route: ActivatedRoute,
              private activatedRoute: ActivatedRoute,
              public dialogRef: MatDialogRef<RoleDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, 
        )
        {
        this.settings = this.appSettings.settings; 
    
      if(this.data.actionName === 'Add')
      {
        this.basicForm = this.fb.group({
         
          roleName: [null, Validators.compose([Validators.required])],
          description: [null, Validators.compose([Validators.required])],
          creditLimit: [null],
          debitLimit: [null],

        });		 
      }
      else
      {

        console.log('data details: ', data);
        
        this.basicForm = this.fb.group({

          roleId: null,
          roleName: [null, Validators.compose([Validators.required])],
          description: [null, Validators.compose([Validators.required])],
          creditLimit: [null, Validators.compose([Validators.required])],
          debitLimit: [null, Validators.compose([Validators.required])],
          userId: null,
          status: [null, Validators.compose([Validators.required])],
          dateCreated: null,
          createdBy: null,
        
        });		 
    
    
       this.basicForm.patchValue({
          

          roleId: data.record.roleId,
          roleName: data.record.roleName,
          description: data.record.description,
          creditLimit: data.record.creditLimit,
          debitLimit: data.record.debitLimit,
          userId: data.record.userId,
          status: data.record.status,
          dateCreated: this._GeneralService.dateCreated(data.record.dateCreated),
        
        });	

       
        
        this.creditLimit = data.record.creditLimit != null ? this._GeneralService.formatMoney(data.record.creditLimit): '0.00';
        this.debitLimit = data.record.debitLimit != null ? this._GeneralService.formatMoney(data.record.debitLimit): '0.00';

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

      let user  = this._GeneralService.getUserDetails();
      this.basicForm.value.userId = user.userId;

      console.log('this.basicForm.value add: ',  this.basicForm.value);

      let val = {
        admRole: this.basicForm.value,
        LoginUserId:user.userId
      }

      let url = 'Roles/Add';

      this._GeneralService.post(val, url).subscribe(
        (data: any) => 
        {
          console.log('Save Result: ', data);

          element.disabled = false;
          this.basicForm.reset();

          this.actionLoaderSave = false;
          this.reload = 'Y';

          Swal('', data.responseMessage, 'success');
            
        },
        (error: any) => 
        {
          console.log('error while adding: ', error)
          this.actionLoaderSave = false;
          element.disabled = true;
          this.basicForm.valid;
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
      let url = 'Roles/Update';
      let user  = this._GeneralService.getUserDetails();
   let val = {
        admRole: this.basicForm.value,
        LoginUserId:user.userId
      }
      this._GeneralService.post(val, url).subscribe(
        (data: any) => 
        {

          console.log('Save Result: ', data);

          this.reload = 'Y';
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

  convert(event){

    let val = this._GeneralService.formatMoney(event.target.value);
    console.log('val pp',val);
    this.creditLimit = val;
  }

  convert1(event){

    let val = this._GeneralService.formatMoney(event.target.value);
    console.log('val pp',val);

    this.debitLimit = val;
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

}




