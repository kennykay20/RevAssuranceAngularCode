import { ActivatedRoute } from '@angular/router';
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
import { StatementChgDetailsComponent } from '../statement-chg-details/statement-chg-details.component';

declare var $;

@Component({
  selector: 'app-statement-chg-list',
  templateUrl: './statement-chg-list.component.html',
  styleUrls: ['./statement-chg-list.component.scss']
})
export class StatementChgListComponent implements OnInit {

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
  services = [];
  charges = [];

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
getUserDetails: any;
roleAssign: any;
origMobile = [];
menuId: any;
  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public _GeneralService: GeneralService,
    private _localStorageService: LocalStorageService,
    public route: ActivatedRoute,) 
    {
    this.settings = this.appSettings.settings; 
    let routMenuId = this.route.snapshot.params.mid;
      
    this.menuId = this._GeneralService.menuId(routMenuId);
  }



  ngOnInit() 
  {
      this.searchUserColumns = this.searchUserColumns1;
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;

      this.getUserDetails =  this._GeneralService.getUserDetails();
      this.load(this.getUserDetails);
      this.getServices();

  }

  load(param: any): void {
   
    let url = 'StatementChg/GetAll';
    let val = 
    {
      pdtCurrentDate: param.bankingDate,
      psBranchNo: param.branchNo,
      pnDeptId: param.deptId,
      pnGlobalView: 'N',
      serviceId: 0,
      menuId: this.menuId,
      roleId: param.roleId
    }
   
    this._GeneralService.post(val, url)
    
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

       // console.log('Tran config', data);
        this.loadPage = false;
        this.temp = data._response;
        this.roleAssign = data.roleAssign
        this.rows  =  data._response.slice(0, this.pageLmit);
        this.changePage(this.current_page);
      },
      (error: any) => { 

    });
 
   }

   getServiceName(id : number): string{
    if(id != null)
    {
     // console.log(`servv`, this.services)
      let serv  = this.services.find(p=>p.serviceId == id); 
      return serv.serviceDescription;
    }
    return "";
   
  }

   getServices():void{
    let url = 'Service/GetAllServices';
    let val = 
    {
      "menuId": 0,
      "pdtCurrentDate": "string",
      "psBranchNo": "string",
      "pnDeptId": "string",
      "roleId": 0,
      "loginUserRoleId": 0,
      "serviceId": 0,
      "userId": 0,
      "userItbId": 0,
      "fromDate": "string",
      "toDate": "string",
      "amount": "string"
    }
    //console.log(`this.services`)

    this._GeneralService.post(val, url)
    .subscribe(
      (data: any) => {
        this.loadPage = false;
        this.services = data._response;
        console.log(`this.gd`)
        console.log(this.services)
      },
      (error: any) => { 
    });
  }
 
   //f select(row)
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
        this.load(this.getUserDetails);
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
        return d.serviceId.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    
     
     // this.table.offset = 0;
    }

    if (value === 2) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.description.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      
     // this.table.offset = 0;
    }

    if (value === 3) {
      const val = event.target.value.toLowerCase();

      console.log("val ", val);
      console.log("val to string ", val.toString());
      console.log("this.temp ", this.temp);

      // const temp = this.temp.filter(function(d) {
      //   return d.cghAmount.match(val);
      // });

      const temp2 = this.temp.filter(function(d) {
        return d.cghAmount.toString().indexOf(val) !== -1 || !val;
      });

      //const temp1 = this.temp.filter(x => x.chgAmount === val);

      //console.log("temp1 ", temp1);
      this.rows = temp2;
 
     // this.table.offset = 0;
    }

    if (value === 4) {
      const val = event.target.value.toLowerCase();
    
      const temp = this.temp.filter(function(d) {
        return d.dateCreated.toLowerCase().indexOf(val) !== -1 || !val;
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
    }, 100);
  }



   
  openDialog(action: any, record: any): void
   {

    let dialogRef = this.dialog.open(StatementChgDetailsComponent, {

      // width: '3500px',
       height: '580px',
      // hasBackdrop: true,
       disableClose: true,
      // autoFocus: true,
      data: { actionName: action, record:  record},
      
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result ==="Y")
      {
          this.load(this.getUserDetails);
      }
    });
  }


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




   ///loading page
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

      for (let i = ( page - 1 ) * this.pageLmit; i < (page * this.pageLmit) && i < this.temp.length; i++) 
      {
          tem.push(this.temp[i]);
      }

      this.rows = tem;

      page_span.innerHTML = page + "/" + this.numPages();

  }

  numPages()
  {
      return Math.ceil(this.temp.length / this.pageLmit);
  }

  onload = function() {
    this.changePage(1);
  };
  /*Pagination ends here*/

  public onOptionsSelected(event) 
  {
   // console.log('onOptionsSelected', event);
    this.pageLmit = event.target.value;
    console.log('pageLimit: ', this.pageLmit);

    this.rows =  this.temp.slice(0, this.pageLmit);
    
    console.log('allRow: ', this.rows);


    this.changePage(this.current_page);    
 }


}
