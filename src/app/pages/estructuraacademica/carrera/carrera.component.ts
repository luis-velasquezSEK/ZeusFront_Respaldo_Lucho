import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FacultadDto} from "@/dto/FacultadDto";
import {FileUpload} from "primeng/fileupload";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {CampusDto} from "@/dto/CampusDto";
import {EstadoFacultadDto} from "@/dto/EstadoFacultadDto";
import {environment} from "../../../../environments/environment";
import {AppService} from "@services/app.service";
import {FacultadService} from "@services/institucioneducativa/facultad.service";
import {EstadoFacultadService} from "@services/institucioneducativa/estadofacultad.service";
import {CampusService} from "@services/institucioneducativa/campus.service";
import {CarreraDto} from "@/dto/CarreraDto";
import {EstadoCarreraDto} from "@/dto/EstadoCarreraDto";
import {EstadoCarreraService} from "@services/institucioneducativa/estadocarrera.service";
import {CarreraService} from "@services/institucioneducativa/carrera.service";

@Component({
  selector: 'app-carrera',
  templateUrl: './carrera.component.html',
  styleUrls: ['./carrera.component.scss']
})
export class CarreraComponent implements OnInit {

  /***
   * variables globales, @Input para enlaces de componentes
   * */
  @Input() carrera: CarreraDto;
  @ViewChild('fileInput') fileInput: FileUpload;

  form: FormGroup;
  proceso: string = 'academia';

  lstCarrera: CarreraDto[];
  lstFacultad: FacultadDto[];
  lstEstado: EstadoCarreraDto[];

  enedicion: boolean;

  //#region Variables de la vista
  SIZEFILE = `${environment.SIZEFILE}/`;
  ACCEPTFILES = `${environment.ACCEPTFILES}/`;
  URLFILEUPLOAD = `${environment.HOST}/files/upload/` + this.proceso;
  URLFILEUPLOADTOFIREBASE = `${environment.HOST}/files/uploadToFirebase`;

  uploadedFiles: any[] = [];

  /***
   * Constructor: se agregar los servicios ncesarios
   * **/
  constructor(public appService: AppService,
              public carreraService: CarreraService,
              public estadoService: EstadoCarreraService,
              public facultadService: FacultadService,
              public formBuilder: FormBuilder) {
  }

  /***
   * Constructir para inicializar antes del renderizado de la pagina
   * **/
  ngOnInit() {
    this.carrera = new CarreraDto();
    this.crearForm();
    this.llenarCombos();
  }

  /***
   * Metodos vinculados a componente principal
   * **/
  //Inicializa el formulario para el ingreso de la pagina y datos
  crearForm() {
    this.form = new FormGroup({
      idCarrera: new FormControl('',),
      codigoCarrera: new FormControl('',),
      nombreCarrera: new FormControl('',),
      siglasCarrera: new FormControl('',),
      tituloCarrera: new FormControl('',),
      mencionCarrera: new FormControl('',),
      pathdecretoAprobacionCarrera: new FormControl('',),
      fechacreaCarrera: new FormControl('',),
      fechaactCarrera: new FormControl('',),
      fechacierraCarrera: new FormControl('',),
      activoCarrera: new FormControl('',),
      //autoridadesCarreraListDTO: [];
      //historicoCarreraListDTO: [];
      idEstadoCarreraDTO: new FormControl(null,),
      idFacultadDTO: new FormControl(null,),
      //permisosCarreraListDTO: [];
      //designacionesCarrerasListDTO: [];
      //mallaListDTO: [];
    });
  }

  //Metodo para ejecutar click en el boton subir archivo
  startUpload() {
    try {
      //controlar si el archivo esta vacio
      if (this.fileInput.files.length > 0) {
        let fileName = this.fileInput.files[0].name;
        this.carrera.pathdecretoAprobacionCarrera = fileName;
        this.fileInput.upload();
      }
    } catch (e) {
      console.log(e);
    }
  }

  onUploadToBackend(event) {
    for (let obj of event.files) {
      this.uploadedFiles.push(obj);
      this.appService.msgInfoDetail('info', 'Archivo ' + obj.name + ' cargado. ', '');
    }
  }

  async llenarCombos() {
    await this.carreraService.getAll().subscribe(
      (data) => {
        this.lstCarrera = data;
      },
      error => {
        console.log(error);
      }
    );
    await this.facultadService.getAll().subscribe(
      (data) => {
        this.lstFacultad = data;
      },
      error => {
        console.log(error);
      }
    );
    await this.estadoService.getAll().subscribe(
      (data) => {
        this.lstEstado = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.carrera = item;
      this.form = this.formBuilder.group(this.carrera);

      this.form.controls.idEstadoCarreraDTO.setValue(this.lstEstado
        .find(estado => estado.idEstadoCarrera === this.carrera.idEstadoCarreraNavigation.idEstadoCarrera));

      this.form.controls.idFacultadDTO.setValue(this.lstFacultad
        .find(facultad => facultad.idFacultad === this.carrera.idEstadoCarreraNavigation.idFacultad));



      this.enedicion = true;
    } else {
      this.setearForm();
    }
  }

  /**
   * Métodos para funcionalidad de la pagina
   * **/
  guardar() {
    if (this.form.invalid) {
      this.appService.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.carrera = this.form.value;
      let malla = new Array();
      malla.push(this.carrera.mallaListDTO);
      this.carrera.mallaListDTO = malla;
      console.log('DATA A ENVIAR: '+JSON.stringify(this.carrera));
      this.startUpload();

      this.carreraService.saveObject(this.carrera).subscribe((data: any) => {
        if (!this.carrera.idCarrera) {
          this.appService.msgCreate();
        } else {
          this.appService.msgUpdate();
        }
        this.setearForm();
      });
    }
  }

  setearForm() {
    this.form.reset();
    this.carrera = new CarreraDto();
    this.llenarCombos();
  }

  cancelar() {
    this.setearForm();
    this.appService.msgInfoDetail('info', '', 'Acción Cancelada')
  }
}

