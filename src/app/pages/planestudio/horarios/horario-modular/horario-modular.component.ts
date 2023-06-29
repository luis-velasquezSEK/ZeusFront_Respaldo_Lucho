import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AppService} from "@services/app.service";
import {EspaciosFisicosDto} from "@/dto/EspaciosFisicosDto";
import {EspacioService} from "@services/infraestructura/espacio.service";
import {PlanEstudioServiceEmiter} from "@pages/planestudio/PlanEstudioService";
import {FechasHorarioDto} from "@/dto/FechasHorarioDto";
import {ModuloFechasHorarioDto} from "@/dto/ModuloFechasHorarioDto";

@Component({
  selector: 'app-horario-modular',
  templateUrl: './horario-modular.component.html',
  styleUrls: ['./horario-modular.component.scss']
})
export class HorarioModularComponent implements OnInit {
  lstHorariosModuloInput: FechasHorarioDto[];
  lstHorariosModuloInputSelect: FechasHorarioDto[];
  lstEspacioInput: EspaciosFisicosDto[];
  espacioSelect: EspaciosFisicosDto;

  fechaInicial: Date;
  fechaFinal: Date;

  moduloFechasHorario: ModuloFechasHorarioDto[];


  constructor(public appService: AppService,
              public formBuilder: FormBuilder,
              public espaciosService: EspacioService,
              public planEstudioService: PlanEstudioServiceEmiter,
  ) {
  }

  ngOnInit(): void {
    try {
      this.lstHorariosModuloInput = new Array();
      this.lstEspacioInput = new Array();
      this.moduloFechasHorario = new Array();
      this.lstHorariosModuloInputSelect = new Array();
      this.planEstudioService.horarioModularInput.subscribe(item => {
        this.lstHorariosModuloInput = item;
      });
      this.planEstudioService.espacioModuloInput.subscribe(item => {
        this.espacioSelect = item;
      });
      this.planEstudioService.lstEspacioInput.subscribe(item => {
        this.lstEspacioInput = item;
      });
    } catch (e) {
      console.log('error modular onInit:' + e);
    }
  }

  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    if (dateRangeEnd.value != '' && dateRangeStart.value != '') {
      this.fechaInicial = new Date(dateRangeStart.value);
      this.fechaFinal = new Date(dateRangeEnd.value);
      this.planEstudioService.setFechaInicialModular(this.fechaInicial);
      this.planEstudioService.setFechaFinalModular(this.fechaFinal);

      let valor1 = this.moduloFechasHorario.some(
        //verificar cruce de fechas
        item => {
          return (this.fechaInicial.getTime() >= item.fechaI.getTime() && this.fechaInicial.getTime() <= item.fechaF.getTime())
            || (this.fechaFinal.getTime() >= item.fechaI.getTime() && this.fechaFinal.getTime() <= item.fechaF.getTime())
            || (this.fechaInicial.getTime() <= item.fechaI.getTime() && this.fechaFinal.getTime() >= item.fechaF.getTime());
        }
      );

      if (!valor1) {
        this.lstHorariosModuloInput.forEach(item => {
          item.activoFechaHorario = false;
        });
        this.lstHorariosModuloInputSelect = new Array();
      }
    } else {
      this.fechaInicial = null;
      this.fechaFinal = null;
      this.planEstudioService.setFechaInicialModular(this.fechaInicial);
      this.planEstudioService.setFechaFinalModular(this.fechaFinal);
      this.lstHorariosModuloInput.forEach(item => {
        item.activoFechaHorario = false;
      });
      this.lstHorariosModuloInputSelect = new Array();
    }
  }

  setChange(event) {
    this.planEstudioService.setEspacioModuloInput(this.espacioSelect);
  }

  onTimeSelected(product: FechasHorarioDto) {
    this.lstHorariosModuloInputSelect = this.lstHorariosModuloInput.filter(item => item.activoFechaHorario === true);
    this.planEstudioService.setHorarioModularInput(this.lstHorariosModuloInput);
    this.planEstudioService.setTipoHorario(2);
  }

  guardar() {

    if (this.lstHorariosModuloInputSelect.length > 0 && this.fechaFinal != null && this.fechaInicial != null) {
      this.lstHorariosModuloInputSelect.forEach(item => {
        let fechasHorarioDto = new ModuloFechasHorarioDto();
        fechasHorarioDto.fechaI = this.fechaInicial;
        fechasHorarioDto.fechaF = this.fechaFinal;
        fechasHorarioDto.horaI = item.fechaiFechaHorario;
        fechasHorarioDto.horaF = item.fechafFechaHorario;

        let valor1 = this.moduloFechasHorario.some(
          item => {
            return (fechasHorarioDto.fechaI >= item.fechaI && fechasHorarioDto.fechaI <= item.fechaF)
              || (fechasHorarioDto.fechaF >= item.fechaI && fechasHorarioDto.fechaF <= item.fechaF)
              || (fechasHorarioDto.fechaI <= item.fechaI && fechasHorarioDto.fechaF >= item.fechaF);
          }
        );

        let valor = this.moduloFechasHorario.some(item => valor1 &&
          (item.horaI.getTime() === fechasHorarioDto.horaI.getTime()
            && item.horaF.getTime() === fechasHorarioDto.horaF.getTime()));

        if (!this.moduloFechasHorario.some(item => valor1 &&
          (item.horaI.getTime() === fechasHorarioDto.horaI.getTime()
            && item.horaF.getTime() === fechasHorarioDto.horaF.getTime()))) {
          this.moduloFechasHorario.push(fechasHorarioDto);
          this.appService.msgCreate();
          this.planEstudioService.setHorarioModularInputSelect(this.moduloFechasHorario);
          this.planEstudioService.setTipoHorario(2);
        } else {
          let msg = {
            Rango: fechasHorarioDto.fechaI.toLocaleDateString().concat(' - ').concat(fechasHorarioDto.fechaF.toLocaleDateString()),
            Horario: item.fechaiFechaHorario.toLocaleTimeString().concat(' - ').concat(item.fechafFechaHorario.toLocaleTimeString())
          }
          this.appService.msgInfoDetail(
            'warn',
            'Cruce de Modulos',
            'Rango Fechas: ' + msg.Rango + '\nHorario: ' + msg.Horario)
        }
      });
    }

    //sort moduloFechasHorario by fechaI abd fechaF
    this.moduloFechasHorario.sort((a, b) => {
      if (a.fechaI.getTime() === b.fechaI.getTime()) {
        if (a.horaI.getTime() === b.horaI.getTime()) {
          return a.horaF.getTime() - b.horaF.getTime();
        } else {
          return a.horaI.getTime() - b.horaI.getTime();
        }
      } else {
        return a.fechaI.getTime() - b.fechaI.getTime();
      }
    });
  }

  quitarFechaHorario(item) {
    this.moduloFechasHorario.splice(this.moduloFechasHorario.indexOf(item), 1);
    this.planEstudioService.setHorarioModularInputSelect(this.moduloFechasHorario);
    this.planEstudioService.setTipoHorario(2);
  }

  setearForm() {
  }

  cancelar() {
    this.moduloFechasHorario = new Array();
    this.lstHorariosModuloInputSelect = new Array();
    this.lstHorariosModuloInput.forEach(item => {
      item.activoFechaHorario = false;
    });
    this.planEstudioService.setHorarioFechasInputSelect(this.moduloFechasHorario);
    this.appService.msgInfoDetail('info', '', 'Acción Cancelada')
    this.setearForm();
  }
}
