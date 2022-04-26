import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SplashComponent } from './components/splash/splash.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { CreateProfileComponent } from './components/create-profile/create-profile.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { RedirectIfAuthenticatedGuard } from './shared/guard/redirect-if-authenticated.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { SurveyComponent } from './components/survey/survey.component';
import { FavoriteComponent } from './favorite/favorite.component';

const routes: Routes = [
  { path: '', component: SplashComponent, canActivate: [RedirectIfAuthenticatedGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [RedirectIfAuthenticatedGuard] },
  { path: 'create-profile', component: CreateProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [RedirectIfAuthenticatedGuard]},
  { path: 'reset-password', component: ForgotPasswordComponent, canActivate: [RedirectIfAuthenticatedGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'survey', component: SurveyComponent, canActivate: [AuthGuard]},
  { path: 'favorite', component: FavoriteComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
