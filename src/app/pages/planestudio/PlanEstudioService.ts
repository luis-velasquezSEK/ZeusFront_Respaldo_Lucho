import {EventEmitter, Injectable, Input, Output} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlanEstudioServiceEmiter {
  @Output() materiaInput = new EventEmitter();
  @Output() componenteInput = new EventEmitter();
  @Output() correquisitoInput = new EventEmitter();
  @Output() prerrequisitoInput = new EventEmitter();
  @Output() compartidaInput = new EventEmitter();
  @Output() equivalentenput = new EventEmitter();
  @Output() horarioSemanalInput = new EventEmitter();
  @Output() horarioFechasInput = new EventEmitter();
  @Output() horarioModularInput = new EventEmitter();
  @Output() horarioFechasInputSelect = new EventEmitter();
  @Output() horarioModularInputSelect = new EventEmitter();
  @Output() espacioInput = new EventEmitter();
  @Output() espacioFechasInput = new EventEmitter();
  @Output() espacioModuloInput = new EventEmitter();
  @Output() lstEspacioInput = new EventEmitter();
  @Output() tipoHorario = new EventEmitter();
  @Output() fechaHorarios = new EventEmitter();
  @Output() fechaInicialModular = new EventEmitter();
  @Output() fechaFinalModular = new EventEmitter();

  setTipoHorario(item) {
    this.tipoHorario.emit(item);
  }

  setMateriaInput(item) {
    this.materiaInput.emit(item);
  }

  setComponenteInput(item) {
    this.componenteInput.emit(item);
  }

  setCorrequisitoInput(item) {
    this.correquisitoInput.emit(item);
  }

  setPrerrequisitoInput(item) {
    this.prerrequisitoInput.emit(item);
  }

  setCompartidaInput(item) {
    this.compartidaInput.emit(item);
  }

  setEquivalenteInput(item) {
    this.equivalentenput.emit(item);
  }

  setHorarioSemanalInput(item) {
    this.horarioSemanalInput.emit(item);
  }

  setHorarioFechasInput(item) {
    this.horarioFechasInput.emit(item);
  }

  setHorarioModularInput(item) {
    this.horarioModularInput.emit(item);
  }

  setEspacioInput(item) {
    this.espacioInput.emit(item);
  }

  setFechaHorarios(item) {
    this.fechaHorarios.emit(item);
  }

  setFechaInicialModular(item) {
    this.fechaInicialModular.emit(item);
  }

  setFechaFinalModular(item) {
    this.fechaFinalModular.emit(item);
  }

  setHorarioFechasInputSelect(item) {
    this.horarioFechasInputSelect.emit(item);
  }

  setHorarioModularInputSelect(item) {
    this.horarioModularInputSelect.emit(item);
  }

  setLstEspacioInput(item) {
    this.lstEspacioInput.emit(item);
  }

  setEspacioFechasInput(item) {
    this.espacioFechasInput.emit(item);
  }

  setEspacioModuloInput(item) {
    this.espacioModuloInput.emit(item);
  }

  //all subscribes
  getTipoHorario(): any {
    this.tipoHorario.subscribe(item => {
      return item;
    });
  }

  getHorarioSemanalInput(): any {
    this.horarioSemanalInput.subscribe(item => {
      return item;
    });
  }

  getHorarioFechasInput(): any {
    this.horarioFechasInput.subscribe(item => {
      /*let horarioFechas = this.getHorarioFechasInputSelect();
      if (horarioFechas !== undefined) {

        if (item.length > 0 && horarioFechas.length > 0) {
          item.forEach(fecha => {
            horarioFechas.forEach(fechaHorario => {
              if (fecha.idFranjaHorario === fechaHorario.idFranjaHorario
                && fecha.activoFranjaHorario !== fechaHorario.activoFranjaHorario) {
                item.replaceItem(fechaHorario, fecha);
              }
            });
          });
        }

      }*/

      return item;
    });
  }

  getHorarioModularInput(): any {
    this.horarioModularInput.subscribe(item => {
      /*
      let horarioModular = this.getHorarioModularInputSelect();
      if (item.length > 0 && horarioModular.length > 0) {
        item.forEach(fecha => {
          horarioModular.forEach(fechaHorario => {
            if (fecha.idFranjaHorario === fechaHorario.idFranjaHorario
              && fecha.activoFranjaHorario !== fechaHorario.activoFranjaHorario) {
              item.replaceItem(fechaHorario, fecha);
            }
          });
        });
      }*/
      return item;
    });
  }


  getHorarioModularInputSelect(): any {
    this.horarioModularInputSelect.subscribe(item => {
      return item;
    });
  }

  getHorarioFechasInputSelect(): any {
    this.horarioFechasInputSelect.subscribe(item => {
      return item;
    });
  }


}
