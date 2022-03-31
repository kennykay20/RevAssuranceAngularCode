import { ActivatedRoute } from '@angular/router';
import { DepartmentDetailsComponent } from './../department-details/department-details.component';

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

declare var $;

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {
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
      columnName: 'DEPARTMENT NAME'

    },
    {
      id: 2,
      columnName: 'DEPARTMENT CODE'

    },
    {
      id: 3,
      columnName: 'STATUS'

    }
  ];

  roleAssign: any;
  menuId: any;
  origMobile = [];
  getUserDetails: any;
  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public _GeneralService: GeneralService,
    private _localStorageService: LocalStorageService,
    public route: ActivatedRoute, ) {
    this.settings = this.appSettings.settings;

    let routMenuId = this.route.snapshot.params.mid;

    this.menuId = this._GeneralService.menuId(routMenuId);

  }



  ngOnInit() {
    this.searchUserColumns = this.searchUserColumns1;
    this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    this.getUserDetails = this._GeneralService.getUserDetails();
    this.load(this.getUserDetails);
  }

  load(param: any): void {

    let url = 'Department/GetAll';
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

        return err.scan((retryCount) => {

          retryCount += 1;
          if (retryCount < this.retryService) {

            this.retryMessage = this.RetryAttmMsg; // #'  + retryCount;

            return retryCount;
          }
          else {
            this.retryMessage = this.errorOccur;
            throw (err);
          }
        }, 0).delay(this.retryDelayServiceInterval);
      }).subscribe(
        (data: any) => {

          console.log('dept data', data);
          this.loadPage = false;
          this.temp = data._response;
          this.rows = data._response;
          this.roleAssign = data.roleAssign

        },
        (error: any) => {

        });

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
          this.load(this.getUserDetails);
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

    console.log('updateFilter:', value);

    if (value === 1) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.deptname.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;


      // this.table.offset = 0;
    }

    if (value === 2) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.deptCode.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;


      // this.table.offset = 0;
    }

    if (value === 3) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.status.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;



      // this.table.offset = 0;
    }

    if (value === 4) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.hodName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;



      // this.table.offset = 0;
    }

    if (value === 5) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.hodEmail.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;



      // this.table.offset = 0;
    }

  }

  action(actionName: any, record: any) {

    this.loadPage = true;
    setTimeout(() => {
      this.loadPage = false;
      this.openDialog(actionName, record);
    }, 100);
  }

  openDialog(action: any, record: any): void {

    let dialogRef = this.dialog.open(DepartmentDetailsComponent, {

      // width: '3500px',
      height: '560px',
      // hasBackdrop: true,
      disableClose: true,
      // autoFocus: true,
      data: { actionName: action, record: record },

    });

    dialogRef.afterClosed().subscribe(result => {

      console.log('dept Close result', result);
      if (result == 'Y') {

        this.load(this.getUserDetails);
      }
    });
  }

}
