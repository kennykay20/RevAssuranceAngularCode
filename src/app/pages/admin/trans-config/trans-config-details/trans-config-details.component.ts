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
  selector: 'app-trans-config-details',
  templateUrl: './trans-config-details.component.html',
  styleUrls: ['./trans-config-details.component.scss']
})
export class TransConfigDetailsComponent implements OnInit {

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
  reloadLoad: any;
  errorOccur = GenModel.errorOccur;
  createdBy: any
  ActionViewHeaderMsg = GenModel.ActionViewHeaderMsg;
  tableName = "admTransactionConfiguration";

  constructor(public appSettings: AppSettings,
    public fb: FormBuilder, public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public _waitingDialog: WaitingDialog,
    private _localStorageService: LocalStorageService,
    public _GeneralService: GeneralService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<TransConfigDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  
    this.settings = this.appSettings.settings;

    if (this.data.actionName === 'Add') {

      this.basicForm = this.fb.group({
        serviceId: ['', Validators.compose([Validators.required])], //
        direction: [null, Validators.compose([Validators.required])],
        customerAcctDrTC: [null, Validators.compose([Validators.required])],
        customerAcctCrTC: [null, Validators.compose([Validators.required])],
        glAcctDrTC: [null, Validators.compose([Validators.required])],
        glAcctCrTC: [null, Validators.compose([Validators.required])],
        creditAcctTCRev: [null, Validators.compose([Validators.required])],
        debitAcctTCRev: [null, Validators.compose([Validators.required])],
        glAcctDrTCRev: [null, Validators.compose([Validators.required])],
        glAcctCrTCRev: [null, Validators.compose([Validators.required])],
        chargeType: [null, Validators.compose([Validators.required])],
        drNarration: [null, Validators.compose([Validators.required])],
        crNarration: [null, Validators.compose([Validators.required])],
        drChargeNarr: [null, Validators.compose([Validators.required])],
        crChargeNarr: [null, Validators.compose([Validators.required])],
        UserId: 0
      });
    }
    else {

      this.ActionHeaderMsg = '';
        this.ActionDisplay = this.ActionViewHeaderMsg;
      this.basicForm = this.fb.group({
        serviceId: new FormControl(null),
        direction: new FormControl(null),
        customerAcctDrTC: new FormControl(null),
        customerAcctCrTC: new FormControl(null),
        glAcctDrTC: new FormControl(null),
        glAcctCrTC: new FormControl(null),
        creditAcctTCRev: new FormControl(null),
        debitAcctTCRev: new FormControl(null),
        glAcctDrTCRev: new FormControl(null),
        UserId: 0,
        glAcctCrTCRev: new FormControl(null),
        chargeType: new FormControl(null),
        drNarration: new FormControl(null),
        crNarration: new FormControl(null),
        drChargeNarr: new FormControl(null),
        crChargeNarr: new FormControl(null),
        dateCreated: new FormControl(null),
        itbId: new FormControl(null),
        createdBy: new FormControl(null),
        status: new FormControl(null)
      });


      this.basicForm.patchValue({
        serviceId: data.record.serviceId,
        direction: data.record.direction,
        customerAcctDrTC: data.record.customerAcctDrTC,
        customerAcctCrTC: data.record.customerAcctCrTC,
        glAcctDrTC: data.record.glAcctCrTC,
        glAcctCrTC: data.record.glAcctCrTC,
        creditAcctTCRev: data.record.creditAcctTCRev,
        debitAcctTCRev: data.record.debitAcctTCRev,
        glAcctDrTCRev: data.record.glAcctDrTCRev,
        glAcctCrTCRev: data.record.glAcctCrTCRev,
        UserId: data.record.userId,
        chargeType: data.record.chargeType,
        drNarration: data.record.drNarration,
        crNarration: data.record.crNarration,
        drChargeNarr: data.record.drChargeNarr,
        crChargeNarr: data.record.crChargeNarr,
        dateCreated: this._GeneralService.dateCreated(data.record.dateCreated),
        itbId: data.record.itbId,
        createdBy: null,
        status: data.record.status
      });

      this.getCreatedBy(data);
    }
  }

  ngOnInit() {
    this.loadPage = false;
    this.getServices();
    this.getCharges();
   
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
     (data: any) => 
     {
       console.log('created by Data: ', data);
       this.createdBy = data.fullName;

       this.loadPage = false;
         
     },
     (error: any) => 
     {
       console.log('created error by while adding: ', error);
   });

}
  

  getServices(): void {
    let url = 'Service/GetAllServices';
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
          this.services = data._response;
          console.log('Service data', data);
        },
        (error: any) => 
        {
          console.log('Service error', error);
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

    this.actionLoaderSave = true;
    let element = <HTMLInputElement>document.getElementById("btnSave");
    element.disabled = true;

    if (this.basicForm.valid) {

      this.basicForm.value.userId = this._GeneralService.getUserId();


      let url = 'TransConfig/Add';


      this._GeneralService.homePage(this.basicForm.value, url).subscribe(
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
    let url = 'TransConfig/Update';

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






  ngAfterViewInit() {
    this.settings.loadingSpinner = false;
  }

  close(): void {

    this.dialogRef.close(this.reloadLoad);
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





