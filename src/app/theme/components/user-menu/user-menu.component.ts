import { GeneralService } from './../../../services/genservice.service';
import { GenModel } from './../../../model/gen.model';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// import swal from 'sweetalert';


@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserMenuComponent implements OnInit {
  public userImage = 'assets/img/users/user.jpg';
  public loginFullName = 'Lawal Institution'
  btnConfirm = GenModel.btnConfirm;
  userLoginInfo = GenModel.userLoginInfo;
  role = GenModel.role;
  userInfo: any;
  roleName: any;
  constructor(private _localStorageService: LocalStorageService,
              public router: Router,
              public _GeneralService: GeneralService) { }

  ngOnInit() {
   this.userInfo =  this._localStorageService.get(this.userLoginInfo);
   // console.log('userInfo  this.userInfo',  this.userInfo);


   if (this.userInfo === undefined || this.userInfo === null)
     {
       //  this.router.navigate(['./login']);
     }
     else
     {
        let rol: any[] =  this._localStorageService.get(this.role);

        let name = '';

        if (rol.length > -1) {

        for (let i = 0; i < rol.length; i++) {
           name +=  rol[i] + ', ';
        }
      //  console.log('userInfo  name',  name);

        //let str = "Hello TecAdmin!";
        // let newStr = name.substring(0, name.length - 1);
        // console.log('userInfo  newStr',  newStr);

        this.roleName =  this._localStorageService.get(this.role); //name.substring(0, name.length - 1);
   }
    
  }
    
  }

  profile() {
  
    this.router.navigate(['./prf/my-profile']);

 // this.router.navigate(['./ano/all']);
  
  }

  logOut() {

    Swal({
      title: '',
      text: 'You are about to Log Out?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: this.btnConfirm, 
      cancelButtonText: 'Cancel'
    }).then((result) => 
    {
      if (result.value) 
      {
        this._localStorageService.clearAll();
       // this._GeneralService.clearAllLocalStorage();
        this.router.navigate(['./']);
      } else if (result.dismiss === Swal.DismissReason.cancel)
       {
        
      }
    });


   
  
   // Swal('','messa', 'error');

   // this.router.navigate(['./login']);
  }

  clearLocalStorage(){
    
      this._localStorageService.clearAll();
      this.router.navigate(['./']);
  }
}
