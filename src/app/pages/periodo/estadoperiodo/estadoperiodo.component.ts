import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { AppService } from "@services/app.service";
import { EstadoPeriodoDto } from '@/dto/EstadoPeriodoDto';
import { EstadoperiodoService } from '@services/periodos/estadoperiodo.service';
import { Observable } from "rxjs";

@Component({
  selector: 'app-estadoperiodo',
  templateUrl: './estadoperiodo.component.html',
  styleUrls: ['./estadoperiodo.component.scss']
})
export class EstadoperiodoComponent implements OnInit {
  @Input() estadoPerDto: EstadoPeriodoDto;

  form: FormGroup;
  proceso: string = 'estado-periodo'

  lstEstadoPer: Observable<EstadoPeriodoDto[]>

  enedicion: boolean;

  //#region Variables de la vista
  SIZEFILE = `${environment.SIZEFILE}/`;
  ACCEPTFILES = `${environment.ACCEPTFILES}/`;
  URLFILEUPLOAD = `${environment.HOST}/files/upload/` + this.proceso;
  URLFILEUPLOADTOFIREBASE = `${environment.HOST}/files/uploadToFirebase`;

  constructor(
    public appServices: AppService,
    public EstadoPerService: EstadoperiodoService,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.llenarCombos();
    this.llenarEstadoPer()
    this.crearForm();
  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.estadoPerDto = item;
      this.form = this.formBuilder.group(this.estadoPerDto)

      this.enedicion = true;
    } else {
      this.setearForm()
    }
  }

  crearForm() {
    this.form = new FormGroup({
      idEstadoPeriodo: new FormControl('',),
      nombreEstadoPeriodo: new FormControl('', Validators.required),
      activoEstadoPeriodo: new FormControl('',),
    });
  }

  async llenarCombos() {
  }

  async llenarEstadoPer() {
    this.lstEstadoPer = this.EstadoPerService.getAll()
  }

  async guardar() {
    if (this.form.invalid) {
      this.appServices.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.estadoPerDto = this.form.value;

      // console.log('DATA SAVE:::' + JSON.stringify(this.estadoPerDto))

      await this.EstadoPerService.saveObject(this.estadoPerDto).subscribe((data: any) => {
        if (!this.estadoPerDto.idEstadoPeriodo) {
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
    this.estadoPerDto = new EstadoPeriodoDto();
    this.llenarCombos();
    this.llenarEstadoPer();
  }

  cancelar() {
    this.setearForm();
    this.appServices.msgInfoDetail('info', '', 'Acción Cancelada')
  }
}
