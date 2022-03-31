import Swal from 'sweetalert2';
import { GeneralService } from './../../../../services/genservice.service';
import { GenModel } from './../../../../model/gen.model';
import { List } from 'linqts';

// import { CheckOutComponent } from './../check-out/check-out.component';

import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';


import { Router } from '@angular/router';
@Component({
  selector: 'app-fine-details',
  templateUrl: './fine-details.component.html',
  styleUrls: ['./fine-details.component.scss']
})
export class FineDetailsComponent implements OnInit {

  rowsMobile = [];
  rowsMobileTem = [];
  current_page = 1;

  dialogRef: any;
  rows: any; // = [];
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
  pageLmit = GenModel.pageLmit;
  displayloader: boolean = false;
  btnAction: string = 'Add to Cart';
  lblBefore = 'Add to Cart';
  retryService: number =  GenModel.retryService;
retryMessage: any;
retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
errorOccur =  GenModel.errorOccur;
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
          type: 'Fine'
        }

        this.btnAction = 'Wait, Action in Progress...';
        this.loadPage = true;

        this._GeneralService.post(value, 'auth/add-to-cart').subscribe(
          (data: any) => {
    
           
          
            this.btnAction =  this.lblBefore;
           
             this.loadPage =  false;
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

        let third: any[] = this.paymentsServices.paymentType.OutstandingFineDebtHistory;
        this.OutstandingFineDebtHistory = third;
        
        const sum3 = new List<any>(third).Sum(x => x.amount);
     
        
        this.rows = this.paymentsServices.paymentType.OutstandingFineDebtHistory;

         this.sumOutStanding = this.numberWithCommas(sum3); // + '.00';
        
         this.rowsMobile =  this.rows.slice(0, this.pageLmit);
          this.rowsMobileTem = this.rows;
          this.changePage(this.current_page);
       

      },
      (error: any) =>{ 

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
