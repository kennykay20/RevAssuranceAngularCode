import { GenModel } from './../../../../model/gen.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { GeneralService } from './../../../../services/genservice.service';
import { Component, OnInit, Inject } from '@angular/core';
import {
  FormGroup, FormBuilder, Validators, FormControl,
  FormGroupDirective, NgForm
} from '@angular/forms';
import { emailValidator } from '../../../../theme/utils/app-validators';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { WaitingDialog } from '../../../../services/services';
import { MatSnackBar } from '@angular/material';
import { LocalStorageService } from 'angular-2-local-storage';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { auditTrailDetailComponent } from '../../auditTrail/auditTrail-details/audittrail-detail.component';


@Component({
  selector: 'app-statement-chg-details',
  templateUrl: './statement-chg-details.component.html',
  styleUrls: ['./statement-chg-details.component.scss']
})
export class StatementChgDetailsComponent implements OnInit {

  chargeMetrix = ['Months', 'Week', 'Year']
  chargeBasis = [
    { value: "TC", name: "Transaction Count" },
    { value: "TP", name: "Transaction Period" },
    { value: "Amt", name: "Amount" },
  ]
  public form: FormGroup;
  basicForm: FormGroup;
  public settings: Settings;
  durationsnack = 3000;
  displayloader = false;
  lblProcess: any;
  selectedPrepCat: any;
  religionlist = [];
  ActionDisplay: any;
  stateList: any;
  NationalityList: any;
  localGovernmentsList: any;
  private baseUrl = environment.apiURL;
  Email: any;
  loadPage = true;
  token = GenModel.tokenName;
  ActionHeaderMsg = GenModel.ActionHeaderMsg
  requiredFieldMsg = GenModel.requiredFieldMsg;
  actionLoaderSave = false;
  actionLoaderUpdate = false;
  services = [];
  charges = [];
  currencies = [];
  reloadLoad: any;
  errorOccur = GenModel.errorOccur;
  createdBy: any
  ActionViewHeaderMsg = GenModel.ActionViewHeaderMsg;
  tableName = "admStatementChg";

  constructor(public appSettings: AppSettings,
    public fb: FormBuilder, public router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public _waitingDialog: WaitingDialog,
    private _localStorageService: LocalStorageService,
    public _GeneralService: GeneralService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<StatementChgDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.settings = this.appSettings.settings;

    if (this.data.actionName === 'Add') {

      this.basicForm = this.fb.group({
        serviceId: 8, // [null, Validators.compose([Validators.required])], //
        description: [null, Validators.compose([Validators.required])],
        // chgMetrix: [null, Validators.compose([Validators.required])],
        // chgBasis: [null, Validators.compose([Validators.required])],
        chgMetrix: "Months",// [null, Validators.compose([Validators.required])],
        chgBasis: 'TP',//[null, Validators.compose([Validators.required])],
        startingNo: [null, Validators.compose([Validators.required])],
        endingNo: [null, Validators.compose([Validators.required])],
        cghAmount: [null, Validators.compose([Validators.required])],
        ccyCode: [null, Validators.compose([Validators.required])],
        UserId: 0
      });
    }
    else {

      this.ActionHeaderMsg = '';
      this.ActionDisplay = this.ActionViewHeaderMsg;
      this.basicForm = this.fb.group({
        serviceId: new FormControl(null),
        description: new FormControl(null),
        chgMetrix: new FormControl(null),
        chgBasis: new FormControl(null),
        startingNo: new FormControl(null),
        endingNo: new FormControl(null),
        cghAmount: new FormControl(null),
        ccyCode: new FormControl(null),
        UserId: 0,
        documentId: new FormControl(null),
        dateCreated: new FormControl(null),
        createdBy: new FormControl(null),
        status: new FormControl(null)
      });


      this.basicForm.patchValue({
        serviceId: data.record.serviceId,
        description: data.record.description,
        chgMetrix: data.record.chgMetrix,
        chgBasis: data.record.chgBasis,
        startingNo: data.record.startingNo,
        endingNo: data.record.endingNo,
        cghAmount: this._GeneralService.formatMoney(data.record.cghAmount),
        ccyCode: data.record.ccyCode,
        UserId: data.record.userId,
        dateCreated: this._GeneralService.dateCreated(data.record.dateCreated),
        documentId: data.record.documentId,
        createdBy: null,
        status: data.record.status
      });

      this.getCreatedBy(data);
    }
  }

  ngOnInit() {
    this.loadPage = false;
    this.getServices();
    //this.getCharges();
    this.getCurrencies();

  }
  check() {

  }
  getCreatedBy(values: any): void {

    console.log('getCreatedBy param: ', values)
    this.loadPage = true;

    let url = 'Users/GetUser';
    let val =
    {
      CreatedBy: values.record.userId,

    };

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {
        console.log('created by Data: ', data);
        this.createdBy = data.fullName;

        this.loadPage = false;

      },
      (error: any) => {
        console.log('created error by while adding: ', error);
      });

  }


  getServices(): void {
    let url = 'Service/GetAllServices';
    let val =
    {
      "menuId": 0,
      "pdtCurrentDate": "string",
      "psBranchNo": "string",
      "pnDeptId": "string",
      "roleId": 0,
      "loginUserRoleId": 0,
      "serviceId": 0,
      "userId": 0,
      "userItbId": 0,
      "fromDate": "string",
      "toDate": "string",
      "amount": "string"
    }

    this._GeneralService.post(val, url)
      .subscribe(
        (data: any) => {
          this.loadPage = false;
          this.services = data._response;
          //  console.log('Service data', data);
        },
        (error: any) => {
          //  console.log('Service error', error);
        });
  }

  getCharges(): void {
    let url = 'Charge/GetAll';
    let val =
    {
      "aId": 0,
      "userName": "string",
      "password": "string",
      "dateCreated": "2020-05-12T12:08:01.854Z"
    }

    this._GeneralService.post(val, url)
      .subscribe(
        (data: any) => {
          this.loadPage = false;
          this.charges = data;
        },
        (error: any) => {
        });
  }

  // add(values: Object): void {

  //   this.actionLoaderSave = true;
  //   let element = <HTMLInputElement> document.getElementById("btnSave");
  //   element.disabled = true;

  //   if (this.basicForm.valid) 
  //   {

  //     this.basicForm.value.UserId  = this._GeneralService.getUserId();

  //     console.log('this.basicForm.value: ',  this.basicForm.value);

  //     let url = 'TransConfig/Add';

  //     this._GeneralService.homePage(val, url).subscribe(
  //       (data: any) => 
  //       {
  //         console.log('Save Result: ', data);

  //         element.disabled = false;
  //         this.basicForm.reset();

  //         this.actionLoaderSave = false;

  //         Swal('', data.sErrorText, 'success');

  //       },
  //       (error: any) => 
  //       {
  //         console.log('error while adding: ', error)
  //         this.actionLoaderSave = false;
  //         element.disabled = true;

  //         Swal('', error.message, 'error');

  //     });


  //   }
  //   else 
  //   {
  //     element.disabled = true;
  //    // Swal('Note:', 'Kindly Fill your Credential!', 'error');
  //   }
  // }
  add(values: Object): void {

    if (this.basicForm.value.startingNo > this.basicForm.value.endingNo) {
      Swal('', `Start No Mustn't be Greater than End No`, 'error');
      return;
    }

    this.actionLoaderSave = true;
    let element = <HTMLInputElement>document.getElementById("btnSave");
    element.disabled = true;

    if (this.basicForm.valid) {

      this.basicForm.value.userId = this._GeneralService.getUserId();


      let url = 'StatementChg/Add';


      this._GeneralService.post(this.basicForm.value, url).subscribe(
        (data: any) => {


          element.disabled = false;
          this.basicForm.reset();

          this.actionLoaderSave = false;
          this.reloadLoad = 'Y';

          Swal('', data.responseMessage, 'success');

        },
        (error: any) => {

          this.actionLoaderSave = false;
          element.disabled = true;

          Swal('', error.error.responseMessage, 'error');

        });


    }
    else {
      element.disabled = true;
      // Swal('Note:', 'Kindly Fill your Credential!', 'error');
    }
  }
  update(values: Object): void {

    this.actionLoaderUpdate = true;
    let element = <HTMLInputElement>document.getElementById("btnUpdate");

    element.disabled = true;
    let url = 'StatementChg/Update';

    this._GeneralService.post(values, url).subscribe(
      (data: any) => {

        console.log('Save Result: ', data);


        element.disabled = false;
        this.actionLoaderUpdate = false;

        this.reloadLoad = 'Y';
        if(data.responseCode == 0)
          Swal('', data.responseMessage, 'success');
        else  
          Swal('', data.responseMessage, 'error');
      },
      (error: any) => {

        element.disabled = false;
        this.actionLoaderUpdate = false;

        Swal('', error.error.responseMessage, 'error');
      });


  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  convertChargeValue(event: any){
    let val = this._GeneralService.formatMoney(event.target.value);
    //console.log('val pp',val);
    this.basicForm.patchValue({cghAmount: val});
  }




  ngAfterViewInit() {
    this.settings.loadingSpinner = false;
  }

  close(): void {

    this.dialogRef.close(this.reloadLoad);
  }

  //to get currencies
  getCurrencies(): void {
    let url = 'Currency/GetAll';
    let val =
    {
      "aId": 0,
      "userName": "string",
      "password": "string",
      "dateCreated": "2020-05-12T12:08:01.854Z"
    }

    this._GeneralService.post(val, url)
      .subscribe(
        (data: any) => {
          this.loadPage = false;
          this.currencies = data;
        },
        (error: any) => {
        });
  }

  auditList()
  {
    let tableName = this.tableName;
    let dialogRef = this.dialog.open(auditTrailDetailComponent, {

      width: '1400px',
      height: '650px',
      // hasBackdrop: true,
      disableClose: true,
      // autoFocus: true,
      data: { actionName: "audit", record:  tableName},
      
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('role list refresh result', result)
      if(result == 'Y'){
        let getUserDetails =  this._GeneralService.getUserDetails();
        //this.load(getUserDetails);
      }
    });
  }
}
