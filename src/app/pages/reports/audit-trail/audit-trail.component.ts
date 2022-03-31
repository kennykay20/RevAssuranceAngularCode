import { FormGroup, FormBuilder } from '@angular/forms';

import { GenModel } from './../../../model/gen.model';
import Swal from 'sweetalert2';
import { GeneralService } from './../../../services/genservice.service';
import { Component, ViewChild, OnInit, ElementRef, Directive, Input, } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { List } from 'linqts';
import { WaitingDialog } from '../../../services/services';
import { LocalStorageService } from 'angular-2-local-storage';
import swal from 'sweetalert2';
import { ArmortizationParam } from '../../../model/ArmortizationParam.model';
import { auditTrailDTO } from '../../../model/auditTrailDTO.model';
import { UserDetails } from '../../../model/userDetails';
// import { ExecuteScriptsDetailsComponent } from '../execute-scripts-details/execute-scripts-details.component';

declare var $;

@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.scss']
})
export class AuditTrailComponent implements OnInit {
  //  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('dataTable') table: ElementRef;

  dataTable: any;

  editing = {};
  //rows: any; // = [];
  //temp = [];

  totalRec = 0;


  columns = [];






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
  script: string;
  selectedRec: any[] = [];

  btnActionApprove = 'Approve';
  displayloader = false;
  lblProcess = '';
  retryService: number = GenModel.retryService;
  retryMessage: any;
  retryDelayServiceInterval: number = GenModel.retryDelayServiceInterval;
  internetConMsg = GenModel.internetConMsg;
  RetryAttmMsg = GenModel.RetryAttmMsg;

  pageLmit = 100; //GenModel.pageLmit;

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

  armortizationParam: ArmortizationParam;

  basicForm: FormGroup;

  users = [];
  rows: auditTrailDTO[]
  temp: auditTrailDTO[]
  userDetails: UserDetails;

  origMobile = [];
  constructor(
    public appSettings: AppSettings,
    public dialog: MatDialog,
    public fb: FormBuilder,
    public _GeneralService: GeneralService,
    private _localStorageService: LocalStorageService) {
    this.settings = this.appSettings.settings;
  }
  ngOnInit() {

    this.loadUsers();
    this.searchUserColumns = this.searchUserColumns1;
    this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    this.userDetails = this._GeneralService.getUserDetails();

    this.armortizationParam = new ArmortizationParam();

    this.armortizationParam.pdtStartDate = this.userDetails.bankingDate;
    this.armortizationParam.pdtEndDate = this.userDetails.bankingDate


    this.rows = [];


  }



  loadUsers(): void {

    this.loadPage = true;
    let track = 0;
    let url = 'Users/GetAll';


    let val =
    {
      AId: 1,
    }



    this._GeneralService.post(val, url)
      .retryWhen((err) => {

        return err.scan((retryCount) => {

          retryCount += 1;
          track = retryCount;
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

          this.users = data._response;
          console.log('this.users** ', this.users);
          this.loadPage = false;

        },
        (error: any) => {
          if (track === this.retryService) {

          }
          else {
            Swal('', this.errorOccur, 'error');

          }
        });
  }

  execute(): void {


    let url = 'Reports/AuditTrail'


    // param.Add("@pdtFromDate", AnyAuth.);
    // param.Add("@pdtToDate", AnyAuth.);
    // param.Add("@pnUserId", AnyAuth.);
    // param.Add("@psTableName", AnyAuth.);
    let obj =
    {
      FromDate: this.armortizationParam.effectiveDate,
      ToDate: this.armortizationParam.expiryDate,
      UserId: this.armortizationParam.pnUserId,
      TableName: null
    }
    console.log('obj:', obj);

    this.loadPage = true;
    this._GeneralService.post(obj, url)
      .subscribe(
        (data: any) => {

          this.temp = data;
          this.totalRec = this.temp.length;

          if (data.length > 0) {

            this.rows = data.slice(0, this.pageLmit);
            this.changePage(this.current_page);
          }
          this.loadPage = false;

        },
        (error: any) => {

          this.loadPage = false;

          Swal('', error.error.responseMessage, 'error');

        });
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




  fromDate(event) {

    this.armortizationParam.pdtStartDate = this._GeneralService.dateconvertion(event.target.value);


  }

  toDate(event) {

    this.armortizationParam.pdtEndDate = this._GeneralService.dateconvertion(event.target.value);


  }

  download() {

    let arr = [];

    for (let i = 0; i < this.temp.length; i++) {

      arr.push({

        'FULL NAME': this.temp[i].userFullName != null ? this.temp[i].userFullName : '',
        'EVENT DATE': this.temp[i].eventdateutc != null ? this._GeneralService.dateconvertion(this.temp[i].eventdateutc) : '',
        'EVENT TYPE': this.temp[i].eventtype != null ? this.temp[i].eventtype : '',
        'TABLE NAME': this.temp[i].tablename != null ? this.temp[i].tablename : '',
        'RECORD ID': this.temp[i].recordid != null ? this.temp[i].recordid : '',
        'ORIGINAL VALUE': this.temp[i].originalvalue != null ? this.temp[i].originalvalue : '',
        'NEW VALUE': this.temp[i].newvalue != null ? this.temp[i].newvalue : '',


      });
    }


    this._GeneralService.exportAsExcelFile1(arr, `AuditTrail-${this.armortizationParam.pdtStartDate}-${this.armortizationParam.pdtEndDate}`);

  }

}

