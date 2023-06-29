import {
  Component,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Output, EventEmitter
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AppService} from "@services/app.service";
import {FranjaHorarioDto} from "@/dto/FranjaHorarioDto";
import {EspaciosFisicosDto} from "@/dto/EspaciosFisicosDto";
import {EspacioService} from "@services/infraestructura/espacio.service";
import {PlanEstudioServiceEmiter} from "@pages/planestudio/PlanEstudioService";

@Component({
  selector: 'app-horario-semanal',
  templateUrl: './horario-semanal.component.html',
  styleUrls: ['./horario-semanal.component.scss']
})
export class HorarioSemanalComponent implements OnInit {

  lstHorariosInput: FranjaHorarioDto[];
  lstEspacioInput: EspaciosFisicosDto[];
  espacioInput: EspaciosFisicosDto;
  clonedHorarios: { [s: string]: FranjaHorarioDto; } = {};
  espacioSelect: EspaciosFisicosDto;

  constructor(public appService: AppService,
              public formBuilder: FormBuilder,
              public espaciosService: EspacioService,
              public planEstudioService: PlanEstudioServiceEmiter,
  ) {
  }

  ngOnInit(): void {
    this.lstHorariosInput = new Array();
    this.lstEspacioInput = new Array();
    this.planEstudioService.horarioSemanalInput.subscribe(item => {
      this.lstHorariosInput = item;
    });
    this.planEstudioService.espacioInput.subscribe(item => {
      this.espacioInput = item;
    });
    this.planEstudioService.lstEspacioInput.subscribe(item => {
      this.lstEspacioInput = item;
    });
  }

  setChange(event) {
    this.planEstudioService.setEspacioInput(this.espacioSelect);
  }

  onRowEditInit(product: FranjaHorarioDto) {
    this.clonedHorarios[product.idFranjaHorario] = {...product};
    this.planEstudioService.setHorarioSemanalInput(this.lstHorariosInput);
    this.planEstudioService.setTipoHorario(0);
  }

  onRowEditSave(product: FranjaHorarioDto) {
    delete this.clonedHorarios[product.idFranjaHorario];
    this.appService.msgUpdate();
    this.planEstudioService.setHorarioSemanalInput(this.lstHorariosInput);
    this.planEstudioService.setTipoHorario(0);
  }

  onRowEditCancel(product: FranjaHorarioDto, index: number) {
    this.lstHorariosInput[index] = this.clonedHorarios[product.idFranjaHorario];
    delete this.clonedHorarios[product.idFranjaHorario];
    this.appService.msgInfoDetail('error', 'Atención', 'Acción Cancelada');
    this.planEstudioService.setTipoHorario(0);
    this.planEstudioService.setHorarioSemanalInput(this.lstHorariosInput);
  }
}

