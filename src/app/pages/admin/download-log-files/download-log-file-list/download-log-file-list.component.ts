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
import { DownloadLogFileDetailsComponent } from '../download-log-file-details/download-log-file-details.component';
import {DomSanitizer} from '@angular/platform-browser';
import { from } from 'rxjs/observable/from';
import { UserDetails } from '../../../../model/userDetails';
declare var $;

@Component({
  selector: 'app-download-log-file-list',
  templateUrl: './download-log-file-list.component.html',
  styleUrls: ['./download-log-file-list.component.scss']
})
export class DownloadLogFileListComponent implements OnInit {


  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }



  @ViewChild('dataTable') table: ElementRef;
  
  dataTable: any;

  editing = {};
  //rows: any; // = [];
  //temp = [];



  rows = [];
  columns = [];
  temp = [];

  
  selectedAllTrans =  false;


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

date: string;

roleAssign: any;
origMobile = [];
getUserDetails: any;
menuId: any;
userDetails: UserDetails;

  constructor(public appSettings: AppSettings, public dialog: MatDialog,
              public _GeneralService: GeneralService,
              private _localStorageService: LocalStorageService, 
              private sanitizer : DomSanitizer, public route: ActivatedRoute) 
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

    this.userDetails =  this._GeneralService.getUserDetails();
    this.load(this.userDetails);
   
  }

  public onOptionsSelected(event) {
    // console.log('onOptionsSelected', event);
    this.pageLmit = event.target.value;
    console.log('pageLimit: ', this.pageLmit);

    this.rows = this.temp.slice(0, this.pageLmit);

    console.log('allRow: ', this.rows);


    this.changePage(this.current_page);
  }

  search(){
    this.load(this.userDetails);
  }

  load(param: any): void {

    this.loadPage = true;

    let url = 'Log/GetAll';

    let val =
    {
      pdtCurrentDate: param.bankingDate,
      psBranchNo: param.branchNo,
      pnDeptId: param.deptId,
      pnGlobalView: 'N',
      serviceId: 0,
      menuId: this.menuId,
      roleId: param.roleId,
      date: this.date
    }

    console.log('post param load file:', val);

    this._GeneralService.post(val, url)
      .retryWhen((err) => {

        return err.scan((retryCount) => {

          retryCount += 1;
          if (retryCount < this.retryService) {

            this.retryMessage = this.RetryAttmMsg;

            return retryCount;
          }
          else {
            this.retryMessage = this.errorOccur;
            throw (err);
          }
        }, 0).delay(this.retryDelayServiceInterval);
      }).subscribe(
        (data: any) => {
          console.log('load files', data)
          this.loadPage = false;
         
         /* this.temp = data.log;
          this.rows = data.log;
          this.roleAssign = data.roleAssign
          this.loadPage = false;

          if (data.log > 0) {
            this.rows = data.log.slice(0, this.pageLmit);
            this.changePage(this.current_page);
          }
          */
          ////////


          this.temp = data.log;
          this.rows = data.log;

          if (this.rows.length > 0) {
            this.rows = data.log.slice(0, this.pageLmit);
            this.changePage(this.current_page);
            //this.showPagination = true;
          } else {

            //this.showPagination = false;

          }

        },
        (error: any) => {
          Swal('', error.message, 'error');
        });
  }

  selectedDate(event) {

    let val = this._GeneralService.dateconvertion(event.target.value);
    console.log('changeEffectdate1 val', val);

    this.date = val;

    
  }

fileResolver(path:any):string
{
  const reader = new FileReader();
  reader.onload = e =>{
    
  }
 // path = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL());
 return "";
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
    }, 100);
  }



   
  openDialog(action: any, record: any): void
   {

    let dialogRef = this.dialog.open(DownloadLogFileDetailsComponent, {

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

  updateFilter1(event, value: any) {
    
    let temp1   = this.temp;
  
    console.log('updateFilter1 serach: ', this.temp);
  
  if (value === 'fileName') {
    const val = event.target.value.toLowerCase();
  
    const temp = this.temp.filter(function(d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
  
    this.rows = temp;
  
   // this.table.offset = 0;
  }
  
  else if (value === 'fileDate') {
    const val = event.target.value.toLowerCase();
  
    const temp = this.temp.filter(function(d) {
      return d.date.toLowerCase().indexOf(val) !== -1 || !val;
    });
  
    this.rows = temp;

  }
  else
  {
    swal('','Record not found','error');
    this.rows = temp1;
    return;
  }
   
  
  
  }



  
  selectAll() {

    for (let i = 0; i < this.rows.length; i++) {

           
              this.rows[i].select =  this.selectedAllTrans;
           
           
        }

       console.log('selectAll this.rows: ', this.rows);

    }

    dynamicDownloadTxt() 
    {
      let getSelected = new List<any>(this.rows).Where(c=> c.select === true).ToArray();

      if(getSelected.length === 0){
    
        Swal('', 'Kindly Select Folder to download!', 'warning');
    
        return;
      }

      for (let i = 0; i < getSelected.length; i++) {

        this.loadPage = true; 
        let url = 'Log/Download';
         let val = {
          LogPath:  getSelected[i].path
         }
    this._GeneralService.post(val, url)
    // .retryWhen((err) => {
  
    //   return err.scan((retryCount) =>  {
  
    //     retryCount  += 1;
    //     if (retryCount < this.retryService) {
  
    //         this.retryMessage = this.RetryAttmMsg; 
  
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
      (data: any) => 
      {
        this.dyanmicDownloadByHtmlTag({
          fileName: getSelected[i].name,
          text: JSON.stringify(data)
        });
  
        this.loadPage = false; 
        
      },
      (error: any) => 
      {
        Swal('', 'Error Occured while Downloading', 'error');
        this.loadPage = false; 
    });

      }
    }

  
     dyanmicDownloadByHtmlTag(arg: {
      fileName: string,
      text: string
    }) {
      if (!this.setting.element.dynamicDownload) {
        this.setting.element.dynamicDownload = document.createElement('a');
      }
      const element = this.setting.element.dynamicDownload;
      const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
      element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
      element.setAttribute('download', arg.fileName);
  
      let event = new MouseEvent("click");
      element.dispatchEvent(event);
    }


  prevPage() {

    if (this.current_page > 1) {
      this.current_page--;
      this.changePage(this.current_page);
    }
  }

  nextPage() {

    if (this.current_page < this.numPages()) {
      this.current_page++;
      this.changePage(this.current_page);
    }
  }

  changePage(page) {
    let btn_next = document.getElementById("btn_next");
    let btn_prev = document.getElementById("btn_prev");
    // let listing_table = document.getElementById("listingTable");
    let page_span = document.getElementById("page");

    // Validate page
    if (page < 1) page = 1;

    if (page > this.numPages()) page = this.numPages();

    let tem = [];

    for (let i = (page - 1) * this.pageLmit; i < (page * this.pageLmit) && i < this.temp.length; i++) {
      tem.push(this.temp[i]);
    }

    this.rows = tem;

    page_span.innerHTML = page + "/" + this.numPages();

  }

  numPages() {
    return Math.ceil(this.temp.length / this.pageLmit);
  }

  onload = function () {
    this.changePage(1);
  };




}
