
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { WaitingDialog } from '../../services/services';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TablesService } from '../tables/tables.service';
import { EditorModule } from '@tinymce/tinymce-angular';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { ContRepComponent } from './cont-rep/cont-rep.component';
import { LruRepComponent } from './lru-rep/lru-rep.component';
import { MicrRepComponent } from './micr-rep/micr-rep.component';
import { TxnRepComponent } from './txn-rep/txn-rep.component';
import { PostingTransactionRptComponent } from './posting-transaction-rpt/posting-transaction-rpt.component';


export const routes = [
  { path: '', redirectTo: 'rep', pathMatch: 'full' },
  { path: 'audTrail/:mid', component: AuditTrailComponent, data: { breadcrumb: 'Audit Trail Report' } },
  { path: 'tranRep/:mid', component: TxnRepComponent, data: { breadcrumb: 'Transaction Report' } },
  { path: 'micrRep/:mid', component: MicrRepComponent, data: { breadcrumb: 'Mic Report' } },
  { path: 'lcruRep/:mid', component: LruRepComponent, data: { breadcrumb: 'Lru Report' } },
  { path: 'contRep/:mid', component: ContRepComponent, data: { breadcrumb: 'Contigency Report' } },
  { path: 'postTransaction/:mid', component: PostingTransactionRptComponent, data: { breadcrumb: 'Post Transaction Report'}}

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
  
  ],
  declarations:
    [
      AuditTrailComponent,
      ContRepComponent,
      LruRepComponent,
      MicrRepComponent,
      TxnRepComponent,
      PostingTransactionRptComponent

    ],
  entryComponents: [
    AuditTrailComponent

  ],
  providers: [WaitingDialog, TablesService, DatePipe,
    // {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'}
  ],
})

export class ReportsModule { }


