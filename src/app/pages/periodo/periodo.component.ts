import { Component, Input, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { FileUpload } from "primeng/fileupload";
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule } from "@angular/forms";
import { environment } from "../../../environments/environment";
import { AppService } from "@services/app.service";

import { PeriodoDto } from '@/dto/PeriodoDto';
import { DuracionPeriodoDto } from '@/dto/DuracionPeriodoDto';
import { EstadoPeriodoDto } from '@/dto/EstadoPeriodoDto';
import { ModalidadPeriodoDto } from '@/dto/ModalidadPeriodoDto';
import { TipoPeriodoDto } from '@/dto/TipoPeriodoDto';

import { PeriodoService } from '@services/periodos/periodo.service';
import { DuracionperiodoService } from '@services/periodos/duracionperiodo.service';
import { EstadoperiodoService } from '@services/periodos/estadoperiodo.service';
import { ModalidadperiodoService } from '@services/periodos/modalidadperiodo.service';
import { TipoperiodoService } from '@services/periodos/tipoperiodo.service';

@Component({
  selector: 'app-periodo',
  templateUrl: './periodo.component.html',
  styleUrls: ['./periodo.component.scss']
})
export class PeriodoComponent implements OnInit {
  @Input() periodoDto: PeriodoDto;
  @ViewChild('fileInput') fileInput: FileUpload;

  contentType: 'application/json'
  form: FormGroup;
  proceso: string = 'periodo';

  lstPeriodo: PeriodoDto[];
  lstEstadoPer: EstadoPeriodoDto[];
  lstDuracionPer: DuracionPeriodoDto[];
  lstModalidadPer: ModalidadPeriodoDto[];
  lstTipoPer: TipoPeriodoDto[];

  enedicion: boolean;

  //#region Variables de la vista
  SIZEFILE = `${environment.SIZEFILE}/`;
  ACCEPTFILES = `${environment.ACCEPTFILES}/`;
  URLFILEUPLOAD = `${environment.HOST}/files/upload/` + this.proceso;
  URLFILEUPLOADTOFIREBASE = `${environment.HOST}/files/uploadToFirebase`;

  uploadedFiles: any[] = [];

  /***
   * Constructor: se agregar los servicios ncesarios
   * **/
  constructor(public appService: AppService,
    public formBuilder: FormBuilder,
    public PeriodoService: PeriodoService,
    public DuracionPerServices: DuracionperiodoService,
    public EstadoPerServices: EstadoperiodoService,
    public ModalidadPerService: ModalidadperiodoService,
    public TipoPerService: TipoperiodoService,
    public formModule: FormsModule,
  ) { }

  /***
   * Constructir para inicializar antes del renderizado de la pagina
   * **/
  ngOnInit() {
    this.periodoDto = new PeriodoDto();
    this.crearForm();
    this.llenarPeriodo()
    this.llenarCombos();
  }

  /***
   * Metodos vinculados a componente principal
   * **/
  async llenarCombos() {
    await this.DuracionPerServices.getAll().subscribe(
      (data) => {
        this.lstDuracionPer = data;
      }
    );
    await this.EstadoPerServices.getAll().subscribe(
      (data) => {
        this.lstEstadoPer = data;
      }
    );
    await this.ModalidadPerService.getAll().subscribe(
      (data) => {
        this.lstModalidadPer = data;
      }
    )
    await this.TipoPerService.getAll().subscribe(
      (data) => {
        this.lstTipoPer = data;
      }
    )
  } 

  /**
   * 
   */

  async llenarPeriodo() {
    await this.PeriodoService.getAll().subscribe(
      (data) => {
        this.lstPeriodo = data;
      }
    )
  }

  //IMPRESION POR FILTRO EN TABLAS
  async setSeleccionado(item) {
    if (item !== null) {

      this.crearForm();
      this.periodoDto = item;

      this.form = this.formBuilder.group(this.periodoDto);

      // this.form.controls.idDuracionPeriodoDTO.setValue(this.lstDuracionPer
      //   .find(duracion => duracion.idDuracionPeriodo === this.periodoDto.idDuracionPeriodoDTO.idDuracionPeriodo));

      this.form.controls.idEstadoPeriodoDTO.setValue(this.lstEstadoPer
        .find(estado => estado.idEstadoPeriodo === this.periodoDto.idEstadoPeriodoNavigation.idEstadoPeriodo))

      this.form.controls.idModalidad2DTO.setValue(this.lstModalidadPer
        .find(modalidad => modalidad.idModalidad2 === this.periodoDto.idModalidadNavigation.idModalidad2))

      this.form.controls.idTipoPeriodoDTO.setValue(this.lstTipoPer
        .find(tipo => tipo.idTipoPeriodo === this.periodoDto.idTipoPeriodoNavigation.idTipoPeriodo))

      this.enedicion = true
    } else {
      this.setearForm();
    }
  }

  /**
   * Inicializa el formulario para el ingreso de la pagina y datos
   * **/
  crearForm() {
    this.form = new FormGroup({
      idPeriodo: new FormControl('',),
      codigoPeriodo: new FormControl('', Validators.required),
      codigoNumeroPeriodo: new FormControl('', Validators.required),
      codigoTextoPeriodo: new FormControl('', Validators.required),
      descripcionPeriodo: new FormControl('', Validators.required),
      fechaInicioPeriodo: new FormControl('', Validators.required),
      fechaFinPeriodo: new FormControl('', Validators.required),
      fechaRegistroPeriodo: new FormControl('',),
      fechaActualizaPeriodo: new FormControl('',),
      activoPeriodo: new FormControl('',),

      idDuracionPeriodoDTO: new FormControl(null,),
      idEstadoPeriodoDTO: new FormControl(null,),
      idModalidad2DTO: new FormControl(null,),
      idTipoPeriodoDTO: new FormControl(null,),
    });
  }

  /**
   * Métodos para funcionalidad de la pagina
   * **/
  guardar() {
    if (this.form.invalid) {
      this.appService.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.periodoDto = this.form.value;

      // console.log('DATA SAVE:::: ' + JSON.stringify(this.periodoDto))

      this.PeriodoService.saveObject(this.periodoDto).subscribe((data: any) => {
        if (!this.periodoDto.idPeriodo) {
          //this.loadReady = false
          this.appService.msgCreate();
        } else {
          //this.loadReady = false
          this.appService.msgUpdate();
        }

        this.setearForm();
      });
    }
  }

  setearForm() {
    this.form.reset();
    this.periodoDto = new PeriodoDto();
    this.llenarCombos();
    this.llenarPeriodo();
  }

  cancelar() {
    this.setearForm();
    this.appService.msgInfoDetail('info', '', 'Acción Cancelada')
  }
}
