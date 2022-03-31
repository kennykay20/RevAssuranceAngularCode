  
  import { GenModel } from './../../../model/gen.model';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { environment } from './../../../../environments/environment.prod';
  import { Observable } from 'rxjs';
  import { GeneralService } from './../../../services/genservice.service';
  import { Component, OnInit } from '@angular/core';
  import { Router } from '@angular/router';
  import { FormGroup, FormBuilder, Validators, FormControl, 
            FormGroupDirective, NgForm } from '@angular/forms';
  import { emailValidator } from '../../../theme/utils/app-validators';
  import { AppSettings } from '../../../app.settings';
  import { Settings } from '../../../app.settings.model';
  import {  WaitingDialog } from '../../../services/services';
  import {MatSnackBar} from '@angular/material';
  import { LocalStorageService } from 'angular-2-local-storage';
  import Swal from 'sweetalert2';
  
  
  @Component({
    selector: 'app-val-visitor-code',
        templateUrl: './val-visitor-code.component.html',
        styleUrls: ['./val-visitor-code.component.scss']
  })
  export class ValVisitorCodeComponent implements OnInit {
    public form: FormGroup;
    basicForm: FormGroup;
    public settings: Settings;
    durationsnack: number = 3000;
    displayloader: boolean = false;
    displayloaderA: boolean = false;
    displayloaderD: boolean = false;
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
  
    status: any;
  
  
    address: any;
    visitor_name : any;
    reason_for_visit2: any;
    host: any;
    btnConfirm = GenModel.btnConfirm;
  
    constructor(public appSettings:AppSettings, 
                public fb: FormBuilder, public router:Router,
                public snackBar: MatSnackBar,
                public _waitingDialog: WaitingDialog,
                private _localStorageService: LocalStorageService,
                public _GeneralService: GeneralService,
                private http: HttpClient){
      this.settings = this.appSettings.settings; 
      this.form = this.fb.group({
        userName: [null, Validators.compose([Validators.required])],
        institutionCode: [null, Validators.compose([Validators.required])],
        password:  [null, Validators.compose([Validators.required])]
      });
  
    }
  
    pageLoad() {
      setTimeout(() => {
        this.loadPage = false;
      }, 100);
  
    }
    
    ngOnInit() {
      this.pageLoad();
  
         this.basicForm = new FormGroup({
          unique_code: new FormControl('', [
            Validators.required
          ]),
          reason_for_declining: new FormControl(''),
          status: new FormControl(''),
          address: new FormControl(''),
          visitor_name: new FormControl(''),
          reason_for_visit: new FormControl(''),
          reason_for_visit2: new FormControl(''),
          host: new FormControl(''),
  
      });
     
    }
  
    keyPress(event: any) {
      const pattern = /[0-9\+\-\ ]/;
  
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  
  
  
  
    public validateCode(values: Object): any {
    // console.log('ValidateCode', values);
     
      this.displayloader = true;
      this.lblProcess = 'Wait, Action in progress...';
      let postParam = {
        
          "unique_code": this.basicForm.value.unique_code,
  
      };
   
      
     // console.log('posted value*:  ', postParam);
      if (this.basicForm.valid) {
  
        let url = 'auth/validate-unique-code';
  
        this._GeneralService.post(postParam, url).subscribe(
          (data: any) => {
            
             // console.log('data validateCode: ', data);
  
             //// console.log('data validateCode data.address: ', data.address);
  
              this.address = data.address;
              this.visitor_name = data.visitor_name;
              this.reason_for_visit2 = data.reason_for_visit;
              this.host = data.host;
              this.status = data.status;
  
  
              // address: new FormControl(''),
              // visitor_name: new FormControl(''),
              // reason_for_visit: new FormControl(''),
              // reason_for_visit2: new FormControl(''),
  
  
  
              this.basicForm.patchValue({
                    address: data.address,
                    visitor_name: data.visitor_name,
                    reason_for_visit2:  data.reason_for_visit,
                    host: data.host,
                    status: data.status
              });
  
  
            this.displayloader = false;
            this.lblProcess = '';
           
           
            // Swal('',  data.message, 'success');
            
          },
          (error: any) => {
            
            // console.log('data validateCode error: ', error);
          this.displayloader =  false;
          this.lblProcess = '';
            Swal('', error.error.message, 'error');
        });
  
  
  
      
      }
      else 
      {
        this.displayloader  = false;
        this.lblProcess = '';
        //this.openSnackBar('Kindly Fill your Credential!', 'Ok')
        Swal('Note:', 'Kindly Fill your Credential!', 'error');
      }
    }
  
    Accept(val: any) {
      // console.log('data Accept start: ');
  
      let url = 'auth/authorise-visitor';
  
      this.displayloaderA = true;

      let postParam = {
        
          "unique_code": this.basicForm.value.unique_code,
          "status" : val

      };
  
      // console.log('A postParam Approve: ', postParam);
  
      this._GeneralService.post(postParam, url).subscribe(
        (data: any) => {
          
           // console.log('data Approve val: ', data);
          this.displayloaderA = false;
          this.lblProcess = '';
          Swal('',  data.message, 'success');
        },
        (error: any) => {
          
          // console.log('Approve error: ', error);
        this.displayloaderA =  false;
        this.lblProcess = '';

        Swal('', error.error.message, 'error');
      });

    }
  
    Decline(val: any) {
      Swal({
        title: '',
        text: 'Enter Decline Reason',
        type: 'warning',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: this.btnConfirm, 
        cancelButtonText: 'Cancel'
      }).then((result) => {
       
        // console.log('Decline result: ', result);
        if (result.value) 
        {
          let url = 'auth/authorise-visitor';
  
          this.displayloaderD = true;
          this.lblProcess = 'Wait, Action in progress...';
      
          let postParam = {
            
              "unique_code": this.basicForm.value.unique_code,
              "status" : val,
              "reason_for_declining": result.value
          };
  
          // console.log('Decline postParam: ', postParam);
  
          this._GeneralService.post(postParam, url).subscribe(
            (data: any) => {
              
               // console.log('data add val: ', data);
              this.displayloaderD = false;
              this.lblProcess = '';
              Swal('',  data.message, 'success');
            },
            (error: any) => {
              
              // console.log('Decline error: ', error);
              Swal('', error.error.message, 'error');
            this.displayloaderD =  false;
            this.lblProcess = '';
          });
        } 
        else 
          if (result.dismiss === Swal.DismissReason.cancel) {
          
        }
      });
    }
  
    select(): void {
      // console.log('select this.basicForm:', this.basicForm.value);
     
        this.val();
     }
  
     val(){
       this.status = this.basicForm.value.status;
       // console.log('select this.this.status:', this.status);
     }
  
  
    post(postValue: any, url: any): Observable<any> 
    {      
        // // console.log('post start222');
  
        let token = this._localStorageService.get(this.token);
  
         let postingurl = `${this.baseUrl}/${url}?token=${token}`;
         // console.log('postingurl test: ', postingurl);
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
  
    timeOutRes(txt) {
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
  
    ngAfterViewInit()  {
      this.settings.loadingSpinner = false; 
    }
  
  }
  
  
  