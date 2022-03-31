

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { DasboardComponent } from './dasboard/dasboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { 
      //  GestureConfig,
        MatInputModule,
        MatCardModule,
        MatListModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatAutocompleteModule
} from '@angular/material';

export const routes = [
  { path: '', redirectTo: 'Dashboard', pathMatch: 'full'},
  { path: 'Dashboard', component: DasboardComponent, data: { breadcrumb: 'Dashboard' } },
  
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
    NgxChartsModule,
    PerfectScrollbarModule,
   // GestureConfig,
    MatInputModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatAutocompleteModule
  ],
  declarations: [
    DasboardComponent
  ],
  entryComponents: [
    
  ]
})
export class HomeModule { }


/////////////////////


// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { FormsModule } from '@angular/forms';
//import { NgxChartsModule } from '@swimlane/ngx-charts';
//import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
//import { SharedModule } from '../../shared/shared.module';
// import { DashboardComponent } from './dashboard.component';
// import { InfoCardsComponent } from './info-cards/info-cards.component';
// import { DiskSpaceComponent } from './disk-space/disk-space.component';
// import { TodoComponent } from './todo/todo.component';
// import { AnalyticsComponent } from './analytics/analytics.component';

// export const routes = [
//   { path: '', component: DashboardComponent, pathMatch: 'full' }
// ];

// @NgModule({
//   imports: [
//     CommonModule,
//     RouterModule.forChild(routes),
//     FormsModule,
//     NgxChartsModule,
//     PerfectScrollbarModule,
//     SharedModule
//   ],
//   declarations: [
//     // DashboardComponent,
//     // InfoCardsComponent,
//     // DiskSpaceComponent,
//     // TodoComponent,
//     // AnalyticsComponent
//   ]
// })
// export class DashboardModule { }

