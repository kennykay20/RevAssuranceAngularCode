import { GenModel } from './../../../model/gen.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


import { Menu } from './menu.model';
import { verticalMenuItems, horizontalMenuItems } from './menu';

@Injectable()
export class MenuService {

  constructor(private location: Location,
    private router: Router
  ) { }

  public getVerticalMenuItems(): Array<Menu> {


    /* will later uncomment below when api for role is ready */
    //let menyArr: any[] = [];
    //let menures: any;

    //  menures = this.storage.get('menu');
    // console.log('menures: ', menures.Result);

    // for (let menu in menures.FunctionItems) {  
    //    menyArr.push( new Menu (2, 'Dashboard', '/Home', null, 'dashboard', null, false, 0));
    //   // new Menu (2, 'Dashboard', '/Home', null, 'dashboard', null, false, 0)
    // } 

    // console.log('menyArr:  ',menyArr);




    return verticalMenuItems; // menyArr;//



  }

  public getHorizontalMenuItems(): Array<Menu> {
    return horizontalMenuItems;
  }

  public expandActiveSubMenu(menu: Array<Menu>) {
    let url = this.location.path();
    let routerLink = url; // url.substring(1, url.length);
    let activeMenuItem = menu.filter(item => item.routerLink === routerLink);
    if (activeMenuItem[0]) {
      let menuItem = activeMenuItem[0];
      while (menuItem.parentId != 0) {
        let parentMenuItem = menu.filter(item => item.id == menuItem.parentId)[0];
        menuItem = parentMenuItem;
        this.toggleMenuItem(menuItem.id);
      }
    }
  }

  public toggleMenuItem(menuId) {
    //console.log('toggleMenuItem menuId', menuId);
    let menuItem = document.getElementById('menu-item-' + menuId);
    let subMenu = document.getElementById('sub-menu-' + menuId);
    if (subMenu) {
      if (subMenu.classList.contains('show')) {
        subMenu.classList.remove('show');
        menuItem.classList.remove('expanded');
      }
      else {
        subMenu.classList.add('show');
        menuItem.classList.add('expanded');
      }
    }
  }

  public closeOtherSubMenus(menu: Array<Menu>, menuId) {
    let currentMenuItem = menu.filter(item => item.id == menuId)[0];
    if (currentMenuItem.parentId == 0 && !currentMenuItem.target) {
      menu.forEach(item => {
        if (item.id != menuId) {
          let subMenu = document.getElementById('sub-menu-' + item.id);
          let menuItem = document.getElementById('menu-item-' + item.id);
          if (subMenu) {
            if (subMenu.classList.contains('show')) {
              subMenu.classList.remove('show');
              menuItem.classList.remove('expanded');
            }
          }
        }
      });
    }
  }


}
