import Swal from 'sweetalert2';
import { GeneralService } from './../../../services/genservice.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { GenModel } from './../../../model/gen.model';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MenuService } from '../menu/menu.service';
import { Menu } from '../menu/menu.model';
import { Router } from '@angular/router';
//import { RoleAssignDTO } from '../../../model/roleAssignDTO.model';
import { List } from 'linqts';
import { RoleAssignDTO } from '../../../model/RoleAssignDTO';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MenuService]
})
export class SidenavComponent implements OnInit {
  public userImage = '../assets/img/users/KoloNairalogo.png';
  public menuItems: Array<any>;
  public settings: Settings;
  tokenMenus = GenModel.tokenMenus;
  verticalMenuDynamic: any[] = [];
  btnConfirm = GenModel.btnConfirm;
  userMenu = GenModel.userMenu;
  isLoading = false;
  menuName = '';

  subMenu: RoleAssignDTO[] = [];
  coSub: RoleAssignDTO[] = [];
  searchMenu: RoleAssignDTO[] = [];

  constructor(public appSettings: AppSettings,
    public menuService: MenuService,
    public _localStorageService: LocalStorageService,
    public router: Router,
    public _GeneralService: GeneralService) {
    this.settings = this.appSettings.settings;
  }

  search() {
    this.isLoading = true;
    setTimeout(() => {
      if (this.menuName != "") {
        this.isLoading = false;

        let co = this.subMenu.filter(p => p.parentId !== 0);
        if (co.length > 0) {

          this.coSub = co;

          this.searchMenu = this.coSub.filter(res => {
            return res.menuName.toLocaleLowerCase().match(this.menuName.toLocaleLowerCase())

          })
        }

        if (this.searchMenu.length == 0) {
          let x2 = [{ Id: -1, Name: "No recent menu match your search." }];
          let x = [{
            menuId: -1,
            menuName: "No recent menu match your search.",
            canAdd: false,
            canAuth: false,
            canDelete: false,
            canEdit: false,
            canView: false,
            isGlobalSupervisor: false,
            canAuthorise: false,
            roleId: '',
            userId: '',
            parentId: 0,
            childParentId: 0,
            routerLink: '',
            icon: '',
            grandParentMenuName: ''
          }];
          this.searchMenu = x;
          return this.searchMenu;
        }
        else {
        }

      }
      else {
        this.isLoading = false;
        this.searchMenu = null;
        this.ngOnInit();
      }
    }, 2000)
  }

  ngOnInit() {


    let getMenuAssign: any[] = this._localStorageService.get(this.userMenu);// this._localStorageService.get(this.tokenMenus); 
    this.subMenu = new List<RoleAssignDTO>(getMenuAssign).Where(c => c.parentId != 0).ToArray();
    //console.log('this.subMenu', this.subMenu);
    //console.log('this.sidenavcopo getMenuAssign ', getMenuAssign);

    //console.log('this sidenavcopo:', this._localStorageService.get(this.userMenu));

    if (getMenuAssign === undefined || getMenuAssign === null) {
      // this.router.navigate(['./login']);
      // this._GeneralService.redirectTOken()
      this.menuItems = this.menuService.getVerticalMenuItems()
    }
    else {
      // icon: "drag_indicator"
      // iconAddress: null
      // isParent: false
      // menuId: 31
      // menuName: "Add Fines"
      // parentId: 18
      // priority: 0
      // routeAddress: null
      // routerLink: "/adm/CreateSecurity/mid=31"
      // status: null
      for (let i = 0; i <= getMenuAssign.length; i++) {

        if (getMenuAssign[i] != undefined) {
          let isParent = getMenuAssign[i].isParent == 0 ? false : true;

         //console.log('isParent', isParent);

          this.verticalMenuDynamic.push(

            new Menu(getMenuAssign[i].menuId, getMenuAssign[i].menuName,
              getMenuAssign[i].routerLink, null, getMenuAssign[i].icon,
              null, isParent, getMenuAssign[i].parentId)
          );
        }
      }

     // console.log('this.verticalMenuDynamic', this.verticalMenuDynamic);

      this.menuItems = this.verticalMenuDynamic;// this.menuService.getVerticalMenuItems()//  //this.menuService.getVerticalMenuItems(); 

      //console.log('this.menuItems', this.menuItems);

    }

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
    }).then((result) => {
      if (result.value) {
        this._localStorageService.clearAll();
        this._GeneralService.clearAllLocalStorage();
        this.router.navigate(['./login']);
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });


    // Swal('','messa', 'error');

    // this.router.navigate(['./login']);
  }

  myProfile() {

    this.router.navigate(['./prf/my-profile']);
  }

  dashboard() {

    this.router.navigate(['./dashboard']);
  }


  public closeSubMenus() {
    let menu = document.querySelector(".sidenav-menu-outer");

    if (menu) {
      for (let i = 0; i < menu.children[0].children.length; i++) {
        let child = menu.children[0].children[i];
        if (child) {
          if (child.children[0].classList.contains('expanded')) {
            child.children[0].classList.remove('expanded');
            child.children[1].classList.remove('show');
          }
        }
      }
    }
  }

}
