import {Component, Input, OnInit} from '@angular/core';
import {AppService} from "@services/app.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {TipoPlanService} from "@services/planestudio/tipoplan.service";
import {TipoPlanEstudioDTO} from "@/dto/tipo-plan";

@Component({
  selector: 'app-tipoplan',
  templateUrl: './tipoplan.component.html',
  styleUrls: ['./tipoplan.component.scss']
})
export class TipoplanComponent implements OnInit {

  /***
   * variables globales
   * */
  form: FormGroup;
  @Input() tipoPlan: TipoPlanEstudioDTO;
  lstTipoPlan: TipoPlanEstudioDTO[];


  /***
   * Constructor: se agregar los servicios ncesarios
   * **/
  constructor(public appService: AppService,
              public formBuilder: FormBuilder,
              public tipoplanservice: TipoPlanService,
              public router: Router) {
  }

  /***
   * Constructir para inicializar antes del renderizado de la pagina
   * **/
  ngOnInit() {
    this.tipoPlan = new TipoPlanEstudioDTO();
    this.crearForm();
    this.llenarListTipoPLan();
  }

  setSeleccionado(tipoplan) {
    this.tipoPlan = tipoplan;
    this.form = this.formBuilder.group(this.tipoPlan);

    // console.log('RECIVE DESDE EMITER HIJO: ' + this.tipoPlan.idTipoPe)
  }

  llenarListTipoPLan() {
    this.tipoplanservice.getAll().subscribe(
      data => {
        this.lstTipoPlan = data;
      }
    );
  }

  //Inicializa el formulario para el ingreso de la pagina y datos
  crearForm() {
    this.form = new FormGroup({
      idTipoPe: new FormControl('',),
      nombreTipoPe: new FormControl('', Validators.required),
      observacionTipoPe: new FormControl('', Validators.required),
      activoTipoPe: new FormControl('', ),
    });
    //this.form = this.formBuilder.group(this.tipoPlan);
  }

  /**
   * Métodos para funcionalidad de la pagina
   * **/
  guardar() {
    if (this.form.invalid) {
      this.appService.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.tipoPlan = this.form.value;
      this.tipoplanservice.saveObject(this.tipoPlan).subscribe((data: any) => {
        if (!this.tipoPlan.idTipoPe) {
          this.appService.msgCreate();
        } else {
          this.appService.msgUpdate();
        }
        this.setearForm();
        this.llenarListTipoPLan();
      });
    }
  }

  setearForm() {
    this.tipoPlan = new TipoPlanEstudioDTO();
    this.form.reset();
  }

  cancelar() {
    this.appService.msgInfoDetail('info', '', 'Acción Cancelada')
    this.setearForm();
  }
}

