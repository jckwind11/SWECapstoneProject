import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import * as auth from 'firebase/auth';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';

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
        this.createUserData(result.user, firstName, lastName);
        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(this.userData));
        this.sendVerificationMail();
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  public signIn(email: string, password: string) {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['home']);
        });
        this.getUserData(result.user);
        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(result.user?.uid));
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  public signOut() {
    return this.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }

   public resetPassword (passwordResetEmail: string) {
    return this.auth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        this.router.navigate(['login']);
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  private createUserData(user: any, firstName: string, lastName: string) {
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      firstName: firstName,
      lastName: lastName,
      email: user.email,
      username: firstName + '.' + lastName,
      profilePictureURL: '',
      emailVerified: user.emailVerified,
      birthday: '',
      hometown: ''
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  private getUserData(user: any) {
    const userDoc: AngularFirestoreDocument<User> = this.firestore.doc(`users/${user.uid}`);
    userDoc.valueChanges().subscribe( data => {
      this.userData = data;
      localStorage.setItem('userData', JSON.stringify(this.userData));
      localStorage.setItem('user.username', this.userData.username);
      localStorage.setItem('user.uid', this.userData.uid);
    })
  }

  public get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  private sendVerificationMail() {
    return this.auth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['create-profile']);
      });
  }
}
