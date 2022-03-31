
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
// import { CreateAgentComponent, ViewAgentComponent } from './agent-management.component';
import { WaitingDialog } from '../../services/services';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FilteringComponent } from '../tables/filtering/filtering.component';
// import { NgxTableComponent } from './ngx-table/ngx-table.component';

import { TablesService } from '../tables/tables.service';
import { AccountClosureListComponent } from './account-closure/account-closure-list/account-closure-list.component';
import { AccountClosureDetailsComponent } from './account-closure/account-closure-details/account-closure-details.component';
import { AmmendmentReprintListComponent } from './ammendment-reprinting/ammendment-reprint-list/ammendment-reprint-list.component';
import { AmmendmentReprintDetailsComponent } from './ammendment-reprinting/ammendment-reprint-details/ammendment-reprint-details.component';
//import { AmortizationListComponent } from './amortization/amortization-list/amortization-list.component';
import { AmortizationDetailsComponent } from './amortization/amortization-details/amortization-details.component';
import { ApgListComponent } from './apg/apg-list/apg-list.component';
import { ApgDetailsComponent } from './apg/apg-details/apg-details.component';
import { ApproveServiceListComponent } from './approve-service/approve-service-list/approve-service-list.component';
import { ApproveServiceDetailsComponent } from './approve-service/approve-service-details/approve-service-details.component';
import { AuthAmortizationListComponent } from './auth-amortization/auth-amortization-list/auth-amortization-list.component';
import { AuthAmortizationDetailsComponent } from './auth-amortization/auth-amortization-details/auth-amortization-details.component';
import { AuthListComponent } from './auth-trans/auth-list/auth-list.component';
import { AuthDetailsComponent } from './auth-trans/auth-details/auth-details.component';
import { BankGuaranteeListComponent } from './bank-guarantee/bank-guarantee-list/bank-guarantee-list.component';
import { BankGuaranteeDetailsComponent } from './bank-guarantee/bank-guarantee-details/bank-guarantee-details.component';
import { BidPerformanceListComponent } from './bid-performance/bid-performance-list/bid-performance-list.component';
import { BidPerformanceDetailsComponent } from './bid-performance/bid-performance-details/bid-performance-details.component';
import { BusinessSearchListComponent } from './business-search/business-search-list/business-search-list.component';
import { BusinessSearchDetailsComponent } from './business-search/business-search-details/business-search-details.component';
import { CardReqListComponent } from './card-req/card-req-list/card-req-list.component';
import { CardReqDetailsComponent } from './card-req/card-req-details/card-req-details.component';
import { ChqBookReqListComponent } from './chq-book-req/chq-book-req-list/chq-book-req-list.component';
import { ChqBookReqDetailsComponent } from './chq-book-req/chq-book-req-details/chq-book-req-details.component';
import { ChqBookEncodingListComponent } from './chq-req-encoding/chq-book-encoding-list/chq-book-encoding-list.component';
import { ChqBookEncodingDetailsComponent } from './chq-req-encoding/chq-book-encoding-details/chq-book-encoding-details.component';
import { ChqSerializationListComponent } from './chq-serialization/chq-serialization-list/chq-serialization-list.component';
import { ChqSerializationDetailsComponent } from './chq-serialization/chq-serialization-details/chq-serialization-details.component';
import { CounterChqReqListComponent } from './counter-chq-req/counter-chq-req-list/counter-chq-req-list.component';
import { CounterChqReqDetailsComponent } from './counter-chq-req/counter-chq-req-details/counter-chq-req-details.component';
import { DataPoolControlListComponent } from './data-pool-control/data-pool-control-list/data-pool-control-list.component';
import { DataPoolControlDetailsComponent } from './data-pool-control/data-pool-control-details/data-pool-control-details.component';
import { InstrumentApprovalListComponent } from './instrument-approval/instrument-approval-list/instrument-approval-list.component';
import { InstrumentApprovalDetailsComponent } from './instrument-approval/instrument-approval-details/instrument-approval-details.component';
import { InstrumentRetirementListComponent } from './instrument-retirement/instrument-retirement-list/instrument-retirement-list.component';
import { InstrumentRetirementDetailsComponent } from './instrument-retirement/instrument-retirement-details/instrument-retirement-details.component';
import { ManageUploadAuditListComponent } from './manage-upload-audit/manage-upload-audit-list/manage-upload-audit-list.component';
import { ManageUploadAuditDetailsComponent } from './manage-upload-audit/manage-upload-audit-details/manage-upload-audit-details.component';
import { OverdraftReqListComponent } from './overdraft-req/overdraft-req-list/overdraft-req-list.component';
import { OverdraftReqDetailsComponent } from './overdraft-req/overdraft-req-details/overdraft-req-details.component';
import { PerformanceBondListComponent } from './perfomance-bond/performance-bond-list/performance-bond-list.component';
import { PerformanceBondDetailsComponent } from './perfomance-bond/performance-bond-details/performance-bond-details.component';
import { PostTransListComponent } from './post-trans/post-trans-list/post-trans-list.component';
import { PostTransDetailsComponent } from './post-trans/post-trans-details/post-trans-details.component';
import { RefLetterListComponent } from './ref-letter/ref-letter-list/ref-letter-list.component';
import { RefLetterDetailsComponent } from './ref-letter/ref-letter-details/ref-letter-details.component';
import { ReverseTransListComponent } from './reverse-trans/reverse-trans-list/reverse-trans-list.component';
import { ReverseTransDetailsComponent } from './reverse-trans/reverse-trans-details/reverse-trans-details.component';
import { ServiceApprovalListComponent } from './service-approval/service-approval-list/service-approval-list.component';
import { ServiceApprovalDetailsComponent } from './service-approval/service-approval-details/service-approval-details.component';
import { StatementReqListComponent } from './statement-req/statement-req-list/statement-req-list.component';
import { StatementReqDetailsComponent } from './statement-req/statement-req-details/statement-req-details.component';
import { StopChqListComponent } from './stop-chq/stop-chq-list/stop-chq-list.component';
import { StopChqDetailsComponent } from './stop-chq/stop-chq-details/stop-chq-details.component';
import { TokenListComponent } from './token/token-list/token-list.component';
import { TokenDetailsComponent } from './token/token-details/token-details.component';
import { TransEnqListComponent } from './trans-enq/trans-enq-list/trans-enq-list.component';
import { TransEnqDetailsComponent } from './trans-enq/trans-enq-details/trans-enq-details.component';
import { RejReasonComponent } from './RejectionReason/rej-reason/rej-reason.component';
import { AmortizationListComponent } from './amortization/amortization-list/amortization-list.component';
import { DatePipe } from '@angular/common';
import { BatchControlListComponent } from './batch-processing/batch-control-list/batch-control-list.component';
import { BatchControlItemListComponent } from './batch-processing/batch-control--item-list/batch-control--item-list.component';
import { BatchControlItemDetailsComponent } from './batch-processing/batch-control--item-details/batch-control--item-details.component';
import { BatchItemAddEditComponent } from './batch-processing/batch-item-add-edit/batch-item-add-edit.component';
import { UploadBulkComponent } from './batch-processing/upload-bulk/upload-bulk.component';
import { UploadItemDetailsComponent } from './batch-processing/upload-bulk/upload-item-details/upload-item-details.component';
import { ApproveBatchComponent } from './app-batch/approve-batch/approve-batch.component';
import { ApproveBatchDetailsComponent } from './app-batch/approve-batch-details/approve-batch-details.component';
import { ApproveItemDetailsComponent } from './app-batch/approve-item-details/approve-item-details.component';
import { TradeRefListComponent } from './trade-ref/trade-ref-list/trade-ref-list.component';
import { TradeRefDetailsComponent } from './trade-ref/trade-ref-details/trade-ref-details.component';
import { ViewMandateListComponent } from './view-mandate/view-mandate-list/view-mandate-list.component';
import { ViewMandateDetailsComponent } from './view-mandate/view-mandate-details/view-mandate-details.component';
import { RejInstrumentComponent } from './instrument-approval/rej-instrument/rej-instrument.component';
import { TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { EditorModule } from '@tinymce/tinymce-angular';
import { CustomBondListComponent } from './custom-bond/custom-bond-list/custom-bond-list.component';
import { CustomBondDetailsComponent } from './custom-bond/custom-bond-details/custom-bond-details.component';
import { DocRetrievalListComponent } from './doc-retrieval/doc-retrieval-list/doc-retrieval-list.component';
import { DocRetrievalDetailsComponent } from './doc-retrieval/doc-retrieval-details/doc-retrieval-details.component';
import { PinResetListComponent } from './pin-reset/pin-reset-list/pin-reset-list.component';
import { PinResetDetailsComponent } from './pin-reset/pin-reset-details/pin-reset-details.component';
import { RejDismissComponent } from '../ui/dialog/rej-dismiss/rej-dismiss.component';
import { PinResetAfterPostComponent } from './pin-reset/pin-reset-after-post/pin-reset-after-post.component';
import { PostAlertComponent } from './post-trans/post-alert/post-alert.component';
import { RetentionBondListComponent } from './retention-bond/retention-bond-list/retention-bond-list.component';
import { RetentionBondDetailsComponent } from './retention-bond/retention-bond-details/retention-bond-details.component';
import { LetterOfItentListComponent } from './letter-of-itent/letter-of-itent-list/letter-of-itent-list.component';


export const routes = [
  { path: '', redirectTo: 'prc', pathMatch: 'full' },
  { path: 'acctClossure/:mid', component: AccountClosureListComponent, data: { breadcrumb: 'Account Closure' } },

  { path: 'ammendmentReprint/:mid', component: AmmendmentReprintListComponent, data: { breadcrumb: 'Ammendment Reprint Profile' } },

  { path: 'amortization/:mid', component: AmortizationListComponent, data: { breadcrumb: 'Amortization' } },

  { path: 'apg/:mid', component: ApgListComponent, data: { breadcrumb: 'Apg' } },
  { path: 'retention-bond/:mid', component: RetentionBondListComponent, data: { breadcrumb: 'Retention Bond ' } },
  { path: 'letter-of-itent/:mid', component: LetterOfItentListComponent, data: { breadcrumb: 'Letter Of Itent' } },

  { path: 'apprSer/:mid', component: ApproveServiceListComponent, data: { breadcrumb: 'Approve Service' } },

  { path: 'authAmortization/:mid', component: AuthAmortizationListComponent, data: { breadcrumb: 'Authorize Amortization' } },

  { path: 'authList/:mid', component: AuthListComponent, data: { breadcrumb: 'Authorization' } },


  { path: 'bnkGua/:mid', component: BankGuaranteeListComponent, data: { breadcrumb: 'Bank Guarantee' } },


  { path: 'bidPer/:mid', component: BidPerformanceListComponent, data: { breadcrumb: 'Bid Performance' } },


  { path: 'businessSearch/:mid', component: BusinessSearchListComponent, data: { breadcrumb: 'Business Search' } },


  { path: 'cardReq/:mid', component: CardReqListComponent, data: { breadcrumb: 'Card Requests' } },


  { path: 'chqBookReq/:mid', component: ChqBookReqListComponent, data: { breadcrumb: 'Cheque Book Request' } },


  { path: 'chqBookEncoding/:mid', component: ChqBookEncodingListComponent, data: { breadcrumb: 'Cheque Book Encoding' } },


  { path: 'chqSerialization/:mid', component: ChqSerializationListComponent, data: { breadcrumb: 'Cheque Serialization' } },


  { path: 'counterChqReq/:mid', component: CounterChqReqListComponent, data: { breadcrumb: 'Counter Cheque Request' } },


  { path: 'dataPullControl/:mid', component: DataPoolControlListComponent, data: { breadcrumb: 'Data Pool Control' } },


  { path: 'instrumentApproval/:mid', component: InstrumentApprovalListComponent, data: { breadcrumb: 'Instrument Approval' } },


  { path: 'instrumentRetirement/:mid', component: InstrumentRetirementListComponent, data: { breadcrumb: 'Instrument Retirement' } },


  { path: 'manageUploadAudit/:mid', component: ManageUploadAuditListComponent, data: { breadcrumb: 'Manage Upload Audit' } },


  { path: 'overdraftReq/:mid', component: OverdraftReqListComponent, data: { breadcrumb: 'Over Draft Request' } },


  { path: 'perfBond/:mid', component: PerformanceBondListComponent, data: { breadcrumb: 'Performance Bond' } },


  { path: 'postTrans/:mid', component: PostTransListComponent, data: { breadcrumb: 'Post Transaction' } },


  { path: 'refLetter/:mid', component: RefLetterListComponent, data: { breadcrumb: 'Reference Letter' } },


  { path: 'reverseTrans/:mid', component: ReverseTransListComponent, data: { breadcrumb: 'Reverse Transaction' } },


  { path: 'batchpro/:mid', component: BatchControlListComponent, data: { breadcrumb: 'Salary Proccessing' } },

  { path: 'batchproDetails/:mid', component: BatchControlListComponent, data: { breadcrumb: 'Salary Proccessing' } },

  { path: 'serviceApproval/:mid', component: ServiceApprovalListComponent, data: { breadcrumb: 'Service Approval' } },

  { path: 'statementReq/:mid', component: StatementReqListComponent, data: { breadcrumb: 'Statement Request' } },


  { path: 'StopChq/:mid', component: StopChqListComponent, data: { breadcrumb: 'Stop Cheque' } },


  { path: 'token/:mid', component: TokenListComponent, data: { breadcrumb: 'Token' } },


  { path: 'tradeRef/:mid', component: TradeRefListComponent, data: { breadcrumb: 'Trade List' } },


  { path: 'transEnq/:mid', component: TransEnqListComponent, data: { breadcrumb: 'transEnq' } },

  { path: 'appBatch/:mid', component: ApproveBatchComponent, data: { breadcrumb: 'transEnq' } },

  { path: 'viewMandate/:mid', component: ViewMandateListComponent, data: { breadcrumb: 'View Mandate' } },
  { path: 'CusBond/:mid', component: CustomBondListComponent, data: { breadcrumb: 'Custom Bond' } },
  { path: 'docRetr/:mid', component: DocRetrievalListComponent, data: { breadcrumb: 'Document Retrieval' } },
  { path: 'rePin/:mid', component: PinResetListComponent, data: { breadcrumb: 'Pin Reset Charge' } }, 
  { path: 'rePinAfterChg/:mid', component: PinResetAfterPostComponent, data: { breadcrumb: 'Pin Reset Update' } },

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    EditorModule,
    SharedModule,
    ReactiveFormsModule,
    NgxDatatableModule
    // Angular4PaystackModule.forRoot('pk_test_0839a956b8d918321730bcbc7c5131ff46aa4a91')
  ],
  declarations:
    [
      AccountClosureListComponent,
      AccountClosureDetailsComponent,
      AmmendmentReprintListComponent,
      AmmendmentReprintDetailsComponent,
      AmortizationListComponent,
      AmortizationDetailsComponent,
      ApgListComponent,
      ApgDetailsComponent,
      ApproveServiceListComponent,
      ApproveServiceDetailsComponent,
      AuthAmortizationListComponent,
      AuthAmortizationDetailsComponent,
      AuthListComponent,
      AuthDetailsComponent,
      BankGuaranteeListComponent,
      BankGuaranteeDetailsComponent,
      BidPerformanceListComponent,
      BidPerformanceDetailsComponent,
      BusinessSearchListComponent,
      BusinessSearchDetailsComponent,
      CardReqListComponent,
      CardReqDetailsComponent,
      ChqBookReqListComponent,
      ChqBookReqDetailsComponent,
      ChqBookEncodingListComponent,
      ChqBookEncodingDetailsComponent,
      ChqSerializationListComponent,
      ChqSerializationDetailsComponent,
      CounterChqReqListComponent,
      CounterChqReqDetailsComponent,
      DataPoolControlListComponent,
      DataPoolControlDetailsComponent,
      InstrumentApprovalListComponent,
      InstrumentApprovalDetailsComponent,
      InstrumentRetirementListComponent,
      InstrumentRetirementDetailsComponent,
      ManageUploadAuditListComponent,
      ManageUploadAuditDetailsComponent,
      OverdraftReqListComponent,
      OverdraftReqDetailsComponent,
      PerformanceBondListComponent,
      PerformanceBondDetailsComponent,
      PostTransListComponent,
      PostTransDetailsComponent,
      RefLetterListComponent,
      RefLetterDetailsComponent,
      ReverseTransListComponent,
      ReverseTransDetailsComponent,
      ServiceApprovalListComponent,
      ServiceApprovalDetailsComponent,
      StatementReqListComponent,
      StatementReqDetailsComponent,
      StopChqListComponent,
      StopChqDetailsComponent,
      TokenListComponent,
      TokenDetailsComponent,
      TransEnqListComponent,
      TransEnqDetailsComponent,
      RejReasonComponent,
      BatchControlListComponent,
      BatchControlItemListComponent,
      BatchControlItemDetailsComponent,
      BatchItemAddEditComponent,
      UploadBulkComponent,
      UploadItemDetailsComponent,
      ApproveBatchComponent,
      ApproveBatchDetailsComponent,
      ApproveItemDetailsComponent,
      TradeRefListComponent,
      TradeRefDetailsComponent,
      ViewMandateListComponent,
      ViewMandateDetailsComponent,
      RejInstrumentComponent,
      CustomBondListComponent,
      CustomBondDetailsComponent,
      DocRetrievalListComponent,
      DocRetrievalDetailsComponent,
      PinResetListComponent,
      PinResetDetailsComponent,
      RejDismissComponent,
      PinResetAfterPostComponent,
      PostAlertComponent,
      RetentionBondListComponent,
      RetentionBondDetailsComponent,
      LetterOfItentListComponent
    ],
  entryComponents: [

    AccountClosureListComponent,
    AccountClosureDetailsComponent,
    AmmendmentReprintListComponent,
    AmmendmentReprintDetailsComponent,
    AmortizationListComponent,
    AmortizationDetailsComponent,
    ApgListComponent,
    ApgDetailsComponent,
    ApproveServiceListComponent,
    ApproveServiceDetailsComponent,
    AuthAmortizationListComponent,
    AuthAmortizationDetailsComponent,
    AuthListComponent,
    AuthDetailsComponent,
    BankGuaranteeListComponent,
    BankGuaranteeDetailsComponent,
    BidPerformanceListComponent,
    BidPerformanceDetailsComponent,
    BusinessSearchListComponent,
    BusinessSearchDetailsComponent,
    CardReqListComponent,
    CardReqDetailsComponent,
    ChqBookReqListComponent,
    ChqBookReqDetailsComponent,
    ChqBookEncodingListComponent,
    ChqBookEncodingDetailsComponent,
    ChqSerializationListComponent,
    ChqSerializationDetailsComponent,
    CounterChqReqListComponent,
    CounterChqReqDetailsComponent,
    DataPoolControlListComponent,
    DataPoolControlDetailsComponent,
    InstrumentApprovalListComponent,
    InstrumentApprovalDetailsComponent,
    InstrumentRetirementListComponent,
    InstrumentRetirementDetailsComponent,
    ManageUploadAuditListComponent,
    ManageUploadAuditDetailsComponent,
    OverdraftReqListComponent,
    OverdraftReqDetailsComponent,
    PerformanceBondListComponent,
    PerformanceBondDetailsComponent,
    PostTransListComponent,
    PostTransDetailsComponent,
    RefLetterListComponent,
    RefLetterDetailsComponent,
    ReverseTransListComponent,
    ReverseTransDetailsComponent,
    ServiceApprovalListComponent,
    ServiceApprovalDetailsComponent,
    StatementReqListComponent,
    StatementReqDetailsComponent,
    StopChqListComponent,
    StopChqDetailsComponent,
    TokenListComponent,
    TokenDetailsComponent,
    TransEnqListComponent,
    TransEnqDetailsComponent,
    RejReasonComponent,
    BatchControlItemDetailsComponent,
    BatchItemAddEditComponent,
    UploadBulkComponent,
    UploadItemDetailsComponent,
    ApproveBatchDetailsComponent,
    ApproveItemDetailsComponent,
    TradeRefDetailsComponent,
    RejInstrumentComponent,
    ViewMandateDetailsComponent,
    TransEnqDetailsComponent,
    DocRetrievalDetailsComponent,
    PinResetDetailsComponent,
    RejDismissComponent
  ],
  providers: [WaitingDialog, TablesService, DatePipe,
    //{provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'}
  ],
})

export class OperationModule { }


