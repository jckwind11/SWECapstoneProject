import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { SchoolSearchResults } from 'src/app/shared/models/search/SchoolSearchResults';
import { SearchService } from 'src/app/shared/services/search.service';

import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { FavoritesService } from 'src/app/shared/services/favorites.service';

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

  website = "";
  cost_calculator = "";
  img_url = "";

  price = "";

  size = 0;
  percentWomen = 0;
  percentMen = 0;

  admissions_rate = 0;

  loading = false;
  toggle = false;

  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    events: [],
    hover: {mode: null},
    plugins: {
      title: {
        display: true,
        text: 'Population Breakdown'
      },
      datalabels: {
        color: ['rgb(0,0,0)', 'rgb(255,255,255)'],
        
        labels: {
          title: {
            font: {
              weight: 'bold',
              size: 15
            }
          },
        },
        formatter: (value, _) => {
          return value + '%';
        },
      },
    }
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Men', 'Women'],
    datasets: [{
      data: [this.percentMen, this.percentWomen],
      backgroundColor: [
        'rgb(137, 207, 240)',
        'rgb(255,105,180)'
      ]
    }]
  };

  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [ DatalabelsPlugin ];

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
    this.percentMen = Math.floor(this.school['latest.student.demographics.men'] * 100);
    this.percentWomen = Math.floor(this.school['latest.student.demographics.women'] * 100);
    if (!/^https?:\/\//i.test(this.website)) {
      this.website = 'https://' + this.website;
    }
    this.img_url = "https://logo.clearbit.com/" + this.website;
    this.admissions_rate = Math.floor(this.school['latest.admissions.admission_rate.overall'] * 100);
    this.cost_calculator = this.school['latest.school.price_calculator_url'];
    this.size = this.school['latest.student.size'];
    this.calculatePrice(this.school['latest.cost.avg_net_price.overall']);
    if (!/^https?:\/\//i.test(this.cost_calculator)) {
      this.cost_calculator = 'https://' + this.cost_calculator;
    }
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

    this.pieChartData = {
      labels: ['Men', 'Women'],
      datasets: [{
        data: [this.percentMen, this.percentWomen],
        backgroundColor: [
          'rgb(137, 207, 240)',
          'rgb(255,105,180)'
        ]
      }]
    };
  }

  calculatePrice(input?: number) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    if (typeof input !== 'undefined') {
      this.price = formatter.format(input);
    }
  }

  change() {
    this.toggle = !this.toggle;
    console.log(this.toggle);
    if(this.toggle) {
      this.favoriteService.addFavorite(`${this.school.id}`);
    }
    else {
      this.favoriteService.removeFavorite(`${this.school.id}`);
    }
  }

}
