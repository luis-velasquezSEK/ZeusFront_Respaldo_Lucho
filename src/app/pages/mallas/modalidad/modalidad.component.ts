import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { AppService } from "@services/app.service";
import { ModalidadDto } from '@/dto/ModalidadDto';
import { ModalidadService } from '@services/mallas/modalidad.service';
import { Observable } from "rxjs";

@Component({
  selector: 'app-modalidad',
  templateUrl: './modalidad.component.html',
  styleUrls: ['./modalidad.component.scss']
})
export class ModalidadComponent implements OnInit {
  @Input() modalidadDto: ModalidadDto;

  form: FormGroup;
  proceso: string = 'modalidad'

  lstModalidad: Observable<ModalidadDto[]>

  enedicion: boolean;

  //#region Variables de la vista
  SIZEFILE = `${environment.SIZEFILE}/`;
  ACCEPTFILES = `${environment.ACCEPTFILES}/`;
  URLFILEUPLOAD = `${environment.HOST}/files/upload/` + this.proceso;
  URLFILEUPLOADTOFIREBASE = `${environment.HOST}/files/uploadToFirebase`;

  constructor(
    public appServices: AppService,
    public ModalidadService: ModalidadService,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.llenarCombos();
    this.llenarModalidad()
    this.crearForm();
  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.modalidadDto = item;
      this.form = this.formBuilder.group(this.modalidadDto)

      this.enedicion = true;
    } else {
      this.setearForm()
    }
  }

  crearForm() {
    this.form = new FormGroup({
      idModalidad: new FormControl('',),
      codigoModalidad: new FormControl('', Validators.required),
      nombreModalidad: new FormControl('', Validators.required),
      descripcionModalidad: new FormControl('',Validators.required),
      activoModalidad: new FormControl('',),
    });
  }

  async llenarCombos() {
  }

  async llenarModalidad() {
    this.lstModalidad = this.ModalidadService.getAll()
  }

  async guardar() {
    if (this.form.invalid) {
      this.appServices.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.modalidadDto = this.form.value;

      // console.log('DATA SAVE:::' + JSON.stringify(this.modalidadDto))

      await this.ModalidadService.saveObject(this.modalidadDto).subscribe((data: any) => {
        if (!this.modalidadDto.idModalidadPe) {
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
    this.modalidadDto = new ModalidadDto();
    this.llenarCombos();
    this.llenarModalidad();
  }

  cancelar() {
    this.setearForm();
    this.appServices.msgInfoDetail('info', '', 'Acción Cancelada')
  }
}
