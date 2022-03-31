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
    selector: 'app-vote-for-poll',
    templateUrl: './vote-for-poll.component.html',
    styleUrls: ['./vote-for-poll.component.scss']
})
export class VoteForPollComponent implements OnInit {
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
  record: any;
  listOfOption: any[] = [];
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



    this.record = this._localStorageService.get(this.recordDetails); 
   
     
     this._localStorageService.set(this.recordDetails, null);

    


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
        optionC: new FormControl('', [
          Validators.required
        ]),
        optionD: new FormControl('', [
          Validators.required
        ]),
        optionE: new FormControl('', [
          Validators.required
        ]),

    });

    this.basicForm.patchValue({
      question: this.record.question,
      expiry_date: this.record.expiring_date,
      optionA: this.record.option_A,
      optionB: this.record.option_B,
      optionC: this.record.option_C,
      optionD: this.record.option_D,
      optionE: this.record.option_E
     
        });

        this.listOfOption.push({
          vote: this.record.option_A,
          value: "A"
        });

        this.listOfOption.push({
          vote: this.record.option_B,
          value: "B"
        });

        this.listOfOption.push({
          vote: this.record.option_C,
          value: "C"
        });
        this.listOfOption.push({
          vote: this.record.option_D,
          value: "D"
        });

        this.listOfOption.push({
          vote: this.record.option_E,
          value: "E"
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
    this.router.navigate(['./pol/viewVotePoll']);
  }

  public add(values: any): void {
    this.displayloader = true;

 

   
    if (this.basicForm.valid) {

      let url = 'auth/cast-vote';

      let  postValues = {
         poll_id: this.record.id,
         vote: this.basicForm.value.optionA
      };

    

      this._GeneralService.post(postValues, url).subscribe(
        (data: any) => {
          
         
          this.displayloader = false;
          this.lblProcess = '';
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


