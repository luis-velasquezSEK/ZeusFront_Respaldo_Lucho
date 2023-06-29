export class InfraestructuraDto {

  idInfraestructura: number;
  idCampus: any;
  idTipoInfraestructura: any;
  codigoInfraestructura: string;
  nombreInfraestructura: string;
  referenciaInfraestructura: string;
  activoInfraestructura: boolean;

  idCampusNavigation: any;
  idTipoInfraestructuraNavigation: any;

  nivelInfraestructuras: any[];
  constructor() {
  }
}
