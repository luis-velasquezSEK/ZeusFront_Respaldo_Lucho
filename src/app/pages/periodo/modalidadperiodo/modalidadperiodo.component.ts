import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { AppService } from "@services/app.service";
import { ModalidadPeriodoDto } from '@/dto/ModalidadPeriodoDto';
import { ModalidadperiodoService } from '@services/periodos/modalidadperiodo.service';
import { Observable } from "rxjs";

@Component({
  selector: 'app-modalidadperiodo',
  templateUrl: './modalidadperiodo.component.html',
  styleUrls: ['./modalidadperiodo.component.scss']
})
export class ModalidadperiodoComponent implements OnInit {
  @Input() modalidadPerDto: ModalidadPeriodoDto;

  form: FormGroup;
  proceso: string = 'modalidad-periodo'

  lstModalidadPer: Observable<ModalidadPeriodoDto[]>

  enedicion: boolean;

  //#region Variables de la vista
  SIZEFILE = `${environment.SIZEFILE}/`;
  ACCEPTFILES = `${environment.ACCEPTFILES}/`;
  URLFILEUPLOAD = `${environment.HOST}/files/upload/` + this.proceso;
  URLFILEUPLOADTOFIREBASE = `${environment.HOST}/files/uploadToFirebase`;

  constructor(
    public appServices: AppService,
    public ModalidadPerService: ModalidadperiodoService,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.llenarCombos();
    this.llenarModalidadPer()
    this.crearForm();
  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.modalidadPerDto = item;
      this.form = this.formBuilder.group(this.modalidadPerDto)

      this.enedicion = true;
    } else {
      this.setearForm()
    }
  }

  crearForm() {
    this.form = new FormGroup({
      idModalidad2: new FormControl('',),
      nombreModalidadp: new FormControl('', Validators.required),
      descripcionModalidadp: new FormControl('',Validators.required),
      activoModalidadp: new FormControl('',),
    });
  }

  async llenarCombos() {
  }

  async llenarModalidadPer() {
    this.lstModalidadPer = this.ModalidadPerService.getAll()
  }

  async guardar() {
    if (this.form.invalid) {
      this.appServices.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.modalidadPerDto = this.form.value;

      // console.log('DATA SAVE:::' + JSON.stringify(this.modalidadPerDto))

      await this.ModalidadPerService.saveObject(this.modalidadPerDto).subscribe((data: any) => {
        if (!this.modalidadPerDto.idModalidad2) {
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
    this.modalidadPerDto = new ModalidadPeriodoDto();
    this.llenarCombos();
    this.llenarModalidadPer();
  }

  cancelar() {
    this.setearForm();
    this.appServices.msgInfoDetail('info', '', 'Acción Cancelada')
  }
}
