
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import {  WaitingDialog } from '../../services/services';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FilteringComponent } from '../tables/filtering/filtering.component';
import { TablesService } from '../tables/tables.service';
import { CreatePollComponent } from './create-poll/create-poll.component';
import { AllPollComponent } from './all-poll/all-poll.component';
import { VoteForPollComponent } from './vote-for-poll/vote-for-poll.component';
import { VoteViewPollComponent } from './vote-view-poll/vote-view-poll.component';
import { EditPollComponent } from './edit-poll/edit-poll.component';
import { MyPollComponent } from './my-poll/my-poll.component';
import { ViewPollComponent } from './view-poll/view-poll.component';


export const routes = [
    { path: '', redirectTo: 'pol', pathMatch: 'full'},
    { path: 'pol', component: CreatePollComponent, data: { breadcrumb: 'Create Poll' } },
    { path: 'editPoll', component: EditPollComponent, data: { breadcrumb: 'Active Poll' } },
    { path: 'vote', component: VoteForPollComponent, data: { breadcrumb: 'All Poll' } },
    { path: 'myPoll', component: MyPollComponent, data: { breadcrumb: 'MY Poll' } },
    { path: 'AllPoll', component: AllPollComponent, data: { breadcrumb: 'All Poll' } },
    { path: 'viewVotePoll', component: VoteViewPollComponent, data: { breadcrumb: 'All Poll' } },
    { path: 'view', component: ViewPollComponent, data: { breadcrumb: 'Poll Details' } },
    

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
     
  CreatePollComponent,
      AllPollComponent,
      VoteForPollComponent,
      VoteViewPollComponent,
      EditPollComponent,
      MyPollComponent,
      ViewPollComponent],
  // entryComponents: [  
    
  // ],
  providers: [  WaitingDialog, TablesService, DatePipe
  ],
})
export class PollModule { }

