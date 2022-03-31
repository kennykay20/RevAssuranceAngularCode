import { Component, OnInit } from '@angular/core';
import { UserDetails } from '../../../model/userDetails';

import { GenModel } from './../../../model/gen.model';
import Swal from 'sweetalert2';

import { LocalStorageService } from 'angular-2-local-storage';
import { ArmortizationParam } from '../../../model/ArmortizationParam.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppSettings } from '../../../app.settings';
import { MatDialog } from '@angular/material';
import { GeneralService } from '../../../services/genservice.service';
import { Settings } from '../../../app.settings.model';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import * as XLSX from "xlsx";

@Component({
  selector: 'app-posting-transaction-rpt',
  templateUrl: './posting-transaction-rpt.component.html',
  styleUrls: ['./posting-transaction-rpt.component.scss']
})
export class PostingTransactionRptComponent implements OnInit {


  
  loadPage = false;
  selectedCalss = 'selected nav-item cursorPointer';

  tab1 = '';

  armortizationParam: ArmortizationParam;

  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  searchUserColumns: any;
  ItemsPerPage: any;
  dialogRef: any;
  public settings: Settings;

  displayloader = false;
  lblProcess = '';
  retryService: number = GenModel.retryService;
  retryMessage: any;
  retryDelayServiceInterval: number = GenModel.retryDelayServiceInterval;
  internetConMsg = GenModel.internetConMsg;
  RetryAttmMsg = GenModel.RetryAttmMsg;
  errorOccur = GenModel.errorOccur;

  totalRec = 0;
  
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

  users = [];
  rows: any[]
  temp: any[]
  userDetails: UserDetails;
  basicForm: FormGroup;
  current_page = 1;
  pageLmit = 100;

  constructor(
    public appSettings: AppSettings,
    public dialog: MatDialog,
    public fb: FormBuilder,
    public _GeneralService: GeneralService,
    private _localStorageService: LocalStorageService) 
    {
      this.settings = this.appSettings.settings;
    }

  ngOnInit() {
    this.loadUsers();
    this.searchUserColumns = this.searchUserColumns1;
    this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    this.userDetails = this._GeneralService.getUserDetails();
    //console.log('this.userDetails ', this.userDetails);
    
    this.armortizationParam = new ArmortizationParam();

    
    this.armortizationParam.pdtStartDate = this.userDetails.bankingDate;
    this.armortizationParam.pdtEndDate = this.userDetails.bankingDate
    this.armortizationParam.pnUserId = this.userDetails.userId;


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


    let url = 'Reports/Transaction'

    if (this.armortizationParam.pdtStartDate === null) {
      Swal('', 'Select Start Date', 'error');

      return;
    }

    if (this.armortizationParam.pdtEndDate === null) {
      Swal('', 'Select End Date', 'error');

      return;
    }

    // param.Add("@pdtFromDate", AnyAuth.);
    // param.Add("@pdtToDate", AnyAuth.);
    // param.Add("@pnUserId", AnyAuth.);
    // param.Add("@psTableName", AnyAuth.);
    let obj =
    {
      pdtStartDate: this.armortizationParam.pdtStartDate,
      pdtEndDate: this.armortizationParam.pdtEndDate,
      pnUserId: this.armortizationParam.pnUserId,
      
    }
    console.log('obj:', obj);

    this.loadPage = true;
    this._GeneralService.post(obj, url)
      .subscribe(
        (data: any) => {

          this.temp = data;
          this.totalRec = this.temp.length;
          //console.log("datas ", data._response);
          if (data._response.length > 0) {

            //console.log("this.pageLmit ", this.pageLmit);
            this.rows = data._response.slice(0, this.pageLmit);

            //console.log("this.rows ", this.rows);
            //this.changePage(this.current_page);
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

    console.log("this.temp.length ", this.temp.length);

    for (let i = (page - 1) * this.pageLmit; i < (page * this.pageLmit) && i < this.temp.length; i++) {
      tem.push(this.temp[i]);
    }

    console.log("tem ", tem);
    console.log("this.numPages() ", this.numPages());
    //this.rows = tem;

    page_span.innerHTML = page + "/" + this.numPages();

  }

  numPages() {
    return Math.ceil(this.temp.length / this.pageLmit);
  }

  onload = function () {
    this.changePage(1);
  };

  fromDate(event) {
    //console.log("event ", event)
    this.armortizationParam.pdtStartDate = this._GeneralService.dateconvertion(event.target.value);
  }

  toDate(event) {
    this.armortizationParam.pdtEndDate = this._GeneralService.dateconvertion(event.target.value);
    //console.log('this.armortizationParam.pdtEndDate ', this.armortizationParam.pdtEndDate);
  }

  downloadToExcel()
  {
      console.log("this.rows", this.rows);
      const workSheet = XLSX.utils.json_to_sheet(this.rows);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, "transactions")

      //buffer
      let buf = XLSX.write(workBook, {bookType:"xlsx", type:"binary"})
      //Binary string
      XLSX.write(workBook,{bookType:"xlsx", type:"binary"})
      //download
      XLSX.writeFile(workBook,"transactionSheet.xlsx");
  }

  downloadToPdf()
  {
      const doc = new jsPDF();
      doc.text("transaction details", 20, 10);
      autoTable(doc, { html: '#tableTransaction' })
      doc.save("table.pdf");
  }
}
