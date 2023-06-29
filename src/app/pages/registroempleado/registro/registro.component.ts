import { Component, Input, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { FileUpload } from "primeng/fileupload";
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { AppService } from "@services/app.service";
import { PaisService } from "@services/segmentacion/pais.service";
import { ProvinciaService } from '@services/segmentacion/provincia.service';
import { CantonService } from '@services/segmentacion/canton.service';
import { ParroquiaService } from '@services/segmentacion/parroquia.service';
import { EstadoempleadoService } from '@services/empleado/estadoempleado.service';
import { TipoempleadoService } from '@services/empleado/tipoempleado.service';
import { UnidadorganizativalService } from '@services/empleado/unidadorganizativa.service';
import { TipodocumentoService } from '@services/empleado/tipodocumento.service';

import { PaisDto } from "@/dto/PaisDto";
import { ProvinciaDto } from '@/dto/ProvinciaDto';
import { CantonDto } from '@/dto/CantonDto';
import { ParroquiaDto } from '@/dto/ParroquiaDto';
import { EstadoEmpeadoDto } from '@/dto/EstadoEmpleadoDto';
import { EmpleadoDto } from '@/dto/EmpleadoDto';
import { EmpleadoService } from '@services/empleado/empleado.service';
import { TipoEmpleadoDto } from '@/dto/TipoEmpleadoDto';
import { UnidadOrganizativaDto } from '@/dto/UnidadOrganizativaDto';
import { TipoDocumentoDto } from '@/dto/TipoDocumentoDto';

import { validarDNI } from '@/validator/validardni';
import { FileService } from '@services/utils/file.service';
import { ConfirmationService, LazyLoadEvent, SelectItem } from 'primeng/api';
import { Table } from "primeng/table";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  /***
   * variables globales, @Input para enlaces de componentes
   * */
  @Input() empleado: EmpleadoDto;
  @ViewChild('fileInput') fileInput: FileUpload;
  //@ViewChild('fileInput') fileUs: FileUpload;


  contentType: 'application/json'
  form: FormGroup;
  proceso: string = 'empleado';

  empleadoCatalogo: EmpleadoDto;

  tipoDoc: any;
  paisNac: any;
  pais: any;
  provincia: any;
  canton: any;
  parroquia: any
  estado: any;
  estadoEmp: any;
  tipoEmp: any;
  unidadOrg: any
  pathfirmadigitalEmp: any;
  sections: any[];

  lstPaisNac: PaisDto[];
  lstPais: PaisDto[];
  lstProvincia: ProvinciaDto[];
  lstCanton: CantonDto[];
  lstParroquia: ParroquiaDto[];
  lstEmpleado: EmpleadoDto[];
  lstEstado: EstadoEmpeadoDto[];
  lstTipoEmp: TipoEmpleadoDto[];
  lstUnidadOrg: UnidadOrganizativaDto[];
  lstTipoDoc: TipoDocumentoDto[];
  
  lstSexo: SelectItem[];
  selectedSexo: SelectItem;

  enedicion: boolean;
  loadReady: boolean;
  loadProgres: boolean;

  value: number = 0;
  imageURL: string = 'https://www.vhv.rs/dpng/d/119-1199788_user-vector-icon-png-clipart-png-download-icon.png'

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
    public paisService: PaisService,
    public provinciaService: ProvinciaService,
    public cantonService: CantonService,
    public parroquiaService: ParroquiaService,
    public formBuilder: FormBuilder,
    public estadoServices: EstadoempleadoService,
    public empleadoService: EmpleadoService,
    public tipoEmpleadoService: TipoempleadoService,
    public UnidadOrgService: UnidadorganizativalService,
    public TiposDocService: TipodocumentoService,

    public formModule: FormsModule,
    private fileService: FileService,
    private confirmationService: ConfirmationService,
  ) {
    this.loadReady = false
    this.loadProgres = false
  }

  /***
   * Constructir para inicializar antes del renderizado de la pagina
   * **/
  ngOnInit() {
    this.empleado = new EmpleadoDto();
    this.crearForm();
    this.llenarSecciones()
    this.llenarCombos();
    this.selectedImg();
    this.form.controls['edadEmp'].disable()
  }

  selectedImg(){
    document.addEventListener('DOMContentLoaded', () => {
      const btn = document.getElementById("imageUpload")
      btn?.addEventListener('click', function () {
        document.getElementById("file-input").click();
      })
    })
  }

  llenarSecciones() {
    this.sections = [
      {
        index: 1,
        header: 'Datos Personales',
        subheader: '',
        icon: 'fa fa-user-alt',
        color: '#b02767'
      },
      {
        index: 2,
        header: 'Datos de Contacto',
        subheader: '',
        icon: 'fa fa-user-alt',
        color: '#9C27B0'
      },
      {
        index: 3,
        header: 'Datos de Contrato',
        subheader: '',
        icon: 'fa fa-id-badge',
        color: '#673AB7'
      },
    ]
  }

  /***
   * Metodos vinculados a componente principal
   * **/
  async llenarCombos() {

    await this.empleadoService.getAll().subscribe(
      (data) => {
        this.lstEmpleado = data;
      },
      /*error => {
        console.log('ERROR SERVICE LISTEMPLEADO::::: ', error)
      }*/
    )

    await this.paisService.getAll().subscribe(
      data => {
        this.lstPaisNac = data;
      }
    );
    await this.paisService.getAll().subscribe(
      data => {
        this.lstPais = data;
      }
    );
    await this.estadoServices.getAll().subscribe(
      (data) => {
        this.lstEstado = data;
      }
    );
    await this.tipoEmpleadoService.getAll().subscribe(
      (data) => {
        this.lstTipoEmp = data;
      }
    )

    await this.UnidadOrgService.getAll().subscribe(
      (data) => {
        this.lstUnidadOrg = data;
      }
    )

    await this.TiposDocService.getAll().subscribe(
      (data) => {
        this.lstTipoDoc = data;
      }
    )

    this.lstSexo = [
      {label: "Masculino", value: "1"},
      {label: "Femenino", value: "2"}
    ]
  }

  /**
   * CARGAS DEL DROPDOWN PAISES
   */
  llenarDetallePais(event) {
    try {
      this.pais = event.value
      if (event.value.idPais == 63) {
        this.form.controls['idProvincia'].enable()
        this.form.controls['idCanton'].enable()
        this.form.controls['idParroquia'].enable()
        this.provinciaService.getByIdRegion(this.pais.idPais).subscribe(data => {
          this.lstProvincia = data;

          this.lstCanton = new Array();
          this.lstParroquia = new Array();

          this.provincia = null;
          this.canton = null;
          this.parroquia = null;
        })
      } else {
        this.form.controls['idProvincia'].disable()
        this.form.controls['idCanton'].disable()
        this.form.controls['idParroquia'].disable()

        this.lstProvincia = new Array();
        this.lstCanton = new Array();
        this.lstParroquia = new Array();
        this.provincia = null;
        this.canton = null;
        this.parroquia = null;
      }
    } catch (e) {
      console.log('ERROR PAIS ' + e);

      this.lstProvincia = new Array();
      this.lstCanton = new Array();
      this.lstParroquia = new Array();
      this.pais = null
      this.provincia = null;
      this.canton = null;
      this.parroquia = null;
    }
  }

  llenarDetalleProvincia(event) {
    try {
      this.provincia = event.value;
      this.cantonService.getByIdProvincia(this.provincia.idProvincia).subscribe(data => {
        this.lstCanton = data;

        this.parroquia = new Array();
        this.canton = null;
        this.parroquia = null;
      })
    } catch (e) {
      console.log('ERROR PROVINCIA ' + e);

      this.lstCanton = new Array();
      this.lstParroquia = new Array();
      this.provincia = null;
      this.canton = null;
      this.parroquia = null;
    }
  }

  llenarDetalleCanton(event) {
    try {
      this.canton = event.value;
      this.parroquiaService.getByIdCanton(this.canton.idCanton).subscribe(data => {
        this.lstParroquia = data;
        this.parroquia = null;
      })
    } catch (e) {
      console.log('ERROR CANTON ' + e);
      this.lstParroquia = new Array();
      this.canton = null;
      this.parroquia = null;
    }
  }

  llenarDetalleParroquia(event) {
    try {
      this.parroquia = event.value;
    } catch (e) {
      console.log('ERROR PARROQUIA ' + e);
    }
  }

  llenarDetallePaisNac(event){
    try {
      this.paisNac = event.value;
    } catch (e) {
      console.log('ERROR PAISNAC ' + e);
    }
  }

  llenarDetalleTipoDoc(event) {
    try {
      this.tipoDoc = event.value;
    } catch (e) {
      console.log('ERROR TIPO DOC ' + e);
    }
  }

  llenarDetalleEstadoEmp(event) {
    try {
      this.estadoEmp = event.value;
    } catch (e) {
      console.log('ERROR ESTADO EMP ' + e);
    }
  }

  llenarDetalleTipoEmp(event) {
    try {
      this.tipoEmp = event.value;
    } catch (e) {
      console.log('ERROR TIPO EMP ' + e);
    }
  }

  llenarDetalleUnidadOrganizativa(event) {
    try {
      this.unidadOrg = event.value;
    } catch (e) {
      console.log('ERROR UNIDAD ORG ' + e);
    }
  }

  eventoGenero(event) {
    try {
      this.selectedSexo = event.value;
      console.log(this.selectedSexo)
    } catch (e) {
      console.log('ERROR GENERO ' + e)
    }
  }

  FirmaURL: string;
  template: string = "content";
  //IMPRESION POR FILTRO EN TABLAS
  async setSeleccionado(item) {
    if (item !== null) {

      // console.log(item.fotoEmp)
      console.log('DATA TRAIDA::: ', item)

      this.crearForm();

      // this.form.controls['idEmp'].setValue(item.idEmp);
      // this.form.controls['nombresEmp'].setValue(item.nombresEmp);
      // this.form.controls['apellidoEmp'].setValue(item.apellidoEmp);
      // this.form.controls['identificacionEmp'].setValue(item.identificacionEmp);
      // this.form.controls['fnacEmp'].setValue(item.fnacEmp);
      // this.form.controls['edadEmp'].setValue(item.edadEmp);
      // this.form.controls['sexoEmp'].setValue(item.sexoEmp);
      // this.form.controls['callePrincipal'].setValue(item.callePrincipal);
      // this.form.controls['calleSecundaria'].setValue(item.calleSecundaria);
      // this.form.controls['numeracion'].setValue(item.numeracion);
      // this.form.controls['codPostal'].setValue(item.codPostal);
      // this.form.controls['referencia'].setValue(item.referencia);
      // this.form.controls['telefonoEmp'].setValue(item.telefonoEmp);
      // this.form.controls['celularEmp'].setValue(item.celularEmp);
      // this.form.controls['correoEmp'].setValue(item.correoEmp);
      // this.form.controls['fechaRegistroEmp'].setValue(item.fechaRegistroEmp);
      // this.form.controls['fechaActualizaEmp'].setValue(item.fechaActualizaEmp);
      // this.form.controls['pathfirmadigitalEmp'].setValue(item.pathfirmadigitalEmp);
      // this.form.controls['fotoEmp'].setValue(item.fotoEmp);
      // this.form.controls['activoEmp'].setValue(item.activoEmp);

      this.empleado = item;

      this.form = this.formBuilder.group(this.empleado);

      this.form.controls['sexoEmp'].setValue(item.sexoEmp);

      this.form.controls.idTipoDocumento.setValue(this.lstTipoDoc
        .find(tipoDoc => tipoDoc.idTipoDocumento === this.empleado.idTipoDocumentoNavigation.idTipoDocumento))

      this.form.controls.idPaisNac.setValue(this.lstPaisNac
        .find(paisNa => paisNa.idPais === this.empleado.idPaisNacNavigation.idPais))

      this.form.controls.idPais.setValue(this.lstPais
        .find(pais => pais.idPais === this.empleado.idPaisNacNavigation.idPais))

      this.form.controls.idProvincia.setValue(this.lstProvincia
        .find(provi => provi.idProvincia === this.empleado.idProvinciaNavigation.idProvincia))

      this.form.controls.idCanton.setValue(this.lstCanton
        .find(cant => cant.idCanton == this.empleado.idCantonNavigation.idCanton))

      this.form.controls.idParroquia.setValue(this.lstParroquia
        .find(parro => parro.idParroquia === this.empleado.idParroquiaNavigation.idParroquia))

      this.form.controls.idEstadoEmp.setValue(this.lstEstado
        .find(estado => estado.idEstadoEmp === this.empleado.idEstadoEmpNavigation.idEstadoEmp));

      this.form.controls.idTipoEmp.setValue(this.lstTipoEmp
        .find(tipoEmp => tipoEmp.idTipoEmp === this.empleado.idTipoEmpNavigation.idTipoEmp))

      this.form.controls.idUnidad.setValue(this.lstUnidadOrg
        .find(unida => unida.idUo === this.empleado.idUnidadNavigation.idUo))

      this.form.controls.sexoEmp.setValue(this.lstSexo
        .find(genero => genero.value === this.empleado.sexoEmp))

      this.template = "file";
      this.loadReady = true

      if (item.fotoEmp != "") {
        this.empleadoService.getById(item.idEmp).subscribe(
          data => {
            this.empleado = data;
            let base64URL = this.empleado.fotoEmp
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
            })

            let base64FILE = this.empleado.pathfirmadigitalEmp
            console.log('BASE64::: ', base64FILE)
            //Transforma la base64 en URL
            this.FirmaURL = 'data:image/jpg;base64,' + base64FILE;
            console.log('hecho data::: ', this.FirmaURL)

            //Modifica la URL para que sea un archivo tipo File
            fetch(this.FirmaURL).then(res => res.blob()).then(blob => {
              const file = new File([blob], this.form.get('pathfirmadigitalEmp').value, { type: "image/png" })
              console.log('FILE:::: ', file)

              this.uploadedFiles.push(file);
              this.fileInput.files[0] = file
            })
            this.loadReady = false
          }
        )
      }
      this.loadReady = false
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
    const num: number = this.uploadedFiles.indexOf(file);
    this.fileInput.remove(event, num);
  }

  /**
   * Calculo de la Edad mediante fecha de nacimiento
   */
  ageEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    let ageEmp = this.appService.ageEvent(event.value);
    this.form.patchValue({ edadEmp: ageEmp });
  }

  //Metodo para ejecutar click en el boton subir archivo
  startUpload() {
    try {
      //controlar si el archivo esta vacio
      if (this.fileInput.files.length > 0) {
        let fileName = this.fileInput.files[0].name;
        this.empleado.pathfirmadigitalEmp = fileName;
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
  preViewUser(event, num) {
    this.fileUser = null
    this.fileUser = (event.target as HTMLInputElement).files[0];
    console.log(this.fileUser)

    if (num === 0) {
      const reader = new FileReader();
      reader.onload = () =>
        this.imageURL = reader.result as string;
      reader.readAsDataURL(this.fileUser)
      // no usar lo del formulario reactivo
      /**
       this.form.patchValue({
         avatar: this.fileUser
       });
       this.form.get('avatar').updateValueAndValidity();
       */

    }
    /*const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      avatar: file
    });
    this.form.get('avatar').updateValueAndValidity()
    const reader = new FileReader();
    reader.onload = () =>
      this.imageURL = reader.result as string;
    reader.readAsDataURL(file)*/
  }

  uploadFile() {
    //capturamos los archivos por metodo Array
    let files: File[] = []
    console.log('archivo::: '+ this.fileInput)
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
      this.value = files.length

      console.log('TAMAÑO ARCHIVOS: ' + files.length);
      this.loadProgres = false
      this.value = 0;
    } else {
      this.appService.msgInfoDetail('warn', 'Verificacion', 'Verificar Imagen de Usuario y Firma')
      this.loadProgres = false
      return
    }
  }

  /**
   *
   */

  /**
   * Inicializa el formulario para el ingreso de la pagina y datos
   * **/
  crearForm() {
    this.form = new FormGroup({
      idEmp: new FormControl(0,),
      nombresEmp: new FormControl('', Validators.required),
      apellidoEmp: new FormControl('', Validators.required),
      identificacionEmp: new FormControl('', [Validators.required, 
                                              validarDNI.validarDni, 
                                              Validators.minLength(6), 
                                              Validators.maxLength(10),
                                              Validators.pattern(/^[0-9]\d{6,10}$/)]),
      fnacEmp: new FormControl('', Validators.required),
      edadEmp: new FormControl('',),
      sexoEmp: new FormControl('',),
      callePrincipal: new FormControl('', Validators.required),
      calleSecundaria: new FormControl('', Validators.required),
      numeracion: new FormControl('', Validators.required),
      codPostal: new FormControl('', Validators.required),
      referencia: new FormControl('', Validators.required),
      telefonoEmp: new FormControl('', Validators.required),
      celularEmp: new FormControl('', Validators.required),
      correoEmp: new FormControl('', Validators.required),
      fechaRegistroEmp: new FormControl('',),
      fechaActualizaEmp: new FormControl('',),
      pathfirmadigitalEmp: new FormControl('',),
      fotoEmp: new FormControl('',),
      activoEmp: new FormControl(true,),

      idUnidad: new FormControl(null,),
      idEstadoEmp: new FormControl(null,),
      idTipoDocumento: new FormControl(null,),
      idPaisNac: new FormControl(null,),
      idPais: new FormControl(null,),
      idProvincia: new FormControl(null,),
      idCanton: new FormControl(null,),
      idParroquia: new FormControl(null,),
      idTipoEmp: new FormControl(null,),

      // idCantonNavigation: new FormControl(null,),
      // idEstadoEmpNavigation: new FormControl(null,),
      // idPaisNacNavigation: new FormControl(null,),
      // idParroquiaNavigation: new FormControl(null,),
      // idProvinciaNavigation: new FormControl(null,),
      // idTipoDocumentoNavigation: new FormControl(null,),
      // idTipoEmpNavigation: new FormControl(null,),
      // idUnidadNavigation: new FormControl(null,),
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
      this.empleado = this.form.value;

      this.empleado.fechaActualizaEmp = this.form.get('fechaRegistroEmp').value;
      this.empleado.idTipoDocumento = this.tipoDoc.idTipoDocumento;
      this.empleado.sexoEmp = this.selectedSexo.value;
      this.empleado.idPaisNac = this.paisNac.idPais;
      this.empleado.idPais = this.pais.idPais;
      this.empleado.idProvincia = this.provincia.idProvincia;
      this.empleado.idCanton = this.canton.idCanton;
      this.empleado.idParroquia = this.parroquia.idParroquia;
      this.empleado.idEstadoEmp = this.estadoEmp.idEstadoEmp;
      this.empleado.idTipoEmp = this.tipoEmp.idTipoEmp;
      this.empleado.idUnidad = this.unidadOrg.idUo;
      // this.tipoEmpleadoService.getById(this.empleado.idTipoEmpNavigation.idTipoEmp).subscribe(
      //   data => {
      //     this.tipoEmp = data;
      //     this.empleado.idTipoEmpNavigation = this.tipoEmp;
      //   }
      // );

      // this.estadoServices.getById(this.empleado.idEstadoEmpNavigation.idEstadoEmp).subscribe(
      //   data => {
      //     this.estado = data;
      //     this.empleado.idEstadoEmpNavigation = this.estado;
      //   }
      // );
      //this.startUpload()  ESTE YA ESTABA COMENTADO
      // this.uploadFile()

      // let fileName = this.fileInput.files[0].name;
      // this.empleado.pathfirmadigitalEmp = fileName;

      // let fileUser = this.fileUser.name
      // this.empleado.fotoEmp = fileUser

      let edadEmp = this.form.get('edadEmp').value
      this.empleado.edadEmp = edadEmp

      console.log('EMPLEADO:::: ' + JSON.stringify(this.empleado))

      this.loadReady = true
      this.empleadoService.saveObject(this.empleado).subscribe((data: any) => {
        if (!this.empleado.idEmp) {
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
    this.empleado = new EmpleadoDto();
    this.llenarCombos();

    this.pais = null;
    this.provincia = null;
    this.canton = null;
    this.parroquia = null;
    this.estado = null;
    this.tipoEmp = null;
    this.pathfirmadigitalEmp = null;
    this.fileUser = null
    this.tipoDoc = null;
    this.paisNac = null;
    this.estadoEmp = null;
    this.unidadOrg = null;
    this.imageURL = 'https://www.vhv.rs/dpng/d/119-1199788_user-vector-icon-png-clipart-png-download-icon.png'
    this.value = 0
  }

  cancelar() {
    this.setearForm();
    this.appService.msgInfoDetail('info', '', 'Acción Cancelada')

  }

  /**
   * CONTRUCCION DE LA TABLA DE EMPLEADOS
   * **/
  @Output() empleadoSelect = new EventEmitter();
  displayModal: boolean;
  selectedEmpleado: EmpleadoDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  showModalDialog() {
    this.empleadoService.getAll().subscribe(data => {
      this.lstEmpleado = data;
      this.displayModal = true;

    })
  }

  contruirTabla() {
    this.cols = [
      { field: 'idEmp', header: 'ID' },
      { field: 'nombresEmp', header: 'Nombre' },
      { field: 'apellidoEmp', header: 'Apellido' },
      { field: 'dniEmp', header: 'DNI' },
      { field: 'fnacEmp', header: 'FNacimiento' },
      { field: 'edadEmp', header: 'Edad' },
      { field: 'fechaRegistroEmp', header: 'FechaRegistro' },
      { field: 'fechaActualizaEmp', header: 'fechaActualiza' },
      { field: 'pathfirmadigitalEmp', header: 'Firma' },
      { field: 'activoEmp', header: 'Activo' },
      { field: 'idEstadoEmpNavigation', header: 'Estado' },
      { field: 'idUnidadNavigation', header: 'Unidad Org' },
      { field: 'idTipoEmpNavigation', header: 'Tipo' }
    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    this.loading = false;
  }

  clear(table: Table) {
    table.clear();
  }

  loadData(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      this.empleadoService.getAllLazy({ lazyEvent: JSON.stringify(event) }).then(res => {
        this.lstEmpleado = res;
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
    for (let i = 0; i < this.selectedEmpleado.length; i++) {
      this.empleadoService.deleteObject(this.selectedEmpleado[i].idEmp).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedEmpleado.length) {
            this.lstEmpleado = this.lstEmpleado.filter(val => !this.selectedEmpleado.includes(val));
            this.selectedEmpleado = null;
            this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
            this.loadReady = false
          }
        }
      );
    }
  }


  editItem(item) {
    this.empleado = { ...item };
    this.empleadoSelect.emit(item);
    this.setSeleccionado(item);
    this.displayModal = false;
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombresEmp + ' ' + item.apellidoEmp + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadReady = true
        this.eliminarItem(item);
      }
    });
  }

  eliminarItem(item) {
    this.empleadoService.deleteObject(item.idEmp).subscribe(
      data => {
        this.lstEmpleado = this.lstEmpleado.filter(val => val.idEmp !== item.idEmp);
        this.empleado = new EmpleadoDto();
        this.appService.msgDelete();
        this.loadReady = false
        //console.log('DATA ENVIAR By JSON::::: ' + JSON.stringify(data));
      }
    );
  }

  exportPdf() {
    this.appService.exportPdf(this.exportColumns, this.lstEmpleado, 'Empleado', '1');
  }

  exportExcel() {
    this.appService.exportExcel(this.lstEmpleado, 'Empleado');
  }

  descargarArchivo(fileName: string) {
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appService.msgInfoDetail('error', 'Error', 'Error al descargar el archivo')
    }
  }

}
