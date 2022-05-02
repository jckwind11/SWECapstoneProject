import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserFavorites } from 'src/app/shared/models/favorite/favorite';
import { SchoolSearchResults } from 'src/app/shared/models/search/SchoolSearchResults';
import { FavoritesService } from 'src/app/shared/services/favorites.service';
import { SearchService } from 'src/app/shared/services/search.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {

  userFavorites: Observable<UserFavorites>

  schools: SchoolSearchResults[] = [];
  loading = false;

  constructor(favoriteService: FavoritesService, searchService: SearchService) { 
    this.userFavorites = favoriteService.userFavorites;
    this.userFavorites.subscribe(data => {
      searchService.searchById(data.favoriteColleges).subscribe(
        result => {
          this.schools = result.results;
          this.schools.sort(function (a, b) {
            return a['latest.cost.avg_net_price.overall'] - b['latest.cost.avg_net_price.overall'];
          });
          this.loading = false;
        },
        error => {
          console.log(error);
          this.loading = false;
          // this.notifService.showNotif(error.toString(), 'warning');
        });
    });
  }

  ngOnInit(): void {
  }

}
