import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

import { PlanificacionDto } from '@/dto/Planificacion';
import { PeriodoDto } from '@/dto/PeriodoDto';
import { FacultadDto } from "@/dto/FacultadDto";
import { CarreraDto } from "@/dto/CarreraDto";
import { PlanEstudioDto } from '@/dto/PlanEstudioDto';
import { ModalidadDto } from '@/dto/ModalidadDto';
import { MallaDto } from "@/dto/MallaDto";
import { ComponenteDto } from '@/dto/ComponenteDto';
import { EmpleadoDto } from '@/dto/EmpleadoDto';
import { InfraestructuraDto } from '@/dto/InfraestructuraDto';
import { NivelInfraestructuraDto } from '@/dto/NivelInfraestructuraDto';
import { EspaciosFisicosDto } from '@/dto/EspaciosFisicosDto';
import { ComponenteMateriaMallaDto } from '@/dto/ComponenteMateriaMallaDto';
import { ComponentePlanificacionDto } from '@/dto/ComponentePlanificacionDto';
import { MateriaPrincipalDto } from '@/dto/materia-principal-plan-dto';

import { ConfirmationService, SelectItem, LazyLoadEvent } from "primeng/api";
import { AppService } from "@services/app.service";
import { MessageService, PrimeIcons } from 'primeng/api';
// import {PeriodicidadPlanService} from "@services/planestudio/periodicidadplan.service";
// import {TipoPlanService} from "@services/planestudio/tipoplan.service";
import { PlanificacionService } from '@services/planestudio/planificacion.service';
import { PeriodoService } from '@services/periodos/periodo.service';
import { FacultadService } from "@services/institucioneducativa/facultad.service";
import { CarreraService } from "@services/institucioneducativa/carrera.service";
import { PlanEstudioService } from '@services/planestudio/planestudio.service';
import { ModalidadService } from '@services/mallas/modalidad.service';
import { MallaService } from "@services/mallas/malla.service";
import { ComponenteService } from '@services/componente/componente.service';
import { EmpleadoService } from '@services/empleado/empleado.service';
import { InfraestructuraService } from '@services/infraestructura/infraestructura.service';
import { NivelInfraestructuraService } from '@services/infraestructura/nivelinfraestructura.service';
import { EspacioService } from '@services/infraestructura/espacio.service';
import { MateriaComponenteService } from '@services/planestudio/materiacomponente.service';
import { MateriaPrincipalPlanService } from '@services/planestudio/materiaprincipalplan.service';

import { Table } from "primeng/table";

// import {HttpParams} from "@angular/common/http";
// import {PlanEstudioServiceEmiter} from "@pages/planestudio/PlanEstudioService";

@Component({
  selector: 'app-planificacion',
  templateUrl: './planificacion.component.html',
  styleUrls: ['./planificacion.component.scss']
})
export class PlanificacionComponent implements OnInit {

  // materiaPrincipal: MateriaPrincipalDto = new MateriaPrincipalDto();

  periodo: PeriodoDto;
  facultad: any;
  carrera: any;
  planEstudio: any;
  modalidad: any;
  materia: any;
  componente: any;
  empleado: any;
  infraestructura: any;
  nivelInfra: any;
  espacio: any;
  componentePlan: any;

  codMateriaSelected: any;
  nomMateriaSelected: any;
  credMateriaSelected: any;
  horaMateriaSelected: any;

  nomDocenteSelected: any;
  cedDocenteSelected:any;

  planificacion: PlanificacionDto;

  listPerido: PeriodoDto[];
  listFacultad: FacultadDto[];
  listCarrera: CarreraDto[];
  listPlanEstudio: PlanEstudioDto[];
  listModalidadPe: ModalidadDto[];
  @Input() listMalla: MallaDto[];
  selectedMalla: MallaDto[];
  listComponenteMate: ComponenteMateriaMallaDto[];
  selectedComponenteMat: ComponenteMateriaMallaDto[];
  listComponente: ComponenteDto[];
  @Input() listEmpleado: EmpleadoDto[];
  selectedEmpleado: EmpleadoDto[]
  listInfraestructura: InfraestructuraDto[];
  listNivelInfra: NivelInfraestructuraDto[];
  listEspacio: EspaciosFisicosDto[];
  @Input() listComponentePlan: ComponentePlanificacionDto[];
  selectedCompPlan: ComponentePlanificacionDto[]


  sortOptions: SelectItem[];
  sortOrder: number;
  sortField: string;
  sortKey: string;
  index = 0;
  loading: boolean;
  cols: any[];
  exportColumns: any[];

  form: FormGroup;
  sections: any[];
  visibleAsig: boolean;
  visibleDoc: boolean;
  update: boolean;

  /***
   * Constructor: se agregar los servicios ncesarios
   * **/
  constructor(public appService: AppService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public periodoService: PeriodoService,
    public facultadService: FacultadService,
    public carreraService: CarreraService,
    public planEstudioService: PlanEstudioService,
    public modalidadService: ModalidadService,
    public componenteService: ComponenteService,
    private mallaService: MallaService,
    private empleadoService: EmpleadoService,
    public infraestructuraService: InfraestructuraService,
    public nivelInfraService: NivelInfraestructuraService,
    public espacioService: EspacioService,
    public planificacionService: PlanificacionService,
    public materiacomponenteservice: MateriaComponenteService,
    public materiaService: MateriaPrincipalPlanService,
    public formBuilder: FormBuilder
  ) {
  }

  /***
   * Constructir para inicializar antes del renderizado de la pagina
   * **/
  ngOnInit(): void {
    this.planificacion = new PlanificacionDto();
    this.llenarSecciones();
    this.llenarCombos(0);
    this.construirTabla();
    this.crearForm();
    this.update = false;
    this.sortOptions = [
      { label: 'Nombre A-Z', value: 'nombreMateriap' },
      { label: 'Nombre Z-A', value: '!nombreMateriap' }
    ];
  }

  llenarSecciones() {
    this.sections = [
      {
        index: 1,
        header: 'Periodo',
        subheader: '',
        icon: 'far fa-calendar',
        color: '#b02767'
      },
      {
        index: 2,
        header: 'Datos Generales',
        subheader: '',
        icon: 'fa fa-building',
        color: '#9C27B0'
      },
    ]
  }

  llenarSeccionShowPLanificadas(){
    this.sections = [
      {
        index: 1,
        header: 'Periodo',
        subheader: '',
        icon: 'far fa-calendar',
        color: '#b02767'
      },
      {
        index: 2,
        header: 'Datos Generales',
        subheader: '',
        icon: 'fa fa-building',
        color: '#9C27B0'
      },
      {
        index: 5,
        header: 'Materias Ya Planificadas',
        subheader: '',
        icon: 'fas fa-database',
        color: '#673AB7'
      }
    ]
  }

  llenarSeccionNewPlanificacion() {
    this.sections = [
      {
        index: 1,
        header: 'Periodo',
        subheader: '',
        icon: 'far fa-calendar',
        color: '#b02767'
      },
      {
        index: 2,
        header: 'Datos Generales',
        subheader: '',
        icon: 'fa fa-building',
        color: '#9C27B0'
      },
      {
        index: 3,
        header: 'Asignatura',
        subheader: '',
        icon: 'fa fa-book',
        color: '#673AB7'
      },
      {
        index: 4,
        header: '',
        subheader: ' ',
        icon: 'fa fa-address-card',
        color: '#FF9800'
      },
    ]
  }

  showAsignatura() {
    if (this.planEstudio != null || this.modalidad != null) {
      this.visibleAsig = true;
      this.mallaService.GetByIdPlanEstudio(this.planEstudio.codigoPlanEstudioMalla, this.modalidad.idModalidadPe).subscribe(data => {
        this.listMalla = data;
        // console.log('TABLE MALLA::: ', data)
      })
    } else {
      this.appService.msgInfoDetail('warn', '', 'DEBE DE LLENAR DATOS GENERALES PRIMERO')
    }

  }

  showDocente() {
    this.visibleDoc = true;
    this.empleadoService.getAll().subscribe(data => {
      this.listEmpleado = data;
      // console.log('TABLE DOCENTE:: ', data)
    })
  }

  llenarCombos(opcion) {
    this.periodoService.getAll().subscribe(data => {
      this.listPerido = data;
    })

    this.facultadService.getAll().subscribe(data => {
      this.listFacultad = data;
    });

    this.infraestructuraService.getAll().subscribe(data => {
      this.listInfraestructura = data;
    })
    if(opcion == 1){
      // this.carreraService.getAll().subscribe(data => {
      //   this.listCarrera = data;
      // })

      // this.planEstudioService.getAll().subscribe(data => {
      //   this.listPlanEstudio = data;
      // })

      // this.modalidadService.getAll().subscribe(data => {
      //   this.listModalidadPe = data;
      // })

      // this.componenteService.getAll().subscribe(data => {
      //   this.listComponente = data;
      // })

      this.empleadoService.getAll().subscribe(data =>{
        this.listEmpleado = data;
      })

      this.nivelInfraService.getAll().subscribe(data =>{
        this.listNivelInfra = data;
      })

      this.espacioService.getAll().subscribe(data =>{
        this.espacio = data;
      })
    }
  }

  llenarDetalleFacultad(event) {
    try {
      // console.log('IDFACULTAD::: ' + this.facultad.idFacultad)
      this.carreraService.findByFacultad(this.facultad.idFacultad).subscribe(data => {
        this.listCarrera = data;

        this.listPlanEstudio = new Array();
        this.listModalidadPe = new Array();

        this.carrera = null;
        this.planEstudio = null;
        this.modalidad = null;
      })
    } catch (error) {
      console.log('ERROR FACULTAD' + error);
      this.listCarrera = new Array();
      this.listPlanEstudio = new Array();
      this.listModalidadPe = new Array();
      this.facultad = null;
      this.carrera = null;
      this.planEstudio = null;
      this.modalidad = null;
    }
  }

  llenarDetalleCarrera(event) {
    try {
      // console.log('IDCARRERA:: ' + this.carrera.idCarrera)
      this.planEstudioService.findByCarrera(this.carrera.idCarrera).subscribe(data => {
        this.listPlanEstudio = data;

        this.listModalidadPe = new Array();
        this.planEstudio = null;
        this.modalidad = null;
      });
    } catch (e) {
      console.log('ERROR CARRERA ' + e);
      this.listPlanEstudio = new Array();
      this.listModalidadPe = new Array();
      this.carrera = null;
      this.planEstudio = null;
      this.modalidad = null;
    }
  }

  llenarDetallePlanEstudio(event) {
    try {
      // console.log('IDPLAN:: ' + JSON.stringify( this.planEstudio))
      this.modalidadService.getById(this.planEstudio.idModalidadPe).subscribe(data => {
        this.listModalidadPe = [data];
        this.modalidad = null;
      })
    } catch (e) {
      this.listModalidadPe = new Array();
      this.planEstudio = null;
      this.modalidad = null;

    }
  }

  eventoModalidad(event){
    try {
      // console.log('periodo:: ' + this.periodo.idPeriodo)
      // console.log('planestudios:: ' + this.planEstudio.idPlanEstudio)
      // console.log('modalidad:: ' + this.modalidad.idModalidadPe)
      this.llenarSeccionShowPLanificadas();
      this.planificacionService.getAllMateriasPlanificadas(this.periodo.idPeriodo, this.planEstudio.idPlanEstudio, 1).subscribe(data => {
        // console.log('DATA OBTENIDA:::: ', data)
        this.listComponentePlan = data;
      })
    } catch (e) {
      console.log(e)
    }
  }

  //INFRAESTRUCTURA
  llenarDetalleInfra(event) {
    try {
      // console.log('IDINFRA::: ' + this.infraestructura.idInfraestructura)
      this.nivelInfraService.getByIdInfraestructura(this.infraestructura.idInfraestructura).subscribe(data => {
        this.listNivelInfra = data;

        this.listEspacio = new Array();
        this.nivelInfra = null;
        this.espacio = null;

      })
    } catch (e) {
      console.log('ERROR INFRAESTRUCTURA ' + e);
      this.listNivelInfra = new Array();
      this.listEspacio = new Array();
      this.infraestructura = null;
      this.nivelInfra = null;
      this.espacio = null;
    }
  }

  llenarDetalleNivelInfra(event) {
    try {
      this.espacioService.getByIdNivel(this.nivelInfra.idNivelInfraestructura).subscribe(data => {
        this.listEspacio = data;
        this.espacio = null;
      })
    } catch (e) {
      console.log('ERROR NIVEL INFRA ' + e);
      this.listEspacio = new Array();
      this.nivelInfra = null;
      this.espacio = null;
    }
  }

  crearForm(){
    this.form = new FormGroup({
      iD_PLANIFICACION: new FormControl('', ),
      codigoMateria: new FormControl('', ),
      nombreMateria: new FormControl('',),
      creditosMateria: new FormControl('',),
      horasSemestralesMateria: new FormControl('',),
      idComponente: new FormControl('',),
      paralelo: new FormControl('', Validators.required),
      cupo: new FormControl('',Validators.required),
      nombresEmp: new FormControl('',),
      dniProfesorc: new FormControl('',),
      idEspaciosFisicos: new FormControl('',),
    })
  }

  async guardar() {
    if(this.form.invalid){
      this.appService.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
    } else {
      this.planificacion = new PlanificacionDto();
      
      this.planificacion.iD_MALLA = this.materia.idMalla;
      this.planificacion.iD_MATERIA = this.materia.idMateria;
      this.planificacion.iD_NIVEL_ESTUDIO = this.materia.idNivelEstudio;
      this.planificacion.iD_PLAN_ESTUDIO = this.materia.idPlanEstudio;
      this.planificacion.iD_PERIODO = this.periodo.idPeriodo.toString();
      this.planificacion.iD_PERIODICIDAD = this.periodo.idPeriodicidad;
      this.planificacion.iD_TIPO_PERIODO = this.periodo.idTipoPeriodo;
      this.planificacion.iD_MODALIDAD = this.periodo.idModalidad;
      this.planificacion.iD_ESTADO_PERIODO = this.periodo.idEstadoPeriodo;
      this.planificacion.iD_MODALIDAD_PLANIFICACION = "1";
      this.planificacion.iD_PERIODICIDAD_PLANIFICACION = "4";
      this.planificacion.dnI_PROFESORC = this.form.get('dniProfesorc').value;
      this.planificacion.iD_TIPO_COMPONENTE = this.componente.idSubtipoComponente;
      this.planificacion.paralelo = this.form.get('paralelo').value;
      this.planificacion.iD_ESPACIOS_FISICOS = this.form.get('idEspaciosFisicos').value;
      this.planificacion.cupo = this.form.get('cupo').value;

      if (this.update == false) {
        console.log('DATOS A ENVIAR NUEVO::: ' + JSON.stringify(this.planificacion))
        // this.planificacionService.saveObject(this.planificacion).subscribe((data: any) => {
        //   console.log(data)
        //   this.appService.msgInfoDetail('success', 'GUARDADO', 'Datos Guardados Correctamente');
        //   this.setearSave();
        // })
      } else {
        this.planificacion.iD_PLANIFICACION = this.form.get('iD_PLANIFICACION').value;

        console.log('DATOS A ENVIAR UPDATE::: ' + JSON.stringify(this.planificacion))
        // this.planificacionService.editObject(this.planificacion).subscribe((data: any) => {
        //   console.log(data);
        //   this.appService.msgInfoDetail('warn', 'ACTUALIZADOS', 'Datos Actualizados Correctamente');
        //   this.setearSave();
        // })
      }
      
    }

  }

  cancelar() {
    this.setearForm();
    this.appService.msgInfoDetail('info', '', 'Acción Cancelada')
  }

  setearForm() {
    this.form.reset();

    this.listPerido = new Array();
    this.listFacultad = new Array();
    this.listCarrera = new Array();
    this.listPlanEstudio = new Array();
    this.listModalidadPe = new Array();
    this.listMalla = new Array();
    this.listComponente = new Array();
    this.listInfraestructura = new Array();
    this.listNivelInfra = new Array();
    this.listEspacio = new Array();

    this.periodo = null;
    this.facultad = null;
    this.carrera = null;
    this.planEstudio = null;
    this.modalidad = null;
    this.componente = null;
    this.infraestructura = null;
    this.nivelInfra = null;
    this.espacio = null;
    this.materia = null;
    this.empleado = null;
    this.codMateriaSelected = null;
    this.nomMateriaSelected = null;
    this.credMateriaSelected = null;
    this.horaMateriaSelected = null;
    this.nomDocenteSelected = null;
    this.cedDocenteSelected = null;
    this.update = false;

    this.llenarCombos(0);
    this.llenarSecciones();
  }

  setearSave() {
    this.listMalla = new Array();
    this.listComponente = new Array();
    this.listInfraestructura = new Array();
    this.listNivelInfra = new Array();
    this.listEspacio = new Array();

    this.componente = null;
    this.infraestructura = null;
    this.nivelInfra = null;
    this.espacio = null;
    this.materia = null;
    this.empleado = null;
    this.codMateriaSelected = null;
    this.nomMateriaSelected = null;
    this.credMateriaSelected = null;
    this.horaMateriaSelected = null;
    this.nomDocenteSelected = null;
    this.cedDocenteSelected = null;
    this.update = false;

    this.llenarSeccionShowPLanificadas();
  }

  // TABLA DE MALLA Y MATERIA
  clear(table: Table) {
    table.clear();
  }


  onRowSelect(event) {
    this.materia = event.data
    this.codMateriaSelected = event.data.codigoMateria;
    this.nomMateriaSelected = event.data.nombreMateria;
    this.credMateriaSelected = event.data.creditosMateria;
    this.horaMateriaSelected = event.data.horasSemestralesMateria;
    
    this.materiacomponenteservice.getComponenteSinPlanificar(this.planEstudio.idPlanEstudio, this.materia.idMateria, this.periodo.idPeriodo).subscribe(data => {
      this.listComponente = data
      this.componente = null;
    })
    this.messageService.add({ severity: 'info', summary: 'Materia Seleccionada', detail: event.data.nombreMateria });
    this.visibleAsig = false;
  }

  onRowSelectShowPlan(event){
    this.llenarSeccionNewPlanificacion();
    // console.log(event.data)
    this.update = true;

    this.listComponente = new Array();
    this.componente = null;

    this.espacioService.getByCodigo(event.data.codigO_ESPACIOS_FISICOS).subscribe(data1 =>{
      this.listEspacio = data1;
      this.espacio = this.listEspacio[0];
      console.log('ESPACIO::: ' + JSON.stringify(this.espacio))
      this.nivelInfraService.getById(this.espacio.idNivelInfraestructura).subscribe(data2 => {
        // this.listNivelInfra = data2;
        this.nivelInfra = data2;
        console.log('NIVEL::: ' + JSON.stringify(this.nivelInfra))
        this.infraestructuraService.getById(this.nivelInfra.idInfraestructura).subscribe(data3 => {
          // this.listInfraestructura = data3;
          this.infraestructura = data3;
        })
      })
    })

    this.empleadoService.getByDni(event.data.dnI_PROFESORC).subscribe(data => {
      this.listEmpleado = data;
      this.empleado = this.listEmpleado[0];
      this.nomDocenteSelected = this.empleado.nombresEmp;
      this.cedDocenteSelected = this.empleado.dniEmp;
    })

    this.llenarCombos(1);
    this.codMateriaSelected = event.data.codigO_MATERIA;
    this.nomMateriaSelected = event.data.nombrE_MATERIA;
    this.credMateriaSelected = event.data.creditoS_MATERIA;
    this.horaMateriaSelected = event.data.horaS_SEMESTRALES_MATERIA;

    this.form.controls['paralelo'].setValue(event.data.paralelo);
    this.form.controls['cupo'].setValue(event.data.cupo);
    this.form.controls['iD_PLANIFICACION'].setValue(event.data.iD_PLANIFICACION)

    this.materiacomponenteservice.getComponenteSinPlanificar(event.data.iD_PLAN_ESTUDIO, event.data.iD_MATERIA, event.data.iD_PERIODO).subscribe(data => {
      this.listComponente = data
      // console.log('COMPONENTE::: ' + JSON.stringify(this.listComponente))
      this.componente = this.listComponente[0];
    })

    this.materiaService.getById(event.data.iD_MATERIA).subscribe(data => {
      // this.listMalla = data;
      this.materia = data;
    })
  }

  onRowUnselect(event) {
    this.messageService.add({ severity: 'info', summary: 'Product Unselected', detail: event.data.nombreMateria });
  }

  construirTabla() {
    this.cols = [
      { field: 'IdMalla', header: 'ID' },
      { field: 'IdMateria', header: 'Id Materia' },
      { field: 'IdNivelEstudio', header: 'Id Nivel Estudio' },
      { field: 'IdPlanEstudio', header: 'Id Plan de Estudio' },
      { field: 'OrdenMalla', header: 'Orden Malla' },
      { field: 'FecharegMalla', header: 'Fecha Registro' },
      { field: 'UsuarioregMalla', header: 'Usuario Registro' },
      { field: 'UsuarioactMalla', header: 'Usuario Activo' },
      { field: 'UsuarioelimMalla', header: 'Usuario Eliminado' },
      { field: 'ActivoMalla', header: 'Activo' },
      { field: 'ObservacionMalla', header: 'Observacion' },
      { field: 'IdMateriaNavigation', header: 'Id Materia Nav' },
    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    this.loading = false;
  }

  //TABLA DE PROFESOR
  onRowSelectDocente(event){
    this.empleado = event.data;
    this.nomDocenteSelected = event.data.nombresEmp;
    this.cedDocenteSelected = event.data.dniEmp;
    this.appService.msgInfoDetail('info', 'DOCENTE SELECCIONADO', event.data.nombresEmp)
    this.visibleDoc = false
    console.log(event.data)
  }

  nuevaPlanificacion(){
    this.llenarSeccionNewPlanificacion();
  }

}
