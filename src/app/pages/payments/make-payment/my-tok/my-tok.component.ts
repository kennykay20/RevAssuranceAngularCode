import Swal from 'sweetalert2';
import { GeneralService } from './../../../../services/genservice.service';
import { GenModel } from './../../../../model/gen.model';
import { List } from 'linqts';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { Router } from '@angular/router';
@Component({
  selector: 'app-my-tok',
    templateUrl: './my-tok.component.html',
    styleUrls: ['./my-tok.component.scss']
})
export class MyTokComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
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
  rowsMobile = [];
  rowsMobileTem = [];
  current_page = 1;
  retryService: number =  GenModel.retryService;
  retryMessage: any;
  retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
  internetConMsg = GenModel.internetConMsg;
  errorOccur = GenModel.errorOccur;
  searchUserColumns: any;
  ItemsPerPage: any;

  pageLmit = GenModel.pageLmit;
 
  columns = [];
  temp = [];


  searchUserColumns1 = [
    {
      id: 1,
      columnName: 'Token'

    },
    {
      id: 2,
      columnName: 'Trans. Ref'

    },
    {
      id: 3,
      columnName: 'Amount'

    },
    {
      id: 4,
      columnName: 'Unit'

    },
    {
      id: 5,
      columnName: 'Trans. Date'

    },
    

];

columnId: any;

  constructor( public router: Router,
              public _GeneralService: GeneralService,
              private _localStorageService: LocalStorageService) { }

  ngOnInit() {
    //this.searchUserColumns = this.searchUserColumns1;
 //   this.ItemsPerPage = this._GeneralService.ItemsPerPage;
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
          
         // this.btnAction = this.lblBefore;
       
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
    this._GeneralService.getT(token, 'auth/my-token?token=')
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
       
         this.rows = data;
         this.temp = data;
         this.rowsMobile =  data.slice(0, this.pageLmit);
         this.rowsMobileTem = data;
        this.changePage(this.current_page);

       

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

  checkOut() {
   
    this.router.navigate(['./pay/checkOut']);
  }

  


  

 


  gen(row) {

  
    Swal({
      title: '',
      text: 'Click Continue to Regenerate your token',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Continue',
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) 
      {

       


        let value =   {
          token_id: row.id
        }
      
        this.loadPage = true;

        this._GeneralService.post(value, 'auth/retry-vend-token')
        // .retryWhen((err) => {
    
        //   return err.scan((retryCount) =>  {
    
        //     retryCount  += 1;
        //     if (retryCount < this.retryService) {
    
        //         this.retryMessage = 'Retrying...Attempt'; 
    
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
             if ( error.error.message != undefined)
                {
                  Swal('', error.error.message, 'error');
                }
                else{
                  Swal('', this.errorOccur, 'error');
                }
          });
       
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }

    updateFilter(event) {

      if (this.columnId === 1) {
        const val = event.target.value.toLowerCase();
      
        const temp = this.temp.filter(function(d) {
          return d.token.toLowerCase().indexOf(val) !== -1 || !val;
        });

        this.rows = temp;
        this.rowsMobile = temp;
      
        this.table.offset = 0;
      }

      if (this.columnId === 2) {
        const val = event.target.value.toLowerCase();
      
        const temp = this.temp.filter(function(d) {
          return d.transReference.toLowerCase().indexOf(val) !== -1 || !val;
        });

        this.rows = temp;
        this.rowsMobile = temp;
        
        this.table.offset = 0;
      }

      if (this.columnId === 3) {
        const val = event.target.value.toLowerCase();
      
        const temp = this.temp.filter(function(d) {
          return d.PaidAmount.toLowerCase().indexOf(val) !== -1 || !val;
        });

        this.rows = temp;
        this.rowsMobile = temp;
       
        this.table.offset = 0;
      }
      if (this.columnId === 4) {
        const val = event.target.value.toLowerCase();
      
        const temp = this.temp.filter(function(d) {
          return d.Unit.toLowerCase().indexOf(val) !== -1 || !val;
        });

        this.rows = temp;
        this.rowsMobile = temp;
       
        this.table.offset = 0;
      }

      if (this.columnId === 5) {
        const val = event.target.value.toLowerCase();
      
        const temp = this.temp.filter(function(d) {
          return d.created_at.toLowerCase().indexOf(val) !== -1 || !val;
        });

        this.rows = temp;
        this.rowsMobile = temp;
       
        this.table.offset = 0;
      }


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
