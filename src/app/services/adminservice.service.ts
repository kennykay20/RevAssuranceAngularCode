import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import { ApiHeaderService } from './service-header-service/api-header.service';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { GenModel } from '../model/gen.model';
import { AuthModel } from '../model/auth.model';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


@Injectable()
export class AdminService {

 EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
 EXCEL_EXTENSION = '.xlsx';
    saveData = new EventEmitter();
    data: any;
    private baseUrl = environment.apiURL;
    private autorization: any;
     private headers: Headers;
     allowMultipleCall =  "?" + new Date().toString();
     timeprocess = 3000;
     private options: RequestOptions;
     userName = AuthModel.userName;  
     password = AuthModel.password;

  searchUserColumns = [
    {
      id: 1,
      columnName: 'Full Name'

    },
    {
      id: 2,
      columnName: 'Phone Number'

    },
    {
      id: 3,
      columnName: 'Email Address'

    },
    {
      id: 4,
      columnName: 'Meter Number'

    },
    {
      id: 5,
      columnName: 'Status'

    }

];

ItemsPerPage = [
  {
    itemPerPage: 5
  },
  {
    itemPerPage: 10
  },
  {
    itemPerPage: 20
  },
  {
    itemPerPage: 50
  },
  {
    itemPerPage: 100
  },
  {
    itemPerPage: 200
  },
  {
    itemPerPage: 500
  },
  {
    itemPerPage: 600
  },
  {
    itemPerPage: 700
  },
  {
    itemPerPage: 800
  },
  {
    itemPerPage: 900
  },
  {
    itemPerPage: 1000
  },
];
     private token = GenModel.tokenName;
     tokenMenus = GenModel.tokenMenus; 
     fineAddedd = GenModel.fineAddedd;
   


     tokenExpiryTime = GenModel.tokenExpiryTime;
     tokenCheckTimeInterval = GenModel.tokenCheckTimeInterval;
     retryService: number =  GenModel.retryService;
     retryMessage: any;
     retryDelayServiceInterval : number =  GenModel.retryDelayServiceInterval;
     internetConMsg = GenModel.internetConMsg;
     userLoginInfo = GenModel.userLoginInfo;
     loginRoleId = GenModel.loginRoleId;
     role = GenModel.role;

     constructor(private http: HttpClient, 
                 public _apiHeaderService: ApiHeaderService,
                 public _localStorageService: LocalStorageService,
                 private http1: Http,
                 public router: Router) 
                 {
                    this.options = this.getHeadersNeww();
                 }




redirectTOken(){
 // this.router.navigate(['./login']);
}


    getToken(): void {
    
      let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      let getTimeToken = this._localStorageService.get(this.tokenExpiryTime);
      
      if( date > getTimeToken  || getTimeToken == null) {

              let  postingValues = {
                "userName": this.userName,
                "password": this.password
              };
              this.post(postingValues, 'Authentication/AAuth').subscribe(
                (data: any) => {
                  
                    this._localStorageService.set(this.token, data.token);
                    this._localStorageService.set(this.tokenExpiryTime, data.expiration);
                    this._localStorageService.set(this.tokenCheckTimeInterval, data.expiration);
        
                },
                (error: any) => {

                } 
            );
      }
    
    
    }

    submitUpload(files) {

     
      if (files.length === 0)
        return;
  
      const formData = new FormData();
  
      for (let file of files)
        formData.append(file.name, file);
  
       // formData.append('UserName:' + this.loginId, '');
  
      let urlPost = 'Upload';
      let url =  `${this.baseUrl}/${urlPost}`;
  
    
  
      const uploadReq = new HttpRequest('POST', url, formData, {
        reportProgress: true,
      });
  
      this.http.request(uploadReq).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress){
         //this.progress = Math.round(100 * event.loaded / event.total);
        }
         
        else if (event.type === HttpEventType.Response){
          // this.message = event.body.toString();
        }
        
      });
    }

    dateconvertion(date){
     
   let today = new Date(date);
   let dd = today.getDate();
   let mm = today.getMonth() + 1; 

   let yyyy = today.getFullYear();
   let day;
   let month;
 
   if(dd < 10) 
   {
       dd = dd
       day = '0' + dd ;
   } 
   else
   {
      day =  dd ;
   }
   if( mm < 10) 
   {
       mm = mm
       month = '0' + mm;
   }else {
     month =  mm;
   }
 
 if(mm === 1) {
     month = 'Jan';
 }
 if(mm === 2) {
     month = 'Feb';
 }
 if(mm === 3) {
     month = 'Mar';
 }
 if(mm === 4) {
     month = 'Apr';
 }
 if(mm === 5) {
     month = 'May';
 }
 if(mm === 6) {
     month = 'Jun';
 }
 if(mm === 7) {
     month = 'Jul';
 }
 if(mm === 8) {
     month = 'Aug';
 }
 if(mm === 9) {
     month = 'Sep';
 }
 if(mm === 10) {
     month = 'Oct';
 }
 if(mm === 11) {
     month = 'Nov';
 }
 if(mm === 12) {
     month = 'Dec';
 }
   // return yyyy + '-' + month  + '-' + day ;
 
   return day + '-' + month  + '-' +  yyyy ;
  }


    postTokenExpires(postValue: any, url: any): Observable<any> {

      if (this.isOnline() === false)
      {
        Swal('', this.internetConMsg, 'error');
        return null;
     }


   
          let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

          let getTimeToken = this._localStorageService.get(this.tokenExpiryTime);
         
         
          if ( date > getTimeToken) {
           
              this.getToken();
          }
          else
          {
          
            let postingurl = `${this.baseUrl}/${url}`;
            

            return  this.http.post<any>(postingurl, postValue, {
                  headers:  this._apiHeaderService.getHeadersNew()
                }).pipe();
          }   
      }

     post(postValue: any, url: any): Observable<any> {      
        
         if (this.isOnline() === false)
         {
           Swal('', this.internetConMsg, 'error');
           return null;
        }
   

          let postingurl = `${this.baseUrl}/${url}`;
         

          return  this.http.post<any>(postingurl, postValue, {
                headers:  this._apiHeaderService.getHeadersNew()
              }).pipe();
        
    }

    postLogin(postValue: any, url: any): Observable<any> 
    {      
     
         let postingurl = `${this.baseUrl}/${url}`;

         return  this.http.post<any>(postingurl, postValue, {
              // headers:  this._apiHeaderService.getHeadersNew()
             }).pipe();
       
   }

   postVerifyEmail(postValue: any, url: any, hearderToken: any): Observable<any> 
   {      
       

        let postingurl = `${this.baseUrl}/${url}`;
      

        return  this.http.post<any>(postingurl, postValue, {
             // headers: hearderToken
            }).pipe();
      
  }

    homePage(postValue: any, url: any): Observable<any> 
     {      
          let postingurl = `${this.baseUrl}/${url}`;

          let headerHome = new HttpHeaders({
              'Content-Type':  'application/json',
              'Access-Control-Allow-Origin':'*',
              'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,OPTIONS',
              'Access-Control-Allow-Headers':'application/json'
          });

          return  this.http.post<any>(postingurl, postValue, {
            headers:  headerHome
              }).pipe();
        
    }

     SaveTokenResult(data: any): void
    {
      
        
           this._localStorageService.set(this.token, data.token);
           this._localStorageService.set(this.userLoginInfo, data.data.name);
           
           
        
    }

    SaveMenu(data: any): void
    {
   
      this._localStorageService.set(this.tokenMenus,  data.data);
    }

    SaveRoleId(data: any): void
    {
   
      this._localStorageService.set(this.loginRoleId,  data);
    }

    clearStorageToken(): void
    {
        
          this._localStorageService.set(this.token, null);
         
    }

    clearfineAddedd(): void {
        
          this._localStorageService.set(this.fineAddedd, null);
         
    }


    
    clearAllLocalStorage(): void
    {
         
           this._localStorageService.clearAll();
         
    }


    holdData(data: any) {
   
      this.saveData.emit(data);
    }


    getT(value, geturl): Observable<any> {

      if (this.isOnline() === false)
      {
        Swal('', this.internetConMsg, 'error');
        return null;
     }

      let url = `${this.baseUrl}/${geturl}${value}`;
  
      // if(url.indexOf('?') > -1){
      //     url = url + "&qeroinfeirfnreiufheriuhef=" + new Date().toString();
      // }
      // else{
      //     url = url + "?"+new Date().toString();
      // }
  
    
  
      return this.http.get(url, {
                   headers:  this._apiHeaderService.getHeadersNew()
             }); //.catch(this.handleError);
    }

    get(value, geturl): Observable<any> {

      if (this.isOnline() === false)
      {
        Swal('', this.internetConMsg, 'error');
        return null;
     }

      let url = `${this.baseUrl}/${geturl}${value}`;

     

      return this.http.get(url); 
    }

    getTReturn(value, geturl): any {

      this.getT(value, geturl)

      .retryWhen((err) => {
      
              return err.scan((retryCount) =>  {
  
                retryCount  += 1;
                if (retryCount < this.retryService) {
  
                    this.retryMessage = 'Retrying...Attempt'; // #'  + retryCount;
  
                    return retryCount;
                }
                else 
                {
                  this.retryMessage = 'Problem Loading Page. Kindly contact System Administrator';
                   throw(err);
                }
              }, 0).delay(this.retryDelayServiceInterval); 
            }).subscribe(
        (data: any) => 
        {
          return data.data;
        },
        (error: any) => {
        
      
  
        });
    }

    handleError(error: Response) {
  
        throw error;
      }

    getHeadersNeww() : RequestOptions {
      let val: any =  this._localStorageService.get(this.token);
    
      if(!val){
          return null;
      } else {
          let headers = new Headers({ "content-type": "application/json", });
          headers.append('Authorization', 'Bearer ' + val.token);
         
        
         
         
          let options = new RequestOptions({ headers: headers });
          return options;
      }
  } 

    getNew(value, geturl) : Observable<any> {  
      
      let url = `${this.baseUrl}/${geturl}${value}`;

   


      return this.http1.get(url, this.options)
          .map((response: Response) => {
              return response.json();
          });
      
  }

  isOnline() {
    return navigator.onLine;
}

getTokenStatus(): any
{
  let token = this._localStorageService.get(this.token);
  if (token === null || token === undefined)
  {
    return this.router.navigate(['./dashboard']);
  }
  else
  {
    return token;
  }
}


 exportAsExcelFile1(json: any[], excelFileName: string): void {
  
 // console.log('json: ', json);
  if (json.length  === 0) {
    Swal('', 'No Record found', 'error');
    return;
  }
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
  const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
  XLSX.writeFile(workbook, this.toExportFileName(excelFileName));
}

 toExportFileName(excelFileName: string): string {

  return `${excelFileName}_${new Date().toLocaleString()}.xlsx`;

}

}
