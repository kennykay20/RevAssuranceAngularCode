import { PostTransDetailsComponent } from './../post-trans-details/post-trans-details.component';

import { RejReasonComponent } from './../../RejectionReason/rej-reason/rej-reason.component';
import { GenModel } from './../../../../model/gen.model';
import Swal from 'sweetalert2';
import { GeneralService } from './../../../../services/genservice.service';
import { Component, ViewChild, OnInit, ElementRef, Directive, Input, EventEmitter, Output, } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { List } from 'linqts';
import { WaitingDialog } from '../../../../services/services';
import { LocalStorageService } from 'angular-2-local-storage';
import swal from 'sweetalert2';
import { UserDetails } from '../../../../model/userDetails';
import { CbsTransaction } from '../../../../model/cbsTransaction.model';
import { ActivatedRoute } from '@angular/router';
import { PostTransResponse } from '../../../../model/PostTransResponse';
import { PostAlertComponent } from '../post-alert/post-alert.component';
declare var $;



@Component({
  providers: [PostAlertComponent],
  selector: 'app-post-trans-list',
  templateUrl: './post-trans-list.component.html',
  styleUrls: ['./post-trans-list.component.scss']
})
export class PostTransListComponent implements OnInit {

  @ViewChild('dataTable') table: ElementRef;


  @Output() myEvent = new EventEmitter();

  pageSize = '';
  dataTable: any;
  loderTimer = GenModel.LoderTimer;
  editing = {};
 
  rows: CbsTransaction[];
  columns = [];
  temp: CbsTransaction[];
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

  serviceId = 1;

  chargeSetup: any;
  PostTransCount: Number = 0;
  SeekAppCount: Number = 0;
  userDetails: UserDetails;
  menuId: any
  actionName = ''


  alertPostTrans = false;
  postTransResponse: PostTransResponse;

  postTransResponseList: PostTransResponse[];

  viewTransDetails = false;

  constructor(public appSettings: AppSettings,
    public dialog: MatDialog,
    public _GeneralService: GeneralService,
    private _localStorageService: LocalStorageService,
    private route: ActivatedRoute, private compAlert: PostAlertComponent) {
    this.settings = this.appSettings.settings;
    let queryString = this.route.snapshot.params.mid;
    this.menuId = _GeneralService.menuId(queryString);
  }

  ngOnInit() {
    // console.log()

    this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    this.userDetails = this._GeneralService.getUserDetails();

    this.load(this.userDetails);

    this.swapTab(1);
  }

  load(param: any): void {

    this.loadPage = true;
    let track = 0;
    let url = 'PostTrans/GetAll';

    let val =
    {
      pdtCurrentDate: param.bankingDate,
      psBranchNo: param.branchNo,
      pnDeptId: param.deptId,
      pnGlobalView: 'N',
      serviceId: this.serviceId,
      userId: param.userId,
      menuId: this.menuId,
      roleId: param.roleId
    }

    console.log('PostTrans param', val);

    this._GeneralService.post(val, url)

      /* .retryWhen((err) => {
     
         return err.scan((retryCount) =>  {
     
           retryCount  += 1;
           track = retryCount;
           if (retryCount < this.retryService) {
     
               this.retryMessage = this.RetryAttmMsg; 
     
               return retryCount;
           }
           else 
           {
             this.retryMessage = this.errorOccur;
              throw(err);
           }
         }, 0).delay(this.retryDelayServiceInterval); 
       })
       */
      .subscribe(
        (data: any) => {
          console.log('data post: ', data);
          this.loadPage = false;
          this.temp = data._response;
          this.rows = data._response;

          this.chargeSetup = data.charge;
          this.loadPage = false;

          let PostTrans = new List<any>(data._response).Where(c => c.limit == "Post").ToArray();

          let SeekApp = new List<any>(data._response).Where(c => c.limit == "SeekApp").ToArray();

          this.PostTransCount = PostTrans.length;
          this.SeekAppCount = SeekApp.length;
          if (this.PostTransCount > 0) {
            this.swapTab(1)
          }
          else if (this.SeekAppCount > 0) {
            this.swapTab(2)
          }

      
          if (PostTrans.length > 0) {

            this.rows = PostTrans.slice(0, this.pageLmit);
            this.changePage(this.current_page);
          }
          console.log(' this.rows: ', this.rows);

        },
        (error: any) => {
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

    this.pageSize = 'Page: ' + page + "/" + this.numPages();

  }

  numPages() {
    return Math.ceil(this.temp.length / this.pageLmit);
  }

  onload = function () {
    this.changePage(1);
  };

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


  updateFilter1(event, value: any) {

    let tmp1 = this.temp;

    if (value === 1) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.transactionDate.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

      // this.table.offset = 0;
    }

    if (value === 2) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.transTracer.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;


      // this.table.offset = 0;
    }

    if (value === 3) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.serviceName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;



      // this.table.offset = 0;
    }

    if (value === 4) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.drAcctNo.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
      //this.table.offset = 0;
    }
    if (value === 5) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.drAcctType.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 6) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.drAcctName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 7) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.drAcctTC.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }

    if (value === 8) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.amount.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }

    if (value === 9) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.crAcctChargeAmt.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }

    if (value === 10) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.ccyCode.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }

    if (value === 11) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.crAcctNo.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }

    if (value === 12) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.crAcctType.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }

    if (value === 13) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.crAcctName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 14) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.status.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 15) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.deptName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }
    if (value === 16) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.originatingBranchName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

    }


  }


  action(actionName: any, record: any) {
    //console.log('postrans  action66', record);
    //console.log('openToken  record.serviceId', record.serviceId);
    //console.log('postrans  actionName', actionName);
    this.loadPage = true;

    let rowsPostOrSeekApprove = new List<any>(this.rows).Where(c => c.transTracer === record.transTracer).ToArray();

    setTimeout(() => {
      this.loadPage = false;

      let dialogRef = this.dialog.open(PostTransDetailsComponent, {


        disableClose: true,
        data: {
          actionName: actionName, record: record, createdBy: 1,
          chargeSetup: this.chargeSetup,
          itbId: record.itbId,
          serviceId: record.serviceId,
          rowsPostOrSeekApprove: rowsPostOrSeekApprove
        },

      });

      dialogRef.afterClosed().subscribe(result => {

        if (result === 'Y') {
          let getUserDetails = this._GeneralService.getUserDetails();
          this.load(getUserDetails);
        }
      });
    }, this.loderTimer);
  }

  View(action: any, record: any, createdBy: any): void {
    //console.log('openToken  record', record);
    //console.log('openToken  record.serviceId', record.serviceId);
    if (record.serviceId === 1) {
      //this.openToken(action, record, createdBy);
      console.log('openToken View1');

      let dialogRef = this.dialog.open(PostTransDetailsComponent, {

        // width: '3500px',
        // height: '800px',
        // hasBackdrop: true,
        // autoFocus: true,
        disableClose: true,
        data: {
          actionName: action, record: record, createdBy: createdBy,
          chargeSetup: this.chargeSetup
        },
      });
      dialogRef.afterClosed().subscribe(result => {

        if (result === 'Y') {
          let getUserDetails = this._GeneralService.getUserDetails();
          this.load(getUserDetails);
        }
      });
    }

  }

  openToken(action: any, record: any, createdBy: any) {

    console.log('openToken star');

    let dialogRef = this.dialog.open(PostTransDetailsComponent, {

      // width: '3500px',
      // height: '800px',
      // hasBackdrop: true,
      // autoFocus: true,
      disableClose: true,
      data: { actionName: action, record: record, createdBy: createdBy, chargeSetup: this.chargeSetup },
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result === 'Y') {
        let getUserDetails = this._GeneralService.getUserDetails();
        this.load(getUserDetails);
      }
    });
  }

  openRejectionReason(): void {

    let getSelected = new List<any>(this.rows).Where(c => c.select === true).ToArray();

    if (getSelected.length === 0) {

      Swal('', this.selectTransMsg, 'warning');

      return;
    }
    let dialogRef = this.dialog.open(RejReasonComponent, {
      width: '600px',
      height: '600px',
      // hasBackdrop: true,
      // autoFocus: true,
      disableClose: true,
      // data: { actionName: action, record:  record, createdBy: createdBy, chargeSetup: this.chargeSetup},

    });
    dialogRef.afterClosed().subscribe(result => {

      if (result === undefined) {
        return;
      }

      console.log('result Selected Rejecteion', result);
      this.loadPage = true;
      if (result.length > 0) {
        this.reject(result);
      }


    });
  }

  openDialog(action: any, record: any): any {



    let url = 'Users/GetUserById';
    let val =
    {
      "aId": 0,
      "userName": "string",
      "password": "string",
      "dateCreated": "2020-05-12T12:08:01.854Z",
      UserId: record.userId
    }

    this._GeneralService.homePage(val, url)
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

      let PostTrans = new List<CbsTransaction>(this.temp).Where(c => c.limit == "Post").ToArray();

      console.log('PostTrans:', PostTrans)

      this.rows = PostTrans;
      this.actionName = 'PostTrans'

    }
    if (value === 2) {
      this.tab1 = '';
      this.tab2 = 'active';
      let SeekApp = new List<any>(this.temp).Where(c => c.limit == "SeekApp").ToArray();
      console.log(' SeekApp rec: ', SeekApp);
      this.SeekAppCount = SeekApp.length;
      this.rows = SeekApp;
      this.actionName = 'SeekAppTrans';
    }

    this.tabVlues = value;
  }

  public onOptionsSelected(event) {

    this.pageLmit = event.target.value;
    console.log('pageLimit: ', this.pageLmit);

    if (this.temp.length > 0) {

      this.rows = this.temp.slice(0, this.pageLmit);

      console.log('allRow: ', this.rows);

      this.changePage(this.current_page);
    }

  }

  post(): void {
    let getSelected = new List<any>(this.rows).Where(c => c.select === true).ToArray();

    if (getSelected.length === 0) {

      Swal('', this.selectTransMsg, 'warning');

      return;
    }

    let msgg =  `Are you Sure you want to Post the Selected ${getSelected.length } transaction(s)?`;

    
     Swal({
      title: '',
      text: msgg,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'Cancel'

    }).then((result) => {

      if (result.value) {
      
        this.loadPage = true;
        this.actionLoaderUpdate = true;
        let element = <HTMLInputElement>document.getElementById("btnProcess");
        
        element.disabled = true;
        this.alertPostTrans = false;
       
        let url = 'PostTrans/PostTrans';
       
        let userDetails = this._GeneralService.getUserDetails();

        let val =
        {
          ListCbsTransactionDTO: getSelected,
          loginUserName: userDetails.userName,
          userId: userDetails.userId,
        }

        console.log('val post: ', val);

        this._GeneralService.post(val, url).subscribe(
          (data: any) => {

            console.log('val post result: ', data);
            
            element.disabled = false;
            this.loadPage = false;
            let getUserDetails = this._GeneralService.getUserDetails();
            this.load(getUserDetails);
         

            this.postTransResponse = data;
            this.postTransResponseList = data.subtringClass;

            console.log('this.postTransResponse: ', this.postTransResponse);

            console.log('this.postTransResponse: ', this.postTransResponseList);

            this.closeAlertPostTrans();
               //Swal('', data.responseMessage, 'success');
          },
          (error: any) => {

            this.loadPage = false;
            element.disabled = false;
            this.actionLoaderUpdate = false;

            console.log('error post: ', error);
            console.log('error 22: ', error.error.responseMessage);
            console.log('error responseMessage1: ', error.responseMessage);

            Swal('', error.error.responseMessage, 'error');
          });
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });


  }


  dismiss(): void {
    let getSelected = new List<any>(this.rows).Where(c => c.select === true).ToArray();

    if (getSelected.length === 0) {

      Swal('', this.selectTransMsg, 'warning');

      return;
    }
    Swal({

      title: '',
      text: 'Are you Sure you want to Dismiss the Selected Transaction?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'Cancel'

    }).then((result) => {

      if (result.value) {

        this.loadPage = true;
        this.actionLoaderUpdate = true;
        let element = <HTMLInputElement>document.getElementById("btnProcess");

        element.disabled = true;
        console.log('this.selectedRec: ', this.selectedRec);

        let url = 'PostTrans/DismissTrans';

        let userDetails = this._GeneralService.getUserDetails();

        console.log('userDetails: ', userDetails);

        let val =
        {
          ListCbsTransactionDTO: getSelected,
          loginUserName: userDetails.userName,
          userId: userDetails.userId,
        }

        console.log('val approve: ', val);

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

  seekApprove(): void {
    let getSelected = new List<any>(this.rows).Where(c => c.select === true).ToArray();

    if (getSelected.length === 0) {

      Swal('', this.selectTransMsg, 'warning');

      return;
    }
    Swal({

      title: '',
      text: 'Are you Sure you want to Seek Approval for the Selected Transaction(s)?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'Cancel'

    }).then((result) => {

      if (result.value) {

        this.loadPage = true;

        let element = <HTMLInputElement>document.getElementById("btnPostSeekApp");

        element.disabled = true;
        console.log('this.selectedRec: ', this.selectedRec);

        let url = 'PostTrans/SeekApproval';

        let val =
        {
          ListCbsTransactionDTO: getSelected,
          loginUserName: this.userDetails.userName,
          userId: this.userDetails.userId,
          LoginUserId: this.userDetails.userId
        }

        console.log('val approve: ', val);

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

  reject(result): void {

    let getSelected = new List<any>(this.rows).Where(c => c.select === true).ToArray();

    if (getSelected.length === 0) {

      Swal('', this.selectTransMsg, 'warning');

      return;
    }

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement>document.getElementById("btnProcess");

    element.disabled = true;
    console.log('this.selectedRec: ', this.selectedRec);

    let url = 'ApproveTrans/RejectTrans';

    let userDetails = this._GeneralService.getUserDetails();

    console.log('userDetails: ', userDetails);


    let val =
    {
      ListCbsTransactionDTO: getSelected,
      loginUserName: userDetails.userName,
      userId: userDetails.userId,
      listRejectionReasonDTO: result
    }

    this.loadPage = true;

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {
        element.disabled = false;
        this.actionLoaderUpdate = false;

        let getUserDetails = this._GeneralService.getUserDetails();
        console.log('getUserDetails token', getUserDetails)
        this.load(getUserDetails);


        Swal('', data.sErrorText, 'success');
        this.loadPage = false;
      },
      (error: any) => {

        element.disabled = false;
        this.actionLoaderUpdate = false;
        this.loadPage = false;
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

  checkUnChecked(row: CbsTransaction) {
    for (let i of this.rows) {
      if (i.transTracer == row.transTracer)
        i.select = row.select;
    }
  }

  closeAlertPostTrans(){
    console.log('closeAlertPostTrans', this.alertPostTrans);
    if (this.alertPostTrans === false){
      console.log('closeAlertPostTran 1');
      this.alertPostTrans = true;
    }
    else if (this.alertPostTrans === true) {
      console.log('closeAlertPostTran 2');
      this.alertPostTrans = false;
    }

    this.viewTransDetails = false;
    
  }

}
