import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BroadCastMessage } from '../../../../model/broadcastMessage';
import { GeneralService } from '../../../../services/genservice.service';
import { List } from 'linqts';
import { UserDetails } from '../../../../model/userDetails';

@Component({
  selector: 'app-broadcastmessage-view',
  templateUrl: './broadcastmessage-view.component.html',
  styleUrls: ['./broadcastmessage-view.component.scss']
})
export class BroadcastmessageViewComponent implements OnInit {

  rows: BroadCastMessage [];
  getUserDetails: UserDetails;
  constructor( public dialogRef: MatDialogRef<BroadcastmessageViewComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               public _GeneralService: GeneralService,) 
               {

                    console.log('data temp ', data);
                    this.rows = data.data._response;

                    this.getUserDetails =  this._GeneralService.getUserDetails();

                     let todaysdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

                    let get = new List<BroadCastMessage>(this.rows).Where(c=> c.deptId == this.getUserDetails.deptId
                                 && c.targetAudience == 'ALL' && c.startDate == todaysdate && c.endDate < todaysdate);

                                 console.log('data temp get', get);

                    for(let i = 0; i < this.rows.length; i++)
                    {
                       if(this.rows[i] == undefined){
                        this.rows[i].startDate = this.rows[i].startDate  != null ?  this._GeneralService.dateCreated(this.rows[i].startDate) : this.rows[i].startDate ;
                        this.rows[i].endDate = this.rows[i].endDate  != null ?   this._GeneralService.dateCreated(this.rows[i].endDate) : this.rows[i].endDate;
                       }
                    }

                    console.log('data temp bro ', this.rows );
                    
                }

  ngOnInit() {
  }

  cancel(): void 
  {
    this.dialogRef.close();
  }

  submit(): void 
  {
    this.dialogRef.close(this.data.data);
  }

}

