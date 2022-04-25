import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { SearchService } from '../../shared/services/search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  school_size = 50;

  constructor(
    public authService: AuthService, 
    public searchService: SearchService) { 
    
  }

  ngOnInit(): void {
  }

  formatLabel(value: number) {
    return value + 'k';
  }

  search() {
    this.searchService.getBasedOnSize(this.school_size).subscribe(
      schools => {
        console.log(schools);
      },
      error => {
        console.log(error);
        // this.notifService.showNotif(error.toString(), 'warning');
      });
  }

}
