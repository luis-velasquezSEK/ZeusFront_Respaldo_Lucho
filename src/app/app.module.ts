import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from '@/app-routing.module';
import {AppComponent} from './app.component';
import {MainComponent} from '@modules/main/main.component';
import {LoginComponent} from '@modules/login/login.component';
import {HeaderComponent} from '@modules/main/header/header.component';
import {FooterComponent} from '@modules/main/footer/footer.component';
import {MenuSidebarComponent} from '@modules/main/menu-sidebar/menu-sidebar.component';
import {BlankComponent} from '@pages/blank/blank.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProfileComponent} from '@pages/profile/profile.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RegisterComponent} from '@modules/register/register.component';
import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {ToastrModule} from 'ngx-toastr';
import {MessagesDropdownMenuComponent} from '@modules/main/header/messages-dropdown-menu/messages-dropdown-menu.component';
import {NotificationsDropdownMenuComponent} from '@modules/main/header/notifications-dropdown-menu/notifications-dropdown-menu.component';
import {AppButtonComponent} from './components/app-button/app-button.component';

import {registerLocaleData} from '@angular/common';
import localeEn from '@angular/common/locales/en';
import {UserDropdownMenuComponent} from '@modules/main/header/user-dropdown-menu/user-dropdown-menu.component';
import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';
import {LanguageDropdownComponent} from '@modules/main/header/language-dropdown/language-dropdown.component';
import {PrivacyPolicyComponent} from './modules/privacy-policy/privacy-policy.component';
import {PrimengModule} from './primeng/primeng.module';
import {MessageService} from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import {generalInterceptor} from "@/interceptor/general.interceptor";
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule
} from 'angularx-social-login';
//import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import {FullCalendarModule} from "@fullcalendar/angular";
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import {HttpClient} from '@angular/common/http';
import { TipoplanComponent } from './pages/tipoplan/tipoplan.component';
import { TipoplantableComponent } from './pages/tipoplan/tipoplantable/tipoplantable.component';
import { EstadoplanComponent } from './pages/estadoplan/estadoplan.component';
import { EstadoplantableComponent } from './pages/estadoplan/estadoplantable/estadoplantable.component';
import { PeriodicidadplanComponent } from './pages/periodicidadplan/periodicidadplan.component';
import { PeriodicidadplantableComponent } from './pages/periodicidadplan/periodicidadplantable/periodicidadplantable.component';
import { MateriaprincipalplanComponent } from './pages/materiaprincipalplan/materiaprincipalplan.component';
import { MateriacatalogotableComponent } from './pages/materiaprincipalplan/materiacatalogotable/materiacatalogotable.component';
import { PlanestudioComponent } from './pages/planestudio/planestudio.component';
import { ComponenteComponent } from './pages/planestudio/componente/componente.component';
import { ComponentetableComponent } from './pages/planestudio/componente/componentetable/componentetable.component';
import { MallasComponent } from './pages/planestudio/mallas/mallas.component';
import { CorrequisitosComponent } from './pages/planestudio/correquisitos/correquisitos.component';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import {AngularFireModule} from "@angular/fire/compat";
import { environment } from '../environments/environment';
import {MdbangularModule} from "@/mdbangular/mdbangular.module";
import {UploadFilesComponent} from "@components/upload-files/upload-files.component";
import { CorrequisitostableComponent } from './pages/planestudio/correquisitos/correquisitostable/correquisitostable.component';
import { PrerrequisitosComponent } from './pages/planestudio/prerrequisitos/prerrequisitos.component';
import { PrerrequisitostableComponent } from './pages/planestudio/prerrequisitos/prerrequisitostable/prerrequisitostable.component';
import { MateriacompartidaComponent } from './pages/planestudio/materiacompartida/materiacompartida.component';
import { MateriaequivalenteComponent } from './pages/planestudio/materiaequivalente/materiaequivalente.component';
import { HorariosComponent } from './pages/planestudio/horarios/horarios.component';
import { HorarioSemanalComponent } from './pages/planestudio/horarios/horario-semanal/horario-semanal.component';
import { HorarioFechaComponent } from './pages/planestudio/horarios/horario-fecha/horario-fecha.component';
import { HorarioModularComponent } from './pages/planestudio/horarios/horario-modular/horario-modular.component';
import { InstitucioneducativaComponent } from './pages/estructuraacademica/institucioneducativa/institucioneducativa.component';
import { SedeinstitucionComponent } from './pages/estructuraacademica/sedeinstitucion/sedeinstitucion.component';
import { CampusComponent } from './pages/estructuraacademica/campus/campus.component';
import { FacultadComponent } from './pages/estructuraacademica/facultad/facultad.component';
import { CarreraComponent } from './pages/estructuraacademica/carrera/carrera.component';
import { InstitucioneducativatableComponent } from './pages/estructuraacademica/institucioneducativa/institucioneducativatable/institucioneducativatable.component';
import { SedeinstituciontableComponent } from './pages/estructuraacademica/sedeinstitucion/sedeinstituciontable/sedeinstituciontable.component';
import { CampustableComponent } from './pages/estructuraacademica/campus/campustable/campustable.component';
import { FacultadtableComponent } from './pages/estructuraacademica/facultad/facultadtable/facultadtable.component';
import { CarreratableComponent } from './pages/estructuraacademica/carrera/carreratable/carreratable.component';
import { MateriaprincipalComponent } from './pages/planestudio/materiaprincipal/materiaprincipal.component';
import {AutoFocus} from "@components/auto-focus.directive";
import { ServiceWorkerModule } from '@angular/service-worker';
import {ControlSidebarComponent} from "@modules/main/control-sidebar/control-sidebar.component";
import {CheckboxComponent} from "@components/checkbox/checkbox.component";
import {DropdownComponent} from "@components/dropdown/dropdown.component";
import {MenuItemComponent} from "@components/menu-item/menu-item.component";
import {SelectComponent} from "@components/select/select.component";
import {DropdownMenuComponent} from "@components/dropdown/dropdown-menu/dropdown-menu.component";
import {StoreModule} from "@ngrx/store";
import {authReducer} from "@/store/auth/reducer";
import {uiReducer} from "@/store/ui/reducer";
import {SortByPipe} from "@/utils/SortByPipe";
import { RegistroComponent } from './pages/registroempleado/registro/registro.component';
import { RegistroempleadotableComponent } from './pages/registroempleado/registro/registroempleadotable/registroempleadotable.component';
import { EstadomodalidadmallaComponent } from './pages/mallas/estadomodalidadmalla/estadomodalidadmalla.component';
import { EstadomodalidadmallatableComponent } from './pages/mallas/estadomodalidadmalla/estadomodalidadmallatable/estadomodalidadmallatable.component';
import { ModalidadmallaComponent } from './pages/mallas/modalidadmalla/modalidadmalla.component';
import { ModalidadmallatableComponent } from './pages/mallas/modalidadmalla/modalidadmallatable/modalidadmallatable.component';
import { MallastableComponent } from './pages/mallas/mallastable/mallastable.component';

import {JwtModule } from '@auth0/angular-jwt';
import { DetallemodalidadtitComponent } from './pages/mallas/detallemodalidadtit/detallemodalidadtit.component';
import { DetallemodalidadtittableComponent } from './pages/mallas/detallemodalidadtit/detallemodalidadtittable/detallemodalidadtittable.component';
import { TipomodalidadtitComponent } from './pages/mallas/tipomodalidadtit/tipomodalidadtit.component';
import { TipomodaltittableComponent } from './pages/mallas/tipomodalidadtit/tipomodaltittable/tipomodaltittable.component';
import { SubtipomodalidadtitComponent } from './pages/mallas/subtipomodalidadtit/subtipomodalidadtit.component';
import { SubtipomodalidadtittableComponent } from './pages/mallas/subtipomodalidadtit/subtipomodalidadtittable/subtipomodalidadtittable.component';
import { NivelespaoComponent } from './pages/mallas/nivelespao/nivelespao.component';
import { NivelespaotableComponent } from './pages/mallas/nivelespao/nivelespaotable/nivelespaotable.component';
import { TiporeqegresamientoComponent } from './pages/mallas/tiporeqegresamiento/tiporeqegresamiento.component';
import { TiporeqegresamientotableComponent } from './pages/mallas/tiporeqegresamiento/tiporeqegresamientotable/tiporeqegresamientotable.component';
import { ReqegresamientoComponent } from './pages/mallas/reqegresamiento/reqegresamiento.component';
import { ReqegresamientotableComponent } from './pages/mallas/reqegresamiento/reqegresamientotable/reqegresamientotable.component';
import { ModalidadtitulacionComponent } from './pages/mallas/modalidadtitulacion/modalidadtitulacion.component';
import { ModalidadtittableComponent } from './pages/mallas/modalidadtitulacion/modalidadtittable/modalidadtittable.component';
import { ModalidadComponent } from './pages/mallas/modalidad/modalidad.component';
import { ModalidadtableComponent } from './pages/mallas/modalidad/modalidadtable/modalidadtable.component';
import { HorariosmodalidadmallaComponent } from './pages/mallas/horariosmodalidadmalla/horariosmodalidadmalla.component';
import { HorariosmodmallatableComponent } from './pages/mallas/horariosmodalidadmalla/horariosmodmallatable/horariosmodmallatable.component';
import { NivelestudioComponent } from './pages/mallas/nivelestudio/nivelestudio.component';
import { NivelestudiotableComponent } from './pages/mallas/nivelestudio/nivelestudiotable/nivelestudiotable.component';
import { EstadomallaComponent } from './pages/mallas/estadomalla/estadomalla.component';
import { EstadomallatableComponent } from './pages/mallas/estadomalla/estadomallatable/estadomallatable.component';
import { MallasRegistroComponent } from '@pages/mallas/mallas.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
// import { NgGoogleOneTapModule } from 'ng-google-one-tap';
import { PeriodoComponent } from './pages/periodo/periodo.component';
import { DuracionComponent } from './pages/periodo/duracion/duracion.component';
import { DuraciontableComponent } from './pages/periodo/duracion/duraciontable/duraciontable.component';
import { EstadoperiodoComponent } from './pages/periodo/estadoperiodo/estadoperiodo.component';
import { EstadopertableComponent } from './pages/periodo/estadoperiodo/estadopertable/estadopertable.component';
import { ModalidadperiodoComponent } from './pages/periodo/modalidadperiodo/modalidadperiodo.component';
import { ModalidadpertableComponent } from './pages/periodo/modalidadperiodo/modalidadpertable/modalidadpertable.component';
import { TipoperiodoComponent } from './pages/periodo/tipoperiodo/tipoperiodo.component';
import { TipoperiodotableComponent } from './pages/periodo/tipoperiodo/tipoperiodotable/tipoperiodotable.component';
import { ControlesperiodoComponent } from './pages/periodo/controlesperiodo/controlesperiodo.component';
import { ControlperiodotableComponent } from './pages/periodo/controlesperiodo/controlperiodotable/controlperiodotable.component';
import { PeriodotableComponent } from './pages/periodo/periodotable/periodotable.component';
import { MallacurrilularComponent } from './pages/mallas/mallacurrilular/mallacurrilular.component';
import { ComponentesplanestudioComponent } from './pages/componentesplanestudio/componentesplanestudio.component';
import { CookieService } from 'ngx-cookie-service';
import { PlanificacionComponent } from './pages/planificacion/planificacion.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    SortByPipe,
    ControlSidebarComponent,
    DropdownMenuComponent,
    CheckboxComponent,
    AppButtonComponent,
    DropdownComponent,
    MenuItemComponent,
    SelectComponent,
    AutoFocus,
    AppComponent,
    MainComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    MenuSidebarComponent,
    BlankComponent,
    ProfileComponent,
    RegisterComponent,
    DashboardComponent,
    MessagesDropdownMenuComponent,
    NotificationsDropdownMenuComponent,
    AppButtonComponent,
    UserDropdownMenuComponent,
    ForgotPasswordComponent,
    RecoverPasswordComponent,
    LanguageDropdownComponent,
    PrivacyPolicyComponent,
    TipoplanComponent,
    TipoplantableComponent,
    EstadoplanComponent,
    EstadoplantableComponent,
    PeriodicidadplanComponent,
    PeriodicidadplantableComponent,
    MateriaprincipalplanComponent,
    MateriacatalogotableComponent,
    PlanestudioComponent,
    ComponenteComponent,
    ComponentetableComponent,
    MallasComponent,
    CorrequisitosComponent,
    UploadFilesComponent,
    CorrequisitostableComponent,
    PrerrequisitosComponent,
    PrerrequisitostableComponent,
    MateriacompartidaComponent,
    MateriaequivalenteComponent,
    HorariosComponent,
    HorarioSemanalComponent,
    HorarioFechaComponent,
    HorarioModularComponent,
    InstitucioneducativaComponent,
    SedeinstitucionComponent,
    CampusComponent,
    FacultadComponent,
    CarreraComponent,
    InstitucioneducativatableComponent,
    SedeinstituciontableComponent,
    CampustableComponent,
    FacultadtableComponent,
    CarreratableComponent,
    MateriaprincipalComponent,
    RegistroComponent,
    RegistroempleadotableComponent,
    EstadomodalidadmallaComponent,
    EstadomodalidadmallatableComponent,
    ModalidadmallaComponent,
    ModalidadmallatableComponent,
    MallastableComponent,
    DetallemodalidadtitComponent,
    DetallemodalidadtittableComponent,
    TipomodalidadtitComponent,
    TipomodaltittableComponent,
    SubtipomodalidadtitComponent,
    SubtipomodalidadtittableComponent,
    NivelespaoComponent,
    NivelespaotableComponent,
    TiporeqegresamientoComponent,
    TiporeqegresamientotableComponent,
    ReqegresamientoComponent,
    ReqegresamientotableComponent,
    ModalidadtitulacionComponent,
    ModalidadtittableComponent,
    ModalidadComponent,
    ModalidadtableComponent,
    HorariosmodalidadmallaComponent,
    HorariosmodmallatableComponent,
    NivelestudioComponent,
    NivelestudiotableComponent,
    EstadomallaComponent,
    EstadomallatableComponent,
    MallasRegistroComponent,
    PeriodoComponent,
    DuracionComponent,
    DuraciontableComponent,
    EstadoperiodoComponent,
    EstadopertableComponent,
    ModalidadperiodoComponent,
    ModalidadpertableComponent,
    TipoperiodoComponent,
    TipoperiodotableComponent,
    ControlesperiodoComponent,
    ControlperiodotableComponent,
    PeriodotableComponent,
    MallacurrilularComponent,
    ComponentesplanestudioComponent,
    PlanificacionComponent
  ],
  imports: [
    JwtModule.forRoot({
      config: {
        tokenGetter: function  tokenGetter() {
          return sessionStorage.getItem('AuthToken');
        }
      }
    }),
    StoreModule.forRoot({auth: authReducer, ui: uiReducer}),
    SocialLoginModule,
    PrimengModule,
    MdbangularModule,
    BrowserModule,
    FullCalendarModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireAuthModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    CookieService,
    MessageService,
    ConfirmationService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              //'1023984850599-fjapi7oahth1q4o7b4nr8fre0apui80d.apps.googleusercontent.com'
              '18826009579-jokv1saggluh788q0qgf6bh6h0ij77jm.apps.googleusercontent.com'
            ),
          },
          /*{
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('184557725491466'),
          },*/
        ],
      } as SocialAuthServiceConfig,
    },
    generalInterceptor,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
