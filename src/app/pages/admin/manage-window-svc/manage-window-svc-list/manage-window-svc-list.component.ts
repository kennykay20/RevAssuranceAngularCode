import { GenModel } from './../../../../model/gen.model';
import Swal from 'sweetalert2';
import { GeneralService } from './../../../../services/genservice.service';
import { Component, ViewChild,  OnInit,  ElementRef, Directive, Input, } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import { List } from 'linqts';
import {  WaitingDialog } from '../../../../services/services';
import { LocalStorageService } from 'angular-2-local-storage';
import swal from 'sweetalert2';
import { ManageWindowSvcDetailsComponent } from '../manage-window-svc-details/manage-window-svc-details.component';

declare var $;

@Component({
  selector: 'app-manage-window-svc-list',
    templateUrl: './manage-window-svc-list.component.html',
    styleUrls: ['./manage-window-svc-list.component.scss']
})
export class ManageWindowSvcListComponent implements OnInit {
 //  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('dataTable') table: ElementRef;
  
  dataTable: any;

  editing = {};
  //rows: any; // = [];
  //temp = [];



  rows = [];
  columns = [];
  temp = [];

  



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

  btnActionApprove = 'Approve';
  displayloader = false;
  lblProcess = '';
  retryService: number =  GenModel.retryService;
  retryMessage: any;
  retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
  internetConMsg = GenModel.internetConMsg;
  RetryAttmMsg = GenModel.RetryAttmMsg;

  pageLmit = GenModel.pageLmit;
  
  searchUserColumns: any;
  ItemsPerPage: any;
  columnId: any 
  statusTrack: any;
  errorOccur = GenModel.errorOccur;

   current_page = 1;

   tempList = [

         {
          Id: 1,
          conName: 'Live Zenbase',
          server: '127.0.0.1',
          dbName: 'testing',
          dateCreated: '2020-04-06',
          status: 'Active'
        }
      
   ]

   searchUserColumns1 = [
    {
      id: 1,
      columnName: 'CONNECTION NAME'

    },
    {
      id: 2,
      columnName: 'SERVER Name'

    },
    {
      id: 3,
      columnName: 'DATABASE NAME'

    },
    {
      id: 4,
      columnName: 'Date Created'

    },
    {
      id: 5,
      columnName: 'STATUS'

    }
];


origMobile = [];
  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public _GeneralService: GeneralService,private _localStorageService: LocalStorageService) 
    {
    this.settings = this.appSettings.settings; 
  }



  ngOnInit() 
  {
      this.searchUserColumns = this.searchUserColumns1;
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;

      this.load();

      // this.onSubmit();
   
  }

  onSubmit(): any {

   let url = 'BankServiceSetup/login';

   let  values =
      {
        "userId": 0,
        "fullName": "string",
        "loginId": "string",
        "isFirstLogin": true,
        "isSupervisor": "string",
        "loggedOn": true,
        "roleId": 0,
        "deptId": 0,
        "branchNo": 0,
        "passwordExpiryDate": "2020-05-08T18:55:32.859Z",
        "status": "string",
        "branchName": "string",
        "roleName": "string",
        "emailAddress": "string",
        "mobileNo": "string",
        "enforcePswdChange": "string",
        "createdBy": 0,
        "dateCreated": "2020-05-08T18:55:32.859Z",
        "password": "string",
        "loginstatus": 0,
        "lockcount": 0,
        "logincount": 0,
        "useCbsAuth": "string",
        "canPrintStatement": "string",
        "canPrintBidSecurity": "string",
        "canPrintRefLetter": "string",
        "canPrintBond": "string",
        "canPrintTradeRef": "string",
        "canPrintOD": "string",
        "canReverse": "string",
        "dataSources": "string",
        "authUser": "string",
        "canApprove": "string",
        "rsmId": 0
      }
    
  console.log('onSubmit values: ', values);
    
    
    this.displayloader = true;
   

      this._GeneralService.homePage(values, url)      
      // .retryWhen((err) => {
    
      //   return err.scan((retryCount) =>  {

      //     retryCount  += 1;
      //     if (retryCount < this.retryService) {

      //         this.btnlogtxt = 'Authenticating...'; 

      //         return retryCount;
      //     }
      //     else 
      //     {
      //       Swal('', 'Problem with your Login. Kindly contact System Administrator', 'error');
          
      //        throw(err);
      //     }
      //   }, 0).delay(this.retryDelayServiceInterval); 
      // })
    .subscribe((data: any) => {

            
               
               
        },
        (error: any) => {
          
         
     


        

        });
    
  }

  load(): void {
   

   
    this._GeneralService.get('BankServiceSetup/GetAll')
    
    .retryWhen((err) => {
    
      return err.scan((retryCount) =>  {

        retryCount  += 1;
        if (retryCount < this.retryService) {

            this.retryMessage = this.RetryAttmMsg; // #'  + retryCount;

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

       // console.log('BankServiceSetup data', data);
        this.loadPage = false;
        this.temp = data;
        this.rows = data;
      },
      (error: any) => { 

    });
 
   }



  select(row)
  {
    const objIndex = this.selectedRec.findIndex(obj => obj.id === row.id);
    if (objIndex > -1) 
    {
      this.selectedRec.splice(objIndex, 1);
    
    }
    else
    {
      this.selectedRec.push({ 
        id: row.id,
        email: row.email,
        status: row.email,
        partner_type: row.partner_type,
      });
    
    }

   

  }




   userAction(status: any) : any {
   // this.displayloader = true;
    if (this.selectedRec.length == 0){
        Swal('', 'Select User(s)', 'error');
        return;
    }
    this.statusTrack = status;
    let token = this._localStorageService.get(this.token);
  
    //let getSelect = new List<any>(this.rows).Where(c=> c.)

      for (let i = 0; i < this.selectedRec.length; i++) {

              let value =  
              {
                    email: this.selectedRec[i].email,
                    status: status   
              };

              
   // this.loadPage =  true;
   // this.lblProcess = 'Wait, Action in Progress...';
    this.loadPage  = true;   

    let url = `auth/authorize-user?token=` + token; 
    
    

    
    
    this._GeneralService.post(value, url).subscribe(
      (data: any) => {

        // this.displayloader =  false;
        this.loadPage  = false;   
        this.statusTrack = '';
        this.selectedRec = [];
      
      let msg =  'Action Completed Successfully!';
      Swal('', data.message, 'success');
        this.load();
       // this.btnActionApprove =  'Approve';
       
  
      },
      (error: any) => {
        
        
         this.displayloader =  false;
         this.loadPage =  false;

         Swal('', error.error.message, 'error');

      });

     }


   

   }

 



  updateFilter(event, value: any) {
    
    console.log('updateFilter:', value);

    if (value === 1) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.first_name.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
     
     // this.table.offset = 0;
    }

    if (value === 2) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.phone_number.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      
    
     // this.table.offset = 0;
    }

    if (value === 3) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.email.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
 

      
     // this.table.offset = 0;
    }

    if (value === 4) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.meter_number.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    

      
     // this.table.offset = 0;
    }
    if (value === 5) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.status.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    

     
     // this.table.offset = 0;
    }

  }


  action(actionName: any, record: any){
    
    this.loadPage = true;
     setTimeout(() => {
      this.loadPage = false;
      this.openDialog(actionName, record);
    }, 1000);
  }



   
  openDialog(action: any, record: any): void
   {

    let dialogRef = this.dialog.open(ManageWindowSvcDetailsComponent, {

      // width: '3500px',
      // height: '800px',
      // hasBackdrop: true,
      disableClose: true,
      // autoFocus: true,
      data: { actionName: action, record:  record},
      
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
