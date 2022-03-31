import { GenModel } from './../../../model/gen.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { GeneralService } from './../../../services/genservice.service';
import { Component, OnInit, Input  } from '@angular/core';
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
  selector: 'app-apply-waiver',
  templateUrl: './apply-waiver.component.html',
  styleUrls: ['./apply-waiver.component.scss']
})
export class ApplyWaiverComponent implements OnInit {

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
  email: any;
  rows: any;
  addedworkflowList: any[] = [];
  record: any;
  recordDetails = GenModel.recordDetails;
  userDetails: any;
  FineList: any[] = [];
  redirectUrl = GenModel.redirectUrl;
  retryService = GenModel.retryService;
  retryMessage: any;
  errorOccur = GenModel.errorOccur;
  retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
  btnConfirm = GenModel.btnConfirm;
  fineDesSubmit: any;
  fineDes: any;
  constructor(public appSettings: AppSettings, 
              public fb: FormBuilder, public router:Router,
              public snackBar: MatSnackBar,
              public _waitingDialog: WaitingDialog,
              private _localStorageService: LocalStorageService,
              public _GeneralService: GeneralService,
              private http: HttpClient){
    this.settings = this.appSettings.settings; 
   
   
  
  }


 

  pageLoad() {
    setTimeout(() => {
      this.loadPage = false;
    }, 100);

  }
  
  ngOnInit() {
    this.pageLoad();


   this.record = this._localStorageService.get(this.recordDetails);
 //  this._localStorageService.set(this.recordDetails, null);
   console.log('apply-waiver row: ', this.record);

       this.basicForm = new FormGroup({

        fine_id: new FormControl(null, [ Validators.required]),
      amount: new FormControl(null, [ Validators.required ]),

    });

    this.basicForm.patchValue({
      fine_id: this.record.fine_id,
      amount: null
    });
   
  }

  back() {  
    let redirect = this._localStorageService.get(this.redirectUrl); 
    this.router.navigate([redirect]);
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  getDes(row){
    console.log('getDes:', this.fineDes);
    this.fineDesSubmit = this.fineDes.description;
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ;
}


  add(value: any) {

    console.log('Add value ', value);
    console.log('Add this.fineDes ', this.fineDes);

    let amt = this.numberWithCommas(value.amount) + '.00';
    
    Swal({
      title: '',
      text: `This Action is'nt reversible. Are you sure you want to Waive Fine for ${this.record.name} with sum of ${amt} ?  `,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) 
      {

       let postVa =  {
        fine_id: value.fine_id,
        amount : value.amount
        
        };
        this.loadPage = true;

        console.log('apply-waiver  post value', postVa);

        this._GeneralService.post(postVa, 'auth/apply-waiver')
        .retryWhen((err) => {
    
          return err.scan((retryCount) =>  {
    
            retryCount  += 1;
            if (retryCount < this.retryService) {
    
                this.retryMessage = 'Retrying...Attempt';
    
                return retryCount;
            }
            else 
            {
              this.retryMessage = this.errorOccur;
               throw(err);
            }
          }, 0).delay(this.retryDelayServiceInterval); 
        }).subscribe(
          (data: any) => {
    
           
            console.log('apply-waiver response data', data);
           
           Swal('', data.message, 'success');
           let redirect = this._localStorageService.get(this.redirectUrl); 
           this.router.navigate([redirect]);
    
          },
          (error: any) => {
            
            console.log('apply-waiver  error:', error);
             this.loadPage =  false;
             if ( error.error.message != undefined) 
             {
                  Swal('', error.error.message, 'error');
                }
                else
                {
                  Swal('', this.errorOccur, 'error');
                }
          });
       
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }


}


