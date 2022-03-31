import { AddFineComponent } from './add-fine/add-fine.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import {  WaitingDialog } from '../../services/services';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FilteringComponent } from '../tables/filtering/filtering.component';
import { TablesService } from '../tables/tables.service';
import { AllChargesComponent } from './all-charges/all-charges.component';
import { MyFinesComponent } from './my-fines/my-fines.component';


import { AllFineComponent } from './all-fine/all-fine.component';
import { ApplyWaiverComponent } from './apply-waiver/apply-waiver.component';
import { PendingWaiverComponent } from './pending-waiver/pending-waiver.component';
import { ApproveWaiverComponent } from './approve-waiver/approve-waiver.component';
import { AllFineWaiversComponent } from './all-fine-waivers/all-fine-waivers.component';


export const routes = [
    { path: '', redirectTo: 'chg', pathMatch: 'full'},
    { path: 'chg', component: AddFineComponent, data: { breadcrumb: 'Add fine' } },
    { path: 'all', component: AllChargesComponent, data: { breadcrumb: 'All Charges' } },
    { path: 'my-fine', component: MyFinesComponent, data: { breadcrumb: 'My Fines' } },

    { path: 'all-fine', component: AllFineComponent, data: { breadcrumb: 'All Fines' } },
    { path: 'apply-waiver', component: ApplyWaiverComponent, data: { breadcrumb: 'Apply Waiver' } },
    { path: 'pending-waiver', component: PendingWaiverComponent, data: { breadcrumb: 'Pending Waiver' } },
    { path: 'approve-waiver', component: ApproveWaiverComponent, data: { breadcrumb: 'Approve Waiver' } },
    { path: 'all-fine-waiver', component: AllFineWaiversComponent, data: { breadcrumb: 'All Fine Waivers' } },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxDatatableModule,
  
  ],
  declarations:
  [
    AddFineComponent,
    AllChargesComponent,
    MyFinesComponent,
    AllFineComponent,
    ApplyWaiverComponent,
    PendingWaiverComponent,
    ApproveWaiverComponent,
    AllFineWaiversComponent
  ],
  // entryComponents: [  
    
  // ],
  providers: [  WaitingDialog, TablesService
  ],
})
export class ChargesModule { }


