export class EspaciosFisicosDto {

  idEspaciosFisicos: number;
  idEstadoEspacio: any;
  idTipoEspacio: any;
  idNivelInfraestructura: any;
  codigoEspaciosFisicos: string;
  descripcionEspaciosFisicos: string;
  nombreEspaciosFisicos: string;
  areaEspaciosFisicos: number;
  capacidadTotalEspaciosFisicos: number;
  capacidadParcialEspaciosFisicos: number;
  capacidadVirtualEspaciosFisicos: number;
  activoEspaciosFisicos: boolean;

  detallesEspacios: any[];
  fechasHorarios: any[];
  franjaHorarios: any[];

  idEstadoEspacioNavigation: any;
  idNivelInfraestructuraNavigation: any;
  idTipoEspacioNavigation: any[]

  items: any[];
  ocupanteHorarios: any[];
  planificacions: any[];

  constructor() {
  }
}
