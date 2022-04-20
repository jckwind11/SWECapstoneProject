import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/services/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  form: FormGroup;

  updateSuccess: Boolean;

  private userDoc: AngularFirestoreDocument<any>;

  // Get local saved data before retrieving data from the db
  userData: any = JSON.parse(localStorage.getItem('userData') || '');

  constructor(
    private afs: AngularFirestore, 
    public authService: AuthService, 
    private formBuilder: FormBuilder, 
    private router: Router,
    ) { 
    this.userDoc = afs.doc<any>('users/' + localStorage.getItem('user.uid'));
    this.userDoc.valueChanges().subscribe( data => {
      this.userData = data;
    })

    this.form = this.formBuilder.group({
      username: [this.userData.username, Validators.required],
      birthday: [this.userData.birthday],
      hometown: [this.userData.hometown]
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
    console.log(this.f.username.value)
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Save data
    this.userData.username = this.f.username.value
    this.userData.birthday = this.f.birthday.value
    this.userData.hometown = this.f.hometown.value

    this.update(this.userData);

  }

  ngOnInit(): void {
  }

}
