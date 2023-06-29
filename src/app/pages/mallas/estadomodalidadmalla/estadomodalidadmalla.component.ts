import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {InstitucionEducativaDto} from "@/dto/InstitucionEducativaDto";
import {FileUpload} from "primeng/fileupload";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {CategoriaDto} from "@/dto/CategoriaDto";
import {TipoInstitucionEducativaDto} from "@/dto/TipoInstitucionEducativaDto";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {AppService} from "@services/app.service";
import {InstitucionEducativaService} from "@services/institucioneducativa/institucioneducativa.service";
import {CategoriaService} from "@services/institucioneducativa/categoria.service";
import {FileService} from "@services/utils/file.service";
import {TipoInstitucionEducativaService} from "@services/institucioneducativa/tipoinstitucioneducativa.service";
import {EstadoModmallaDto} from "@/dto/EstadoModmallaDto";
import {EstadoModalidadMallaService} from "@services/mallas/estadomodalidadmalla.service";

@Component({
  selector: 'app-estadomodalidadmalla',
  templateUrl: './estadomodalidadmalla.component.html',
  styleUrls: ['./estadomodalidadmalla.component.scss']
})
export class EstadomodalidadmallaComponent implements OnInit {

  /***
   * variables globales, @Input para enlaces de componentes
   * */
  @Input() estadoModmallaDto: EstadoModmallaDto;

  form: FormGroup;
  proceso: string = 'malla';

  lstEstadoModalidadMalla: Observable<EstadoModmallaDto[]>;

  enedicion: boolean;

  /***
   * Constructor: se agregar los servicios necesarios
   * **/
  constructor(public appService: AppService,
              public formBuilder: FormBuilder,
              public estadoModalidadMallaService: EstadoModalidadMallaService) {
  }

  /***
   * Constructir para inicializar antes del renderizado de la pagina
   * **/
  ngOnInit() {
    this.crearForm();
    this.llenarEstadoModalidadMalla();
    this.llenarCombos();
  }

  /***
   * Metodos vinculados a componente principal
   * **/
  async llenarCombos() {

  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.estadoModmallaDto = item;
      this.form = this.formBuilder.group(this.estadoModmallaDto);
      /*await this.categoriaService.getById(this.estadoModmallaDto.idCategoriaDTO.idCategoria).subscribe(
        data => {
          this.categoria = data;
        }
      );
      await this.tipoInstitucionEducativaService.getById(this.estadoModmallaDto.idTipoInstitucionEducativaDTO.idTipoInstitucionEducativa).subscribe(
        data => {
          this.tipo = data;
        }
      );*/
      //this.categoria = this.institucionEducativa.idCategoriaDTO;
      //this.tipo = this.institucionEducativa.idTipoInstitucionEducativaDTO;
      this.enedicion = true;
    } else {
      this.setearForm();
    }
  }

  llenarEstadoModalidadMalla() {
    this.lstEstadoModalidadMalla = this.estadoModalidadMallaService.getAll();
  }

  //Inicializa el formulario para el ingreso de la pagina y datos
  crearForm() {
    this.form = new FormGroup({
      //idEstadoModmalla:new FormControl('',),
      nombreEstadoModmalla:new FormControl('',),
      descripcionEstadoModmalla:new FormControl('',),
      activoEstadoModmalla:new FormControl('',),
      //modalidadMallaListDTO:any[];
    });
  }

  /**
   * Métodos para funcionalidad de la pagina
   * **/
  async guardar() {
    if (this.form.invalid) {
      this.appService.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.estadoModmallaDto = this.form.value;
      await this.estadoModalidadMallaService.saveObject(this.estadoModmallaDto).subscribe((data: any) => {
        if (!this.estadoModmallaDto.idEstadoModmalla) {
          this.appService.msgCreate();
        } else {
          this.appService.msgUpdate();
        }
        this.setearForm();
        //this.llenarInstitucionEducativa();
      });
    }
  }

  setearForm() {
    this.form.reset();
    this.estadoModmallaDto = new EstadoModmallaDto();
    this.llenarCombos();
    this.llenarEstadoModalidadMalla();
  }

  cancelar() {
    this.setearForm();
    this.appService.msgInfoDetail('info', '', 'Acción Cancelada')
  }
}

