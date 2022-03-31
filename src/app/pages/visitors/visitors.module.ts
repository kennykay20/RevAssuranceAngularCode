
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
import { RegAGuestComponent } from './reg-a-guest/reg-a-guest.component';
import { MyVisitorComponent } from './my-visitor/my-visitor.component';
import { ValVisitorCodeComponent } from './val-visitor-code/val-visitor-code.component';
import { AllVisitorComponent } from './all-visitor/all-visitor.component';


export const routes = [
    { path: '', redirectTo: 'vis', pathMatch: 'full'},
    { path: 'vis', component: RegAGuestComponent, data: { breadcrumb: 'Create User' } },
    { path: 'myvisitors', component: MyVisitorComponent, data: { breadcrumb: 'Unapprove User' } },
    { path: 'valvisitorcode', component: ValVisitorCodeComponent, data: { breadcrumb: 'approve user' } },
    { path: 'allvis', component: AllVisitorComponent, data: { breadcrumb: 'approve user' } }

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
  RegAGuestComponent,
      MyVisitorComponent,
      ValVisitorCodeComponent,
      AllVisitorComponent],
//entryComponents: [  
  // ],
  providers: [  WaitingDialog, TablesService
  ],
})
export class VisitorModule { }

