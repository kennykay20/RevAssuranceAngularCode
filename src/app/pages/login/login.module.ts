import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login.component';
import { EmailConComponent } from './email-con/email-con.component';
import { VerEmailComponent } from './ver-email/ver-email.component';
import { TermandConComponent } from './termand-con/termand-con.component';
import { LicenseComponent } from './license/license.component';
import { VerifyotpComponent } from './verifyOtp/verifyotp.component';

export const routes = [
              { path: '',  component: LoginComponent,  pathMatch: 'full' },
              { path: 'emailcon', component: EmailConComponent, data: { breadcrumb: 'Forgot Pwd Confirmation' } },
              { path: 'license', component: LicenseComponent, data: { breadcrumb: 'License' } },
              { path: 'verEmail', component: VerEmailComponent, data: { breadcrumb: 'Verify Email' } }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule, 
    ReactiveFormsModule,
    SharedModule,
    
  ],
 
  declarations: [
    LoginComponent,
    EmailConComponent,
    VerEmailComponent,
    TermandConComponent,
    LicenseComponent
  ],
  entryComponents: [
    TermandConComponent
  ],
    providers: [   ],
})
export class LoginModule { }