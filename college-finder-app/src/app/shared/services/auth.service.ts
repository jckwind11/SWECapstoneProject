import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import * as auth from 'firebase/auth';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;

  username: string = '';

  constructor ( 
    private firestore: AngularFirestore, 
    private auth: AngularFireAuth, 
    private router: Router, 
    private ngZone: NgZone) {
    this.auth.authState.subscribe((user: any) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  public signUp(firstName: string, lastName: string, email: string, password: string) {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.setUserData(result.user, firstName + '.' + lastName);
        this.sendVerificationMail();
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  private setUserData(user: any, username: string) {
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(`users/${user.uid}`);
    this.username = username;
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: username,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  private sendVerificationMail() {
    return this.auth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['create-profile']);
      });
  }
}
