import { BranchDetailsComponent } from './../branch-details/branch-details.component';


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
import { UserDetails } from '../../../../model/userDetails';


declare var $;



@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit {
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
  retryService: number = GenModel.retryService;
  retryMessage: any;
  retryDelayServiceInterval: number = GenModel.retryDelayServiceInterval;
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
  userDetails: UserDetails
  menuId: number;
  origMobile = [];
  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public _GeneralService: GeneralService, private _localStorageService: LocalStorageService,
    private route: ActivatedRoute) {
   

    let queryString = this.route.snapshot.params.mid;
    this.menuId = _GeneralService.menuId(queryString);
  }



  ngOnInit() {
    this.searchUserColumns = this.searchUserColumns1;
    this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    this.userDetails = this._GeneralService.getUserDetails();
    this.load(this.userDetails);
  }

  load(param: any): void {

    this.loadPage = true;

    let url = 'Branch/GetAll';

    let val =
    {
      pdtCurrentDate: param.bankingDate,
      psBranchNo: param.branchNo,
      pnDeptId: param.deptId,
      pnGlobalView: 'N',
      serviceId: 0,
      userId: param.userId,
      menuId: this.menuId,
      roleId: param.roleId
    }

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {
        this.loadPage = false;
        this.temp = data._response;
        this.rows = data._response;
        this.loadPage = false;

      },
      (error: any) => {
        console.log('error branch', error);

        Swal('', error.message, 'error');

      });
  }

  select(row) {
    const objIndex = this.selectedRec.findIndex(obj => obj.id === row.id);
    if (objIndex > -1) {
      this.selectedRec.splice(objIndex, 1);
    }
    else {
      this.selectedRec.push({
        id: row.id,
        email: row.email,
        status: row.email,
        partner_type: row.partner_type,
      });

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
          this.load(this.userDetails);
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


    if (value === 1) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.branchCode.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    }

    if (value === 2) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.branchName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;



    }

    if (value === 3) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.dateCreated.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    }

    if (value === 4) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.status.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;
    }


  }


  action(actionName: any, record: any) {

    this.loadPage = true;
    setTimeout(() => {
      this.loadPage = false;
      if (record != '') {

        this.openDialog(actionName, record);
      }
      else {

        this.View(actionName, record, '')
      }

    }, 100);
  }

  View(action: any, record: any, createdBy: any): void {

    let dialogRef = this.dialog.open(BranchDetailsComponent, {
      width: '1000px',
      height: '500px',
      disableClose: true,
      data: { actionName: action, record: record, createdBy: createdBy },

    });

    dialogRef.afterClosed().subscribe(result => {

      if (result === 'Y') {
        this.load(this.userDetails);
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



}