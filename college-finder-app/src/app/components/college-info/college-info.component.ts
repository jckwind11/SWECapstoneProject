import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { SchoolSearchResults } from 'src/app/shared/models/search/SchoolSearchResults';
import { SearchService } from 'src/app/shared/services/search.service';

@Component({
  selector: 'app-college-info',
  templateUrl: './college-info.component.html',
  styleUrls: ['./college-info.component.css']
})
export class CollegeInfoComponent implements OnInit {

  private id: string;

  private school: SchoolSearchResults;

  loading = false;

  constructor(private route: ActivatedRoute, public searchService: SearchService) { 
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    console.log(this.id);
    this.load();
  }

  private load() {
    this.loading = true;
    this.searchService.searchById(this.id).subscribe(
      result => {
        this.school = result.results[0];
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
      });
  }

}
