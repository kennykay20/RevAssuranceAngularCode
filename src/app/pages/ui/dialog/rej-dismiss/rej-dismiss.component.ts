import { Component, OnInit } from '@angular/core';
import { AllActionUser } from '../../../../model/AllActionUser.model';
import { GeneralService } from '../../../../services/genservice.service';

@Component({
  selector: 'app-rej-dismiss',
  templateUrl: './rej-dismiss.component.html',
  styleUrls: ['./rej-dismiss.component.scss']
})
export class RejDismissComponent implements OnInit {

  allActionUser: AllActionUser;

  constructor(public _GeneralService: GeneralService) {


    this.allActionUser = new AllActionUser();

    this.allActionUser = this._GeneralService.getSaveRejandDismissDetails();

    console.log('this.allActionUser RejDismissComponent323: ', this.allActionUser)
  }

  ngOnInit() {
  }
}
