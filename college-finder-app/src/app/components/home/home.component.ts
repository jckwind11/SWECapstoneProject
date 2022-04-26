import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { SearchService } from '../../shared/services/search.service';
import { SchoolSearchResults } from '../../shared/models/search/SchoolSearchResults';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  search_mode = "Recommended";

  school_size = 50;
  school_cost = 30;
  school_state = "";

  schools: SchoolSearchResults[] = [];

  constructor(
    public authService: AuthService, 
    public searchService: SearchService) { 
    
  }

  ngOnInit(): void {
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

  search() {
    this.searchService.search(this.school_size, this.school_cost, this.school_state).subscribe(
      result => {
        this.schools = result.results;
        console.log(this.schools);
      },
      error => {
        console.log(error);
        // this.notifService.showNotif(error.toString(), 'warning');
      });
  }

}
