import { GeneralService } from './../../../services/genservice.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { GenModel } from './../../../model/gen.model';
import Swal from 'sweetalert2';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
// import { orders, products, customers, refunds } from '../dashboard.data';
import { orders, customers, products, refunds } from '../dashboard.data';
import { Router, ActivatedRoute } from '@angular/router';
import { Dashboard } from '../../../model/dashboard';
import { UserDetails } from '../../../model/userDetails';

@Component({
  selector: 'app-info-cards',
  templateUrl: './info-cards.component.html',
  styleUrls: ['./info-cards.component.scss']
})
export class InfoCardsComponent implements OnInit { 
  public orders: any[];
  public products: any[];
  public customers: any[];
  public refunds: any[];
  public colorScheme = {
    domain: ['#999']
  }; 
  public autoScale = true;
  @ViewChild('resizedDiv') resizedDiv: ElementRef;
  public previousWidthOfResizedDiv: number = 0; 
  public settings: Settings;
  errorOccur = GenModel.errorOccur;
  token = GenModel.tokenName;
  retryService: number =  GenModel.retryService;
  loadTxt: any;
  retryMessage: any;
  retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
  listDashBoard: any[] = [];
  loginRoleId = GenModel.loginRoleId;
  loadPage = false;
  dashboardLength = 0;
  RetryAttmMsg = GenModel.RetryAttmMsg;
  apiIsDown = GenModel.apiIsDown;
  dashboard: Dashboard[];

  constructor(public appSettings: AppSettings,
              private storage: LocalStorageService,
              public _GeneralService: GeneralService,
              public router: Router) {
    this.settings = this.appSettings.settings; 
  }

  ngOnInit()
  {
   // console.log('infor');   
    

    this.loadDashboard();
   
  }
  
  loadDashboard(): void {

    this.loadPage = true;
    let track = 0;
    let url = 'Dashboard/GetDashboard';
   
    let userDetails: UserDetails = this._GeneralService.getUserDetails();
    //console.log("userDetails ", userDetails);
    let val =
    {
      roleId: userDetails.roleId
    }

  //  console.log('data rowid Dashbord 333: ', val);

    
    this._GeneralService.post(val, url)
      .retryWhen((err) => {

        return err.scan((retryCount) => {

          retryCount += 1;
          track = retryCount;
          if (retryCount < this.retryService) {

            this.retryMessage = this.RetryAttmMsg;
            console.log('this.retryMessage ', this.retryMessage);
            console.log('retryCount ', retryCount);
            console.log('this.retryService', this.retryService);
            return retryCount;
          }
          else {
            this.retryMessage = this.errorOccur;
            throw (err);
          }
        }, 0).delay(this.retryDelayServiceInterval);
      }).subscribe(
        (data: any) => {
          //console.log('data rows assign 333: ', data);
          this.loadPage = false;

          //console.log('dashboard', data._response);
          this.dashboard = data._response;
          this.dashboardLength = this.dashboard.length;
          //console.log('dashboard length ', this.dashboard.length);
          //console.log('data rows this.dashboard323: ', this.dashboard);
         
          //this.temp = data._response;

        },
        (error: any) => {
          if (track === this.retryService) {
            Swal('', this.apiIsDown, 'error');
          }
          else {
            Swal('', this.errorOccur, 'error');

          }
        });
  }

  getDashboard(roleInfo: any): any {
  

     let values = 
     {
           "role_id":  roleInfo
     };
   
   let token = this.storage.get(this.token);
            
   let url = `auth/dashboard?token=` + token; 
   
   this._GeneralService.post(values, url)
       
      //  .retryWhen((err) => {
     
      //    return err.scan((retryCount) =>  {
   
      //      retryCount  += 1;
      //      if (retryCount < this.retryService) {
   
      //          this.loadTxt = 'Loading...'; // #'  + retryCount;
   
      //          return retryCount;
      //      }
      //      else 
      //      {
      //        //Swal('', this.errorOccur, 'error');
      //        this.loadTxt = this.errorOccur;
      //         throw(err);
      //      }
      //    }, 0).delay(this.retryDelayServiceInterval); 
      //  }).
       .subscribe(
         (data: any) => {
   
          this.loadPage = true;
         // // // 

           this.listDashBoard  = data;
         


         
           for (let i = 0;  i <= data.length; i++) {
          
            // if (data[i].value != undefined || data[i].value != null)
            // {
          
            // }
           
           
            // if (isNumeric(data[i].value)) 
            // {
          
            // }


             
          }
            this.loadTxt = '';
         
         },
         (error: any) => {
           
        
   
           if (error.error.message != undefined) {
            // Swal('', error.error.message, 'error');
            this.loadTxt = error.error.message;
          }
          else
           {
             // Swal('', this.errorOccur, 'error'); 
             this.loadTxt = this.errorOccur;
           }
        });
       
   }

   isNumber(n) 
   { 
     
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n); 
   } 
  
  public onSelect(event) {
    
  }

  public addRandomValue(param) {
    switch(param) {
      case 'orders':
        for (let i = 1; i < 30; i++) { 
          this.orders[0].series.push({"name": 1980+i, "value": Math.ceil(Math.random() * 1000000)});
        } 
        return this.orders;
      case 'customers':
        for (let i = 1; i < 15; i++) { 
          this.customers[0].series.push({"name": 2000+i, "value": Math.ceil(Math.random() * 1000000)});
        } 
        return this.customers;
      default:
        return this.orders;
    }
  }



  // ngOnDestroy(){
  //   this.orders[0].series.length = 0;
  //   this.customers[0].series.length = 0;
  // }

  // ngAfterViewChecked() {    

  //     if (this.previousWidthOfResizedDiv != this.resizedDiv.nativeElement.clientWidth)
  //     {
  //             setTimeout(() => this.orders = [...orders] ); 
  //             setTimeout(() => this.products = [...products] ); 
  //             setTimeout(() => this.customers = [...customers] ); 
  //             setTimeout(() => this.refunds = [...refunds] );
  //     }

  //       this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  // }
}