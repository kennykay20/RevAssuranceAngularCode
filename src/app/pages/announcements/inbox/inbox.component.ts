
import { GenModel } from './../../../model/gen.model';
import Swal from 'sweetalert2';
import { GeneralService } from './../../../services/genservice.service';
import { Component, ViewChild,  OnInit,  ElementRef, Directive, Input, } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import { List } from 'linqts';
import {  WaitingDialog } from '../../../services/services';
import { LocalStorageService } from 'angular-2-local-storage';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
declare var $;

@Component({
    selector: 'app-inbox',
    templateUrl: './inbox.component.html',
    styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
 @ViewChild(DatatableComponent) table: DatatableComponent;

  dataTable: any;

  editing = {};
  rows = [];
  columns = [];
  temp = [];
  rowsMobile = [];
  rowsMobileTem = [];
  current_page = 1;
  count = 20;
  selected = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  dialogRef: any;
  public settings: Settings;
  dataRes: any;
  token = GenModel.tokenName;
  loadPage = true;
  addedworkflowList: any[] = [];

  selectedRec: any[] = [];
  btnConfirm = GenModel.btnConfirm;
  btnActionApprove = 'Approve';
  displayloader = false;
  lblProcess = '';
  retryService: number =  GenModel.retryService;
  retryMessage: any;
  retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
  internetConMsg = GenModel.internetConMsg;
  pageLmit = GenModel.pageLmit;
  recordDetails = GenModel.recordDetails;
  errorOccur = GenModel.errorOccur;
  redirectUrl = GenModel.redirectUrl;
  searchUserColumns: any;
  ItemsPerPage: any;
  columnId: any;
  statusTrack: any;

  searchUserColumns1 = [
    {
      id: 1,
      columnName: 'Subject'

    },
    {
      id: 2,
      columnName: 'Body'

    },
    {
      id: 3,
      columnName: 'Date Created'

    },
    {
      id: 4,
      columnName: 'Status'

    }

];

  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public _GeneralService: GeneralService, public router: Router,
              
              private _localStorageService: LocalStorageService) {
    this.settings = this.appSettings.settings; 
  }

  ngOnInit() 
  {
    //this.searchUserColumns = this.searchUserColumns1;
 //   this.ItemsPerPage = this._GeneralService.ItemsPerPage;
   this.load();
  
  }

  load(): void {
   
    let token = this._localStorageService.get(this.token);
   
    this._GeneralService.getT(token, 'auth/my-inbox?token=')
    
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

        //console.log('all Poll my-inbox:', data);

        let orderby = new List<any>(data).OrderByDescending(x => x.created_at).ToArray();

       // console.log('all Poll my-inbox orderby:', orderby);

        this.loadPage = false;
        this.temp = data;
        this.rows = data;
        this.rowsMobile =  data.slice(0, this.pageLmit);
        this.rowsMobileTem = data;
        this.changePage(this.current_page);
      },
      (error: any) => { 
       

        swal('Error', this.errorOccur, 'error');

    });
 
   }


   view(row: any): void {

    
    let values = {
      message_id: row.id 
    
    };


    console.log('view announcement: ', values);
    
    this.loadPage =  true;
  
    this._GeneralService.post(values, 'auth/read-announcement').subscribe(
      (data: any) => {

        this.loadPage =  false;
  
        console.log('view data res Read', data);
   
        this._localStorageService.set(this.recordDetails, row); 

        this._localStorageService.set(this.redirectUrl, null); 
        this._localStorageService.set(this.redirectUrl, './ano/inboxann'); 
        this.router.navigate(['./ano/view-ann']);
        

      },
      (error: any) => {
        
        console.log('error:', error);

        if (error.error.message != undefined){
          Swal('', error.error.message, 'error');
        }
        else{
          Swal('', this.errorOccur, 'error');
        }
       
  
      this.loadPage =  false;
  
      });


    
   }





   Delete(row: any): void {
    Swal({
      title: '',
      text: `Are you sure you want to delete ${row.title}`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Cancel'
    }).then((result) => {
     
      console.log('Delete announ: ', result);
     
      if (result.value) 
      {
           
            
            let values = {
              announcement_id: row.id 
            
            };


            console.log('Delete announcement: ', values);
            
            this.loadPage =  true;
          
            this._GeneralService.post(values, 'auth/delete-announcement').subscribe(
              (data: any) => {
        
                this.loadPage =  false;
          
                console.log('Delete data res', data);
                this.load();
                Swal('', data.message, 'success');
                
        
              },
              (error: any) => {
                
                console.log('error:', error);

                if (error.error.message != undefined){
                  Swal('', error.error.message, 'error');
                }
                else{
                  Swal('', this.errorOccur, 'error');
                }
               
          
              this.loadPage =  false;
          
              });

          
       
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    });
  }

   userAction(status: any) : any{
   // this.displayloader = true;

   

    if(this.selectedRec.length == 0){
      return  Swal('', 'Select User(s)', 'error');
    }
    this.statusTrack = status;
    let token = this._localStorageService.get(this.token);
    console.log('userAction token: ', token);
    //let getSelect = new List<any>(this.rows).Where(c=> c.)
  console.log('  this.userAction row:',   this.selectedRec);

      for (let i = 0; i < this.selectedRec.length; i++) {

              let value =  
              {
                    email: this.selectedRec[i].email,
                    status: status   
              };

              
   // this.loadPage =  true;
    this.lblProcess = 'Wait, Action in Progress...';
  

    let url = `auth/authorize-user?token=` + token; 
    console.log('post url: ', value);
    console.log('post value: ', value);

    
    
    this._GeneralService.post(value, url).subscribe(
      (data: any) => {

        // this.displayloader =  false;
       
        this.statusTrack = '';
        // console.log('gaddToCart data', data);
      let msg =  'Action Completed Successfully!';
        Swal('', msg, 'success');
        this.load();
       // this.btnActionApprove =  'Approve';
       
  
      },
      (error: any) => {
        
        // console.log('error:', error)
     //   this.btnActionApprove =  'Approve';
   
         this.displayloader =  false;
         this.loadPage =  false;

         Swal('', error.error.message, 'error');

      });

     }


   

   }




  updateFilter(event) {

    if (this.columnId === 1) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.title.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      this.rowsMobile = temp;
      // console.log('updateFilter',  this.rows);
      this.table.offset = 0;
    }

    if (this.columnId === 2) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.body.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      this.rowsMobile = temp;
      // console.log('updateFilter',  this.rows);
      this.table.offset = 0;
    }

    if (this.columnId === 3) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.created_at.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      this.rowsMobile = temp;
      // console.log('updateFilter',  this.rows);
      this.table.offset = 0;
    }

    if (this.columnId === 4) {
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

