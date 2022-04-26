import { Component, OnInit, Input } from '@angular/core';
import { SchoolSearchResults } from '../../shared/models/search/SchoolSearchResults';

@Component({
  selector: 'college-row',
  templateUrl: './college-row.component.html',
  styleUrls: ['./college-row.component.css']
})
export class CollegeRowComponent implements OnInit {

  fullName = "";

  city = "";
  state = "";
  zip = 0;

  price = "";

  size = 0;
  percentWomen = 0;
  percentMen = 0;

  website = "vt.edu";


  @Input() school: SchoolSearchResults;

  constructor() { }

  ngOnInit(): void {
    this.fullName = this.school['latest.school.name'];
    this.zip = this.school['latest.school.zip'];
    this.city = this.school['latest.school.city'];
    this.state = this.school['latest.school.state'];
    this.size = this.school['latest.student.size'];
    this.website = this.school['latest.school.school_url'];
    if (!/^https?:\/\//i.test(this.website)) {
      this.website = 'https://' + this.website;
    }
    this.percentMen = Math.floor(this.school['latest.student.demographics.men'] * 100);
    this.percentWomen = Math.floor(this.school['latest.student.demographics.women'] * 100);
    this.calculatePrice(this.school['latest.cost.avg_net_price.overall']);
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

}
