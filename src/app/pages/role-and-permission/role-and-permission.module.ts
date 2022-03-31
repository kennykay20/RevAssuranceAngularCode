
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

import { RolesComponent } from './roles/roles.component';
import { PermissionComponent } from './permission/permission.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { AssignRoleComponent } from './assign-role/assign-role.component';
// import { Angular4PaystackModule } from 'angular4-paystack';


// export * from './create-user/create-user.component'; 
// export * from './approve-user/approve-user.component';
// export * from './deactivate-user/deactivate-user.component';
// export * from './decline-user/decline-user.component';
// export * from './unapprove-user/unapprove-user.component';



export const routes = [
    { path: '', redirectTo: 'Roles', pathMatch: 'full'},
    { path: 'Roles', component: RolesComponent, data: { breadcrumb: 'Roles' } },
    { path: 'Permission', component: PermissionComponent, data: { breadcrumb: 'Permission' } },
    { path: 'addrole', component: AddRoleComponent, data: { breadcrumb: 'Add Role' } },
    { path: 'assignrole', component: AssignRoleComponent, data: { breadcrumb: 'Assign Role' } }

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
      RolesComponent,
      PermissionComponent,
      AddRoleComponent,
      AssignRoleComponent
  ],
  // entryComponents: [  
    
  // ],
  providers: [  WaitingDialog, TablesService
  ],
})
export class RoleAndPermissionModule { }
