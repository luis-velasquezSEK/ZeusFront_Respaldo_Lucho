const typeDocument = {
    CEDULA_CIUDADANIA: {code: 'CC', name: 'Cédula de Ciudadanía'},
    TARJETA_IDENTIDAD: {code: 'TI', name: 'Tarjeta de Identidad'},
    PASAPORTE: {code: 'PAS', name: 'Pasaporte'},
    NIT: {code: 'NIT', name: 'Nit'},
    CEDULA_DE_EXTRANJERIA: {code: 'CE', name: 'Cedula de Extranjeria'},
    REGISTRO_CIVIL: {code: 'RC', name: 'Registro Civil'}
} as const

const bloodType = {
    BLOOD_TYPE_AP: {code: 'AP', name: 'A+'},
    BLOOD_TYPE_AN: {code: 'AN', name: 'A-'},
    BLOOD_TYPE_BP: {code: 'BP', name: 'B+'},
    BLOOD_TYPE_BN: {code: 'BN', name: 'B-'},
    BLOOD_TYPE_ABP: {code: 'ABP', name: 'AB+'},
    BLOOD_TYPE_ABN: {code: 'ABN', name: 'AB-'},
    BLOOD_TYPE_OP: {code: 'OP', name: 'O+'},
    BLOOD_TYPE_ON: {code: 'ON', name: 'O-'}
}

const states = {
    STATE_ACTIVE: {code: 'A', name: 'Activo'},
    STATE_INACTIVE: {code: 'I', name: 'Inactivo'}
}

const active = {
  SI: {code: 'S', name: 'SI'},
  NO: {code: 'N', name: 'NO'}
}

const genero = {
  MASCULINO: {code: 'M', name: 'Masculino'},
  FEMENINO: {code: 'F', name: 'Femenino'}
}

const relationships = {
    RELATIONSHIP_DAD: {code: 'DAD', name: 'Padre'},
    RELATIONSHIP_MOTHER: {code: 'MOT', name: 'Madre'},
    RELATIONSHIP_FATHERINLAW: {code: 'FATLAW', name: 'Suegro/a'},
    RELATIONSHIP_CHILD: {code: 'CHI', name: 'Hijo/a'},
    RELATIONSHIP_SONINLAW: {code: 'SONLAW', name: 'Yerno'},
    RELATIONSHIP_DAUGHTERINLAW: {code: 'DAULAW', name: 'Nuera'},
    RELATIONSHIP_GRANDPA: {code: 'GRAPA', name: 'Abuelo/a'},
    RELATIONSHIP_GRANDCHILD: {code: 'GRACHI', name: 'Nieto/a'},
    RELATIONSHIP_BROTHER: {code: 'BRO', name: 'Hermano/a'},
    RELATIONSHIP_BROTHERINLAW: {code: 'BROLAW', name: 'Cuñado/a'},
    RELATIONSHIP_GREATGRANDFATHER: {code: 'GRAFA', name: 'BisAbuelo/a'},
    RELATIONSHIP_GREATGRANDSON: {code: 'GRASO', name: 'BisNieto/a'},
    RELATIONSHIP_UNCLE: {code: 'UNC', name: 'Tio/a'},
    RELATIONSHIP_NEPHEW: {code: 'NEP', name: 'Sobrino/a'},
    RELATIONSHIP_HUSBAND: {code: 'HUS', name: 'Esposo/a'}
}

const sportBack = {
    SPORT_BACK_ATHLETE: {code: 'DEP', name: 'Deportista'},
    SPORT_BACK_NOT_ATHLETE: {code: 'NDEP', name: 'No Deportista'}
}

const danceLevels = {
    DANCE_LEVELS_BEGINNER: {code: '1', name: 'Principiante'},
    DANCE_LEVELS_MASTER: {code: '2', name: 'Maestro'}
}

const danceGenres = {
    DANCE_GENRES_SALSA: {code: '1', name: 'Salsa'},
    DANCE_GENRES_MERENGUE: {code: '2', name: 'Merengue'}
}
const typeGYM = {
  GYM1: {code: '1', name: 'Centro médico deportivo'},
  GYM2: {code: '2', name: 'Entrenamiento personal'},
  GYM3: {code: '3', name: 'Gimnasio tradicional'},
  GYM4: {code: '4', name: 'Artes Marciales'},
  GYM5: {code: '5', name: 'Natación'},
  GYM6: {code: '6', name: 'Wellness'},
  GYM7: {code: '7', name: 'Boutique'},
  GYM8: {code: '8', name: 'Crossfit'},
  GYM9: {code: '9', name: 'Pilates'},
  GYM10: {code: '10', name: 'Boxeo'},
  GYM11: {code: '11', name: 'Studio'},
  GYM12: {code: '12', name: 'Yoga'},
  GYM13: {code: '13', name: 'Baile'},
  GYM14: {code: '14', name: 'Barre'},
  GYM15: {code: '15', name: 'Otro'}
}


const  typeSystem = {
  SYS1: {code: '1', name: 'Control de acceso'},
  SYS2: {code: '2', name: 'Membresías'},
  SYS3: {code: '3', name: 'Agenda'},
  SYS4: {code: '4', name: 'Facturación'},
  SYS5: {code: '5', name: 'Egresos'},
  SYS6: {code: '6', name: 'Cierres de caja'},
  SYS7: {code: '7', name: 'Gestión de inventario'},
  SYS8: {code: '8', name: 'Reportes estadísticos '},
  SYS9: {code: '9', name: 'Rutinas de entrenamiento '},
  SYS10: {code: '10', name: 'Evaluaciones físicas '},
  SYS11: {code: '11', name: 'Nutrición '},
  SYS12: {code: '12', name: 'CRM '},
  SYS13: {code: '13', name: ' Otros(Casilla para almacenar otras necesidades)'}
}

const  typeBoolean = {
  OPT1: {code: '1', name: 'SI'},
  OPT2: {code: '2', name: 'NO'}
}

export const countryTaxes ={
  TAX1:{code:'1',name:'1%'},
  TAX2:{code:'2',name:'2%'},
  TAX3:{code:'3',name:'3%'},
  TAX4:{code:'4',name:'4%'},
  TAX5:{code:'5',name:'5%'},
  TAX6:{code:'6',name:'6%'},
  TAX7:{code:'7',name:'7%'},
  TAX8:{code:'8',name:'8%'},
  TAX9:{code:'9',name:'9%'},
  TAX10:{code:'10',name:'10%'},
  TAX11:{code:'11',name:'11%'},
  TAX12:{code:'12',name:'12%'},
  TAX13:{code:'13',name:'13%'},
  TAX14:{code:'14',name:'14%'},
  TAX15:{code:'15',name:'15%'},
  TAX16:{code:'16',name:'16%'},
  TAX17:{code:'17',name:'17%'},
  TAX18:{code:'18',name:'18%'},
  TAX19:{code:'19',name:'19%'},
  TAX20:{code:'20',name:'20%'},
  TAX21:{code:'21',name:'21%'},
  TAX22:{code:'22',name:'22%'},
  TAX23:{code:'23',name:'23%'},
  TAX24:{code:'24',name:'24%'},
  TAX25:{code:'25',name:'25%'},
  TAX26:{code:'26',name:'26%'},
  TAX27:{code:'27',name:'27%'},
  TAX28:{code:'28',name:'28%'},
  TAX29:{code:'29',name:'29%'},
  TAX30:{code:'30',name:'30%'},
  TAX31:{code:'31',name:'31%'},
  TAX32:{code:'32',name:'32%'},
  TAX33:{code:'33',name:'33%'},
  TAX34:{code:'34',name:'34%'},
  TAX35:{code:'35',name:'35%'},
  TAX36:{code:'36',name:'36%'},
  TAX37:{code:'37',name:'37%'},
  TAX38:{code:'38',name:'38%'},
  TAX39:{code:'39',name:'39%'},
  TAX40:{code:'40',name:'40%'},
  TAX41:{code:'41',name:'41%'},
  TAX42:{code:'42',name:'42%'},
  TAX43:{code:'43',name:'43%'},
  TAX44:{code:'44',name:'44%'},
  TAX45:{code:'45',name:'45%'},
  TAX46:{code:'46',name:'46%'},
  TAX47:{code:'47',name:'47%'},
  TAX48:{code:'48',name:'48%'},
  TAX49:{code:'49',name:'49%'},
  TAX50:{code:'50',name:'50%'}

}


const cargoList = {
  ADMINISTRADOR: {code: '1', name: 'Administrador'},
  RECEPCIONISTA: {code: '2', name: 'Recepcionista'},
  CONTROL_DE_ACCESO: {code: '3', name: 'Control de acceso'},
  INSTRUCTOR: {code: '4', name: 'Instructor'},
  ENTRENADOR: {code: '5', name: 'Entrenador'},
  EVALUADOR: {code: '6', name: 'Evaluador'},
  CONTADOR: {code: '7', name: 'Contador'},
  MEDICO: {code: '8', name: 'Medico'},
  NUTRICIONISTA: {code: '9', name: 'Nutricionista'},
  FISIOTERAPEUTA: {code: '10', name: 'Fisioterapeuta'}
}

export {
  typeDocument,
  bloodType,
  states,
  relationships,
  sportBack,
  danceLevels,
  danceGenres,
  typeGYM,
  typeSystem,
  typeBoolean,
  cargoList,
  genero,
  active
}
