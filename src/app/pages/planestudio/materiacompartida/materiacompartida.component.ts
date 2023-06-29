import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CorrequisitoDto} from "@/dto/CorrequisitoDto";
import {FileUpload} from "primeng/fileupload";
import {environment} from "../../../../environments/environment";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MateriaPrincipalDto} from "@/dto/materia-principal-plan-dto";
import {FacultadDto} from "@/dto/FacultadDto";
import {CarreraDto} from "@/dto/CarreraDto";
import {MallaDto} from "@/dto/MallaDto";
import {ModalidadMallaDto} from "@/dto/ModalidadMallaDto";
import {NivelEstudioDto} from "@/dto/NivelEstudioDto";
import {TipoCorrequisitoDto} from "@/dto/TipoCorrequisitoDto";
import {EstadoPlanEstudioDTO} from "@/dto/estado-plan-dto";
import {MateriasSelectDto} from "@/dto/MateriasSelectDto";
import {SelectItem} from "primeng/api";
import {AppService} from "@services/app.service";
import {FacultadService} from "@services/institucioneducativa/facultad.service";
import {CarreraService} from "@services/institucioneducativa/carrera.service";
import {MallaService} from "@services/mallas/malla.service";
import {ModalidadMallaService} from "@services/mallas/modalidadmalla.service";
import {NivelesEstudioService} from "@services/planestudio/nivelesestudio.service";
import {MateriasCatalogoService} from "@services/catalogos/materiascatalogo.service";
import {EstadoPlanService} from "@services/planestudio/estadoplan.service";
import {MateriaPrincipalPlanService} from "@services/planestudio/materiaprincipalplan.service";
import {CorrequisitoService} from "@services/correquisito/correquisito.service";
import {TipoCorrequisitoService} from "@services/correquisito/tipocorrequisito.service";
import {FileService} from "@services/utils/file.service";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {HttpEventType, HttpParams, HttpResponse} from "@angular/common/http";
import {PlanEstudioServiceEmiter} from "@pages/planestudio/PlanEstudioService";

@Component({
  selector: 'app-materiacompartida',
  templateUrl: './materiacompartida.component.html',
  styleUrls: ['./materiacompartida.component.scss']
})
export class MateriacompartidaComponent implements OnInit {
  //#region Variables
  @Input() correquisitoInput: CorrequisitoDto = new CorrequisitoDto();
  @Input() lstCorrequisitoInput: CorrequisitoDto[];
  @ViewChild('fileInput') fileInput: FileUpload;
  proceso: string = 'correquisitos';

  //#region Variables de la vista
  SIZEFILE = `${environment.SIZEFILE}/`;
  ACCEPTFILES = `${environment.ACCEPTFILES}/`;
  URLFILEUPLOAD = `${environment.HOST}/files/upload/` + this.proceso;
  URLFILEUPLOADTOFIREBASE = `${environment.HOST}/files/uploadToFirebase`;

  //#region Variables para formularios
  form: FormGroup;

  //# region variables de objetos
  correquisito: CorrequisitoDto = new CorrequisitoDto();
  materiaPrincipal: MateriaPrincipalDto = new MateriaPrincipalDto();
  facultadSelected: any;
  facultadShow: FacultadDto = new FacultadDto();
  carreraSelected: any;
  carreraShow: CarreraDto = new CarreraDto();
  mallaSelected: any;
  mallaShow: MallaDto = new MallaDto();
  modalidadMallaSelected: any;
  modalidadMallaShow: ModalidadMallaDto = new ModalidadMallaDto();
  nivelEstudioSelected: any;
  nivelEstudiosShow: NivelEstudioDto = new NivelEstudioDto();
  tipoCorrequisitoSelected: any;
  tipoCorrequisitoShow: TipoCorrequisitoDto = new TipoCorrequisitoDto();

  //#region variables de listas
  lstCorrequisito: CorrequisitoDto[];
  lstTipoCorrequisito: TipoCorrequisitoDto[];
  lstEstadoPlan: EstadoPlanEstudioDTO[];
  lstMateriaPrincipal: MateriaPrincipalDto[];
  listFacultad: FacultadDto[];
  listCarrera: CarreraDto[];
  listMalla: MallaDto[];
  listModalidadMalla: ModalidadMallaDto[];
  listNivelEstudios: NivelEstudioDto[];
  lstMateriaToSelect: MateriasSelectDto[];
  lstMateriaToEmit: MateriasSelectDto[];


  //region variables de catalogos
  sortOptions: SelectItem[];
  sortOrder: number;
  sortField: string;
  sortKey: string;
  nombreCorrequisito: string;
  observacionCorrequisito: string;
  isMateria: boolean;
  isFile: boolean;
  index = 0;
  message: string;
  uploadedFiles: any[] = [];
  enedicion: boolean;

  constructor(public appService: AppService,
              public formBuilder: FormBuilder,
              public facultadService: FacultadService,
              public carreraService: CarreraService,
              public mallaService: MallaService,
              public modalidadMallaService: ModalidadMallaService,
              public nivelEstudioService: NivelesEstudioService,
              public materiacatalogoService: MateriasCatalogoService,
              public estadoplanservice: EstadoPlanService,
              public materiaprincipalService: MateriaPrincipalPlanService,
              public correquisitoService: CorrequisitoService,
              public tipoCorrequisitoService: TipoCorrequisitoService,
              public fileService: FileService,
              private storage: AngularFireStorage,
              private planEstudioService: PlanEstudioServiceEmiter,

  ) {
  }

  ngOnInit(): void {
    this.correquisito = new CorrequisitoDto();
    this.lstCorrequisito = new Array();
    this.lstMateriaToEmit = new Array();
    this.correquisito.idCorrequisito = 0;
    this.crearForm();
    this.llenarCombofacultad();
    this.llenarCompoTipoCorrequisito();
    this.sortOptions = [
      {label: 'Nombre A-Z', value: 'materia.nombreMateriap'},
      {label: 'Nombre Z-A', value: '!materia.nombreMateriap'}
    ];
  }


  escogerMateria(item) {

    if(item.selected){
      this.lstMateriaToEmit.push(item);
      console.log('seleccionado');
    }else{
      this.lstMateriaToEmit.splice(this.lstMateriaToEmit.indexOf(item),1);
      console.log('no seleccionado');
    }

    this.planEstudioService.setCompartidaInput(this.lstMateriaToEmit);


  }


  //Metodo para ejecutar click en el boton subir archivo
  startUpload(){
    this.fileInput.upload();
  }

  setSeleccionado(item) {
    console.log('EMITIDO EN EDICION Y ELIMINACION: ' + JSON.stringify(item));

    if (item !== null) {
      this.correquisito = item;
      this.form = this.formBuilder.group(this.correquisito);
      this.tipoCorrequisitoSelected = this.correquisito.idTipoCorrequisitoDTO;

      this.enedicion = true;
    } else {
      this.setearForm();
    }
  }


  setListaCorrequisitoEmiter(lista) {
    this.lstCorrequisito = lista;
  }

  crearForm() {
    this.form = new FormGroup({
      idCorrequisito: new FormControl('',),
      codMateriaCorrequisito: new FormControl('',),
      pathCorrequisito: new FormControl('',),
      observacionCorrequisito: new FormControl('',),
      cumpleMateriaCorrequisito: new FormControl('',),
      activoMateriaCorrequisito: new FormControl('',),
      /*planEstudiosDTO: new FormControl('',),
      idTipoCorrequisitoDTO: new FormControl('',),
       */
    });
    //this.form = this.formBuilder.group(this.tipoPlan);
  }

  onUploadToFirebase(event) {
    this.uploadedFiles = event.files;
    for (let i = 0; i < this.uploadedFiles.length; i++) {
      this.subirArchivos(this.uploadedFiles[i]);
    }
    this.uploadedFiles = [];

  }

  onUploadToBackend(event) {
    for (let obj of event.files) {
      this.uploadedFiles.push(obj);
      this.appService.msgInfoDetail('info', 'Archivo ' + obj.name + ' cargado. ', '');
    }
  }

  onUploadToBackendIndirect(event) {
    this.uploadedFiles = event.files;
    this.message = '';
    for (let i = 0; i < this.uploadedFiles.length; i++) {
      this.upload(this.uploadedFiles[i]);
      this.appService.msgInfoDetail('info', 'Archivo ' + this.uploadedFiles[i].name + ' cargado. ', '');
    }
    //this.uploadedFiles = [];
  }

  verificarMateria() {
    try {
      console.log('BOTON VERIFICAR MATERIAS');
      for (let i = 0; i < this.uploadedFiles.length; i++) {
        //this.upload(this.uploadedFiles);
        this.appService.msgInfoDetail('info', 'Archivo ' + this.uploadedFiles[i].name + ' cargado. ', '');
      }

      for (let obj of this.lstMateriaToSelect) {
        console.log('MATERIAS VERIFICAR SELECT EN NGFOR: ' + JSON.stringify(obj));
      }
    } catch (e) {
      console.log('LOG ERRR BOTON: ' + e);
    }

  }

  upload(file) {

    let nombre = this.appService.removeSpecialCharacters(file.name);
    this.fileService.uploadSingleFile(file, this.proceso, nombre).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
        } else if (event instanceof HttpResponse) {
          this.appService.msgInfoDetail('info', 'File ' + file.name + ' Uploaded ', event.body.message);
        }
      },
      err => {
        this.appService.msgInfoDetail('error', 'File ' + file.name, 'Error al Subir el Archivo');
      });
  }

  deleteFile(filename: string) {
    this.fileService.deleteFile(filename).subscribe(res => {
      this.message = res['message'];
    });
  }

  /***
   * Llama a servicio para subir archivos a FIRESTORAGE
   */
  subirArchivos(file) {
    this.appService.subirArchivosAFirebase(file);
  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }


  llenarCombofacultad() {
    this.facultadService.getAll().subscribe(data => {
      this.listFacultad = data;
    });
  }

  llenarCompoTipoCorrequisito() {
    this.tipoCorrequisitoService.getAll().subscribe(data => {
      this.lstTipoCorrequisito = data;
    });
  }

  llenarDetalleTipoCorrequsito(event) {
    try {
      this.tipoCorrequisitoShow = this.tipoCorrequisitoSelected;
      if (this.tipoCorrequisitoShow.nombreTipoCorrequisito.indexOf('MATERIA') === 0) {
        this.isMateria = true;
        this.isFile = false;
      } else if (this.tipoCorrequisitoShow.nombreTipoCorrequisito.indexOf('CERTIFICADO') === 0) {
        this.isMateria = false;
        this.isFile = true;
        this.lstMateriaToSelect = new Array();
      } else {
        this.isMateria = false;
        this.isFile = false;
        this.lstMateriaToSelect = new Array();
      }
    } catch (e) {
      this.tipoCorrequisitoShow = new TipoCorrequisitoDto();
      this.tipoCorrequisitoSelected = null;
      this.isMateria = false;
      this.isFile = false;
    }
  }

  llenarDetalleFacultad(event) {
    try {
      //llena el combo de carrera y setea carrera y carrerashow
      /*this.carreraService.findByFacultad(this.facultadSelected.idFacultad).subscribe(data => {
        this.listCarrera = data;
      });

       */
      if (this.facultadSelected !== null) {
        this.facultadShow = this.facultadSelected;
        this.listCarrera = this.facultadSelected.carreraListDTO;
      } else {
        this.facultadShow = new FacultadDto();
        this.listCarrera = new Array();
        this.listMalla = new Array();
        this.listModalidadMalla = new Array();
        this.listNivelEstudios = new Array();
      }
      this.carreraSelected = null;
      this.carreraShow = new CarreraDto();
      //Setea todos los combos y shows

      this.mallaSelected = null;
      this.mallaShow = new MallaDto();
      this.modalidadMallaSelected = null;
      this.modalidadMallaShow = new ModalidadMallaDto();
      this.nivelEstudioSelected = null;
      this.nivelEstudiosShow = new NivelEstudioDto();
    } catch (error) {
      console.log('ERROR LLENAR DETALLE FACULTAD: ' + JSON.stringify(error));
    }
  }

  llenarDetalleCarrera(event) {

    //llena el combo de carrera y setea carrera y carrerashow
    try {
      this.carreraService.getById(this.carreraSelected.idCarrera).subscribe(data => {
        this.carreraShow = data;

        this.listMalla = this.carreraShow.mallaListDTO;

        //Setea todos los combos y shows

        this.mallaSelected = null;
        this.mallaShow = new MallaDto();
        this.modalidadMallaSelected = null;
        this.modalidadMallaShow = new ModalidadMallaDto();
        this.nivelEstudioSelected = null;
        this.nivelEstudiosShow = new NivelEstudioDto();
      });
    } catch (e) {
      console.log('ERROR' + e);
      this.listMalla = new Array();
      this.listModalidadMalla = new Array();
      this.listNivelEstudios = new Array();
      this.carreraSelected = null;
      this.carreraShow = new CarreraDto();
      this.mallaSelected = null;
      this.mallaShow = new MallaDto();
      this.modalidadMallaSelected = null;
      this.modalidadMallaShow = new ModalidadMallaDto();
      this.nivelEstudioSelected = null;
      this.nivelEstudiosShow = new NivelEstudioDto();
    }


  }

  llenarDetalleMalla(event) {

    try {
      //llena el combo de carrera y setea carrera y carrerashow
      this.mallaService.getById(this.mallaSelected.idMalla).subscribe(data => {
        this.mallaShow = data;

        this.listModalidadMalla = this.mallaShow.modalidadMallaListDTO;

        //Setea todos los combos y shows
        this.modalidadMallaSelected = null;
        this.modalidadMallaShow = new ModalidadMallaDto();
        this.nivelEstudioSelected = null;
        this.nivelEstudiosShow = new NivelEstudioDto();
      });
    } catch (e) {
      console.log('ERROR' + e);
      this.listModalidadMalla = new Array();
      this.listNivelEstudios = new Array();
      this.mallaSelected = null;
      this.mallaShow = new MallaDto();
      this.modalidadMallaSelected = null;
      this.modalidadMallaShow = new ModalidadMallaDto();
      this.nivelEstudioSelected = null;
      this.nivelEstudiosShow = new NivelEstudioDto();
    }
  }

  llenarDetalleModalidadMalla(event) {

    try {
      //llena el combo de carrera y setea carrera y carrerashow
      this.modalidadMallaService.getById(this.modalidadMallaSelected.idModalidadMalla).subscribe(data => {
        this.modalidadMallaShow = data;

        this.listNivelEstudios = this.modalidadMallaShow.nivelEstudioListDTO;

        //Setea todos los combos y shows
        this.nivelEstudioSelected = null;
        this.nivelEstudiosShow = new NivelEstudioDto();

      });
    } catch (e) {
      console.log('ERROR' + e);
      this.listNivelEstudios = new Array();
      this.modalidadMallaSelected = null;
      this.modalidadMallaShow = new ModalidadMallaDto();
      this.nivelEstudioSelected = null;
      this.nivelEstudiosShow = new NivelEstudioDto();
    }

  }

  llenarDetalleNivelEstudios(event) {
    try {
      //llena el combo de carrera y setea carrera y carrerashow
      console.log('ID NIVEL ESTUDIO SELECTED: ' + this.nivelEstudioSelected.idNivelEstudio);
      this.nivelEstudioService.getById(this.nivelEstudioSelected.idNivelEstudio).subscribe(data => {
        this.nivelEstudiosShow = data;
        let params = new HttpParams()
          .set('idNivelEstudio', this.nivelEstudioSelected.idNivelEstudio);
        this.materiaprincipalService.getByNivel(params).subscribe(data => {
          this.lstMateriaPrincipal = data;
          this.index = 0;
          this.materiaPrincipal = new MateriaPrincipalDto();
          this.lstMateriaToSelect = new Array();
          for (let obj of this.lstMateriaPrincipal) {
            const materiaSelected = new MateriasSelectDto();
            materiaSelected.materia = obj;
            materiaSelected.selected = false;
            this.lstMateriaToSelect.push(materiaSelected);
          }
        }), (error) => {
          console.log(error);
        }
      });
    } catch (e) {
      console.log('ERROR' + e);
      this.nivelEstudioSelected = null;
      this.nivelEstudiosShow = new NivelEstudioDto();
      this.index = 0;
      this.materiaPrincipal = new MateriaPrincipalDto();
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
      this.correquisito = this.form.value;
      this.correquisito.idTipoCorrequisitoDTO = this.tipoCorrequisitoSelected;
      if (this.enedicion) {
        this.lstCorrequisito[this.findIndexById(this.correquisito.idCorrequisito)] = this.correquisito;
        this.appService.msgUpdate();
        this.enedicion = false;
        this.setearForm();
      } else {
        if (this.isMateria) {
          this.agregarMaterias();
        } else {
          this.agregarArchivos();
        }
      }

      this.lstCorrequisito = [...this.lstCorrequisito];


    }
  }

  agregarMaterias() {
    for (let obj of this.lstMateriaToSelect) {
      var index: number = 0;
      index = this.lstCorrequisito.indexOf(this.lstCorrequisito.find(x => x.codMateriaCorrequisito == obj.materia.codigoMateriap));
      console.log('INDEX ENCONTRADO: ' + index);
      if (obj.selected && index === -1) {
        let correquisitoInsert = new CorrequisitoDto();
        correquisitoInsert = this.form.value;
        correquisitoInsert.codMateriaCorrequisito = obj.materia.codigoMateriap;
        correquisitoInsert.idTipoCorrequisitoDTO = this.tipoCorrequisitoSelected;
        correquisitoInsert.idCorrequisito = (this.lstCorrequisito.length + 1);
        this.lstCorrequisito.push(correquisitoInsert);
        this.appService.msgCreate();
        this.setearForm();
      } else if (obj.selected && index === 0) {
        this.appService.msgInfoDetail('warn', 'Correquisito', 'Materia existente !');
      }
    }
  }


  agregarArchivos() {

    console.log('TAMAÑO ARCHIVOS: ' + this.uploadedFiles.length);
    for (let obj of this.uploadedFiles) {
      let correquisitoInsert = new CorrequisitoDto();
      correquisitoInsert = this.form.value;
      correquisitoInsert.codMateriaCorrequisito = obj.name;
      correquisitoInsert.pathCorrequisito = this.appService.removeSpecialCharacters(obj.name);

      correquisitoInsert.idTipoCorrequisitoDTO = this.tipoCorrequisitoSelected;
      correquisitoInsert.idCorrequisito = (this.lstCorrequisito.length + 1);
      this.lstCorrequisito.push(correquisitoInsert);
      this.appService.msgCreate();
    }
    this.setearForm();
  }


  findIndexById(id: number): number {
    let index = 0;
    for (let i = 0; i < this.lstCorrequisito.length; i++) {
      if (this.lstCorrequisito[i].idCorrequisito === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  createId(): number {
    return (this.lstCorrequisito.length + 1);
  }

  setearForm() {

    this.form.reset();

    this.correquisito = new CorrequisitoDto(),
      this.tipoCorrequisitoSelected = null;
    this.enedicion = false;

  }

  cancelar() {
    this.appService.msgInfoDetail('info', '', 'Acción Cancelada')
    this.setearForm();
  }
}


