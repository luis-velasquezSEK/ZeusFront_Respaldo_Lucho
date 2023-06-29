import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TipoPlanEstudioDTO} from "@/dto/tipo-plan";
import {AppService} from "@services/app.service";
import {TipoPlanService} from "@services/planestudio/tipoplan.service";
import {Router} from "@angular/router";
import {ComponenteDto} from "@/dto/ComponenteDto";
import {ComponenteService} from "@services/componente/componente.service";
import {DuracionComponenteDto} from "@/dto/DuracionComponenteDto";
import {ModalidadComponenteDto} from "@/dto/ModalidadComponenteDto";
import {DuracionComponenteService} from "@services/componente/duracioncomponente.service";
import {ModalidadComponenteService} from "@services/componente/modalidadcomponente.service";
import {TipoComponenteService} from "@services/componente/tipocomponente.service";
import {TipoComponenteDto} from "@/dto/TipoComponenteDto";
import {PlanEstudioServiceEmiter} from "@pages/planestudio/PlanEstudioService";

@Component({
  selector: 'app-componente',
  templateUrl: './componente.component.html',
  styleUrls: ['./componente.component.scss']
})
export class ComponenteComponent implements OnInit {

  /***
   * variables globales
   * */
  form: FormGroup;
  @Input() componenteInput: ComponenteDto = new ComponenteDto();
  @Input() lstComponenteInput: ComponenteDto[];
  @Output() listComponenteEmiter = new EventEmitter();

  componente: ComponenteDto = new ComponenteDto();
  duracionComponente: any;
  modalidadComponente: any;
  tipoComponente: any;
  duracionComponenteShow: DuracionComponenteDto = new DuracionComponenteDto();
  modalidadComponenteShow: ModalidadComponenteDto = new ModalidadComponenteDto();
  tipoComponenteShow: TipoComponenteDto = new  TipoComponenteDto();

  lstComponente: ComponenteDto[];
  lstDuracionComponente: DuracionComponenteDto[];
  lstModalidadComponente: ModalidadComponenteDto[];
  lstTipoComponente: TipoComponenteDto[];

  enedicion: boolean;

  /***
   * Constructor: se agregar los servicios ncesarios
   * **/
  constructor(public appService: AppService,
              public planEstudioService: PlanEstudioServiceEmiter,
              public formBuilder: FormBuilder,
              public componenteService: ComponenteService,
              public duracionComponenteService: DuracionComponenteService,
              public modalidadComponenteService: ModalidadComponenteService,
              public tipoComponenteService: TipoComponenteService,
              public router: Router) {
  }

  /***
   * Constructir para inicializar antes del renderizado de la pagina
   * **/
  ngOnInit() {
    this.componente = new ComponenteDto();
    this.lstComponente = new Array();
    this.componente.idComponente = 0;
    this.crearForm();
    this.llenarListComponente();
    this.llenarCombos();
  }

  setSeleccionado(item) {
    console.log('EMITIDO EN EDICION Y ELIMINACION: '+JSON.stringify(item));

    if(item !==null){
    this.componente = item;
    this.form = this.formBuilder.group(this.componente);
    // this.duracionComponente = this.componente.idDuracionComponenteDTO;
    // this.modalidadComponente = this.componente.idModalidadComponenteDTO;
    this.tipoComponente = this.componente.idSubtipoComponenteNavigation;
    this.enedicion = true;
    }else{
      this.setearForm();
    }
  }

  setListaComponenteEmiter(lista){
    this.lstComponente = lista;
    this.listComponenteEmiter.emit(this.lstComponente);
    console.log('Componente set SET LISTA: '+JSON.stringify(this.lstComponente));

  }

  async llenarCombos() {
    await this.duracionComponenteService.getAll().subscribe(
      data => {
        this.lstDuracionComponente = data;
      }
    );
    await this.modalidadComponenteService.getAll().subscribe(
      data => {
        this.lstModalidadComponente = data;
      }
    );
    await this.tipoComponenteService.getAll().subscribe(
      data => {
        this.lstTipoComponente = data;
      }
    );
  }

  llenarListComponente() {
    this.componenteService.getAll().subscribe(
      data => {
        this.lstComponente = data;
      }
    );
  }

  //Inicializa el formulario para el ingreso de la pagina y datos
  crearForm() {
    this.form = new FormGroup({
      idComponente: new FormControl('',),
      codigoComponente: new FormControl('',),
      nombreComponente: new FormControl('',),
      pesoComponente: new FormControl('',),
      padreComponente: new FormControl('',),
      activoComponente: new FormControl('',),
      profesorListDTO: new FormControl('',),
      componenteListDTO: new FormControl('',),
      comIdComponenteDTO: new FormControl('',),
      idDuracionComponenteDTO: new FormControl('',),
      idEstadocDTO: new FormControl('',),
      idModalidadComponenteDTO: new FormControl('',),
      planEstudiosDTO: new FormControl('',),
      idTipoComponenteDTO: new FormControl('',),
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
      this.componente = this.form.value;
      // this.componente.idDuracionComponenteDTO = this.duracionComponente;
      // this.componente.idModalidadComponenteDTO = this.modalidadComponente;
      this.componente.idSubtipoComponenteNavigation = this.tipoComponente;
      if (this.enedicion) {
        this.lstComponente[this.findIndexById(this.componente.idComponente)] = this.componente;
        this.appService.msgUpdate();
        this.enedicion = false;
      } else {
        this.componente.idComponente = (this.lstComponente.length + 1);
        this.lstComponente.push(this.componente);
        this.appService.msgCreate();
      }

      this.lstComponente = [...this.lstComponente];
      this.listComponenteEmiter.emit(this.lstComponente);
      this.planEstudioService.setComponenteInput(this.lstComponente);
      this.setearForm();
      console.log('VALOR ID COMPONENTE: ' + this.componente.idComponente);
      console.log('TAMAÑO LIST: ' + this.lstComponente.length);
      console.log('LISTA:' + JSON.stringify(this.lstComponente));

    }
  }

  findIndexById(id: number): number {
    let index = 0;
    for (let i = 0; i < this.lstComponente.length; i++) {
      if (this.lstComponente[i].idComponente === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  createId(): number {
    console.log('TAMAÑO LISTA: ' + this.lstComponente.length);
    console.log('ID GENERADO: ' + (this.lstComponente.length + 1));

    return (this.lstComponente.length + 1);
  }

  setearForm() {

    this.form.reset();

    this.componente = new ComponenteDto();
    this.duracionComponente= null;
    this.modalidadComponente= null;
    this.tipoComponente= null;
    this.duracionComponenteShow= new DuracionComponenteDto();
    this.modalidadComponenteShow= new ModalidadComponenteDto();
    this.tipoComponenteShow= new TipoComponenteDto();

   /* this.lstComponente= new Array();
    this.lstDuracionComponente= new Array();
    this.lstModalidadComponente= new Array();
    this.lstTipoComponente= new Array();
*/


    this.enedicion= false;

  }

  cancelar() {
    this.appService.msgInfoDetail('info', '', 'Acción Cancelada')
    this.setearForm();
  }
}

