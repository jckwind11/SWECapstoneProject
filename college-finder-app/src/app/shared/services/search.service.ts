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

  getAll() {
    const params = { "api_key": this.apiKey };

    return this.http.get<SearchResults>(`http://localhost:3030/parecord/getparecords`);
  }


  linkFactory(queryParams: any, fields: string[]) {
    var link = `https://api.data.gov/ed/collegescorecard/v1/schools`;
    link += this.addQueryParams(queryParams);
    link += this.addFields(fields);
    console.log(link);
    return link;
  }

  addQueryParams(queryParams: any): string {
    const keys = []
    for (const key in queryParams) {
      keys.push(encodeURIComponent(key) + "=" + encodeURIComponent(queryParams[key]));
    }
    return keys.join('&');
  }

  addFields(fields: string[]) {
    return fields.join(',');
  }

}
