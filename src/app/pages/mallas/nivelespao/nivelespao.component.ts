import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { AppService } from "@services/app.service";
import { NivelesPaoDto } from '@/dto/NivelesPaoDto';
import { NivelpaoService } from '@services/mallas/nivelpao.service';
import { Observable } from "rxjs";

@Component({
  selector: 'app-nivelespao',
  templateUrl: './nivelespao.component.html',
  styleUrls: ['./nivelespao.component.scss']
})
export class NivelespaoComponent implements OnInit {
  @Input() nivelPaoDto: NivelesPaoDto;

  form: FormGroup;
  proceso: string = 'niveles-pao'

  lstNivelPao: Observable<NivelesPaoDto[]>

  enedicion: boolean;

  //#region Variables de la vista
  SIZEFILE = `${environment.SIZEFILE}/`;
  ACCEPTFILES = `${environment.ACCEPTFILES}/`;
  URLFILEUPLOAD = `${environment.HOST}/files/upload/` + this.proceso;
  URLFILEUPLOADTOFIREBASE = `${environment.HOST}/files/uploadToFirebase`;

  constructor(
    public appServices: AppService,
    public NivelPaoService: NivelpaoService,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.llenarCombos();
    this.llenarNivelPao()
    this.crearForm();
  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.nivelPaoDto = item;
      this.form = this.formBuilder.group(this.nivelPaoDto)

      this.enedicion = true;
    } else {
      this.setearForm()
    }
  }

  crearForm() {
    this.form = new FormGroup({
      idNivelespao: new FormControl('',),
      nombreNivelesPao: new FormControl('', Validators.required),
      descripcionNivelesPao: new FormControl('', Validators.required),
      activoNivelesPao: new FormControl('',),

      idMallaDTO: new FormControl(null,),
    });
  }

  async llenarCombos() {
  }

  async llenarNivelPao() {
    this.lstNivelPao = this.NivelPaoService.getAll()
  }

  async guardar() {
    if (this.form.invalid) {
      this.appServices.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.nivelPaoDto = this.form.value;

      // console.log('DATA SAVE:::' + JSON.stringify(this.nivelPaoDto))

      await this.NivelPaoService.saveObject(this.nivelPaoDto).subscribe((data: any) => {
        if (!this.nivelPaoDto.idNivelespao) {
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
    this.nivelPaoDto = new NivelesPaoDto();
    this.llenarCombos();
    this.llenarNivelPao();
  }

  cancelar() {
    this.setearForm();
    this.appServices.msgInfoDetail('info', '', 'Acción Cancelada')
  }
}
