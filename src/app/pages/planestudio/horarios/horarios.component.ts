import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FranjaHorarioDto} from "@/dto/FranjaHorarioDto";
import {FormBuilder, FormGroup} from "@angular/forms";
import {FacultadDto} from "@/dto/FacultadDto";
import {CarreraDto} from "@/dto/CarreraDto";
import {MallaDto} from "@/dto/MallaDto";
import {ModalidadMallaDto} from "@/dto/ModalidadMallaDto";
import {TipoInfraestructuraDto} from "@/dto/TipoInfraestructuraDto";
import {InfraestructuraDto} from "@/dto/InfraestructuraDto";
import {NivelInfraestructuraDto} from "@/dto/NivelInfraestructuraDto";
import {EspaciosFisicosDto} from "@/dto/EspaciosFisicosDto";
import {HorasModalidadMallaDto} from "@/dto/HorasModalidadMallaDto";
import {AppService} from "@services/app.service";
import {FacultadService} from "@services/institucioneducativa/facultad.service";
import {CarreraService} from "@services/institucioneducativa/carrera.service";
import {MallaService} from "@services/mallas/malla.service";
import {ModalidadMallaService} from "@services/mallas/modalidadmalla.service";
import {HorasModalidadMallaService} from "@services/mallas/horasmodalidadmalla.service";
import {NivelesEstudioService} from "@services/planestudio/nivelesestudio.service";
import {TipoInfraestructuraService} from "@services/infraestructura/tipoinfraestructura.service";
import {InfraestructuraService} from "@services/infraestructura/infraestructura.service";
import {NivelInfraestructuraService} from "@services/infraestructura/nivelinfraestructura.service";
import {EspacioService} from "@services/infraestructura/espacio.service";
import {PlanEstudioService} from "@services/planestudio/planestudio.service";
import {PlanEstudioServiceEmiter} from "@pages/planestudio/PlanEstudioService";
import {FechasHorarioDto} from "@/dto/FechasHorarioDto";
import {FechaFechasHorarioDto} from "@/dto/FechaFechasHorarioDto";
import {ModuloFechasHorarioDto} from "@/dto/ModuloFechasHorarioDto";
import {SweetAlertService} from "@services/utils/sweet-alert.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.scss']
})
export class HorariosComponent implements OnInit {

  /*valorBarras: string = "";
  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    console.log('codigo' + this.valorBarras);
    // remove something...
  }*/

  lstHorario: FranjaHorarioDto[] = new Array();
  lstHorariosFechasInput: FechasHorarioDto[];
  lstHorariosModularInput: FechasHorarioDto[];
  horarioFechasInput: FechaFechasHorarioDto[] = new Array();
  horarioModulosInput: ModuloFechasHorarioDto[] = new Array();

  muestraCruces: FechaFechasHorarioDto = new FechaFechasHorarioDto();
  muestraCrucesSemanal:FranjaHorarioDto[] = new Array();

  sidecruces: boolean = false;
  tipoHorario: number;

  //#region Variables para formularios
  form: FormGroup;

  //# region variables de objetos
  facultadSelected: any;
  facultadShow: FacultadDto = new FacultadDto();
  carreraSelected: any;
  carreraShow: CarreraDto = new CarreraDto();
  mallaSelected: any;
  mallaShow: MallaDto = new MallaDto();
  modalidadMallaSelected: any;
  modalidadMallaShow: ModalidadMallaDto = new ModalidadMallaDto();

  tipoInfraSelected: any;
  tipoInfraShow: TipoInfraestructuraDto = new TipoInfraestructuraDto();
  infraSelected: any;
  infraShow: InfraestructuraDto = new InfraestructuraDto();
  nivelSelected: any;
  nivelShow: NivelInfraestructuraDto = new NivelInfraestructuraDto();
  espacioSelect: EspaciosFisicosDto;
  espacioFechaSelect: EspaciosFisicosDto;
  espacioModuloSelect: EspaciosFisicosDto;

  //#region variables de listas
  listFacultad: FacultadDto[];
  listCarrera: CarreraDto[];
  listMalla: MallaDto[];
  listModalidadMalla: ModalidadMallaDto[];
  lstHorasModalidadMalla: HorasModalidadMallaDto[];
  lstHorasModalidadMallaSelect: HorasModalidadMallaDto[];
  lstTipoInfraestructura: TipoInfraestructuraDto[];
  lstInfraestructura: InfraestructuraDto[];
  lstNivelInfraestructura: NivelInfraestructuraDto[];
  lstEspacio: EspaciosFisicosDto[];


  constructor(public appService: AppService,
              public formBuilder: FormBuilder,
              public facultadService: FacultadService,
              public carreraService: CarreraService,
              public mallaService: MallaService,
              public modalidadMallaService: ModalidadMallaService,
              public horasModalidadMallaService: HorasModalidadMallaService,
              public nivelEstudioService: NivelesEstudioService,
              public tipoInfraestructuraService: TipoInfraestructuraService,
              public infraestructuraService: InfraestructuraService,
              public nivelesService: NivelInfraestructuraService,
              public espaciosService: EspacioService,
              public planEstudioService: PlanEstudioService,
              public planEstudioEmiter: PlanEstudioServiceEmiter,
              public sweetAlert: SweetAlertService,) {
  }

  ngOnInit(): void {
    this.lstHorario = new Array<FranjaHorarioDto>();
    this.lstHorariosFechasInput = new Array<FechasHorarioDto>();
    this.lstHorariosModularInput = new Array<FechasHorarioDto>();


    this.crearForm();
    this.llenarCombofacultad();
    this.llenarComboTipoInfraestructura();
    this.getEmitHorarios();
    //this.tipoHorario = this.planEstudioEmiter.getTipoHorario();
    //console.log("tipo horario" + this.tipoHorario);

  }

  cleanHorarios() {
    this.planEstudioEmiter.setTipoHorario(0);
    this.planEstudioEmiter.setHorarioSemanalInput(new Array());
    this.planEstudioEmiter.setHorarioFechasInput(new Array());
    this.planEstudioEmiter.setHorarioModularInput(new Array());

    this.planEstudioEmiter.setHorarioFechasInputSelect(new Array());
    this.planEstudioEmiter.setHorarioModularInputSelect(new Array());

  }

  setEspacio(item) {
    this.espacioSelect = item;
  }

  crearForm() {
    this.form = new FormGroup({});
  }

  getEmitHorarios() {
    this.planEstudioEmiter.tipoHorario.subscribe(item => {
      if (item === 0) {
        this.planEstudioEmiter.horarioSemanalInput.subscribe(item => {
          this.lstHorario = item;
          this.tipoHorario = 0;
          this.planEstudioEmiter.espacioInput.subscribe(espacio => {
            this.espacioSelect = espacio;
          });
        });
      } else if (item === 1) {
        this.planEstudioEmiter.horarioFechasInput.subscribe(item => {
          this.lstHorariosFechasInput = item;
          this.tipoHorario = 1;
          this.planEstudioEmiter.espacioFechasInput.subscribe(espacio => {
            this.espacioFechaSelect = espacio;
          });
        });

        this.planEstudioEmiter.horarioFechasInputSelect.subscribe(
          horario => {
            this.horarioFechasInput = horario;
          }
        );
      } else if (item === 2) {
        this.planEstudioEmiter.horarioModularInput.subscribe(item => {
          this.lstHorariosModularInput = item;
          this.tipoHorario = 2;
          this.planEstudioEmiter.espacioModuloInput.subscribe(espacio => {
            this.espacioModuloSelect = espacio;
          });
        });
        this.planEstudioEmiter.horarioModularInputSelect.subscribe(
          modulo => {
            this.horarioModulosInput = modulo;
          }
        );
      }
    });
  }

  emitHorarios() {
    //switch de item para 0,1,2
    switch (this.tipoHorario) {
      case 0:
        this.planEstudioEmiter.setHorarioSemanalInput(this.lstHorario);
        this.espacioSelect !== undefined ? this.planEstudioEmiter.setEspacioInput(this.espacioSelect) : null;
        break;
      case 1:
        this.planEstudioEmiter.setHorarioFechasInput(this.lstHorariosFechasInput);
        this.planEstudioEmiter.setHorarioFechasInputSelect(this.horarioFechasInput);
        this.espacioFechaSelect !== undefined ? this.planEstudioEmiter.setEspacioFechasInput(this.espacioFechaSelect) : null;
        break;
      case 2:
        this.planEstudioEmiter.setHorarioModularInput(this.lstHorariosModularInput);
        this.planEstudioEmiter.setHorarioModularInputSelect(this.horarioModulosInput);
        this.espacioModuloSelect !== undefined ? this.planEstudioEmiter.setEspacioModuloInput(this.espacioModuloSelect) : null;
        break;
      default:
        this.planEstudioEmiter.setHorarioSemanalInput(this.lstHorario);
        this.espacioSelect !== undefined ? this.planEstudioEmiter.setEspacioInput(this.espacioSelect) : null;
        break;
    }
  }

  setTipoHorario(item) {
    this.tipoHorario = item;
    this.planEstudioEmiter.setTipoHorario(item);
    this.emitHorarios();
  }

  llenarCombofacultad() {
    this.facultadService.getAll().subscribe(data => {
      this.listFacultad = data;
    });
  }

  llenarDetalleFacultad(event) {
    try {
      if (this.facultadSelected !== null) {
        this.facultadShow = this.facultadSelected;
        this.listCarrera = this.facultadSelected.carreraListDTO;
      } else {
        this.facultadShow = new FacultadDto();
        this.listCarrera = new Array();
        this.listMalla = new Array();
        this.listModalidadMalla = new Array();
        this.lstHorario = new Array();
        this.lstHorariosFechasInput = new Array();
        this.lstHorariosModularInput = new Array();

        this.cleanHorarios();
      }
      this.carreraSelected = null;
      this.carreraShow = new CarreraDto();
      //Setea todos los combos y shows

      this.mallaSelected = null;
      this.mallaShow = new MallaDto();
      this.modalidadMallaSelected = null;
      this.modalidadMallaShow = new ModalidadMallaDto();

    } catch (error) {
      console.log('ERROR LLENAR DETALLE FACULTAD: ' + JSON.stringify(error));

    }
  }

  llenarDetalleCarrera(event) {
    //llena el combo de carrera y setea carrera y carrerashow
    try {
      this.carreraService.getById(this.carreraSelected.idCarrera).subscribe(data => {
        this.carreraShow = data;
        this.listMalla = this.carreraShow.mallaListDTO;

        //Setea todos los combos y shows
        this.mallaSelected = null;
        this.mallaShow = new MallaDto();
        this.modalidadMallaSelected = null;
        this.modalidadMallaShow = new ModalidadMallaDto();
      });
    } catch (e) {
      console.log('ERROR' + e);
      this.listMalla = new Array();
      this.listModalidadMalla = new Array();
      this.lstHorario = new Array();
      this.lstHorariosFechasInput = new Array();
      this.lstHorariosModularInput = new Array();

      this.carreraSelected = null;
      this.carreraShow = new CarreraDto();
      this.mallaSelected = null;
      this.mallaShow = new MallaDto();
      this.modalidadMallaSelected = null;
      this.modalidadMallaShow = new ModalidadMallaDto();

      this.cleanHorarios();
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
      });
    } catch (e) {
      console.log('ERROR' + e);
      this.listModalidadMalla = new Array();
      this.lstHorario = new Array();
      this.lstHorariosFechasInput = new Array();
      this.lstHorariosModularInput = new Array();

      this.mallaSelected = null;
      this.mallaShow = new MallaDto();
      this.modalidadMallaSelected = null;
      this.modalidadMallaShow = new ModalidadMallaDto();

      this.cleanHorarios();
    }
  }

  llenarDetalleModalidadMalla(event) {
    try {
      //llenar horasmodalidadmalla
      this.horasModalidadMallaService.findByModalidadMallaId(this.modalidadMallaSelected.idModalidadMalla).subscribe(data => {
        this.lstHorasModalidadMalla = data;
        this.lstHorario = new Array();
        this.lstHorariosFechasInput = new Array();
        this.lstHorariosModularInput = new Array();

        for (let index = 0; index < this.lstHorasModalidadMalla.length; index++) {
          let franjaHorario: FranjaHorarioDto = new FranjaHorarioDto();
          let fechaHorario: FechasHorarioDto = new FechasHorarioDto();
          let fechaModulo: FechasHorarioDto = new FechasHorarioDto();
          franjaHorario.idFranjaHorario = this.lstHorasModalidadMalla[index].idHorasModalidadMalla;

          franjaHorario.horarioiFranjaHorario = this.appService.timeToDate(this.lstHorasModalidadMalla[index].horaInicioModalidadMalla);
          franjaHorario.horariofFranjaHorario = this.appService.timeToDate(this.lstHorasModalidadMalla[index].horaFinModalidadMalla);

          franjaHorario.lunesFranjaHorario = null;
          franjaHorario.martesFranjaHorario = null;
          franjaHorario.miercolesFranjaHorario = null;
          franjaHorario.juevesFranjaHorario = null;
          franjaHorario.viernesFranjaHorario = null;
          franjaHorario.sabadoFranjaHorario = null;
          franjaHorario.domingoFranjaHorario = null;
          franjaHorario.activoFranjaHorario = false;
          this.lstHorario.push(franjaHorario);

          fechaHorario.idFechaHorario = this.lstHorasModalidadMalla[index].idHorasModalidadMalla;
          fechaHorario.fechaiFechaHorario = this.appService.timeToDate(this.lstHorasModalidadMalla[index].horaInicioModalidadMalla);
          fechaHorario.fechafFechaHorario = this.appService.timeToDate(this.lstHorasModalidadMalla[index].horaFinModalidadMalla);
          fechaHorario.activoFechaHorario = false;

          fechaModulo.idFechaHorario = this.lstHorasModalidadMalla[index].idHorasModalidadMalla;
          fechaModulo.fechaiFechaHorario = this.appService.timeToDate(this.lstHorasModalidadMalla[index].horaInicioModalidadMalla);
          fechaModulo.fechafFechaHorario = this.appService.timeToDate(this.lstHorasModalidadMalla[index].horaFinModalidadMalla);
          fechaModulo.activoFechaHorario = false;

          this.lstHorariosFechasInput.push(fechaHorario);
          this.lstHorariosModularInput.push(fechaModulo);
        }
        this.planEstudioEmiter.setTipoHorario(0);
        this.planEstudioEmiter.setHorarioSemanalInput(this.lstHorario);
        this.planEstudioEmiter.setHorarioFechasInput(this.lstHorariosFechasInput);
        this.planEstudioEmiter.setHorarioModularInput(this.lstHorariosModularInput);
        this.planEstudioEmiter.setHorarioFechasInputSelect(new Array());
        this.planEstudioEmiter.setHorarioModularInputSelect(new Array());
        //this.emitHorarios();
      });
    } catch (e) {
      console.log('ERROR' + e);
      this.lstHorario = new Array();
      this.modalidadMallaSelected = null;
      this.modalidadMallaShow = new ModalidadMallaDto();
      this.cleanHorarios();
    }
  }

  llenarComboTipoInfraestructura() {
    this.tipoInfraestructuraService.getAll().subscribe(data => {
      this.lstTipoInfraestructura = data;
    });
  }

  llenarDetalleTipoInfra(event) {
    try {
      if (this.tipoInfraSelected !== null) {
        this.tipoInfraShow = this.tipoInfraSelected;
        this.lstInfraestructura = this.tipoInfraSelected.infraestructuraListDTO;
      } else {
        this.tipoInfraShow = new TipoInfraestructuraDto();
        this.lstInfraestructura = new Array();
        this.lstNivelInfraestructura = new Array();
        this.lstEspacio = new Array();
      }
      this.infraSelected = null;
      this.infraShow = new InfraestructuraDto();
      this.nivelSelected = null;
      this.nivelShow = new NivelInfraestructuraDto();
    } catch (error) {
      console.log('ERROR LLENAR DETALLE FACULTAD: ' + JSON.stringify(error));
    }
  }

  llenarDetalleInfra(event) {
    try {
      if (this.infraSelected !== null) {
        this.infraShow = this.infraSelected;
        this.nivelesService.getByIdInfraestructura(this.infraSelected.idInfraestructura).subscribe(data => {
          this.lstNivelInfraestructura = data;
        });
      } else {
        this.infraShow = new InfraestructuraDto();
        this.lstNivelInfraestructura = new Array();
        this.lstEspacio = new Array();
      }
      this.nivelSelected = null;
      this.nivelShow = new NivelInfraestructuraDto();
    } catch (error) {
      console.log('ERROR LLENAR DETALLE FACULTAD: ' + JSON.stringify(error));
    }
  }

  llenarDetalleNivel(event) {
    try {
      if (this.nivelSelected !== null) {
        this.nivelShow = this.nivelSelected;
        this.espaciosService.getByIdNivel(this.nivelSelected.idNivelInfraestructura).subscribe(data => {
          this.lstEspacio = data;
          this.planEstudioEmiter.setLstEspacioInput(this.lstEspacio);
        }, error => {
          console.log('ERROR LLENAR DETALLE NIVEL: ' + JSON.stringify(error));
        });
      } else {
        this.nivelShow = new NivelInfraestructuraDto();
        this.lstEspacio = new Array();
        this.planEstudioEmiter.setLstEspacioInput(new Array());
      }

    } catch (error) {
      console.log('ERROR LLENAR DETALLE FACULTAD: ' + JSON.stringify(error));
    }
  }

  /***
   * Preparar Horario
   * ***/
  prepararHorario() {
    try {
      this.lstHorario.forEach(horario => {
        if (horario.lunesFranjaHorario === null) {
          horario.lunesFranjaHorario = '';
        }
        if (horario.martesFranjaHorario === null) {
          horario.martesFranjaHorario = '';
        }
        if (horario.miercolesFranjaHorario === null) {
          horario.miercolesFranjaHorario = '';
        }
        if (horario.juevesFranjaHorario === null) {
          horario.juevesFranjaHorario = '';
        }
        if (horario.viernesFranjaHorario === null) {
          horario.viernesFranjaHorario = '';
        }
        if (horario.sabadoFranjaHorario === null) {
          horario.sabadoFranjaHorario = '';
        }
        if (horario.domingoFranjaHorario === null) {
          horario.domingoFranjaHorario = '';
        }
      });
    } catch (error) {
      console.log('ERROR PREPARAR HORARIO: ' + JSON.stringify(error));
    }
  }
  /**
   * Métodos para funcionalidad de la pagina
   * **/
  checarCruceSemanal() {
    //this.prepararHorario();
    switch (this.tipoHorario) {
      case 0:
        if (this.espacioSelect === undefined || this.espacioSelect === null) {
          this.appService.msgInfoDetail("warn", "Franja Semanal:Espacio", "No se ha seleccionado un espacio, por favor verifique");
        } else {
          this.sweetAlert.simpleAlert();
          this.planEstudioService.checarCruceSemanal(this.espacioSelect.idEspaciosFisicos, this.lstHorario).subscribe(
            {
              next: data => {
                this.mostrarCrucesSemanal(data);
              },
              error: error => {
                this.appService.msgInfoDetail("error", "Espacio", "Error al verificar cruce semanal");
              },
              complete: () => {
                this.sweetAlert.panelWait.close();
              }
            }
          );
        }
        break;
      case 1:
        if (this.espacioFechaSelect === undefined || this.espacioFechaSelect === null) {
          this.appService.msgInfoDetail("warn", "Espacio", "No se ha seleccionado un espacio, por favor verifique");
        } else {
          this.sweetAlert.simpleAlert();
          this.planEstudioService.checarCruceFechas(this.espacioFechaSelect.idEspaciosFisicos, this.horarioFechasInput).subscribe(
            {
              next: data => {
                this.mostrarCruces(data);
              },
              error: error => {
                this.appService.msgInfoDetail("error", "Espacio", "Error al verificar cruce semanal");
              },
              complete: () => {
                this.sweetAlert.panelWait.close();
              }
            }
          );
        }
        break;
      case 2:
        if (this.espacioModuloSelect === undefined || this.espacioModuloSelect === null) {
          this.appService.msgInfoDetail("warn", "Espacio", "No se ha seleccionado un espacio, por favor verifique");
        } else {
          this.sweetAlert.simpleAlert();
          this.planEstudioService.checarCruceModulos(this.espacioModuloSelect.idEspaciosFisicos, this.horarioModulosInput).subscribe(
            {
              next: data => {
                this.mostrarCruces(data);
              },
              error: error => {
                this.appService.msgInfoDetail("error", "Espacio", "Error al verificar cruce modular");
              },
              complete: () => {
                this.sweetAlert.panelWait.close();
              }
            }
          );
        }
        break;
    }
  }

  mostrarCruces(data){
    try{
      if (Object.keys(data).length !== 0) {
        let resultArray = Object.keys(data);
        this.muestraCruces = JSON.parse(resultArray[0]);
        this.appService.msgInfoDetail("warn",
          "Espacio",
          "El espacio seleccionado se cruza con otro espacio, por favor verifique: " +
          this.muestraCruces.fecha + " | " + this.muestraCruces.horaI + " - " + this.muestraCruces.horaF);
        this.sidecruces = true;
      } else {
        this.appService.msgInfoDetail("info", "Espacio", "El espacio seleccionado no se cruza con otro espacio");
      }
    }catch (error) {
      this.appService.msgInfoDetail("error",
        "Verificación Cruces",
        "Ha ocurrido un inconveniente al verificar cruces, por favor intente nuevamente"+error);
    }
  }

  mostrarCrucesSemanal(data){
    try{
      this.muestraCrucesSemanal = new Array();
      if (Object.keys(data).length !== 0) {
        let resultArray = Object.keys(data);

        resultArray.forEach(element => {
          this.muestraCrucesSemanal.push(JSON.parse(element));
        });

        this.muestraCrucesSemanal.sort(function (a, b) {


          console.log(a.estadoLunesFranjaHorario);
          //FIXME: hay problema en tomar directo las fechas hay que reDefinirlas
          let timeAi = new Date(a.horarioiFranjaHorario).getTime();
          let timeAf = new Date(a.horariofFranjaHorario).getTime();
          let timeBi = new Date(b.horarioiFranjaHorario).getTime();
          let timeBf = new Date(b.horariofFranjaHorario).getTime();

          //sort by time
            if (timeAi === timeBi) {
              return timeAf - timeBf;
            } else {
              return timeAi - timeBi;
            }
        });
        this.sidecruces = true;
      } else {
        this.appService.msgInfoDetail("info", "Espacio", "El espacio seleccionado no se cruza con otro espacio");
      }
    }catch (error) {
      this.appService.msgInfoDetail("error",
        "Verificación Cruces",
        "Ha ocurrido un inconveniente al verificar cruces, por favor intente nuevamente"+error);
    }
  }

  guardar() {
    if (this.form.invalid) {
      this.appService.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
    }
  }

  setearForm() {
    this.form.reset();
  }

  cancelar() {
    this.appService.msgInfoDetail('info', '', 'Acción Cancelada')
    this.setearForm();
  }

}


