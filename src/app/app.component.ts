import { GeneralService } from './services/genservice.service';
import { GenModel } from './model/gen.model';
import {
  Component, ViewChild, ViewEncapsulation,
  ElementRef, HostListener, OnInit
} from '@angular/core';
import { AppSettings } from './app.settings';
import { Settings } from './app.settings.model';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Idle, DEFAULT_INTERRUPTSOURCES, LocalStorage } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { DialogOverviewExampleDialog } from './pages/ui/dialog/dialog.component';
import { UserDetails } from './model/userDetails';
import { BroadcastmessageViewComponent } from './pages/ui/dialog/broadcastmessage-view/broadcastmessage-view.component';
import { SweetAlertService } from './services/sweetAlert.service';
import { BroadCastMessage } from './model/broadcastMessage';
import { List } from 'linqts';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  getUserDetails: UserDetails;
  clientProfile: any;
  idleState = 'Not started.';
  timedOut = false;
  timer: any;
  lastPing?: Date = null;
  timingOut: boolean = false;
  timeoutNumber: number = 5;
  userLoginInfo = GenModel.userLoginInfo;
  broadCastMsg = GenModel.broadCastMsg;
  @ViewChild('closeAddExpenseModal7') closeAddExpenseModal7: ElementRef;
  @ViewChild('closeAddExpenseModal9') closeAddExpenseModal9: ElementRef;
  role = GenModel.role;
  @HostListener('document:mousemove', ['$event'])

  onMouseMove(e) {

    // console.log('onMouseMove');

    if (this.timingOut) {
      this.reset();
      this.timingOut = false;
      //this.closeAddExpenseModal9.nativeElement.click();
      this.timeoutNumber = 5;
      this.endAndStartTimer(false);
    }
  }

  public settings: Settings;

  broadCastMessage = '';
  subject = '';
  itbIdOfReadMessage: number;
  setDisplayBroadCast = false;

  userDetails: UserDetails;
  readMore = false;
  broadCastMessageList: BroadCastMessage[];
  broadCastFetchInterval =  100000; // this is to set the time the server referesh broadcast from the server. u can set tp 1000 to test
  // to implement so that if close is click, it should not pop up message again
  
  public href: string = "";
  constructor(public appSettings: AppSettings, private router: Router,
    private _localStorageService: LocalStorageService, private idle: Idle,
    private keepalive: Keepalive, public dialog: MatDialog,
    private _GeneralService: GeneralService, private _sweetAlertService: SweetAlertService,
    ) {
    this.settings = this.appSettings.settings;

    //this._sweetAlertService.errorAlert('Hey alert');
    this.loadClientProfile();
    this.href = this.router.url;
   
      // idle.setIdle(60); //this.clientProfile.systemIdleTimeout
      // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
      idle.setTimeout(1);
      // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
      idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

      idle.onIdleEnd.subscribe(() => {
        // console.log('onId idle.onIdleEnd');  
        this.idleEnd();
      });

      idle.onTimeout.subscribe(() => {
        // console.log('onId idle.onTimeoutleStart');
      });

      idle.onIdleStart.subscribe(() => {
        //console.log('onIdleStart');
        let userInfo = this._localStorageService.get(this.userLoginInfo);


        if (userInfo != null) {
          //console.log('onIdleStart Enter 1');
          if (this.href.trim() != '/') {
            this.openDialog();
          }
          
        }

      });
      idle.onTimeoutWarning.subscribe((countdown) => {
        this.logoutWarning(countdown);
      });
      //sets the ping interval to 15 seconds
      keepalive.interval(10700); // 10700
      keepalive.onPing.subscribe(() => {

        // console.log('keepalive');
        //this.refreshToken()
      });

      this.reset();
    
  }

  ngOnInit() {

   
    console.log("this.setDisplayBroadCast ", this.setDisplayBroadCast);
    
  //  console.log('this.router.url: ', this.router.url);
       
  


    setInterval(() => {
      this.href = this.router.url;
      //console.log('this.router.url: ', this.router.url);
      
      if (this.href.trim() != '/') {
          //console.log('every enters');
          this.runBroadCast();
      } 
       //console.log('every 10mins');
    }, this.broadCastFetchInterval);
      
  }

   testMee = () => {
     console.log('testMee');
  }

  runBroadCast() {
    console.log('runBroadCast() starts: ');
   
    this.userDetails = this._GeneralService.getUserDetails();
        //console.log('readMoreFunc() this.userDetails111:', this.userDetails);
        
        //console.log("this.userDetails ", this.userDetails);
        
        if (this.userDetails != undefined) {
         
          const broadcast = this._localStorageService.get(this.broadCastMsg);

          //console.log('runBroadCast() broadcast: ', broadcast);

          const getClose = this._localStorageService.get(this.broadCastMsg);
          if (getClose == undefined || getClose == null) {

            this.loadBroacast();

          }

        }
      // setInterval(() => {
        
        
      // }, this.broadCastFetchInterval);
  }

  closeBroadCast() {

      this.setDisplayBroadCast = false;

      const broadcast = this._localStorageService.get(this.broadCastMsg);

      this.broadCastMessageList = this.broadCastMessageList || [];
       //console.log('closeBroadCast() broadcast: ', broadcast);
     
      this.broadCastMessageList.push({
        itbId:  this.itbIdOfReadMessage,
        targetAudience: '',
        targetAudienceBoolean: false,
        deptId: '',
        subject: '',
        message: '',
        broadcastType: '',
        userId: '',
        dateCreated: '',
        status: '',
        deptName: '',
        startDate: '',
        endDate: '',
        notifyTimeInterval: 0,
        createdBy: '',
        starthour: '',
        startminute: '',
        startamOrPm: '',
        endhour: '',
        endminute: '',
        endamOrPm: '',
        readBroadCastMessage: true
      });

    //console.log('closeBroadCast()', broadcast);

    this._localStorageService.set(this.broadCastMsg, this.broadCastMessageList);

    //console.log('closeBroadCast() after set local', this._localStorageService.get(this.broadCastMsg));

      let url = 'BroadCastMessage/ReadDueBroadCast';

      let val = {
        pdtCurrentDate: '',// this.getUserDetails.bankingDate,
        psBranchNo: '',// this.getUserDetails.branchNo,
        pnDeptId: this.userDetails.deptId == undefined ? 0 : this.userDetails.deptId,
        pnGlobalView: 'N',
        serviceId: 0,
        menuId: 0,
        roleId: this.userDetails.roleId == undefined ? 0 : this.userDetails.roleId,
        userId: this.userDetails.userId,
        broadCastId : this.itbIdOfReadMessage
      };

      this._GeneralService.post(val, url).subscribe(
        (data: any) => {
  
          console.log('success close messages: ', data);
          //console.log('success broadcast messages: ', data._response)
  
          this.setDisplayBroadCast = false;
          
         
  
        },
        (error: any) => {
        
          //console.log('error broadcast messages: ', error)
  
        });
   
  }

  readMoreFunc(){
    console.log('readMoreFunc():', this.readMore )
      if(this.readMore == true)
      {
        this.readMore = false
      }
      if (this.readMore == false) 
      {
        this.readMore = true
      }
  }


  loadBroacast(): void 
  {
    //console.log('loadBroacast this.userDetails', this.userDetails)
    let url = 'BroadCastMessage/GetDueBroadCast';
    this.getUserDetails = this._GeneralService.getUserDetails();
    let val =
    {
      pdtCurrentDate: '',// this.getUserDetails.bankingDate,
      psBranchNo: '',// this.getUserDetails.branchNo,
      pnDeptId: this.userDetails.deptId == undefined ? 0 : this.userDetails.deptId,
      pnGlobalView: 'N',
      serviceId: 0,
      menuId: 0,
      roleId: this.userDetails.roleId == undefined ? 0 : this.userDetails.roleId,
      userId: this.userDetails.userId
    }

    console.log('this.val', val);

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {

        console.log('success broadcast messages: ', data);
        //console.log('success broadcast messages: ', data._response)

        if(data.respCode == 1)
        {
          this.setDisplayBroadCast = true;
          this.subject = data._response.subject;
          this.broadCastMessage = data._response[0].message;
          this.itbIdOfReadMessage = data._response[0].itbId;
        }
        else{
          this.setDisplayBroadCast = false;
        
        }
        
       

      },
      (error: any) => {
      
        //console.log('error broadcast messages: ', error)

      });
  }

  openDialogBroadCast(data): void {
    let dialogRef = this.dialog.open(BroadcastmessageViewComponent, {
      data: { data: data }
    });

    dialogRef.afterClosed().subscribe(result => {


    });
  }



  //this.clientProfile
  loadClientProfile(): void {

    let url = 'ClientProfile/GetAll';

    let val =
    {
      "aId": 0,
      "userName": "string",
      "password": "string",
      "dateCreated": "2020-05-12T12:08:01.854Z"
    }

    this._GeneralService.post(val, url).subscribe(
      (data: any) => {
        this.clientProfile = data._response;
        let sys = this.clientProfile.systemIdleTimeout * 60;
        this.idle.setIdle(sys);
      },
      (error: any) => {
        console.log('error while adding: ', error)
      });
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: { name: "dog", animal: "lion", start: 'Y' }
    });

    dialogRef.afterClosed().subscribe(result => {
      //  console.log('dialogRef close',   result);

      if (result === 0) {
        this._localStorageService.clearAll();

        this.router.navigate(['.']);
      }
    });
  }

  idleEnd() {
    //   console.log('idleEnd');
  }
  // refreshToken(){
  //       let urlArray = window.location.href.split("/");
  //       let currentPath = urlArray[urlArray.length - 1].toLocaleLowerCase();
  //       if(currentPath !=  'login' && window.location.pathname != '/'){
  //         let res:any = this._localStorageService.get(this.role);
  //           if(!res){
  //               this.router.navigate(['./login']);
  //           }
  //           else
  //           {
  //             let tokenExpiryTime = new Date(res[".expires"]);
  //             let currentTime = new Date();
  //             let timeDiff = Math.abs(tokenExpiryTime.getTime() - currentTime.getTime());
  //             let timeDiffinSeconds: number = timeDiff / 1000;
  //            
  //            
  //             if (timeDiffinSeconds < 580) { //580


  //                 this.api.refreshToken(res.refresh_token).subscribe( newToken => {
  //                 
  //                 this._localStorageService.set(this.role, newToken);  
  //               });
  //             }
  //           }
  //       }
  //     }

  endAndStartTimer(condition: boolean) {
    const self = this;
    if (condition == true) {
      //this.timer = setInterval(self.reduceCount(), 1000);
      this.timer = setInterval(() => { self.reduceCount() }, 1000);
    }
    else {
      clearInterval(this.timer);
      //clearInterval(this.timer);
    }
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }


  logoutWarning(countdown) {
    //  console.log('logoutWarning');
    this.timeoutNumber = 5;

    let urlArray = window.location.href.split("/");
    let currentPath = urlArray[urlArray.length - 1].toLocaleLowerCase();
    if (currentPath != 'login' && window.location.pathname != '/') {

      // console.log('logoutWarning 111');
      // modal warning
      this.timingOut = true;
      //this.closeAddExpenseModal7.nativeElement.click();
      this.openDialog();
      this.endAndStartTimer(true);
    }
    else {
      this.reset();
    }
  }

  reduceCount() {

    this.timeoutNumber--;

    /* if(){ // if user becomes active, reset count, set timeout number = 5, close modal
  
    } */

    if (this.timeoutNumber == 0 && this.timingOut == true) {
      this.reset();
      this._localStorageService.clearAll();
      window.location.href = './';
    }
  }

  getLoginStatus() {

    if (this._localStorageService.get('institutionCode') === null) {

      this.router.navigate(['./']);
    }
  }
}