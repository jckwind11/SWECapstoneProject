import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { SchoolSearchResults } from 'src/app/shared/models/search/SchoolSearchResults';
import { SearchService } from 'src/app/shared/services/search.service';

import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { FavoritesService } from 'src/app/shared/services/favorites.service';
import { right } from '@popperjs/core';

@Component({
  selector: 'app-college-info',
  templateUrl: './college-info.component.html',
  styleUrls: ['./college-info.component.css']
})
export class CollegeInfoComponent implements OnInit {

  private id: string;

  private school: SchoolSearchResults;

  // meta info
  fullName: string = '';
  city = "";
  state = "";
  zip = 0;
  ownernship = "";
  area_type = "";
  degree_type = "";
  highest_degree_type = "";
  accreditor = "";
  admissions_rate: any = "No Data";
  retention_rate: any = "No Data";

  // urls
  website = "";
  cost_calculator = "";
  img_url = "";

  // cost & aid
  // price = "";
  in_state_price = "";
  out_state_price = ""
  students_with_loan = "";
  average_debt = "";

  //demographics
  undergrad_size: any = "No Data";
  grad_size: any = "No Data";
  percentWomen = 0;
  percentMen = 0;
  percentFirstGen: any = "No Data";
  average_age: any = "No Data";
  average_hh_income: any = "No Data";

  loading = false;
  toggle = false;

  constructor(private route: ActivatedRoute, public searchService: SearchService, private favoriteService: FavoritesService) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.fullName = this.route.snapshot.queryParamMap.get('name');
    this.city = this.route.snapshot.queryParamMap.get('city');
    this.state = this.route.snapshot.queryParamMap.get('state');
    this.toggle = this.route.snapshot.queryParamMap.get('toggle') == "true";
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
    this.website = this.school['latest.school.school_url'];
    this.average_age = this.school['latest.student.demographics.age_entry'] + " years old";
    this.accreditor = this.school['latest.school.accreditor'];
    this.cost_calculator = this.school['latest.school.price_calculator_url'];
    if (this.school['latest.student.enrollment.undergrad_12_month']) {
      this.undergrad_size = this.school['latest.student.enrollment.undergrad_12_month'].toLocaleString();
    }
    if (this.school['latest.student.enrollment.grad_12_month']) {
      this.grad_size = this.school['latest.student.enrollment.grad_12_month'].toLocaleString();
    }
    if (this.school['latest.student.demographics.men']) {
      this.percentMen = Math.round(this.school['latest.student.demographics.men'] * 100);
    }
    if (this.school['latest.student.demographics.women']) {
      this.percentWomen = Math.round(this.school['latest.student.demographics.women'] * 100);
    }
    if (this.school['latest.student.demographics.first_generation']) {
      this.percentFirstGen = Math.round(this.school['latest.student.demographics.first_generation'] * 100) + '%';
    }
    if (this.school['latest.admissions.admission_rate.overall']) {
      this.admissions_rate = Math.round(this.school['latest.admissions.admission_rate.overall'] * 100) + '%';
    }
    if (this.school['latest.student.retention_rate.overall.full_time']) {
      this.retention_rate = Math.round(this.school['latest.student.retention_rate.overall.full_time'] * 100) + '%';
    }
    if (this.school['latest.aid.students_with_any_loan']) {
      this.students_with_loan = Math.round(this.school['latest.aid.students_with_any_loan'] * 100) + '%';
    }
    this.average_hh_income = this.calculatePrice(this.school['latest.student.demographics.median_hh_income']);
    this.in_state_price = this.calculatePrice(this.school['latest.cost.tuition.in_state']);
    this.out_state_price = this.calculatePrice(this.school['latest.cost.tuition.out_of_state']);
    this.average_debt = this.calculatePrice(this.school['latest.aid.loan_principal']);
    if (!/^https?:\/\//i.test(this.website)) {
      this.website = 'https://' + this.website;
    }
    if (!/^https?:\/\//i.test(this.cost_calculator)) {
      this.cost_calculator = 'https://' + this.cost_calculator;
    }
    this.img_url = "https://logo.clearbit.com/" + this.website;
  
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
    switch (this.school['latest.school.locale']) {
      case 11:
        this.area_type = "Large City";
        break;
      case 12:
        this.area_type = "Mid-Size City";
        break;
      case 13:
        this.area_type = "Small City";
        break;
      case 21:
        this.area_type = "Near Large City";
        break;
      case 22:
        this.area_type = "Near Mid-Size City";
        break;
      case 23:
        this.area_type = "Near Small City";
        break;
      case 31:
        this.area_type = "Large Town";
        break;
      case 32:
        this.area_type = "Mid-Size Town";
        break;
      case 33:
        this.area_type = "Small Town";
        break;
      case 41:
      case 42:
      case 43:
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
    this.pieChartDataGender = {
      labels: ['Men', 'Women'],
      datasets: [{
        data: [this.percentMen, this.percentWomen],
        backgroundColor: [
          'rgb(137, 207, 240)',
          'rgb(255,105,180)'
        ]
      }]
    };
    const otherRaces = this.school['latest.student.demographics.race_ethnicity.aian'] +
      this.school['latest.student.demographics.race_ethnicity.nhpi'] +
      this.school['latest.student.demographics.race_ethnicity.non_resident_alien'] +
      this.school['latest.student.demographics.race_ethnicity.two_or_more'] +
      this.school['latest.student.demographics.race_ethnicity.unknown'];
    this.pieChartDataRace = {
      labels: ['White', 'Black', "Hispanic", "Asian", "Other"],
      datasets: [{
        data: [
          Math.floor(this.school['latest.student.demographics.race_ethnicity.white'] * 100),
          Math.floor(this.school['latest.student.demographics.race_ethnicity.black'] * 100),
          Math.floor(this.school['latest.student.demographics.race_ethnicity.hispanic'] * 100),
          Math.floor(this.school['latest.student.demographics.race_ethnicity.asian'] * 100),
          Math.floor(otherRaces * 100),
        ]
      }]
    };
  }

  calculatePrice(input?: number): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    if (typeof input !== 'undefined') {
      return formatter.format(input);
    }
  }

  change() {
    this.toggle = !this.toggle;
    console.log(this.toggle);
    if (this.toggle) {
      this.favoriteService.addFavorite(`${this.school.id}`);
    }
    else {
      this.favoriteService.removeFavorite(`${this.school.id}`);
    }
  }

  // Pie
  public pieChartOptionsGender: ChartConfiguration['options'] = {
    responsive: true,
    events: ['mousemove', 'mouseout'],
    hover: { mode: 'index' },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.formattedValue;
            return " " + label + '%';
          }
        }
      },
      legend: {
        display: true,
        position: right,
      },
      title: {
        display: true,
        text: 'Gender Breakdown'
      },
    }
  };

  public pieChartOptionsRace: ChartConfiguration['options'] = {
    responsive: true,
    events: ['mousemove', 'mouseout'],
    hover: { mode: 'index' },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.formattedValue;
            return " " + label + '%';
          }
        }
      },
      legend: {
        display: true,
        position: right,
      },
      title: {
        display: true,
        text: 'Race Breakdown'
      }
    }
  };

  public pieChartDataGender: ChartData<'pie', number[], string | string[]> = {
    labels: ['Men', 'Women'],
    datasets: [{
      data: [this.percentMen, this.percentWomen],
      backgroundColor: [
        'rgb(137, 207, 240)',
        'rgb(255,105,180)'
      ]
    }]
  };

  public pieChartDataRace: ChartData<'pie', number[], string | string[]> = {
    labels: ['White', 'Black', "Hispanic", "Asian", "Other"],
    datasets: [{
      data: []
    }]
  };

  public pieChartType: ChartType = 'pie';

}
