import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { UserFavorites } from '../models/favorite/favorite';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  public userFavorites: Observable<UserFavorites>;
  private favoritesArray: String[];

  constructor(
    private firestore: AngularFirestore,
    private auth: AuthService
  ) { 
    this.getFavorites();
  }

  public async getFavorites() {
    const doc = this.firestore.doc<any>('favorites/' + this.auth.currentUserValue.uid);
    this.userFavorites = doc.valueChanges();
    this.userFavorites.subscribe( data => {
      if (data != null) {
        this.favoritesArray = data.favoriteColleges;
      }
      else {
        doc.set({favoriteColleges: []}, { merge: true });
      }
    })
  } 

  public async addFavorite(schoolId: String) {
    const doc = this.firestore.doc<any>('favorites/' + this.auth.currentUserValue.uid);
    const newData: UserFavorites = {
      favoriteColleges: [...this.favoritesArray, schoolId]
    };
    doc.update(newData);
  }

  public async removeFavorite(schoolId: String) {
    const doc = this.firestore.doc<any>('favorites/' + this.auth.currentUserValue.uid);
    const newData: UserFavorites = {
      favoriteColleges: this.favoritesArray.filter(e => e !== schoolId)
    };
    doc.update(newData);
  }
 }
