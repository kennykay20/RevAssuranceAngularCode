
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
import { MakePaymentComponent } from './make-payment/make-payment.component';
import { AllPaymentComponent } from './all-payment/all-payment.component';
import { PaymentHisComponent } from './payment-his/payment-his.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { ViewFineDetailsComponent } from './view-fine-details/view-fine-details.component';

import {	MatDialogRef, MatDialogModule } from '@angular/material';
import { FineDetailsComponent } from './make-payment/fine-details/fine-details.component';
 import { Angular4PaystackModule } from 'angular-paystack';
import { AddWaiverComponent } from './add-waiver/add-waiver.component';
import { ViewWaiverComponent } from './view-waiver/view-waiver.component';
import { ApproveWaiverComponent } from './approve-waiver/approve-waiver.component';
import { OutServiceDetailsComponent } from './make-payment/out-service-details/out-service-details.component';
import { ElectricityServiceDetailsComponent } from './make-payment/electricity-service-details/electricity-service-details.component';
import { MyTokComponent } from './make-payment/my-tok/my-tok.component';
import { ExcelDwnComponent } from './all-payment/excel-dwn/excel-dwn.component';

export const routes = [
    { path: '', redirectTo: 'pay', pathMatch: 'full'},
    { path: 'pay', component: MakePaymentComponent, data: { breadcrumb: 'Make Payment' } },
    { path: 'allPayment', component: AllPaymentComponent, data: { breadcrumb: 'All Payment' } },
    { path: 'paymenthis', component: PaymentHisComponent, data: { breadcrumb: 'Payment History' } },
    { path: 'fineDetails', component: FineDetailsComponent, data: { breadcrumb: 'fine Details' } },
    { path: 'checkOut', component: CheckOutComponent, data: { breadcrumb: 'checkOut' } },
    { path: 'addview', component: AddWaiverComponent, data: { breadcrumb: 'Add Waiver' } },
    { path: 'viewWai', component: ViewWaiverComponent, data: { breadcrumb: 'View Waiver' } },
    { path: 'appWai', component: ApproveWaiverComponent, data: { breadcrumb: 'Approve Waiver' } },
    { path: 'outstanding-detail', component: OutServiceDetailsComponent, data: { breadcrumb: 'Approve Waiver' } },
    { path: 'elect-detail', component: ElectricityServiceDetailsComponent, data: { breadcrumb: 'Electricity Service Details' } },
    { path: 'my-tok', component: MyTokComponent, data: { breadcrumb: 'My-token' } },
];

@NgModule({
  imports: [
     // Angular4PaystackModule.forRoot('pk_test_0839a956b8d918321730bcbc7c5131ff46aa4a91'),
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    MatDialogModule,
    // Angular4PaystackModule.forRoot('pk_test_0839a956b8d918321730bcbc7c5131ff46aa4a91')
  ],
  declarations:
  [
      
      MakePaymentComponent,
      AllPaymentComponent,
      PaymentHisComponent,
     FineDetailsComponent,
     CheckOutComponent,
     ViewFineDetailsComponent,
     AddWaiverComponent,
     ViewWaiverComponent,
     ApproveWaiverComponent,
     OutServiceDetailsComponent,
     ElectricityServiceDetailsComponent,
     MyTokComponent,
     ExcelDwnComponent
    ],
    entryComponents: [  
      FineDetailsComponent,
      ExcelDwnComponent
  ],
  providers: [  WaitingDialog, TablesService
  ],
})
export class PaymentModule { }

