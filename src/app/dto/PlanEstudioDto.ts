import {PlanEstudiosPK} from "@/dto/PlanEstudiosPK";

export class PlanEstudioDto {
  idPlanEstudio
  idEstadoPe:number;
  idCarrera: number;
  idModalidadPe: number;
  codigoPlanEstudioMalla: string;
  numerodecretoCesMalla: string;
  pathdecretoCesMalla: string;
  duracionSemestresMalla: number;
  periodicidadMalla: number;
  cupoCesMalla: number;

  constructor() {
  }
}
