import {Component, OnInit} from '@angular/core';
import {AppService} from '@services/app.service';
import {SocialAuthService, SocialUser} from "angularx-social-login";
import {TokenService} from "@services/token.service";
import {MenuItem} from "primeng/api";
import {MenuService} from "@services/menu.service";
import {forEach} from "@angular-devkit/schematics";
import {EventBusService} from "@services/bus/event-bus.service";
import {EventData} from "@services/bus/event.class";

@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {
  userLogged: SocialUser;
  isLogged: boolean;

  items: MenuItem[];
  menus: any;
  public menu = MENU;

  content?: string;

  constructor(public appService: AppService,
              public menuService: MenuService,
              private authService: SocialAuthService,
              private eventBusService: EventBusService,
              private tokenService: TokenService) {
  }

  ngOnInit() {
    this.verificarUsuario();
    this.llenarMenus();
  }


  //TODO: traer los menus por aplicacicion y perfil + permiso

  verificarUsuario() {

    this.userLogged = JSON.parse(this.tokenService.getSocialUser());

  }

  llenarMenus() {
    //this.menus = this.appService.getMenuByUsername();
    this.menuService.findByUsername(this.userLogged.email).subscribe(
      data => {
        this.menus = data;

        this.items = new Array();
        for (let objMenu of this.menus) {
          let item: MenuItem;
          item = {
            label: objMenu.itemDTO.label,
            icon: objMenu.itemDTO.icon,
            url: objMenu.itemDTO.url,
            routerLink: objMenu.itemDTO.routerLink,
            items: objMenu.itemsDTO,
            badge:'1',
          }
          this.items.push(item);
        }
        
      },
      err => {
        this.content = err.error.message || err.error || err.message;

        console.log('status ' + err.status);
        console.log('error message ' + err.error.message);
        console.log('error ' + err.error);
        console.log('message ' + err.message);

        if (err.status === 403)
          this.eventBusService.emit(new EventData('logout', null));
      }
    );


  }
}

export const MENU = [
  {
    name: 'Dashboard',
    path: ['/']
  },
  {
    name: 'Blank',
    path: ['/blank']
  },
  {
    name: 'Blank',
    path: ['/blank']
  },
  {
    name: 'Blank',
    path: ['/blank']
  },
  {
    name: 'Blank',
    path: ['/blank']
  },
  {
    name: 'Blank',
    path: ['/blank']
  },
  {
    name: 'Blank',
    path: ['/blank']
  },
  {
    name: 'Blank',
    path: ['/blank']
  },
  {
    name: 'Blank',
    path: ['/blank']
  },
  {
    name: 'Blank',
    path: ['/blank']
  },
  {
    name: 'Blank',
    path: ['/blank']
  },
  {
    name: 'Blank',
    path: ['/blank']
  },
  {
    name: 'Blank',
    path: ['/blank']
  },
  {
    name: 'Blank',
    path: ['/blank']
  },
  {
    name: 'Blank',
    path: ['/blank']
  },
  {
    name: 'Blank',
    path: ['/blank']
  },
  {
    name: 'Blank',
    path: ['/blank']
  },{
    name: 'Blank',
    path: ['/blank']
  },{
    name: 'Blank',
    path: ['/blank']
  },
  {
    name: 'Blank',
    path: ['/blank']
  },{
    name: 'Blank',
    path: ['/blank']
  },{
    name: 'Blank',
    path: ['/blank']
  },{
    name: 'Blank',
    path: ['/blank']
  },{
    name: 'Blank',
    path: ['/blank']
  },
  {
    name: 'Blank',
    path: ['/blank']
  },
  {
    name: 'Blank',
    path: ['/blank']
  },{
    name: 'Blank',
    path: ['/blank']
  },{
    name: 'Blank',
    path: ['/blank']
  },{
    name: 'Blank',
    path: ['/blank']
  },
  {
    name: 'Blank',
    path: ['/blank']
  },{
    name: 'Blank',
    path: ['/blank']
  },











  {
    name: 'Main Menu',
    children: [
      {
        name: 'Sub Menu',
        path: ['/sub-menu-1']
      },

      {
        name: 'Blank',
        path: ['/sub-menu-2']
      }
    ]
  }
];
