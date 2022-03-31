

import { Router, ActivatedRoute } from '@angular/router';

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
  selector: 'app-dashboard-role',
  templateUrl: './dashboard-role.component.html',
  styleUrls: ['./dashboard-role.component.scss']
})
export class DashboardRoleComponent implements OnInit {
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


  roleAssign: any;
  menuId: any;


  origMobile = [];
  constructor(public appSettings: AppSettings,
    public dialog: MatDialog,
    public _GeneralService: GeneralService,
    private _localStorageService: LocalStorageService,
    public router: Router, public route: ActivatedRoute) {
    this.settings = this.appSettings.settings;

    let routMenuId = this.route.snapshot.params.mid;
    console.log('**data param4', routMenuId);
    this.menuId = this._GeneralService.menuId(routMenuId);
    console.log('** this.menuId', this.menuId);
  }


  ngOnInit() {
    this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    let getUserDetails = this._GeneralService.getUserDetails();
    // console.log('getUserDetails token', getUserDetails)
    this.load(getUserDetails);

  }



  load(param: any): void {

    this.loadPage = true;

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

    let url = 'Roles/GetAll';

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

          console.log('roles data', data);
          this.loadPage = false;
          this.temp = data._response;
          this.rows = data._response;
          this.roleAssign = data.roleAssign
        },
        (error: any) => {

        });

  }



  assignRole(row) {
    localStorage.setItem('RoleId', row.roleId);
    this.router.navigate(['./adm/role-ass/mid=3433']);
  }

  assignDashboard(row) {
    localStorage.setItem('RoleId', row.roleId);
    this.router.navigate(['./adm/dashboard/mid=3433']);
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

    let tem1 = this.temp;

    console.log('updateFilter tem1:', tem1);

    if (value === 1) {
      const val = event.target.value.toLowerCase();

      console.log('vals ', val);
      //const indexVals = this.temp.findIndex(val);
      //console.log('indexVals ', indexVals);
      

      const temp = this.temp.filter(function (d) {
        return d.first_name.toLowerCase().indexOf(val) !== -1 || !val;
      });
      
      this.rows = temp;


      // this.table.offset = 0;
    }

    if (value === 2) {
      const val = event.target.value.toLowerCase();

      console.log('vals ', val);
      //const indexVals = this.temp.findIndex(val);
      //console.log('indexVals ', indexVals);

      const temp = this.temp.filter(function (d) {
        return d.phone_number.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;


      // this.table.offset = 0;
    }

    if (value === 3) {
      const val = event.target.value.toLowerCase();

      console.log('vals ', val);
      //const indexVals = this.temp.findIndex(val);
      //console.log('indexVals ', indexVals);

      const temp = this.temp.filter(function (d) {
        return d.roleName.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;



      // this.table.offset = 0;
    }


    if (value === 5) {
      const val = event.target.value.toLowerCase();

      //console.log('temp ', this.temp);
      const temp = this.temp.filter(function (d) {
        return d.creditLimit.indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

      // this.table.offset = 0;
    }
    if (value === 6) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.debitLimit.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

      // this.table.offset = 0;
    }

    if (value === 7) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.dateCreated.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

      // this.table.offset = 0;
    }
    if (value === 8) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.dateCreated.toLowerCase().indexOf(val) !== -1 || !val;
      });

      this.rows = temp;

      // this.table.offset = 0;
    }
    if (value === 9) {
      const val = event.target.value.toLowerCase();

      
      const temp = this.temp.filter(function (d) {
        return d.dateCreated.toLowerCase().indexOf(val) !== -1 || !val;
      });

      console.log('temp ', temp);
      this.rows = temp;

      // this.table.offset = 0;
    }
    if (value === 10) {
      const val = event.target.value.toLowerCase();

      const temp = this.temp.filter(function (d) {
        return d.status.toLowerCase().indexOf(val) !== -1 || !val;
      });

      console.log('temp111 status', temp);

      this.rows = temp;

      // this.table.offset = 0;
    }

    // if (this.rows.length === 0) {

    //   swal('', 'No record Found', 'warning');

    //   this.rows = tem1;
    // }

  }

  




}
