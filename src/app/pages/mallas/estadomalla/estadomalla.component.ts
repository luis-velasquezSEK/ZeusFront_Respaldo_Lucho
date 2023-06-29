import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { AppService } from "@services/app.service";
import { EstadoMallaDto } from '@/dto/EstadoMallaDto';
import { EstadomallaService } from '@services/mallas/estadomalla.service';
import { Observable } from "rxjs";

@Component({
  selector: 'app-estadomalla',
  templateUrl: './estadomalla.component.html',
  styleUrls: ['./estadomalla.component.scss']
})
export class EstadomallaComponent implements OnInit {
  @Input() estadoMallaoDto: EstadoMallaDto;

  form: FormGroup;
  proceso: string = 'estado-malla'

  lstEstadoMalla: Observable<EstadoMallaDto[]>

  enedicion: boolean;

  //#region Variables de la vista
  SIZEFILE = `${environment.SIZEFILE}/`;
  ACCEPTFILES = `${environment.ACCEPTFILES}/`;
  URLFILEUPLOAD = `${environment.HOST}/files/upload/` + this.proceso;
  URLFILEUPLOADTOFIREBASE = `${environment.HOST}/files/uploadToFirebase`;

  constructor(
    public appServices: AppService,
    public EstadoMallaService: EstadomallaService,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.llenarCombos();
    this.llenarEstadoMalla()
    this.crearForm();
  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.estadoMallaoDto = item;
      this.form = this.formBuilder.group(this.estadoMallaoDto)

      this.enedicion = true;
    } else {
      this.setearForm()
    }
  }

  crearForm() {
    this.form = new FormGroup({
      idEstadoMalla: new FormControl('',),
      nombreEstadoMalla: new FormControl('', Validators.required),
      activoEstadoMalla: new FormControl('',),
    });
  }

  async llenarCombos() {
  }

  async llenarEstadoMalla() {
    this.lstEstadoMalla = this.EstadoMallaService.getAll()
  }

  async guardar() {
    if (this.form.invalid) {
      this.appServices.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.estadoMallaoDto = this.form.value;

      // console.log('DATA SAVE:::' + JSON.stringify(this.estadoMallaoDto))
      await this.EstadoMallaService.saveObject(this.estadoMallaoDto).subscribe((data: any) => {
        if (!this.estadoMallaoDto.idEstadoMalla) {
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
    this.estadoMallaoDto = new EstadoMallaDto();
    this.llenarCombos();
    this.llenarEstadoMalla();
  }

  cancelar() {
    this.setearForm();
    this.appServices.msgInfoDetail('info', '', 'Acción Cancelada')
  }
}
