
import { Router } from '@angular/router';
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
  selector: 'app-dashboard-assign',
  templateUrl: './dashboard-assign.component.html',
  styleUrls: ['./dashboard-assign.component.scss']
})
export class DashboardAssignComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  dataTable: any;
  tabVlues = 1;
  actionLoaderSave: any;
  rowsMobile = [];
  rowsMobileTem = [];
  current_page = 1;
  apiIsDown = GenModel.apiIsDown;
  searchUserColumns: any;
  pageLmit = GenModel.pageLmit;
  ItemsPerPage: any;
  editing = {};
  rows: any[] = [];
  rows1: any[] = [];
  rows2: any[] = [];
  temp = [];
  count = 20;


  roleName: any;
  roleId: any;


  selected = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  columns = [
    { prop: 'name' },
    { name: 'Gender' },
    { name: 'Company' }
  ];
  dialogRef: any;
  public settings: Settings;
  dataRes: any;
  token = GenModel.tokenName;
  loadPage = true;
  addedworkflowList: any[] = [];

  selectedRec: any[] = [];
  selectedAllCanView: any;
  selectedAllCanView1: any;
  selectedAllCanView2: any;
  btnActionAssign = 'Assign';
  displayloader = false;
  displayloaderR = false;
  lblProcess = '';
  retryService: number = GenModel.retryService;
  retryMessage: any;
  retryDelayServiceInterval: number = GenModel.retryDelayServiceInterval;
  internetConMsg = GenModel.internetConMsg;

  columnId: any;
  btnConfirm = GenModel.btnConfirm;
  selectedAllCanDelete: any;
  selectedAllCanDelete1: any;
  selectedAllCanDelete2: any;
  selectedAll: any;
  selectedAll1: any;
  selectedAll2: any;
  selectAllText: any;
  selectAllText1: any;
  selectAllText2: any;
  RetryAttmMsg = GenModel.RetryAttmMsg;
  selectedAllCanAdd: any;
  selectedAllCanAdd1: any;
  selectedAllCanAdd2: any;
  selectedAllCanEdit: any;
  selectedAllCanDeleteAll: any;
  selectedAllCanAuthorize: any;
  selectedAllcanEdit: any;
  selectedAllcanEdit1: any;
  selectedAllcanEdit2: any;
  selectedAllcanAuth: any;
  selectedAllcanAuth1: any;
  selectedAllcanAuth2: any;
  selectedAllisGlobalSupervisor: any;
  selectedAllisGlobalSupervisor1: any;
  selectedAllisGlobalSupervisor2: any;
  roleInfo: any;
  errorOccur = GenModel.errorOccur;
  // Roles: any[] = [];

  selectedCalss = 'selected nav-item cursorPointer';
  selectedCalss2 = 'selected nav-item cursorPointer';
  selectedCalss3 = 'selected nav-item cursorPointer';
  tab1 = '';
  tab2 = '';
  tab3 = '';


  roles: any[] = [];



  adminMenuId = 1;
  operationMenuId = 2;
  reportsMenuId = 3;

  constructor(public appSettings: AppSettings, public dialog: MatDialog,
    public _GeneralService: GeneralService,
    private _localStorageService: LocalStorageService,
    public router: Router,) {
    this.settings = this.appSettings.settings;
  }



  ngOnInit() {
    //   this.ItemsPerPage = this._GeneralService.ItemsPerPage;
    //  this.searchUserColumns = this._GeneralService.searchUserColumns;
    this.swapTab(1);

    this.loadRoles();

    this.load();
  }

  back() {

    this.router.navigate(['./adm/dashboard-role/mid=1076']);
  }


  loadRoles(): void {


    this.loadPage = true;

    let url = 'RoleAssign/GetRoles';

    let val =
    {
      "aId": 0,
      "userName": "string",
      "password": "string",
      "dateCreated": "2020-05-12T12:08:01.854Z"
    }

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
          console.log('load roles: ', data);

          this.roles = data;
          this.loadPage = false;
          this.roleInfo = localStorage.getItem('RoleId');
          this.roleId = localStorage.getItem('RoleId');

          console.log('this.roleInfo: ', this.roleInfo);

        },
        (error: any) => {
          console.log('error while adding: ', error);



          Swal('', this.errorOccur, 'error');

        });
  }


  load(): void {

    this.loadPage = true;
    let track = 0;
    let url = 'RoleAssign/GetAllDashboard';

    let val =
    {
      roleId: localStorage.getItem('RoleId')
    }

    console.log('token param load', val);

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
         // console.log('data rows assign 333: ', data);
          this.loadPage = false;
          this.temp = data._response;



          this.loadPage = false;



          // let admin = new List<any>(data._response).Where(c => c.parentId == this.adminMenuId).OrderBy(c => c.menuName).ToArray();
          // let operation = new List<any>(data._response).Where(c => c.parentId == this.operationMenuId).OrderBy(c => c.menuName).ToArray();
          // let report = new List<any>(data._response).Where(c => c.parentId == this.reportsMenuId).OrderBy(c => c.menuName).ToArray();

          // this.rows = admin;
          // this.rows1 = operation;
          // this.rows2 = report;

          this.getbyOrder();

          //  console.log(' this.rows: ', this.rows);

          this.getRoleDetails(Number(localStorage.getItem('RoleId')));

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

  getbyOrder() {
    let admin = new List<any>(this.temp).Where(c => c.parentId == this.adminMenuId).OrderBy(c => c.menuName).ToArray();
    let operation = new List<any>(this.temp).Where(c => c.parentId == this.operationMenuId).OrderBy(c => c.menuName).ToArray();
    let report = new List<any>(this.temp).Where(c => c.parentId == this.reportsMenuId).OrderBy(c => c.menuName).ToArray();

    this.rows = this.temp;
    this.rows1 = this.temp;
    this.rows2 = this.temp;
  }

  load1(): void {

    let token = this._localStorageService.get(this.token);

    // this._GeneralService.getT(token, 'auth/all-menus?token=')

    // .retryWhen((err) => {

    //   return err.scan((retryCount) =>  {

    //     retryCount  += 1;
    //     if (retryCount < this.retryService) {

    //         this.retryMessage = 'Retrying...Attempt'; // #'  + retryCount;

    //         return retryCount;
    //     }
    //     else 
    //     {
    //       this.retryMessage = this.errorOccur;
    //        throw(err);
    //     }
    //   }, 0).delay(this.retryDelayServiceInterval); 
    // }).subscribe(
    //   (data: any) => {

    //    // console.log('get menu list', data);
    //     this.loadPage = false;

    //    let rows1 =  [];

    //        for (let i = 0; i < data.data.length; i++) 
    //        {
    //        // this.rows = this.rows || [];
    //          rows1.push({ 
    //                  id: data.data[i].id,
    //                  menuName: data.data[i].menuName,
    //                  canAdd: false,
    //                  canView: false,
    //                  canEdit: false,
    //                  canDelete: false,
    //                  canAuthorise: false

    //            });

    //        }

    //        this.rows = rows1;
    //        this.temp = rows1;
    //        this.rowsMobile = rows1.slice(0, this.pageLmit);
    //        this.rowsMobileTem = rows1;
    //        this.changePage(this.current_page);

    //    //  console.log('get this.rows', this.rows);

    //      //console.log('get list of service this.rows', this.rows);
    //   },
    //   (error: any) =>{
    //     // console.log('error:', error)
    //   } 

    // );

  }


  selectCanDeleteandCanViewRow() {
    // console.log('selectCanDeleteandCanViewRow: ', this.rows);

    for (let i = 0; i < this.rows.length; i++) {


      // canAdd: false,
      //              canView: false,
      //              canEdit: false,
      //              canDelete: false

      if (this.rows[i].canAdd === true ||
        this.rows[i].canDelete === true
        || this.rows[i].canEdit === true) {

        this.rows[i].canView = true;
      }
      else {
        this.rows[i].canView = this.rows[i].canDelete;
      }
    }
  }

  selectCanAuthandCanViewRow() {
    //alert(71);
    for (let i = 0; i < this.rows.length; i++) {

      if (this.rows[i].canAdd == true ||
        this.rows[i].canAuthorise == true || this.rows[i].canEdit == true) {

        this.rows[i].canView = true;
      }
      else {
        this.rows[i].canView = this.rows[i].canAuthorise;
      }
    }
  }



  removeMenuToUser(): any {

    //console.log('this.roleInfo', this.roleInfo);
    if (this.roleInfo == undefined) {
      return Swal('', 'Kindly Select Role', 'warning');
    }
    Swal({
      title: '',
      text: 'Are you sure you want to Remove all the Menu(s) assigned to ' + this.roleInfo.name + '?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'No',
      allowEscapeKey: false,
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {

        // console.log('get this.rows to be added', rows2);
        this.displayloaderR = true;


        let values =
        {
          "role_id": this.roleInfo.id,


        };

        // console.log('posted value assign Menu44*:  ', values);

        let token = this._localStorageService.get(this.token);

        let url = `auth/delete-menu?token=` + token;

        this._GeneralService.post(values, url).subscribe(
          (data: any) => {

            console.log('data delete-menu result: ', data);
            //this.loadPage = false;
            this.displayloaderR = false;

            Swal('', data.message, 'success');

          },
          (error: any) => {

            //console.log('data menu assign Error : ', error);
            this.displayloaderR = false;
            // this.loadPage = false;


            if (error.error.message != undefined) {
              Swal('', error.error.message, 'error');
            }
            else {
              Swal('', this.errorOccur, 'error');
            }
          });



      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });
  }

  selectAll() {

    if (this.selectedAll === true) {

      this.selectAllText = 'UnCheck All';
      let trueDe = true;

      for (let i = 0; i < this.rows.length; i++) {
        this.rows[i].canView = trueDe;
        this.rows[i].canAdd = trueDe;
        this.rows[i].canEdit = trueDe;
        this.rows[i].canDelete = trueDe;
        this.rows[i].canAuth = trueDe;
        this.rows[i].isGlobalSupervisor = trueDe;


      }
      // console.log('selectAll', this.rows);
    } else {

      Swal({
        title: '',
        text: 'Are you sure you want to UnCheck All?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: this.btnConfirm,
        cancelButtonText: 'No',
        allowEscapeKey: false,
        allowOutsideClick: false
      }).then((result) => {
        if (result.value) {
          this.selectAllText = 'Check All';

          //  this.selectedAllCanView = this.selectedAll;
          //  this.selectedAllCanAdd = this.selectedAll;
          //  this.selectedAllCanEdit = this.selectedAll;
          //  this.selectedAllCanAuth = this.selectedAll;
          //  this.selectedAllCanDelete = this.selectedAll;
          let falseDe = false;
          for (let i = 0; i < this.rows.length; i++) {

            this.rows[i].canView = falseDe;
            this.rows[i].canAdd = falseDe;
            this.rows[i].canEdit = falseDe;
            this.rows[i].canDelete = falseDe;
            this.rows[i].canAuth = falseDe;
            this.rows[i].isGlobalSupervisor = falseDe;

          }


        } else if (result.dismiss === Swal.DismissReason.cancel) {

        }
      });

    }

  }

  selectAll1() {

    if (this.selectedAll1 === true) {

      this.selectAllText1 = 'UnCheck All';
      let trueDe = true;

      for (let i = 0; i < this.rows1.length; i++) {
        this.rows1[i].canView = trueDe;
        this.rows1[i].canAdd = trueDe;
        this.rows1[i].canEdit = trueDe;
        this.rows1[i].canDelete = trueDe;
        this.rows1[i].canAuth = trueDe;
        this.rows1[i].isGlobalSupervisor = trueDe;


      }
      // console.log('selectAll', this.rows);
    } else {

      Swal({
        title: '',
        text: 'Are you sure you want to UnCheck All?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: this.btnConfirm,
        cancelButtonText: 'No',
        allowEscapeKey: false,
        allowOutsideClick: false
      }).then((result) => {
        if (result.value) {
          this.selectAllText = 'Check All';


          let falseDe = false;
          for (let i = 0; i < this.rows1.length; i++) {

            this.rows1[i].canView = falseDe;
            this.rows1[i].canAdd = falseDe;
            this.rows1[i].canEdit = falseDe;
            this.rows1[i].canDelete = falseDe;
            this.rows1[i].canAuth = falseDe;
            this.rows1[i].isGlobalSupervisor = falseDe;

          }


        } else if (result.dismiss === Swal.DismissReason.cancel) {

        }
      });

    }

  }

  selectAll2() {

    if (this.selectedAll2 === true) {

      this.selectAllText2 = 'UnCheck All';
      let trueDe = true;

      for (let i = 0; i < this.rows2.length; i++) {
        this.rows2[i].canView = trueDe;
        this.rows2[i].canAdd = trueDe;
        this.rows2[i].canEdit = trueDe;
        this.rows2[i].canDelete = trueDe;
        this.rows2[i].canAuth = trueDe;
        this.rows2[i].isGlobalSupervisor = trueDe;


      }
      // console.log('selectAll', this.rows);
    } else {

      Swal({
        title: '',
        text: 'Are you sure you want to UnCheck All?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: this.btnConfirm,
        cancelButtonText: 'No',
        allowEscapeKey: false,
        allowOutsideClick: false
      }).then((result) => {
        if (result.value) {
          this.selectAllText = 'Check All';


          let falseDe = false;
          for (let i = 0; i < this.rows2.length; i++) {

            this.rows2[i].canView = falseDe;
            this.rows2[i].canAdd = falseDe;
            this.rows2[i].canEdit = falseDe;
            this.rows2[i].canDelete = falseDe;
            this.rows2[i].canAuth = falseDe;
            this.rows2[i].isGlobalSupervisor = falseDe;

          }


        } else if (result.dismiss === Swal.DismissReason.cancel) {

        }
      });

    }

  }

  selectAllCanView() {

    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i].canView = this.selectedAllCanView;
    }

  }

  selectAllCanView1() {

    for (let i = 0; i < this.rows1.length; i++) {
      this.rows1[i].canView = this.selectedAllCanView1;
    }

  }

  selectAllCanView2() {

    for (let i = 0; i < this.rows2.length; i++) {
      this.rows2[i].canView = this.selectedAllCanView1;
    }

  }


  selectAllCanAdd() {

    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i].canAdd = this.selectedAllCanAdd;
    }
  }
  selectAllCanAdd1() {

    for (let i = 0; i < this.rows1.length; i++) {
      this.rows1[i].canAdd = this.selectedAllCanAdd1;
    }
  }

  selectAllCanAdd2() {

    for (let i = 0; i < this.rows2.length; i++) {
      this.rows2[i].canAdd = this.selectedAllCanAdd1;
    }
  }

  selectAllcanEdit() {

    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i].canEdit = this.selectedAllcanEdit;
    }
  }

  selectAllcanEdit1() {

    for (let i = 0; i < this.rows1.length; i++) {
      this.rows1[i].canEdit = this.selectedAllcanEdit1;
    }
  }

  selectAllcanEdit2() {

    for (let i = 0; i < this.rows2.length; i++) {
      this.rows2[i].canEdit = this.selectedAllcanEdit1;
    }
  }

  selectAllcanDelete() {

    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i].canDelete = this.selectedAllCanDelete;
    }
  }

  selectAllcanDelete1() {

    for (let i = 0; i < this.rows1.length; i++) {
      this.rows1[i].canDelete = this.selectedAllCanDelete1;
    }
  }

  selectAllcanDelete2() {

    for (let i = 0; i < this.rows2.length; i++) {
      this.rows2[i].canDelete = this.selectedAllCanDelete1;
    }
  }

  selectAllcanAuth() {

    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i].canAuth = this.selectedAllcanAuth;
    }
  }

  selectAllcanAuth1() {

    for (let i = 0; i < this.rows1.length; i++) {
      this.rows1[i].canAuth = this.selectedAllcanAuth1;
    }
  }

  selectAllcanAuth2() {

    for (let i = 0; i < this.rows2.length; i++) {
      this.rows2[i].canAuth = this.selectedAllcanAuth1;
    }
  }

  selectAllisGlobalSupervisor() {

    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i].isGlobalSupervisor = this.selectedAllisGlobalSupervisor;
    }
  }

  selectAllisGlobalSupervisor1() {

    for (let i = 0; i < this.rows1.length; i++) {
      this.rows1[i].isGlobalSupervisor = this.selectedAllisGlobalSupervisor1;
    }
  }
  selectAllisGlobalSupervisor2() {

    for (let i = 0; i < this.rows2.length; i++) {
      this.rows2[i].isGlobalSupervisor = this.selectedAllisGlobalSupervisor1;
    }
  }

  selectAllCanEdit() {

    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i].canEdit = this.selectedAllCanEdit;
    }
  }

  selectAllCanDeleteAll() {

    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i].canDelete = this.selectedAllCanDeleteAll;
    }
  }

  selectAllCanAuthorize() {

    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i].canAuthorise = this.selectedAllCanAuthorize;
    }
  }

  selectCanAddandCanViewRow() {
    // canAdd: false,
    //              canView: false,
    //              canEdit: false,
    //              canDelete: false

    for (let i = 0; i < this.rows.length; i++) {

      if (this.rows[i].canAdd === true ||
        this.rows[i].canEdit === true || this.rows[i].canDelete === true) {

        this.rows[i].canView = true;
      }
      else {
        this.rows[i].canView = this.rows[i].canAdd;
      }
    }
  }

  selectCanEditandCanViewRow() {

    // canAdd: false,
    //              canView: false,
    //              canEdit: false,
    //              canDelete: false
    for (let i = 0; i < this.rows.length; i++) {

      if (this.rows[i].canAdd == true ||
        this.rows[i].canDelete == true || this.rows[i].canEdit == true) {

        this.rows[i].canView = true;
      }
      else {
        this.rows[i].canView = this.rows[i].canEdit;
      }
    }
  }


  selectCanViewAddCanDeleteRow() {



  }

 

  post() {



    for (let i = 0; i < this.selectedRec.length; i++) {

      let value =
      {
        email: this.selectedRec[i][0],
        status: this.selectedRec[i][1],
        partner_type: this.selectedRec[i][2],
      };


      // this.loadPage =  true;
      this.lblProcess = 'Wait, Action in Progress...';
      this.displayloader = true;

      let url = `auth/authorize-user`;

      // console.log('post url: ', url);

      this._GeneralService.post(value, url).subscribe(
        (data: any) => {

          this.displayloader = false;


          console.log('gaddToCart data', data);

          Swal('', data.message, 'success');

          this.btnActionAssign = 'Assign';


        },
        (error: any) => {

          //  console.log('error:', error)
          this.btnActionAssign = 'Assign';

          this.displayloader = false;
          this.loadPage = false;

          Swal('', error.error.message, 'error');

        });

    }




  }


  updateFilter(event) {

    let temp1 = this.rows;
    const val = event.target.value.toLowerCase();

    //console.log("this.temp ", this.temp);
    //console.log("val ", val);
    const temp = this.temp.filter(function (d) {
      return d.dashboardMenuName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    //console.log("this.menuname ", temp);
    if (temp.length === 0) {
      this.rows = temp1;
      swal('', 'No Record Matches Your Search', 'warning');
      return;
    }

    //console.log('temp***: ', temp);
    this.rows = temp;

  }

  updateFilter1(event) {

    let temp1 = this.rows1;
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return d.menuName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    if (temp.length === 0) {
      this.rows1 = temp1;
      swal('', 'No Record Matches Your Search', 'warning');
      return;
    }

    console.log('temp***: ', temp);
    this.rows1 = temp;

  }

  updateFilter2(event) {

    let temp1 = this.rows2;
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return d.menuName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    if (temp.length === 0) {
      this.rows2 = temp1;
      swal('', 'No Record Matches Your Search', 'warning');
      return;
    }

    console.log('temp***: ', temp);
    this.rows2 = temp;

  }





  //From BElow is the Pagination on Mobile ///

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

    for (let i = (page - 1) * this.pageLmit; i < (page * this.pageLmit) && i < this.rowsMobileTem.length; i++) {
      tem.push(this.rowsMobileTem[i]);
    }
    this.rowsMobile = tem;



    page_span.innerHTML = page + "/" + this.numPages();


  }

  numPages() {
    return Math.ceil(this.rowsMobileTem.length / this.pageLmit);
  }

  onload = function () {
    this.changePage(1);
  };




  swapTab(value) {
    console.log('swapTab: ', value);

    this.getbyOrder();

    if (value === 1) {
      this.tab1 = 'active';
      this.tab2 = '';
      this.tab3 = '';

    }
    if (value === 2) {
      this.tab1 = '';
      this.tab2 = 'active';
      this.tab3 = '';

    }
    if (value === 3) {
      this.tab1 = '';
      this.tab2 = '';
      this.tab3 = 'active';

    }

    this.tabVlues = value;
  }

  select(row: any) {
    console.log('select row:', row);

    let index = this.rows.findIndex(x => x.menuId === row.menuId);

    this.rows[index].canAdd = row.canView;
    this.rows[index].canEdit = row.canView;
    this.rows[index].canDelete = row.canView;
    this.rows[index].canAuth = row.canView;
    this.rows[index].isGlobalSupervisor = row.canView;

  }

  //Pagination for Mobile Ends here

  add(): any {
    //let userId =  this._GeneralService.getUserId();
    console.log('this.roleId', this.roleId);
    if (this.roleInfo == undefined) {
      return Swal('', 'Kindly Select Role', 'warning');
    }

    if (this.roleId == 0) {
      return Swal('', 'Kindly Select Role', 'warning');
    }

    let getCheckViewSingle = new List<any>(this.rows).Where(c => c.canView === true).FirstOrDefault();

    console.log('this.roleId getCheckViewSingle: ', getCheckViewSingle);
   let getRole = new List<any>(this.roles).Where(c=> c.roleId == this.roleId).FirstOrDefault();
    console.log('getRole: ', getRole);

    if (getCheckViewSingle === undefined) {
      let mes =  `Kindly Select what to display on ${getRole.roleName}  Dashboard`;

      return Swal('', mes, 'warning');
    }
  
    // let  getRoleName = new List<any>(this.roles).Where(c=> c.roleId ===  this.roleId).FirstOrDefault();
    Swal({
      title: '',
      text: `Are you sure you want to Assign the Selected Dashbaord for the Selected Role(${getRole.roleName})?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'No',
      allowEscapeKey: false,
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {


     
        let userDetails = this._GeneralService.getUserDetails();
        console.log('get userDetails3', userDetails);

        let getOnlyCheck = new List<any>(this.rows).Where(c=> c.canView == true).ToArray();
         console.log('get getOnlyCheck', getOnlyCheck);
        let values =
        {
          ListRoleAssignDTO: getOnlyCheck,
          userId: userDetails.userId,
          roleId: this.roleId
        };
        this.displayloader = true;

        console.log('role assing values44: ', values);
        this.actionLoaderSave = true;
        let element = <HTMLInputElement>document.getElementById("btnSave");
        element.disabled = true;

        let url = 'RoleAssign/AssignDashboard';

        this._GeneralService.post(values, url).subscribe(
          (data: any) => {

            // console.log('data assign menu result: ', data);
            element.disabled = false;
            this.actionLoaderSave = false;

            Swal('', data.responseMessage, 'success');

          },
          (error: any) => {

            element.disabled = false;
            this.actionLoaderSave = false;

            if (error.error.message != undefined) {
              Swal('', error.error.message, 'error');
            }
            else {
              Swal('', this.errorOccur, 'error');
            }
          });



      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });


  }

  removeAll() {

    // let  getRoleName = new List<any>(this.roles).Where(c=> c.roleId ===  this.roleId).FirstOrDefault();
    Swal({
      title: '',
      text: `Are you sure you want to Delete All Assigned Menu(s) for the Selected Role(${this.roleName})?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm,
      cancelButtonText: 'No',
      allowEscapeKey: false,
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {

        let userDetails = this._GeneralService.getUserDetails();
        console.log('get userDetails3', userDetails);
        let values =
        {
          //  ListRoleAssignDTO: all, // rows2,
          userId: userDetails.userId,
          roleId: this.roleId
        };
        this.loadPage = true;

        console.log('role assing values44: ', values);
        // this.actionLoaderSave = true;
        let element = <HTMLInputElement>document.getElementById("btnRemoveAssign");
        element.disabled = true;

        let url = 'RoleAssign/DeleteAllAssignDashboard';

        this._GeneralService.post(values, url).subscribe(
          (data: any) => {

            // console.log('data assign menu result: ', data);
            element.disabled = false;
            this.loadPage = false;

            this.removeTemp();

            Swal('', data.responseMessage, 'success');

          },
          (error: any) => {

            element.disabled = false;
            this.loadPage = false;

            if (error.error.message != undefined) {
              Swal('', error.error.message, 'error');
            }
            else {
              Swal('', this.errorOccur, 'error');
            }
          });



      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });
  }

  removeTemp() {
    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i].canView = false;
      this.rows[i].canAdd = false;
      this.rows[i].canEdit = false;
      this.rows[i].canDelete = false;
      this.rows[i].canAuth = false;
      this.rows[i].isGlobalSupervisor = false;
    }

    for (let i = 0; i < this.rows1.length; i++) {
      this.rows1[i].canView = false;
      this.rows1[i].canAdd = false;
      this.rows1[i].canEdit = false;
      this.rows1[i].canDelete = false;
      this.rows1[i].canAuth = false;
      this.rows1[i].isGlobalSupervisor = false;
    }

    for (let i = 0; i < this.rows2.length; i++) {
      this.rows2[i].canView = false;
      this.rows2[i].canAdd = false;
      this.rows2[i].canEdit = false;
      this.rows2[i].canDelete = false;
      this.rows2[i].canAuth = false;
      this.rows2[i].isGlobalSupervisor = false;
    }

    this.selectedAll = false;
    this.selectedAll1 = false;
    this.selectedAll2 = false;
  }

  onOptionsSelected(event) {
    this.getRoleDetails(Number(event.target.value))
  }

  getRoleDetails(roleId) {

    console.log('getRoleDetails2323 roleId : ', roleId);

    const getRoleDetails = new List<any>(this.roles).FirstOrDefault(c => c.roleId === (roleId));
    console.log('this.getRoleDetails : ', getRoleDetails);
    this.roleName = getRoleDetails.roleName;
    this.roleId = roleId;
    console.log('this.roleName2233 : ', this.roleName, "this.roleId22", this.roleId);
  }
}







