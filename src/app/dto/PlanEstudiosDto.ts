import {PlanEstudiosPK} from "@/dto/PlanEstudiosPK";

export class PlanEstudiosDto {

  planEstudiosPK: PlanEstudiosPK;

  idPlanEstudio: number;

  ordenPlanEstudio: number;

  codigoMateriaCorrequisitoPlanEstudio: string;

  observacionPlanEstudio:string;

  fecharegPlanEstudio: Date;

  usuarioregPlanEstudio: string;

  usuarioactPlanEstudio: string;

  usuarioelimPlanEstudio: string;

  activoPlanEstudio: boolean;
  materiaCompartidaListDTO: [];
  componenteListDTO: [];
  conceptoPreciosListDTO: [];
  correquisitoListDTO: [];
  franjaHorariaListDTO: [];
  prerrequisitosPlanEstudioListDTO: [];
  idEstadoPeDTO: any;
  idMateriapDTO: any;
  idPeriodicidadPlanEstudiosDTO: any;
  idTipoPeDTO: any;
  materiaEquivalenteListDTO: [];

  constructor() {
  }
}
