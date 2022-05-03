import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SearchResults } from '../models/search/SearchResults';
import { RecommendationHandler } from '../models/survey/survey';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  apiKey = environment.collegeAPIkey;

  constructor(private http: HttpClient) { }

  search(name: String = '', size: number, cost: number, state: string, page: number = 0, sortBy: string = "latest.school.name") {
    const sizeRange: string = (size * 1000) + "..";
    const costRange: string = ".." + (cost * 1000);
    const params = {
      "api_key": this.apiKey,
      "latest.student.size__range": sizeRange,
      "cost.avg_net_price.overall__range": costRange,
      "sort": sortBy,
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

  recommended(recommendations: RecommendationHandler, pageNum: number = 0, sortBy: string = "latest.school.name") {
    // console.log(recommendations);
    const params = {
      "api_key": this.apiKey,
      "page": pageNum,
      "sort": sortBy,
      "school.region.id": recommendations.regionIds,
      "school.locale": recommendations.localeIds,
      "latest.cost.avg_net_price.overall__range": recommendations.costRange,
      "latest.school.men_only": recommendations.menOnly,
      "latest.school.women_only": recommendations.womenOnly,
      "school.ownership": recommendations.ownershipIds,
      "school.degrees_awarded.predominant": recommendations.degreeIds,
    };

    if (recommendations.satScoreRange != null) {
      params["latest.admissions.sat_scores.average.overall__range"] = recommendations.satScoreRange;
    }
    if (recommendations.actScoreRange != null) {
      params["latest.admissions.act_scores.midpoint.cumulative__range"] = recommendations.actScoreRange;
    }
    if (recommendations.studentSizeRange != 'FILTER') {
      params["latest.student.size__range"] = recommendations.studentSizeRange;
    }

    const url = this.linkFactory(params);
    // console.log(url);
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
    "latest.student.enrollment.undergrad_12_month",
    "latest.student.enrollment.grad_12_month",
    "latest.student.demographics.men",
    "latest.student.demographics.women",
    "latest.cost.avg_net_price.overall",
    "latest.student.size"
  ];

  static inDepthFields = [
    "id",
    "latest.school.zip",
    "latest.school.city",
    "latest.school.name",
    "latest.school.alias",
    "latest.school.state",
    "latest.school.school_url",
    "latest.student.enrollment.undergrad_12_month",
    "latest.student.enrollment.grad_12_month",
    "latest.student.demographics.men",
    "latest.student.demographics.women",
    "latest.student.demographics.age_entry",
    "latest.student.demographics.first_generation",
    "latest.student.demographics.median_hh_income",
    "latest.cost.avg_net_price.overall",
    "latest.school.price_calculator_url",
    "latest.school.locale",
    "latest.school.degrees_awarded.predominant",
    "latest.school.degrees_awarded.highest",
    "latest.school.ownership",
    "latest.admissions.admission_rate.overall",
    "latest.school.accreditor",
    "latest.student.demographics.race_ethnicity",
    "latest.student.retention_rate.overall.full_time",
    "latest.cost.tuition.in_state",
    "latest.cost.tuition.out_of_state",
    "latest.aid.students_with_any_loan",
    "latest.aid.loan_principal"
  ]

}
