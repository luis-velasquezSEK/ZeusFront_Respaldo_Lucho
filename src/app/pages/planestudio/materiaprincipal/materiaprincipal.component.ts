import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EstadoPlanEstudioDTO} from "@/dto/estado-plan-dto";
import {PeriodicidadPlanEstudioDTO} from "@/dto/periodicidad-plan-dto";
import {TipoPlanEstudioDTO} from "@/dto/tipo-plan";
import {MateriaPrincipalDto} from "@/dto/materia-principal-plan-dto";
import {FacultadDto} from "@/dto/FacultadDto";
import {CarreraDto} from "@/dto/CarreraDto";
import {MallaDto} from "@/dto/MallaDto";
import {ModalidadMallaDto} from "@/dto/ModalidadMallaDto";
import {NivelEstudioDto} from "@/dto/NivelEstudioDto";
import {CatalogoMateriasDto} from "@/dto/CatalogoMateriasDto";
import {ConfirmationService, SelectItem} from "primeng/api";
import {AppService} from "@services/app.service";
import {PeriodicidadPlanService} from "@services/planestudio/periodicidadplan.service";
import {TipoPlanService} from "@services/planestudio/tipoplan.service";
import {FacultadService} from "@services/institucioneducativa/facultad.service";
import {CarreraService} from "@services/institucioneducativa/carrera.service";
import {MallaService} from "@services/mallas/malla.service";
import {ModalidadMallaService} from "@services/mallas/modalidadmalla.service";
import {NivelesEstudioService} from "@services/planestudio/nivelesestudio.service";
import {MateriasCatalogoService} from "@services/catalogos/materiascatalogo.service";
import {EstadoPlanService} from "@services/planestudio/estadoplan.service";
import {MateriaPrincipalPlanService} from "@services/planestudio/materiaprincipalplan.service";
import {HttpParams} from "@angular/common/http";
import {PlanEstudioServiceEmiter} from "@pages/planestudio/PlanEstudioService";

@Component({
  selector: 'app-materiaprincipal',
  templateUrl: './materiaprincipal.component.html',
  styleUrls: ['./materiaprincipal.component.scss']
})
export class MateriaprincipalComponent implements OnInit {

  /***
   * variables globales, @Input para enlaces de componentes
   * * */
  materiaPrincipal: MateriaPrincipalDto = new MateriaPrincipalDto();

  facultadSelected: any;
  facultadShow: FacultadDto = new FacultadDto();
  carreraSelected: any;
  carreraShow: CarreraDto = new CarreraDto();
  mallaSelected: any;
  mallaShow: MallaDto = new MallaDto();
  modalidadMallaSelected: any;
  modalidadMallaShow: ModalidadMallaDto = new ModalidadMallaDto();
  nivelEstudioSelected: any;
  nivelEstudiosShow: NivelEstudioDto = new NivelEstudioDto();

  lstMateriaPrincipal: MateriaPrincipalDto[];
  listFacultad: FacultadDto[];
  listCarrera: CarreraDto[];
  listMalla: MallaDto[];
  listModalidadMalla: ModalidadMallaDto[];
  listNivelEstudios: NivelEstudioDto[];

  sortOptions: SelectItem[];
  sortOrder: number;
  sortField: string;
  sortKey: string;
  index = 0;


  /***
   * Constructor: se agregar los servicios ncesarios
   * **/
  constructor(public appService: AppService,
              private confirmationService: ConfirmationService,
              private planEstudioService: PlanEstudioServiceEmiter,
              public facultadService: FacultadService,
              public carreraService: CarreraService,
              public mallaService: MallaService,
              public modalidadMallaService: ModalidadMallaService,
              public nivelEstudioService: NivelesEstudioService,
              public materiacatalogoService: MateriasCatalogoService,
              public materiaprincipalService: MateriaPrincipalPlanService) {
  }

  /***
   * Constructir para inicializar antes del renderizado de la pagina
   * **/
  ngOnInit(): void {
    this.llenarCombofacultad();
    this.sortOptions = [
      {label: 'Nombre A-Z', value: 'nombreMateriap'},
      {label: 'Nombre Z-A', value: '!nombreMateriap'}
    ];
    this.llenarComboCarrera();
this.llenarNivelEstudio();
  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  llenarCombofacultad() {
    this.facultadService.getAll().subscribe(data => {
      this.listFacultad = data;
    });
  }

  llenarNivelEstudio() {
    this.nivelEstudioService.getAll().subscribe(data => {
      this.listNivelEstudios = data;

      console.log(data);
    });
  }

  llenarComboCarrera() {
    this.carreraService.getAll().subscribe(data => {
      this.listCarrera = data;
    });
  }




  llenarDetalleFacultad(event) {
    try {
      //llena el combo de carrera y setea carrera y carrerashow
      /*this.carreraService.findByFacultad(this.facultadSelected.idFacultad).subscribe(data => {
        this.listCarrera = data;
      });

       */
      if (this.facultadSelected !== null) {
        this.facultadShow = this.facultadSelected;
        this.listCarrera = this.facultadSelected.carreraListDTO;
      } else {
        this.facultadShow = new FacultadDto();
        this.listCarrera = new Array();
        this.listMalla = new Array();
        this.listModalidadMalla = new Array();
        this.listNivelEstudios = new Array();
      }
      this.carreraSelected = null;
      this.carreraShow = new CarreraDto();
      //Setea todos los combos y shows

      this.mallaSelected = null;
      this.mallaShow = new MallaDto();
      this.modalidadMallaSelected = null;
      this.modalidadMallaShow = new ModalidadMallaDto();
      this.nivelEstudioSelected = null;
      this.nivelEstudiosShow = new NivelEstudioDto();
    } catch (error) {
      console.log('ERROR LLENAR DETALLE FACULTAD: ' + JSON.stringify(error));
    }
  }

  llenarDetalleCarrera(event) {

    //llena el combo de carrera y setea carrera y carrerashow
    try {
      this.carreraService.getAll().subscribe(data => 
      //this.carreraService.getById(this.carreraSelected.idCarrera).subscribe(data => 
        {
        this.carreraShow = data;

        this.listMalla = this.carreraShow.mallaListDTO;

        //Setea todos los combos y shows

        this.mallaSelected = null;
        this.mallaShow = new MallaDto();
        this.modalidadMallaSelected = null;
        this.modalidadMallaShow = new ModalidadMallaDto();
        this.nivelEstudioSelected = null;
        this.nivelEstudiosShow = new NivelEstudioDto();
      });
    } catch (e) {
      console.log('ERROR' + e);
      this.listMalla = new Array();
      this.listModalidadMalla = new Array();
      this.listNivelEstudios = new Array();
      this.carreraSelected = null;
      this.carreraShow = new CarreraDto();
      this.mallaSelected = null;
      this.mallaShow = new MallaDto();
      this.modalidadMallaSelected = null;
      this.modalidadMallaShow = new ModalidadMallaDto();
      this.nivelEstudioSelected = null;
      this.nivelEstudiosShow = new NivelEstudioDto();
    }


  }

  llenarDetalleMalla(event) {

    try {
      //llena el combo de carrera y setea carrera y carrerashow
      this.mallaService.getById(this.mallaSelected.idMalla).subscribe(data => {
        this.mallaShow = data;

        this.listModalidadMalla = this.mallaShow.modalidadMallaListDTO;

        //Setea todos los combos y shows
        this.modalidadMallaSelected = null;
        this.modalidadMallaShow = new ModalidadMallaDto();
        this.nivelEstudioSelected = null;
        this.nivelEstudiosShow = new NivelEstudioDto();
      });
    } catch (e) {
      console.log('ERROR' + e);
      this.listModalidadMalla = new Array();
      this.listNivelEstudios = new Array();
      this.mallaSelected = null;
      this.mallaShow = new MallaDto();
      this.modalidadMallaSelected = null;
      this.modalidadMallaShow = new ModalidadMallaDto();
      this.nivelEstudioSelected = null;
      this.nivelEstudiosShow = new NivelEstudioDto();
    }


  }

  llenarDetalleModalidadMalla(event) {

    try {
      //llena el combo de carrera y setea carrera y carrerashow
      this.modalidadMallaService.getById(this.modalidadMallaSelected.idModalidadMalla).subscribe(data => {
        this.modalidadMallaShow = data;

        this.listNivelEstudios = this.modalidadMallaShow.nivelEstudioListDTO;

        //Setea todos los combos y shows
        this.nivelEstudioSelected = null;
        this.nivelEstudiosShow = new NivelEstudioDto();

      });
    } catch (e) {
      console.log('ERROR' + e);
      this.listNivelEstudios = new Array();
      this.modalidadMallaSelected = null;
      this.modalidadMallaShow = new ModalidadMallaDto();
      this.nivelEstudioSelected = null;
      this.nivelEstudiosShow = new NivelEstudioDto();
    }
  }

  llenarDetalleNivelEstudios(event) {
    try {
      //llena el combo de carrera y setea carrera y carrerashow
      console.log('ID NIVEL ESTUDIO SELECTED: ' + this.nivelEstudioSelected.idNivelEstudio);
      this.nivelEstudioService.getById(this.nivelEstudioSelected.idNivelEstudio).subscribe(data => {
        this.nivelEstudiosShow = data;
        let params = new HttpParams()
          .set('idNivelEstudio', this.nivelEstudioSelected.idNivelEstudio);

        this.materiaprincipalService.getByNivel(params).subscribe(data => {
          this.lstMateriaPrincipal = data;
          this.index = 0;
          this.materiaPrincipal = new MateriaPrincipalDto();
        }), (error) => {
          console.log(error);
        }

      });
    } catch (e) {
      console.log('ERROR' + e);
      this.nivelEstudioSelected = null;
      this.nivelEstudiosShow = new NivelEstudioDto();
      this.index = 0;
      this.materiaPrincipal = new MateriaPrincipalDto();
    }

  }

  escogerMateria(item) {
    if (this.index === 0) {
      this.index = item.idMateriap;
      this.materiaPrincipal = item;
    } else if (this.materiaPrincipal.idMateriap === item.idMateriap) {
      this.index = 0;
      this.materiaPrincipal = new MateriaPrincipalDto();
    } else {
      this.index = item.idMateriap;
      this.materiaPrincipal = item;
    }
    this.planEstudioService.setMateriaInput(this.materiaPrincipal);


  }
}
