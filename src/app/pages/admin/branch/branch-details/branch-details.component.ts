
 
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
    selector: 'app-branch-details',
  templateUrl: './branch-details.component.html',
  styleUrls: ['./branch-details.component.scss']
  })
  export class BranchDetailsComponent implements OnInit {
  
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
  
    actionLoaderSave = false;
    actionLoaderUpdate = false;
  
    userFullName: any
  
    ActionDisplay: any;
  
    reloadLoad: any;
    createdBy: any;
  
    statuses: any;
    tableName = "admBankBranch";
  
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
                public dialogRef: MatDialogRef<BranchDetailsComponent>,
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
            branchAddress: [null, Validators.compose([Validators.required])],
            branchCode: [null, Validators.compose([Validators.required])],
            branchName: [null, Validators.compose([Validators.required])],
            branchNo: [null, Validators.compose([Validators.required])],
            branchPreffix: [null, Validators.compose([Validators.required])],
            branchSuffix: [null, Validators.compose([Validators.required])],
            isHeadOffice: [null],
            telePhone: [null, Validators.compose([Validators.required])],
            altTelephone: [null],
            userId : 0,
          
          });		 
        }
        else
        {
          this.ActionHeaderMsg = '';
          this.ActionDisplay = this.ActionViewHeaderMsg;
  




          this.basicForm = this.fb.group({
            branchAddress: [null],
            branchCode: [null],
            branchName: new FormControl(null),
            branchNo: new FormControl(null),
            branchPreffix: new FormControl(null),
            branchSuffix: new FormControl(null),
            dateCreated: new FormControl(null),
            altTelephone: new FormControl(null),
            isHeadOffice: new FormControl(false),
            itbid: new FormControl(null),
            status: new FormControl(null),
            telePhone: new FormControl(null),
            userId: new FormControl(null),
            createdBy: new FormControl(null)
          
          });		 
      
          console.log('data11:', data);
      
         this.basicForm.patchValue({
            

            branchAddress: data.record.branchAddress,
            branchCode: data.record.branchCode,
            branchName: data.record.branchName,
            branchNo: data.record.branchNo,
            branchPreffix: data.record.branchPreffix,
            branchSuffix: data.record.branchSuffix,
            dateCreated: this._GeneralService.dateCreated(data.record.dateCreated),
            altTelephone: data.record.altTelephone,
            isHeadOffice:  data.record.isHeadOffice == "0" ? false :  true,
            itbid: data.record.itbid,
            status: data.record.status,
            telePhone: data.record.telePhone,
            userId: data.record.userId,
            createdBy: data.record.createdBy
          
          });	
  
          this.createdBy = data.createdBy
        }
   }
  
    ngOnInit() 
    {
        this.loadPage = false;
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
  
        console.log('this.basicForm.value: ',  this.basicForm.value);
  
        let url = 'Branch/Add';
  
  
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
        let url = 'Branch/Update';
  
        this._GeneralService.post(values, url).subscribe(
          (data: any) => 
          {
  
            console.log('Save Result: ', data);
  
  
            element.disabled = false;
            this.actionLoaderUpdate =  false;
            this.reloadLoad= 'Y'; 
            
            if(data.responseCode == 2)
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
  
  
  
  
  