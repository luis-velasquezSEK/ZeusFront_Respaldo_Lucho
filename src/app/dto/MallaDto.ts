export class MallaDto {

  //  ELIMINAR DESPUES
  pathdecretoCesMalla: string;
  codigoPlanEstudioMalla: string;
  idCarreraDTO: any;
  idEstadoMallaDTO: any;
  modalidadMallaListDTO: [];

  idMalla: number;
  idMateria: string;
  idNivelEstudio: string;
  idPlanEstudio: string;
  ordenMalla: string;
  fecharegMalla: Date;
  usuarioregMalla: string;
  usuarioactMalla: string;
  usuarioelimMalla: string;
  activoMalla: boolean;
  observacionMalla: string;
  idMateriaNavigation: any;

  nombreMateria: string;
  codigoMateria: string;
  creditosMateria: string;
  horasSemestralesMateria: string;
  prerrequisitos: string;

  constructor() {
  }
}
