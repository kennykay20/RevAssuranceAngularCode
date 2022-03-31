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
    selector: 'app-get-complaint',
      templateUrl: './get-complaint.component.html',
      styleUrls: ['./get-complaint.component.scss']
  })
  export class GetComplaintComponent implements OnInit {
    public form: FormGroup;
    basicForm: FormGroup;
    public settings: Settings;
    durationsnack: number = 3000;
    displayloader: boolean = false;
    displayloaderC: boolean = false;
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
    recordDetails = GenModel.recordDetails;
    record: any;
    ticket_id: any;
    btnConfirm = GenModel.btnConfirm;
    errorOccur = GenModel.errorOccur;
    constructor(public appSettings: AppSettings, 
                public fb: FormBuilder, 
                public router: Router,
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
      }, 1000);
  
    }
    
    ngOnInit() {

      this.pageLoad();

      this.record = this._localStorageService.get(this.recordDetails); 
      //console.log('record: ', this.record);
      
      this._localStorageService.set(this.recordDetails, null);

     

//       id: 1
// user_id: "101"
// admin_id: null
// resident_name: "Ben Mike"
// admin_name: null
// title: "eee"
// description: "des"
// images: null
// status: "Pending"
// remarks: null
// vendor: null
// ticket_id: "LGD-158264"
// created_at: "2020-03-05 08:10:43"
// updated_at: "2020-03-05 08:10:43"
  
         this.basicForm = new FormGroup({
          ticket_id: new FormControl(''),
          title: new FormControl(''),
          description: new FormControl(''),
          resident_name: new FormControl(''),
          status: new FormControl(''),
          admin_name: new FormControl('')
      });
     


   

      this.basicForm.patchValue({
        ticket_id: this.record.ticket_id,
        title: this.record.title,
        description: this.record.description,
        resident_name: this.record.resident_name,
        status: this.record.status,
        admin_name: this.record.admin_name,
  });
     
    }
  
    keyPress(event: any) {
      const pattern = /[0-9\+\-\ ]/;
  
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  
  
 


    treat(values: any): void {

      // console.log('data treat start: ', values);
      this.displayloaderC = true;

        let postValues = 
        {
          ticket_id: this.basicForm.value.ticket_id, 
        };

        // console.log('closeComplaint values', postValues);
        
        this.loadPage =  true;

        //let url = 'auth/treat-complaint';
       // // console.log('data treat postParam: ', postValues);

        let token = this._localStorageService.get(this.token);


        let url = `auth/treat-complaint?token=` + token; 

        this._GeneralService.post(postValues, url).subscribe(
          (data: any) => {
            
             // console.log('data closeComplaint response: ', data);
            this.displayloaderC = false;
            this.loadPage =  false;

          //  let msg  =  data.Message + ' With Ticket Id: ' + data.ticket_id;
            Swal('', data.Message, 'success');

          },
          (error: any) => {
            
           //// console.log('data closeComplaint response: ', error);
            //// console.log('data closeComplaint error: ', error.error);
            // console.log('data closeComplaint error Message: ', error.error.Message);
          this.loadPage =  false;
          this.displayloaderC =  false;
          if (error.error.Message != undefined){
            Swal('', error.error.Message, 'error');
          }
          else  {
            this.displayloaderC = false;
            this.loadPage =  false;
            Swal('', this.errorOccur, 'error');
          }
            
        });
  
  
  
    
    
    }
  
    closeComplaint(postVal: any): void {
      Swal({
        title: '',
        text: 'Enter Reason to Close this Complaint',
        type: 'warning',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: this.btnConfirm, 
        cancelButtonText: 'Cancel'
      }).then((result) => {
       
        // console.log('closeComplaint result: ', result);

        if (result.value == null || result.value == '') {
          Swal('', 'Enter Reason for Closing this Complaint', 'error');
        }


       
        if (result.value) 
        {
          
              
              let postValues = 
              {
                ticket_id: this.basicForm.value.ticket_id, 
                remarks: result.value 
              };
  
              // console.log('closeComplaint values', postValues);
              
              this.loadPage =  true;

              let url = 'auth/close-complaint';
              this._GeneralService.post(postValues, url).subscribe(
                (data: any) => {
          
                  this.loadPage =  false;
            
                  // console.log('closeComplaint result data', data);
                  Swal('', data.Message, 'success');
                  
          
                },
                (error: any) => {
                  
                  // console.log('error:', error);
  
                 
            
                this.loadPage =  false;

                    if (error.error.message != undefined){
                      Swal('', error.error.message, 'error');
                    }
                    else  {
                      Swal('', this.errorOccur, 'error');
                    }
            
                });
  
            
         
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          
        }
      });
    }
  
    return(){
      this.router.navigate(['./com/allcomplaints']);
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
  
  
