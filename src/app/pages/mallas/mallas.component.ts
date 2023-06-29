import { Component, Input, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { FileUpload } from "primeng/fileupload";
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule } from "@angular/forms";
import { environment } from "../../../environments/environment";
import { AppService } from "@services/app.service";

import { MallaDto } from '@/dto/MallaDto';
import { CarreraDto } from '@/dto/CarreraDto';
import { EstadoMallaDto } from '@/dto/EstadoMallaDto';
import { FacultadDto } from '@/dto/FacultadDto';

import { MallaService } from '@services/mallas/malla.service';
import { CarreraService } from '@services/institucioneducativa/carrera.service';
import { EstadomallaService } from '@services/mallas/estadomalla.service';
import { FacultadService } from '@services/institucioneducativa/facultad.service';

import { FileService } from '@services/utils/file.service';
import { ConfirmationService, LazyLoadEvent, PrimeIcons } from 'primeng/api';
import { Table } from "primeng/table";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-mallas',
  templateUrl: './mallas.component.html',
  styleUrls: ['./mallas.component.scss']
})
export class MallasRegistroComponent implements OnInit {
  @Input() mallaDto: MallaDto;
  @ViewChild('fileInput') fileInput: FileUpload;

  contentType: 'application/json'
  form: FormGroup;
  proceso: string = 'malla';

  mallaCatalogo: MallaDto;

  sections: any[];
  estado: any;
  // facultad: any;
  pathdecretoCesMalla: any;

  FacultadSelected: any;
  FacultadShow: FacultadDto = new FacultadDto();
  CarreraSelected: any;
  CarreraShow: CarreraDto = new CarreraDto();

  lstMalla: MallaDto[];
  lstEstadoMalla: EstadoMallaDto[];
  lstCarrera: CarreraDto[];
  lstFacultad: FacultadDto[];

  enedicion: boolean;
  loadReady: boolean;

  /**
   * CARGA DE SPINNER
   */
  //loadReady: boolean;

  //imageURL: string = 'https://www.coordinadora.com/wp-content/uploads/sidebar_usuario-corporativo.png'

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
    public formBuilder: FormBuilder,
    public EstadoMallaServices: EstadomallaService,
    public CarreraServices: CarreraService,
    public MallaService: MallaService,
    public FacultadService: FacultadService,
    public formModule: FormsModule,
    private fileService: FileService,
    private confirmationService: ConfirmationService,
  ) {
    this.loadReady = false
  }

  /***
   * Constructir para inicializar antes del renderizado de la pagina
   * **/
  ngOnInit() {
    this.mallaDto = new MallaDto();
    this.crearForm();
    this.llenarMalla()
    this.llenarCombos(0);
    this.llenarSecciones();
    /*document.getElementById("imageUpload").addEventListener('click', function () {
      document.getElementById("file-input").click();
    })*/
    //this.form.controls['cupoCesMalla'].disable()
  }
  
  /**
   * Se llena las secciones para el timeline
   * ****/
   llenarSecciones() {
    this.sections = [
      {
        index: 1,
        header: 'Datos Generales',
        subheader: 'Registro de la informacion necesaria para el proceso de la creacion de la malla.',
        icon: PrimeIcons.BOOK,
        color: '#9C27B0',
        // image: 'planEstudio.png'
      },
      {
        index: 2,
        header: 'Franja Horaria',
        // subheader: 'Tipos de materia y Uoc respectiva para ser asignada.',
        icon: 'fa fa-clock-o',
        color: '#673AB7',
      },
      {
        index: 3,
        header: 'Malla',
        // subheader: 'Nivel reflejado en conjunto con varios aspectos como: malla, modalidad, carrera y facultad',
        icon: 'fa fa-graduation-cap',
        color: '#FF9800'
      }
    ];
  }

  /***
   * Metodos vinculados a componente principal
   * **/
  async llenarCombos(option) {
    await this.EstadoMallaServices.getAll().subscribe(
      (data) => {
        this.lstEstadoMalla = data;
      }
    );

    await this.FacultadService.getAll().subscribe(
      (data) => {
        this.lstFacultad = data;
      }
    )

    if (option === 1) {
      await this.CarreraServices.getAll().subscribe(
        (data) => {
          this.lstCarrera = data;
        }
      );
    }
  }

  async llenarMalla() {
    await this.MallaService.getAll().subscribe(
      (data) => {
        this.lstMalla = data;
      }
    )
  }

  llenarCombosEdicion(item) {
    try {
      let idcarrera = this.mallaDto.idCarreraDTO.idCarrera;
      this.FacultadService.getById(idcarrera).subscribe(
        data => {
          this.lstCarrera = data;
          this.FacultadSelected = this.lstFacultad[0]
          this.llenarCombos(1);
        }
      )
    } catch (e) {
      console.log(e)
    }
  }

  llenarDetalleFacultad(event) {
    try {
      if (this.FacultadSelected != null) {
        this.FacultadShow = this.FacultadSelected;
        this.lstCarrera = this.FacultadSelected.carreraListDTO
      } else {
        this.FacultadShow = new FacultadDto();
        this.lstCarrera = new Array();
      }
      this.CarreraSelected = null;
      this.CarreraShow = new CarreraDto();
    } catch (e) {
      console.log('ERROR LLENAR FACULTAD: ' + JSON.stringify(e));
    }
  }

  llenarDetalleCarrera(event) {
    try {
      console.log('ID CARRERA::: ', this.CarreraSelected.idCarrera);
      this.CarreraServices.getById(this.CarreraSelected.idCarrera).subscribe(
        data => {
          this.CarreraShow = data;
        }
      )
    } catch (e) {
      console.log('ERROR: ' + e);
      this.CarreraSelected = null;
      this.CarreraShow = new CarreraDto()
    }
  }

  FirmaURL: string;
  template: string = "content";
  //IMPRESION POR FILTRO EN TABLAS
  async setSeleccionado(item) {
    if (item !== null) {

      this.crearForm();
      this.mallaDto = item;

      this.form = this.formBuilder.group(this.mallaDto);

      /*console.log('templates antes:', this.template);
      this.template = "file";
      console.log('templates despues:', this.template);*/

      this.form.controls.idCarreraDTO.setValue(this.lstCarrera
        .find(carrera => carrera.idCarrera === this.mallaDto.idCarreraDTO.idCarrera));

      this.form.controls.idEstadoMallaDTO.setValue(this.lstEstadoMalla
        .find(estado => estado.idEstadoMalla === this.mallaDto.idEstadoMallaDTO.idEstadoMalla))

      this.loadReady = true

      this.MallaService.getById(item.idMalla).subscribe(
        data => {
          /*this.mallaDto = data;
          let base64URL = this.mallaDto.fotoEmp
          //Transforma la base64 en URL
          let imgURL = 'data:image/jpg;base64,' + base64URL

          //Modifica la URL para que sea un archivo tipo File
          fetch(imgURL).then(res => res.blob()).then(blob => {
            const file = new File([blob], this.form.get('fotoEmp').value, { type: "image/png" })
            //console.log('IMG:::: ', file)

            const reader = new FileReader();
            reader.onload = () =>
              this.imageURL = reader.result as string;
            reader.readAsDataURL(file)

            this.fileUser = file
          })*/

          let base64FILE = this.mallaDto.pathdecretoCesMalla
          //Transforma la base64 en URL
          this.FirmaURL = 'data:image/jpg;base64,' + base64FILE;

          //Modifica la URL para que sea un archivo tipo File
          fetch(this.FirmaURL).then(res => res.blob()).then(blob => {
            const file = new File([blob], this.form.get('pathdecretoCesMalla').value, { type: "image/png" })
            console.log('FILE:::: ', file)

            this.uploadedFiles.push(file);
            this.fileInput.files[0] = file
          })
          this.loadReady = false
        }
      )
      this.enedicion = true
    } else {
      this.setearForm();
    }
  }

  iconList = [ // array of icon class list based on type
    { type: "xlsx", icon: "fa fa-file-excel-o" },
    { type: "xls", icon: "fa fa-file-excel-o" },
    { type: "pdf", icon: "fa fa-file-pdf-o" },
    { type: "doc", icon: "fa fa-file-word-o" },
    { type: "docx", icon: "fa fa-file-word-o" }
  ];
  getFileExtension(filename) { // this will give you icon class name
    let ext = filename.split(".").pop();
    let obj = this.iconList.filter(row => {
      if (row.type === ext) {
        return true;
      }
    });
    if (obj.length > 0) {
      let icon = obj[0].icon;
      return icon;
    } else {
      return "";
    }
  }
  onFileSelect(event) {
    let file = event.files[0];
    const reader = new FileReader();
    reader.onload = () =>
      this.FirmaURL = reader.result as string;
    reader.readAsDataURL(file)
  }

  remove(event, file) {
    const index: number = this.uploadedFiles.indexOf(file);
    this.fileInput.remove(event, index);
  }

  /**
   * Calculo de la Edad mediante fecha de nacimiento
   */
  /*ageEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    let ageEmp = this.appService.ageEvent(event.value);
    this.form.patchValue({ edadEmp: ageEmp });
  }*/

  //Metodo para ejecutar click en el boton subir archivo
  startUpload() {
    try {
      //controlar si el archivo esta vacio
      if (this.fileInput.files.length > 0) {
        let fileName = this.fileInput.files[0].name;
        this.mallaDto.pathdecretoCesMalla = fileName;
        this.fileInput.upload()
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

  fileUser: File
  /*preViewUser(event, index) {
    this.fileUser = null
    this.fileUser = (event.target as HTMLInputElement).files[0];

    if (index === 0) {
      const reader = new FileReader();
      reader.onload = () =>
        this.imageURL = reader.result as string;
      reader.readAsDataURL(this.fileUser)
    }
  }*/

  uploadFile() {
    //capturamos los archivos por metodo Array
    let files: File[] = []
    files.push(this.fileUser);
    files.push(this.fileInput.files[0])

    files.forEach(file => {
      console.log(file)
    });

    //verifica si hay archivos existentes
    if (this.fileInput.files.length > 0 && this.fileUser != null) {
      this.fileService.uploadManyFiles(files, this.proceso).subscribe(event => {
        console.log(event.type)
      })
      this.appService.msgInfoDetail('info', files.length + ' Archivos cargados. ', '');

      console.log('TAMAÑO ARCHIVOS: ' + files.length);
    } else {
      this.appService.msgInfoDetail('warn', 'Verificacion', 'Verificar Imagen de Usuario y Firma')
      return
    }
  }

  llenarPlaEstudio(event) {
    console.log('Evento q defe de funcar aqui::: ', event)
  }

  /**
   * Inicializa el formulario para el ingreso de la pagina y datos
   * **/
  crearForm() {
    this.form = new FormGroup({
      idMalla: new FormControl('',),
      codigoPlanEstudioMalla: new FormControl('', Validators.required),
      numerodecretoCesMalla: new FormControl('', Validators.required),
      duracionSemestresMalla: new FormControl('', Validators.required),
      periodicidadMalla: new FormControl('', Validators.required),
      cupoCesMalla: new FormControl('', Validators.required),

      //por agregar a la base de datos
      tituloPlanEstudioMalla : new FormControl('',),

      fechaAprobacionMalla: new FormControl('', Validators.required),
      fechaVigenciaMalla: new FormControl('', Validators.required),
      semestreInicioMalla: new FormControl('', Validators.required),
      semestreFinMalla: new FormControl('', Validators.required),
      observacionesMalla: new FormControl('', Validators.required),
      activoMalla: new FormControl('',),
      pathdecretoCesMalla: new FormControl('',),
      pathresolucionactivaMalla: new FormControl('',),
      pathresolucioncierreMalla: new FormControl('',),

      idCarreraDTO: new FormControl(null,),
      idEstadoMallaDTO: new FormControl(null,),
    });
  }

  /**
   * Métodos para funcionalidad de la pagina
   * **/
  guardar() {
    if (this.form.invalid) {
      this.appService.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.mallaDto = this.form.value;

      //this.startUpload()
      this.uploadFile()

      let fileName = this.fileInput.files[0].name;
      this.mallaDto.pathdecretoCesMalla = fileName;

      let idCarrera = this.CarreraSelected
      this.mallaDto.idCarreraDTO = idCarrera;

      //console.log('MALLA:::: ' + JSON.stringify(this.mallaDto))

      this.loadReady = true
      this.MallaService.saveObject(this.mallaDto).subscribe((data: any) => {
        if (!this.mallaDto.idMalla) {
          this.loadReady = false
          this.appService.msgCreate();
        } else {
          this.loadReady = false
          this.appService.msgUpdate();
        }

        this.setearForm();
      });
    }
  }

  setearForm() {
    this.form.reset();
    this.mallaDto = new MallaDto();
    this.llenarCombos(0);
    this.llenarMalla();
    this.llenarSecciones();

    this.estado = null;
    // this.facultad = null
    this.pathdecretoCesMalla = null;
    this.fileUser = null
    this.lstMalla = new Array();
    this.lstEstadoMalla = new Array();
    this.lstCarrera = new Array();
    this.lstFacultad = new Array();

    //this.imageURL = 'https://www.coordinadora.com/wp-content/uploads/sidebar_usuario-corporativo.png'
  }

  cancelar() {
    this.setearForm();
    this.appService.msgInfoDetail('info', '', 'Acción Cancelada')

  }

  /**
   * COSNTRUCCION DE LA TABLA PA EL PLAN DE ESTUDIO
   */

  @Output() mallaSelect = new EventEmitter();
  displayModal: boolean;
  malla: MallaDto;
  selectedMalla: MallaDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  showModalDialog() {
    this.loadReady = true;

    this.MallaService.getAll().subscribe(data => {
      console.log('info al traer: ', data)
      this.lstMalla = data;
      this.displayModal = true;
      this.loadReady = false;
    })
  }

  contruirTabla() {
    this.cols = [
      { field: 'idMalla', header: 'ID' },
      { field: 'codigoPlanEstudioMalla', header: 'Codigo Plan Estudio' },
      { field: 'numerodecretoCesMalla', header: 'Numero Decreto' },
      { field: 'duracionSemestresMalla', header: 'Duracion Semestre' },
      { field: 'periodicidadMalla', header: 'Periocidad' },
      { field: 'cupoCesMalla', header: 'Cupo' },
      { field: 'fechaAprobacionMalla', header: 'Fecha Aprobacion' },
      { field: 'fechaVigenciaMalla', header: 'Fecha Vigencia' },
      { field: 'pathdecretoCesMalla', header: 'Decreto' },
      { field: 'semestreInicioMalla', header: 'Semestre Inicio' },
      { field: 'semestreFinMalla', header: 'Semestre Fin' },
      { field: 'pathresolucionactivaMalla', header: 'Solucion Activa' },
      { field: 'pathresolucioncierreMalla', header: 'Solucion Cierre' },
      { field: 'observacionesMalla', header: 'Observaciones' },
      { field: 'activoMalla', header: 'Activo' },
      { field: 'idCarreraDTO', header: 'Carrera' },
      { field: 'idEstadoMallaDTO', header: 'Estado Malla' },
    ];
    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
    this.loading = false;
  }

  clear(table: Table) {
    table.clear();
  }

  loadData(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      this.MallaService.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
        this.lstMalla = res;
        this.loading = false;
      })
    }, 1000)
  }

  deleteSelectedItems() {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de Eliminar los elementos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItemSelect();
      }
    })
  }

  eliminarItemSelect() {
    let indexLista: number = 0;
    for (let i = 0; i < this.selectedMalla.length; i++) {
      this.MallaService.deleteObject(this.selectedMalla[i].idMalla).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedMalla.length) {
            this.lstMalla = this.lstMalla.filter(val => !this.selectedMalla.includes(val));
            this.selectedMalla = null;
            this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
            this.loadReady = false
          }
        }
      );
    }
  }


  editItem(item) {
    this.malla = {...item};
    this.mallaSelect.emit(item);
    this.setSeleccionado(item);
    this.displayModal = false;
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.codigoPlanEstudioMalla + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadReady = true
        this.eliminarItem(item);
      }
    });
  }

  eliminarItem(item) {
    this.MallaService.deleteObject(item.idMalla).subscribe(
      data => {
        this.lstMalla = this.lstMalla.filter(val => val.idMalla !== item.idMalla);
        this.malla = new MallaDto();
        this.appService.msgDelete();
        this.loadReady = false
        //console.log('DATA ENVIAR By JSON::::: ' + JSON.stringify(data));
      }
    );
  }

  exportPdf() {
    this.appService.exportPdf(this.exportColumns, this.lstMalla, 'Plan de Estudio', '1');
  }

  exportExcel() {
    this.appService.exportExcel(this.lstMalla, 'Plan de Estudio');
  }

  descargarArchivo(fileName: string) {
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appService.msgInfoDetail('error', 'Error', 'Error al descargar el archivo')
    }
  }
}