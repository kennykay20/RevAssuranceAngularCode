import { FormGroup, FormBuilder } from '@angular/forms';

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
import { ExecuteScriptsDetailsComponent } from '../execute-scripts-details/execute-scripts-details.component';

declare var $;

@Component({
  selector: 'app-execute-scripts-list',
  templateUrl: './execute-scripts-list.component.html',
  styleUrls: ['./execute-scripts-list.component.scss']
})
export class ExecuteScriptsListComponent implements OnInit {
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
  loadPage = false;
  addedworkflowList: any[] = [];
  script : string;
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

basicForm: FormGroup;

origMobile = [];
  constructor(public appSettings: AppSettings, 
              public dialog: MatDialog,
              public fb: FormBuilder,
              public _GeneralService: GeneralService,
              private _localStorageService: LocalStorageService) 
    {
        this.settings = this.appSettings.settings; 
    }
  ngOnInit() 
  {
      this.searchUserColumns = this.searchUserColumns1;
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;
      this.ItemsPerPage = this._GeneralService.ItemsPerPage;

      this.basicForm = this.fb.group({
        script: null,
      });
  }

  execute(): void {
    console.log('execute this.basicForm.value.script ', this.basicForm.value.script);
    if(this.basicForm.value.script === undefined )
    {
      Swal('', 'Kindly Supply the Scripts to be Executed!', 'error');
      return;
    }

    let scriptcck: string = this.basicForm.value.script;
    
    if(scriptcck.toUpperCase().includes('SELECT'))
    {
      Swal('', `Select is not Allowed!`, 'error');
      return;
    }

    let url = 'Query/Execute'
    let obj = {
      query : this.basicForm.value.script
    }
    console.log('obj:', obj);
    
    this.loadPage = true;
    this._GeneralService.homePage(obj, url)
   .subscribe(
      (data: any) => {

        console.log('excute data: ',data);
        Swal('', data.responseMessage, 'success');
        this.loadPage = false;
        
      },
      (error: any) => 
      { 
         this.loadPage = false;
         Swal('', error.error.responseMessage, 'error');
     
    });
  }

}
