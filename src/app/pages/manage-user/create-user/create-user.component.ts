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
  selector: 'app-create-user',
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
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
        first_name: new FormControl('', [ Validators.required]),
    });
   
  }
  check(){
    
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  public add(values: Object): void {
    this.displayloader = true;
    this.lblProcess = 'Wait, Action in progress...';
 
    
  
    if (this.basicForm.valid) {

      let url = 'auth/create-user';

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
          Swal('', error.error.message, 'error');
      });



      // this._agentManagementService.post(this.basicForm.value).subscribe(result =>{
     
      //     if(result.ResponseCode != '00'){
      //       this.timeOutRes(result.ResponseMessage);
      //     //this.openSnackBar(result.ResponseMessage, 'Ok')
      //       Swal('Failed:', result.ResponseMessage, 'error');
      //     //Swal('Note:', result.ResponseMessage, 'warning');
      //     }
      //     else 
      //     {
      //       this.timeOutRes(result.ResponseMessage);
      //       Swal('Success:', result.ResponseMessage, 'success');
      //     }
      // });
    }
    else 
    {
      this.displayloader  = false;
      this.lblProcess = '';
      //this.openSnackBar('Kindly Fill your Credential!', 'Ok')
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

  // loadState(){

  //   let url='/States/GetAll';
  //    this._agentManagementService.get(url)
  //         .subscribe(data => {

  //           this.stateList = data.Result;  
  //         }, 
  //         error => {


           
  //         });
  // }

  

  loadCountry(){

    let url = '/api/Countries';
    //  this._agentManagementService.get(url)
    //       .subscribe(data => {
    //        
    //         this.NationalityList = data;
           
    //       }, 
    //       error => {

    //        
           
    //       });
  }


  localGovernments(id: any){
   
    let url='/api/LocalGovernments';
    let data = {
      url : url,
      id: id
    }
    //  this._agentManagementService.getById(data)
    //       .subscribe(data => {
    //        
    //         this.localGovernmentsList = data;
    //       }, 
    //       error => {
           
    //       });
  }

}


// /** Error when invalid control is dirty, touched, or submitted. */
// export class MyErrorStateMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     const isSubmitted = form && form.submitted;
//     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//   }
// }