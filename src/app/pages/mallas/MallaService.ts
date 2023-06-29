import { EventEmitter, Injectable, Output } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class PlanEstudioMallaServicioEmiter {
    @Output() mallaInput = new EventEmitter();
    @Output() horarioMallaInput = new EventEmitter();

    setMallaInput(item) {
        this.mallaInput.emit(item);
    }

    setHorarioMallaInput(item) {
        this.horarioMallaInput.emit(item);
      }
}