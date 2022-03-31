import { GeneralService } from './../../../../services/genservice.service';
import { Component, OnInit, Input, ViewEncapsulation, SimpleChanges } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { MenuService } from '../menu.service';
import { SideMenuModel } from '../../../../model/sideMenu.model';
import { List } from 'linqts';
import { Menu } from '../menu.model';
import { LocalStorageService } from 'angular-2-local-storage';
import { GenModel } from '../../../../model/gen.model';


@Component({
  selector: 'app-vertical-menu',
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MenuService]
})
export class VerticalMenuComponent implements OnInit {

  @Input('menuItems') menuItems;
  @Input('menuParentId') menuParentId;

  sideMenuModel: SideMenuModel[];
  tempSideMenuModel: SideMenuModel[];
  verticalMenuDynamic: any[] = [];
  userMenu = GenModel.userMenu;

  @Input() parentData: any;

  parentMenu: Array<any>;
  public settings: Settings;
  constructor(public appSettings: AppSettings,
    public menuService: MenuService,
    public router: Router,
    public _localStorageService: LocalStorageService,
    private _GeneralService: GeneralService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    // console.log('vertical copmnent ngOnInit  menuItems222: ', this.menuItems);



    /*
     if (this.menuItems === undefined || this.menuItems === null)
     {
       this._GeneralService.redirectTOken();
     }
     else
     {
         this.parentMenu = this.menuItems.filter(item => item.parentId === this.menuParentId);  
     } 
     */

    this.sideMenuModel = this._localStorageService.get(this.userMenu);
    this.tempSideMenuModel = this._localStorageService.get(this.userMenu);

    //console.log('vertical-menu Component this.menuParentId ', this.menuParentId)

     //console.log('this.menuItems ', this.menuItems);
    //the below to be remove once connected to API and Uncomment or delete the below
    this.parentMenu = this.menuItems.filter(item => item.parentId === this.menuParentId);
    //console.log('vertical-menu Component this.parentMenu', this.parentMenu)




  }

  keypress(event) {

    const val = event.target.value.toLowerCase();
    //console.log('serach value VVV', val)



    const temp = this.tempSideMenuModel.filter(function (d) {
      return d.menuName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    //console.log('search Menu criteria temp', temp);

    let getParent = new List<SideMenuModel>(this.tempSideMenuModel).Where(c => c.isParent === true).ToArray();

    // let hhh = temp.to
    //console.log('search getParent**', getParent);

    let app = [getParent, ...temp];

    //console.log('search append**', app);


    for (let i = 0; i <= getParent.length; i++) {


      if (app[i] != undefined) {
        let isParent = false;// getParent[i].;  // == null ? false : true;

        this.verticalMenuDynamic.push(

          new Menu(this.tempSideMenuModel[i].menuId,
            this.tempSideMenuModel[i].menuName,
            this.tempSideMenuModel[i].routerLink,
            null,
            this.tempSideMenuModel[i].icon,
            null,
            isParent,
            this.tempSideMenuModel[i].parentId)
        );
      }
    }


    this.menuItems = null;// this.verticalMenuDynamic;

    //console.log('search Menu after Sort', this.menuItems);

  }

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.settings.fixedHeader) {
          let mainContent = document.getElementById('main-content');
          if (mainContent) {
            mainContent.scrollTop = 0;
          }
        }
        else {
          document.getElementsByClassName('mat-drawer-content')[0].scrollTop = 0;
        }
      }
    });
  }

  onClick(menuId) {
    //console.log('ngOnChanges onClick==> ', menuId);
    this.menuService.toggleMenuItem(menuId);
    this.menuService.closeOtherSubMenus(this.menuItems, menuId);
  }

  changeFromChild() {
    this.parentData -= 1;
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('ngOnChanges::==> ', changes)

    // console.log('ngOnChanges this.menuParentId::==> ', this.menuParentId);

    // console.log('ngOnChanges this.menuItems::==> ', this.menuItems)

    this.parentMenu = this.menuItems.filter(item => item.parentId === this.menuParentId);
    // console.log('ngOnChanges parentMenu', this.parentMenu)

    this.onClick(this.menuParentId);


  }

}
