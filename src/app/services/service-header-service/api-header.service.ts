import { Injectable } from '@angular/core';
import { RequestOptions, Headers } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { GenModel } from '../../model/gen.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class ApiHeaderService {

     
    private token = GenModel.tokenName;
    constructor(private localStorageService : LocalStorageService, private router: Router){}

    getHeaders() {


        let val: any = this.localStorageService.get('zibSLIndividual_token');
        
       // console.log('getHeaders val: ', val);
        
        if (val === null || val === undefined){
            // Would later uncomment the below
           // this.router.navigate(['/']);
          // alert(2);


          let headers = new Headers({ 'Cache-Control':  
                    'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
                    'Pragma': 'no-cache',
                    'Expires': '0', 
                    'foobar' : new Date().getTime(),     
                    'content-type': 'application/json', 
                    'responseType': 'text',
                    'Access-Control-Allow-Credentials' : true,
                    'Access-Control-Allow-Origin':'*',
                    'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,OPTIONS',
                    'Access-Control-Allow-Headers':'application/json',
                  });

 
                //headers.append('Authorization', 'Bearer ' + val.token);
                //headers.append('Authorization', 'Bearer ' + val.token);
                let options = new RequestOptions({ headers: headers });
                return options;
        

                    //return null;
        }
        else {

            alert(1);
            let headers = new 
                    Headers({ 'Cache-Control':  
                              'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
                              'Pragma': 'no-cache',
                              'Expires': '0', 
                              'foobar' : new Date().getTime(),     
                              'content-type': 'application/json', 
                              'responseType': 'text',
                              'Access-Control-Allow-Credentials' : true,
                               'Access-Control-Allow-Origin':'*',
                              'Access-Control-Allow-Methods':'GET',
                              'Access-Control-Allow-Headers':'application/json',
                            });
          
           
            //headers.append('Authorization', 'Bearer ' + val.token);
            headers.append('Authorization', 'Bearer ' + val.token);
            let options = new RequestOptions({ headers: headers });
            return options;
        }
    }

    getHeadersNew() {

      //  console.log('getHeadersNew');
        
       let header = new HttpHeaders({
            'Content-Type':  'application/json',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers':'application/json'
          });

          return header;
      
    }

    getHeadersNew1() {

        console.log('getHeadersNew start');
        let token: any = this.localStorageService.get(this.token);
        
        console.log('getHeaders token: ', token);
        
        let header: any;
        if (token !== null || token !== undefined) {
            console.log('getHeaders token is not null: ', token);
            // header = new HttpHeaders({
            //     'Content-Type':  'application/json',
            //     'Access-Control-Allow-Origin':'*',
            //     'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,OPTIONS',
            //     'Access-Control-Allow-Headers':'application/json',
            //     'Authorization': 'Bearer ' + token
            //     // 'Bearer token':  token
            //   });

            let headers_object = new HttpHeaders().set("Authorization", "Bearer " + token);
            return headers_object;
            //   return header;
        }
        else
        {
            console.log('no token found: ');
            header = new HttpHeaders({
                'Content-Type':  'application/json',
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,OPTIONS',
                'Access-Control-Allow-Headers':'application/json'
              });

              return header;
        }
    }
}   