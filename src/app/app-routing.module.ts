import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainComponent} from '@modules/main/main.component';
import {BlankComponent} from '@pages/blank/blank.component';
import {LoginComponent} from '@modules/login/login.component';
import {ProfileComponent} from '@pages/profile/profile.component';
import {RegisterComponent} from '@modules/register/register.component';
import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {AuthGuard} from '@guards/auth.guard';
import {NonAuthGuard} from '@guards/non-auth.guard';
import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';
import {PrivacyPolicyComponent} from '@modules/privacy-policy/privacy-policy.component';
import {TipoplanComponent} from "@pages/tipoplan/tipoplan.component";
import {EstadoplanComponent} from "@pages/estadoplan/estadoplan.component";
import { PeriodicidadplanComponent } from '@pages/periodicidadplan/periodicidadplan.component';
import { MateriaprincipalplanComponent } from '@pages/materiaprincipalplan/materiaprincipalplan.component';
import {PlanestudioComponent} from "@pages/planestudio/planestudio.component";
import {ComponenteComponent} from "@pages/planestudio/componente/componente.component";
import {MallasComponent} from "@pages/planestudio/mallas/mallas.component";
import {CorrequisitosComponent} from "@pages/planestudio/correquisitos/correquisitos.component";
import {PrerrequisitosComponent} from "@pages/planestudio/prerrequisitos/prerrequisitos.component";
import {HorarioSemanalComponent} from "@pages/planestudio/horarios/horario-semanal/horario-semanal.component";
import {CarreraComponent} from "@pages/estructuraacademica/carrera/carrera.component";
import {FacultadComponent} from "@pages/estructuraacademica/facultad/facultad.component";
import {CampusComponent} from "@pages/estructuraacademica/campus/campus.component";
import {SedeinstitucionComponent} from "@pages/estructuraacademica/sedeinstitucion/sedeinstitucion.component";
import {InstitucioneducativaComponent} from "@pages/estructuraacademica/institucioneducativa/institucioneducativa.component";
import {MateriaprincipalComponent} from "@pages/planestudio/materiaprincipal/materiaprincipal.component";
import { RegistroComponent } from '@pages/registroempleado/registro/registro.component';
import {EstadomodalidadmallaComponent} from "@pages/mallas/estadomodalidadmalla/estadomodalidadmalla.component";
import { DetallemodalidadtitComponent } from '@pages/mallas/detallemodalidadtit/detallemodalidadtit.component';
import { TipomodalidadtitComponent } from '@pages/mallas/tipomodalidadtit/tipomodalidadtit.component';
import { NivelespaoComponent } from '@pages/mallas/nivelespao/nivelespao.component';
import { TiporeqegresamientoComponent } from '@pages/mallas/tiporeqegresamiento/tiporeqegresamiento.component';
import { ReqegresamientoComponent } from '@pages/mallas/reqegresamiento/reqegresamiento.component';
import { ModalidadmallaComponent } from '@pages/mallas/modalidadmalla/modalidadmalla.component';
import { ModalidadtitulacionComponent } from '@pages/mallas/modalidadtitulacion/modalidadtitulacion.component';
import { ModalidadComponent } from '@pages/mallas/modalidad/modalidad.component';
import { HorariosmodalidadmallaComponent } from '@pages/mallas/horariosmodalidadmalla/horariosmodalidadmalla.component';
import { NivelestudioComponent } from '@pages/mallas/nivelestudio/nivelestudio.component';
import { EstadomallaComponent } from '@pages/mallas/estadomalla/estadomalla.component';
import { MallasRegistroComponent } from '@pages/mallas/mallas.component';
import { DuracionComponent } from '@pages/periodo/duracion/duracion.component';
import { EstadoperiodoComponent } from '@pages/periodo/estadoperiodo/estadoperiodo.component';
import { ModalidadperiodoComponent } from '@pages/periodo/modalidadperiodo/modalidadperiodo.component';
import { TipoperiodoComponent } from '@pages/periodo/tipoperiodo/tipoperiodo.component';
import { ControlesperiodoComponent } from '@pages/periodo/controlesperiodo/controlesperiodo.component';
import { PeriodoComponent } from '@pages/periodo/periodo.component';
import { ComponentesplanestudioComponent } from '@pages/componentesplanestudio/componentesplanestudio.component';
import { PlanificacionComponent } from '@pages/planificacion/planificacion.component';

const routes: Routes = [
  /*{
    path: '',
    component: HorarioSemanalComponent,
    pathMatch: 'full'
  },*/
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'blank',
        component: BlankComponent
      },
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'tipoplanestudio',
        component: TipoplanComponent,
      },
      {
        path: 'estadoplanestudio',
        component: EstadoplanComponent,
      },
      {
        path: 'periodicidadplan',
        component: PeriodicidadplanComponent,
      },
      {
        path: 'materiaprinciplan',
        component: MateriaprincipalplanComponent,
      },
      {
        path: 'planestudio',
        // component: PlanestudioComponent,
        component: PlanificacionComponent,
      },
      {
        path: 'componente',
        component: ComponenteComponent,
      }
      ,
      {
        path: 'mallas',
        component: MallasComponent,
      }
      ,
      {
        path: 'estadomodalidadmalla',
        component: EstadomodalidadmallaComponent,
      }
      ,
      {
        path: 'correquisitos',
        component: CorrequisitosComponent,
      },
      {
        path: 'institucion',
        component: InstitucioneducativaComponent,
      },
      {
        path: 'sede',
        component: SedeinstitucionComponent,
      },
      {
        path: 'campus',
        component: CampusComponent,
      },
      {
        path: 'facultad',
        component: FacultadComponent,
      },
      {
        path: 'carrera',
        component: CarreraComponent,
      },
      {
        path: 'registroempleado',
        component: RegistroComponent,
      },
      {
        path: 'detallemodalidadtit',
        component: DetallemodalidadtitComponent,
      },
      {
        path: 'tipomodalidadtit',
        component: TipomodalidadtitComponent,
      },
      {
        path: 'nivelpao',
        component: NivelespaoComponent,
      },
      {
        path: 'tiporegegresamiento',
        component: TiporeqegresamientoComponent,
      },
      {
        path: 'reqegresamiento',
        component: ReqegresamientoComponent,
      },
      {
        path: 'modalidadmalla',
        component: ModalidadmallaComponent,
      },
      {
        path: 'modalidadtitulacion',
        component: ModalidadtitulacionComponent,
      },
      {
        path: 'modalidad',
        component: ModalidadComponent,
      },
      {
        path: 'horasmodalidadmalla',
        component: HorariosmodalidadmallaComponent,
      },
      {
        path: 'nivelestudio',
        component: NivelestudioComponent,
      },
      {
        path: 'estadomalla',
        component: EstadomallaComponent,
      },
      {
        path: 'registromallas',
        component: MallasRegistroComponent,
      },
      {
        path: 'duracionperiodo',
        component: DuracionComponent,
      },
      {
        path: 'estadoperiodo',
        component: EstadoperiodoComponent,
      },
      {
        path: 'modalidadperiodo',
        component: ModalidadperiodoComponent,
      },
      {
        path: 'tipoperiodo',
        component: TipoperiodoComponent,
      },
      {
        path: 'controlesperiodo',
        component: ControlesperiodoComponent,
      },
      {
        path: 'registroperiodo',
        component: PeriodoComponent,
      },
      {
        path: 'componentesplanestudio',
        component: ComponentesplanestudioComponent,
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NonAuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NonAuthGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [NonAuthGuard]
  },
  {
    path: 'recover-password',
    component: RecoverPasswordComponent,
    canActivate: [NonAuthGuard]
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    canActivate: [NonAuthGuard]
  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
