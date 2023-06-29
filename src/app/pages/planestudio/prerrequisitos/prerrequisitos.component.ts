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
import {PrerrequisitosPlanEstudioDto} from "@/dto/PrerrequisitosPlanEstudioDto";
import {TipoPrerrequisitoPlanEstudioDto} from "@/dto/TipoPrerrequisitoPlanEstudioDto";
import {PrerrequisitoService} from "@services/prerrequisito/prerrequisito.service";
import {TipoprerrequisitoService} from "@services/prerrequisito/tipoprerrequisito.service";
import {CodigoCumplimientoPrerrequisitosDto} from "@/dto/CodigoCumplimientoPrerrequisitosDto";
import {CodigoCumplimientoService} from "@services/prerrequisito/codigocumplimiento.service";
import {PlanEstudioServiceEmiter} from "@pages/planestudio/PlanEstudioService";

@Component({
  selector: 'app-prerrequisitos',
  templateUrl: './prerrequisitos.component.html',
  styleUrls: ['./prerrequisitos.component.scss']
})
export class PrerrequisitosComponent implements OnInit {
  //#region Variables
  @Input() prerrequisitoInput: PrerrequisitosPlanEstudioDto = new PrerrequisitosPlanEstudioDto();
  @Input() lstPrerrequisitoInput: PrerrequisitosPlanEstudioDto[];
  @ViewChild('fileInput') fileInput: FileUpload;
  proceso: string = 'prerrequisitos';

  //#region Variables de la vista
  SIZEFILE = `${environment.SIZEFILE}/`;
  ACCEPTFILES = `${environment.ACCEPTFILES}/`;
  URLFILEUPLOAD = `${environment.HOST}/files/upload/` + this.proceso;
  URLFILEUPLOADTOFIREBASE = `${environment.HOST}/files/uploadToFirebase`;

  //#region Variables para formularios
  form: FormGroup;

  //# region variables de objetos
  prerrequisito: PrerrequisitosPlanEstudioDto = new PrerrequisitosPlanEstudioDto();
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
  tipoPrerrequisitoSelected: any;
  tipoPrerrequisitoShow: TipoPrerrequisitoPlanEstudioDto = new TipoPrerrequisitoPlanEstudioDto();
  codigoCumplimientoSelect:any;
  codigoCumplimientoShow: CodigoCumplimientoPrerrequisitosDto = new CodigoCumplimientoPrerrequisitosDto();

  //#region variables de listas
  lstPrerrequisito: PrerrequisitosPlanEstudioDto[];
  lstTipoPrerrequisito: TipoPrerrequisitoPlanEstudioDto[];
  lstEstadoPlan: EstadoPlanEstudioDTO[];
  lstMateriaPrincipal: MateriaPrincipalDto[];
  listFacultad: FacultadDto[];
  listCarrera: CarreraDto[];
  listMalla: MallaDto[];
  listModalidadMalla: ModalidadMallaDto[];
  listNivelEstudios: NivelEstudioDto[];
  lstMateriaToSelect: MateriasSelectDto[];
  lstCodigoCumplimiento: CodigoCumplimientoPrerrequisitosDto[];


  //region variables de catalogos
  sortOptions: SelectItem[];
  sortOrder: number;
  sortField: string;
  sortKey: string;
  nombrePrerrequisito: string;
  observacionPrerrequisito: string;
  isMateria: boolean = true;
  isFile: boolean;
  index = 0;
  message: string;
  uploadedFiles: any[] = [];
  enedicion: boolean;

  constructor(public appService: AppService,
              public formBuilder: FormBuilder,
              public planEstudioService: PlanEstudioServiceEmiter,
              public facultadService: FacultadService,
              public carreraService: CarreraService,
              public mallaService: MallaService,
              public modalidadMallaService: ModalidadMallaService,
              public nivelEstudioService: NivelesEstudioService,
              public materiacatalogoService: MateriasCatalogoService,
              public estadoplanservice: EstadoPlanService,
              public materiaprincipalService: MateriaPrincipalPlanService,
              public prerrequisitoService: PrerrequisitoService,
              public tipoPrerrequisitoService: TipoprerrequisitoService,
              public codigoCumplimientoService: CodigoCumplimientoService,
              public fileService: FileService,
              private storage: AngularFireStorage,
  ) {
  }

  ngOnInit(): void {
    this.prerrequisito = new PrerrequisitosPlanEstudioDto();
    this.lstPrerrequisito = new Array();
    this.prerrequisito.idPpestudios = 0;
    this.crearForm();
    this.llenarCombofacultad();
    this.llenarCompoTipoCorrequisito();
    this.llenarComboCodigoCumplimiento();
    this.sortOptions = [
      {label: 'Nombre A-Z', value: 'materia.nombreMateriap'},
      {label: 'Nombre Z-A', value: '!materia.nombreMateriap'}
    ];
  }

  //Metodo para ejecutar click en el boton subir archivo
  startUpload(){
    this.fileInput.upload();
  }

  setSeleccionado(item) {
    if (item !== null) {
      this.prerrequisito = item;
      this.form = this.formBuilder.group(this.prerrequisito);
      this.tipoPrerrequisitoSelected = this.prerrequisito.idTipoPpeDTO;
      this.codigoCumplimientoSelect = this.prerrequisito.idCodigoCumplimientoprDTO;

      this.enedicion = true;
    } else {
      this.setearForm();
    }
  }

  setListaPrerrequisitoEmiter(lista) {
    this.lstPrerrequisito = lista;
  }

  crearForm() {
    this.form = new FormGroup({
      idPpestudios: new FormControl('',),
      nombrePpestudios: new FormControl('',),
      cumpleMateria: new FormControl('',),
      descripcionPpestudios: new FormControl('',),
      activoMateriaPpestudios: new FormControl('',),
      /*idCodigoCumplimientoprDTO: new FormControl('',),
      planEstudiosDTO: new FormControl('',),
      idTipoPpeDTO: new FormControl('',),
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

  llenarComboCodigoCumplimiento() {
    this.codigoCumplimientoService.getAll().subscribe(data => {
      this.lstCodigoCumplimiento = data;
    });
  }

  llenarComboTipoPrerrequisito(){
    this.tipoPrerrequisitoService.getAll().subscribe(data => {
      this.lstTipoPrerrequisito = data;
    });
  }

  llenarCompoTipoCorrequisito() {
    this.tipoPrerrequisitoService.getAll().subscribe(data => {
      this.lstTipoPrerrequisito = data;
    });
  }

  llenarDetalleTipoPrerrequisito(event) {
    try {
      this.tipoPrerrequisitoShow = this.tipoPrerrequisitoSelected;
      if (this.tipoPrerrequisitoShow.nombreTipoPpe.indexOf('MATERIA') === 0) {
        this.isMateria = true;
        this.isFile = false;
      } else if (this.tipoPrerrequisitoShow.nombreTipoPpe.indexOf('CERTIFICADO') === 0) {
        this.isMateria = false;
        this.isFile = true;
        this.lstMateriaToSelect = new Array();
      } else {
        this.isMateria = false;
        this.isFile = false;
        this.lstMateriaToSelect = new Array();
      }
    } catch (e) {
      this.tipoPrerrequisitoShow = new TipoPrerrequisitoPlanEstudioDto();
      this.tipoPrerrequisitoSelected = null;
      this.isMateria = false;
      this.isFile = false;
    }
  }

  llenarDetalleFacultad(event) {
    try {
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
      this.index = 0;
      this.materiaPrincipal = new MateriaPrincipalDto();
      this.lstMateriaToSelect = new Array();
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
      this.index = 0;
      this.materiaPrincipal = new MateriaPrincipalDto();
      this.lstMateriaToSelect = new Array();
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
      this.index = 0;
      this.materiaPrincipal = new MateriaPrincipalDto();
      this.lstMateriaToSelect = new Array();
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
      this.index = 0;
      this.materiaPrincipal = new MateriaPrincipalDto();
      this.lstMateriaToSelect = new Array();
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
      this.lstMateriaToSelect = new Array();
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
      this.prerrequisito = this.form.value;
      this.prerrequisito.idTipoPpeDTO = this.tipoPrerrequisitoSelected;
      if (this.enedicion) {
        this.lstPrerrequisito[this.findIndexById(this.prerrequisito.idPpestudios)] = this.prerrequisito;
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

      this.lstPrerrequisito = [...this.lstPrerrequisito];
      this.planEstudioService.setPrerrequisitoInput(this.lstPrerrequisito);


    }
  }

  agregarMaterias() {
    // bloque try and catch para capturar errores
    try{
      for (let obj of this.lstMateriaToSelect) {
        var index: number = 0;
        index = this.lstPrerrequisito.indexOf(this.lstPrerrequisito.find(x => x.nombrePpestudios == obj.materia.codigoMateriap));
        console.log('INDEX ENCONTRADO: ' + index);
        if (obj.selected && index === -1) {
          let prerrequisitoInsert = new PrerrequisitosPlanEstudioDto();
          prerrequisitoInsert = this.form.value;
          prerrequisitoInsert.nombrePpestudios = obj.materia.codigoMateriap;
          prerrequisitoInsert.idTipoPpeDTO = this.tipoPrerrequisitoSelected;
          prerrequisitoInsert.idCodigoCumplimientoprDTO = this.codigoCumplimientoSelect;
          prerrequisitoInsert.idPpestudios = (this.lstPrerrequisito.length + 1);
          this.lstPrerrequisito.push(prerrequisitoInsert);
          this.appService.msgCreate();
          this.setearForm();
        } else if (obj.selected && index === 0) {
          this.appService.msgInfoDetail('warn', 'Prerrequisito', 'Materia existente !');
        }
      }
    }catch (e) {
      console.log("ERRRO: "+e);
    }
  }

  agregarArchivos() {

    console.log('TAMAÑO ARCHIVOS: ' + this.uploadedFiles.length);
    for (let obj of this.uploadedFiles) {
      let prerrequisitoInsert = new PrerrequisitosPlanEstudioDto();
      prerrequisitoInsert = this.form.value;
      prerrequisitoInsert.nombrePpestudios = obj.name;
      prerrequisitoInsert.nombrePpestudios = obj.name;
      prerrequisitoInsert.idCodigoCumplimientoprDTO = this.codigoCumplimientoSelect;
      prerrequisitoInsert.idTipoPpeDTO = this.tipoPrerrequisitoSelected;
      prerrequisitoInsert.idPpestudios = (this.lstPrerrequisito.length + 1);
      this.lstPrerrequisito.push(prerrequisitoInsert);
      this.appService.msgCreate();
    }
    this.setearForm();
  }


  findIndexById(id: number): number {
    let index = 0;
    for (let i = 0; i < this.lstPrerrequisito.length; i++) {
      if (this.lstPrerrequisito[i].idPpestudios === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  createId(): number {
    return (this.lstPrerrequisito.length + 1);
  }

  setearForm() {
    this.form.reset();

    this.prerrequisito = new PrerrequisitosPlanEstudioDto();
    this.tipoPrerrequisitoSelected = null;
    this.codigoCumplimientoSelect = null;
    this.enedicion = false;

  }

  cancelar() {
    this.appService.msgInfoDetail('info', '', 'Acción Cancelada')
    this.setearForm();
  }
}


