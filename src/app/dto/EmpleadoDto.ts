export class EmpleadoDto {

    // idEmp: number;
    // idEstadoEmp: string;
    // idFacultad: string;
    // idTipoEmp: string;
    // nombresEmp: string;
    // apellidoEmp: string;
    // dniEmp: string;
    // fnacEmp: Date;
    // edadEmp: string;
    // fechaRegistroEmp: Date;
    // fechaActualizaEmp: Date;
    // pathfirmadigitalEmp: string;
    // activoEmp: boolean;
    // fotoEmp: string;

    // idEstadoEmpNavigation: any;
    // idFacultadNavigation: any;
    // idTipoEmpNavigation: any;

    // contratos: any[];
    // distributivoDocentes: any[];
    // infoAcademicas: any[];
    // infoExperiencia: any[];
    // infoPersonals: any[];

    //NUEVO DTO EMPLEADO

    idEmp: number;
    nombresEmp: string;
    apellidoEmp: string;
    identificacionEmp: string;
    fnacEmp: Date;
    edadEmp: string;
    sexoEmp: string;
    callePrincipal: string;
    calleSecundaria: string;
    numeracion: string;
    codPostal: string;
    referencia: string;
    telefonoEmp: string;
    celularEmp: string;
    correoEmp: string;
    fechaRegistroEmp: Date;
    fechaActualizaEmp: Date;
    pathfirmadigitalEmp: string;
    fotoEmp: string;
    activoEmp: boolean;
    
    idUnidad: any;
    idEstadoEmp: any;
    idTipoDocumento: any;
    idPaisNac: any;
    idPais: any;
    idProvincia: any;
    idCanton: any;
    idParroquia: any;
    idTipoEmp: any;
    
    idCantonNavigation: any;
    idEstadoEmpNavigation: any;
    idPaisNacNavigation: any;
    idParroquiaNavigation: any;
    idProvinciaNavigation: any;
    idTipoDocumentoNavigation: any;
    idTipoEmpNavigation: any;
    idUnidadNavigation: any;

    contratos: any[];
    distributivoDocentes: any[];
    infoAcademicas: any[];
    infoExperiencia: any[];
    infoPersonals: any[];


    constructor() {
    }
}