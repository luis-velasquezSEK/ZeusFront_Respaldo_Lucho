import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { AppService } from "@services/app.service";
import { DuracionPeriodoDto } from '@/dto/DuracionPeriodoDto';
import { DuracionperiodoService } from '@services/periodos/duracionperiodo.service';
import { Observable } from "rxjs";

@Component({
  selector: 'app-duracion',
  templateUrl: './duracion.component.html',
  styleUrls: ['./duracion.component.scss']
})
export class DuracionComponent implements OnInit {
  @Input() duracionDto: DuracionPeriodoDto;

  form: FormGroup;
  proceso: string = 'duracion-periodo'

  lstDuracion: Observable<DuracionPeriodoDto[]>

  enedicion: boolean;

  //#region Variables de la vista
  SIZEFILE = `${environment.SIZEFILE}/`;
  ACCEPTFILES = `${environment.ACCEPTFILES}/`;
  URLFILEUPLOAD = `${environment.HOST}/files/upload/` + this.proceso;
  URLFILEUPLOADTOFIREBASE = `${environment.HOST}/files/uploadToFirebase`;

  constructor(
    public appServices: AppService,
    public DuracionService: DuracionperiodoService,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.llenarCombos();
    this.llenarDuracion()
    this.crearForm();
  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.duracionDto = item;
      this.form = this.formBuilder.group(this.duracionDto)

      this.enedicion = true;
    } else {
      this.setearForm()
    }
  }

  crearForm() {
    this.form = new FormGroup({
      idDuracionPeriodo: new FormControl('',),
      nombreDuracionPeriodo: new FormControl('', Validators.required),
      activoDuracionPeriodo: new FormControl('',),

      periodoListDTO: new FormControl(null,),
    });
  }

  async llenarCombos() {
  }

  async llenarDuracion() {
    this.lstDuracion = this.DuracionService.getAll()
  }

  async guardar() {
    if (this.form.invalid) {
      this.appServices.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.duracionDto = this.form.value;

      // console.log('DATA SAVE:::' + JSON.stringify(this.duracionDto))

      await this.DuracionService.saveObject(this.duracionDto).subscribe((data: any) => {
        if (!this.duracionDto.idDuracionPeriodo) {
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
    this.duracionDto = new DuracionPeriodoDto();
    this.llenarCombos();
    this.llenarDuracion();
  }

  cancelar() {
    this.setearForm();
    this.appServices.msgInfoDetail('info', '', 'Acción Cancelada')
  }

}
