export class CampusDto {
  idCampus: number;
  codigoCampus: string;
  nombreCampus: string;
  callePrincipalCampus: string;
  calleSecundariaCampus: string;
  numeroCampus: string;
  referenciaCampus: string;
  codPostalCampus: string;
  telefonoCampus: string;
  faxCampus: string;
  emailCampus: string;
  activoCampus: boolean;
  infraestructuraListDTO: [];
  facultadListDTO: [];
  permisosListDTO: [];
  idParroquiaDTO: any;
  idSedeInstitucionDTO: any;

  constructor() {
  }
}
