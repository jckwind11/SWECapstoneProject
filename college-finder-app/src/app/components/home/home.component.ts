import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { SearchService } from '../../shared/services/search.service';
import { SchoolSearchResults } from '../../shared/models/search/SchoolSearchResults';
import { FavoritesService } from 'src/app/shared/services/favorites.service';
import { Observable } from 'rxjs';
import { UserFavorites } from 'src/app/shared/models/favorite/favorite';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  search_mode = "Recommended";

  school_size = 35;
  school_cost = 30;
  school_state = "";

  numPages = 0;
  currentPage = 0;
  schools: SchoolSearchResults[] = [];
  userFavorites: Observable<UserFavorites>;

  loading = false;

  constructor(
    public authService: AuthService,
    public searchService: SearchService,
    public favoritesService: FavoritesService) {

      
  }

  ngOnInit(): void {
    this.userFavorites = this.favoritesService.userFavorites;
    this.loading = true;
    this.favoritesService.getFavorites()
    this.searchService.recommended().subscribe(
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
  }

  get isCustom(): boolean {
    return !(this.search_mode == "Recommended");
  }

  formatLabel(value: number) {
    return value + 'k';
  }

  formatCost(value: number) {
    return '$' + value + 'k';
  }

  changePage(pageNum: number) {
    this.currentPage = pageNum;
    this.search();
  }

  search() {
    this.loading = true;
    this.searchService.search(this.school_size, this.school_cost, this.school_state, this.currentPage).subscribe(
      result => {
        this.numPages = Math.ceil(result.metadata.total / result.metadata.per_page);
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
  }

  searchButton() {
    this.currentPage = 0;
    this.numPages = 0;
    this.search();
  }

}
