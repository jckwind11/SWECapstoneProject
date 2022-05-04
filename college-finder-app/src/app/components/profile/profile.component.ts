import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { UserData } from 'src/app/shared/models/user/userData';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  form: FormGroup;

  updateSuccess: Boolean;
  emailSent: Boolean;

  user_password = '';

  private userDoc: AngularFirestoreDocument<any>;

  userData: UserData;

  constructor(
    private afs: AngularFirestore, 
    public authService: AuthService, 
    private formBuilder: FormBuilder, 
    private notificationService: NotificationService
    ) { 

    this.form = this.formBuilder.group({
      username: ['', Validators.required],
    })
    this.userData = authService.currentUserValue.data
    this.userDoc = this.afs.doc<UserData>('users/' + authService.currentUserValue.uid);
    this.form.setValue({
      username: this.userData.username
    })
   

    this.updateSuccess = false;
    this.emailSent = false;
  }

  get f(){
    return this.form.controls;
  }

  update(userData: any) {
    this.userDoc.update(userData);
    localStorage.setItem('userData', JSON.stringify(this.userData));
    this.updateSuccess = true;
  }

  updateAccount() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Save data
    this.userData.username = this.f.username.value;

    this.update(this.userData);

  }

  reset() {
    this.emailSent = true;
    this.authService.resetPassword2(this.userData.email);
  }

  async deleteAccount() {
    try {
      await this.authService.deleteUserAccount(this.user_password);
    } catch (error) {
      console.log(error);
      this.notificationService.showNotif(error, "okay");
    }
  }

  logout() {
    this.authService.signOut()
    .then(() => {
      console.log('logged out');
    })
    .catch(error => {
      this.notificationService.showNotif(error, "okay");
    })
  }

  ngOnInit(): void {
  }

}
