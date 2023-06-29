export class CarreraDto {

  idCarrera: number;
  idFacultad: string;
  idEstadoCarrera: string;
  codigoCarrera: string;
  nombreCarrera: string;
  siglasCarrera: string;
  tituloCarrera: string;
  mencionCarrera: string;
  pathdecretoAprobacionCarrera: string;
  fechacreaCarrera: Date;
  fechaactCarrera: Date;
  fechacierraCarrera: Date;
  activoCarrera: boolean;
  // autoridadesCarreras: string;
  // designacionesCarreras: string;
  // historicoCarreras: string;
  idEstadoCarreraNavigation: any;
  idFacultadNavigation: any;
  // permisosCarreras: string;
  // planEstudios: string;

  mallaListDTO: any[]; //ELIMINAR DESPUES

  constructor() {
  }
}
