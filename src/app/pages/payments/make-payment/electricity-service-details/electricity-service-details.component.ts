
import Swal from 'sweetalert2';
import { GeneralService } from './../../../../services/genservice.service';
import { GenModel } from './../../../../model/gen.model';
import { List } from 'linqts';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';


import { Router } from '@angular/router';
@Component({
  selector: 'app-electricity-service-details',
  templateUrl: './electricity-service-details.component.html',
  styleUrls: ['./electricity-service-details.component.scss']
})
export class ElectricityServiceDetailsComponent implements OnInit {

  dialogRef: any;
  rows: any[] = [];
  token = GenModel.tokenName;
  fineAddedd = GenModel.fineAddedd;
  btnConfirm = GenModel.btnConfirm;
  sumOutStanding: string;
  Service: string;
  Electricity: string;
  Fine: string;
  paymentsServices: any;
  fineNumber : number;
  OutstandingFineDebtHistory = [];
  loadPage = true;

  displayloader: boolean = false;
  btnAction: string = 'Add to Cart';
  lblBefore = 'Add to Cart';

  retryService: number =  GenModel.retryService;
  retryMessage: any;
  retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
  internetConMsg = GenModel.internetConMsg;
  errorOccur = GenModel.errorOccur;


  constructor( public router: Router,
              public _GeneralService: GeneralService,
              private _localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.load();
  }

  addToCart() {
    Swal({
      title: '',
      text: 'Are you sure you want to add to Cart?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) 
      {

        let value = {
          type: 'OutstandingElectricity'
        }

      //  this.btnAction = 'Wait, Action in Progress...';
        this.loadPage = true;

        this._GeneralService.post(value, 'auth/add-to-cart').subscribe(
          (data: any) => {
    
           
         
           // this.btnAction =  this.lblBefore;
           
             this.loadPage =  false;
           //  this._localStorageService.set(this.fineAddedd, 'Y');
             Swal('', data.message, 'success');
             this.router.navigate(['./pay/pay']);
    
          },
          (error: any) => {
         
       
             this.loadPage =  false;
          });
       
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }


  back(){
    this.router.navigate(['./pay/pay']);
  }



  load(): void {
   
    let token = this._localStorageService.get(this.token);
    this._GeneralService.getT(token, 'auth/my-payments?token=')
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

        this.loadPage = false;
     

        
        
      //   let third: any[] = this.paymentsServices.paymentType.OutstandingElectricityDebtHistory;
      //   this.OutstandingFineDebtHistory = third;
        
      //   // const sum3 = new List<any>(third).Sum(x => x.amount);
     
      
    
      for (let i = 0; i <= data.paymentType.OutstandingElectricityDebtHistory.length; i++) {

    
     
      }


        this.rows = data.paymentType.OutstandingElectricityDebtHistory;

      //  //  this.sumOutStanding = this.numberWithCommas(sum3); // + '.00';

        

      },
      (error: any) =>
      {

      } 

    );
 
   }

   numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


  openViewFineDetails() {
 
    this.router.navigate(['./pay/fineDetails']);
  }

  checkOut() {
    this.router.navigate(['./pay/checkOut']);
  }


  // openViewFineDetails() {
  //   return this.dialogRef = this.dialog.open(FineDetailsComponent, {
  //      width: '700px',
  //      height: 'auto',
  //      hasBackdrop: true,
  //      disableClose: true,
  //      autoFocus: true,
  //      position: {
  //          'top': '100px',
  //      },
  //      data:   'hamidSaveData'  
  //    });
 
  //  }

  //  checkOut() {
  //   return this.dialogRef = this.dialog.open(CheckOutComponent, {
  //      width: '700px',
  //      height: 'auto',
  //      hasBackdrop: true,
  //      disableClose: true,
  //      autoFocus: true,
  //      position: {
  //          'top': '100px',
  //      },
  //      data:   'hamidSaveData'  
  //    });
 
  //  }


}
