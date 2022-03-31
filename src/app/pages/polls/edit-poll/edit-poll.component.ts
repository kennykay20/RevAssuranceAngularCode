
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
  selector: 'app-edit-poll',
    templateUrl: './edit-poll.component.html',
    styleUrls: ['./edit-poll.component.scss']
})
export class EditPollComponent implements OnInit {
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
  recordDetails = GenModel.recordDetails;
  redirectUrl = GenModel.redirectUrl;
  record: any;
  listOfOption: any[] = [];
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



    this.record = this._localStorageService.get(this.recordDetails); 
   
     
     this._localStorageService.set(this.recordDetails, null);

    


    this.pageLoad();

       this.basicForm = new FormGroup({
        poll_id: new FormControl('', [
          Validators.required
        ]),
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

    this.basicForm.patchValue({

          poll_id: this.record.id,
          question: this.record.question,
          expiry_date: this.record.expiring_date,
          optionA: this.record.option_A,
          optionB: this.record.option_B,
          optionC: this.record.option_C,
          optionD: this.record.option_D,
          optionE: this.record.option_E
     
        });

        this.listOfOption.push({
          vote: this.record.option_A
        });

        this.listOfOption.push({
          vote: this.record.option_B
        });
        this.listOfOption.push({
          vote: this.record.option_C
        });
        this.listOfOption.push({
          vote: this.record.option_D
        });
        this.listOfOption.push({
          vote: this.record.option_E
        });
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  return(){
    this._localStorageService.set(this.recordDetails, null); 
    let url = this._localStorageService.get(this.redirectUrl); 
    this.router.navigate([url]);
  }

  public edit(values: any): void {
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



      let url = 'auth/edit-poll';

      this._GeneralService.post(values, url).subscribe(
        (data: any) => {
          
          
          this.displayloader = false;       
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


