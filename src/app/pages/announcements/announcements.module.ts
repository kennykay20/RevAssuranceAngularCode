
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import {  WaitingDialog } from '../../services/services';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FilteringComponent } from '../tables/filtering/filtering.component';
import { TablesService } from '../tables/tables.service';
import { CreateAnnouncementComponent } from './create-announcement/create-announcement.component';
import { AllAnnouncementComponent } from './all-announcement/all-announcement.component';
import { InboxComponent } from './inbox/inbox.component';
import { AllPubAnnComponent } from './all-pub-ann/all-pub-ann.component';
import { AllPendingAnnComponent } from './all-pending-ann/all-pending-ann.component';
import { MyReadAnnComponent } from './my-read-ann/my-read-ann.component';
import { EditAnnComponent } from './edit-ann/edit-ann.component';
import { ViewAnnComponent } from './view-ann/view-ann.component';


export const routes = [
    { path: '', redirectTo: 'ano', pathMatch: 'full'},
    { path: 'ano', component: CreateAnnouncementComponent, data: { breadcrumb: 'Create Announcement' } },
    { path: 'all', component: AllAnnouncementComponent, data: { breadcrumb: 'All Announcement' } },
    { path: 'inboxann', component: InboxComponent, data: { breadcrumb: 'Inbox Announcement' } },
    { path: 'allPubAnn', component: AllPubAnnComponent, data: { breadcrumb: 'AllPublish Announcement' } },
    { path: 'pendingAnn', component: AllPendingAnnComponent, data: { breadcrumb: 'Pending  Announcement' } },
    { path: 'myRead-ann', component: MyReadAnnComponent, data: { breadcrumb: 'My-Read Announcement' } },
    { path: 'edit-ann', component: EditAnnComponent, data: { breadcrumb: 'Edit Announcement' } },
    { path: 'view-ann', component: ViewAnnComponent, data: { breadcrumb: 'Announcement Detail' } },
 
];

//   { path: '', redirectTo: 'ano', pathMatch: 'full'},  
//    { path: 'ano', component: CreateAnnouncementComponent, data: { breadcrumb: 'Create Announcement' } },
// this.router.navigate(['./myprofile/myprofile']);

// this.router.navigate(['./ano/all']);

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

  CreateAnnouncementComponent,
      AllAnnouncementComponent,
      InboxComponent,
      AllPubAnnComponent,
      AllPendingAnnComponent,
      MyReadAnnComponent,
      EditAnnComponent,
      ViewAnnComponent
  ],
  // entryComponents: [  
    
  // ],
  providers: [  WaitingDialog, TablesService
  ],
})
export class AnnouncementModule { }
