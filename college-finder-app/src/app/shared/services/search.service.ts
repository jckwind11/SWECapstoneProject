import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SearchResults } from '../models/search/SearchResults';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  apiKey = environment.collegeAPIkey;

  constructor(private http: HttpClient) { }

  search(name: String = '', size: number, cost: number, state: string, page: number = 0) {
    const sizeRange: string = (size * 1000) + "..";
    const costRange: string = ".." + (cost * 1000);
    const params = {
      "api_key": this.apiKey,
      "latest.student.size__range": sizeRange,
      "cost.avg_net_price.overall__range": costRange,
      "sort": "latest.cost.avg_net_price.overall",
      "page": page
    };
    if (state.length != 0) {
      params["school.state"] = state;
    }
    if (name != '') {
      params["school.name"] = name
    }
    const url = this.linkFactory(params);
    return this.http.get<SearchResults>(url);
  }

  searchAll() {
    const params = {
      "api_key": this.apiKey,
    };
    const url = this.linkFactory(params);
    return this.http.get<SearchResults>(url);
  }

  searchByIds(collegeIds: String[]) {
    const params = {
      "api_key": this.apiKey,
      "id": collegeIds
    };
    const url = this.linkFactory(params);
    return this.http.get<SearchResults>(url);
  }

  searchById(collegeId: String) {
    const params = {
      "api_key": this.apiKey,
      "id": collegeId
    };
    const url = this.linkFactory(params, true);
    return this.http.get<SearchResults>(url);
  }

  recommended() {
    const params = {
      "api_key": this.apiKey,
      "latest.student.size__range": "10000..",
      "cost.avg_net_price.overall__range": "..85000",
      "school.state": "CA"
    };
    const url = this.linkFactory(params);
    return this.http.get<SearchResults>(url);
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
