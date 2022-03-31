
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BankservicesetupDetailsComponent } from './../../../admin/bankServiceSetUp/bankservicesetup-details/bankservicesetup-details.component';
import { GenModel } from './../../../../model/gen.model';
import Swal from 'sweetalert2';
import { GeneralService } from './../../../../services/genservice.service';
import { Component, ViewChild, OnInit, ElementRef, Directive, Input, } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { List } from 'linqts';
import { WaitingDialog } from '../../../../services/services';
import { LocalStorageService } from 'angular-2-local-storage';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { admService } from '../../../../model/admService';
import { UserDetails } from '../../../../model/userDetails';
import * as XLSX from 'xlsx';
import { InstrumentApprovalDetailsComponent } from '../instrument-approval-details/instrument-approval-details.component';
import { InstrumentForm } from '../../../../model/instrumentForms.model';
import { ApgDetailsComponent } from '../../apg/apg-details/apg-details.component';
import { RejInstrumentComponent } from '../rej-instrument/rej-instrument.component';

declare var $;



@Component({
  selector: 'app-instrument-approval-list',
  templateUrl: './instrument-approval-list.component.html',
  styleUrls: ['./instrument-approval-list.component.scss']
})
export class InstrumentApprovalListComponent implements OnInit {

  @ViewChild('dataTable') table: ElementRef;

  dataTable: any;

  editing = {};

  rows: InstrumentForm[];
  columns = [];
  temp: InstrumentForm[];
  allInstrumet: admService[];
  current_page = 1;
  selectAllText: any;
  actionLoaderDismiss = false;
  actionLoaderUpdate = false;
  tabVlues = 1;
  selectedAll = false;

  count = 20;
  selected = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  dialogRef: any;
  public settings: Settings;
  dataRes: any;
  token = GenModel.tokenName;
  selectTransMsg = GenModel.selectTransMsg
  recordNotFoundMsg = GenModel.recordNotFoundMsg
  loadPage = true;
  addedworkflowList: any[] = [];

  selectedRec: any[] = [];

  btnActionApprove = 'Approve';
  displayloader = false;
  lblProcess = '';
  retryService: number = GenModel.retryService;
  retryMessage: any;
  retryDelayServiceInterval: number = GenModel.retryDelayServiceInterval;
  internetConMsg = GenModel.internetConMsg;
  RetryAttmMsg = GenModel.RetryAttmMsg;

  pageLmit = GenModel.pageLmit;
  btnConfirm = GenModel.btnConfirm;
  searchUserColumns: any;
  ItemsPerPage: any;
  columnId: any
  statusTrack: any;
  errorOccur = GenModel.errorOccur;

  selectedAllTrans = false;

  unAuthorized = false;


  tab1 = '';
  tab2 = '';



  coinwallet: string[] = ['wallet1', 'wallet2'];
  selectedwallet = this.coinwallet[0];


  origMobile = [];

  step = 'brown';

  apiIsDown = GenModel.apiIsDown;

  selectedCalss = 'selected nav-item cursorPointer';
  selectedCalss2 = 'selected nav-item cursorPointer';
  selectedCalss3 = 'selected nav-item cursorPointer';

  serviceId = 12;

  chargeSetup: any;
  assignRole: any
  menuId: any
  admService: admService;
  loderTimer = GenModel.LoderTimer;
  userDetails: UserDetails;
  userId: number;

  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public _GeneralService: GeneralService,
    private _localStorageService: LocalStorageService,
    private route: ActivatedRoute) {
    this.settings = this.appSettings.settings;

    let queryString = this.route.snapshot.params.mid;
    this.menuId = _GeneralService.menuId(queryString);
    //   console.log('**data param4', param4);
  }

  ngOnInit() {
    //console.log()

    this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    this.userDetails = this._GeneralService.getUserDetails();

    this.load(this.userDetails);

    this.swapTab(1);

  }



  load(param: any): void {

    console.log('load param', param);

    this.loadPage = true;


    let track = 0;
    let url = 'InstrumentApproval/GetAll';
    let val =
    {
      pdtCurrentDate: param.bankingDate,
      psBranchNo: param.branchNo,
      pnDeptId: param.deptId,
      pnGlobalView: 'N', // hard code will later get this from role Assing
      serviceId: this.serviceId,
      roleId: param.roleId,
      menuId: this.menuId,
      userId: this.userDetails.userId
    }



    console.log('token param load', val);

    this._GeneralService.post(val, url)
      // .retryWhen((err) => {

      //   return err.scan((retryCount) =>  {

      //     retryCount  += 1;
      //     track = retryCount;
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
        (data: any) => {
          console.log('data batch control: ', data);

          this.loadPage = false;
          this.temp = data._response;
          this.rows = data._response;
          this.admService = data.admService;
          this.allInstrumet = data.getAllInstrument;
          this.userId = this.userDetails.userId;


          this.assignRole = data.roleAssign;

          if (data._response.length > 0) {
            this.rows = data._response.slice(0, this.pageLmit);
            this.changePage(this.current_page);
          }
        },
        (error: any) => {

          console.log('error loading: ', error);

          if (track === this.retryService) {
            Swal('', this.apiIsDown, 'error');
          }
          else {
            Swal('', this.errorOccur, 'error');

          }
        });
  }

  loadFileUpload(param: any): void {

    // console.log('load param upload', param);

    this.loadPage = true;


    let track = 0;
    let url = 'BatchControlFileUpload/GetAll';


    let val =
    {
      pdtCurrentDate: param.bankingDate,
      psBranchNo: param.branchNo,
      pnDeptId: param.deptId,
      pnGlobalView: 'N', // hard code will later get this from role Assing
      serviceId: this.serviceId,
      roleId: param.roleId,
      menuId: this.menuId
    }



    console.log('token param upload load', val);

    this._GeneralService.post(val, url)
      // .retryWhen((err) => {

      //   return err.scan((retryCount) =>  {

      //     retryCount  += 1;
      //     track = retryCount;
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
        (data: any) => {
          console.log('data batch upload control: ', data);
          this.loadPage = false;
          this.temp = data._response;
          this.rows = data._response;
          this.admService = data.admService;

          this.chargeSetup = data.charge;
          this.loadPage = false;

          this.assignRole = data.roleAssign;

          if (data._response.length > 0) {
            this.rows = data._response.slice(0, this.pageLmit);
            this.changePage(this.current_page);
          }
        },
        (error: any) => {

          console.log('error loading: ', error);

          if (track === this.retryService) {
            Swal('', this.apiIsDown, 'error');
          }
          else {
            Swal('', this.errorOccur, 'error');

          }
        });
  }


  // From BElow is the Pagination on Mobile ///

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




  select(row) {
    console.log('selected row', row);

    let valRe = new List<any>(this.rows).FirstOrDefault(c => c.itbid === row.itbId);

    if (row.serviceStatus === "Unauthorized") {
      swal('', 'This request has already been Processed', 'error')
      return;
    }

    const objIndex = this.selectedRec.findIndex(obj => obj.itbId === row.itbId);

    if (objIndex > -1) {
      this.selectedRec.splice(objIndex, 1);
    }
    else {
      this.selectedRec.push({
        itbId: row.itbId,
        acctName: row.acctName,
        acctNo: row.acctNo,
        acctType: row.acctType,
        branchName: row.branchName,
        ccyCode: row.ccyCode,
        chgAcctNo: row.chgAcctNo,
        datecreated: row.datecreated,
        recordDate: row.recordDate,
        referenceNo: row.referenceNo,
        select: row.select,
        serialNo: row.serialNo,
        serviceId: row.serviceId,
        serviceStatus: row.serviceStatus,
        transactionDate: row.transactionDate,
        userId: row.userId,
        userName: row.userName,

      });
    }

    console.log('selected this.selectedRec', this.selectedRec);
  }



  selectAll() {

    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i].select = this.selectedAllTrans;
    }
  }



  userAction(status: any): any {
    // this.displayloader = true;
    if (this.selectedRec.length == 0) {
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
      this.loadPage = true;

      let url = `auth/authorize-user?token=` + token;


      this._GeneralService.post(value, url).subscribe(
        (data: any) => {

          // this.displayloader =  false;
          this.loadPage = false;
          this.statusTrack = '';
          this.selectedRec = [];

          let msg = 'Action Completed Successfully!';
          Swal('', data.message, 'success');
          let getUserDetails = this._GeneralService.getUserDetails();
          this.load(getUserDetails);
          // this.btnActionApprove =  'Approve';


        },
        (error: any) => {


          this.displayloader = false;
          this.loadPage = false;

          Swal('', error.error.message, 'error');

        });

    }




  }


  updateFilter(event, value: any) {
    let temp1 = this.temp;
    if (value === 'RefNo') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.referenceNo.toString().toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }

    if (value === 'serviceType') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.serviceDescription.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'acctNo') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.acctNo.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }

    if (value === 'acctType') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.acctType.toString().toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'amount') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.amount.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }

    if (value === 'ccy') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.ccyCode.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'status') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.instrumentStatus.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }

    if (value === 'dept') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.deptName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 'userName') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.userName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }

    if (value === 'origBranch') {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.origBranchName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }

    // if (this.rows.length === 0) {
    //   //swal('', this.recordNotFoundMsg, 'error');

    //   this.rows = temp1;

    // }

  }


  action(actionName: any, record: any) {


    this.loadPage = true;
    setTimeout(() => {
      this.loadPage = false;
      this.View(actionName, record, '')

    }, this.loderTimer);
  }

  View(action: any, record: any, createdBy: any): void {
    
    console.log('View ', record)

    let dialogRef = this.dialog.open(ApgDetailsComponent, {

      // width: '1500px',
      height: '650px',
      // hasBackdrop: true,
      disableClose: true,
      // autoFocus: true,
      data: {
        actionName: action, record: record, createdBy: createdBy,
        chargeSetup: this.chargeSetup, serviceId: this.serviceId,
        serviceName: record.serviceDescription, admService: this.admService, itbId: record.itbId,
        userId: this.userId
      },

    });

    dialogRef.afterClosed().subscribe(result => {

      if (result === 'Y') {

        this.load(this.userDetails);
        this.loadFileUpload(this.userDetails);
      }

    });
  }



  openDialog(action: any, record: any): any {

    console.log('openDialog record', record);

    let url = 'Users/GetUserById';
    let val =
    {
      UserId: record.userId
    }

    this._GeneralService.post(val, url)
      .subscribe(
        (data: any) => {
          this.View(action, record, data.fullName)


        },
        (error: any) => {



        });
  }

  swapTab(value) {
    console.log('swapTab: ', value);

    if (value === 1) {
      this.tab1 = 'active';
      this.tab2 = '';
      this.load(this.userDetails);

    }
    if (value === 2) {
      this.tab1 = '';
      this.tab2 = 'active';

      this.loadFileUpload(this.userDetails);
    }

    this.tabVlues = value;
  }

  public onOptionsSelected(event) {
    // console.log('onOptionsSelected', event);
    this.pageLmit = event.target.value;
    console.log('pageLimit: ', this.pageLmit);

    this.rows = this.temp.slice(0, this.pageLmit);

    console.log('allRow: ', this.rows);


    this.changePage(this.current_page);
  }

  processTrans(): void {

    let getSelected = new List<any>(this.rows).Where(c => c.serviceStatus !== 'Unauthorized' && c.select === true).ToArray();

    if (getSelected.length === 0) {

      Swal('', this.selectTransMsg, 'warning');

      return;
    }

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement>document.getElementById("btnProcess");

    element.disabled = true;
    console.log('this.selectedRec: ', this.selectedRec);

    let url = 'Token/ProcessList';

    let userDetails = this._GeneralService.getUserDetails();

    console.log('userDetails: ', userDetails);


    let val = {
      ListOprTokenDTO: getSelected,
      serviceId: this.serviceId,
      loginUserName: userDetails.userName,
      deptId: userDetails.deptId,
      userId: userDetails.userId,
    }

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {
        element.disabled = false;
        this.actionLoaderUpdate = false;

        let getUserDetails = this._GeneralService.getUserDetails();
        console.log('getUserDetails token', getUserDetails)
        this.load(getUserDetails);


        Swal('', data.sErrorText, 'success');
      },
      (error: any) => {

        element.disabled = false;
        this.actionLoaderUpdate = false;

        Swal('', error.error.message, 'error');
      });


  }

  dismissTrans(): void {

    let getSelected = new List<any>(this.rows).Where(c => c.serviceStatus !== 'Unauthorized' && c.select === true).ToArray();

    if (getSelected.length === 0) {

      Swal('', this.selectTransMsg, 'warning');

      return;
    }



    Swal({
      title: '',
      text: 'Are you sure you want Dismiss the Selected Request? ',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'YES',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'NO'
    }).then((result) => {
      if (result.value) {

        this.actionLoaderDismiss = true;
        let element = <HTMLInputElement>document.getElementById("btnDismiss");

        element.disabled = true;
        console.log('this.selectedRec: ', this.selectedRec);

        let url = 'Token/DismissList';

        let userDetails = this._GeneralService.getUserDetails();

        console.log('userDetails: ', userDetails);


        let val = {
          ListOprTokenDTO: getSelected,
          serviceId: this.serviceId,
          loginUserName: userDetails.userName,
          deptId: userDetails.deptId,
          userId: userDetails.userId,
        }

        this._GeneralService.post(val, url).subscribe(
          (data: any) => {
            element.disabled = false;
            this.actionLoaderDismiss = false;

            let getUserDetails = this._GeneralService.getUserDetails();
            console.log('getUserDetails token', getUserDetails)
            this.load(getUserDetails);


            Swal('', data.sErrorText, 'success');
          },
          (error: any) => {

            element.disabled = false;
            this.actionLoaderDismiss = false;

            Swal('', error.error.message, 'error');
          });



      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });


  }


  radio(event) {
    console.log('radio', event.value)

    if (event.value === 'All') {
      let UnAuth = new List<any>(this.temp).Where(c => c.itbId > 0).ToArray();
      this.rows = UnAuth.slice(0, this.pageLmit);
    }
    if (event.value === 'Processed') {

      let proc = new List<any>(this.temp).Where(c => c.serviceStatus === "Unauthorized").ToArray();
      this.rows = proc.slice(0, this.pageLmit);
    }


    console.log('this.rows: ', this.rows)


    this.changePage(this.current_page);

  }

  approveInstrument(): void {
    let getSelected = new List<InstrumentForm>(this.rows).Where(c => c.select === true).ToArray();
    console.log('approveInstrument getSelected', getSelected);
    let get: InstrumentForm[];
    let tem = [];
    for(let i = 0; i < getSelected.length; i++){
      

      tem.push({
        itbId: getSelected[i].itbId,
        ServiceId: getSelected[i].serviceId,
      });
    }

    

  

  
    if (getSelected.length === 0) {

      Swal('', this.selectTransMsg, 'warning');

      return;
    }
    Swal({

      title: '',
      text: 'Are you Sure you want to Approve the Selected Transaction(s)?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'Cancel'

    }).then((result) => {

      if (result.value) {

        this.loadPage = true;
        this.actionLoaderUpdate = true;
        let element = <HTMLInputElement>document.getElementById("btnApproveInstr");

        element.disabled = true;
        console.log('this.selectedRec: ', this.selectedRec);

        let url = 'InstrumentApproval/ApproveInstrumentTrans';



        let val =
        {
          ListOprInstrument: tem ,//getSelected,
          loginUserName: this.userDetails.userName,
          LoginUserId: this.userDetails.userId,
          TransactionDate: this.userDetails.bankingDate,
        }

        console.log('app instrument: ', val);

        this._GeneralService.post(val, url).subscribe(
          (data: any) => {
            element.disabled = false;
            this.actionLoaderUpdate = false;
            this.loadPage = false;

            let getUserDetails = this._GeneralService.getUserDetails();

            this.load(getUserDetails);

            if(data.responseCode == 0)
              Swal('', data.responseMessage, 'success');
            else
              Swal('', data.responseMessage, 'error');
          },
          (error: any) => {

            this.loadPage = false;
            element.disabled = false;
            this.actionLoaderUpdate = false;

            console.log('error 11: ', error.error);
            console.log('error 22: ', error.error.responseMessage);
            console.log('error responseMessage1: ', error.responseMessage);

            Swal('', error.error.responseMessage, 'error');
          });
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });


  }
  rejectInstrument(): void {
    let getSelected = new List<InstrumentForm>(this.rows).Where(c => c.select === true).ToArray();

    if (getSelected.length === 0) {

      Swal('', this.selectTransMsg, 'warning');

      return;
    }
    Swal({

      title: '',
      text: 'Are you Sure you want to Approve the Selected Transaction(s)?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'Cancel'

    }).then((result) => {

      if (result.value) {

        this.loadPage = true;
        this.actionLoaderUpdate = true;
        let element = <HTMLInputElement>document.getElementById("btnApproveInstr");

        element.disabled = true;
        console.log('this.selectedRec: ', this.selectedRec);

        let url = 'InstrumentApproval/RejectInstrumentTrans';



        let val =
        {
          ListOprInstrument: getSelected,
          loginUserName: this.userDetails.userName,
          LoginUserId: this.userDetails.userId,
          TransactionDate: this.userDetails.bankingDate,
        }

        console.log('app instrument: ', val);

        this._GeneralService.post(val, url).subscribe(
          (data: any) => {
            element.disabled = false;
            this.actionLoaderUpdate = false;
            this.loadPage = false;

            let getUserDetails = this._GeneralService.getUserDetails();
            console.log('getUserDetails token', getUserDetails)
            this.load(getUserDetails);


            Swal('', data.responseMessage, 'success');
          },
          (error: any) => {

            this.loadPage = false;
            element.disabled = false;
            this.actionLoaderUpdate = false;

            console.log('error 11: ', error.error);
            console.log('error 22: ', error.error.responseMessage);
            console.log('error responseMessage1: ', error.responseMessage);

            Swal('', error.error.responseMessage, 'error');
          });
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });


  }

  downloadFormat() {
    let data = [];

    for (let i = 1; i < 7; i++) {
      let drOrCr = i > 3 ? 'CR' : 'DR';
      let tranCode = i > 3 ? '101' : '152';
      data.push({
        'A/C No': `${601010001}${i}`,
        'A/C Type ': 'CA',
        'DR/CR': drOrCr,
        'Amount': 5000,
        'Currency': 'GMD',
        'Narration': 'Transfer Narration',
        'Chq No': 200,
        'TranCode': tranCode,
        'Value Date': 'dd/MM/yyyy',
        'ReferenceNo': null
      });
    }


    this._GeneralService.exportAsExcelFile1(data, 'BulkPaymentUploadFormat');
  }

  openRejectionReason(): void {
    let getSelected = new List<any>(this.rows).Where(c => c.select === true).ToArray();

    if (getSelected.length === 0) {

      Swal('', this.selectTransMsg, 'warning');

      return;
    }
    Swal({
      title: '',
      text: 'Are you sure you want reject the selected request(s)? ',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'YES',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'NO'
    }).then((result) => {
      if (result.value) {

   
      
        let dialogRef = this.dialog.open(RejInstrumentComponent, {
          width: '600px',
          height: '600px',
          // hasBackdrop: true,
          // autoFocus: true,
          disableClose: true,
          data: { getSelected: getSelected },

        });
        dialogRef.afterClosed().subscribe(result => {

          if (result === undefined) {
            return;
          }

          this.loadPage = true;
          if (result.length > 0) {
            this.reject(result);
          }


        });



      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });
  
  
  }


  reject(result): void {

    let getSelected = new List<InstrumentForm>(this.rows).Where(c => c.select === true).ToArray();

    if (getSelected.length === 0) {

      Swal('', this.selectTransMsg, 'warning');

      return;
    }

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement>document.getElementById("btnRejectInstrument");

    element.disabled = true;
   

    let url = 'InstrumentApproval/RejectInstrument';

    console.log('getSelected: ', getSelected);


    let tem = [];
    for (let i = 0; i < getSelected.length; i++) {


      tem.push({
        itbId: getSelected[i].itbId,
        ServiceId: getSelected[i].serviceId,
      });
    }

    let val =
    {
      ListOprInstrument: tem,
      loginUserName: this.userDetails.userName,
      userId: this.userDetails.userId,
      listRejectionReasonDTO: result,
      LoginUserId: this.userDetails.userId
    }

    console.log('Reject: ', val);

    this.loadPage = true;

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {
        element.disabled = false;
        this.actionLoaderUpdate = false;
        this.loadPage = false;
        this.load(this.userDetails);

        Swal('', data.responseMessage, 'success');

      },
      (error: any) => {
        console.log('Reject error: ', error);
        element.disabled = false;
        this.actionLoaderUpdate = false;
        this.loadPage = false;
        Swal('', error.error.responseMessage, 'error');
      });
  }

  getByServiceId(event) {

    let tm = new List<InstrumentForm>(this.temp).Where(c => c.serviceId == event.target.value).ToArray();
    console.log('getByServiceId tm: ', tm);

    this.rows = tm;
  }

}

