//import { AsyncLocalStorage } from 'angular-async-local-storage';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'; 
import 'rxjs/Rx';
import 'rxjs/add/operator/catch';  
import 'rxjs/add/observable/throw';
import { Http, Headers, RequestOptions, Response } from '@angular/http';


@Injectable()
export class AgentManagementService {
 
  private baseUrl = environment.apiURL;
  private headers: Headers;  
  private header_token: Headers;  
  private options: RequestOptions;
  private options_token: RequestOptions;
  private user: {};
  constructor(private http:Http) 
    {
            this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }); 
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
    
      addAgent(data):Observable<any> {
          
          return this.http.post(`${this.baseUrl}/agent/register`, data)
          .map((response: Response) => {
              return response.json();
          });
      }
      
      updateAccountClass(accounttype): Observable<any>  {
          let url = `${this.baseUrl}/AccountClass`;
          return  this.http.put(url, accounttype)
                  .map((res: any) =>  res.json());
      }


      post(data): Observable<any>  {
        //console.log('services Url', data.url);
        return  this.http.post(`${this.baseUrl}/${data.url}`, data)
                .map((res: any) =>  res.json());
    }

    put(data): Observable<any>  {
        //console.log('services Url', data.url);
        return  this.http.put(`${this.baseUrl}/${data.url}`, data)
                .map((res: any) =>  res.json());
    }
    delete(data): Observable<any>  {
        //console.log('services Url', data.url);
        return  this.http.delete(`${this.baseUrl}/${data.url}`, data)
                .map((res: any) =>  res.json());
    }
      get(url): Observable<any> {
        return this.http.get(`${this.baseUrl}/${url}`)
            .map((response: Response) => {
                return response.json();
            });
      }

      getById(data): Observable<any> {
          //console.log('getById: ', data);
        return this.http.get(`${this.baseUrl}/${data.url}/${data.id}`)
            .map((response: Response) => {
                return response.json();
            });
    }

    postById(data): Observable<any> {
        //console.log('postById: ', data);
         let hhh =  `${this.baseUrl}/${data.url}${ data.id}`;
         return this.http.post(hhh, `${ data.id}`)
          .map((response: Response) => {
              return response.json();
          });
  }

}