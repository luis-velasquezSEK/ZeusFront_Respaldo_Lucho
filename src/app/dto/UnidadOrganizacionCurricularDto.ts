export class UnidadOrganizacionCurricularDto {

  idUoc: number;

  nombreUoc: string;

  codigoUoc: string;

  activoUoc: boolean;

  idDuracionUocDTO: any = {};

  idModalidadUocDTO: any= {};

  idTipoUocDTO: any= {};

  materiaPrincipalListDTO: [];

  constructor() {
  }
}
