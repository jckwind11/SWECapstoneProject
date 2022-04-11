import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SplashComponent } from './splash/splash.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { RedirectIfAuthenticatedGuard } from './shared/guard/redirect-if-authenticated.guard';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', component: SplashComponent, canActivate: [RedirectIfAuthenticatedGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [RedirectIfAuthenticatedGuard] },
  { path: 'create-profile', component: CreateProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [RedirectIfAuthenticatedGuard]},
  { path: 'reset-password', component: ForgotPasswordComponent, canActivate: [RedirectIfAuthenticatedGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
