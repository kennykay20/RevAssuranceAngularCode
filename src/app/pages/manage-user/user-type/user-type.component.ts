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

declare var $;



@Component({
      selector: 'app-user-type',
      templateUrl: './user-type.component.html',
      styleUrls: ['./user-type.component.scss']
})
export class UserTypeComponent implements OnInit {
 // @ViewChild(DatatableComponent) table: DatatableComponent;

  @ViewChild('dataTable') table: ElementRef;
  
  dataTable: any;

  editing = {};
  rows: any; // = [];
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

  btnActionApprove = 'Approve';
  displayloader = false;
  lblProcess = '';
  retryService: number =  GenModel.retryService;
  retryMessage: any;
  retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
  internetConMsg = GenModel.internetConMsg;



  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public _GeneralService: GeneralService,
              
              private _localStorageService: LocalStorageService) {
    this.settings = this.appSettings.settings; 
  }



  ngOnInit() 
  {
   this.load();
  
  }

  load(): void {
   
    let token = this._localStorageService.get(this.token);
   
    this._GeneralService.getT(token, 'auth/all-users?token=')
    
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


        this.loadPage = false;

        let temp = data.data;

       

          this.rows = data.data;

          // for (let i = 0; i < data.data.length; i++) {

          //   // this.addedworkflowList = this.addedworkflowList || [];
 
          //          this.addedworkflowList.push({ 
          //            id: data.data[i].id,
          //            first_name: data.data[i].first_name,
          //            last_name: data.data[i].last_name,
          //            email: data.data[i].email,
          //            phone_number: data.data[i].phone_number,
          //            meter_number: data.data[i].meter_number,
          //            status: data.data[i].status,
          //           created_at:  this._GeneralService.dateconvertion(data.data[i].created_at)
          //           // roleId: data.data[i].roleId,
          //           // createdBy: data.data[i].createdBy,
          //          // productname: this.productNameBind,
          //          //  permissionActionName: data[i].permissionActionName, 
          //            // permissionActionOrder: data[i].priority,
          //          // assignMsg:'',
          //          // created:  this._GeneralService.dateconvertion(data.data[i].created_at),
          //            // last: data[i].last,
          //      });
 
          //  }
       
       
        

       

      },
      (error: any) => {
        
    
      
      }

    );
 
   }

   select(row: any) {

            this.selectedRec.push({ 
                    email: row.email,
                    status: row.email,
                    partner_type: row.partner_type,
                    
                   
               });

            
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


    this._GeneralService.post(value, url).subscribe(
      (data: any) => {

         this.displayloader =  false;
       

     
        Swal('', data.message, 'success');

        this.btnActionApprove =  'Approve';
       
  
      },
      (error: any) => {
        
     
        this.btnActionApprove =  'Approve';
   
         this.displayloader =  false;
         this.loadPage =  false;

         Swal('', error.error.message, 'error');

      });

     }


   

   }

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




