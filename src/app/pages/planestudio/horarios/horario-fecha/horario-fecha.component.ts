import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AppService} from "@services/app.service";
import {EspaciosFisicosDto} from "@/dto/EspaciosFisicosDto";
import {EspacioService} from "@services/infraestructura/espacio.service";
import {PlanEstudioServiceEmiter} from "@pages/planestudio/PlanEstudioService";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {FechasHorarioDto} from "@/dto/FechasHorarioDto";
import {FechaFechasHorarioDto} from "@/dto/FechaFechasHorarioDto";

@Component({
  selector: 'app-horario-fecha',
  templateUrl: './horario-fecha.component.html',
  styleUrls: ['./horario-fecha.component.scss']
})
export class HorarioFechaComponent implements OnInit {

  lstHorariosFechasInput: FechasHorarioDto[];
  lstHorariosFechasInputSelect: FechasHorarioDto[];
  lstEspacioInput: EspaciosFisicosDto[];
  espacioSelect: EspaciosFisicosDto;
  fecha: Date;
  fechaFechasHorario: FechaFechasHorarioDto[];

  constructor(public appService: AppService,
              public formBuilder: FormBuilder,
              public espaciosService: EspacioService,
              public planEstudioService: PlanEstudioServiceEmiter,) {
  }

  ngOnInit(): void {
    this.lstHorariosFechasInputSelect = new Array();
    this.fechaFechasHorario = new Array();
    this.lstHorariosFechasInput = new Array();
    this.lstEspacioInput = new Array();
    this.planEstudioService.horarioFechasInput.subscribe(
      horario => {
        this.lstHorariosFechasInput = horario;
      }
    );
    this.planEstudioService.espacioFechasInput.subscribe(item => {
      this.espacioSelect = item;
    });
    this.planEstudioService.lstEspacioInput.subscribe(item => {
      this.lstEspacioInput = item;
    });
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.fecha = event.value;
    this.planEstudioService.setFechaHorarios(this.fecha);
    if (this.fecha) {
      let valor1 = this.fechaFechasHorario.find(item => item.fecha.getTime() === this.fecha.getTime());
      if (valor1 === undefined) {
        this.lstHorariosFechasInput.forEach(item => {
          item.activoFechaHorario = false;
        });
        this.lstHorariosFechasInputSelect = new Array();
      }
    } else {
      this.lstHorariosFechasInput.forEach(item => {
        item.activoFechaHorario = false;
      });
      this.lstHorariosFechasInputSelect = new Array();
    }
  }

  setChange(event) {
    this.planEstudioService.setEspacioFechasInput(this.espacioSelect);
  }

  onTimeSelected(product: FechasHorarioDto) {
    this.lstHorariosFechasInputSelect = this.lstHorariosFechasInput.filter(item => item.activoFechaHorario === true);
    this.planEstudioService.setHorarioFechasInput(this.lstHorariosFechasInput);
    this.planEstudioService.setTipoHorario(1);
  }

  guardar() {
    if (this.lstHorariosFechasInputSelect.length > 0 && this.fecha != null) {
      this.lstHorariosFechasInputSelect.forEach(item => {
        let fechasHorarioDto = new FechaFechasHorarioDto();
        fechasHorarioDto.fecha = this.fecha;
        fechasHorarioDto.horaI = item.fechaiFechaHorario;
        fechasHorarioDto.horaF = item.fechafFechaHorario;

        //this.fechaFechasHorario.push(fechasHorarioDto);
        if (!this.fechaFechasHorario.some(item => item.fecha.getTime() === this.fecha.getTime() &&
          (item.horaI.getTime() === fechasHorarioDto.horaI.getTime()
            && item.horaF.getTime() === fechasHorarioDto.horaF.getTime()))) {
          console.log("no existe fecha ni horas");
          this.fechaFechasHorario.push(fechasHorarioDto);
          this.appService.msgCreate();
          this.planEstudioService.setHorarioFechasInputSelect(this.fechaFechasHorario);
          this.planEstudioService.setTipoHorario(1);
        } else {
          console.log("existe fecha y horas" + JSON.stringify(this.fechaFechasHorario.find(item => item.fecha.getTime() === this.fecha.getTime())));
        }
      });
    }

    this.fechaFechasHorario.sort((a, b) => {
      if (a.fecha.getTime() === b.fecha.getTime()) {
        if (a.horaI.getTime() === b.horaI.getTime()) {
          return a.horaF.getTime() - b.horaF.getTime();
        } else {
          return a.horaI.getTime() - b.horaI.getTime();
        }
      } else {
        return a.fecha.getTime() - b.fecha.getTime();
      }
    });


    //this.fechaFechasHorario = this.fechaFechasHorario.sort((a, b) => this.fechaFechasHorario.indexOf(b) - this.fechaFechasHorario.indexOf(a));


    //this.lstHorariosFechasInputSelect = new Array();
  }

  quitarFechaHorario(item) {
    this.fechaFechasHorario.splice(this.fechaFechasHorario.indexOf(item), 1);
    this.planEstudioService.setHorarioFechasInputSelect(this.fechaFechasHorario);
    this.planEstudioService.setTipoHorario(1);
  }

  setearForm() {
  }

  cancelar() {
    this.fechaFechasHorario = new Array();
    this.lstHorariosFechasInputSelect = new Array();
    this.lstHorariosFechasInput.forEach(item => {
      item.activoFechaHorario = false;
    });
    this.planEstudioService.setHorarioFechasInputSelect(this.fechaFechasHorario);

    this.appService.msgInfoDetail('info', '', 'Acción Cancelada')
    this.setearForm();
  }

}
