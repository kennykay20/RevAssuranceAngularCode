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
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { Router, ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';
import swal from 'sweetalert2';
import { AllActionUser } from '../model/AllActionUser.model';
import { admAccountTypeModel } from '../model/admAccountTypeDTO.model';
import { List } from 'linqts';



@Injectable()
export class GeneralService {
    period = [] = [ "DAYS", "MONTHS" , "YEARS",]
    TC = [] = [ 101, 150, 152, 500, 550]
    saveData = new EventEmitter();
    data: any;
    dataClient : any;
    private baseUrl = environment.apiURL;
    private autorization: any;
     private headers: Headers;
     allowMultipleCall =  "?" + new Date().toString();
     timeprocess = 3000;

     userName = AuthModel.userName;
     password = AuthModel.password;

     private token = GenModel.tokenName;
     UserId = GenModel.UserId;
     RoleId = GenModel.RoleId;
     userDetails = GenModel.userDetails;
     userMenu = GenModel.userMenu;
     userLoginType = GenModel.userLoginType;
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
        itemPerPage: 800
      },
      {
        itemPerPage: 1000
      },
      {
        itemPerPage: 2000
      },
      {
        itemPerPage: 3000
      },
      {
        itemPerPage: 4000
      },
      {
        itemPerPage: 5000
      }
    ];


    Statuses = [
      {
        status: 'Active'
      },
      {
        status: 'Close'
      },
      {
        status: 'InActive'
      },
      
      
    ];

    statusInDismissed = [
      {
        status: 'Active'
      },
      {
        status: 'Dismissed'
      },
      {
        status: 'Close'
      },
      {
        status: 'InActive'
      },
    ]

    statusAuthorized = [
      {
        status: 'Active'
      },
      {
        status: 'Authorized'
      },
      {
        status: 'Unauthorized'
      },
      {
        status: 'Close'
      },
      {
        status: 'InActive'
      },
    ]
    
    statusPosted = [
      {
        status: 'Active'
      },
      {
        status: 'Posted'
      },
      {
        status: 'UnPosted'
      },
      {
        status: 'Processed'
      },
      {
        status: 'Not Validated'
      },
      {
        status: 'Rejected'
      },
      {
        status: 'Close'
      },
      {
        status: 'InActive'
      },
    ]

   
    encryptKey = GenModel.EncryptKey;

     tokenExpiryTime = GenModel.tokenExpiryTime;
     tokenCheckTimeInterval = GenModel.tokenCheckTimeInterval;



     //change Account Format variables
     accountNumber = GenModel.accountNumberFormat;
     maxLength = GenModel.maxLengthFormat;
     admAccountTypeModel: admAccountTypeModel;

     constructor(private http: HttpClient, 
                 public _apiHeaderService: ApiHeaderService,
                 public _localStorageService: LocalStorageService,
                 public router: Router) {
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
                (error: any) =>{

                } 
            );
      }

    }



    getT(value, geturl): Observable<any> {    

      let url = `${this.baseUrl}/${geturl}${value}`;

      return this.http.get(url, {
                   headers:  this._apiHeaderService.getHeadersNew()
             });
    }

    getTValue(value, geturl): Observable<any> {    

      let url = `${this.baseUrl}/${geturl}/${value}`;

      return this.http.get(url, {
                   headers:  this._apiHeaderService.getHeadersNew()
             });
    }

    get(geturl): Observable<any> {

    //  let token = this._localStorageService.get(this.token);
    
      let url = `${this.baseUrl}/${geturl}`;
        return this.http.get(url, {
                    // headers:  this._apiHeaderService.getHeadersNew()
               }); //.catch(this.handleError);
      }

      get_users():Observable<any> {
        return this.http.get('http://angular5.localhost/wp-admin/admin-ajax.php?action=orderers');
    }

onChangeAcctTypeFormat(acctype: any, message: any): Observable<any> {
       let acctNo = '';
       
        let acct1 = acctype;
        console.log("acctType " + acct1);
     
        let url = `AccountType/GetAccountFormat/${acct1}`;
       
          //console.log("Url " + url);
          let postingurl = `${this.baseUrl}/${url}`;
          //console.log("before return ");
          
        return this.http.get(postingurl);
      
           
}

checkValue = false;
onAccountFormat(value: any, acctType: any): any
{
  let val = value.target.value;
  this.checkValue = false;
  const GLValueLength = 11;
  let sumOfLength = 0;
  
  if(acctType == '' || acctType == undefined)
  {
      
      
      
      if(val.includes('-'))
      {
        const vals = val.split('-');
        console.log('vals - split ', vals);

        let acctFormat = "##-###-#-#####";
        const lengthAcctFormat = acctFormat.split('-');
        console.log('acctFormat ', acctFormat);
        console.log('lengthAcctFormat.length ', lengthAcctFormat.length);

        const fistArraValue0 = vals[0].length;
        console.log('fistArraValue0.length ', fistArraValue0);
        const fistArraValue1 = vals[1].length;
        console.log('fistArraValue1.length ', fistArraValue1);
        const fistArraValue2 = vals[2].length;
        console.log('fistArraValue1.length ', fistArraValue1);
        const fistArraValue3 = vals[3].length;
        console.log('fistArraValue1.length ', fistArraValue1);

        sumOfLength = fistArraValue0 + fistArraValue1 + fistArraValue2 + fistArraValue3;
        
        console.log('sum of ', sumOfLength );

      }

      
      

    }
   else if(acctType !== undefined)
   {

     console.log("account type defined ");

     if(this.admAccountTypeModel.accountFormat.includes('-')){

      const lengt = this.admAccountTypeModel.accountFormat.split('-');
      const maxLength = this.admAccountTypeModel.acctLenght;
      console.log('lengt: ', lengt);

      

      if(lengt.length > 0 && lengt.length == lengt.length) {

        const fistArraValue0 = lengt[0].length;
        const fistArraValue1 = lengt[1].length;
        const fistArraValue2 = lengt[2].length;
        const fistArraValue3 = lengt[3].length;

        console.log('xxSum ', fistArraValue0 + fistArraValue1 + fistArraValue2 + fistArraValue3);
        var v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        
      // ##-###-#-#####
      console.log('fistArraValue0: ', fistArraValue0);
      if (v.length > fistArraValue0) {
        v = [v.slice(0, fistArraValue0), '-', v.slice(fistArraValue0)].join('');
      }

      const next = fistArraValue0 + fistArraValue1 + 1;
      console.log('next: ', next);
       
      if (v.length > next){
        v = [v.slice(0, next), '-', v.slice(next)].join('');
      }

      const next1 = fistArraValue0 + fistArraValue1 + fistArraValue2 + 2;

      console.log('next1: ', next1);
        
      if (v.length > next1){
        v = [v.slice(0, next1), '-', v.slice(next1)].join('');
      }
      const next2 = maxLength;
      console.log('next2: ', next2);
      if (v.length > next2){
        v = v.slice(0, next2);
      }
        
       
      return v;
     
      }

      //return v;

     }
      
   }
   
    if(sumOfLength == GLValueLength)
    {
        console.log('acct Tys should be GL');
        return 'GL';
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


    postTokenExpires(postValue: any, url: any): Observable<any> {

        let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

        let getTimeToken = this._localStorageService.get(this.tokenExpiryTime);
        

        if( date > getTimeToken) {
   
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

     post(postValue: any, url: any): Observable<any> 
     {      

          let postingurl = `${this.baseUrl}/${url}`;
 
          //console.log("postingurl ", postingurl);
          let headerHome = new HttpHeaders({
            'Content-Type':  'application/json',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers':'application/json'
          });

          //console.log("postValue ", postValue);

          return  this.http.post<any>(postingurl, postValue, {
               headers:  this._apiHeaderService.getHeadersNew()
           //  headers:  headerHome
              }).pipe();
        
      }

      postT(url: any): Observable<any> 
     {      

          let postingurl = `${this.baseUrl}/${url}`;
 
          let headerHome = new HttpHeaders({
            'Content-Type':  'application/json',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers':'application/json'
          });

          return  this.http.post<any>(postingurl, {
               headers:  this._apiHeaderService.getHeadersNew()
           //  headers:  headerHome
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

    login(postValue: any, url: any): Observable<any> 
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


    testP(postValue: any, url: any): Observable<any> 
    {      
         //let postingurl = `${this.baseUrl}/${url}`;

         let headerHome = new HttpHeaders({

             'Content-Type':  'application/json',
             'Access-Control-Allow-Origin':'*',
             'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,OPTIONS',
             'Access-Control-Allow-Headers':'application/json'
         });

         return  this.http.post<any>(url, postValue, {
           headers:  headerHome
             }).pipe();  
    }

     SaveTokenResult(data: any): void
    {
           this._localStorageService.set(this.token, data.token);
           this._localStorageService.set(this.tokenExpiryTime, data.expiration);
           this._localStorageService.set(this.tokenCheckTimeInterval, data.expiration);
    }

    saveMenu(data: any): void {

    //  console.log('saveMenu',  data.menu)

      this._localStorageService.set(this.userMenu, data.menu); 
    }

    saveUserDetails(data: any): void {

     this.encryptData(data.userDetails);

    }

    getUserDetails(): any
    {
      let userDetails: any  =  this._localStorageService.get(this.userDetails);
      //console.log('getUserDetails () userDetails', userDetails)
      if (userDetails == null){
        swal('', 'Session time out!', 'error');
        return this.logout();
      }
       
      let dec = this.decryptData(userDetails)
      if(dec != null)
      return dec;

      // 
    }


    setClientProfile()
    {
      let urls = 'ClientProfile/GetProfile';
      this.postT(urls).subscribe(
      (data: any) => {
        //this._localStorageService.set('getClientProfile', data._response);
        let xdata = data._response;
        return xdata;
      });
    }

    // getClientProfile()
    // {
    //   this.dataClient = this.setClientProfile();
    //   console.log('this 2 ', this.dataClient);
    //   let clientProfile = this.dataClient;
    //   console.log('this 3', clientProfile);
    //   if(clientProfile != null)
    //   {
    //     return clientProfile;
    //   }
    // }

    getUserId(): any
    {
      // let userId: any  =  this._localStorageService.get(this.userDetails);

      // if(userId != null)
      // return userId.userId;

      let userDetails: any  =  this._localStorageService.get(this.userDetails);
      let dec = this.decryptData(userDetails)
      if(dec != null)
      return dec.userId;

    }

  

    logout()
    {
      this.router.navigate(['./']);
    }

    holdData(data: any) {

      this.saveData.emit(data);
    }

    dateconvertion(date){
     
      console.log("date -- ", date);
      let today = new Date(date);
      let dd = today.getDate();
      console.log('dd', dd);
      let mm = today.getMonth() + 1; 
      //console.log('mm ', mm);

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
    let chdat = day + '-' + month  + '-' +  yyyy;
    console.log("checkdate ", chdat);
    
      return day + '-' + month  + '-' +  yyyy ;
    }

     
    dateCompare(date){
     
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

      // return yyyy + '-' + month  + '-' + day ;
    
      return today;// day + '-' + month  + '-' +  yyyy ;
     }

     dateCreated(date)
     {
       console.log("Value Date", date);
      let today = new Date(date);
      let dd = today.getDate();
      let mm = today.getMonth() + 1; 

      let hour = today.getHours();
      
      let minute = today.getMinutes();
    
      console.log("Value Date 1 ", date);

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
      let ampm = hour >= 12 ? 'PM' : 'AM';
      let minutes = minute < 10 ? '0'+ minute : minute;
      return day + '-' + month  + '-' +  yyyy + ' '+ hour + ':'+ minutes + ' ' + ampm;
  }

   formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  clearAllLocalStorage(){
    this._localStorageService.clearAll();
  }

  setCpLoginType(value)
  {
    console.log('userDetails.loginType ', value);
    this._localStorageService.set('cpLoginType', value);
  }

  setUserLoginType(value)
  {
    this._localStorageService.set(this.userLoginType, value);
  }
  getCpLoginType(): any
  {
    
    return this._localStorageService.get('cpLoginType');
  }

  getUserLoginType(): any{
    let userLoginType = this._localStorageService.get(this.userLoginType);
    return userLoginType;
  }
  encryptData(data) {

    try 
    {
      let ency =  CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptKey).toString();

      //console.log('ency ', ency);
      this._localStorageService.set(this.userDetails, ency); 
     
   
    } catch (e) {
    
    }
  }

  decryptData(data) {


    try {

      const bytes = CryptoJS.AES.decrypt(data, this.encryptKey);

 
      if (bytes.toString()) 
      {
        let b = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      
        return b;
      }
    
      return data;
    } 
    catch (e) 
    {
   
    }
  }

  convertToMoney(val){

    let hh = val.toLocaleString('en');

    console.log('convertToMoney hh: ', hh);

    return val.toLocaleString('en');
  }
  

  formatMoneyUploadValidator(num): any{

    let fix =  Number(num).toFixed(2);  
    let num1 = fix.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  
    console.log('num1:', num1);
 
    if(num1 === 'NaN')
    {
      console.log('formatMoneyUploadValidator 1')
      return   true;
    }
 
 
    return num1;
   }

  menuId(data: any): any{

    if(data.includes('mid=')) 
    {
      let re = data.replace('mid=', '');
     
      return re;
    }

    return 0;
  }

  public exportAsExcelFile1(json: any[], excelFileName: string): void {
  
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
   
     return `${excelFileName}.xlsx`;
   
   }

   replaceAll(str, find, replace){
    return str.replace(new RegExp(find, 'g'), replace)
  }

getMandate(acctNo, acctType): any
{

  let val = {
    
   acctNo : acctNo,
   AcctType: acctType
  }
  //this.loadPage = true;
  if(acctNo == null && acctType == null){
    Swal('', 'Supply Details', 'error');
    return;
  }

  let url = 'Mandate/GetMandate';

 // let element = <HTMLInputElement> document.getElementById("btnMandate");
 // element.disabled = true;

 // this.actionLoaderUpdate = true;


  this.post(val, url).subscribe(
    (data: any) => 
    {
      console.log('getMandate gen service ', data);
       return data;
      //  element.disabled = false;


      //   this.openMandate(data);

        // this.actionLoaderUpdate = false;
        
       /*
       this.genMandate = data;
        this.mandate = this.genMandate[0];


        this.lstSignaturePhoto =  new List<Mandate>( this.genMandate).Where(c=> c.mandateType == 'SIGNATURE').ToArray();
        console.log('lstSignaturePhoto', this.lstSignaturePhoto);
        this.lstMandate  =new List<Mandate>( this.genMandate).Where(c=> c.mandateType == 'MANDATE').ToArray();

        console.log('lstMandate', this.lstMandate);

       this.firstlstSignaturePhoto = new Mandate();


      if(this.lstSignaturePhoto.length > 0){
       
        this.firstlstSignaturePhoto.photoBase64 = this.lstSignaturePhoto[0].photoBase64;
        this.firstlstSignaturePhoto.signatory = this.lstSignaturePhoto[0].signatory
      }
     
      */
 

   
      



    },
    (error: any) => {
      
     // element.disabled = false;
     // this.actionLoaderUpdate = false;
      Swal('', error.error.responseMessage, 'error');
  });

}

convertToNumber(value){
  return Number(value)
}

saveRejandDismissDetails(record: AllActionUser)
{
  
  record.rejectedDate =  record.rejectedDate != null ? this.dateCreated( record.rejectedDate) :  record.rejectedDate;
  record.dismissedDate =  record.dismissedDate != null ? this.dateCreated( record.dismissedDate) :  record.dismissedDate;

  this._localStorageService.set('rejDismissDetails',record);
}

getSaveRejandDismissDetails(): AllActionUser
{
  return  this._localStorageService.get('rejDismissDetails');
 
}



checkLength(value: any, acctType: any, currencyCode: any): boolean
{
 
  //console.log('curency ' + currencyCode + ', acctNo ' + value +  ' accyType ' + acctType);
  //check if account type is null or undefined
  if (acctType == undefined || acctType === '')
  {
    //console.log('yes its undefined and empty');
    if(value.includes('-'))
    {
      //console.log('yes includes -');
      let valueReplace1 = value.replace(/[0-9]/g, '#');
      //console.log('values yes ', valueReplace1);
      if(value.length <= 13)
      {
        swal('','The Require Number of Digit for this Account Type Is Incomplete!! It Should Be Fourteen(14) Digits','error')
        return false;
      }
      if(currencyCode == undefined || currencyCode === '' && acctType == undefined || acctType === '')
      {
        //console.log('yes currency is empty or undefine ');
         
         swal('','Please Select Account Type And Currency Code', 'error')
         return false;
      }
      else
      {
        return true;
      }
    }
    else{

      let valueReplace2 = value.replace(/[0-9]/g, '#');
      //console.log(valueReplace2);
      if(value.length < 10)
      {
        

        swal('','The Require Number of Digit for this Account Type Is Incomplete!! It Should Be Ten(10) Digits','error')
        return false;
      }
      return true;
    
    }
  }
  else if(acctType.trim() === "CA" || acctType.trim() === "SA")
  {
    var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if(v.length < 10)
    {

      swal('','The Require Number of Digit for this Account Type Is Incomplete!! It Should Be Ten(10) Digits','error')
      
      return false;
    }
    if(v.length >= 10){
      return true;
     
    }
  }
  else if(acctType.trim() === "GL")
  {
    var m = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    //console.log('accountType ' + acctType + ' value ' + m + ' main value ' + value);
    
    if(currencyCode === '' || currencyCode == undefined)
    {
      return false;
    }
    if(value.length <= 13)
    {
      swal('','Account format is incorrect','error')
      return false;
    }
    else if(value.length > 13){
      
      //this.validateAcct(value);
      return true;
    }
  }
  else{
    return false;
  }

}

  formatMoneyWithNoShortCut(num) {

    let fix = Number(num).toFixed(2);
    let num1 = fix.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

    console.log('num1:', num1);

    if (num1 === 'NaN') {
      //swal('','Invalid Characters for Number value','error')
      return num1 = '0'
    }


    return num1;
  }



  formatMoney(InputValue): string
  {

    console.log('formatMoney before: ', InputValue);
    

    let v = InputValue != null ? InputValue.toString().toLowerCase() : '0.00';

    let word = [];
    console.log('formatMoney1 after: ', InputValue);

    let result = '';
    let convertValid = '';
    console.log('formatMoney1 after: v = ', v);

    let includeAlphabet = ['b', 'h', 'k', 'm', 't'];
    const nonAlpha = '';

    let getLast = v.slice(v.length - 1)


    if(includeAlphabet.includes(getLast)){

      if(v.trim().length == 1 ){
        alert('Supply Amount');
        return;
      }
    }
    else if(v == "0.00"){
      return InputValue = "0";
    }
    else{

      console.log('its getLast ', typeof getLast);
      let valIfNumberOrString =  this.getVal(v);
      if(valIfNumberOrString)
      {
        swal('', `${getLast} is not a recognised character for
                                     amount. The allowed characters are: 
                                     b - billion -  1,000,000.00        
                                     h - hundred -  100.00
                                     k - thousand - 1,000.00
                                     m - million - 1,000,000.00
                                     t - trillion - 1,000,000,000.00
                                     `, 'error');
      }

    }



    console.log('includeAlphabet ', includeAlphabet);

    console.log('values ', v);


    if(v.includes('B') || v.includes('b')){

      result = v.replace('b', '000,000,000');
      console.log('results ', result);

      if(result.includes('.'))
      {
        console.log('result1 ', result);
        let numB = (parseFloat(result) * 1000000000);
        console.log('numB ', numB);
        convertValid = this.numberWithCommas(numB);
        console.log('convertValid ', convertValid);
      }
      else{
        convertValid = this.numberWithCommas(result);
      }

      return InputValue = convertValid + ".00";
      //return;
    }
    if(v.includes('H') || v.includes('h')){

      result = v.replace('h', '00');
      console.log('results ', result);

      if(result.includes('.'))
      {
        console.log('result1 ', result);
        let numH = (parseFloat(result) * 100);
        console.log('numH ', numH);
        convertValid = this.numberWithCommas(numH);
        console.log('convertValid ', convertValid);
      }
      else{
        convertValid = this.numberWithCommas(result);
      }

      return InputValue = convertValid + ".00";
      //return;
    }
    if(v.includes('K') || v.includes('k'))
    {

      //let wordk = v.split('k');

      result = v.replace('k', '000');
      console.log('results ', result);

      if(result.includes('.'))
      {
        console.log('result1 ', result);
        let numK = (parseFloat(result) * 1000);
        console.log('numK ', numK);
        convertValid = this.numberWithCommas(numK);
        console.log('convertValid ', convertValid);
      }
      else{
        convertValid = this.numberWithCommas(result);
      }


      return InputValue = convertValid + ".00";

      //return;
    }
    if(v.includes('M') || v.includes('m')){

      result = v.replace('m', '000,000');
      console.log('results ', result);

      if(result.includes('.'))
      {
        console.log('result1 ', result);
        let numM = (parseFloat(result) * 1000000);
        console.log('numM ', numM);
        convertValid = this.numberWithCommas(numM);
        console.log('convertValid ', convertValid);
      }
      else{
        convertValid = this.numberWithCommas(result);
      }
      return InputValue = convertValid + ".00";
      //return;
    }

    if(v.includes('T') || v.includes('t'))
    {
      result = v.replace('t', '000,000,000,000');
      console.log('results ', result);

      if(result.includes('.'))
      {
        console.log('result1 ', result);
        let numT = (parseFloat(result) * 1000000000000);
        console.log('numK ', numT);
        convertValid = this.numberWithCommas(numT);
        console.log('convertValid ', convertValid);
      }
      else{
        convertValid = this.numberWithCommas(result);
      }
      return InputValue = convertValid + ".00";
      //return;
    }
    else
    {
      return InputValue = this.formatMoneyWithNoShortCut(v);
    }
  }

  getVal(val){

    //let pointNum = parseFloat(val);

    let pointNum =  Number(val).toFixed(2);

    console.log('getVal pointNum: ', pointNum);
    if(pointNum === 'NaN') {
      console.log('getVal a: ', pointNum);
      return true
    }
    return false;

  }

  numberWithCommas(x:any) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  Delimeter = '';

acctFormatType(value: any, acctType: any, accountFormat: any, delimeter : any, acctLenght: any) : any {
    let val = value;
    let returnVal = '';
    //this.checkValue = false;
    const GLValueLength = acctLenght;
    let sumOfLength = 0;
    this.Delimeter = delimeter;

  

    console.log('General service values ' + value  + ' ' + acctType + ' ' + accountFormat + ' ' + delimeter + ' ' + acctLenght );
    
  if (acctType == '' || acctType === null || acctType == undefined)
    {
      console.log('includes this.Delimeter ' + delimeter);
      console.log('yes acctype is undefined');
      if(val.includes(delimeter))
      {
        //const vals = val.split(delimeter);
        

       
        let acctFormat = accountFormat;
        const lengthAcctFormat = acctFormat.split(delimeter);
        console.log('acctFormat ', acctFormat);
        console.log('lengthAcctFormat.length ', lengthAcctFormat.length);

        if(val.length > 0 && val.length == val.length){
          // const vals = val.split(delimeter);
          // console.log('vals - split ', vals);
        
          // const fistArraValue0 = vals[0].length;
          // console.log('fistArraValue0.length ', fistArraValue0);
          // const fistArraValue1 = vals[1].length;
          // console.log('fistArraValue1.length ', fistArraValue1);
          // const fistArraValue2 = vals[2].length;
          // console.log('fistArraValue2.length ', fistArraValue1);
          // const fistArraValue3 = vals[3].length;
          // console.log('fistArraValue3.length ', fistArraValue1);
          

          sumOfLength = val.length;
        }
        console.log('sum of ', sumOfLength );
        
        // returnVal = 'GL';
        // return returnVal;
      }

      
      if(sumOfLength == GLValueLength)
      {
        console.log('sum of GlValue', sumOfLength );
        returnVal = 'GL';
        return returnVal;
      }
      else
      {
        returnVal = '';
        return returnVal;
      }
      //return returnVal;
    }
   else if(acctType != '' || acctType != undefined)
   {

     console.log("account type defined ");

     if(accountFormat.includes(this.Delimeter)){

        const lengt = accountFormat.split(this.Delimeter);
        const maxLength = acctLenght;
        console.log('lengt: ', lengt);

      
        if(lengt.length > 0 && lengt.length == lengt.length) {

          const fistArraValue0 = lengt[0].length;
          const fistArraValue1 = lengt[1].length;
          const fistArraValue2 = lengt[2].length;
          const fistArraValue3 = lengt[3].length;

          console.log('xxSum ', fistArraValue0 + fistArraValue1 + fistArraValue2 + fistArraValue3);
          var v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
          
          var splits = this.Delimeter;
          console.log('splits ' +  typeof splits);
          // ##-###-#-#####
          console.log('fistArraValue0: ', fistArraValue0);
          if (v.length > fistArraValue0) {
            v = [v.slice(0, fistArraValue0), `${splits}`, v.slice(fistArraValue0)].join('');
            console.log('first V ', v);
          }

          const next = fistArraValue0 + fistArraValue1 + 1;
          console.log('next: ', next);
          
          if (v.length > next){
            v = [v.slice(0, next), `${splits}`, v.slice(next)].join('');
          }

          const next1 = fistArraValue0 + fistArraValue1 + fistArraValue2 + 2;

          console.log('next1: ', next1);
            
          if (v.length > next1){
            v = [v.slice(0, next1), `${splits}`, v.slice(next1)].join('');
          }
          const next2 = maxLength;
          console.log('next2: ', next2);
          if (v.length > next2){
            v = v.slice(0, next2);
          }
            
          returnVal = v;
          //this.instrumentForm.acctNo = v;
          return returnVal;
      
        }

      //return v;

     }
     
   }


   
  
 }

  appendDelimeter(value: any, acctType: any, accountFormat: any, delimeter: any, acctLenght: any): any {
    let val = value;
    let returnVal = '';
    //this.checkValue = false;
    const GLValueLength = acctLenght;
    let sumOfLength = 0;
    this.Delimeter = delimeter;

    if (acctType != ''|| acctType !== null || acctType != undefined) {

      console.log("account type defined ");

      if (accountFormat.includes(this.Delimeter)) {

        const lengt = accountFormat.split(this.Delimeter);
        const maxLength = acctLenght;
        console.log('lengt: ', lengt);


        if (lengt.length > 0 && lengt.length == lengt.length) {

          const fistArraValue0 = lengt[0].length;
          const fistArraValue1 = lengt[1].length;
          const fistArraValue2 = lengt[2].length;
          const fistArraValue3 = lengt[3].length;

          console.log('xxSum ', fistArraValue0 + fistArraValue1 + fistArraValue2 + fistArraValue3);
          var v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');

          var splits = this.Delimeter;
          console.log('splits ' + typeof splits);
          // ##-###-#-#####
          console.log('fistArraValue0: ', fistArraValue0);
          if (v.length > fistArraValue0) {
            v = [v.slice(0, fistArraValue0), `${splits}`, v.slice(fistArraValue0)].join('');
            console.log('first V ', v);
          }

          const next = fistArraValue0 + fistArraValue1 + 1;
          console.log('next: ', next);

          if (v.length > next) {
            v = [v.slice(0, next), `${splits}`, v.slice(next)].join('');
          }

          const next1 = fistArraValue0 + fistArraValue1 + fistArraValue2 + 2;

          console.log('next1: ', next1);

          if (v.length > next1) {
            v = [v.slice(0, next1), `${splits}`, v.slice(next1)].join('');
          }
          const next2 = maxLength;
          console.log('next2: ', next2);
          if (v.length > next2) {
            v = v.slice(0, next2);
          }

          returnVal = v;
          //this.instrumentForm.acctNo = v;
          return returnVal;

        }

        

      }

    }




  }

}

