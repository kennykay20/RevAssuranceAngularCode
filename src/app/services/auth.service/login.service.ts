//import { AsyncLocalStorage } from 'angular-async-local-storage';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'; 
import 'rxjs/Rx';
import 'rxjs/add/operator/catch';  
import 'rxjs/add/observable/throw';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
//import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class LoginService {
 
  private baseUrl = environment.apiURL;
  private headers: Headers;  
  private header_token: Headers;  
  private options: RequestOptions;
  private options_token: RequestOptions;
  private user: {};
  constructor(private http:Http)
            //  private localStorageService : LocalStorageService) 
    {
            this.headers = new Headers({ 'Content-Type': 'application/json' }); 
            //this.headers.append('Content-Type', 'application/json');
            this.headers.append('Authorization', 'Basic '+ 'SzBsb25AMXI0OktuQGRtMW5QQDMzdzByZDU=');
           // this.headers.append('Authorization', 'Kn@dm1nP@33w0rd5');
            
            
            this.options = new RequestOptions({ headers: this.headers });        
    }
   
    /**
     * Used to sign in users
     */
  public signin(Login): Observable<any> { 
    //Set parameters.
    let params: any = {  
        //client_id: ClientEnum.CLIENT_ID,  
        grant_type: 'password',//ClientEnum.GRANT_TYPE,  
        username: Login.UserName,  
        password: Login.password
    };  

    // Encodes the parameters.  
    let body: string = this.encodeParams(params); 

    console.log('**this.options: ', this.options);
    return this.http.post(`${this.baseUrl}/agent/login`, body, this.options)  
            .map((res: any) => res.json())
            .flatMap((user: any) => {
               // console.log('**',user.access_token)
              
                let headers = new Headers();
               // headers.append('Authorization', 'Bearer ' + user.access_token);
            //    headers.append('Content-Type', 'application/json');
            //    headers.append('Authorization', 'K0lon@1r4');
            //    headers.append('Authorization', 'Kn@dm1nP@33w0rd5');
            // headers.append('Authorization', 'Password ' +' Kn@dm1nP@33w0rd5');
               
                this.options_token = new RequestOptions({ headers:headers }); 
                console.log('Headers',this.options_token )
                return this.http.get(`${this.baseUrl}/MenuControl`)
                  .map((res: any) => {
                    let menubody: any = res.json();
                    console.log('About to log in local storage', menubody )
                    this.storeUser(user); 
                  //  this.storeMenuControl(menubody);
                    
                    return user;
                  });
              })
              .catch((error: any) => {
                return Observable.throw(error.json());
            });
 }
//   //0012540098
/** 
 * // Encodes the parameters. 
 * 
 * @param params The parameters to be encoded 
 * @return The encoded parameters 
 */  
private encodeParams(params: any): string {  

    let body: string = "";  
    for (let key in params) {  
        if (body.length) 
        {  
            body += "&";  
        }  
        body += key + "=";  
        body += encodeURIComponent(params[key]);  
    }  

    return body;  
}  
/** 
 * Stores access token & refresh token. 
 * 
 * @param body The response of the request to the token endpoint 
 */  
  private storeUser(body: any): void {  
    console.log('**store in local storage ', body);
     // Stores access token in local storage to keep user signed in.  
    //this.localStorage.setItem('id_token', body).subscribe(() => {});  

  }

  login(data): Observable<any> {

  
    return this.http.post(`${this.baseUrl}/Admin/Login`, data)
    .map((response: Response) => {
        return response.json();
    });
}

// getHeaders() : RequestOptions {
//     let val:any =this.localStorageService.get('admin_id_token');
//     console.log('headers___',val);
//     if(!val){
//         return null;
//     }
//     else{
//         let headers = new Headers({ "content-type": "application/json", });
//         headers.append('Authorization', 'Username ' + 'K0lon@1r4');
//         headers.append('Authorization', 'Password ' +' Kn@dm1nP@33w0rd5');
//         console.log('header',headers);
//         let options = new RequestOptions({ headers: headers });
//         return options;
//     }
//     }

}