
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
// import { CreateAgentComponent, ViewAgentComponent } from './agent-management.component';
import {  WaitingDialog } from '../../services/services';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FilteringComponent } from '../tables/filtering/filtering.component';
// import { NgxTableComponent } from './ngx-table/ngx-table.component';
import { TablesService } from '../tables/tables.service';
import { LodgeComplaintsComponent } from './lodge-complaints/lodge-complaints.component';
import { MyComplaintsComponent } from './my-complaints/my-complaints.component';
import { AllComplaintsComponent } from './all-complaints/all-complaints.component';
import { GetComplaintComponent } from './get-complaint/get-complaint.component';



export const routes = [
    { path: '', redirectTo: 'com', pathMatch: 'full'},
    { path: 'com', component: LodgeComplaintsComponent, data: { breadcrumb: 'Lodge Complaints' } },
    { path: 'mycomplaints', component: MyComplaintsComponent, data: { breadcrumb: 'My Complaints' } },
    { path: 'allcomplaints', component: AllComplaintsComponent, data: { breadcrumb: 'All Complaints' } },
    { path: 'getCom', component: GetComplaintComponent, data: { breadcrumb: 'All Complaints' } },

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
  [
      // CreateUserComponent, 
      // UnapproveUserComponent, 
      // CreateUserComponent, 
      // DeclineUserComponent,
      // DeactivateUserComponent,
      // ApproveUserComponent
      LodgeComplaintsComponent,
      MyComplaintsComponent,
      AllComplaintsComponent,
      GetComplaintComponent
    ],
  // entryComponents: [  
    
  // ],
  providers: [  WaitingDialog, TablesService
  ],
})
export class ComplaintsModule { }
