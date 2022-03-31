import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalStorageService } from "angular-2-local-storage";
import { AppSettings } from "../../../app.settings";
import { GeneralService } from "../../../services/genservice.service";
import Swal from 'sweetalert2';

@Component({
    selector: 'app-verifyotp',
    templateUrl: './verifyotp.component.html',
    styleUrls: ['./verifyotp.component.css']
})

export class VerifyotpComponent implements OnInit{
    public formVeriftOtp: FormGroup;
    loginSucc = false;
    msg: string;
    showbtn = false;
    loader = false;
    displayloader: boolean = false;
    btnlogtxt: string = 'SUBMIT';
    btnResend: string = 'RESET';
    

    constructor(public appSettings: AppSettings, public dialog: MatDialog,
        public _GeneralService: GeneralService,
        private _localStorageService: LocalStorageService,
        private route: ActivatedRoute,
        public router: Router,
        public fb: FormBuilder,
        public dialogRef: MatDialogRef<VerifyotpComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) 
    {
    // this.settings = this.appSettings.settings; 

    // let queryString = this.route.snapshot.params.mid;
    // this.menuId = _GeneralService.menuId(queryString);
    //   console.log('**data param4', param4);

    this.formVeriftOtp = this.fb.group({

        'password': ['', Validators.required] 
       
      })
      
    }

    ngOnInit() 
    {
        // this.ItemsPerPage = this._GeneralService.ItemsPerPage;
        // this.ItemsPerPage = this._GeneralService.ItemsPerPage;
        // this.getUserDetails =  this._GeneralService.getUserDetails();
        // this.pageLmit  = GenModel.pageLmit;
        // console.log('getUserDetails token', this.getUserDetails);

        // this.load(this.getUserDetails);

        // this.swapTab(1);
        //alert('hello popup');

    }


    
    resetSign() {

        this.btnlogtxt = 'SUBMIT';
        
        this.loginSucc = false;
        this.displayloader = false;
    
      }

    public veriFyOtp(values: any): any {

        //console.log('onSubmit values: ', values);
        let trackRetryAPi = 0;
        let url = 'Authentication/VerifyOtp';
        let loginTp = "App"
    
        let val = {
          password: values.password,
          userName: this.data.userName
        };
        
       // console.log('url values: ', url);
    
    
        this.btnlogtxt = 'Authenticating...';
    
        //console.log('onSubmit values: ', values);
    
        this.displayloader = true;
    
        if (this.formVeriftOtp.valid) {
    
          //console.log('swapTabVal ', this.swabTabValues);
          this._GeneralService.login(val, url)
            .subscribe((data: any) => {
    
             //console.log('sucess verify data', data);
    
              if (data.response.errorCode != undefined) {
    
                if (data.response.errorCode == 0) {
                  //console.log('app login ', data);
                  this.resetSign();
                  this.loginSucc = true;
                  Swal('Success', 'Code Correct!', 'success');
                  this.closeDialog();
                  setTimeout(() => {
                    this.router.navigate(['./dashboard']);
                  }, 50);
                }
                else{
                    Swal('Error!', 'Code Not Correct or time has Expired', 'error');
                    this.resetSign();
                }
              }
    
            },
              (error: any) => {
    
                //console.log('error Login', error)
    
                
                this.resetSign();
                
                
                Swal('', error.error.errorMessage, 'error');
    
              });
        }
    
    }


    closeDialog(): void{
        this.dialogRef.close('Y');
    }


    testPin()
    {
      let val = {
        password: "12345678",
        staffId: "123456"
      };
      let url = "https://localhost:44373/weatherforecast/TestPinToken";

      this._GeneralService.testP(val, url)
            .subscribe((data: any) => {
            
              console.log('data', data);
            });
    }


}

