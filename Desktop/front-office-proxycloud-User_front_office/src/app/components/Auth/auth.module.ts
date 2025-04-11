import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetComponent } from './reset/reset.component';
import { ForgotComponent } from './forgot/forgot.component';
import { AuthRoutingModule } from './auth-routing.module';
import { RouterModule } from '@angular/router';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ResetComponent,
    ForgotComponent
  ],
  imports: [
    CommonModule,
    RouterModule ,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
   
    
    
  ],
  exports:[RouterModule]
})
export class AuthModule { }
