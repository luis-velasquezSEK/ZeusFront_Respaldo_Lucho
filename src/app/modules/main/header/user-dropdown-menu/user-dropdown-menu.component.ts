import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  ElementRef,
  Renderer2
} from '@angular/core';
import {AppService} from '@services/app.service';
import {DateTime} from 'luxon';
import {SocialAuthService, SocialUser} from 'angularx-social-login';
import {TokenService} from "@services/token.service";


@Component({
  selector: 'app-user-dropdown-menu',
  templateUrl: './user-dropdown-menu.component.html',
  styleUrls: ['./user-dropdown-menu.component.scss']
})
export class UserDropdownMenuComponent implements OnInit {
  public user;
  userLogged: SocialUser;
  isLogged: boolean;

  @ViewChild('dropdownMenu', {static: false}) dropdownMenu;

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.hideDropdownMenu();
    }
  }

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private appService: AppService,
    private authService: SocialAuthService,
    private tokenService: TokenService
  ) {
  }

  ngOnInit(): void {
    //this.user = this.appService.user;
    this.userLogged = JSON.parse(this.tokenService.getSocialUser());
    this.authService.authState.subscribe(
      data => {
        this.userLogged = data;
        
        this.isLogged = (this.userLogged != null && this.tokenService.getToken() != null);

      },error => {
        console.log('ERROR: '+error);
      }
    );
  }

  toggleDropdownMenu() {
    if (this.dropdownMenu.nativeElement.classList.contains('show')) {
      this.hideDropdownMenu();
    } else {
      this.showDropdownMenu();
    }
  }

  showDropdownMenu() {
    this.renderer.addClass(this.dropdownMenu.nativeElement, 'show');
  }

  hideDropdownMenu() {
    this.renderer.removeClass(this.dropdownMenu.nativeElement, 'show');
  }

  logout() {
    this.appService.logout();
  }

  formatDate(date) {
    return DateTime.fromISO(date).toFormat('dd LLL yyyy');
  }
}
