import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { SearchService } from '../../shared/services/search.service';
import { SchoolSearchResults } from '../../shared/models/search/SchoolSearchResults';
import { FavoritesService } from 'src/app/shared/services/favorites.service';
import { Observable } from 'rxjs';
import { UserFavorites } from 'src/app/shared/models/favorite/favorite';
import { environment } from 'src/environments/environment';
import { RecommendationHandler, SurveyForm } from 'src/app/shared/models/survey/survey';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SurveyQuestionHandler } from 'src/app/shared/models/survey/questions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  apiKey = environment.collegeAPIkey;
  search_mode = "Recommended";
  sort_by = "latest.school.name";

  school_name: String = "";
  school_size = 35;
  school_cost = 30;
  school_state = "";

  numPages = 0;
  currentPage = 0;
  schools: SchoolSearchResults[] = [];
  favorites: String[] = [];

  private recommendations: RecommendationHandler;
  recommendationsError = '';
  recommendationsStrings: string[] = []

  loading = false;

  constructor(
    public authService: AuthService,
    public searchService: SearchService,
    public favoriteService: FavoritesService,
    public firestore: AngularFirestore,
    private surveyQuestionHandler: SurveyQuestionHandler
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

    // Load user survey data for recommendations
    const doc = this.firestore.doc<any>('surveys/' + this.authService.currentUserValue.uid);
    doc.valueChanges().subscribe( data => {
      if (data != null) {
        const formData: SurveyForm = data;
        this.recommendations = this.surveyQuestionHandler.getRecommendationHandler(formData);

        // Recs Strings
        if (this.recommendations.regionIdsString != null) this.recommendationsStrings.push(this.recommendations.regionIdsString);
        if (this.recommendations.localeIdsString != null) this.recommendationsStrings.push(this.recommendations.localeIdsString);
        if (this.recommendations.costRangeString != null) this.recommendationsStrings.push(this.recommendations.costRangeString);
        if (this.recommendations.studentSizeString != null) this.recommendationsStrings.push(this.recommendations.studentSizeString);
        if (this.recommendations.schoolTypeString != null) this.recommendationsStrings.push(this.recommendations.schoolTypeString);
        if (this.recommendations.ownershipString != null) this.recommendationsStrings.push(this.recommendations.ownershipString);
        if (this.recommendations.degreeIdsString != null) this.recommendationsStrings.push(this.recommendations.degreeIdsString);
        if (this.recommendations.satScoreString != null) this.recommendationsStrings.push(this.recommendations.satScoreString);
        if (this.recommendations.actScoreString != null) this.recommendationsStrings.push(this.recommendations.actScoreString);

        this.searchRecommended();
      }
      else {
        this.recommendationsError = "Pleae fill out the user survey in Profile to get recommendations";
        this.loading = false;
      }
    })
  }

  get isCustom(): boolean {
    return !(this.search_mode == "Recommended");
  }

  didChange() {
    if (!this.isCustom) {
      this.searchRecommended();
    }
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

  sortChange() {
    if (this.search_mode === 'Recommended') {
      this.searchRecommended();
    }
    else {
      this.searchCustom();
    }
  }

  searchRecommended() {
    if (this.recommendations == null) {
      this.schools = []; 
      this.numPages = 0;
      this.currentPage = 0;
      return
    }

    this.loading = true;
    
    this.searchService.recommended(this.recommendations, this.currentPage, this.sort_by).subscribe(
      result => {
        this.numPages = Math.ceil(result.metadata.total / result.metadata.per_page);
        this.schools = result.results;
        if (this.recommendations.studentSizeRange == 'FILTER') {
          console.log('test filter')
          this.schools = this.schools.filter(this.filterSchoolSize);
        }
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
        // this.notifService.showNotif(error.toString(), 'warning');
      });
  }

  filterSchoolSize(item: SchoolSearchResults) {
    if (item['latest.student.size'] < 5000 || item['latest.student.size'] > 15000) {
      return true;
    }
    return false;
  }

  searchCustom() {
    this.loading = true;
    this.searchService.search(this.school_name, this.school_size, this.school_cost, this.school_state, this.currentPage, this.sort_by).subscribe(
      result => {
        this.numPages = Math.ceil(result.metadata.total / result.metadata.per_page);
        this.schools = result.results;
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
