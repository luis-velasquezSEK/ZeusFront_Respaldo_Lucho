import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { AppService } from "@services/app.service";
import { RequisitoEgresamientoDto } from '@/dto/RequisitoEgresamientoDto';
import { TipoRequisitoEgreDto } from '@/dto/TipoRequisitoEgreDto';

import { RequisitoegreService } from '@services/mallas/requisitoegre.service';
import { TiporequisitoegreService } from '@services/mallas/tiporequisitoegre.service';
import { Observable } from "rxjs";

@Component({
  selector: 'app-reqegresamiento',
  templateUrl: './reqegresamiento.component.html',
  styleUrls: ['./reqegresamiento.component.scss']
})
export class ReqegresamientoComponent implements OnInit {
  @Input() reqEgresamientoDto: RequisitoEgresamientoDto;

  form: FormGroup;
  proceso: string = 'requisitos-egresamientos'

  reqEgresamiento: any;

  lstReqEgresamiento: RequisitoEgresamientoDto[]
  lstTipoReqEgre: TipoRequisitoEgreDto[]

  enedicion: boolean;

  //#region Variables de la vista
  SIZEFILE = `${environment.SIZEFILE}/`;
  ACCEPTFILES = `${environment.ACCEPTFILES}/`;
  URLFILEUPLOAD = `${environment.HOST}/files/upload/` + this.proceso;
  URLFILEUPLOADTOFIREBASE = `${environment.HOST}/files/uploadToFirebase`;

  constructor(
    public appServices: AppService,
    public ReqEgresamientoService: RequisitoegreService,
    public TipoReqEgreService: TiporequisitoegreService,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.llenarCombos();
    this.llenarReqEgresamiento()
    this.crearForm();
  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.reqEgresamientoDto = item;
      this.form = this.formBuilder.group(this.reqEgresamientoDto)

      this.form.controls.idTipoReqEgresamientoDTO.setValue(this.lstTipoReqEgre
        .find(tipo => tipo.idTipoReqEgresamiento === this.reqEgresamientoDto.idTipoReqEgresamientoDTO.idTipoReqEgresamiento))

      this.enedicion = true;
    } else {
      this.setearForm()
    }
  }

  crearForm() {
    this.form = new FormGroup({
      idReqEgresamiento: new FormControl('',),
      nombreReqEgresamiento: new FormControl('', Validators.required),
      codigoReqEgresamiento: new FormControl('', Validators.required),
      descripcionReqEgresamiento: new FormControl('', Validators.required),
      observacionReqEgresamiento: new FormControl('', Validators.required),
      activoReqEgresamiento: new FormControl('',),

      idTipoReqEgresamientoDTO: new FormControl(null,),
      idMallaDTO: new FormControl(null,),
    });
  }

  llenarCombos() {
    //this.lstTipoReqEgre = this.TipoReqEgreService.getAll()
    this.TipoReqEgreService.getAll().subscribe(
      data => {
        this.lstTipoReqEgre = data
      }
    )
  }

  llenarReqEgresamiento() {
    //this.lstReqEgresamiento = this.ReqEgresamientoService.getAll()
    this.ReqEgresamientoService.getAll().subscribe(
      data => {
        this.lstReqEgresamiento = data
      }
    )
  }

  async guardar() {
    if (this.form.invalid) {
      this.appServices.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.reqEgresamientoDto = this.form.value;

      //console.log('DATA SAVE:::' + JSON.stringify(this.reqEgresamientoDto))

      this.ReqEgresamientoService.saveObject(this.reqEgresamientoDto).subscribe((data: any) => {
        if (!this.reqEgresamientoDto.idReqEgresamiento) {
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
    this.reqEgresamientoDto = new RequisitoEgresamientoDto();
    this.llenarCombos();
    this.llenarReqEgresamiento();
    //this.lstTipoMt = null
  }

  cancelar() {
    this.setearForm();
    this.appServices.msgInfoDetail('info', '', 'Acción Cancelada')
  }
}
