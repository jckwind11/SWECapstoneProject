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

  fullName: string = '';
  city = "";
  state = "";
  zip = 0;

  ownernship = "";
  area_type = "";
  degree_type = "";
  highest_degree_type = "";

  admissions_rate = 0;

  loading = false;

  constructor(private route: ActivatedRoute, public searchService: SearchService) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.fullName = this.route.snapshot.queryParamMap.get('name');
    this.city = this.route.snapshot.queryParamMap.get('city');
    this.state = this.route.snapshot.queryParamMap.get('state');
  }

  ngOnInit(): void {
    this.load();
  }

  private load() {
    this.loading = true;
    this.searchService.searchById(this.id).subscribe(
      result => {
        this.school = result.results[0];
        this.populate();
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
      });
  }

  private populate() {
    this.fullName = this.school['latest.school.name'];
    this.zip = this.school['latest.school.zip'];
    this.city = this.school['latest.school.city'];
    this.state = this.school['latest.school.state'];
    switch (this.school['latest.school.ownership']) {
      case 1:
        this.ownernship = "Public University";
        break;
      case 2:
        this.ownernship = "Private Non-Profit University";
        break;
      case 3:
        this.ownernship = "Private University";
        break;
      default:
        this.ownernship = "unknown";
        break;
    }
    switch (this.school['latest.school.degree_urbanization']) {
      case 1:
        this.area_type = "Large City";
        break;
      case 2:
        this.area_type = "Mid-Size City";
        break;
      case 3:
        this.area_type = "Near Large City";
        break;
      case 4:
        this.area_type = "Near Mid-Size City";
        break;
      case 5:
        this.area_type = "Large Town";
        break;
      case 6:
        this.area_type = "Small Town";
        break;
      case 7:
      case 8:
        this.area_type = "Rural";
        break;
      default:
        this.area_type = "unknown";
        break;
    }
    switch (this.school['latest.school.degrees_awarded.predominant']) {
      case 1:
        this.degree_type = "Certificate Based Program";
        break;
      case 2:
        this.degree_type = "Associate's Degree";
        break;
      case 3:
        this.degree_type = "Bachelor's Degree";
        break;
      case 4:
        this.degree_type = "Graduate Program";
        break;
      default:
        this.degree_type = "unknown";
        break;
    }
    switch (this.school['latest.school.degrees_awarded.highest']) {
      case 1:
        this.highest_degree_type = "Certificate Based Program";
        break;
      case 2:
        this.highest_degree_type = "Associate's Degree";
        break;
      case 3:
        this.highest_degree_type = "Bachelor's Degree";
        break;
      case 4:
        this.highest_degree_type = "Graduate Program";
        break;
      default:
        this.highest_degree_type = "unknown";
        break;
    }
    this.admissions_rate = Math.floor(this.school['latest.admissions.admission_rate.overall'] * 100);
    // this.size = this.school['latest.student.size'];
    // this.website = this.school['latest.school.school_url'];
  }

}
