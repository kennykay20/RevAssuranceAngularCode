import { MyProfileComponent } from './my-profile/my-profile.component';

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import {  WaitingDialog } from '../../services/services';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TablesService } from '../tables/tables.service';



export const routes = [
    { path: '', redirectTo: 'prf', pathMatch: 'full'},
    { path: 'my-profile', component: MyProfileComponent, data: { breadcrumb: 'My Profile' } }
];






@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxDatatableModule,
   // Angular4PaystackModule.forRoot('pk_test_0839a956b8d918321730bcbc7c5131ff46aa4a91')
  ],
  declarations:
  [ MyProfileComponent],
  // entryComponents: [  
    
  // ],
  providers: [  WaitingDialog, TablesService
  ],
})
export class ProfileModule { }

