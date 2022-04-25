import { Injectable, NgZone } from '@angular/core';
import { User } from '../models/user';
import { UserData } from '../models/userData';
import * as auth from 'firebase/auth';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;

  username: string = '';

  private currentUserSubject: BehaviorSubject<User>;

  public currentUser: Observable<User>;

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone) {

    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));

    this.currentUser = this.currentUserSubject.asObservable();
  }

  public async signUp(firstName: string, lastName: string, email: string, password: string) {
    const result = await this.auth.createUserWithEmailAndPassword(email, password);
    await this.sendVerificationMail();
    localStorage.removeItem('user');
    await this.createUserData(result.user, firstName, lastName);
  }

  public async signIn(email: string, password: string) {
    const result = await this.auth.signInWithEmailAndPassword(email, password);
    localStorage.removeItem('user');
    await this.getUserData(result.user);
    this.router.navigate(['home']);
  }

  public async signOut() {
    await this.auth.signOut();
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['']);
  }

  public async resetPassword(passwordResetEmail: string) {
    await this.auth.sendPasswordResetEmail(passwordResetEmail);
    this.router.navigate(['login']);
  }

  private async createUserData(newUser: auth.User, firstName: string, lastName: string) {
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(`users/${newUser.uid}`);
    const userData: UserData = {
      uid: newUser.uid,
      firstName: firstName,
      lastName: lastName,
      email: newUser.email,
      username: firstName + '.' + lastName,
      profilePictureURL: '',
      birthday: '',
      hometown: ''
    };
    const user: User = {
      uid: newUser.uid,
      displayName: newUser.displayName,
      email: newUser.email,
      emailVerified: newUser.emailVerified,
      photoURL: newUser.photoURL,
      data: userData
    }
    await userRef.set(userData, { merge: true });
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.router.navigate(['home']);
  }

  private async getUserData(thisUser: auth.User) {
    const userDoc: AngularFirestoreDocument<UserData> = this.firestore.doc<UserData>(`users/${thisUser.uid}`);
    const document = await userDoc.get().pipe(first()).toPromise();
    const user: User = {
        uid: thisUser.uid,
        displayName: thisUser.displayName,
        email: thisUser.email,
        emailVerified: thisUser.emailVerified,
        photoURL: thisUser.photoURL,
        data: document.data()
    }
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private async sendVerificationMail() {
    const newUser = await this.auth.currentUser;
    await newUser.sendEmailVerification();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
}
