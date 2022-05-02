import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { SearchService } from '../../shared/services/search.service';
import { SchoolSearchResults } from '../../shared/models/search/SchoolSearchResults';
import { FavoritesService } from 'src/app/shared/services/favorites.service';
import { Observable } from 'rxjs';
import { UserFavorites } from 'src/app/shared/models/favorite/favorite';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SearchResults } from 'src/app/shared/models/search/SearchResults';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SurveyForm } from 'src/app/shared/models/survey/survey';

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
    public favoriteService: FavoritesService,
    private http: HttpClient,
    private firestore: AngularFirestore) {

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
    this.recommended(this.currentPage).subscribe(
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

  recommended(pageNum: number = 0) {
    const doc = this.firestore.doc<any>('surveys/' + this.authService.currentUserValue.uid);
    doc.valueChanges().subscribe( data => {
      if (data != null) {
        const formData: SurveyForm = data;
        console.log(data);
      }
    })
    
    const params = {
      "api_key": this.apiKey,
      "page": pageNum,
      "sort": "latest.school.name",
      "school.region.id": [1,2,5,6],
      "school.locale": [11,12,13,21,22,23,31,32,33],
      "latest.cost.avg_net_price.overall__range": "..18000",
      "latest.student.size__range": "15000..",
      "latest.school.men_only": 0,
      "latest.school.women_only": 0,
      "school.ownership": [1,2,3],
      "school.degrees_awarded.predominant": 3,
      "latest.admissions.sat_scores.average.overall__range": "..1300"
    };
    const url = this.linkFactory(params);
    console.log(url);
    return this.http.get<SearchResults>(url);
    // https://api.data.gov/ed/collegescorecard/v1/schools?api_key=yAZ3JaZzDbjzTLPrdXmazvRcHrHqYDXbbdRFbvka&page=1&sort=latest.school.name&school.region.id=1,2,5&school.locale=11,12,13,21,22,23,31,32,33&latest.cost.avg_net_price.overall__range=..18000&latest.student.size__range=5000..15000&latest.school.men_only=0&latest.school.women_only=0&school.ownership=1,2,3&school.degrees_awarded.predominant=3&latest.admissions.sat_scores.average.overall__range=..1300&fields=id,latest.school.zip,latest.school.city,latest.school.name,latest.school.alias,latest.school.state,latest.school.school_url,latest.student.size,latest.student.demographics.men,latest.student.demographics.women,latest.cost.avg_net_price.overall
  }

  linkFactory(queryParams: any, inDepth: boolean = false) {
    var link = `https://api.data.gov/ed/collegescorecard/v1/schools?`;
    queryParams.fields = inDepth ? SearchService.inDepthFields :  SearchService.fields;
    link += this.addQueryParams(queryParams);
    return link;
  }

  addQueryParams(queryParams: any): string {
    const keys = []
    for (const key in queryParams) {
      keys.push(encodeURIComponent(key) + "=" + queryParams[key]);
    }
    return keys.join('&');
  }

  static fields = [
    "id",
    "latest.school.zip",
    "latest.school.city",
    "latest.school.name",
    "latest.school.alias",
    "latest.school.state",
    "latest.school.school_url",
    "latest.student.size",
    "latest.student.demographics.men",
    "latest.student.demographics.women",
    "latest.cost.avg_net_price.overall"
  ];

  static inDepthFields = [
    "id",
    "latest.school.zip",
    "latest.school.city",
    "latest.school.name",
    "latest.school.alias",
    "latest.school.state",
    "latest.school.school_url",
    "latest.student.size",
    "latest.student.demographics.men",
    "latest.student.demographics.women",
    "latest.cost.avg_net_price.overall",
    "latest.school.price_calculator_url",
    "latest.school.degree_urbanization",
    "latest.school.degrees_awarded.predominant",
    "latest.school.degrees_awarded.highest",
    "latest.school.ownership",
    "latest.admissions.admission_rate.overall"
  ]

}
