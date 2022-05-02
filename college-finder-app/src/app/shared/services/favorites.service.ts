import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { arrayUnion, arrayRemove } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserFavorites } from '../models/favorite/favorite';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  public userFavorites: Observable<UserFavorites>;
  public favoritesArray: String[];

  constructor(
    private firestore: AngularFirestore,
    private auth: AuthService
  ) {
    const doc = this.firestore.doc<any>(`favorites/${this.auth.currentUserValue.uid}`);
    this.userFavorites = doc.valueChanges();
  }

  public async addFavorite(schoolId: String) {
    const doc = this.firestore.doc<any>(`favorites/${this.auth.currentUserValue.uid}`);
    await doc.update({
      favoriteColleges: arrayUnion(schoolId)
    })
  }

  public async removeFavorite(schoolId: String) {
    const doc = this.firestore.doc<any>('favorites/' + this.auth.currentUserValue.uid);
    await doc.update({
      favoriteColleges: arrayRemove(schoolId)
    })
  }
}
