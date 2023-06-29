import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AppService} from "@services/app.service";
import {InstitucionEducativaDto} from "@/dto/InstitucionEducativaDto";
import {CategoriaDto} from "@/dto/CategoriaDto";
import {TipoInstitucionEducativaDto} from "@/dto/TipoInstitucionEducativaDto";
import {InstitucionEducativaService} from "@services/institucioneducativa/institucioneducativa.service";
import {CategoriaService} from "@services/institucioneducativa/categoria.service";
import {TipoInstitucionEducativaService} from "@services/institucioneducativa/tipoinstitucioneducativa.service";
import {environment} from "../../../../environments/environment";
import {FileService} from "@services/utils/file.service";
import {FileUpload} from "primeng/fileupload";
import {Observable} from "rxjs";

@Component({
  selector: 'app-institucioneducativa',
  templateUrl: './institucioneducativa.component.html',
  styleUrls: ['./institucioneducativa.component.scss']
})
export class InstitucioneducativaComponent implements OnInit {

  /***
   * variables globales, @Input para enlaces de componentes
   * */
  @Input() institucionEducativa: InstitucionEducativaDto;
  @ViewChild('fileInput') fileInput: FileUpload;

  form: FormGroup;
  proceso: string = 'academia';

  categoria: any;
  tipo: any;
  categoriaShow: CategoriaDto = new CategoriaDto();
  tipoShow: TipoInstitucionEducativaDto = new TipoInstitucionEducativaDto();

  lstInstitucionEducativa: Observable<InstitucionEducativaDto[]>;
  lstCategoria: CategoriaDto[];
  lstTipoInstitucionEducativa: TipoInstitucionEducativaDto[];

  enedicion: boolean;

  //#region Variables de la vista
  SIZEFILE = `${environment.SIZEFILE}/`;
  ACCEPTFILES = `${environment.ACCEPTFILES}/`;
  URLFILEUPLOAD = `${environment.HOST}/files/upload/` + this.proceso;
  URLFILEUPLOADTOFIREBASE = `${environment.HOST}/files/uploadToFirebase`;

  uploadedFiles: any[] = [];

  /***
   * Constructor: se agregar los servicios necesarios
   * **/
  constructor(public appService: AppService,
              public formBuilder: FormBuilder,
              public institucionEducativaService: InstitucionEducativaService,
              public categoriaService: CategoriaService,
              public fileService: FileService,
              public tipoInstitucionEducativaService: TipoInstitucionEducativaService) {
  }

  /***
   * Constructir para inicializar antes del renderizado de la pagina
   * **/
  ngOnInit() {
    this.institucionEducativa = new InstitucionEducativaDto();
    this.crearForm();
    this.llenarInstitucionEducativa();
    this.llenarCombos();
  }

  InstitucionURL: string;
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
      this.InstitucionURL = reader.result as string;
    reader.readAsDataURL(file)
  }

  remove(event,file) {
    const index: number = this.uploadedFiles.indexOf(file);
    this.fileInput.remove(event, index);
  }


  //Metodo para ejecutar click en el boton subir archivo
  startUpload(){
    try {
      //controlar si el archivo esta vacio
      if (this.fileInput.files.length > 0) {
        let fileName = this.fileInput.files[0].name;
        this.institucionEducativa.pathauitorizacionInstitucionEducativa = fileName;
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

  /***
   * Metodos vinculados a componente principal
   * **/
  async llenarCombos() {
    await this.categoriaService.getAll().subscribe(
      data => {
        this.lstCategoria = data;
      }
    );
    await this.tipoInstitucionEducativaService.getAll().subscribe(
      data => {
        this.lstTipoInstitucionEducativa = data;
      }
    );
  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.institucionEducativa = item;
      this.form = this.formBuilder.group(this.institucionEducativa);
      await this.categoriaService.getById(this.institucionEducativa.idCategoriaDTO.idCategoria).subscribe(
        data => {
          this.categoria = data;
        }
      );
      await this.tipoInstitucionEducativaService.getById(this.institucionEducativa.idTipoInstitucionEducativaDTO.idTipoInstitucionEducativa).subscribe(
        data => {
          this.tipo = data;
        }
      );
      //this.categoria = this.institucionEducativa.idCategoriaDTO;
      //this.tipo = this.institucionEducativa.idTipoInstitucionEducativaDTO;

      let base64FILE = this.institucionEducativa.pathauitorizacionInstitucionEducativa
          //Transforma la base64 en URL
          this.InstitucionURL = 'data:image/jpg;base64,' + base64FILE;

          console.log('FILE::: ', base64FILE);
          console.log('data::: ', this.InstitucionURL);

          //Modifica la URL para que sea un archivo tipo File
          fetch(this.InstitucionURL).then(res => res.blob()).then(blob => {
            const file = new File([blob], this.form.get('pathauitorizacionInstitucionEducativa').value, { type: "image/png" })
            console.log('FILE:::: ', file)

            this.uploadedFiles.push(file);
            this.fileInput.files[0] = file
          })

      this.enedicion = true;
    } else {
      this.setearForm();
    }
  }

  async llenarInstitucionEducativa() {
    this.lstInstitucionEducativa = this.institucionEducativaService.getAll();
  }


  //Inicializa el formulario para el ingreso de la pagina y datos
  crearForm() {
    this.form = new FormGroup({
      idInstitucionEducativa: new FormControl('',),
      codigoInstitucionEducativa: new FormControl('',),
      nombreInstitucionEducativa: new FormControl('',),
      codautorizacionInstitucionEducativa: new FormControl('',),
      pathauitorizacionInstitucionEducativa: new FormControl('',),
      usercreaInstitucionEducativa: new FormControl('',),
      useractInstitucionEducativa: new FormControl('',),
      usereliInstitucionEducativa: new FormControl('',),
      fechacreaInstitucionEducativa: new FormControl('',),
      fechaactInstitucionEducativa: new FormControl('',),
      fechaeliInstitucionEducativa: new FormControl('',),
      activoInstitucionEducativa: new FormControl('',),
      //premiosListDTO: [];
      //sedeInstitucionListDTO: [];
      //designacionesInstitucionEducativaListDTO: [];
      idCategoriaDTO: new FormControl('',),
      idTipoInstitucionEducativaDTO: new FormControl('',),
      //conveniosListDTO: [];
      //acreditacionesListDTO: [];
      //autoridadesInstitucionEducativaListDTO: [];
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
      this.institucionEducativa = this.form.value;
      this.institucionEducativa.idCategoriaDTO = this.categoria;
      this.institucionEducativa.idTipoInstitucionEducativaDTO = this.tipo;
      this.startUpload();
      await this.institucionEducativaService.saveObject(this.institucionEducativa).subscribe((data: any) => {
        if (!this.institucionEducativa.idInstitucionEducativa) {
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
    this.institucionEducativa = new InstitucionEducativaDto();
    this.categoria = null;
    this.tipo= null;
    this.categoriaShow = new CategoriaDto();
    this.tipoShow = new TipoInstitucionEducativaDto();

    this.llenarCombos();
    this.llenarInstitucionEducativa();

  }

  cancelar() {
    this.setearForm();
    this.appService.msgInfoDetail('info', '', 'Acción Cancelada')

  }
}

