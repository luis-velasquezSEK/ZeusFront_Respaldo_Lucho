import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { AppService } from "@services/app.service";
import { ModalidadTitulacionDto } from '@/dto/ModalidadTitulacionDto';
import { DetalleModalidadTitulacionDto } from '@/dto/DetalleModalidadTitDTO';
import { ModalidadtitulacionService } from '@services/mallas/modalidadtitulacion.service';
import { DetallemodalidadtitService } from '@services/mallas/detallemodalidadtit.service';
import { Observable } from "rxjs";

@Component({
  selector: 'app-modalidadtitulacion',
  templateUrl: './modalidadtitulacion.component.html',
  styleUrls: ['./modalidadtitulacion.component.scss']
})
export class ModalidadtitulacionComponent implements OnInit {

  @Input() modalidadTitDto: ModalidadTitulacionDto;

  form: FormGroup;
  proceso: string = 'modalidad-Titulacion'

  modalidadTit: any;

  lstModalidadTit: Observable<ModalidadTitulacionDto[]>
  lstDetalleMt: Observable<DetalleModalidadTitulacionDto[]>

  enedicion: boolean;

  //#region Variables de la vista
  SIZEFILE = `${environment.SIZEFILE}/`;
  ACCEPTFILES = `${environment.ACCEPTFILES}/`;
  URLFILEUPLOAD = `${environment.HOST}/files/upload/` + this.proceso;
  URLFILEUPLOADTOFIREBASE = `${environment.HOST}/files/uploadToFirebase`;

  constructor(
    public appServices: AppService,
    public ModalidadTitService: ModalidadtitulacionService,
    public DetalleMtService: DetallemodalidadtitService,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.llenarCombos();
    this.llenarModalidadTit()
    this.crearForm();
  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.modalidadTitDto = item;
      this.form = this.formBuilder.group(this.modalidadTitDto)

      this.enedicion = true;
    } else {
      this.setearForm()
    }
  }

  crearForm() {
    this.form = new FormGroup({
      idModalidadTitulacion: new FormControl('',),
      nombreModalidadTitulacion: new FormControl('', Validators.required),
      codigoModalidadTitulacion: new FormControl('', Validators.required),
      observacionModalidadTitulacion: new FormControl('', Validators.required),
      activoModalidadTitulacion: new FormControl('',),

      idMallaDTO: new FormControl(null,),
      detalleModalidadTitulacionListDTO	: new FormControl(null,),
    });
  }

  async llenarCombos() {
    this.lstDetalleMt = this.DetalleMtService.getAll()
  }

  async llenarModalidadTit() {
    this.lstModalidadTit = this.ModalidadTitService.getAll()
  }

  async guardar() {
    if (this.form.invalid) {
      this.appServices.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.modalidadTitDto = this.form.value;

      console.log('DATA SAVE:::' + JSON.stringify(this.modalidadTitDto))

      this.ModalidadTitService.saveObject(this.modalidadTitDto).subscribe((data: any) => {
        if (!this.modalidadTitDto.idModalidadTitulacion) {
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
    this.modalidadTitDto = new ModalidadTitulacionDto();
    this.llenarCombos();
    this.llenarModalidadTit();
  }

  cancelar() {
    this.setearForm();
    this.appServices.msgInfoDetail('info', '', 'Acción Cancelada')
  }

}
