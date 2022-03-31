import Swal from 'sweetalert2';
import { List } from 'linqts';
import { GenModel } from './../../../model/gen.model';
import { GeneralService } from './../../../services/genservice.service';
import { FineDetailsComponent } from './fine-details/fine-details.component';
import { ViewFineDetailsComponent } from './../view-fine-details/view-fine-details.component';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';


@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})
export class MakePaymentComponent implements OnInit {

  dialogRef: any;
  rows: any; // = [];
  token = GenModel.tokenName;
  fineAddedd = GenModel.fineAddedd;
  btnConfirm = GenModel.btnConfirm;
  sumOutStanding: string;
  Service: number;
  Electricity: number;
  Fine: number;
  paymentsServices: any;
  fineNumber : number;
  OutstandingFineDebtHistory = [];
  loadPage = true;
  fineAddedStatus: any;



// Service: any;
// Electricity: any;
OutstandingServiceDebt: number;
OutstandingElectricityDebt: number;
// Fine: any;
Donation: any;
TopUp: any;
PartnerPayment: any;

retryService: number =  GenModel.retryService;
retryMessage: any;
retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
internetConMsg = GenModel.internetConMsg;
errorOccur = GenModel.errorOccur;
vggStatus: any;

  constructor( public router: Router,
              public _GeneralService: GeneralService,
              private _localStorageService: LocalStorageService) { }

  ngOnInit() 
  {

    this.load();
  
    let getFineAdded = this._localStorageService.get(this.fineAddedd);
 
    if(getFineAdded === 'Y') {
      this.fineAddedStatus = getFineAdded;
   
    }

  }

  addServiceToCart() {
    Swal({
      title: '',
      text: 'Enter number of Month you will like to pay for e.g 1-12',
      type: 'warning',
      input: 'number',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Cancel'
    }).then((result) => {
     
   
     
      if (result.value) 
      {
            if(result.value > 12) {


              return Swal('', `It can't be greater than 12`, 'warning');
            }
            if(result.value < 1) 
            {
               return Swal('', `It can't be less than 12`, 'warning');
            }
            
            let values = {
              type: 'Service', 
              quantity: result.value 
            }


         
            
            this.loadPage =  true;

            this._GeneralService.post(values, 'auth/add-to-cart')
            // .retryWhen((err) => {
    
            //   return err.scan((retryCount) =>  {
        
            //     retryCount  += 1;
            //     if (retryCount < this.retryService) {
        
            //         this.retryMessage = 'Retrying...Attempt'; // #'  + retryCount;
        
            //         return retryCount;
            //     }
            //     else 
            //     {
            //       this.retryMessage = this.errorOccur;
            //        throw(err);
            //     }
            //   }, 0).delay(this.retryDelayServiceInterval); 
            // })
            .subscribe(
              (data: any) => {
        
                this.loadPage =  false;
          
               
                this.load();
                Swal('', data.message, 'success');
                
        
              },
              (error: any) => {
                
             
                  this.loadPage =  false;
                if( error.error.message != undefined){
                  Swal('', error.error.message, 'error');
                }
                else{
                     Swal('', this.errorOccur , 'error');
                }
          
            
          
              });

          
       
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }



  addElectricityToCart() {
    Swal({
      title: '',
      text: 'Are you sure you want to add Electricity to Cart?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) 
      {

        let value = 
        {
            type: 'Electricity'
        };

      
        this.loadPage = true;

        this._GeneralService.post(value, 'auth/add-to-cart')
        // .retryWhen((err) => {
    
        //   return err.scan((retryCount) =>  {
    
        //     retryCount  += 1;
        //     if (retryCount < this.retryService) {
    
        //         this.retryMessage = 'Retrying...Attempt'; // #'  + retryCount;
    
        //         return retryCount;
        //     }
        //     else 
        //     {
        //       this.retryMessage = this.errorOccur;
        //        throw(err);
        //     }
        //   }, 0).delay(this.retryDelayServiceInterval); 
        // }).
        
        .subscribe(
          (data: any) => {
    
           
         
           
             this.loadPage =  false;
             this._localStorageService.set(this.fineAddedd, 'Y');
             Swal('', data.message, 'success');
             this.router.navigate(['./pay/pay']);
    
          },
          (error: any) => {
            
          
             this.loadPage =  false;
             if ( error.error.message != undefined)
                {
                  Swal('', error.error.message, 'error');
                }
          });
       
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }

  addElectricityToUp() {
    Swal({
      title: '',
      text: 'Enter Electricity Amount(₦)',
      type: 'warning',
      input: 'number',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Cancel'
    }).then((result) => {
     
   
     
      if (result.value) 
      {
            
            if (result.value < 1) 
            {
               return Swal('', `Enter a Valid Amount`, 'warning');
            }
            
            let values = {
              type: 'TopUp', 
              amount: result.value 
            };


          
            
            this.loadPage =  true;

            this._GeneralService.post(values, 'auth/add-to-cart')
            
            // .retryWhen((err) => {
    
            //   return err.scan((retryCount) =>  {
        
            //     retryCount  += 1;
            //     if (retryCount < this.retryService) {
        
            //         this.retryMessage = 'Retrying...Attempt'; // #'  + retryCount;
        
            //         return retryCount;
            //     }
            //     else 
            //     {
            //       this.retryMessage = this.errorOccur;
            //        throw(err);
            //     }
            //   }, 0).delay(this.retryDelayServiceInterval); 
            // })
            
            .subscribe(
              (data: any) => {
        
                this.loadPage =  false;
          
               
                Swal('', data.message, 'success');
              },
              (error: any) => {
               

                if ( error.error.message != undefined)
                {
                  Swal('', error.error.message, 'error');
                }
                
                
                 this.loadPage =  false;
          
              });

          
       
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }

  addDonation() {
    Swal({
      title: '',
      text: 'Enter Donation Amount(₦)',
      type: 'warning',
      input: 'number',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Cancel'
    }).then((result) => {
     
     
     
      if (result.value) 
      {
            
            if (result.value < 1) 
            {
               return Swal('', `Enter Donation Amount`, 'warning');
            }
            
            let values = {
              type: 'Donation', 
              amount: result.value 
            };


          
            
            this.loadPage =  true;

            this._GeneralService.post(values, 'auth/add-to-cart')
            // .retryWhen((err) => {
    
            //   return err.scan((retryCount) =>  {
        
            //     retryCount  += 1;
            //     if (retryCount < this.retryService) {
        
            //         this.retryMessage = 'Retrying...Attempt'; // #'  + retryCount;
        
            //         return retryCount;
            //     }
            //     else 
            //     {
            //       this.retryMessage = this.errorOccur;
            //        throw(err);
            //     }
            //   }, 0).delay(this.retryDelayServiceInterval); 
            // })
            
            .subscribe(
              (data: any) => {
        
                this.loadPage =  false;
          
            
                Swal('', data.message, 'success');
                
        
              },
              (error: any) => {
                
              

                Swal('', error.error.message, 'error');
          
              this.loadPage =  false;
          
              });

          
       
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }

  checkOut(): void {
   

   // let element = <HTMLInputElement> document.getElementById("btnCheckOut");
   // element.disabled = true;
   this.loadPage = true;
    let token = this._localStorageService.get(this.token);
   
    this._GeneralService.getT(token, 'auth/my-cart?token=').subscribe(
      (data: any) => {

        this.loadPage = false;
      

         if (data == null) {

           return Swal('', 'Your Cart is Empty', 'warning');
         }
         else
         {
          this.router.navigate(['./pay/checkOut']);
         }

        let get = new List<any>(data).Where(x => x.type === 'Fine').FirstOrDefault();

      
        if (get != null) {

        //  this.fineNumber = get;

        }
       
        
        

      },
      (error: any) =>
      {


      } 

    );
 
   }

  load(): void {
   
    let token = this._localStorageService.get(this.token);
   

    this._GeneralService.getT(token, 'auth/my-payments?token=')
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

     
        this.loadPage = false;
       
        this.paymentsServices = data;


        this.Service = data.paymentType.Service ;
        this.Electricity = data.paymentType.Electricity; 

    
        this.Donation = data.paymentType.Donation == null ? "0.00" : data.paymentType.Donation;
        this.TopUp = data.paymentType.TopUp == null ? "0.00" : data.paymentType.TopUp;
        this.PartnerPayment = data.paymentType.PartnerPayment == null ? "0.00" : data.paymentType.PartnerPayment;
          



      



        this.OutstandingServiceDebt = this.paymentsServices.paymentType.OutstandingServiceDebt;
        this.OutstandingElectricityDebt = this.paymentsServices.paymentType.OutstandingElectricityDebt;
        
        
        this.Fine = data.paymentType.Fine; // + '.00';

     
        if (this.Fine === 0)
        {
          this.fineAddedStatus = 'Y';
         
        }

     
      },
      (error: any) =>
      { 
       

      });
 
   }

 

   numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


  openViewFineDetails() {
  
    this.router.navigate(['./pay/fineDetails']);
  }


  openViewOutStandingServiceDetails() {
  
    this.router.navigate(['./pay/outstanding-detail']);
  }

  openViewElectricityOutDetails() {
 
    this.router.navigate(['./pay/elect-detail']);
  }


  partnerPayment() {
    Swal({
      title: '',
      text: 'Enter Partner Amount(₦)',
      type: 'warning',
      input: 'number',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Cancel'
    }).then((result) => {
     
     
     
      if (result.value) 
      {
            
            if (result.value < 1) 
            {
               return Swal('', `Enter a Valid Amount`, 'warning');
            }
            
            let values = {
              type: 'PartnerPayment', 
              amount: result.value 
            };


          
            
            this.loadPage =  true;

            this._GeneralService.post(values, 'auth/add-to-cart')
            
            // .retryWhen((err) => {
    
            //   return err.scan((retryCount) =>  {
        
            //     retryCount  += 1;
            //     if (retryCount < this.retryService) {
        
            //         this.retryMessage = 'Retrying...Attempt'; // #'  + retryCount;
        
            //         return retryCount;
            //     }
            //     else 
            //     {
            //       this.retryMessage = this.errorOccur;
            //        throw(err);
            //     }
            //   }, 0).delay(this.retryDelayServiceInterval); 
            // })
            
            .subscribe(
              (data: any) => {
        
                this.loadPage =  false;
          
               
                Swal('', data.message, 'success');
              },
              (error: any) => {
                
              
                if ( error.error.message != undefined)
                {
                  Swal('', error.error.message, 'error');
                }
                
                
                 this.loadPage =  false;
          
              });

          
       
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }



 
 


}
