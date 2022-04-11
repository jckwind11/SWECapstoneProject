import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/services/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private userDoc: AngularFirestoreDocument<any>;
  userData: any;
  constructor(private afs: AngularFirestore, authService: AuthService) { 
    console.log(localStorage.getItem('userData'));
    this.userDoc = afs.doc<any>('users/' + localStorage.getItem('user.uid'));
    this.userDoc.valueChanges().subscribe( data => {
      this.userData = data;
    })
  }

  update(userData: any) {
    this.userDoc.update(userData);
  }

  ngOnInit(): void {
  }

}
