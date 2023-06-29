import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ComponenteDto} from "@/dto/ComponenteDto";
import {DuracionComponenteDto} from "@/dto/DuracionComponenteDto";
import {ModalidadComponenteDto} from "@/dto/ModalidadComponenteDto";
import {TipoComponenteDto} from "@/dto/TipoComponenteDto";
import {AppService} from "@services/app.service";
import {ComponenteService} from "@services/componente/componente.service";
import {DuracionComponenteService} from "@services/componente/duracioncomponente.service";
import {ModalidadComponenteService} from "@services/componente/modalidadcomponente.service";
import {TipoComponenteService} from "@services/componente/tipocomponente.service";
import {Router} from "@angular/router";
import {SedeInstitucionDto} from "@/dto/SedeInstitucionDto";
import {InstitucionEducativaDto} from "@/dto/InstitucionEducativaDto";
import {SedeService} from "@services/institucioneducativa/sede.service";
import {InstitucionEducativaService} from "@services/institucioneducativa/institucioneducativa.service";

@Component({
  selector: 'app-sedeinstitucion',
  templateUrl: './sedeinstitucion.component.html',
  styleUrls: ['./sedeinstitucion.component.scss']
})
export class SedeinstitucionComponent implements OnInit {


  /***
   * variables globales
   * */
  form: FormGroup;
  @Input() sedeInput: SedeInstitucionDto = new SedeInstitucionDto();

  sede: SedeInstitucionDto = new SedeInstitucionDto();
  institucionEducativa: any;
  institucionEducativaShow: InstitucionEducativaDto = new InstitucionEducativaDto();

  lstSede: SedeInstitucionDto[];
  lstInstitucionEducativa: InstitucionEducativaDto[];

  enedicion: boolean;

  /***
   * Constructor: se agregar los servicios ncesarios
   * **/
  constructor(public appService: AppService,
              public formBuilder: FormBuilder,
              public sedeService: SedeService,
              public institucionService: InstitucionEducativaService,
              public router: Router) {
  }

  /***
   * Constructir para inicializar antes del renderizado de la pagina
   * **/
  ngOnInit() {
    this.sede = new SedeInstitucionDto();
    this.crearForm();
    this.llenarListSede();
    this.llenarCombos();
  }

  async setSeleccionado(item) {
    if(item !==null){
      this.sede = item;
      this.form = this.formBuilder.group(this.sede);
      await this.institucionService.getById(this.sede.idInstitucionEducativaDTO.idInstitucionEducativa)
        .subscribe(data => {
          this.institucionEducativa = data;
        });
      //this.institucionEducativa = this.sede.idInstitucionEducativaDTO;
      this.enedicion = true;

    }else{
      this.setearForm();
    }
  }

  async llenarCombos() {
    await this.institucionService.getAll().subscribe(
      data => {
        this.lstInstitucionEducativa = data;
      }
    );
  }

  async llenarListSede() {
    await this.sedeService.getAll().subscribe(
      data => {
        this.lstSede = data;
      }
    );
  }

  //Inicializa el formulario para el ingreso de la pagina y datos
  crearForm() {
    this.form = new FormGroup({
      idSedeInstitucion:  new FormControl('',),
      nombreSedeInstitucion:  new FormControl('',),
      codigoSedeInstitucion:  new FormControl('',),
      activoSedeInstitucion:  new FormControl('',),
      //idInstitucionEducativaDTO:  new FormControl('',)
      //campusListDTO: [];
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
      this.sede = this.form.value;
      this.sede.idInstitucionEducativaDTO = this.institucionEducativa;
      //guardar sede
      this.sedeService.saveObject(this.sede).subscribe(
        data => {
          if (this.enedicion) {
            //this.lstSede[this.findIndexById(this.sede.idSedeInstitucion)] = this.sede;
            this.appService.msgUpdate();
            this.enedicion = false;
          } else {
            //this.sede.idSedeInstitucion = (this.lstSede.length + 1);
            //this.lstSede.push(this.sede);
            this.appService.msgCreate();
          }

          this.setearForm();

        },
        error => {
          this.appService.msgInfoDetail('error', 'Error', 'Error al guardar:'+error);
        }
      );
    }
  }

  setearForm() {

    this.form.reset();

    this.sede = new SedeInstitucionDto();
    this.institucionEducativa= null;
    this.institucionEducativaShow= new InstitucionEducativaDto();

    this.llenarListSede();
    this.llenarCombos();
    this.enedicion= false;
  }

  cancelar() {
    this.appService.msgInfoDetail('info', '', 'Acción Cancelada')
    this.setearForm();
  }
}


