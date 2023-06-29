import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { AppService } from "@services/app.service";
import { NivelEstudioDto } from '@/dto/NivelEstudioDto';
import { ModalidadMallaDto } from '@/dto/ModalidadMallaDto';

import { NivelesEstudioService } from '@services/planestudio/nivelesestudio.service';
import { ModalidadMallaService } from '@services/mallas/modalidadmalla.service';
import { Observable } from "rxjs";

@Component({
  selector: 'app-nivelestudio',
  templateUrl: './nivelestudio.component.html',
  styleUrls: ['./nivelestudio.component.scss']
})
export class NivelestudioComponent implements OnInit {
  @Input() nivelEstudioDto: NivelEstudioDto;

  form: FormGroup;
  proceso: string = 'nivel-estudio'

  nivelEstudio: any;

  lstNivelEstudio: NivelEstudioDto[]
  lstModMalla: ModalidadMallaDto[]

  enedicion: boolean;

  //#region Variables de la vista
  SIZEFILE = `${environment.SIZEFILE}/`;
  ACCEPTFILES = `${environment.ACCEPTFILES}/`;
  URLFILEUPLOAD = `${environment.HOST}/files/upload/` + this.proceso;
  URLFILEUPLOADTOFIREBASE = `${environment.HOST}/files/uploadToFirebase`;

  constructor(
    public appServices: AppService,
    public NivelEstudioService: NivelesEstudioService,
    public ModMallaService: ModalidadMallaService,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.llenarCombos();
    this.llenarNivelEstudio()
    this.crearForm();
  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.nivelEstudioDto = item;
      this.form = this.formBuilder.group(this.nivelEstudioDto)

      // console.log('DATA SELECT:::' + JSON.stringify(this.nivelEstudioDto))

      this.form.controls.idModalidadMallaDTO.setValue(this.lstModMalla
        .find(tipo => tipo.idModalidadMalla === this.nivelEstudioDto.idModalidadMallaDTO.idModalidadMalla))

      this.enedicion = true;
    } else {
      this.setearForm()
    }
  }

  crearForm() {
    this.form = new FormGroup({
      idNivelEstudio: new FormControl('',),
      codigoNivelEstudio: new FormControl('', Validators.required),
      nombreNivelEstudio: new FormControl('', Validators.required),
      descripcionNivelEstudio: new FormControl('', Validators.required),
      activoNivelEstudio: new FormControl('',),

      idModalidadMallaDTO: new FormControl(null,),
    });
  }

  llenarCombos() {
    //this.lstModMalla = this.ModMallaService.getAll()
    this.ModMallaService.getAll().subscribe(
      data => {
        this.lstModMalla = data
      }
    )
  }

  llenarNivelEstudio() {
    //this.lstNivelEstudio = this.NivelEstudioService.getAll()
    this.NivelEstudioService.getAll().subscribe(
      data => {
        this.lstNivelEstudio = data
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
      this.nivelEstudioDto = this.form.value;

      //console.log('DATA SAVE ANTES::: ' + JSON.stringify(this.nivelEstudioDto))

      this.nivelEstudioDto.idModalidadMallaDTO.horasModalidadMallaListDTO = []
      //console.log('DATA SAVE  DESPUES:::' + JSON.stringify(this.nivelEstudioDto))

      this.NivelEstudioService.saveObject(this.nivelEstudioDto).subscribe((data: any) => {
        if (!this.nivelEstudioDto.idNivelEstudio) {
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
    this.nivelEstudioDto = new NivelEstudioDto();
    this.llenarCombos();
    this.llenarNivelEstudio();
  }

  cancelar() {
    this.setearForm();
    this.appServices.msgInfoDetail('info', '', 'Acción Cancelada')
  }
}
