import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { AppService } from "@services/app.service";
import { ModalidadMallaDto } from '@/dto/ModalidadMallaDto';
import { EstadoModmallaDto } from '@/dto/EstadoModmallaDto';
import { MallaDto } from '@/dto/MallaDto';
import { ModalidadDto } from '@/dto/ModalidadDto';
import { PeriodoDto } from '@/dto/PeriodoDto';

import { ModalidadMallaService } from '@services/mallas/modalidadmalla.service';
import { EstadoModalidadMallaService } from '@services/mallas/estadomodalidadmalla.service';
import { MallaService } from '@services/mallas/malla.service';
import { ModalidadService } from '@services/mallas/modalidad.service';
import { PeriodoService } from '@services/periodos/periodo.service';

@Component({
  selector: 'app-modalidadmalla',
  templateUrl: './modalidadmalla.component.html',
  styleUrls: ['./modalidadmalla.component.scss']
})
export class ModalidadmallaComponent implements OnInit {
  @Input() modMallaDto: ModalidadMallaDto;

  form: FormGroup;
  proceso: string = 'modalidad-malla'

  modMalla: any;

  lstModMalla: ModalidadMallaDto[]
  lstEstadoModMalla: EstadoModmallaDto[]
  lstMalla: MallaDto[]
  lstModalidad: ModalidadDto[]
  lstPeriodo: PeriodoDto[]

  enedicion: boolean;

  //#region Variables de la vista
  SIZEFILE = `${environment.SIZEFILE}/`;
  ACCEPTFILES = `${environment.ACCEPTFILES}/`;
  URLFILEUPLOAD = `${environment.HOST}/files/upload/` + this.proceso;
  URLFILEUPLOADTOFIREBASE = `${environment.HOST}/files/uploadToFirebase`;

  constructor(
    public appServices: AppService,
    public EstadoModMallaService: EstadoModalidadMallaService,
    public MallaService: MallaService,
    public ModalidadService: ModalidadService,
    public PeriodoService: PeriodoService,
    public ModMallaService: ModalidadMallaService,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.llenarCombos();
    this.llenarModMalla()
    this.crearForm();
  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.modMallaDto = item;
      this.form = this.formBuilder.group(this.modMallaDto)

      //console.log('DATA SELECT:::' + JSON.stringify(this.modMallaDto))

      this.form.controls.idEstadoModmallaDTO.setValue(this.lstEstadoModMalla
        .find(estado => estado.idEstadoModmalla === this.modMallaDto.idEstadoModmallaDTO.idEstadoModmalla))

      this.form.controls.idMallaDTO.setValue(this.lstMalla
        .find(malla=> malla.idMalla === this.modMallaDto.idMallaDTO.idMalla))

      this.form.controls.idModalidadDTO.setValue(this.lstModalidad
        .find(modalidad => modalidad.idModalidadPe === this.modMallaDto.idModalidadDTO.idModalidadPe))

      this.form.controls.idPeriodoDTO.setValue(this.lstPeriodo
        .find(periodo => periodo.idPeriodo === this.modMallaDto.idPeriodoDTO.idPeriodo))

      this.enedicion = true;
    } else {
      this.setearForm()
    }
  }

  crearForm() {
    this.form = new FormGroup({
      idModalidadMalla: new FormControl('',),
      nombreModalidadMalla: new FormControl('', Validators.required),
      descripcionModalidadMalla: new FormControl('', Validators.required),
      activoModalidadMalla: new FormControl('',),

      idEstadoModmallaDTO: new FormControl('',),
      idMallaDTO: new FormControl('',),
      idModalidadDTO: new FormControl('',),
      idPeriodoDTO: new FormControl('',),
    });
  }

  llenarCombos() {
    this.EstadoModMallaService.getAll().subscribe(
      data => {
        this.lstEstadoModMalla = data
      }
    )
    this.MallaService.getAll().subscribe(
      data => {
        this.lstMalla = data
      }
    )
    this.ModalidadService.getAll().subscribe(
      data => {
        this.lstModalidad = data
      }
    )
    this.PeriodoService.getAll().subscribe(
      data => {
        this.lstPeriodo = data
      }
    )
  }

  llenarModMalla() {
    this.ModMallaService.getAll().subscribe(
      data => {
        this.lstModMalla = data
      }
    )
  }

  /**
   * INVESTIGAR PORQ EL INGRESO EN LA BDD AUMENTO EXPONENCIALMENTE A 1000 REGISTROS
   */
  async guardar() {
    if (this.form.invalid) {
      this.appServices.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.modMallaDto = this.form.value;

      //console.log('DATA SAVE ANTES::: ' + JSON.stringify(this.modMallaDto))

      //this.modMallaDto.idModalidadMallaDTO.horasModalidadMallaListDTO = []
      //console.log('DATA SAVE  DESPUES:::' + JSON.stringify(this.modMallaDto))

      this.ModMallaService.saveObject(this.modMallaDto).subscribe((data: any) => {
        if (!this.modMallaDto.idModalidadMalla) {
          this.appServices.msgCreate();
        } else {
          this.appServices.msgUpdate();
        }
        this.setearForm();
      });
    }
  }

  setearForm() {
    this.form.reset();
    this.modMallaDto = new ModalidadMallaDto();
    this.llenarCombos();
    this.llenarModMalla();
  }

  cancelar() {
    this.setearForm();
    this.appServices.msgInfoDetail('info', '', 'Acción Cancelada')
  }

}
