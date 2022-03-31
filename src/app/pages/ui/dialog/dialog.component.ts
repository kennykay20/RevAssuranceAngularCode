import { LocalStorageService } from 'angular-2-local-storage';
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { Router, ActivatedRoute } from '@angular/router';
import { GenModel } from '../../../model/gen.model';

import { map } from 'rxjs/operators';
import { GeneralService } from '../../../services/genservice.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html'
})
export class DialogComponent {
  public animal: string;
  public name: string;

  public settings: Settings;
  constructor(public appSettings: AppSettings, public dialog: MatDialog) {
    this.settings = this.appSettings.settings;
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {
  hide = false;
  txt: any;

  userInfo: any;
  timeLeft = 60;
  interval;


  userLoginInfo = GenModel.userLoginInfo;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, public router: Router,
    private _localStorageService: LocalStorageService, public _GeneralService: GeneralService, ) {

    this.userInfo = this._localStorageService.get(this.userLoginInfo);
    this.startTimer();

  }
  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.txt = `You will be Signed Out in ${this.timeLeft}  Seconds! Click on Cancel to remain in Session`;
        this.timeLeft--;
      }
      else {
        this.logout();
      }
    }, 100);
  }

  onNoClick(): void {
    this.hide = true;
    this.dialogRef.close();
  }

  logout() {
    this.onNoClick();
    this.router.navigate(['.']);
  }
}