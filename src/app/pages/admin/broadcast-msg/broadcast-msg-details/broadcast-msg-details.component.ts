import { GenModel } from './../../../../model/gen.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { GeneralService } from './../../../../services/genservice.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, 
          FormGroupDirective, NgForm } from '@angular/forms';
import { emailValidator } from '../../../../theme/utils/app-validators';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import {  WaitingDialog } from '../../../../services/services';
import {MatSnackBar, MatDatepickerModule, MatNativeDateModule} from '@angular/material';
import { LocalStorageService } from 'angular-2-local-storage';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BroadCastMessage } from '../../../../model/broadcastMessage';
import swal from 'sweetalert2';
import { UserDetails } from '../../../../model/userDetails';
import { auditTrailDetailComponent } from '../../auditTrail/auditTrail-details/audittrail-detail.component';
  

@Component({
  selector: 'app-broadcast-msg-details',
  templateUrl: './broadcast-msg-details.component.html',
  styleUrls: ['./broadcast-msg-details.component.scss']
})
export class BroadcastMsgDetailsComponent implements OnInit {
  reload ='';
  public form: FormGroup;
  basicForm: BroadCastMessage;
  public settings: Settings;
  durationsnack = 3000;
  displayloader = false;
  lblProcess: any;
  selectedPrepCat: any;
  religionlist = [];

  stateList:any;
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

  userFullName: any
public dataStartDate: string;
public dataEndDate: string;

hour = [];
minute = [];
AmOrPm = ['AM', 'PM'];
broadcastType = ['Warning', 'System Update']
getUserDetails: UserDetails;
departments = [];
statuses = [];
maxLengthDefault = GenModel.txtAreaMaxLengthDefault;
tableName = 'admBroadCast';

actionDataEvent = "";
currentYear = new Date().getUTCFullYear();
startDateVal = new Date(this.currentYear, 0, 1);
minDate = new Date();

  constructor(public appSettings: AppSettings, 
              public fb: FormBuilder, public router: Router,
              public snackBar: MatSnackBar,
              public datepickerModule: MatDatepickerModule,
              public nativeDateModule: MatNativeDateModule,
              public dialog: MatDialog,
              public _waitingDialog: WaitingDialog,
              private _localStorageService: LocalStorageService,
              public _GeneralService: GeneralService,
              private http: HttpClient,
              private route: ActivatedRoute,
              private activatedRoute: ActivatedRoute,
              public dialogRef: MatDialogRef<BroadcastMsgDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, 
        )
        {
        //   let param4 = this.route.snapshot.params.mid;
        //   console.log('**data param4', param4);

        //   console.log('**data Details', data);

         
        //   let returnAss =  this._GeneralService.ReturnAssingned(param4);
        //   console.log('**data returnAss', returnAss);
        
        //  this.userFullName = this._GeneralService.ReturnUserDetails();
        // console.log('**data  this.userFullName',  this.userFullName);
       
        this.getUserDetails =  this._GeneralService.getUserDetails();
        this.settings = this.appSettings.settings; 
        //alert('constructor ');
    
      if(this.data.actionName === 'Add')
      {
          this.actionDataEvent = "Add";
          this.resetForm();
          this.hour = data.hours;
          this.minute = data.minutes;
      }
      else
      {
        console.log('**data data', data);
        //this. resetForm();
        this.basicForm = data.record;
        this.hour = data.hours;
          this.minute = data.minutes;
        this.actionDataEvent = this.data.actionName;
        console.log();
        this.getbyId(this.basicForm);
       
      }
 }

  ngOnInit() 
  {
    
      this.loadPage = false;

      // for(let i = 1; i < 13; i++){
      //  this.hour.push(i);
      // }

      console.log('hours ', this.hour);
      // for(let i = 1; i < 61; i++){
      //   if(i.toString().length == 1){
      //     this.minute.push(':0'+i);
      //   }else
      //   {
      //     this.minute.push(':'+i);
      //   }
       
      //  }

       console.log('minutes ', this.minute);
       this.loadDepartment();

       this.statuses = this._GeneralService.Statuses;
  }
    
  loadDepartment(): void {

    this.loadPage = true;
    let track = 0;
    let url = 'Department/GetAll';


      let val = 
        {
          AId: 1,
        }

  this._GeneralService.post(val, url)
  .subscribe(
    (data: any) => 
    {

      this.departments = data._response;
      this.loadPage = false;
    },
    (error: any) => 
    {
      
    });
}

getbyId(param): void {

  this.loadPage = true;
  let track = 0;
  let url = 'BroadCastMessage/GetById'

this.basicForm = param;

this._GeneralService.post(this.basicForm, url)
.subscribe(
  (data: any) => 
  {
    console.log('** data.get3',  data);
    // dateconvertion
    this.basicForm  = data.get;

    console.log('** data.get66', this.basicForm.targetAudience );
    console.log("this.basicForm ", this.basicForm);

    this.basicForm.createdBy  = data.getUser.fullName;
    this.basicForm.dateCreated = this.basicForm.dateCreated != null ? this._GeneralService.dateconvertion(this.basicForm.dateCreated) : this.basicForm.startDate;

    console.log("this.basicForm.startDate ", this.basicForm.startDate);
    this.basicForm.startDate = this.basicForm.startDate != null ? this._GeneralService.dateconvertion(this.basicForm.startDate) : this.basicForm.startDate;
    this.basicForm.endDate = this.basicForm.endDate != null ? this._GeneralService.dateconvertion(this.basicForm.endDate) : this.basicForm.endDate;
    this.basicForm.targetAudienceBoolean  =   this.basicForm.targetAudience  != null ? true : false;

    this.dataStartDate = data.get.startDate;
    this.dataEndDate = data.get.endDate;
    console.log('this.dataStartDate ', this.dataStartDate);
    console.log('this.dataEndDate ', this.dataEndDate);
    this.splitData(data);
    

   
    this.loadPage = false;
  },
  (error: any) => 
  {
    
  });
}

splitData(data:any):void{
  let split = data.startDate.split(' ');
  console.log('**split', split);

  let splitStartDarte = split[1].split(':');
  console.log('**splitStartDarte', splitStartDarte);
  if(split != undefined)
  {
    console.log("splitStartDarte[1] ", splitStartDarte[0]);
    this.basicForm.starthour = splitStartDarte[0];
    this.basicForm.startminute = ':'+ splitStartDarte[1];
    this.basicForm.startamOrPm = splitStartDarte[2].toString().toUpperCase();
     
     
    //this.basicForm.starthour =  splitStartDarte[0];

    if(splitStartDarte[1].toString().length == 1)
    {
      this.basicForm.startminute = ':0'+ splitStartDarte[1];
    }
    else
    {
      this.basicForm.startminute = ':'+ splitStartDarte[1];
    }

    console.log('this.basicForm.starthour***: ', this.basicForm.starthour); 
  }

  //End date below


  let splitEnd = data.endDate.split(' ');
  //console.log('**split', split);
 
  let splitEndDate = splitEnd[1].split(':');
  console.log('**splitEndDate', splitEndDate);
  if(split != undefined)
  {
    this.basicForm.endhour = splitEndDate[1];
    this.basicForm.endminute = ':'+ splitEndDate[2];
    this.basicForm.endamOrPm = splitEndDate[2].toString().toUpperCase();
 
    this.basicForm.endhour =  splitEndDate[0];
 
    if(splitEndDate[1].toString().length == 1)
    {
      this.basicForm.endminute = ':0'+ splitEndDate[1];
    }
    else
    {
      this.basicForm.endminute = ':'+ splitEndDate[1];
    }
    console.log('this.basicForm.endhour***: ', this.basicForm.endhour);  
  }
}

  resetForm(){
    this.basicForm = {
      itbId: 0,
      targetAudience  : null,
      targetAudienceBoolean: false,
      deptId  : null, 
      subject  : null, 
      message  : null, 
      broadcastType  : null, 
      userId  : null, 
      dateCreated  : null, 
      status  : null, 
      deptName  :  null,
      startDate: null,
      endDate: null,
      notifyTimeInterval: 0,
      createdBy: null,
      starthour:  null,
      startminute:  null,
      startamOrPm:  null,
      endhour:  null,
      endminute:  null,
      endamOrPm:  null,
      readBroadCastMessage: false
     
    };
  }

  checkLength(event: any){
    console.log("check event ", event);

    console.log("this.basicForm.message length ", this.basicForm.message.length);
  }



  add(values: Object): any {

    if(this.basicForm.subject === null || this.basicForm.subject === ''){
      swal('', 'Kindly fill the Subject', 'error');
      return;
    }
    if(this.basicForm.deptId === null){
      swal('', 'Kindly select Department', 'error');
      return;
    }
    
    if(this.basicForm.startDate === null){
      swal('', 'Kindly select the Start Date Picker', 'error');
      return;
    }
    if(this.basicForm.endDate === null){
      swal('', 'Kindly select the Expiry Date Picker', 'error');
      return;
    }

    if(this.basicForm.starthour === null){
      swal('', 'Kindly fill start hour', 'error');
      return;
    }
    if(this.basicForm.startminute === null){
      swal('', 'Kindly fill start minute', 'error');
      return;
    }
    if(this.basicForm.startamOrPm === null){
      swal('', 'Kindly fill Start time AM/PM', 'error');
      return;
    }
    if(this.basicForm.endhour === null){
      swal('', 'Kindly fill End time', 'error');
      return;
    }
    if(this.basicForm.endminute === null){
      swal('', 'Kindly fill end minute', 'error');
      return;
    }

    if(this.basicForm.endamOrPm === null){
      swal('', 'Kindly fill end minute', 'error');
      return;
    }

    if(this.basicForm.notifyTimeInterval === 0){
      swal('', 'Kindly fill notify Time Interval minute', 'error');
      return;
    }
    if(this.basicForm.broadcastType === null){
      swal('', 'Kindly select broadcast Type', 'error');
      return;
    }
    if(this.basicForm.message === null){
      swal('', 'Kindly fill the message', 'error');
      return;
    }

    let startDate = this._GeneralService.dateCompare(this.basicForm.startDate);
    let endDate = this._GeneralService.dateCompare(this.basicForm.endDate);

    if(startDate > endDate)
    {
      swal('', `BroadCast Start Date Could'nt be greater than End Date `, 'error');
      this.basicForm.endDate = null;
      return;
    }
    
    let stDate = this.basicForm.startDate +' '+ this.basicForm.starthour +' '+ this.basicForm.startminute +' '+ this.basicForm.startamOrPm;
    let enDate = this.basicForm.endDate +' '+ this.basicForm.endhour +' '+ this.basicForm.endminute +' '+ this.basicForm.endamOrPm;

    this.basicForm.targetAudience  =   this.basicForm.targetAudienceBoolean == true ? "ALL" : null;
   
   
    console.log('stDate: ', stDate);

    this.basicForm.startDate = stDate;
    this.basicForm.endDate = enDate;
    
    this.actionLoaderSave = true;
    let element = <HTMLInputElement> document.getElementById("btnSave");
    element.disabled = true;
    let url = 'BroadCastMessage/Add'

    this.basicForm.userId = this.getUserDetails.userId;
 
    this._GeneralService.post(this.basicForm, url).subscribe(
        (data: any) => 
        {
          console.log('Save Result: ', data);

          element.disabled = false;
          this.resetForm();

          this.actionLoaderSave = false;

          this.reload = 'Y';

          Swal('', data.responseMessage, 'success');
            
        },
        (error: any) => 
        {
          console.log('error while adding: ', error)
          this.actionLoaderSave = false;
          element.disabled = false;

          Swal('', error.error.responseMessage, 'error');

      });


  }

  update(values: Object): void {

    
    if(this.basicForm.subject === null || this.basicForm.subject === ''){
      swal('', 'Kindly fill the Subject', 'error');
      return;
    }
    if(this.basicForm.message === null){
      swal('', 'Kindly fill message', 'error');
      return;
    }
    if(this.basicForm.broadcastType === null){
      swal('', 'Kindly fill broadcastType', 'error');
      return;
    }
    if(this.basicForm.deptId === null){
      swal('', 'Kindly fill Deptment', 'error');
      return;
    }
    if(this.basicForm.starthour === null){
      swal('', 'Kindly fill start hour', 'error');
      return;
    }
    if(this.basicForm.startminute === null){
      swal('', 'Kindly fill start minute', 'error');
      return;
    }
    if(this.basicForm.startamOrPm === null){
      swal('', 'Kindly fill Start time AM/PM', 'error');
      return;
    }
    if(this.basicForm.endhour === null){
      swal('', 'Kindly fill End time', 'error');
      return;
    }
    if(this.basicForm.subject === null){
      swal('', 'Kindly fill end minute', 'error');
      return;
    }

    if(this.basicForm.endamOrPm === null){
      swal('', 'Kindly fill end minute', 'error');
      return;
    }

    if(this.basicForm.notifyTimeInterval === 0){
      swal('', 'Kindly fill notify Time Interval minute', 'error');
      return;
    }

    let startDate = this._GeneralService.dateCompare( this.basicForm.startDate);
    let endDate = this._GeneralService.dateCompare( this.basicForm.endDate);

   
    if(startDate > endDate)
    {
      swal('', `BroadCast Start Date Could'nt be greater than End Date `, 'error');
      this.basicForm.endDate = null;
      return;
    }


      let stDate = this.basicForm.startDate +' '+ this.basicForm.starthour +' '+ this.basicForm.startminute +' '+ this.basicForm.startamOrPm;
      let enDate = this.basicForm.endDate +' '+ this.basicForm.endhour +' '+ this.basicForm.endminute +' '+ this.basicForm.endamOrPm;
  
      this.basicForm.targetAudience  =   this.basicForm.targetAudienceBoolean == true ? "ALL" : null;
     
      this.basicForm.startDate = stDate;
      this.basicForm.endDate = enDate;
      
      this.actionLoaderUpdate = true;
      let element = <HTMLInputElement> document.getElementById("btnUpdate");
      
      element.disabled = true;
      let url = 'BroadCastMessage/Update'

      this.basicForm.userId = this.getUserDetails.userId;

      console.log("this.basicForm = ", this.basicForm);

      this._GeneralService.post(values, url).subscribe(
        (data: any) => 
        {

          console.log('Save Result: ', data);


          element.disabled = false;
          this.actionLoaderUpdate =  false;
          this.reload = 'Y';
       
          if(data.responseCode == 1)
            Swal('', data.responseMessage, 'success');
          else
            Swal('', data.responseMessage, 'error');
            //this.splitData(this.dataStartDate);
            this.basicForm.startDate = this._GeneralService.dateconvertion(this.dataStartDate);
            this.basicForm.endDate = this._GeneralService.dateconvertion(this.dataEndDate);
        },
        (error: any) => {
          
          console.log('error ', error);
          element.disabled = false;
          this.actionLoaderUpdate =  false;
          //this.splitData(this.dataStartDate);
          this.basicForm.startDate = this._GeneralService.dateconvertion(this.dataStartDate);
          this.basicForm.endDate = this._GeneralService.dateconvertion(this.dataEndDate);
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

  close(): void 
  {
    this.dialogRef.close(this.reload);
  }

  						  
  startDate(event){
    alert("eventss " + event.target.value);
    let val = this._GeneralService.dateconvertion(event.target.value);
    this.basicForm.startDate = val;

    let startDate = this._GeneralService.dateCompare( this.basicForm.startDate);
    let endDate = this._GeneralService.dateCompare( this.basicForm.endDate);
    // console.log(' startDate(event)', endDate)

    // if(startDate > endDate)
    // {
    //   swal('', `BroadCast Start Date Could'nt be greater than End Date `, 'error');
    //   this.basicForm.endDate = null;
    //   return;
    // }
    
  }

  startDate1(event){
    //alert(event);
    //console.log("event", event);
    let val = this._GeneralService.dateconvertion(event);
    this.basicForm.startDate = val;

    let startDate = this._GeneralService.dateCompare( this.basicForm.startDate);
    let endDate = this._GeneralService.dateCompare( this.basicForm.endDate);
    // console.log(' startDate(event)', endDate)

    // if(startDate > endDate)
    // {
    //   swal('', `BroadCast Start Date Could'nt be greater than End Date `, 'error');
    //   this.basicForm.endDate = null;
    //   return;
    // }
    
  }
    						  
  endDate(event){

    let val = this._GeneralService.dateconvertion(event.target.value);
    this.basicForm.endDate = val;

    let startDate = this._GeneralService.dateCompare( this.basicForm.startDate);
    let endDate = this._GeneralService.dateCompare( this.basicForm.endDate);

    if(startDate > endDate)
    {
      swal('', `BroadCast Start Date Could'nt be greater than End Date `, 'error');
      this.basicForm.endDate = null;
      return;
    }
    
  }

  endDate1(event){

    let val = this._GeneralService.dateconvertion(event);
    this.basicForm.endDate = val;

    let startDate = this._GeneralService.dateCompare( this.basicForm.startDate);
    let endDate = this._GeneralService.dateCompare( this.basicForm.endDate);

    if(startDate > endDate)
    {
      swal('', `BroadCast Start Date Could'nt be greater than End Date `, 'error');
      this.basicForm.endDate = null;
      return;
    }
    
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




