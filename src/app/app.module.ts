import { OperationModule } from './pages/operation/operation.module';
import { AdminModule } from './pages/admin/admin.module';
import { ProfileModule } from './pages/profile/profile.module';
// import { EditorModule } from '@tinymce/tinymce-angular';
import { PaymentModule } from './pages/payments/payments.module';
import { CheckOutComponent } from './pages/payments/check-out/check-out.component';
import { ViewFineDetailsComponent } from './pages/payments/view-fine-details/view-fine-details.component';
import { RoleAndPermissionModule } from './pages/role-and-permission/role-and-permission.module';
import { ApiHeaderService } from './services/service-header-service/api-header.service';
import { GeneralService } from './services/genservice.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CustomOverlayContainer } from './theme/utils/custom-overlay-container';
import { AgmCoreModule } from '@agm/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX: true
};
import { CalendarModule } from 'angular-calendar';
import { SharedModule } from './shared/shared.module';
import { PipesModule } from './theme/pipes/pipes.module';
import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { PagesComponent } from './pages/pages.component';
import { BlankComponent } from './pages/blank/blank.component';
import { SearchComponent } from './pages/search/search.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { ErrorComponent } from './pages/errors/error/error.component';
import { AppSettings } from './app.settings';
import { SidenavComponent } from './theme/components/sidenav/sidenav.component';
import { VerticalMenuComponent } from './theme/components/menu/vertical-menu/vertical-menu.component';
import { HorizontalMenuComponent } from './theme/components/menu/horizontal-menu/horizontal-menu.component';
import { BreadcrumbComponent } from './theme/components/breadcrumb/breadcrumb.component';
import { FlagsMenuComponent } from './theme/components/flags-menu/flags-menu.component';
import { FullScreenComponent } from './theme/components/fullscreen/fullscreen.component';
import { ApplicationsComponent } from './theme/components/applications/applications.component';
import { MessagesComponent } from './theme/components/messages/messages.component';
import { UserMenuComponent } from './theme/components/user-menu/user-menu.component';
import { LoginModule } from './pages/login/login.module';
import { AppLoaderComponentComponent } from './pages/app-loader-component/app-loader-component.component';
import { HomeModule } from './pages/home/home.module';
// import { AgentManagementModule } from './pages/agent-management/agent-management.module';
// import { CustomerManagementModule } from './pages/customer-management/customer-management.module';
import { LocalStorageService } from 'angular-2-local-storage';
import { LocalStorageModule } from 'angular-2-local-storage';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { HttpClientModule } from '@angular/common/http';
import { DialogOverviewExampleDialog } from './pages/ui/dialog/dialog.component';
import { ManageUserModule } from './pages/manage-user/manage-user.module';
import { AddFineComponent } from './pages/charges/add-fine/add-fine.component';
import { AdminService } from './services/adminservice.service';
import { TemplateComponent } from './pages/ui/dialog/template/template.component';
import { BroadcastmessageViewComponent } from './pages/ui/dialog/broadcastmessage-view/broadcastmessage-view.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { PrintTemComponent } from './pages/ui/dialog/print-tem/print-tem.component';
import { RejDismissComponent } from './pages/ui/dialog/rej-dismiss/rej-dismiss.component';
import { ReportsModule } from './pages/reports/reports.module';
import { AlertifyService } from './services/alertify.service';
import { SweetAlertService } from './services/sweetAlert.service';
import { VerifyotpComponent } from './pages/login/verifyOtp/verifyotp.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
//import { NgxNumToWordsModule } from 'ngx-num-to-words';

@NgModule({
  imports: [

    FormsModule,
    EditorModule,
    BrowserModule,
    LoginModule,
    AdminModule,
    OperationModule,
    ReportsModule,
    ManageUserModule,
    RoleAndPermissionModule,
    //ProfileModule,
    HomeModule,
    HttpModule,
    PaymentModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgIdleKeepaliveModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDe_oVpi9eRSN99G4o6TwVjJbFBNr58NxE'
    }),
    LocalStorageModule.withConfig({
      prefix: 'my-app',
      storageType: 'localStorage'
    }),
    PerfectScrollbarModule,
    CalendarModule.forRoot(),
    SharedModule,
    PipesModule,
    routing,
    MatDatepickerModule,
    MatInputModule, 
    MatNativeDateModule,
    //NgxNumToWordsModule

  ],
  entryComponents: [AppLoaderComponentComponent,
    DialogOverviewExampleDialog,
    TemplateComponent,
    PrintTemComponent,
    BroadcastmessageViewComponent,
    VerifyotpComponent
  ],
  declarations: [
    AppComponent,
    PagesComponent,
    BlankComponent,
    SearchComponent,
    NotFoundComponent,
    ErrorComponent,
    SidenavComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    BreadcrumbComponent,
    FlagsMenuComponent,
    FullScreenComponent,
    ApplicationsComponent,
    MessagesComponent,
    UserMenuComponent,
    AppLoaderComponentComponent,
    DialogOverviewExampleDialog,
    TemplateComponent,
    PrintTemComponent,
    BroadcastmessageViewComponent,
    VerifyotpComponent

    //EmailConComponent
  ],
  providers: [
    AppSettings,
    GeneralService,
    AdminService,
    ApiHeaderService,
    AlertifyService,
    SweetAlertService,
    // LocalStorageService,
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: OverlayContainer, useClass: CustomOverlayContainer }
  ],
  bootstrap: [AppComponent],
  // schemas: [
  //   CUSTOM_ELEMENTS_SCHEMA,
  //   NO_ERRORS_SCHEMA
  // ]
})
export class AppModule {
}