import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { AppService } from "@services/app.service";
import { ControlesPeriodoDto } from '@/dto/ControlesPeriodoDto';
import { ControlesperiodoService } from '@services/periodos/controlesperiodo.service';
import { PeriodoDto } from '@/dto/PeriodoDto';

import { PeriodoService } from '@services/periodos/periodo.service';
import { Observable } from "rxjs";

@Component({
  selector: 'app-controlesperiodo',
  templateUrl: './controlesperiodo.component.html',
  styleUrls: ['./controlesperiodo.component.scss']
})
export class ControlesperiodoComponent implements OnInit {
  @Input() ControlPerDto: ControlesPeriodoDto;

  form: FormGroup;
  proceso: string = 'controles-periodo'

  //lstControlPer: Observable<ControlesPeriodoDto[]>
  lstControlPer: ControlesPeriodoDto[]
  lstPeriodo: PeriodoDto[]

  enedicion: boolean;

  //#region Variables de la vista
  SIZEFILE = `${environment.SIZEFILE}/`;
  ACCEPTFILES = `${environment.ACCEPTFILES}/`;
  URLFILEUPLOAD = `${environment.HOST}/files/upload/` + this.proceso;
  URLFILEUPLOADTOFIREBASE = `${environment.HOST}/files/uploadToFirebase`;

  constructor(
    public appServices: AppService,
    public ControlPerService: ControlesperiodoService,
    public formBuilder: FormBuilder,
    public PeriodoService: PeriodoService,
  ) { }

  ngOnInit() {
    this.llenarCombos();
    this.llenarContolPer()
    this.crearForm();
  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.ControlPerDto = item;
      this.form = this.formBuilder.group(this.ControlPerDto)

      this.form.controls.idPeriodoDTO.setValue(this.lstPeriodo
        .find(control => control.idPeriodo === this.ControlPerDto.idPeriodoDTO.idPeriodo))

      this.enedicion = true;
    } else {
      this.setearForm()
    }
  }

  crearForm() {
    this.form = new FormGroup({
      idControlPeriodo: new FormControl('',),
      nombreControlPeriodo: new FormControl('', Validators.required),
      fechaiControlPeriodo: new FormControl('', Validators.required),
      fechafControlPeriodo: new FormControl('', Validators.required),
      vigenteControlPeriodo: new FormControl('', Validators.required),
      activoControlPeriodo: new FormControl('', Validators.required),
      idCarreraControlPeriodo: new FormControl('',),
      idFacultadControlPeriodo: new FormControl('',),

      idPeriodoDTO: new FormControl(null,),
    });
  }

  async llenarCombos() {
    await this.PeriodoService .getAll().subscribe(
      (data) => {
        this.lstPeriodo = data;
      }
    )
  }

  async llenarContolPer() {
    //this.lstControlPer = this.ControlPerService.getAll()
    await this.ControlPerService.getAll().subscribe(
      (data) => {
        this.lstControlPer = data
      }
    )
  }

  async guardar() {
    if (this.form.invalid) {
      this.appServices.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.ControlPerDto = this.form.value;

      // console.log('DATA SAVE:::' + JSON.stringify(this.ControlPerDto))

      await this.ControlPerService.saveObject(this.ControlPerDto).subscribe((data: any) => {
        if (!this.ControlPerDto.idControlPeriodo) {
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
    this.ControlPerDto = new ControlesPeriodoDto();
    this.llenarCombos();
    this.llenarContolPer();
  }

  cancelar() {
    this.setearForm();
    this.appServices.msgInfoDetail('info', '', 'Acción Cancelada')
  }
}
