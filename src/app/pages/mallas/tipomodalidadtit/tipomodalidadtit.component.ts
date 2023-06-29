import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { AppService } from "@services/app.service";
import { TipoModalidadTitDto } from '@/dto/TipoModalidadTitDto';
import { TipomodalidadtitService } from '@services/mallas/tipomodalidadtit.service';
import { Observable } from "rxjs";

@Component({
  selector: 'app-tipomodalidadtit',
  templateUrl: './tipomodalidadtit.component.html',
  styleUrls: ['./tipomodalidadtit.component.scss']
})
export class TipomodalidadtitComponent implements OnInit {
  @Input() tipoMtDto: TipoModalidadTitDto;

  form: FormGroup;
  proceso: string = 'tipo-modalidad-titulacion'

  lstTipoMt: Observable<TipoModalidadTitDto[]>

  enedicion: boolean;

  //#region Variables de la vista
  SIZEFILE = `${environment.SIZEFILE}/`;
  ACCEPTFILES = `${environment.ACCEPTFILES}/`;
  URLFILEUPLOAD = `${environment.HOST}/files/upload/` + this.proceso;
  URLFILEUPLOADTOFIREBASE = `${environment.HOST}/files/uploadToFirebase`;

  constructor(
    public appServices: AppService,
    public TipoMtService: TipomodalidadtitService,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.llenarCombos();
    this.llenarTipoMt()
    this.crearForm();
  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.tipoMtDto = item;
      this.form = this.formBuilder.group(this.tipoMtDto)

      this.enedicion = true;
    } else {
      this.setearForm()
    }
  }

  crearForm() {
    this.form = new FormGroup({
      idTipoModalidadTitulacion: new FormControl('',),
      nombreTipoModalidadTitulacion: new FormControl('', Validators.required),
      activoTipoModalidadTitulacion: new FormControl('',),

      subTipoModalidadTitulacionListDTO: new FormControl(null,),
    });
  }

  async llenarCombos() {
  }

  async llenarTipoMt() {
    this.lstTipoMt = this.TipoMtService.getAll()
  }

  async guardar() {
    if (this.form.invalid) {
      this.appServices.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.tipoMtDto = this.form.value;

      // console.log('DATA SAVE:::' + JSON.stringify(this.tipoMtDto))

      this.TipoMtService.saveObject(this.tipoMtDto).subscribe((data: any) => {
        if (!this.tipoMtDto.idTipoModalidadTitulacion) {
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
    this.tipoMtDto = new TipoModalidadTitDto();
    this.llenarCombos();
    this.llenarTipoMt();
  }

  cancelar() {
    this.setearForm();
    this.appServices.msgInfoDetail('info', '', 'Acción Cancelada')
  }
}
