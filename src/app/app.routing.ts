import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PagesComponent } from './pages/pages.component';
import { BlankComponent } from './pages/blank/blank.component';
import { SearchComponent } from './pages/search/search.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { ErrorComponent } from './pages/errors/error/error.component';

export const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            { path: 'dashboard', loadChildren: 'app/pages/dashboard/dashboard.module#DashboardModule', data: { breadcrumb: 'Dashboard' } },
            { path: 'users', loadChildren: 'app/pages/users/users.module#UsersModule', data: { breadcrumb: 'Users' } },
            { path: 'ui', loadChildren: 'app/pages/ui/ui.module#UiModule', data: { breadcrumb: 'UI' } },
            { path: 'Home', loadChildren: 'app/pages/home/home.module#HomeModule', data: { breadcrumb: 'home' } },
            { path: 'user', loadChildren: 'app/pages/manage-user/manage-user.module#ManageUserModule', data: { breadcrumb: ' User Manage' } },

            //  New 

            { path: 'Roles', loadChildren: 'app/pages/role-and-permission/role-and-permission.module#RoleAndPermissionModule', data: { breadcrumb: 'Role & Permission' } },
            { path: 'vis', loadChildren: 'app/pages/visitors/visitors.module#VisitorModule', data: { breadcrumb: 'Visitor' } },
            { path: 'com', loadChildren: 'app/pages/complaints/complaints.module#ComplaintsModule', data: { breadcrumb: 'Complaints' } },
            { path: 'pay', loadChildren: 'app/pages/payments/payments.module#PaymentModule', data: { breadcrumb: 'Payment' } },
            { path: 'pol', loadChildren: 'app/pages/polls/polls.module#PollModule', data: { breadcrumb: 'Poll' } },
            { path: 'ano', loadChildren: 'app/pages/announcements/announcements.module#AnnouncementModule', data: { breadcrumb: 'Announcement' } },
            { path: 'chg', loadChildren: 'app/pages/charges/charges.module#ChargesModule', data: { breadcrumb: 'Charges' } },
            { path: 'prf', loadChildren: 'app/pages/profile/profile.module#ProfileModule', data: { breadcrumb: 'Profile' } },

            // Admin
            { path: 'adm', loadChildren: 'app/pages/admin/admin.module#AdminModule', data: { breadcrumb: 'Admin' } },

            //Operation
            { path: 'prc', loadChildren: 'app/pages/operation/operation.module#OperationModule', data: { breadcrumb: 'Operation' } },
            { path: 'rep', loadChildren: 'app/pages/reports/reports.module#ReportsModule', data: { breadcrumb: 'Reports' } },


            // { path: 'emailcon', loadChildren: 'app/pages/email-con/email-con.module#EmailConModule', data: { breadcrumb: 'Email Con' } },




            { path: 'form-controls', loadChildren: 'app/pages/form-controls/form-controls.module#FormControlsModule', data: { breadcrumb: 'Form Controls' } },
            { path: 'tables', loadChildren: 'app/pages/tables/tables.module#TablesModule', data: { breadcrumb: 'Tables' } },
            { path: 'icons', loadChildren: 'app/pages/icons/icons.module#IconsModule', data: { breadcrumb: 'Material Icons' } },
            { path: 'drag-drop', loadChildren: 'app/pages/drag-drop/drag-drop.module#DragDropModule', data: { breadcrumb: 'Drag & Drop' } },
            { path: 'schedule', loadChildren: 'app/pages/schedule/schedule.module#ScheduleModule', data: { breadcrumb: 'Schedule' } },
            { path: 'mailbox', loadChildren: 'app/pages/mailbox/mailbox.module#MailboxModule', data: { breadcrumb: 'Mailbox' } },
            { path: 'chat', loadChildren: 'app/pages/chat/chat.module#ChatModule', data: { breadcrumb: 'Chat' } },
            { path: 'maps', loadChildren: 'app/pages/maps/maps.module#MapsModule', data: { breadcrumb: 'Maps' } },
            { path: 'charts', loadChildren: 'app/pages/charts/charts.module#ChartsModule', data: { breadcrumb: 'Charts' } },
            { path: 'dynamic-menu', loadChildren: 'app/pages/dynamic-menu/dynamic-menu.module#DynamicMenuModule', data: { breadcrumb: 'Dynamic Menu' } },
            { path: 'blank', component: BlankComponent, data: { breadcrumb: 'Blank page' } },
            { path: 'search', component: SearchComponent, data: { breadcrumb: 'Search' } }
        ]
    },
    { path: 'landing', loadChildren: 'app/pages/landing/landing.module#LandingModule' },
    // { path: 'emailcon', loadChildren: 'app/pages/email-con/email-con.module#EmailConModule', data: { breadcrumb: 'Email' } },
    { path: 'login', loadChildren: 'app/pages/login/login.module#LoginModule' },
    { path: 'register', loadChildren: 'app/pages/register/register.module#RegisterModule' },

    { path: 'error', component: ErrorComponent, data: { breadcrumb: 'Error' } },
    { path: '**', component: NotFoundComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,  // <- comment this line for activate lazy load
    // useHash: true
});