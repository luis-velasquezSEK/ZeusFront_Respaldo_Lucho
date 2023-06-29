import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MenuItem} from "primeng/api";
import {AppService} from "@services/app.service";
import {EstadoPlanEstudioDTO} from "@/dto/estado-plan-dto";
import {EstadoPlanService} from "@services/planestudio/estadoplan.service";
import {TipoPlanEstudioDTO} from "@/dto/tipo-plan";

@Component({
  selector: 'app-estadoplan',
  templateUrl: './estadoplan.component.html',
  styleUrls: ['./estadoplan.component.scss']
})
export class EstadoplanComponent implements OnInit {

  /***
   * variables globales, @Input para enlaces de componentes
   * */
  form: FormGroup;
  @Input() estadoPlan: EstadoPlanEstudioDTO;
  lstEstadoPlan: EstadoPlanEstudioDTO[];

  /***
   * Constructor: se agregar los servicios ncesarios
   * **/
  constructor(public appService: AppService,
              public formBuilder: FormBuilder,
              public estadoplanservice: EstadoPlanService) {
  }

  /***
   * Constructir para inicializar antes del renderizado de la pagina
   * **/
  ngOnInit() {
    this.estadoPlan = new EstadoPlanEstudioDTO();
    this.crearForm();
    this.llenarListEstadoPLan();
  }


  /***
   * Metodos vinculados a componente principal
   * **/

  setSeleccionado(estadoplan) {
    console.log('SET SELECCIONADO ESTADO PLAN: '+estadoplan);
    this.estadoPlan = estadoplan;
    this.form = this.formBuilder.group(this.estadoPlan);
  }

  llenarListEstadoPLan() {
    this.estadoplanservice.getAll().subscribe(
      data => {
        this.lstEstadoPlan = data;
      }
    );
  }


  //Inicializa el formulario para el ingreso de la pagina y datos
  crearForm() {
    this.form = new FormGroup({
      idEstadoPe: new FormControl('',),
      nombreEstadoPe: new FormControl('', Validators.required),
      observacionEstadoPe: new FormControl('', Validators.required),
      activoEstadoPe: new FormControl('',Validators.required),
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
      this.estadoPlan = this.form.value;
      this.estadoplanservice.saveObject(this.estadoPlan).subscribe((data: any) => {
        if (!this.estadoPlan.idEstadoPe) {
          this.appService.msgCreate();
        } else {
          this.appService.msgUpdate();
        }
        this.setearForm();
        this.llenarListEstadoPLan();
      });
    }
  }

  setearForm(){
    this.estadoPlan = new EstadoPlanEstudioDTO();
    this.form.reset();
  }

  cancelar() {
    this.setearForm();
    this.appService.msgInfoDetail('info', '', 'Acción Cancelada')

  }
}

