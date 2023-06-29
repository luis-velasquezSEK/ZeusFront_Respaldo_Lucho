import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppService} from "@services/app.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EstadoPlanEstudioDTO} from "@/dto/estado-plan-dto";
import {EstadoPlanService} from "@services/planestudio/estadoplan.service";
import {PeriodicidadPlanEstudioDTO} from "@/dto/periodicidad-plan-dto";
import {PeriodicidadPlanService} from "@services/planestudio/periodicidadplan.service";
import {TipoPlanEstudioDTO} from "@/dto/tipo-plan";
import {TipoPlanService} from "@services/planestudio/tipoplan.service";
import {MateriaPrincipalDto} from "@/dto/materia-principal-plan-dto";
import {ComponenteDto} from "@/dto/ComponenteDto";
import {FranjaHorarioDto} from "@/dto/FranjaHorarioDto";
import {MateriasSelectDto} from "@/dto/MateriasSelectDto";
import {CorrequisitoDto} from "@/dto/CorrequisitoDto";
import {PrerrequisitosPlanEstudioDto} from "@/dto/PrerrequisitosPlanEstudioDto";
import {PlanEstudioServiceEmiter} from "@pages/planestudio/PlanEstudioService";
import {EspaciosFisicosDto} from "@/dto/EspaciosFisicosDto";
import {FechasHorarioDto} from "@/dto/FechasHorarioDto";
import {FechaFechasHorarioDto} from "@/dto/FechaFechasHorarioDto";
import {ModuloFechasHorarioDto} from "@/dto/ModuloFechasHorarioDto";
import {FileService} from "@services/utils/file.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-planestudio',
  templateUrl: './planestudio.component.html',
  styleUrls: ['./planestudio.component.scss']
})
export class PlanestudioComponent implements OnInit {

  imageURL: string = "http://i.pravatar.cc/500?img=7";

  /***
   * variables globales, @Input para enlaces de componentes
   * * */
  materiaInput: MateriaPrincipalDto = new MateriaPrincipalDto();
  componenteInput: ComponenteDto[] = new Array();
  correquisitoInput: CorrequisitoDto[] = new Array();
  prerrequisitoInput: PrerrequisitosPlanEstudioDto[] = new Array();
  compartidaInput: MateriasSelectDto[] = new Array();
  equivalenteInput: MateriasSelectDto[] = new Array();
  horarioInput: FranjaHorarioDto[] = new Array();
  horarioModuloInput: ModuloFechasHorarioDto[] = new Array();
  horarioFechasInput: FechaFechasHorarioDto[] = new Array();


  espacioInput: EspaciosFisicosDto;
  tipoHorario: string = 'Semanal';
  fechaHorarios: Date;
  fechaInicialModular: Date;
  fechaFinalModular: Date;

  form: FormGroup;

  estadoPlan: EstadoPlanEstudioDTO;
  periodicidadPlan: PeriodicidadPlanEstudioDTO;
  tipoPlan: TipoPlanEstudioDTO;
  materiaPrincipal: MateriaPrincipalDto = new MateriaPrincipalDto();

  lstTipoPlan: TipoPlanEstudioDTO[];
  lstPeriodicidadPlan: PeriodicidadPlanEstudioDTO[];
  lstEstadoPlan: EstadoPlanEstudioDTO[];
  classModular: string;
  classFi: string;
  classFf: string;

  numeroHorarios: number = 0;

  /***
   * Constructor: se agregar los servicios ncesarios
   * **/
  constructor(public appService: AppService,
              public planEstudioService: PlanEstudioServiceEmiter,
              public formBuilder: FormBuilder,
              public periodicidadplanservice: PeriodicidadPlanService,
              public tipoplanservice: TipoPlanService,
              public estadoplanservice: EstadoPlanService,
              private uploadService: FileService) {
  }


  /***
   * Constructir para inicializar antes del renderizado de la pagina
   * **/
  ngOnInit(): void {

    this.crearForm();
    this.llenarCombosSeccion();
    this.getDataFromEmiters();
    this.setClassIconoHorarioInicial();
    this.setClassIconoHorarioFinal();
    this.setClassIconoModular();
  }

  setClassIconoModular() {
    if (this.fechaHorarios === null || this.fechaHorarios === undefined) {
      this.classModular = '0';
    } else {
      this.classModular = '1';
    }
  }

  setClassIconoHorarioInicial() {
    if (this.fechaInicialModular === null || this.fechaInicialModular === undefined) {
      this.classFi = '0';
    } else {
      this.classFi = '1';
    }
  }

  setClassIconoHorarioFinal() {
    if (this.fechaFinalModular === null || this.fechaFinalModular === undefined) {
      this.classFf = '0';
    } else {
      this.classFf = '1';
    }
  }

  getDataFromEmiters() {
    this.planEstudioService.componenteInput.subscribe(item => {
      this.componenteInput = item;
    });

    this.planEstudioService.materiaInput.subscribe(item => {
      this.materiaInput = item;
    });

    this.planEstudioService.correquisitoInput.subscribe(item => {
      this.correquisitoInput = item;
    });

    this.planEstudioService.prerrequisitoInput.subscribe(item => {
      this.prerrequisitoInput = item;
    });

    this.planEstudioService.compartidaInput.subscribe(item => {
      this.compartidaInput = item;
    });

    this.planEstudioService.equivalentenput.subscribe(item => {
      this.equivalenteInput = item;
    });

    this.planEstudioService.tipoHorario.subscribe(item => {
      this.espacioInput = undefined;
      if (item === 0) {
        this.tipoHorario = 'Semanal';
        this.planEstudioService.espacioInput.subscribe(espacio => {
          this.espacioInput = espacio;
        });
        this.planEstudioService.horarioSemanalInput.subscribe(item => {
          this.horarioInput = item;
          this.numeroHorarios = this.horarioInput.length;
        }, error => {
          console.log('error en suscribe horarioSemanalInput plan estudio default: ' + JSON.stringify(error));
        });
      } else if (item === 1) {
        this.tipoHorario = 'Fechas';
        this.planEstudioService.espacioFechasInput.subscribe(espacio => {
          this.espacioInput = espacio;
        });
        this.planEstudioService.horarioFechasInputSelect.subscribe(item => {
          this.horarioFechasInput = item;
          this.numeroHorarios = 0;
          this.numeroHorarios = this.horarioFechasInput.length;

        }, error => {
          console.log('error en suscribe horarioFechasInput plan estudio default: ' + JSON.stringify(error));
        });
      } else if (item === 2) {
        this.tipoHorario = 'Modular';
        this.planEstudioService.espacioModuloInput.subscribe(espacio => {
          this.espacioInput = espacio;
        });
        this.planEstudioService.horarioModularInputSelect.subscribe(item => {
          this.horarioModuloInput = item;
          this.numeroHorarios = 0;
          this.numeroHorarios = this.horarioModuloInput.length;
        }, error => {
          console.log('error en suscribe horarioModularInput plan estudio default: ' + JSON.stringify(error));
        });
      }
    });

    this.planEstudioService.fechaHorarios.subscribe(item => {
      this.fechaHorarios = item;
      this.setClassIconoModular();
    });

    this.planEstudioService.fechaInicialModular.subscribe(item => {
      this.fechaInicialModular = item;
      this.setClassIconoHorarioInicial();
    });

    this.planEstudioService.fechaFinalModular.subscribe(item => {
      this.fechaFinalModular = item;
      this.setClassIconoHorarioFinal();
    });
  }

  llenarCombosSeccion() {
    this.estadoplanservice.getAll().subscribe(data => {
      this.lstEstadoPlan = data;
    });
    this.tipoplanservice.getAll().subscribe(data => {
      this.lstTipoPlan = data;
    });
    this.periodicidadplanservice.getAll().subscribe(data => {
      this.lstPeriodicidadPlan = data;
    });
  }


  showPreview(event) {
    let file = (event.target as HTMLInputElement).files[0];

    this.form.patchValue({
      avatar: file
    });
    this.form.get('avatar').updateValueAndValidity()
    const reader = new FileReader();
    reader.onload = () =>
      this.imageURL = reader.result as string;
    reader.readAsDataURL(file)
  }

  submit() {
    this.uploadService.uploadSingleFile(this.form.get('avatar').value, "empleado", "avatar-.png")
      .subscribe(event => {
        console.log(event.type);
      });
    console.log(this.form.value)
  }


  crearForm() {
    this.form = new FormGroup({
      avatar: new FormControl(null),
      idTipoPe: new FormControl('',),
      nombreTipoPe: new FormControl('', Validators.required),
      observacionTipoPe: new FormControl('', Validators.required),
      paraleloPe: new FormControl('', Validators.required),
      activoTipoPe: new FormControl('',),
    });
    //this.form = this.formBuilder.group(this.tipoPlan);
  }

  /**
   * Métodos para funcionalidad de la pagina
   * **/
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

  /***
   * Recepcion de emisores
   * **/
  setMateriaPrincipal(item) {
    if (item !== null) {
      this.materiaInput = item;
    } else {
      this.setearForm();
    }
  }

  setComponentes(item) {
    if (item !== null) {
      this.componenteInput = item;
    } else {
      this.setearForm();
    }
  }
}
