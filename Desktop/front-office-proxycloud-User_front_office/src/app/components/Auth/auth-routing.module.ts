import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetComponent } from './reset/reset.component';
import { ForgotComponent } from './forgot/forgot.component';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'register', component: RegisterComponent, pathMatch: 'full' },
  { path: 'forgot', component: ForgotComponent, pathMatch: 'full' },
  { path: 'reset', component: ResetComponent, pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent, pathMatch: 'full' },
];

  


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)

  ],
  
  exports:[RouterModule],
})
export class AuthRoutingModule { }
