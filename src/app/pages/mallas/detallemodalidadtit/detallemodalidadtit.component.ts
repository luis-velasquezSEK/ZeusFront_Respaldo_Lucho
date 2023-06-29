import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { AppService } from "@services/app.service";
import { DetalleModalidadTitulacionDto } from '@/dto/DetalleModalidadTitDTO';
import { SubTipoModalidadTitDto } from '@/dto/SubTipoModalidadTitDto';
import { TipoModalidadTitDto } from '@/dto/TipoModalidadTitDto';
import { DetallemodalidadtitService } from '@services/mallas/detallemodalidadtit.service';
import { SubtipomodalidadtitService } from '@services/mallas/subtipomodalidadtit.service';
import { TipomodalidadtitService } from '@services/mallas/tipomodalidadtit.service';
import { Observable } from "rxjs";

@Component({
  selector: 'app-detallemodalidadtit',
  templateUrl: './detallemodalidadtit.component.html',
  styleUrls: ['./detallemodalidadtit.component.scss']
})
export class DetallemodalidadtitComponent implements OnInit {

  @Input() detalleMTDto: DetalleModalidadTitulacionDto;

  form: FormGroup;
  proceso: string = 'detallemodalidadtitulacion'

  TipoMtSelected: any
  TipoMtShow: TipoModalidadTitDto = new TipoModalidadTitDto();
  SubTipoMtSelected: any
  SubTipoMtShow: SubTipoModalidadTitDto = new SubTipoModalidadTitDto();


  lstDetalleMt: Observable<DetalleModalidadTitulacionDto[]>
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
    public detalleMTService: DetallemodalidadtitService,
    public SubTipoMtService: SubtipomodalidadtitService,
    public TipoMtService: TipomodalidadtitService,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.llenarCombos(0);
    this.llenarDetalleMt()
    this.crearForm();
  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.detalleMTDto = item;
      this.form = this.formBuilder.group(this.detalleMTDto)
      // this.llenarCombosEdicion(item)
      this.llenarDetalleTipoModadlidadTit(item);
      this.llenarDetalleSubTipoModadlidadTit(item);

      console.log('ITEM::: ' + JSON.stringify(item))

      this.enedicion = true;
    } else {
      this.setearForm()
    }
  }

  crearForm() {
    this.form = new FormGroup({
      idDetalleMt: new FormControl('',),
      codigoDetalleMt: new FormControl('', Validators.required),
      observacionesDetalleMt: new FormControl('', Validators.required),
      nombreDetalleMt: new FormControl('', Validators.required),
      activoDetalleMt: new FormControl('',),

      subTipoModalidadTitulacionDto: new FormControl(null,),
      //modalidadTitulacionDTO: new FormControl(null,),
    });
  }

  async llenarCombos(option) {
    //this.lstSubTipoMt = this.SubTipoMtService.getAll()
    //this.lstTipoMt = this.TipoMtService.getAll()
    await this.TipoMtService.getAll().subscribe(
      data => {
        this.lstTipoMt = data;
      }
    )

    if (option === 1) {
      await this.SubTipoMtService.getAll().subscribe(
        data => {
          this.lstSubTipoMt = data;
        }
      )
    }
  }

  llenarDetalleMt() {
    this.lstDetalleMt = this.detalleMTService.getAll()
  }

  llenarCombosEdicion(item) {
    try {
      let idSubTipoModal = this.detalleMTDto.subTipoModalidadTitulacionDto.idSubTipoModalidadTitulacion;
      this.TipoMtService.getById(idSubTipoModal).subscribe(
        data => {
          this.lstTipoMt = data;
          this.TipoMtSelected = this.lstTipoMt[0];
          this.llenarCombos(1)
        })
        /*this.lstTipoMt = this.TipoMtService.getById(idSubTipoModal)
        this.TipoMtSelected = this.lstTipoMt[0];
        this.llenarCombos()*/
    } catch (e) {
      console.log(e)
    }
  }

  llenarDetalleTipoModadlidadTit(event) {
    try {
      if (this.TipoMtSelected) {
        this.TipoMtShow = this.TipoMtSelected;
        this.lstSubTipoMt = this.TipoMtSelected.subTipoModalidadTitulacionListDTO;
      } else {
        this.TipoMtShow = new TipoModalidadTitDto();
        this.lstSubTipoMt = new Array();
      }
      this.SubTipoMtSelected = null;
      this.SubTipoMtShow = new SubTipoModalidadTitDto();
    } catch (e) {
      console.log('ERROR LLENAR DETALLE TIPO MOD TIT: ' + JSON.stringify(e))
    }
  }

  llenarDetalleSubTipoModadlidadTit(event) {
    try {
      console.log('ID SUBTIPO MOD TIT::: ', this.SubTipoMtSelected.idSubTipoModalidadTitulacion);
      this.SubTipoMtService.getById(this.SubTipoMtSelected.idSubTipoModalidadTitulacion).subscribe(
        data => {
          this.SubTipoMtShow = data;
        }
      )
    } catch (e) {
      console.log('ERROR: ' + e);
      this.SubTipoMtSelected = null;
      this.SubTipoMtShow = new SubTipoModalidadTitDto();
    }
  }

  async guardar() {
    if (this.form.invalid) {
      this.appServices.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.detalleMTDto = this.form.value;
      
      let idSubTipoMt = this.SubTipoMtSelected
      this.detalleMTDto.subTipoModalidadTitulacionDto = idSubTipoMt;

      // this.SubTipoMtService.getById(this.SubTipoMtSelected.idSubTipoModalidadTitulacion).subscribe(
      //   data => {
      //     this.SubTipoMtShow = data;
      //     this.detalleMTDto.subTipoModalidadTitulacionDto = this.SubTipoMtShow;
      //   }
      // )

      console.log('DATA SAVE:::' + JSON.stringify(this.detalleMTDto))

      this.detalleMTService.saveObject(this.detalleMTDto).subscribe((data: any) => {
        if (!this.detalleMTDto.idDetalleMt) {
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
    this.detalleMTDto = new DetalleModalidadTitulacionDto();
    this.lstTipoMt = new Array();
    this.lstSubTipoMt = new Array();
    this.TipoMtSelected = null
    this.SubTipoMtSelected = null
    this.llenarCombos(0);
    this.llenarDetalleMt();
  }

  cancelar() {
    this.setearForm();
    this.appServices.msgInfoDetail('info', '', 'Acción Cancelada')
  }
}
