import { ChequeVendorDetailsComponent } from './cheque-vendor/cheque-vendor-details/cheque-vendor-details.component';
import { ChequeVendorListComponent } from './cheque-vendor/cheque-vendor-list/cheque-vendor-list.component';
import { ChargeConcessionListComponent } from './charge/charge-concession-list/charge-concession-list.component';
import { ChargeConcessionDetailsComponent } from './charge/charge-concession-details/charge-concession-details.component';
import { UserDetailsComponent } from './users/user-details/user-details.component';
import { UserListComponent } from './users/user-list/user-list.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { WaitingDialog } from '../../services/services';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FilteringComponent } from '../tables/filtering/filtering.component';
import { TablesService } from '../tables/tables.service';
import { BankservicesetupListComponent } from './bankServiceSetUp/bankservicesetup-list/bankservicesetup-list.component';
import { BankservicesetupDetailsComponent } from './bankServiceSetUp/bankservicesetup-details/bankservicesetup-details.component';
import { AcctTypeListComponent } from './acct-type/acct-type-list/acct-type-list.component';
import { AcctTypeDetailsComponent } from './acct-type/acct-type-details/acct-type-details.component';
import { BatchControlListComponent } from './batch-control/batch-control-list/batch-control-list.component';
import { BatchControlDetailsComponent } from './batch-control/batch-control-details/batch-control-details.component';
import { BatchCounterListComponent } from './batch-counter/batch-counter-list/batch-counter-list.component';
import { BatchCounterDetailsComponent } from './batch-counter/batch-counter-details/batch-counter-details.component';
import { BranchListComponent } from './branch/branch-list/branch-list.component';
import { BranchDetailsComponent } from './branch/branch-details/branch-details.component';
import { BroadcastMsgListComponent } from './broadcast-msg/broadcast-msg-list/broadcast-msg-list.component';
import { BroadcastMsgDetailsComponent } from './broadcast-msg/broadcast-msg-details/broadcast-msg-details.component';
import { ChangePwdComponent } from './change-password/change-pwd/change-pwd.component';
import { ChargeListComponent } from './charge/charge-list/charge-list.component';
import { ChargeDetailsComponent } from './charge/charge-details/charge-details.component';
import { ChequeProductListComponent } from './check-product/cheque-product-list/cheque-product-list.component';
//import { ChequeProductDetailsComponent } from './check-product/cheque-product-details/cheque-product-details.component';
import { DepartmentListComponent } from './department/department-list/department-list.component';
import { DepartmentDetailsComponent } from './department/department-details/department-details.component';
import { DownloadLogFileListComponent } from './download-log-files/download-log-file-list/download-log-file-list.component';
import { DownloadLogFileDetailsComponent } from './download-log-files/download-log-file-details/download-log-file-details.component';
import { ExecuteScriptsListComponent } from './execute-scripts/execute-scripts-list/execute-scripts-list.component';
import { ExecuteScriptsDetailsComponent } from './execute-scripts/execute-scripts-details/execute-scripts-details.component';
import { LicenceHisListComponent } from './license-his/licence-his-list/licence-his-list.component';
import { LicenceHisDetailsComponent } from './license-his/licence-his-details/licence-his-details.component';
import { ManageServiceListComponent } from './manage-service/manage-service-list/manage-service-list.component';
import { ManageServiceDetailsComponent } from './manage-service/manage-service-details/manage-service-details.component';
import { ManageWindowSvcListComponent } from './manage-window-svc/manage-window-svc-list/manage-window-svc-list.component';
import { ManageWindowSvcDetailsComponent } from './manage-window-svc/manage-window-svc-details/manage-window-svc-details.component';
import { RejectionListComponent } from './rejection/rejection-list/rejection-list.component';
import { RejectionDetailsComponent } from './rejection/rejection-details/rejection-details.component';
import { RoleListComponent } from './roles/role-list/role-list.component';
import { RoleDetailsComponent } from './roles/role-details/role-details.component';
import { SelectToExcelListComponent } from './select-to-excel/select--to-excel-list/select--to-excel-list.component';
import { SelectToExcelDetailsComponent } from './select-to-excel/select--to-excel-details/select--to-excel-details.component';
import { ServiceRefListComponent } from './service-ref/service-ref-list/service-ref-list.component';
import { ServiceRefDetailsComponent } from './service-ref/service-ref-details/service-ref-details.component';
import { StatementSetUpListComponent } from './statement-set-up/statement-set-up-list/statement-set-up-list.component';
import { StatementSetUpDetailsComponent } from './statement-set-up/statement-set-up-details/statement-set-up-details.component';
import { TemplateSetUpListComponent } from './template-set-up/template-set-up-list/template-set-up-list.component';
import { TemplateSetUpDetailsComponent } from './template-set-up/template-set-up-details/template-set-up-details.component';
import { TransConfigListComponent } from './trans-config/trans-config-list/trans-config-list.component';
import { TransConfigDetailsComponent } from './trans-config/trans-config-details/trans-config-details.component';
import { ClientProfileComponent } from './client-profile/client-profile.component';
import { CurrencyListComponent } from './currency/currency-list/currency-list.component';
import { CurrencyDetailsComponent } from './currency/currency-details/currency-details.component';
import { ChequeProductDetailsComponent } from './check-product/cheque-product-details/cheque-product-details.component';
import { RoleAssignListComponent } from './role-assign/role-assign-list/role-assign-list.component';
import { UserLimitComponent } from './users/user-limit/user-limit.component';
import { RoleLimitComponent } from './roles/role-limit/role-limit.component';
import { DocumentChgListComponent } from './document-chg/document-chg-list/document-chg-list.component';
import { DocumentChgDetailsComponent } from './document-chg/document-chg-details/document-chg-details.component';
import { StatementChgListComponent } from './statement-chg/statement-chg-list/statement-chg-list.component';
import { StatementChgDetailsComponent } from './statement-chg/statement-chg-details/statement-chg-details.component';
import { DashboardAssignComponent } from './dashboard-assign/dashboard-assign/dashboard-assign.component';
import { DashboardRoleComponent } from './dashboard-role/dashboard-role/dashboard-role.component';
import { VerifyotpComponent } from '../login/verifyOtp/verifyotp.component';
import { LicenseComponent } from '../login/license/license.component';

import { auditTrailDetailComponent } from './auditTrail/auditTrail-details/audittrail-detail.component';
import { TruncatePipe } from '../transform-truncate/truncate.pipe';



export const routes = [
  { path: '', redirectTo: 'adm', pathMatch: 'full' },
  { path: 'ClientProfile/:mid', component: ClientProfileComponent, data: { breadcrumb: 'Client Profile' } },
  { path: 'bankServiceSetUp/:mid', component: BankservicesetupListComponent, data: { breadcrumb: 'Bank Service Setup' } },
  { path: 'acctType/:mid', component: AcctTypeListComponent, data: { breadcrumb: 'Acct Type List' } },
  { path: 'branch/:mid', component: BranchListComponent, data: { breadcrumb: 'Branch' } },
  { path: 'charge/:mid', component: ChargeListComponent, data: { breadcrumb: 'Charge' } },
  { path: 'currency/:mid', component: CurrencyListComponent, data: { breadcrumb: 'Currency' } },
  { path: 'department/:mid', component: DepartmentListComponent, data: { breadcrumb: 'Department' } },
  { path: 'role/:mid', component: RoleListComponent, data: { breadcrumb: 'Role' } },
  { path: 'dashboard-role/:mid', component: DashboardRoleComponent, data: { breadcrumb: 'dashboard-role' } },
  //{ path: 'license', component: LicenseComponent, data: { breadcrumb: 'License' } },
  { path: 'manageWindowSvc/:mid', component: ManageWindowSvcListComponent, data: { breadcrumb: 'ManageWindowSvc' } },
  { path: 'changePassword/:mid', component: ChangePwdComponent, data: { breadcrumb: 'Change Password' } },
  { path: 'manageService/:mid', component: ManageServiceListComponent, data: { breadcrumb: 'Manage Service' } },
  { path: 'rejection/:mid', component: RejectionListComponent, data: { breadcrumb: 'Rejection' } },
  { path: 'batchControl/:mid', component: BatchControlListComponent, data: { breadcrumb: 'Batch Control' } },
  { path: 'batchCounter/:mid', component: BatchCounterListComponent, data: { breadcrumb: 'Batch Counter' } },
  { path: 'users/:mid', component: UserListComponent, data: { breadcrumb: 'Users ' } },
  { path: 'transConfig/:mid', component: TransConfigListComponent, data: { breadcrumb: 'Transaction Configuration' } },
  { path: 'checkProduct/:mid', component: ChequeProductListComponent, data: { breadcrumb: 'Manage Cheque Product' } },
  { path: 'downloadLogFiles/:mid', component: DownloadLogFileListComponent, data: { breadcrumb: 'Download Log Files' } },
  { path: 'executeScripts/:mid', component: ExecuteScriptsListComponent, data: { breadcrumb: 'Execute Scripts' } },
  { path: 'statementSetUp/:mid', component: StatementSetUpListComponent, data: { breadcrumb: 'Statement Set Up' } },
  { path: 'selectToExcel/:mid', component: SelectToExcelListComponent, data: { breadcrumb: 'Select To Excel' } },
  { path: 'templateSetUp/:mid', component: TemplateSetUpListComponent, data: { breadcrumb: 'Template Set Up' } },
  { path: 'licenseHistory/:mid', component: LicenceHisListComponent, data: { breadcrumb: 'Licence History' } },
  { path: 'broadcastMessage/:mid', component: BroadcastMsgListComponent, data: { breadcrumb: 'Broad cast Message' } },
  { path: 'serviceRef/:mid', component: ServiceRefListComponent, data: { breadcrumb: 'Service Reference' } },
  { path: 'role-ass/:mid', component: RoleAssignListComponent, data: { breadcrumb: 'Role Assignment' } },
  { path: 'dashboard/:mid', component: DashboardAssignComponent, data: { breadcrumb: 'Dashboard Assign Role' } },
  { path: 'chqVendor/:mid', component: ChequeVendorListComponent, data: { breadcrumb: 'Cheque Vendor' } },
  { path: 'batchControl/:mid', component: BatchControlListComponent, data: { breadcrumb: 'Cheque Vendor' } },
  { path: 'docChg/:mid', component: DocumentChgListComponent, data: { breadcrumb: 'Document Charge' } },
  { path: 'statementChg/:mid', component: StatementChgListComponent, data: { breadcrumb: 'Statement Charge' } },

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxDatatableModule
    //NgMultiSelectDropDownModule.forRoot()
    // Angular4PaystackModule.forRoot('pk_test_0839a956b8d918321730bcbc7c5131ff46aa4a91')
  ],
  declarations:
    [

      BankservicesetupListComponent,
      BankservicesetupDetailsComponent,
      AcctTypeListComponent,
      AcctTypeDetailsComponent,
      BatchControlListComponent,
      BatchControlDetailsComponent,
      BatchCounterListComponent,
      BatchCounterDetailsComponent,
      BranchListComponent,
      BranchDetailsComponent,
      BroadcastMsgListComponent,
      BroadcastMsgDetailsComponent,
      ChangePwdComponent,
      ChargeListComponent,
      UserDetailsComponent,
      ChargeDetailsComponent,
      ChequeProductListComponent,
      ChequeProductDetailsComponent,
      DepartmentListComponent,
      DepartmentDetailsComponent,
      DownloadLogFileListComponent,
      DownloadLogFileDetailsComponent,
      ExecuteScriptsListComponent,
      ExecuteScriptsDetailsComponent,
      LicenceHisListComponent,
      LicenceHisDetailsComponent,
      ManageServiceListComponent,
      ManageServiceDetailsComponent,
      ManageWindowSvcListComponent,
      ManageWindowSvcDetailsComponent,
      RejectionListComponent,
      RejectionDetailsComponent,
      RoleListComponent,
      RoleDetailsComponent,
      SelectToExcelListComponent,
      SelectToExcelDetailsComponent,
      ServiceRefListComponent,
      ServiceRefDetailsComponent,
      StatementSetUpListComponent,
      StatementSetUpDetailsComponent,
      TemplateSetUpListComponent,
      TemplateSetUpDetailsComponent,
      TransConfigListComponent,
      TransConfigDetailsComponent,
      ClientProfileComponent,
      CurrencyListComponent,
      CurrencyDetailsComponent,
      UserListComponent,
      RoleAssignListComponent,
      UserLimitComponent,
      ChargeConcessionDetailsComponent,
      ChargeConcessionListComponent,
      ChequeVendorListComponent,
      ChequeVendorDetailsComponent,
      BatchControlListComponent,
      RoleLimitComponent,
      DocumentChgListComponent,
      DocumentChgDetailsComponent,
      StatementChgListComponent,
      StatementChgDetailsComponent,
      DashboardAssignComponent,
      DashboardRoleComponent,
      // LicenseComponent,
      auditTrailDetailComponent,
      TruncatePipe
    ],
  entryComponents: [


    BankservicesetupListComponent,
    BankservicesetupDetailsComponent,
    AcctTypeListComponent,
    AcctTypeDetailsComponent,
    BatchControlListComponent,
    BatchControlDetailsComponent,
    BatchCounterListComponent,
    BatchCounterDetailsComponent,
    BranchListComponent,
    BranchDetailsComponent,
    BroadcastMsgListComponent,
    BroadcastMsgDetailsComponent,
    ChangePwdComponent,
    ChargeListComponent,
    ChargeDetailsComponent,
    ChequeProductListComponent,
    ChequeProductDetailsComponent,
    DepartmentListComponent,
    DepartmentDetailsComponent,
    DownloadLogFileListComponent,
    DownloadLogFileDetailsComponent,
    ExecuteScriptsListComponent,
    UserDetailsComponent,
    ExecuteScriptsDetailsComponent,
    LicenceHisListComponent,
    LicenceHisDetailsComponent,
    ManageServiceListComponent,
    ManageServiceDetailsComponent,
    ManageWindowSvcListComponent,
    ManageWindowSvcDetailsComponent,
    RejectionListComponent,
    RejectionDetailsComponent,
    RoleListComponent,
    RoleDetailsComponent,
    SelectToExcelListComponent,
    SelectToExcelDetailsComponent,
    ServiceRefListComponent,
    ServiceRefDetailsComponent,
    StatementSetUpListComponent,
    StatementSetUpDetailsComponent,
    TemplateSetUpListComponent,
    TemplateSetUpDetailsComponent,
    TransConfigListComponent,
    TransConfigDetailsComponent,
    ClientProfileComponent,
    CurrencyDetailsComponent,
    UserListComponent,
    RoleAssignListComponent,
    UserLimitComponent,
    ChargeConcessionDetailsComponent,
    ChargeConcessionListComponent,
    ChequeVendorListComponent,
    ChequeVendorDetailsComponent,
    BatchControlListComponent,
    BatchControlDetailsComponent,
    RoleLimitComponent,
    DocumentChgDetailsComponent,
    StatementChgListComponent,
    StatementChgDetailsComponent,
    DashboardAssignComponent,
    auditTrailDetailComponent

  ],
  providers: [WaitingDialog, TablesService
  ],
})
export class AdminModule { }


