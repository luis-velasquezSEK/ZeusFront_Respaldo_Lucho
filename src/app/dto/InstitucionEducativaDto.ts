export class InstitucionEducativaDto {
  idInstitucionEducativa: number;
  codigoInstitucionEducativa: string;
  nombreInstitucionEducativa: string;
  codautorizacionInstitucionEducativa: string;
  pathauitorizacionInstitucionEducativa: string;
  usercreaInstitucionEducativa: string;
  useractInstitucionEducativa: string;
  usereliInstitucionEducativa: string;
  fechacreaInstitucionEducativa: Date;
  fechaactInstitucionEducativa: Date;
  fechaeliInstitucionEducativa: Date;
  activoInstitucionEducativa: boolean;
  premiosListDTO: any[];
  sedeInstitucionListDTO: any[];
  designacionesInstitucionEducativaListDTO: any[];
  idCategoriaDTO: any;
  idTipoInstitucionEducativaDTO: any;
  conveniosListDTO: any[];
  acreditacionesListDTO: any[];
  autoridadesInstitucionEducativaListDTO: any[];

  constructor() {
  }
}
