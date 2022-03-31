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
    selector: 'app-add-fine',
    templateUrl: './add-fine.component.html',
    styleUrls: ['./add-fine.component.scss']
})
export class AddFineComponent implements OnInit {



  rowsMobile = [];
  rowsMobileTem = [];
  current_page = 1;
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
  pageLmit = GenModel.pageLmit;
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
  

   console.log('add Fine row: ', this.record);

   this.AllFine();

  

       this.basicForm = new FormGroup({

      //  amount: new FormControl('', [ Validators.required ]),
        finetype: new FormControl(null, [ Validators.required]),
        description: new FormControl('', [ Validators.required ]),

      

    });


     this.AllFine();
    //this.load();
   
  }

  back() { 

  
    let redirect = this._localStorageService.get(this.redirectUrl); 
    this.router.navigate([redirect]);
  }



   AllFine(): void {
     
    let token = this._localStorageService.get(this.token);

    this._GeneralService.getT(token, 'auth/all-fine-configs?token=')
    .retryWhen((err) => {
    
      return err.scan((retryCount) =>  {

        retryCount  += 1;
        if (retryCount < this.retryService) {

            this.retryMessage = 'Retrying...Attempt'; // #'  + retryCount;

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


      console.log('AllFine con res:', data);
       this.FineList = data;
       this.rowsMobile =  data.data.slice(0, this.pageLmit);
       this.rowsMobileTem = data.data;
       this.changePage(this.current_page);
        

      },
      (error: any) => 
      {
        
        console.log('error fine con:', error);

      });
 
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

  add(value: any) {

    console.log('Add value ', value);
    console.log('Add this.fineDes ', this.fineDes);
    
    Swal({
      title: '',
      text: `This Action is'nt reversible. Are you sure you want to add ${this.fineDes.name} Fine for ${this.record.first_name}  ${this.record.first_name}?  `,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) 
      {

       let postVa =  {
          email: this.record.email,
          fine_config_id : value.finetype
        
        };
        this.loadPage = true;

        console.log('add fine post value', postVa);

        this._GeneralService.post(postVa, 'auth/create-fine')
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
    
           
            console.log('Add fine response data', data);
           
           Swal('', data.message, 'success');
           let redirect = this._localStorageService.get(this.redirectUrl); 
           this.router.navigate([redirect]);
    
          },
          (error: any) => {
            
            console.log('Add fine  error:', error);
             this.loadPage =  false;
             if ( error.error.message != undefined) {
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

   // From BElow is the Pagination on Mobile ///

   prevPage()
   {
     
       if (this.current_page > 1) {
           this.current_page--;
           this.changePage(this.current_page);
       }
   }

   nextPage()
   {
   
       if (this.current_page < this.numPages()) {
         this.current_page++;
           this.changePage(this.current_page);
       }
   }

   changePage(page)
   {
       let btn_next = document.getElementById("btn_next");
       let btn_prev = document.getElementById("btn_prev");
     // let listing_table = document.getElementById("listingTable");
       let page_span = document.getElementById("page");
   
       // Validate page
       if (page < 1) page = 1;

       if (page > this.numPages()) page = this.numPages();



       let tem = []; 

       for (let i = ( page - 1 ) * this.pageLmit; i < (page * this.pageLmit) && i < this.rowsMobileTem.length; i++) 
       {
           tem.push(this.rowsMobileTem[i]);
       }
       this.rowsMobile = tem;

       

       page_span.innerHTML = page + "/" + this.numPages();

     
   }

   numPages()
   {
       return Math.ceil(this.rowsMobileTem.length / this.pageLmit);
   }

   onload = function() {
     this.changePage(1);
   };
 //Pagination for Mobile Ends here



}


