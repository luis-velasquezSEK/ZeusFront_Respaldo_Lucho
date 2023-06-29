export class FranjaHorarioDto {

  idFranjaHorario: number;

  horarioiFranjaHorario: Date = new Date();

  horariofFranjaHorario: Date = new Date();

  lunesFranjaHorario: string;

  martesFranjaHorario: string;

  miercolesFranjaHorario: string;

  juevesFranjaHorario: string;

  viernesFranjaHorario: string;

  sabadoFranjaHorario: string;

  domingoFranjaHorario: string;

  observacionFranjaHorario: string;

  activoFranjaHorario: boolean;
  idEspaciosFisicosDTO: any;
  idEstadoFranjaHorarioDTO: any;

  estadoLunesFranjaHorario: boolean;

  estadoMartesFranjaHorario: boolean;

  estadoMiercolesFranjaHorario: boolean;

  estadoJuevesFranjaHorario: boolean;

  estadoViernesFranjaHorario: boolean;

  estadoSabadoFranjaHorario: boolean;

  estadoDomingoFranjaHorario: boolean;

  planEstudioLunesFranjaHorario: number;

  planEstudioMartesFranjaHorario: number;

  planEstudioMiercolesFranjaHorario: number;

  planEstudioJuevesFranjaHorario: number;

  planEstudioViernesFranjaHorario: number;

  planEstudioSabadoFranjaHorario: number;

  planEstudioDomingoFranjaHorario: number;

  constructor() {
  }
}
