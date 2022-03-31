import { Settings } from './../../../app.settings.model';
import { GeneralService } from './../../../services/genservice.service';
import { GenModel } from './../../../model/gen.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
 import { AppSettings } from '../../../app.settings';
import swal from 'sweetalert2';
import { emailValidator , matchingPasswords} from '../../../theme/utils/app-validators';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-my-profile',
   templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  public form:FormGroup;
  public settings: Settings;

  btn = 'SIGN UP';
  loadPage = true;
  property_types = ['Metro']
  errorOccur = GenModel.errorOccur;
  displayloader = false;
  retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
  swap = false;

  token = GenModel.tokenName;
  retryService: number =  GenModel.retryService;
retryMessage: any;
  constructor(public appSettings: AppSettings, 
              public fb: FormBuilder, public router:Router, 
              private _localStorageService: LocalStorageService,    
              public _GeneralService: GeneralService){
    this.settings = this.appSettings.settings; 

    this.form = this.fb.group({
        email: [null, Validators.compose([Validators.required, emailValidator])], 
        first_name: [null, Validators.required], 
        last_name: [null, Validators.required],
        phone_number:  [null, Validators.required], 
        meter_number: [null, Validators.required],
        house_address: [null, Validators.required],
    });
  }

  // public onSubmit(values:Object):void {
  //   if (this.form.valid) {
  //     this.router.navigate(['/login']);
  //   }
  // }

  public back(values: Object): void {
    if (this.form.valid) {
      this.router.navigate(['/login']);
    }
  }

  pageLoad() {
    setTimeout(() => {
      this.loadPage = false;
    }, 100);

  }
  ngOnInit() {
   // this.pageLoad();
    //this.load();
  }


  load(): void {
   
    let token = this._localStorageService.get(this.token);
   
    this._GeneralService.getT(token, 'auth/details?token=')
    
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

        console.log('all detailsPoll:', data);

       

this.form.patchValue({

      email:  data.email, 
      first_name:  data.first_name, 
      last_name:  data.last_name, 
      phone_number:  data.phone_number,
      meter_number:  data.meter_number, 
      house_address:  data.house_address
   

});

      },
      (error: any) => { 
       
        console.log('all detailsPoll error:', error);

        swal('Error', this.errorOccur, 'error');

    });
 
   }



  onSubmit(values: any): any {

  //  console.log('onSubmit: ', values);

    let value = {
      first_name: values.first_name,
      last_name: values.last_name,
      phone_number: values.phone_number,
      'meter number': values.meter_number,  
      house_address: values.house_address
    };

    this.displayloader = true;
    console.log('onSubmit11: ', value);

      this._GeneralService.post(value, `auth/edit-user-details`)
      
      .retryWhen((err) => {
    
        return err.scan((retryCount) =>  {

          retryCount  += 1;
          if (retryCount < this.retryService) {

              

              return retryCount;
          }
          else 
          {
            swal('', this.errorOccur, 'error');
             throw(err);
          }
        }, 0).delay(this.retryDelayServiceInterval); 
      }).
      subscribe(
        (data: any) => {
          this.displayloader = false;
          
             console.log('update done: ', data);
            
             swal('', data.message, 'success'); 
        },
        (error: any) => {

          this.displayloader = false;
          console.log('update done error: ', error);

          if (error.error.message != undefined) 
          {
            swal('', error.error.message, 'error');
          }
          else
          {
            swal('', this.errorOccur, 'error'); 
          }
        }); 
  }



  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }
}