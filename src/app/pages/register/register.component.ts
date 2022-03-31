import { GenModel } from './../../model/gen.model';
import { GeneralService } from './../../services/genservice.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { emailValidator, matchingPasswords } from '../../theme/utils/app-validators';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  public form:FormGroup;
  public settings: Settings;

  btn = 'SIGN UP';

  property_types = ['Metro'];
  errorOccur = GenModel.errorOccur;
  displayloader = false;

  swap = false;


  constructor(public appSettings:AppSettings, 
              public fb: FormBuilder, public router:Router,     
              public _GeneralService: GeneralService){
    this.settings = this.appSettings.settings; 

    this.form = this.fb.group(
      {
      //'name': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      'email': [null, Validators.compose([Validators.required, emailValidator])], //
      'password': ['', Validators.required], //
      'confirmPassword': ['', Validators.required], //
      'first_name': [null, Validators.required], //
      'last_name': [null, Validators.required],
      'phone_number':  [null, Validators.compose([Validators.required, Validators.minLength(11)])], //
      'meter_number': [null, Validators.required], //
      'house_address': [null, Validators.required],
      'property_type': [null, Validators.required],
      'agree': [false, Validators.required]
    },
    
    
    {validator: matchingPasswords('password', 'confirmPassword')});
  }

  public back(values: Object): void {
    if (this.form.valid) {
      this.router.navigate(['/login']);
    }
  }

  goBackToSignup(){

    if (this.swap === false){
      this.swap = true;
    }
    else{
      this.swap = false;
    }
  }

  public onSubmit(values: any): any {
    

    if (values.agree === false) {
      return Swal('', 'Kindly agree to the Term and Condition', 'error');
    }
    
    
    let url = 'register';
     // console.log('register values: ', values);
     this.btn = 'Registration in progress...'
     this.displayloader = true;
     if (this.form.valid) {
 
       this._GeneralService.homePage(values, url).subscribe(
         (data: any) => {
           
               // console.log('data onSubmit res: ', data);
               // this._GeneralService.SaveTokenResult(data);
               this.btn = 'SIGN UP';
               
              // this.btn = 'SIGN IN';
              this.displayloader =  false;
             this.form.reset();
             Swal('', data.message, 'success');
 
         },
         (error: any) => {
           
           // console.log('error', error);
         //this.resetCre();
         this.btn = 'SIGN IN';
        // this.loginSucc = false;
         this.displayloader =  false;
         if (error.error.message != undefined){
          Swal('', error.error.message, 'error');
         }
         else
         {
          Swal('', this.errorOccur, 'error');
         }
           
       });
 
 
       }
 
 
 
 
 
 
 
 
 
 
 
 
     //   this._GeneralService.postLogin(values, url).subscribe(result =>{
     //     // // console.log('result login: ', result);
     //     this.storage.set('menu', result);
     //     // let menures:any = this.storage.get('menu');
     //     // // console.log('menures: ', menures.Result);
     //     if(result.ResponseCode != '00'){
     //       this.displayloader = false;
     //       this.btnlogtxt = 'SIGN IN';
     //       // this.openSnackBar(result.ResponseMessage, 'Ok')
     //       Swal('Error:', result.ResponseMessage, 'error');
     //     }
     //     else 
     //     {
     //       this.storage.set('institutionCode', values.institutionCode);
          
     //       this.btnlogtxt = 'Loggin In...';
           
     //       setTimeout(() => 
     //       {
     //         this.loadState();
     //         this.loadCountry();
     //         this.storage.set('religionListLog',this.religionlist);
     //         this.router.navigate(['./dashboard']);
     //       }, 3000)
          
     //     }
     //   },
     //   error => {
     //             // // console.log('** Bad request', error.error_description)
     //              this.displayloader = false;
     //              Swal('Error:', 'Error Occured, Conatact System Admin', 'error');
     //             // this.openSnackBar('Error Occured, Conatact System Admin', 'Ok')
     //              this.btnlogtxt = 'SIGN IN';
             
     //             }); 
     // }
     // else 
     // {
     //   this.displayloader  = false;
     //   this.openSnackBar('Kindly Fill your Credential!', 'Ok')
     //   this.btnlogtxt = 'SIGN IN';
     // }
   }


  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }
}