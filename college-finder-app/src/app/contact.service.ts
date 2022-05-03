import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs';

imports: [
  HttpClientModule
]

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private api = "https://mailthis.to/mgannon3500@gmail.com"

  constructor(private http: HttpClient) { }

  PostMessage(input: any) {
    return this.http.post(this.api, input, {responseType: 'text'}).pipe(
      map(
        (resp) => {
          if(resp) {
            return resp;
          }
        },
        (err) => {
          return err;
        }
      )
    )
  }
}
