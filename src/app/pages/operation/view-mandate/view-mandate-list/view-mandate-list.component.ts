


import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BankservicesetupDetailsComponent } from './../../../admin/bankServiceSetUp/bankservicesetup-details/bankservicesetup-details.component';
import { GenModel } from './../../../../model/gen.model';
import Swal from 'sweetalert2';
import { GeneralService } from './../../../../services/genservice.service';
import { Component, ViewChild,  OnInit,  ElementRef, Directive, Input, } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import { List } from 'linqts';
import {  WaitingDialog } from '../../../../services/services';
import { LocalStorageService } from 'angular-2-local-storage';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { admService } from '../../../../model/admService';
import { InstrumentForm } from '../../../../model/instrumentForms.model';
import { TemplateComponent } from '../../../ui/dialog/template/template.component';
import { PrintTemComponent } from '../../../ui/dialog/print-tem/print-tem.component';
import { ViewMandateDetailsComponent } from '../view-mandate-details/view-mandate-details.component';
import { Mandate } from '../../../../model/mandate.model';
import { SweetAlertService } from '../../../../services/sweetAlert.service';


declare var $;



@Component({
  selector: 'app-view-mandate-list',
  templateUrl: './view-mandate-list.component.html',
  styleUrls: ['./view-mandate-list.component.scss']
})
export class ViewMandateListComponent implements OnInit {
 //  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('dataTable') table: ElementRef;
  
  dataTable: any;

  editing = {};
  //rows: any; // = [];
  //temp = [];
  instrumentForm: InstrumentForm;
  lstSignaturePhoto: Mandate[];
  firstlstSignaturePhoto: Mandate; 
  lstMandate: Mandate[]
  firstlstMandate: Mandate
  mandate: Mandate;
  genMandate: Mandate[];
  tempContent = '';
  tracerPrint: string = 'ppppp';
  rows: InstrumentForm [];
  columns = [];
  temp: InstrumentForm [];
  current_page = 1;


  selectAllText: any;
  actionLoaderDismiss = false;
  actionLoaderUpdate = false;
  tabVlues = 1;
  selectedAll  = false;

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
  retryService: number =  GenModel.retryService;
  retryMessage: any;
  retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
  internetConMsg = GenModel.internetConMsg;
  RetryAttmMsg = GenModel.RetryAttmMsg;

  pageLmit = GenModel.pageLmit;
  btnConfirm = GenModel.btnConfirm;
  searchUserColumns: any;
  ItemsPerPage: any;
  columnId: any 
  statusTrack: any;
  errorOccur = GenModel.errorOccur;

  selectedAllTrans =  false;
  
  unAuthorized =  false;


tab1 = '';
tab2 = '';



coinwallet: string[] = ['wallet1','wallet2'];
selectedwallet = this.coinwallet[0];


origMobile = [];

step = 'brown';

apiIsDown = GenModel.apiIsDown;

 selectedCalss = 'selected nav-item cursorPointer';
 selectedCalss2 = 'selected nav-item cursorPointer';
 selectedCalss3 = 'selected nav-item cursorPointer';

 serviceId = 19;

 chargeSetup: any;
assignRole: any
menuId: any
admService: admService;
loderTimer = GenModel.LoderTimer;
acttypes = []
photo: string
noMandateMsg = GenModel.noMandateMsg;

  constructor(public appSettings: AppSettings, public dialog: MatDialog,
              public _GeneralService: GeneralService,
              private _localStorageService: LocalStorageService,
              private route: ActivatedRoute,
              private sweetAlertService: SweetAlertService) 
    {
       this.settings = this.appSettings.settings; 
       let queryString = this.route.snapshot.params.mid;
       this.menuId = _GeneralService.menuId(queryString);
    
    }

    

  ngOnInit() 
  {
    console.log('1')
      this.loadAcctTypes();

      this.instrumentForm = new InstrumentForm();
      this.instrumentForm.acctNo = null;
      this.instrumentForm.acctType = null;
   
  }

  loadAcctTypes(): void {
    console.log('2')
    this.loadPage = true;
    let track = 0;
    let url = 'AccountType/GetAll';
  
  
      let val = 
        {
          AId: 1,
        }
  
       
  
  this._GeneralService.post(val, url)
  .subscribe(
    (data: any) =>  {
      
      console.log('data: ', data);
      this.acttypes = data;
      console.log('this.acttypes: ', this.acttypes);
        
    },
    (error: any) => 
    {
      console.log('error: ', error  );
  });
  }

  


   load(param: any): void {

    console.log('load param', param);

    this.loadPage = true;


    let track = 0;
    let url = 'Instrument/GetAll';


      let val = 
        {
          pdtCurrentDate: param.bankingDate,
          psBranchNo: param.branchNo,
          pnDeptId: param.deptId,
          pnGlobalView: 'N', // hard code will later get this from role Assing
          serviceId: this.serviceId,
          roleId: param.roleId,
          menuId:  this.menuId
        }

        console.log('token param load', val);

  this._GeneralService.post(val, url)
  .retryWhen((err) => {

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
  }).subscribe(
    (data: any) => 
    {
      console.log('data apg: ', data);
      this.loadPage = false;
      this.temp = data._response;
      this.rows = data._response;
      this.admService = data.admService;
      
      this.chargeSetup = data.charge;
      this.loadPage = false;

      let UnAuth = new List<any>(data._response).Where(c=> c.serviceStatus == "Unauthorized").ToArray();

      let NotUnAuth = new List<any>(data._response).Where(c=> c.serviceStatus != "Unauthorized").ToArray();
     
      console.log
      let pus = [] ;
      pus.push(NotUnAuth);

      this.assignRole = data.roleAssign;

        if(data._response.length > 0)
      {
        this.rows  =  data._response.slice(0, this.pageLmit);
        this.changePage(this.current_page);
      }

      

     
        
    },
    (error: any) => 
    {

      //this.handleError(error);

      if(track === this.retryService)
      {
        Swal('', this.apiIsDown, 'error');
      }
      else
      {
        Swal('', this.errorOccur, 'error');

      }
  });
}




  changePage(page)
  {
      let btn_next = document.getElementById("btn_next");
      let btn_prev = document.getElementById("btn_prev");
    // let listing_table = document.getElementById("listingTable");
      let page_span = document.getElementById("page");
  
      // Validate page
      if (page < 1) page = 1;

      if (page > this.numPages()) page = this.numPages();

      let tem = []; 

      for (let i = ( page - 1 ) * this.pageLmit; i < (page * this.pageLmit) && i < this.temp.length; i++) 
      {
          tem.push(this.temp[i]);
      }

      this.rows = tem;

      page_span.innerHTML = page + "/" + this.numPages();

  }

  numPages()
  {
      return Math.ceil(this.temp.length / this.pageLmit);
  }

  onload = function() {
    this.changePage(1);
  };




  select(row)
  {
        console.log('selected row', row);

        let valRe = new List<any>(this.rows).FirstOrDefault(c=> c.itbid === row.itbId);

        if (row.serviceStatus === "Unauthorized") {
          swal('','This request has already been Processed', 'error')
          return;
        }

        const objIndex = this.selectedRec.findIndex(obj => obj.itbId === row.itbId);

        if (objIndex > -1) 
        {
          this.selectedRec.splice(objIndex, 1);
        }
        else
        {
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

  
  selectAll1() {


    let selonlyLoadedStatus = new List<any>(this.rows).Where(c=> c.serviceStatus != 'Unauthorized').ToArray();
    
    console.log('selonlyLoadedStatus: ', selonlyLoadedStatus);

    let seletAuth = new List<any>(this.rows).Where(c=> c.serviceStatus === 'Unauthorized').ToArray();

    console.log('selonly Auth: ', seletAuth);

    for (let i = 0; i < selonlyLoadedStatus.length; i++) {

          selonlyLoadedStatus[i].select = this.selectedAllTrans;
          
          this.rows[i].select =  this.selectedAllTrans;

          const objIndex = this.selectedRec.findIndex(obj => obj.itbId === selonlyLoadedStatus[i].itbId);

          if (objIndex > -1) 
          {
            this.selectedRec.splice(objIndex, 1);
          }
          else
          {
            this.selectedRec.push({ 
              itbId:  selonlyLoadedStatus[i].itbId,
              acctName: selonlyLoadedStatus[i].acctName,
              acctNo: selonlyLoadedStatus[i].acctNo,
              acctType: selonlyLoadedStatus[i].acctType,
              branchName: selonlyLoadedStatus[i].branchName,
              ccyCode: selonlyLoadedStatus[i].ccyCode,
              chgAcctNo: selonlyLoadedStatus[i].chgAcctNo,
              datecreated: selonlyLoadedStatus[i].datecreated,
              recordDate: selonlyLoadedStatus[i].recordDate,
              referenceNo: selonlyLoadedStatus[i].referenceNo,
              select: selonlyLoadedStatus[i].select,
              serialNo: selonlyLoadedStatus[i].serialNo,
              serviceId: selonlyLoadedStatus[i].serviceId,
              serviceStatus: selonlyLoadedStatus[i].serviceStatus,
              transactionDate: selonlyLoadedStatus[i].transactionDate,
              userId: selonlyLoadedStatus[i].userId,
              userName: selonlyLoadedStatus[i].userName,
  
            });
          }

        }

        console.log('selonlyLoadedStatus after: ', selonlyLoadedStatus);

        console.log('this.selectedRec after: ', this.selectedRec); 

       

       console.log('selectAll this.rows: ', this.rows);

    }





  View(action: any, record: InstrumentForm, createdBy: any): void
   {

    let dialogRef = this.dialog.open(ViewMandateDetailsComponent, {

      // width: '3500px',
      // height: '800px',
      // hasBackdrop: true,
       disableClose: true,
      // autoFocus: true,
      data: { actionName: action, record:  record, createdBy: createdBy, 
              chargeSetup: this.chargeSetup, serviceId:  this.serviceId, 
              serviceName: 'ADVANCE PAY. GUARANTEE',  admService :  this.admService,
              itbId: record.itbId
            },
     
    });

    dialogRef.afterClosed().subscribe(result => {
      
      if(result === 'Y'){
        let getUserDetails =  this._GeneralService.getUserDetails();
        this.load(getUserDetails);
      }
     
    });
  }






openPrintTemp(data: any): void {

    let dialogRef = this.dialog.open(PrintTemComponent, {
      data: { data: data }
    });

    dialogRef.afterClosed().subscribe(result => {

         console.log('tem  close res',   result);
    });

}

openMandate(data:Mandate[]){
  let dialogRef = this.dialog.open(ViewMandateDetailsComponent, {

    // width: '3500px',
    // height: '800px',
    // hasBackdrop: true,
     disableClose: true,
    // autoFocus: true,
    data: {  data: data, 
          
          },
   
  });

  dialogRef.afterClosed().subscribe(result => {
    
    
   
  });
}

getMandate1(): void
{
  let element = <HTMLInputElement> document.getElementById("btnMandate");
  element.disabled = true;

  this.actionLoaderUpdate = true;


 let data = this._GeneralService.getMandate(this.instrumentForm.acctNo, this.instrumentForm.acctType).subscribe(
  (data: any) => 
  {
    console.log('getMandate view:', data);
     return data;
    //  element.disabled = false;


    //   this.openMandate(data);

      // this.actionLoaderUpdate = false;
      
     /*
     this.genMandate = data;
      this.mandate = this.genMandate[0];


      this.lstSignaturePhoto =  new List<Mandate>( this.genMandate).Where(c=> c.mandateType == 'SIGNATURE').ToArray();
      console.log('lstSignaturePhoto', this.lstSignaturePhoto);
      this.lstMandate  =new List<Mandate>( this.genMandate).Where(c=> c.mandateType == 'MANDATE').ToArray();

      console.log('lstMandate', this.lstMandate);

     this.firstlstSignaturePhoto = new Mandate();


    if(this.lstSignaturePhoto.length > 0){
     
      this.firstlstSignaturePhoto.photoBase64 = this.lstSignaturePhoto[0].photoBase64;
      this.firstlstSignaturePhoto.signatory = this.lstSignaturePhoto[0].signatory
    }
   
    */


 
    



  },
  (error: any) => {
    
   // element.disabled = false;
   // this.actionLoaderUpdate = false;
    Swal('', error.error.responseMessage, 'error');
});
 console.log('getMandate 2')
 if(data != null)
 {
  console.log('getMandate 2')
  element.disabled = false;
  this.openMandate(data);
  this.actionLoaderUpdate = false;
}
       
        
  
 

   
      





}


getMandate(): void {

  let val = {

    acctNo: this.instrumentForm.acctNo,
    AcctType: this.instrumentForm.acctType
  }

  if (this.instrumentForm.acctNo == null && this.instrumentForm.acctType == null) {
    Swal('', 'Supply Details', 'error');
    return;
  }

  let url = 'Mandate/GetMandate';

  let element = <HTMLInputElement>document.getElementById("btnMandate");
  element.disabled = true;

  this.loadPage = true;


  this._GeneralService.post(val, url).subscribe(
    (data: any) => {
      //console.log('view mandate', data.length);
      this.loadPage = false;
      element.disabled = false;

      if (data.length === 0) {
        this.sweetAlertService.errorAlert(this.noMandateMsg);
        return;
      }

      this.openMandate(data);
    },
    (error: any) => {

      element.disabled = false;
      this.loadPage = false;
      Swal('', error.error.responseMessage, 'error');
    });

}

loadMoreSignature(row: Mandate)
{
  this.firstlstSignaturePhoto.photoBase64 = row.photoBase64 ;
  this.firstlstSignaturePhoto.signatory = row.signatory

}

}