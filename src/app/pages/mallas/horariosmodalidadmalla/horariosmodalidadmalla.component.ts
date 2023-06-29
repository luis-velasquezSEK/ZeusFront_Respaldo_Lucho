import { Component, EventEmitter, Input, OnInit, ViewChild, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { AppService } from "@services/app.service";
import { HorasModalidadMallaDto } from '@/dto/HorasModalidadMallaDto';
import { ModalidadMallaDto } from '@/dto/ModalidadMallaDto';

import { HorasModalidadMallaService } from '@services/mallas/horasmodalidadmalla.service';
import { ModalidadMallaService } from '@services/mallas/modalidadmalla.service';
import { PlanEstudioMallaServicioEmiter } from '../MallaService';
import { Observable } from "rxjs";

@Component({
  selector: 'app-horariosmodalidadmalla',
  templateUrl: './horariosmodalidadmalla.component.html',
  styleUrls: ['./horariosmodalidadmalla.component.scss']
})
export class HorariosmodalidadmallaComponent implements OnInit {

  /**
   * ARREGLAR LA INSERCION DEL CRUD DE HORARIOS
   */
  @Input() horasModMallaDto: HorasModalidadMallaDto = new HorasModalidadMallaDto();
  @Input() lstHoraModMallaInput: HorasModalidadMallaDto[]
  @Output() listHorasModMallaEmitter = new EventEmitter();

  form: FormGroup;
  proceso: string = 'horas-modalidad-malla'

  horasModMalla: HorasModalidadMallaDto = new HorasModalidadMallaDto();

  lstHorasModMalla: HorasModalidadMallaDto[]
  lstModMalla: ModalidadMallaDto[]

  enedicion: boolean;

  //#region Variables de la vista
  SIZEFILE = `${environment.SIZEFILE}/`;
  ACCEPTFILES = `${environment.ACCEPTFILES}/`;
  URLFILEUPLOAD = `${environment.HOST}/files/upload/` + this.proceso;
  URLFILEUPLOADTOFIREBASE = `${environment.HOST}/files/uploadToFirebase`;

  constructor(
    public appServices: AppService,
    public HorasModMallaService: HorasModalidadMallaService,
    public ModMallaService: ModalidadMallaService,
    public formBuilder: FormBuilder,
    public PlanEstudioMallaService: PlanEstudioMallaServicioEmiter
  ) { }

  ngOnInit() {
    this.llenarCombos();
    this.llenarHorasModMalla()
    this.crearForm();
  }

  testHour() {
    this.horasModMallaDto = this.form.value;
    console.log('DATA SAVE:::' + JSON.stringify(this.horasModMallaDto))
  }

  starHourValueStart: Date
  starHourValueEnd: Date
  timeStaticStart(event) {
    if (event) {
      let timestamp = event.horaInicioModalidadMalla
      console.log('BACK::: ', timestamp)
      /*let todayedit = new Date(timestamp)
      console.log("Date: " + todayedit.getDate() +
        "/" + (todayedit.getMonth() + 1) +
        "/" + todayedit.getFullYear() +
        " " + todayedit.getHours() +
        ":" + todayedit.getMinutes() +
        ":" + todayedit.getSeconds());
      let date = new Date(todayedit.getFullYear(), todayedit.getMonth(), todayedit.getDate(), timestamp)
      console.log('DATE::: ', date)*/
      this.form.patchValue({ horaInicioModalidadMalla: timestamp })
    } else {
      this.form.patchValue({ horaInicioModalidadMalla: this.starHourValueStart })
      if (!this.starHourValueStart) {
        let today = new Date()
        let starHourDefault = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        this.form.patchValue({ horaInicioModalidadMalla: starHourDefault })
        //this.starHourValueStart = starHourDefault
      }
    }
  }

  timeStaticEnd() {
    this.form.patchValue({ horaFinModalidadMalla: this.starHourValueEnd })
    if (!this.starHourValueEnd) {
      let today = new Date()
      let starHourDefault = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
      this.form.patchValue({ horaFinModalidadMalla: starHourDefault })
      //this.starHourValueEnd = starHourDefault
    }
  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.horasModMallaDto = item;
      this.form = this.formBuilder.group(this.horasModMallaDto)

      console.log('HORAS::: ' + JSON.stringify(item))
      //this.form.patchValue({ horaInicioModalidadMalla: item.horaInicioModalidadMalla })
      this.timeStaticStart(item)

      this.form.controls.idModalidadMallaDTO.setValue(this.lstModMalla
        .find(tipo => tipo.idModalidadMalla === this.horasModMallaDto.idModalidadMallaDTO.idModalidadMalla))

      this.enedicion = true;
    } else {
      this.setearForm()
    }
  }

  setListaHorarioModMallaEmitter(lista) {
    this.lstHorasModMalla = lista;
    this.listHorasModMallaEmitter.emit(this.lstHorasModMalla);
    console.log('Componente SET LISTA: ' + JSON.stringify(this.lstHorasModMalla))
  }

  crearForm() {
    this.form = new FormGroup({
      idHorasModalidadMalla: new FormControl('',),
      horaInicioModalidadMalla: new FormControl('', Validators.required),
      horaFinModalidadMalla: new FormControl('', Validators.required),
      nombreModalidadMalla: new FormControl('', Validators.required),
      descripcionModalidadMalla: new FormControl('', Validators.required),
      activoModalidadMalla: new FormControl('',),

      idModalidadMallaDTO: new FormControl(null,),
      horasModalidadMallaListDTO: new FormControl(null,),
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

  llenarHorasModMalla() {
    //this.lstHorasModMalla = this.HorasModMallaService.getAll()
    this.HorasModMallaService.getAll().subscribe(
      data => {
        this.lstHorasModMalla = data
      }
    )
  }

  async guardar() {
    if (this.form.invalid) {
      this.appServices.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.horasModMalla = this.form.value;
      // console.log('DATA SAVE:::' + JSON.stringify(this.horasModMalla))
      this.horasModMalla.idModalidadMallaDTO.horasModalidadMallaListDTO = []

      if (this.enedicion) {
        this.lstHorasModMalla[this.findIndexById(this.horasModMalla.idHorasModalidadMalla)] = this.horasModMalla;
        this.appServices.msgUpdate();
        this.enedicion = false;
      } else {
        this.horasModMalla.idHorasModalidadMalla = (this.lstHorasModMalla.length + 1);
        this.lstHorasModMalla.push(this.horasModMalla);
        this.appServices.msgCreate();
      }
      this.lstHorasModMalla = [...this.lstHorasModMalla];
      this.listHorasModMallaEmitter.emit(this.lstHorasModMalla);
      this.PlanEstudioMallaService.setHorarioMallaInput(this.lstHorasModMalla);
      this.setearForm();
      console.log('VALOR ID COMPONENTE: ', this.horasModMalla.idHorasModalidadMalla);
      console.log('TAMAÑO LIST: ', this.lstHorasModMalla.length);
      console.log('LISTA: ' + JSON.stringify(this.lstHorasModMalla))

      // // CODIGO PARA GUARDAR DIRECTO A LA BASE
      // this.HorasModMallaService.saveObject(this.horasModMallaDto).subscribe((data: any) => {
      //   if (!this.horasModMallaDto.idHorasModalidadMalla) {
      //     this.appServices.msgCreate();
      //   } else {
      //     this.appServices.msgUpdate();
      //   }
      //   this.setearForm();
      // });
    }
  }

  findIndexById(id: number): number {
    let index = 0;
    for (let i = 0; i < this.lstHorasModMalla.length; i++) {
      if (this.lstHorasModMalla[i].idHorasModalidadMalla === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  setearForm() {
    this.form.reset();
    this.horasModMallaDto = new HorasModalidadMallaDto();
    this.llenarCombos();
    this.llenarHorasModMalla();
  }

  cancelar() {
    this.setearForm();
    this.appServices.msgInfoDetail('info', '', 'Acción Cancelada')
  }

}
