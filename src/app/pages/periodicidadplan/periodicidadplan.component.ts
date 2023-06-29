import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AppService} from "@services/app.service";
import {Router} from "@angular/router";
import {PeriodicidadPlanService} from "@services/planestudio/periodicidadplan.service";
import {PeriodicidadPlanEstudioDTO} from "@/dto/periodicidad-plan-dto";

@Component({
  selector: 'app-periodicidadplan',
  templateUrl: './periodicidadplan.component.html',
  styleUrls: ['./periodicidadplan.component.scss']
})
export class PeriodicidadplanComponent implements OnInit {


  /***
   * variables globales
   * */
  form: FormGroup;
  @Input() periodicidadPlan: PeriodicidadPlanEstudioDTO;
  lstPeriodicidadPlan: PeriodicidadPlanEstudioDTO[];


  /***
   * Constructor: se agregar los servicios ncesarios
   * **/
  constructor(public appService: AppService,
              public formBuilder: FormBuilder,
              public periodicidadplanservice: PeriodicidadPlanService,
              public router: Router) {
  }

  /***
   * Constructir para inicializar antes del renderizado de la pagina
   * **/
  ngOnInit() {
    this.periodicidadPlan = new PeriodicidadPlanEstudioDTO();
    this.crearForm();
    this.llenarListPeriodicidadPLan();
  }

  setSeleccionado(periodicidadplan) {
    this.periodicidadPlan = periodicidadplan;
    this.form = this.formBuilder.group(this.periodicidadPlan);
  }

  llenarListPeriodicidadPLan() {
    this.periodicidadplanservice.getAll().subscribe(
      data => {
        this.lstPeriodicidadPlan = data;
      }
    );
  }

  //Inicializa el formulario para el ingreso de la pagina y datos
  crearForm() {
    this.form = new FormGroup({
      idPeriodicidadPlanEstudios: new FormControl('', ),
      nombrePeriodicidadPlanEstudios: new FormControl('', Validators.required),
      codigoPeriodicidadPlanEstudios: new FormControl('', Validators.required),
      descripcionPeriodicidadPlanEstudios: new FormControl('', Validators.required),
      activoPeriodicidadPlanEstudios: new FormControl('', Validators.required),
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
      this.periodicidadPlan = this.form.value;
      this.periodicidadplanservice.saveObject(this.periodicidadPlan).subscribe((data: any) => {
        if (!this.periodicidadPlan.idPeriodicidad) {
          this.appService.msgCreate();
        } else {
          this.appService.msgUpdate();
        }
        this.setearForm();
        this.llenarListPeriodicidadPLan();
      });
    }
  }

  setearForm() {
    this.periodicidadPlan = new PeriodicidadPlanEstudioDTO();
    this.form.reset();
  }

  cancelar() {
    this.appService.msgInfoDetail('info', '', 'Acción Cancelada')
    this.setearForm();
  }
}

