export class PeriodoDto {
    
    idPeriodo: number; 
    idPeriodicidad: string; 
    idTipoPeriodo: string; 
    idModalidad: string; 
    idEstadoPeriodo: string; 
    codigoPeriodo: string; 
    codigoNumeroPeriodo: string; 
    codigoTextoPeriodo: string; 
    descripcionPeriodo: string; 
    fechaInicioPeriodo: Date; 
    fechaFinPeriodo: Date; 
    fechaRegistroPeriodo: Date; 
    fechaActualizaPeriodo: Date; 
    activoPeriodo: boolean; 
    // controlesPeriodos: string; 
    idEstadoPeriodoNavigation: any; 
    idModalidadNavigation: any; 
    idPeriodicidadNavigation: any; 
    idTipoPeriodoNavigation: any; 
    // planificacions: string; 


    constructor() {}
}