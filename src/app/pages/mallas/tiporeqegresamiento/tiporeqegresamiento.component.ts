import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { AppService } from "@services/app.service";
import { TipoRequisitoEgreDto } from '@/dto/TipoRequisitoEgreDto';
import { TiporequisitoegreService } from '@services/mallas/tiporequisitoegre.service';
import { Observable } from "rxjs";

@Component({
  selector: 'app-tiporeqegresamiento',
  templateUrl: './tiporeqegresamiento.component.html',
  styleUrls: ['./tiporeqegresamiento.component.scss']
})
export class TiporeqegresamientoComponent implements OnInit {

  @Input() tipoReqEgreDto: TipoRequisitoEgreDto;

  form: FormGroup;
  proceso: string = 'tipo-requisito-egresamiento'

  lstTipoReqEgre: Observable<TipoRequisitoEgreDto[]>

  enedicion: boolean;

  //#region Variables de la vista
  SIZEFILE = `${environment.SIZEFILE}/`;
  ACCEPTFILES = `${environment.ACCEPTFILES}/`;
  URLFILEUPLOAD = `${environment.HOST}/files/upload/` + this.proceso;
  URLFILEUPLOADTOFIREBASE = `${environment.HOST}/files/uploadToFirebase`;

  constructor(
    public appServices: AppService,
    public TipoReqEgreService: TiporequisitoegreService,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.llenarCombos();
    this.llenarTipoMt()
    this.crearForm();
  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.tipoReqEgreDto = item;
      this.form = this.formBuilder.group(this.tipoReqEgreDto)

      this.enedicion = true;
    } else {
      this.setearForm()
    }
  }

  crearForm() {
    this.form = new FormGroup({
      idTipoReqEgresamiento: new FormControl('',),
      nombreTipoReqEgresamiento: new FormControl('', Validators.required),
      activoTipoReqEgresamiento: new FormControl('',),

    });
  }

  async llenarCombos() {
  }

  async llenarTipoMt() {
    this.lstTipoReqEgre = this.TipoReqEgreService.getAll()
  }

  async guardar() {
    if (this.form.invalid) {
      this.appServices.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.tipoReqEgreDto = this.form.value;

      // console.log('DATA SAVE:::' + JSON.stringify(this.tipoReqEgreDto))

      await this.TipoReqEgreService.saveObject(this.tipoReqEgreDto).subscribe((data: any) => {
        if (!this.tipoReqEgreDto.idTipoReqEgresamiento) {
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
    this.tipoReqEgreDto = new TipoRequisitoEgreDto();
    this.llenarCombos();
    this.llenarTipoMt();
  }

  cancelar() {
    this.setearForm();
    this.appServices.msgInfoDetail('info', '', 'Acción Cancelada')
  }
}
