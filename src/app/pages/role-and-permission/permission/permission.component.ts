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
import swal from 'sweetalert2';

declare var $;



@Component({
  selector: 'app-permission',
    templateUrl: './permission.component.html',
    styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {
 // @ViewChild(DatatableComponent) table: DatatableComponent;

 @ViewChild(DatatableComponent) table: DatatableComponent;
 dataTable: any;


 rowsMobile = [];
 rowsMobileTem = [];
 current_page = 1;

 searchUserColumns: any;
 pageLmit = GenModel.pageLmit;
 ItemsPerPage: any;
  editing = {};
  rows: any[] = [];
  temp = [];
  count = 20;
  selected = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  columns = [
    { prop: 'name' },
    { name: 'Gender' },
    { name: 'Company' }
  ];
  dialogRef: any;
  public settings: Settings;
  dataRes: any;
  token = GenModel.tokenName;
  loadPage = true;
  addedworkflowList: any[] = [];

  selectedRec: any[] = [];
  selectedAllCanView:any;
  btnActionAssign = 'Assign';
  displayloader = false;
  displayloaderR = false;
  lblProcess = '';
  retryService: number =  GenModel.retryService;
  retryMessage: any;
  retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
  internetConMsg = GenModel.internetConMsg;

  columnId: any;
  btnConfirm = GenModel.btnConfirm;
  selectedAllCanDelete: any;
  selectedAll: any;
  selectAllText: any;

  selectedAllCanAdd: any;
  selectedAllCanEdit: any;
  selectedAllCanDeleteAll: any;
  selectedAllCanAuthorize: any;
  roleInfo: any;
  errorOccur = GenModel.errorOccur;
  Roles: any[] = [];
  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public _GeneralService: GeneralService,
              
              private _localStorageService: LocalStorageService) {
    this.settings = this.appSettings.settings; 
  }



  ngOnInit() 
  {
 //   this.ItemsPerPage = this._GeneralService.ItemsPerPage;
  //  this.searchUserColumns = this._GeneralService.searchUserColumns;
   this.load();
   this.loadRoles();
  
  }

  load(): void {
   
    let token = this._localStorageService.get(this.token);
   
    // this._GeneralService.getT(token, 'auth/all-menus?token=')
    
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
    // }).subscribe(
    //   (data: any) => {

    //    // console.log('get menu list', data);
    //     this.loadPage = false;

    //    let rows1 =  [];
       
    //        for (let i = 0; i < data.data.length; i++) 
    //        {
    //        // this.rows = this.rows || [];
    //          rows1.push({ 
    //                  id: data.data[i].id,
    //                  menuName: data.data[i].menuName,
    //                  canAdd: false,
    //                  canView: false,
    //                  canEdit: false,
    //                  canDelete: false,
    //                  canAuthorise: false
                   
    //            });
 
    //        }

    //        this.rows = rows1;
    //        this.temp = rows1;
    //        this.rowsMobile = rows1.slice(0, this.pageLmit);
    //        this.rowsMobileTem = rows1;
    //        this.changePage(this.current_page);

    //    //  console.log('get this.rows', this.rows);
         
    //      //console.log('get list of service this.rows', this.rows);
    //   },
    //   (error: any) =>{
    //     // console.log('error:', error)
    //   } 

    // );
 
   }

   loadRoles(): void {
   
    let token = this._localStorageService.get(this.token);
   
    // this._GeneralService.getT(token, 'auth/roles?token=')
    
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
    // }).subscribe(
    //   (data: any) => {

      
    //     this.loadPage = false;
    //     let orderby = new List<any>(data).OrderBy(x => x.name).ToArray();
    //     // console.log('get roles orderby', orderby);
    //     this.Roles = orderby;

    //   },
    //   (error: any) => 
    //   {
    //      console.log('error:', error)
    //   } 

    // );
 
   }

   selectCanDeleteandCanViewRow()
  {
    // console.log('selectCanDeleteandCanViewRow: ', this.rows);
    
      for (let i = 0; i < this.rows.length; i++) {


        // canAdd: false,
        //              canView: false,
        //              canEdit: false,
        //              canDelete: false

          if (this.rows[i].canAdd === true || 
              this.rows[i].canDelete === true 
              || this.rows[i].canEdit === true) 
          {
              
              this.rows[i].canView =  true;
          }
          else 
          {
               this.rows[i].canView =  this.rows[i].canDelete;
          }
     }
  }

  selectCanAuthandCanViewRow()
  {
     //alert(71);
     for (let i = 0; i < this.rows.length; i++) {

        if (this.rows[i].canAdd   == true ||
            this.rows[i].canAuthorise   == true || this.rows[i].canEdit == true) {

            this.rows[i].canView =  true;
        }
        else {
             this.rows[i].canView =  this.rows[i].canAuthorise;
        }
    }
  }

  assingMenuToUser(): any {
    
//console.log('this.roleInfo', this.roleInfo);
if (this.roleInfo == undefined) {
  return Swal('', 'Kindly Select Role', 'warning');
}


let  rows2 = [];
for (let i = 0; i < this.rows.length; i++) 
{
  //console.log('this.rows i***: ', this.rows[i]);
let getCheckViewSingle = new List<any>(this.rows).Where(c => this.rows[i].canView === true).FirstOrDefault(); 
let getCheckAddSingle = new List<any>(this.rows).Where(c =>  this.rows[i].canAdd  === true).FirstOrDefault();
let getCheckcanEditSingle = new List<any>(this.rows).Where(c => this.rows[i].canEdit === true).FirstOrDefault();
let getCheckcanDeleteSingle  = new List<any>(this.rows).Where(c => this.rows[i].canDelete === true).FirstOrDefault();
let getCheckcanAuthoriseSingle  = new List<any>(this.rows).Where(c => this.rows[i].canAuthorise === true).FirstOrDefault();



  rows2 = rows2 || [];

  if ( getCheckViewSingle !== undefined || getCheckAddSingle !== undefined || getCheckcanEditSingle !== undefined
    || getCheckcanDeleteSingle !== undefined || getCheckcanAuthoriseSingle !== undefined)
    {
    

          rows2.push({ 
            
            id:  this.rows[i].id,       
            can_view: getCheckViewSingle != undefined ? true : false, 
            can_add: getCheckAddSingle != undefined ? true : false, 
            can_edit: getCheckcanEditSingle != undefined ? true : false, 
            can_delete: getCheckcanDeleteSingle != undefined ? true : false, 
            can_authorize: getCheckcanAuthoriseSingle != undefined ? true : false, 
      
        });
    }
  

}
//console.log('this.rows: ', rows2);
if (rows2.length === 0) 
{
    return Swal('', 'Kindly Select the Menu you want to Assign', 'warning');
}

    Swal({
      title: '',
      text: 'Are you sure you want to Add the Selected Menu(s) for ' + this.roleInfo.name + '?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) 
      {

     // console.log('get this.rows to be added', rows2);
      
    
      let values = 
      {
            "role_id":  this.roleInfo.id,
            "menus": rows2

    };
       this.displayloader = true;
     // console.log('posted value assign Menu44*:  ', values);

      let token = this._localStorageService.get(this.token);
     
      let url = `auth/assign-menu?token=` + token; 

      this._GeneralService.post(values, url).subscribe(
        (data: any) => {
          
          // console.log('data assign menu result: ', data);
         
           this.displayloader = false;

           Swal('', data.message, 'success');

        },
        (error: any) => {
          
          //console.log('data menu assign Error : ', error);
        this.displayloader =  false;
   
        this.lblProcess = '';

        if (error.error.message != undefined) {
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

  removeMenuToUser(): any {
    
    //console.log('this.roleInfo', this.roleInfo);
    if (this.roleInfo == undefined) {
      return Swal('', 'Kindly Select Role', 'warning');
    }
        Swal({
          title: '',
          text: 'Are you sure you want to Remove all the Menu(s) assigned to ' + this.roleInfo.name + '?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          confirmButtonColor: this.btnConfirm,
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.value) 
          {
    
         // console.log('get this.rows to be added', rows2);
           this.displayloaderR = true;
       
    
          let values = 
          {
                "role_id":  this.roleInfo.id,
               
    
        };
    
         // console.log('posted value assign Menu44*:  ', values);
    
          let token = this._localStorageService.get(this.token);
         
          let url = `auth/delete-menu?token=` + token; 
    
          this._GeneralService.post(values, url).subscribe(
            (data: any) => {
              
               console.log('data delete-menu result: ', data);
               //this.loadPage = false;
               this.displayloaderR = false;
    
               Swal('', data.message, 'success');
    
            },
            (error: any) => {
              
              //console.log('data menu assign Error : ', error);
            this.displayloaderR =  false;
           // this.loadPage = false;
 
    
            if (error.error.message != undefined) {
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

  selectAll() {

    if (this.selectedAll === true) {
  
        this.selectAllText = 'UnCheck All';
       let trueDe =  true;
       
  
        for (let i = 0; i < this.rows.length; i++) {
          this.rows[i].canAdd = trueDe;
          this.rows[i].canDelete = trueDe;
          this.rows[i].canEdit = trueDe;
          this.rows[i].canView = trueDe;
          this.rows[i].canAuthorise = trueDe;
          
  
        }

       // console.log('selectAll', this.rows);
    } else {
  
      Swal({
        title: '',
        text: 'Are you sure you want to UnCheck All?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: this.btnConfirm,
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.selectAllText = 'Check All';
  
        //  this.selectedAllCanView = this.selectedAll;
        //  this.selectedAllCanAdd = this.selectedAll;
        //  this.selectedAllCanEdit = this.selectedAll;
        //  this.selectedAllCanAuth = this.selectedAll;
        //  this.selectedAllCanDelete = this.selectedAll;
        let falseDe =  false;
         for (let i = 0; i < this.rows.length; i++) {
          this.rows[i].canAdd = falseDe;
          this.rows[i].canDelete = falseDe;
          this.rows[i].canEdit = falseDe;
          this.rows[i].canView = falseDe;
          this.rows[i].canAuthorise = falseDe;
  
  
         }
  
  
        } else if (result.dismiss === Swal.DismissReason.cancel) {
  
        }
      });
  
    }
  
  
    }

    selectAllCanView() {

      for (let i = 0; i < this.rows.length; i++) {
          this.rows[i].canView = this.selectedAllCanView;
      }

    }

    
    selectAllCanAdd() {
      // this.rows[i].canAdd = falseDe;
      // this.rows[i].canDelete = falseDe;
      // this.rows[i].canEdit = falseDe;
      // this.rows[i].canView = falseDe;
      // this.rows[i].canAuthorise = falseDe;
      for (let i = 0; i < this.rows.length; i++) {
          this.rows[i].canAdd = this.selectedAllCanAdd;
      }
    }

    selectAllCanEdit() {

      for (let i = 0; i < this.rows.length; i++) {
        this.rows[i].canEdit = this.selectedAllCanEdit;
       }
    }

    selectAllCanDeleteAll() {

      for (let i = 0; i < this.rows.length; i++) {
        this.rows[i].canDelete = this.selectedAllCanDeleteAll;
       }
    }

    selectAllCanAuthorize() {

      for (let i = 0; i < this.rows.length; i++) {
        this.rows[i].canAuthorise = this.selectedAllCanAuthorize;
       }
    }

  selectCanAddandCanViewRow(){


      // canAdd: false,
        //              canView: false,
        //              canEdit: false,
        //              canDelete: false

    for (let i = 0; i < this.rows.length; i++) {

        if (this.rows[i].canAdd === true ||
            this.rows[i].canEdit === true || this.rows[i].canDelete === true) {

            this.rows[i].canView =  true;
        }
        else
         {
             this.rows[i].canView =  this.rows[i].canAdd;
        }
    }
  }

  selectCanEditandCanViewRow()
  {
     
      // canAdd: false,
        //              canView: false,
        //              canEdit: false,
        //              canDelete: false
      for (let i = 0; i < this.rows.length; i++) {

          if (this.rows[i].canAdd == true ||
              this.rows[i].canDelete == true || this.rows[i].canEdit == true) {

              this.rows[i].canView =  true;
          }
          else {
              this.rows[i].canView =  this.rows[i].canEdit;
          }
      }
  }

 
  selectCanViewAddCanDeleteRow(){

 
  
}

   select(row: any) {
  //  console.log('select row:', row);


            this.selectedRec.push({ 
                    email: row.email,
                    status: row.email,
                    partner_type: row.partner_type,
                    
                   
               });

             //  console.log('  this.selectedRec row:',   this.selectedRec);
   }

   post() {



      for (let i = 0; i < this.selectedRec.length; i++) {

              let value =  
              {
                    email: this.selectedRec[i][0],
                    status: this.selectedRec[i][1],
                    partner_type: this.selectedRec[i][2],
              };

              
   // this.loadPage =  true;
    this.lblProcess = 'Wait, Action in Progress...';
    this.displayloader = true;

    let url = `auth/authorize-user`; 

   // console.log('post url: ', url);
    
    this._GeneralService.post(value, url).subscribe(
      (data: any) => {

         this.displayloader =  false;
       

        console.log('gaddToCart data', data);

        Swal('', data.message, 'success');

        this.btnActionAssign =  'Assign';
       
  
      },
      (error: any) => {
        
      //  console.log('error:', error)
        this.btnActionAssign =  'Assign';
   
         this.displayloader =  false;
         this.loadPage =  false;

         Swal('', error.error.message, 'error');

      });

     }


   

   }


   updateFilter(event) {


      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.menuName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      this.rowsMobile = temp;
      this.table.offset = 0;
    
     // console.log('updateFilter',  this.rows);
 

 


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

  //  ngAfterViewInit()  {

  //   this.dataTable =  $(this.table.nativeElement);
  //   this.dataTable.dataTable();
  //   this.settings.loadingSpinner = false; 
  // }

  // ngOnChanges ()  {
    
  //   this.dataTable =  $(this.table.nativeElement);
  //   this.dataTable.dataTable();
  //   this.settings.loadingSpinner = false; 
  // }
  // updateFilter(event, opt) {

  //   if(opt == 1){
  //     const val = event.target.value.toLowerCase();
    
  //     const temp = this.temp.filter(function(d) {
  //       return d.name.toLowerCase().indexOf(val) !== -1 || !val;
  //     });
  //     this.rows = temp;
  //     this.table.offset = 0;
  //   }

  }




