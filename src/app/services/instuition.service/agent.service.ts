import { Injectable } from '@angular/core';
import { Http, Response,RequestOptions, Headers } from '@angular/http';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class AgentService {
  private baseUrl = environment.apiURL;
  private autorization: any;
  private options: RequestOptions;
  private headers: Headers;
  constructor(private http: Http) {
    this.autorization =  { Authorization: 'Token adfasdfadf651f65asd1f65asdf' };
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: this.headers });

   }

  getAccountClass(): Observable<any> {
    return this.http.get(`${this.baseUrl}/AccountClass`)
        .map((response: Response) => {
            return response.json();
        });
  }
  getAccountClassById(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/AccountClass/${id}`)
        .map((response: Response) => {
            return response.json();
        });
}

  addAccountClass(accounttype):Observable<any> {

      return this.http.post(`${this.baseUrl}/AccountClass`, accounttype)
      .map((response: Response) => {
          return response.json();
      });
  }
  
  updateAccountClass(accounttype): Observable<any>  {
      let url = `${this.baseUrl}/AccountClass`;
      return  this.http.put(url, accounttype, this.options)
              .map((res: any) =>  res.json());
  }

  
}
