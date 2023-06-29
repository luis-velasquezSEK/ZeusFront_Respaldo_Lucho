import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CampusDto} from "@/dto/CampusDto";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {PaisDto} from "@/dto/PaisDto";
import {RegionDto} from "@/dto/RegionDto";
import {ProvinciaDto} from "@/dto/ProvinciaDto";
import {CantonDto} from "@/dto/CantonDto";
import {ParroquiaDto} from "@/dto/ParroquiaDto";
import {CiudadDto} from "@/dto/CiudadDto";
import {SedeInstitucionDto} from "@/dto/SedeInstitucionDto";
import {AppService} from "@services/app.service";
import {SedeService} from "@services/institucioneducativa/sede.service";
import {CampusService} from "@services/institucioneducativa/campus.service";
import {PaisService} from "@services/segmentacion/pais.service";
import {RegionService} from "@services/segmentacion/region.service";
import {ProvinciaService} from "@services/segmentacion/provincia.service";
import {CantonService} from "@services/segmentacion/canton.service";
import {CiudadService} from "@services/segmentacion/ciudad.service";
import {ParroquiaService} from "@services/segmentacion/parroquia.service";
import {FacultadDto} from "@/dto/FacultadDto";
import {EstadoFacultadDto} from "@/dto/EstadoFacultadDto";
import {FacultadService} from "@services/institucioneducativa/facultad.service";
import {EstadoFacultadService} from "@services/institucioneducativa/estadofacultad.service";
import {environment} from "../../../../environments/environment";
import {FileUpload} from "primeng/fileupload";

@Component({
  selector: 'app-facultad',
  templateUrl: './facultad.component.html',
  styleUrls: ['./facultad.component.scss']
})
export class FacultadComponent implements OnInit {

  /***
   * variables globales, @Input para enlaces de componentes
   * */
  @Input() facultad: FacultadDto;
  @ViewChild('fileInput') fileInput: FileUpload;

  form: FormGroup;
  proceso: string = 'academia';

  lstFacultad: FacultadDto[];
  lstCampus: CampusDto[];
  lstEstado: EstadoFacultadDto[];

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
              public facultadService: FacultadService,
              public estadoService: EstadoFacultadService,
              public campusService: CampusService,
              public formBuilder: FormBuilder) {
  }

  /***
   * Constructir para inicializar antes del renderizado de la pagina
   * **/
  ngOnInit() {
    this.facultad = new FacultadDto();
    this.crearForm();
    this.llenarCombos();
  }

  /***
   * Metodos vinculados a componente principal
   * **/
  //Inicializa el formulario para el ingreso de la pagina y datos
  crearForm() {
    this.form = new FormGroup({
      idFacultad: new FormControl('',),
      nombreFacultad: new FormControl('',),
      descripcionFacultad: new FormControl('',),
      codigoFacultad: new FormControl('',),
      resolucionFacultad: new FormControl('',),
      fechacreaFacultad: new FormControl('',),
      fechaactFacultad: new FormControl('',),
      fechacierreFacultad: new FormControl('',),
      fecharegistroFacultad: new FormControl('',),
      activoFacultad: new FormControl('',),
      //empleadoListDTO: [];
      //autoridadesFacultadListDTO: [];
      //carreraListDTO: [];
      idCampusDTO: new FormControl(null,),
      idEstadoFacultadDTO: new FormControl(null,),
      //historicoFacultadListDTO: [];
      //designacionesFacultadListDTO: [];
    });
  }

  //Metodo para ejecutar click en el boton subir archivo
  startUpload() {
    try {
      //controlar si el archivo esta vacio
      if (this.fileInput.files.length > 0) {
        let fileName = this.fileInput.files[0].name;
        this.facultad.resolucionFacultad = fileName;
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
    await this.facultadService.getAll().subscribe(
      (data: FacultadDto[]) => {
        this.lstFacultad = data;
      },
      error => {
        console.log(error);
      }
    );
    await this.campusService.getAll().subscribe(
      (data: CampusDto[]) => {
        this.lstCampus = data;
      },
      error => {
        console.log(error);
      }
    );
    await this.estadoService.getAll().subscribe(
      (data: EstadoFacultadDto[]) => {
        this.lstEstado = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.facultad = item;
      this.form = this.formBuilder.group(this.facultad);

      this.form.controls.idEstadoFacultadDTO.setValue(this.lstEstado
        .find(estado => estado.idEstadoFacultad === this.facultad.idEstadoFacultadNavigation.idEstadoFacultad));

      this.form.controls.idCampusDTO.setValue(this.lstCampus
        .find(campus => campus.idCampus === this.facultad.idCampusNavigation.idCampus));

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
      this.facultad = this.form.value;

      /*this.campusService.getById(this.facultad.idCampusDTO.idCampus).subscribe(
        data => {
          this.facultad.idCampusDTO = data;
        }, error => {
          console.log('ERROR EN CAMPUS: ' + error);
        }
      );
      this.estadoService.getById(this.facultad.idEstadoFacultadDTO.idEstadoFacultad).subscribe(
        data => {
          this.facultad.idEstadoFacultadDTO = data;
        }, error => {
          console.log('ERROR EN ESTADO' + error);
        }
      );*/

      console.log('DATAA ENVIAR: '+JSON.stringify(this.facultad));

      this.startUpload();

      this.facultadService.saveObject(this.facultad).subscribe((data: any) => {
        if (!this.facultad.idFacultad) {
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
    this.facultad = new FacultadDto();
    this.llenarCombos();
  }

  cancelar() {
    this.setearForm();
    this.appService.msgInfoDetail('info', '', 'Acción Cancelada')

  }
}
