import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { NgxSliderModule } from '@angular-slider/ngx-slider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SplashComponent } from './components/splash/splash.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';

import { AuthService } from "./shared/services/auth.service";

import { MaterialModule } from './material-module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgChartsModule } from 'ng2-charts';
import { CreateProfileComponent } from './components/create-profile/create-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SurveyComponent } from './components/survey/survey.component';
import { CollegeRowComponent } from './components/college-row/college-row.component';
import { FavoriteComponent } from './components/favorite/favorite.component';
import { CollegeInfoComponent } from './components/college-info/college-info.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ContactService } from './contact.service';


@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    HomeComponent,
    SignupComponent,
    CreateProfileComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    SurveyComponent,
    CollegeRowComponent,
    FavoriteComponent,
    CollegeInfoComponent,
    ContactFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    NgxSliderModule,
    NgChartsModule
  ],
  providers: [AuthService, ContactService],
  bootstrap: [AppComponent]
})
export class AppModule { }
