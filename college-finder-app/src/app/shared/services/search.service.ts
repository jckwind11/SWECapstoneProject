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

  getBasedOnSize(size: number) {
    const params = { "api_key": this.apiKey, "student.size__range": "5000.." };
    const fields = ["id", "school.name", "school.state"];
    const url = this.linkFactory(params, fields);
    return this.http.get<SearchResults>(url);
  }


  linkFactory(queryParams: any, fields: string[]) {
    var link = `https://api.data.gov/ed/collegescorecard/v1/schools?`;
    queryParams.fields = fields
    link += this.addQueryParams(queryParams);
    return link;
  }

  addQueryParams(queryParams: any): string {
    const keys = []
    for (const key in queryParams) {
      keys.push(encodeURIComponent(key) + "=" + encodeURIComponent(queryParams[key]));
    }
    return keys.join('&');
  }

}
