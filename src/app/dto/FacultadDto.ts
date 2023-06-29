export class FacultadDto {

  idFacultad: number;
  idEstadoFacultad: string;
  idCampus: string;
  nombreFacultad: string;
  descripcionFacultad: string;
  codigoFacultad: string;
  resolucionFacultad: string;
  fechacreaFacultad: Date;
  fechaactFacultad: Date;
  fechacierreFacultad: Date;
  fecharegistroFacultad: Date;
  activoFacultad: boolean;
  // autoridadesFacultads: string;
  // carreras: string;
  // designacionesFacultads: string;
  // empleados: string;
  // historicoFacultads: string;
  idCampusNavigation: any;
  idEstadoFacultadNavigation: any;

  constructor() {
  }
}
