import { GenModel } from './../../../model/gen.model';
import Swal from 'sweetalert2';
import { GeneralService } from './../../../services/genservice.service';
import { Component, ViewChild,  OnInit,  ElementRef, Directive, Input, } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
// import { ViewAgentdetailsComponent } from '../view-agent/view-agentdetails/view-agentdetails.component';
// import { UpdateAgentComponent } from '../view-agent/update-agent/update-agent.component';
import { List } from 'linqts';
import {  WaitingDialog } from '../../../services/services';
import { LocalStorageService } from 'angular-2-local-storage';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/scan';
import { Router } from '@angular/router';
import swal from 'sweetalert';
declare var $;



@Component({
  selector: 'app-all-fine-waivers',
  templateUrl: './all-fine-waivers.component.html',
  styleUrls: ['./all-fine-waivers.component.scss']
})
export class AllFineWaiversComponent implements OnInit {
  //@ViewChild('dataTable') table: ElementRef;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  dataTable: any;
  rowsMobile = [];
  current_page = 1;
  rowsMobileTem = [];
  editing = {};
  rows: any; // = [];
  temp = [];
  count = 20;
  selected = [];
  loadingIndicator = true;
  reorderable = true;
  columns = [
              { prop: 'name' },
              { name: 'Gender' },
              { name: 'Company' }
  ];

columnId: number;


  pageLmit = GenModel.pageLmit;
  dialogRef: any;
  public settings: Settings;
  dataRes: any;
  token = GenModel.tokenName;
  loadPage = true;
  addedworkflowList: any[] = [];

  selectedRec: any[] = [];
  searchUserColumns: any;
  ItemsPerPage: any;

  btnActionApprove = 'Approve';
  displayloader = false;
  lblProcess = '';
  retryService: number =  GenModel.retryService;
  retryMessage: any;
  retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
  recordDetails = GenModel.recordDetails;
  messageToSend = 'Lawal';

  @Input() receivedParentMessage: string;
  btnConfirm  = GenModel.btnConfirm;

  desc:any;
  redirectUrl = GenModel.redirectUrl;
  errorOccur = GenModel.errorOccur;
  constructor(public appSettings: AppSettings,
              public dialog: MatDialog,
              public _GeneralService: GeneralService,
              private _localStorageService: LocalStorageService,
              public router:Router) {
    this.settings = this.appSettings.settings; 
  }



  ngOnInit() 
  {
    //this.searchUserColumns = this._GeneralService.searchUserColumns;
 //   this.ItemsPerPage = this._GeneralService.ItemsPerPage;
   this.load();
  
  }

  action(row, status) {
    Swal({
      title: '',
      text: `Are you sure you want to ${status}  Waiver for ${row.name},  the sum of ${row.amount}?`,
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
          fine_id : row.fine_id,
          status : status
        };
        console.log('action approve post value', value);
      
        this.loadPage = true;

        this._GeneralService.post(value, 'auth/approve-waiver-request')
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
    
           
            console.log('action approve decline action data', data);
           
             this.loadPage =  false;
             Swal('', data.message, 'success');
        
    
          },
          (error: any) => {
            
            console.log('action approve decline err:', error);
             this.loadPage =  false;
             if ( error.error.message != undefined)
                {
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


  load(): void {
   
    let token = this._localStorageService.get(this.token);

    this._GeneralService.getT(token, 'auth/all-fine-waivers?token=')

    .retryWhen((err) => {
    
            return err.scan((retryCount) =>  {

              retryCount  += 1;
              if (retryCount < this.retryService) {

                  this.retryMessage = 'Retrying...Attempt'; // #'  + retryCount;

                  return retryCount;
              }
              else 
              {
                this.retryMessage = 'Problem Loading Page. Kindly contact System Administrator';
                 throw(err);
              }
            }, 0).delay(this.retryDelayServiceInterval); 
          }).subscribe(
      (data: any) => {

       // console.log('data:', data);
     

        this.loadPage = false;
          
          this.temp = data;
          this.rows = data;
          this.rowsMobile =  data.slice(0, this.pageLmit);
          this.rowsMobileTem = data;
          this.changePage(this.current_page);

          console.log('this.rowsMobileTem:', this.rowsMobileTem);


      },
      (error: any) => {
       //// console.log('error:', error)
      }
      

    );
 
   }
//{ path: 'all-fine', component: AllFineComponent, data: { breadcrumb: 'All Fines' } },
//{ path: 'apply-waiver', component: ApplyWaiverComponent, data: { breadcrumb: 'Apply Waiver' } },
   gotoAddFine(row): void {


    this._localStorageService.set(this.recordDetails, row); 

    this._localStorageService.set(this.redirectUrl, null); 
    this._localStorageService.set(this.redirectUrl, './chg/all-fine'); 
    this.router.navigate(['./chg/apply-waiver']);
   }

   addFine1(row: any, chargeType: any) {
    // console.log('select row:', row);
      let details = {
        row: row,
        chargeType: chargeType
      };
   // this._GeneralService.holdData(row);
   this._localStorageService.set(this.recordDetails, details);

    this.router.navigate(['./chg/chg']);


            // this.selectedRec.push({ 
            //         email: row.email,
            //         status: row.email,
            //         partner_type: row.partner_type,
                    
                   
            //    });

            //    // console.log('  this.selectedRec row:',   this.selectedRec);
   }

   addFine(row: any, chargeType: any) {

    Swal({
     // title: '',
      title: 'Make ' + chargeType + ' Payment for ' + row.first_name + ' '  + row.last_name + ' ' + row.email,
      html:
     //'<label>Description</lable>' +
      '<input type="text" id="swal2-input" value="" placeholder="Enter Description"  class="swal2-input" />' +
      '<input type="text" id="swal2-input2" value="" placeholder="Enter Amount(₦)"  class="swal2-input" />', // +
    //  '<label>Amount</lable>',
     // type: 'warning',
     // input: 'number',
      showCancelButton: true,
      confirmButtonText: 'Add ' + chargeType,
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Cancel',
      
    }).then((result) => {
     // // console.log('result : ',  result );



      let Description = (<HTMLInputElement>document.getElementById("swal2-input")).value;
      let Amount = (<HTMLInputElement>document.getElementById("swal2-input2")).value;
      // // console.log('Description : ',  Description );
       if (Description == '') {
            return swal('', 'Enter Description', 'warning');
       }

       if (result.value == null || result.value == '') {
        return swal('', 'Enter Amount', 'warning');
   }
      if (Amount) 
      {
            let values = {
              amount: Amount, 
              description: Description ,
              email: row.email
            };


            // console.log('addServiceToCart values', values);
            
            this.loadPage =  true;

            this._GeneralService.post(values, 'auth/create-fine')
            .retryWhen((err) => {
    
              return err.scan((retryCount) =>  {
      
                retryCount  += 1;
                if (retryCount < this.retryService) {
      
                  // this.btnlogtxt = 'Authenticating...'; // #'  + retryCount;
                  this.loadPage =  true;
                    return retryCount;
                }
                else 
                {
                  this.loadPage =  false;
                  Swal('', 'Your Request is taking longer than Expected. Try some other time or Contact System Administrator', 'error');
                   throw(err);
                }
              }, 0).delay(this.retryDelayServiceInterval); 
            }).
            
            subscribe(
              (data: any) => {
        
                this.loadPage =  false;
          
                // console.log('create-fine data', data);
                Swal('', data.message, 'success');
                
        
              },
              (error: any) => {
                
                // console.log('error:', error);

                Swal('', error.error.message, 'error');
          
              this.loadPage =  false;
          
              });

          
       
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });


  }

  addPartner(row: any, chargeType: any) {

    Swal({
     // title: '',
      title: 'Make ' + chargeType + ' Payment for ' + row.first_name + ' '  + row.last_name + ' ' + row.email,
      html:
     //'<label>Description</lable>' +
      '<input type="text" id="swal2-input" value="" placeholder="Enter Description"  class="swal2-input" />' +
      '<input type="text" id="swal2-input2" value="" placeholder="Enter Amount(₦)"  class="swal2-input" />', // +
    //  '<label>Amount</lable>',
     // type: 'warning',
     // input: 'number',
      showCancelButton: true,
      confirmButtonText: 'Add ' + chargeType,
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Cancel',
      
    }).then((result) => {
     // // console.log('result : ',  result );

      if (result.value === "") {
        return swal('', 'Enter Amount', 'warning');
   }

      let Description = (<HTMLInputElement>document.getElementById("swal2-input")).value;
      let Amount = (<HTMLInputElement>document.getElementById("swal2-input2")).value;
      // // console.log('Description : ',  Description );
       if (Description == '') {
            return swal('', 'Enter Description', 'warning');
       }

       if (result.value == null || result.value == '') {
        return swal('', 'Enter Amount', 'warning');
   }
      if (Amount) 
      {
            let values = {
              amount: Amount, 
              description: Description ,
              email: row.email
            };


            // console.log('addServiceToCart values', values);
            
            this.loadPage =  true;

            this._GeneralService.post(values, 'auth/create-fine')
            .retryWhen((err) => {
    
              return err.scan((retryCount) =>  {
      
                retryCount  += 1;
                if (retryCount < this.retryService) {
      
                  // this.btnlogtxt = 'Authenticating...'; // #'  + retryCount;
                  this.loadPage =  true;
                    return retryCount;
                }
                else 
                {
                  this.loadPage =  false;
                  Swal('', 'Your Request is taking longer than Expected. Try some other time or Contact System Administrator', 'error');
                   throw(err);
                }
              }, 0).delay(this.retryDelayServiceInterval); 
            }).
            
            subscribe(
              (data: any) => {
        
                this.loadPage =  false;
          
                // console.log('create-fine data', data);
                Swal('', data.message, 'success');
                
        
              },
              (error: any) => {
                
                // console.log('error:', error);

                Swal('', error.error.message, 'error');
          
              this.loadPage =  false;
          
              });

          
       
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });


  }

  addElectricity(row: any, chargeType: any) {

    Swal({
     // title: '',
      title: 'Make ' + chargeType + ' Payment for ' + row.first_name + ' '  + row.last_name + ' ' + row.email,
      html:
     //'<label>Description</lable>' +
      '<input type="text" id="swal2-input" value="" placeholder="Enter Description"  class="swal2-input" />' +
      '<input type="text" id="swal2-input2" value="" placeholder="Enter Amount(₦)"  class="swal2-input" />', // +
    //  '<label>Amount</lable>',
     // type: 'warning',
     // input: 'number',
      showCancelButton: true,
      confirmButtonText: 'Add ' + chargeType,
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Cancel',
      
    }).then((result) => {
     // // console.log('result : ',  result );

      if (result.value === "") {
        return swal('', 'Enter Amount', 'warning');
   }

      let Description = (<HTMLInputElement>document.getElementById("swal2-input")).value;
      let Amount = (<HTMLInputElement>document.getElementById("swal2-input2")).value;
      // // console.log('Description : ',  Description );
       if (Description == '') {
            return swal('', 'Enter Description', 'warning');
       }

       if (result.value == null || result.value == '') {
        return swal('', 'Enter Amount', 'warning');
   }
      if (Amount) 
      {
            let values = {
              amount: Amount, 
              description: Description ,
              email: row.email
            };


            // console.log('addServiceToCart values', values);
            
            this.loadPage =  true;

            this._GeneralService.post(values, 'auth/create-fine')
            .retryWhen((err) => {
    
              return err.scan((retryCount) =>  {
      
                retryCount  += 1;
                if (retryCount < this.retryService) {
      
                  // this.btnlogtxt = 'Authenticating...'; // #'  + retryCount;
                  this.loadPage =  true;
                    return retryCount;
                }
                else 
                {
                  this.loadPage =  false;
                  Swal('', 'Your Request is taking longer than Expected. Try some other time or Contact System Administrator', 'error');
                   throw(err);
                }
              }, 0).delay(this.retryDelayServiceInterval); 
            }).
            
            subscribe(
              (data: any) => {
        
                this.loadPage =  false;
          
                // console.log('create-fine data', data);
                Swal('', data.message, 'success');
                
        
              },
              (error: any) => {
                
                // console.log('error:', error);

                Swal('', error.error.message, 'error');
          
              this.loadPage =  false;
          
              });

          
       
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });


  }




      updateFilter(event) {

        if (this.columnId === 1) {
          const val = event.target.value.toLowerCase();
        
          const temp = this.temp.filter(function(d) {
            return d.first_name.toLowerCase().indexOf(val) !== -1 || !val;
          });

          this.rows = temp;
          this.rowsMobile = temp;
          // console.log('updateFilter',  this.rows);
          this.table.offset = 0;
        }

        if (this.columnId === 2) {
          const val = event.target.value.toLowerCase();
        
          const temp = this.temp.filter(function(d) {
            return d.phone_number.toLowerCase().indexOf(val) !== -1 || !val;
          });

          this.rows = temp;
          this.rowsMobile = temp;
          // console.log('updateFilter',  this.rows);
          this.table.offset = 0;
        }

        if (this.columnId === 3) {
          const val = event.target.value.toLowerCase();
        
          const temp = this.temp.filter(function(d) {
            return d.email.toLowerCase().indexOf(val) !== -1 || !val;
          });

          this.rows = temp;
          this.rowsMobile = temp;
          // console.log('updateFilter',  this.rows);
          this.table.offset = 0;
        }

        if (this.columnId === 4) {
          const val = event.target.value.toLowerCase();
        
          const temp = this.temp.filter(function(d) {
            return d.meter_number.toLowerCase().indexOf(val) !== -1 || !val;
          });

          this.rows = temp;
          this.rowsMobile = temp;
          // console.log('updateFilter',  this.rows);
          this.table.offset = 0;
        }
        if (this.columnId === 5) {
          const val = event.target.value.toLowerCase();
        
          const temp = this.temp.filter(function(d) {
            return d.status.toLowerCase().indexOf(val) !== -1 || !val;
          });

          this.rows = temp;
          this.rowsMobile = temp;
          // console.log('updateFilter',  this.rows);
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




