
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
// import { ViewAgentdetailsComponent } from './view-agent/view-agentdetails/view-agentdetails.component';
// import { UpdateAgentComponent } from './view-agent/update-agent/update-agent.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { UnapproveUserComponent } from './unapprove-user/unapprove-user.component';
import { DeclineUserComponent } from './decline-user/decline-user.component';
import { DeactivateUserComponent } from './deactivate-user/deactivate-user.component';
import { ApproveUserComponent } from './approve-user/approve-user.component';
import { UserTypeComponent } from './user-type/user-type.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { PagTestComponent } from './pag-test/pag-test.component';


export const routes = [
    { path: '', redirectTo: 'user', pathMatch: 'full'},
    { path: 'CreateUser', component: CreateUserComponent, data: { breadcrumb: 'Create User' } },
    { path: 'UnapproveUser', component: UnapproveUserComponent, data: { breadcrumb: 'Unapprove User' } },
    { path: 'approveuser', component: ApproveUserComponent, data: { breadcrumb: 'approve user' } },
    { path: 'deactivateuser', component: DeactivateUserComponent, data: { breadcrumb: 'deactivate user' } },
    { path: 'declineuser', component: DeclineUserComponent, data: { breadcrumb: 'decline user' } },
    { path: 'userType', component: UserTypeComponent, data: { breadcrumb: 'User type' } },
    { path: 'user', component: AllUsersComponent, data: { breadcrumb: 'All Users' } },
    { path: 'pageTest', component: PagTestComponent, data: { breadcrumb: 'Page Test' } }
    
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
      CreateUserComponent, 
      UnapproveUserComponent, 
      CreateUserComponent, 
      DeclineUserComponent,
      DeactivateUserComponent,
      ApproveUserComponent,
      UserTypeComponent,
      AllUsersComponent,
      PagTestComponent
  ],
  // entryComponents: [  
    
  // ],
  providers: [  WaitingDialog, TablesService
  ],
})
export class ManageUserModule { }


