import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { SearchService } from '../../shared/services/search.service';
import { SchoolSearchResults } from '../../shared/models/search/SchoolSearchResults';
import { FavoritesService } from 'src/app/shared/services/favorites.service';
import { Observable } from 'rxjs';
import { UserFavorites } from 'src/app/shared/models/favorite/favorite';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  apiKey = environment.collegeAPIkey;
  search_mode = "Recommended";

  school_name: String = "";
  school_size = 35;
  school_cost = 30;
  school_state = "";

  numPages = 0;
  currentPage = 0;
  schools: SchoolSearchResults[] = [];
  favorites: String[] = [];

  loading = false;

  constructor(
    public authService: AuthService,
    public searchService: SearchService,
    public favoriteService: FavoritesService
    ) {

  }

  ngOnInit(): void {
    this.loading = true;
    this.favoriteService.userFavorites.subscribe(
      (result: UserFavorites) => {
        this.favorites = result.favoriteColleges;
      },
      error => {
        console.log(error);
      });
    this.searchRecommended();
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
    if (this.search_mode === 'Recommended') {
      this.searchRecommended();
    }
    else {
      this.searchCustom();
    }
  }

  searchRecommended() {
    this.loading = true;
    this.searchService.recommended(this.currentPage).subscribe(
      result => {
        this.numPages = Math.ceil(result.metadata.total / result.metadata.per_page);
        this.schools = result.results;
        // this.schools.sort(function (a, b) {
        //   return a['latest.cost.avg_net_price.overall'] - b['latest.cost.avg_net_price.overall'];
        // });
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
        // this.notifService.showNotif(error.toString(), 'warning');
      });
  }

  searchCustom() {
    this.loading = true;
    this.searchService.search(this.school_name, this.school_size, this.school_cost, this.school_state, this.currentPage).subscribe(
      result => {
        this.numPages = Math.ceil(result.metadata.total / result.metadata.per_page);
        this.schools = result.results;
        console.log
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
    this.searchCustom();
  }

}
