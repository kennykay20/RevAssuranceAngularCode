import { PostTransDetailsComponent } from './../post-trans-details/post-trans-details.component';
import { RejReasonComponent } from './../../RejectionReason/rej-reason/rej-reason.component';
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
import { UserDetails } from '../../../../model/userDetails';
import { CbsTransaction } from '../../../../model/cbsTransaction.model';
import { ActivatedRoute } from '@angular/router';
import { PostTransResponse } from '../../../../model/PostTransResponse';
declare var $;

@Component({
  selector: 'app-post-alert',
  templateUrl: './post-alert.component.html',
  styleUrls: ['./post-alert.component.scss']
})
export class PostAlertComponent implements OnInit {

  @ViewChild('dataTable') table: ElementRef;

  @Input('alertPostTrans') alertPostTrans;
  @Input('viewTransDetails') viewTransDetails;
  @Input('postTransResponse') postTransResponse;
  @Input('postTransResponseList') postTransResponseList;

 // alertPostTrans = false;
 // viewTransDetails = false;
 // postTransResponse: PostTransResponse;
 // postTransResponseList: PostTransResponse[];


  constructor(public appSettings: AppSettings,
    public dialog: MatDialog,
    public _GeneralService: GeneralService,
    private route: ActivatedRoute) {
  }

  
  ngOnInit() {

  }


  closeAlertPostTrans() {
    console.log('closeAlertPostTrans', this.alertPostTrans);
    if (this.alertPostTrans === false) {
      console.log('closeAlertPostTran 1');
      this.alertPostTrans = true;
    }
    else if (this.alertPostTrans === true) {
      console.log('closeAlertPostTran 2');
      this.alertPostTrans = false;
    }

    this.viewTransDetails = false;

  }

  viewTransPostDetails() {
    console.log('closeAlertPostTrans', this.viewTransDetails);
    if (this.viewTransDetails === false) {
      console.log('closeAlertPostTran 1');
      this.viewTransDetails = true;
    }
    else if (this.viewTransDetails === true) {
      console.log('closeAlertPostTran 2');
      this.viewTransDetails = false;
    }
  }
}
