import {Component, OnInit} from '@angular/core';
import {TreeNode} from "primeng/api";
import {AppService} from "@services/app.service";
import {FacultadService} from "@services/institucioneducativa/facultad.service";
import {CarreraService} from "@services/institucioneducativa/carrera.service";
import {MallaService} from "@services/mallas/malla.service";
import {ModalidadMallaService} from "@services/mallas/modalidadmalla.service";
import {NivelesEstudioService} from "@services/planestudio/nivelesestudio.service";
import {MateriasCatalogoService} from "@services/catalogos/materiascatalogo.service";
import {EstadoPlanService} from "@services/planestudio/estadoplan.service";
import {MateriaPrincipalPlanService} from "@services/planestudio/materiaprincipalplan.service";
import {EstadoPlanEstudioDTO} from "@/dto/estado-plan-dto";
import {PeriodicidadPlanEstudioDTO} from "@/dto/periodicidad-plan-dto";
import {TipoPlanEstudioDTO} from "@/dto/tipo-plan";
import {MateriaPrincipalDto} from "@/dto/materia-principal-plan-dto";
import {FacultadDto} from "@/dto/FacultadDto";
import {CarreraDto} from "@/dto/CarreraDto";
import {MallaDto} from "@/dto/MallaDto";
import {ModalidadMallaDto} from "@/dto/ModalidadMallaDto";
import {NivelEstudioDto} from "@/dto/NivelEstudioDto";
import {CatalogoMateriasDto} from "@/dto/CatalogoMateriasDto";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-mallas',
  templateUrl: './mallas.component.html',
  styleUrls: ['./mallas.component.scss']
})
export class MallasComponent implements OnInit {

  data1: TreeNode[];

  data2: TreeNode[];
  data3: TreeNode[];

  lstData: any[] = new Array();

  selectedNode: TreeNode;

  estadoPlan: EstadoPlanEstudioDTO;
  periodicidadPlan: PeriodicidadPlanEstudioDTO;
  tipoPlan: TipoPlanEstudioDTO;
  materiaPrincipal: MateriaPrincipalDto = new MateriaPrincipalDto();
  facultadSelected: any;
  facultadShow: FacultadDto = new FacultadDto();
  carreraSelected: any;
  carreraShow: CarreraDto = new CarreraDto();
  mallaSelected: any;
  mallaShow: MallaDto = new MallaDto();
  modalidadMallaSelected: any;
  modalidadMallaShow: ModalidadMallaDto = new ModalidadMallaDto();
  nivelEstudioSelected: any;
  nivelEstudiosShow: NivelEstudioDto = new NivelEstudioDto();


  lstTipoPlan: TipoPlanEstudioDTO[];
  lstPeriodicidadPlan: PeriodicidadPlanEstudioDTO[];
  lstEstadoPlan: EstadoPlanEstudioDTO[];
  lstMateriaPrincipal: MateriaPrincipalDto[];
  listFacultad: FacultadDto[];
  listCarrera: CarreraDto[];
  listMalla: MallaDto[];
  listModalidadMalla: ModalidadMallaDto[];
  listNivelEstudios: NivelEstudioDto[];
  listMateriasCatalogo: CatalogoMateriasDto[];


  index = 0;

  constructor(public appService: AppService,
              public facultadService: FacultadService,
              public carreraService: CarreraService,
              public mallaService: MallaService,
              public modalidadMallaService: ModalidadMallaService,
              public nivelEstudioService: NivelesEstudioService,
              public materiacatalogoService: MateriasCatalogoService,
              public estadoplanservice: EstadoPlanService,
              public materiaprincipalService: MateriaPrincipalPlanService) {
  }

  ngOnInit(): void {
    this.llenarCombofacultad();

    this.data3 = [
      {
        label: 'SEMESTRE 2',
        type: 'person',
        styleClass: 'p-person',
        expanded: true,
        data: {name: 'Mike E.', 'avatar': 'mike.jpg'},
        children: [
          {
            label: 'Materia 1',
            styleClass: 'department-cfo',
            data: {name: 'Mike E.', 'avatar': 'mike.jpg', cupos: 2, creditos: 6, horas: 4, activo: true},
            type: 'department',
            expanded: true
          },
          {
            label: 'Materia 2',
            styleClass: 'department-cfo',
            data: {name: 'Jesse Pinkman', 'avatar': 'jesse.jpg', cupos: 2, creditos: 6, horas: 4, activo: true},
          },
          {
            label: 'Materia 3',
            styleClass: 'department-coo',
            data: {name: 'Walter White', 'avatar': 'walter.jpg', cupos: 2, creditos: 6, horas: 4, activo: true},
          },
          {
            label: 'Materia 4',
            styleClass: 'department-cto',
            data: {name: 'Walter White', 'avatar': 'saul.jpg', cupos: 2, creditos: 6, horas: 4, activo: true},
          }
        ],
      }
    ];
    this.data1 = [
      {
        label: 'SEMESTRE 2',
        type: 'person',
        styleClass: 'p-person',
        expanded: true,
        data: {name: 'Mike E.', 'avatar': 'mike.jpg'},
        children: [
          {
            label: 'Materia 1',
            styleClass: 'department-cfo',
            data: {name: 'Mike E.', 'avatar': 'mike.jpg', cupos: 2, creditos: 6, horas: 4, activo: true},
            type: 'department',
            expanded: true
          },
          {
            label: 'Materia 2',
            styleClass: 'department-cfo',
            data: {name: 'Jesse Pinkman', 'avatar': 'jesse.jpg', cupos: 2, creditos: 6, horas: 4, activo: true},
          },
          {
            label: 'Materia 3',
            styleClass: 'department-coo',
            data: {name: 'Walter White', 'avatar': 'walter.jpg', cupos: 2, creditos: 6, horas: 4, activo: true},
          },
          {
            label: 'Materia 4',
            styleClass: 'department-cto',
            data: {name: 'Walter White', 'avatar': 'saul.jpg', cupos: 2, creditos: 6, horas: 4, activo: true},
          }
        ],
      }
    ];

    this.data2 = [
      {
        label: 'SEMESTRE 2',
        type: 'person',
        styleClass: 'p-person',
        expanded: true,
        data: {name: 'Mike E.', 'avatar': 'mike.jpg'},
        children: [
          {
            label: 'Materia 1',
            styleClass: 'department-cfo',
            data: {
              name: 'Mike E.',
              'avatar': 'mike.jpg',
              'paralelo': 'GR1',
              cupos: 2,
              creditos: 6,
              horas: 4,
              activo: true
            },
            type: 'department',
            expanded: true
          },
          {
            label: 'Materia 2',
            styleClass: 'department-cfo',
            data: {
              name: 'Jesse Pinkman',
              'avatar': 'jesse.jpg',
              'paralelo': 'GR2',
              cupos: 2,
              creditos: 6,
              horas: 4,
              activo: true
            },
            type: 'department',
            expanded: true
          },
          {
            label: 'Materia 3',
            styleClass: 'department-coo',
            data: {
              name: 'Walter White',
              'avatar': 'walter.jpg',
              'paralelo': 'GR3',
              cupos: 2,
              creditos: 6,
              horas: 4,
              activo: true
            },
            type: 'department',
            expanded: true
          },
          {
            label: 'Materia 4',
            styleClass: 'department-cto',
            data: {
              name: 'Walter White',
              'avatar': 'saul.jpg',
              'paralelo': 'GR4',
              cupos: 2,
              creditos: 6,
              horas: 4,
              activo: true
            },
            type: 'department',
            expanded: true
          }
        ],
      }
    ];

    this.lstData.push(this.data1);
    this.lstData.push(this.data2);
    this.lstData.push(this.data3);
  }

  onNodeSelect(event) {
    this.appService.msgInfoDetail('success', 'Node Selected', event.node.label);
  }


  llenarCombofacultad() {
    this.facultadService.getAll().subscribe(data => {
      this.listFacultad = data;
    });
  }

  llenarDetalleFacultad(event) {
    try {
      //llena el combo de carrera y setea carrera y carrerashow
      /*this.carreraService.findByFacultad(this.facultadSelected.idFacultad).subscribe(data => {
        this.listCarrera = data;
      });

       */
      if (this.facultadSelected !== null) {
        this.facultadShow = this.facultadSelected;
        this.listCarrera = this.facultadSelected.carreraListDTO;
      } else {
        this.facultadShow = new FacultadDto();
        this.listCarrera = new Array();
        this.listMalla = new Array();
        this.listModalidadMalla = new Array();
        this.listNivelEstudios = new Array();
      }
      this.carreraSelected = null;
      this.carreraShow = new CarreraDto();
      //Setea todos los combos y shows

      this.mallaSelected = null;
      this.mallaShow = new MallaDto();
      this.modalidadMallaSelected = null;
      this.modalidadMallaShow = new ModalidadMallaDto();
      this.nivelEstudioSelected = null;
      this.nivelEstudiosShow = new NivelEstudioDto();
    } catch (error) {
      console.log('ERROR LLENAR DETALLE FACULTAD: ' + JSON.stringify(error));
    }
  }

  llenarDetalleCarrera(event) {

    //llena el combo de carrera y setea carrera y carrerashow
    try {
      this.carreraService.getById(this.carreraSelected.idCarrera).subscribe(data => {
        this.carreraShow = data;

        this.listMalla = this.carreraShow.mallaListDTO;

        //Setea todos los combos y shows

        this.mallaSelected = null;
        this.mallaShow = new MallaDto();
        this.modalidadMallaSelected = null;
        this.modalidadMallaShow = new ModalidadMallaDto();
        this.nivelEstudioSelected = null;
        this.nivelEstudiosShow = new NivelEstudioDto();
      });
    } catch (e) {
      console.log('ERROR' + e);
      this.listMalla = new Array();
      this.listModalidadMalla = new Array();
      this.listNivelEstudios = new Array();
      this.carreraSelected = null;
      this.carreraShow = new CarreraDto();
      this.mallaSelected = null;
      this.mallaShow = new MallaDto();
      this.modalidadMallaSelected = null;
      this.modalidadMallaShow = new ModalidadMallaDto();
      this.nivelEstudioSelected = null;
      this.nivelEstudiosShow = new NivelEstudioDto();
    }


  }

  llenarDetalleMalla(event) {

    try {
      //llena el combo de carrera y setea carrera y carrerashow
      this.mallaService.getById(this.mallaSelected.idMalla).subscribe(data => {
        this.mallaShow = data;

        this.listModalidadMalla = this.mallaShow.modalidadMallaListDTO;

        //Setea todos los combos y shows
        this.modalidadMallaSelected = null;
        this.modalidadMallaShow = new ModalidadMallaDto();
        this.nivelEstudioSelected = null;
        this.nivelEstudiosShow = new NivelEstudioDto();
      });
    } catch (e) {
      console.log('ERROR' + e);
      this.listModalidadMalla = new Array();
      this.listNivelEstudios = new Array();
      this.mallaSelected = null;
      this.mallaShow = new MallaDto();
      this.modalidadMallaSelected = null;
      this.modalidadMallaShow = new ModalidadMallaDto();
      this.nivelEstudioSelected = null;
      this.nivelEstudiosShow = new NivelEstudioDto();
    }


  }

  llenarDetalleModalidadMalla(event) {

    try {
      //llena el combo de carrera y setea carrera y carrerashow
      this.modalidadMallaService.getById(this.modalidadMallaSelected.idModalidadMalla).subscribe(data => {
        this.modalidadMallaShow = data;

        this.listNivelEstudios = this.modalidadMallaShow.nivelEstudioListDTO;
        this.lstMateriaPrincipal = new Array();

        for (let nivel of this.listNivelEstudios) {
          let index = this.listNivelEstudios.indexOf(nivel);

          let params = new HttpParams()
            .set('idNivelEstudio', nivel.idNivelEstudio);
          this.materiaprincipalService.getByNivel(params).subscribe(data => {
            this.listNivelEstudios[index].materiaPrincipalListDTO = data;
          }), (error) => {
            console.log(error);
          }

        }

        console.log('NIVELES + MATERIAS: ' + JSON.stringify(this.listNivelEstudios));

        //Setea todos los combos y shows
        this.nivelEstudioSelected = null;
        this.nivelEstudiosShow = new NivelEstudioDto();

      });
    } catch (e) {
      console.log('ERROR' + e);
      this.listNivelEstudios = new Array();
      this.modalidadMallaSelected = null;
      this.modalidadMallaShow = new ModalidadMallaDto();
      this.nivelEstudioSelected = null;
      this.nivelEstudiosShow = new NivelEstudioDto();
    }

  }

  getMateriasByNivel(nivel) {
    try {
      console.log('ID NIVEL ESTUDIO SELECTED: ' + nivel.idNivelEstudio);
      this.nivelEstudioService.getById(nivel.idNivelEstudio).subscribe(data => {
        let params = new HttpParams()
          .set('idNivelEstudio', nivel.idNivelEstudio);
        this.materiaprincipalService.getByNivel(params).subscribe(data => {
          this.lstMateriaPrincipal = data;
          console.log('DATA MATERIAS: ' + JSON.stringify(data));
          this.materiaPrincipal = new MateriaPrincipalDto();
          return this.lstMateriaPrincipal;
        }), (error) => {
          console.log(error);
          return null;
        }
      });
    } catch (e) {
      console.log('ERROR' + e);
      this.nivelEstudioSelected = null;
      this.nivelEstudiosShow = new NivelEstudioDto();
      this.index = 0;
      this.materiaPrincipal = new MateriaPrincipalDto();
      return null;
    }
  }

  llenarDetalleNivelEstudios(event) {
    try {
      //llena el combo de carrera y setea carrera y carrerashow
      console.log('ID NIVEL ESTUDIO SELECTED: ' + this.nivelEstudioSelected.idNivelEstudio);
      this.nivelEstudioService.getById(this.nivelEstudioSelected.idNivelEstudio).subscribe(data => {
        this.nivelEstudiosShow = data;
        let params = new HttpParams()
          .set('idNivelEstudio', this.nivelEstudioSelected.idNivelEstudio);

        this.materiaprincipalService.getByNivel(params).subscribe(data => {
          this.lstMateriaPrincipal = data;
          this.index = 0;
          this.materiaPrincipal = new MateriaPrincipalDto();
        }), (error) => {
          console.log(error);
        }

      });
    } catch (e) {
      console.log('ERROR' + e);
      this.nivelEstudioSelected = null;
      this.nivelEstudiosShow = new NivelEstudioDto();
      this.index = 0;
      this.materiaPrincipal = new MateriaPrincipalDto();
    }

  }

}
