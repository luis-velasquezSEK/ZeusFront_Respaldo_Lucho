import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { AppService } from "@services/app.service";
import { SubTipoModalidadTitDto } from '@/dto/SubTipoModalidadTitDto';
import { TipoModalidadTitDto } from '@/dto/TipoModalidadTitDto';
import { SubtipomodalidadtitService } from '@services/mallas/subtipomodalidadtit.service';
import { TipomodalidadtitService } from '@services/mallas/tipomodalidadtit.service';
import { Observable } from "rxjs";

@Component({
  selector: 'app-subtipomodalidadtit',
  templateUrl: './subtipomodalidadtit.component.html',
  styleUrls: ['./subtipomodalidadtit.component.scss']
})
export class SubtipomodalidadtitComponent implements OnInit {

  @Input() subTipoMtDto: SubTipoModalidadTitDto;

  form: FormGroup;
  proceso: string = 'subtipo-modalidad-titulacion'

  tipoMt: any;

  lstSubTipoMt: SubTipoModalidadTitDto[]
  lstTipoMt: TipoModalidadTitDto[]

  enedicion: boolean;

  //#region Variables de la vista
  SIZEFILE = `${environment.SIZEFILE}/`;
  ACCEPTFILES = `${environment.ACCEPTFILES}/`;
  URLFILEUPLOAD = `${environment.HOST}/files/upload/` + this.proceso;
  URLFILEUPLOADTOFIREBASE = `${environment.HOST}/files/uploadToFirebase`;

  constructor(
    public appServices: AppService,
    public SubTipoMtService: SubtipomodalidadtitService,
    public TipoMtService: TipomodalidadtitService,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.llenarCombos();
    this.llenarSubTipoMt()
    this.crearForm();
  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.subTipoMtDto = item;
      this.form = this.formBuilder.group(this.subTipoMtDto)

      this.form.controls.idTipoModalidadTitulacionDTO.setValue(this.lstTipoMt
        .find(tipo => tipo.idTipoModalidadTitulacion === this.subTipoMtDto.idTipoModalidadTitulacionDTO.idTipoModalidadTitulacion))

      /*this.TipoMtService.getById(this.subTipoMtDto.idTipoModalidadTitulacionDTO.idTipoModalidadTitulacion).subscribe(
        data => {
          console.log('DATA:: ', data)
          this.tipoMt = data;
          //this.form.controls.idTipoModalidadTitulacionDTO = Data
          this.subTipoMtDto.idTipoModalidadTitulacionDTO.idTipoModalidadTitulacion = data
        }
      )*/
      //this.tipoMt = this.subTipoMtDto.idTipoModalidadTitulacionDTO
      this.enedicion = true;
    } else {
      this.setearForm()
    }
  }

  crearForm() {
    this.form = new FormGroup({
      idSubTipoModalidadTitulacion: new FormControl('',),
      nombreSubTipoModalidadTitulacion: new FormControl('', Validators.required),
      codigoSubTipoModalidadTitulacion: new FormControl('', Validators.required),
      observacionSubTipoModalidadTitulacion: new FormControl('', Validators.required),
      activoSubTipoModalidadTitulacion: new FormControl('',),

      idTipoModalidadTitulacionDTO: new FormControl(null,),
    });
  }

  llenarCombos() {
    //this.lstTipoMt = this.TipoMtService.getAll()
    this.TipoMtService.getAll().subscribe(
      data => {
        this.lstTipoMt = data
      }
    )
  }

  llenarSubTipoMt() {
    //this.lstSubTipoMt = this.SubTipoMtService.getAll()
    this.SubTipoMtService.getAll().subscribe(
      data => {
        this.lstSubTipoMt = data
      }
    )
  }

  async guardar() {
    if (this.form.invalid) {
      this.appServices.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.subTipoMtDto = this.form.value;

      //console.log('DATA SAVE:::' + JSON.stringify(this.subTipoMtDto))

      this.SubTipoMtService.saveObject(this.subTipoMtDto).subscribe((data: any) => {
        if (!this.subTipoMtDto.idSubTipoModalidadTitulacion) {
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
    this.subTipoMtDto = new SubTipoModalidadTitDto();
    this.llenarCombos();
    this.llenarSubTipoMt();
    //this.lstTipoMt = null
  }

  cancelar() {
    this.setearForm();
    this.appServices.msgInfoDetail('info', '', 'Acción Cancelada')
  }
}
