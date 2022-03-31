import { GeneralService } from './../../../services/genservice.service';
import { GenModel } from './../../../model/gen.model';
import Swal from 'sweetalert2';

import { List } from 'linqts';

import { Component, OnInit, NgZone } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

declare var PaystackPop;

import { Router } from '@angular/router';
import swal from 'sweetalert2';
@Component({
    selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {
  
  dialogRef: any;
  rows: any; // = [];
  token = GenModel.tokenName;
  fineAddedd = GenModel.fineAddedd;
  btnConfirm = GenModel.btnConfirm;
  payStackKey = GenModel.payStackKey;
  subaccount = GenModel.subaccount;
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

  myCartList: any[] = [];
  myCheckOutList: any;

  retryService: number =  GenModel.retryService;
  retryMessage: any;
  retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
  internetConMsg = GenModel.internetConMsg;
  errorOccur = GenModel.errorOccur;


  private ngZone: NgZone;


  makePaymentTxt = 'Make Payment';
  
  vggStatus: any;

  totalAmount ; any;

  checkExistInCart = ['Electricity', 'OutstandingElectricity', 'TopUp'];

  constructor( public router: Router,
              public _GeneralService: GeneralService,
              private _localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.myCart();
    this.checkOutDetails();
  }

  addToCart() {
    Swal({
      title: '',
      text: 'Are you sure you want to add to Cart?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#840808', 
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) 
      {

        let value = {
          type: 'Fine'
        }

        this.btnAction = 'Wait, Action in Progress...';
        this.displayloader = true;

        this._GeneralService.post(value, 'auth/add-to-cart').subscribe(
          (data: any) => {
    
           
          
            this.btnAction =  this.lblBefore;
           
             this.displayloader =  false;
             this._localStorageService.set(this.fineAddedd, 'Y');
             Swal('', data.message, 'success');
             this.router.navigate(['./pay/pay']);
    
          },
          (error: any) => {
            
           
          this.btnAction = this.lblBefore;
       
          this.displayloader =  false;
          });
       
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }


  back(){
    this.router.navigate(['./pay/pay']);
  }


  myCart(): void {
  
    let token = this._localStorageService.get(this.token);
 
    this._GeneralService.getT(token, 'auth/my-cart?token=').subscribe(
      (data: any) => {
        
        this.loadPage = false;
        this.myCartList = data;
      
      },
      (error: any) => { 
        
        

    });
 
   }

   checkOutDetails(): void {
   
    let token = this._localStorageService.get(this.token);
   
    this._GeneralService.getT(token, 'auth/checkout-details?token=').subscribe(
      (data: any) => {

        
      
        this.loadPage = false;
        this.myCheckOutList = data;

        // this.totalAmount =  this.numberWithCommas(data.amount_in_kobo);

      },
      (error: any) => 
      {
    
      }
    );
 
   }


   removeFromCart(postvalue: any) {

    
    Swal({
      title: '',
      text: 'Are you sure you want to delete from Cart?',
      type: 'warning',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) 
      {

        let value =  {
          type: 'Fine'
        };

        this.loadPage =  true;
        this.btnAction = 'Wait, Action in Progress...';
        this.displayloader = true;

        let url = `auth/remove-from-cart/${postvalue.type}/${postvalue.quantity}`; // 'auth/remove-from-cart/{type}/{quantity}';

     
        
        this._GeneralService.post(value, url).subscribe(
          (data: any) => {
    
            this.loadPage =  false;
          
            this.btnAction =  this.lblBefore;
           
             this.displayloader =  false;
             this._localStorageService.set(this.fineAddedd, 'Y');
             Swal('', data.message, 'success');
             this.router.navigate(['./pay/pay']);
    
          },
          (error: any) => {
            
          
            this.btnAction = this.lblBefore;
       
             this.displayloader =  false;
             this.loadPage =  false;

             Swal('', error.error.message, 'error');

          });
       
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
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


  chkVGGStatus() {

    if (this.myCartList.length == 0){

      Swal('', `You can't pay for an Empty Cart`, 'error');
      return;
    }

   
    let exist ;
    for (let i = 0; i < this.myCartList.length; i++) 
    {
     
      exist = this.checkExistInCart.includes(this.myCartList[i].type);
    
      if (exist)
      {
          break;
      }
    }

  
     if (exist) 
     {

            this.loadPage = true;
            let token = this._localStorageService.get(this.token);
          
            this._GeneralService.getT(token, 'auth/check-availability?token=')
              
              .subscribe(
                (data: any) => {

                 
                  this.vggStatus = data;
                  this.loadPage = false;
                  if (data.status  === true) {
                    this.makePayment();
                  }
                  else if (data.status === false)
                  {
                    this.loadPage = false;
                    Swal('', 'VGG is UnAvailable. Kindly Try later.', 'error');
                    return;
                  }
                 
              
                },
                (error: any) => 
                {     
                  this.loadPage = false;
                  this.vggStatus = null;
                  Swal('', 'Error Occured while Checking VGG Availibility', 'error');
                 
                }
              );
 
       }
       else
       {
       
           this.makePayment();
       }
  }
  

  makePayment() {

    
 // let element = <HTMLInputElement> document.getElementById("btnmakePayment");
 // element.disabled = true;

  //  this.makePaymentTxt = 'Wait..., Action in Progress';

    setTimeout(() => {
       //  alert(this.myCheckOutList.PXCTYRYY);  
        // alert(this.myCheckOutList.transaction_charge);  
    const handler = PaystackPop.setup({
      key: this.payStackKey,
      email: this.myCheckOutList.email,
      amount: this.myCheckOutList.amount_in_kobo,
      currency: "NGN",
      transaction_charge: this.myCheckOutList.transaction_charge,
      subaccount : 'ACCT_p30klehwh332lrd', 
      ref: this.myCheckOutList.reference_id,
      
      
      
      callback: (response) => {

        // element.disabled = false;
         this.makePaymentTxt = 'Make Payment';

       
        if (response.status === "success") 
        {
        
          this.updateEazyRefPayStack(response);
        this.ngZone.run(() => {
      
      if (response.status === "success") 
      {
       
        } 
        else
        {

        }

        });

      }
      }
    });
    handler.openIframe();
     }, 100);
  }


  updateEazyRefPayStack(response: any) {
    
    let value =  {
      type: ''
    };

    this.loadPage =  true;

    let url = `auth/complete-checkout/${response.reference}`; 

   

    let token = this._localStorageService.get(this.token);

      this._GeneralService.post(value, url)
      
      .retryWhen((err) => {
              
        return err.scan((retryCount) =>  {

          retryCount  += 1;
          if (retryCount < this.retryService) {

              this.retryMessage = 'Request in Progress...';
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

   
       
        swal('', data.message, 'success');
       // this._GeneralService.clearfineAddedd();
       this.loadPage =  false;
       this. myCart();
       this.checkOutDetails();
  

  },
  (error: any) => {
    
   
     this.loadPage =  false;
    if ( error.error.message != undefined){
      Swal('', error.error.message, 'error');
    }
    else{
      Swal('', this.errorOccur, 'error');
    }

  });
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
