import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { AppService } from "@services/app.service";
import { TipoPeriodoDto } from '@/dto/TipoPeriodoDto';
import { TipoperiodoService } from '@services/periodos/tipoperiodo.service';
import { Observable } from "rxjs";

@Component({
  selector: 'app-tipoperiodo',
  templateUrl: './tipoperiodo.component.html',
  styleUrls: ['./tipoperiodo.component.scss']
})
export class TipoperiodoComponent implements OnInit {
  @Input() TipoPerDto: TipoPeriodoDto;

  form: FormGroup;
  proceso: string = 'tipo-periodo'

  lstTipoPer: Observable<TipoPeriodoDto[]>

  enedicion: boolean;

  //#region Variables de la vista
  SIZEFILE = `${environment.SIZEFILE}/`;
  ACCEPTFILES = `${environment.ACCEPTFILES}/`;
  URLFILEUPLOAD = `${environment.HOST}/files/upload/` + this.proceso;
  URLFILEUPLOADTOFIREBASE = `${environment.HOST}/files/uploadToFirebase`;

  constructor(
    public appServices: AppService,
    public TipoPerService: TipoperiodoService,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.llenarCombos();
    this.llenarTipoPer()
    this.crearForm();
  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.TipoPerDto = item;
      this.form = this.formBuilder.group(this.TipoPerDto)

      this.enedicion = true;
    } else {
      this.setearForm()
    }
  }

  crearForm() {
    this.form = new FormGroup({
      idTipoPeriodo: new FormControl('',),
      nombreTipoPeriodo: new FormControl('', Validators.required),
      activoTipoPeriodo: new FormControl('',),
    });
  }

  async llenarCombos() {
  }

  async llenarTipoPer() {
    this.lstTipoPer = this.TipoPerService.getAll()
  }

  async guardar() {
    if (this.form.invalid) {
      this.appServices.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.TipoPerDto = this.form.value;

      // console.log('DATA SAVE:::' + JSON.stringify(this.TipoPerDto))

      await this.TipoPerService.saveObject(this.TipoPerDto).subscribe((data: any) => {
        if (!this.TipoPerDto.idTipoPeriodo) {
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
    this.TipoPerDto = new TipoPeriodoDto();
    this.llenarCombos();
    this.llenarTipoPer();
  }

  cancelar() {
    this.setearForm();
    this.appServices.msgInfoDetail('info', '', 'Acción Cancelada')
  }
}
