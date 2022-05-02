import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user/user';
import {Router} from '@angular/router';
import { UserData } from 'src/app/shared/models/user/userData';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  form: FormGroup;

  updateSuccess: Boolean;

  private userDoc: AngularFirestoreDocument<any>;

  userData: UserData;

  constructor(
    private afs: AngularFirestore, 
    public authService: AuthService, 
    private formBuilder: FormBuilder, 
    private router: Router,
    ) { 

    this.form = this.formBuilder.group({
      username: ['', Validators.required],
    })
    this.userData = authService.currentUserValue.data
    this.userDoc = afs.doc<UserData>('users/' + authService.currentUserValue.uid);
    this.form.setValue({
      username: this.userData.username
    })
   

    this.updateSuccess = false;
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

  ngOnInit(): void {
  }

}
