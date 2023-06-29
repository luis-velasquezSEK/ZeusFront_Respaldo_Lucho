import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {TokenService} from "@services/token.service";
import {EventBusService} from "@services/bus/event-bus.service";
import {Subscription} from "rxjs";
import {SocialAuthService} from "angularx-social-login";
import {AppService} from "@services/app.service";
import {SweetAlertService} from "@services/utils/sweet-alert.service";
import {BnNgIdleService} from "bn-ng-idle";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {JwtHelperService} from "@auth0/angular-jwt";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  offline: boolean;
  eventBusSub?: Subscription;

  constructor(
    private translate: TranslateService,
    private appService: AppService,
    private eventBusService: EventBusService) {
    translate.addLangs(['es-ES', 'en-EN', 'tr-TR']);
    translate.setDefaultLang('es-ES');
  }

  ngOnInit(): void {
    window.addEventListener('online', this.onNetworkStatusChange.bind(this));
    window.addEventListener('offline', this.onNetworkStatusChange.bind(this));

    this.eventBusSub = this.eventBusService.on('logout', () => {
      console.log('logout desde bus emit');
      this.appService.logout();
    });
  }

  onNetworkStatusChange(): void {
    this.offline = !navigator.onLine;
    console.log('offline ' + this.offline);
  }

  ngOnDestroy(): void {
    if (this.eventBusSub)
      this.eventBusSub.unsubscribe();
  }
}
