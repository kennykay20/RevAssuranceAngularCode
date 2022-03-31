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
  import { DatePipe } from '@angular/common';
  
  @Component({
    selector: 'app-create-poll',
    templateUrl: './create-poll.component.html',
    styleUrls: ['./create-poll.component.scss']
  })
  export class CreatePollComponent implements OnInit {
    public form:FormGroup;
    basicForm: FormGroup;
    public settings: Settings;
    durationsnack: number = 3000;
    displayloader: boolean = false;
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
    errorOccur = GenModel.errorOccur;
    constructor(public appSettings:AppSettings, 
                public fb: FormBuilder, public router:Router,
                public snackBar: MatSnackBar,
                public _waitingDialog: WaitingDialog,
                private _localStorageService: LocalStorageService,
                public _GeneralService: GeneralService,
                private http: HttpClient,
                public datepipe: DatePipe){
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
         
          question: new FormControl('', [
            Validators.required
          ]),
          expiry_date: new FormControl('', [
            Validators.required
          ]),
        
          optionA: new FormControl('', [
            Validators.required
          ]),
          optionB: new FormControl('', [
            Validators.required
          ]),
          optionC: new FormControl(''),
          optionD: new FormControl(''),
          optionE: new FormControl(''),
  
      });
     
    }
  
    keyPress(event: any) {
      const pattern = /[0-9\+\-\ ]/;
  
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  


  
    public add(values: any): void {
      this.displayloader = true;  
 
      if (this.basicForm.valid) {

        let todayDate = new Date();
        let today  = this.datepipe.transform(todayDate, 'yyyy-MM-dd');
     
  

       values.expiry_date = this.datepipe.transform(values.expiry_date, 'yyyy-MM-dd');
        let token = this._localStorageService.get(this.token);

        if (values.expiry_date <= today) {
          this.displayloader = false;  
          Swal('', 'Select a Future Date', 'error');
        }

       
        let url = `auth/create-poll?token=` + token; 
  
        this._GeneralService.post(values, url).subscribe(
          (data: any) => {
            
          
            this.displayloader = false;
            this.lblProcess = '';
            this.basicForm.reset();
           
          
           Swal('', data.message, 'success');
              
             
  
          },
          (error: any) => {
            
           
          this.displayloader =  false;
          this.lblProcess = '';

          if (error.error.message != undefined) {
             Swal('', error.error.message, 'error');
          }
           else
           {
             Swal('', this.errorOccur, 'error'); 
           }
        });
  
  
  
    
      }
      else 
      {
        this.displayloader  = false;
        this.lblProcess = '';
      
        Swal('Note:', 'Kindly Fill your Credential!', 'error');
      }
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
  
  
