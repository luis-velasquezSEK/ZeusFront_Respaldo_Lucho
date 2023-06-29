export class ParroquiaDto {
  // idParroquia: number;
  // nombreParroquia: string;
  // activoParroquia: boolean;
  // idCampusDTO: any;
  // idCiudadDTO: any;

  idParroquia: number;
  idCanton: any;
  codigoParroquia: string;
  nombreParroquia: string;
  activoParroquia: boolean;
  campuses: any[];
  idCantonNavigation: any;


  constructor() {
  }
}
