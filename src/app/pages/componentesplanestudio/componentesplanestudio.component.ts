import { CatalogoMateriasDto } from '@/dto/CatalogoMateriasDto';
import { PlanEstudioDto } from '@/dto/PlanEstudioDto';
import { SubtipoComponenteDto } from '@/dto/SubtipoComponenteDto';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AppService } from '@services/app.service';
import { MateriasCatalogoService } from '@services/catalogos/materiascatalogo.service';
import { ComponentePlanEstudioService } from '@services/componenteplanestudio/componenteplanestudio.service';
import { TipoComponenteService } from '@services/componente/tipocomponente.service';
import { IFacultad } from '@/Interfaces/ifacultad';
import { FacultadService } from '@services/facultad/facultad.service';

import { ICarrera } from '@/Interfaces/icarrera';
import { CarreraService } from '@services/facultad/carrera.service';
import { PlanEstudioService } from '@services/planestudio/planestudio.service';
import { IPlanEstudio } from '@/Interfaces/iplanestudio';
import { IModalidad } from '@/Interfaces/imodalidad';

import { MateriaMallaService } from '@services/mallas/materiamalla.service';
import { IMateriaMalla } from '@/Interfaces/imateria-malla';
import { MateriaComponenteService } from '@services/planestudio/materiacomponente.service';
import { MessageService, PrimeIcons } from 'primeng/api';
import { TipoComponenteDto } from '@/dto/TipoComponenteDto';
import { TipoSubtipoComponenteDto } from '@/dto/TipoSubtipoComponente';
import { IMateriaComponente } from '@/Interfaces/imateriacomponente';
import { ComponenteMateriaMallaDto } from '@/dto/ComponenteMateriaMallaDto';


@Component({
  selector: 'app-componentesplanestudio',
  templateUrl: './componentesplanestudio.component.html',
  styleUrls: ['./componentesplanestudio.component.scss']
})
export class ComponentesplanestudioComponent implements OnInit {

  facultadlst: IFacultad; facultadSelected: any;
  carreralst: ICarrera; carreraSelected: any;
  planEstudiolst: IPlanEstudio; planSelected: any;
  modalidadlst: IModalidad;
  modalidadSelected: any;
  materiaMallalst: IMateriaMalla;
  selectedMateriaMalla: any;
  visible: boolean;
  codMateriaSelected: any;
  nomMateriaSelected: any;
  credMateriaSelected: any;
  horaMateriaSelected: any;
  listMateriasCatalogo: any;
  displayModal: boolean;
  materiasCatalogo: any;
  lsttipoSubtipoComponenteDto: TipoSubtipoComponenteDto[];
  totalAAValue: number;
  totalACDValue: number;
  totalAPEValue: number;
  horascomponente:ComponenteMateriaMallaDto;



  sections: any[];
  formGeneral: FormGroup;
  formMateria: FormGroup;
  facultadSeleccted: any;
  lstPlanEstudio: PlanEstudioDto[];
  lstMateriasCatalogo: CatalogoMateriasDto[];
  materiaSeleccted: any;

  loading: boolean;
  selectedSubTipoComponente: SubtipoComponenteDto[];
  peso: number[] = [];
  constructor(
    public appService: AppService,
    public formBuilder: FormBuilder,
    public ComponentePlanEstudioService: ComponentePlanEstudioService,
    public materiacatalogoService: MateriasCatalogoService,
    public tipoComponenteService: TipoComponenteService,
    public facultadService: FacultadService,
    public carreraService: CarreraService,
    public planEstudioService: PlanEstudioService,
    public materiaMallaService: MateriaMallaService,
    private messageService: MessageService,
    private materiacomponenteservice: MateriaComponenteService
  ) { }



  ngOnInit() {
    
    this.llenarSecciones();
    this.crearForms();
    this.llenarTablaTipoComponente();
    this.cargarcombofacultad();
    this.listMateriasCatalogo = new Array();
    this.totalAPEValue = 0;
    this.totalAAValue = 0;
    this.totalACDValue = 0;
  }

  cargarcombofacultad() {
    this.facultadService.getAll().subscribe(data => {
      this.facultadlst = data;
    });
  }

  cargarcombocarrera(idfacultad: number) {
    this.carreraService.getById(idfacultad).subscribe(data => {
      this.carreralst = data;
    });
  }
  cargarcomboplanestudio(idcarrera: number) {
    this.planEstudioService.getByIdCarrera(idcarrera).subscribe(data => {
      this.planEstudiolst = data;
    });
  }

  cargarcombomodalidad(codplan: string) {
    this.planEstudioService.getByIdModalidad(codplan).subscribe(data => {
      this.modalidadlst = data;
    });
  }


  llenarSecciones() {
    this.sections = [
      {
        index: 1,
        header: 'Plan de Estudio',
        subheader: 'Características de un plan de estudio.',
        icon: PrimeIcons.BOOK,
        color: '#9C27B0',
        image: 'planEstudio.png'
      },
      {
        index: 2,
        header: 'Materia',
        subheader: 'Materia.',
        icon: PrimeIcons.BOOK,
        color: '#9C27B0',
        image: 'planEstudio.png'
      },
      {
        index: 3,
        header: 'Componentes',
        subheader: 'Subtipos de componentes.',
        icon: 'fa fa-building',
        color: '#673AB7'
      },

    ];
  }

  crearForms() {
    this.crearFormGeneral();
    this.crearFormMateria();
    this.displayModal = false;
    this.materiasCatalogo = null;
  }

  crearFormGeneral() {
    this.formGeneral = new FormGroup({
      idPlanEstudio: new FormControl('',),
      idMateria: new FormControl('',),
      controlfacultad: new FormControl('',),
      controlcarrera: new FormControl('',),
      controlplanestudio: new FormControl('',),
      controlmodalidad: new FormControl('',)
    });
  }
  crearFormMateria() {
    this.formMateria = new FormGroup({
      codigoMateria: new FormControl('',),
      nombreMateria: new FormControl('',),
      creditoMateria: new FormControl('',),
      horasMateria: new FormControl('',)

    });
  }


  cargarTablaMaterias(idplanestudio: string, idmodalidad: number) {
    this.materiaMallaService.getByIdPlanEstudio(idplanestudio, idmodalidad).subscribe(data => {
      this.materiaMallalst = data;
      //console.log(data);
    });
  }



  guardar() {

    let totalAA = 0;
    let totalAPE = 0;
    let totalACD = 0;

    if (this.formGeneral.invalid) {
      this.appService.msgInfoDetail('warn', 'Verificación', 'Verificar los Datos a Ingresar')
      return
    }
    else {
      //console.log(this.planSelected);
      this.planEstudioService.getIdMateriaPlan(this.planSelected.codigoPlanEstudioMalla, this.codMateriaSelected).subscribe(data => {
        for (let result of this.lsttipoSubtipoComponenteDto) {
          this.horascomponente=new ComponenteMateriaMallaDto();
              this.horascomponente.idPlanEstudio=data.idplanestudio;
              this.horascomponente.idMateria=data.idmateria;
              this.horascomponente.idSubtipoComponente=result.idSubtipoComponente;
              this.horascomponente.codigoComponente= "";
              this.horascomponente.codigoSubtipoComponente= "";
              this.horascomponente.nombreSubtipoComponente= "";
              this.horascomponente.horasComponente= this.peso[result.idSubtipoComponente];
              this.horascomponente.pesoComponente=0;
              this.materiacomponenteservice.editObject(this.horascomponente).subscribe({
              });
        }
        this.messageService.add({ severity: 'info', summary: 'Horas actualizadas correctamente'});
      });

      for (let result of this.lsttipoSubtipoComponenteDto) {
          console.log(result.codigoTipoComponente);
          switch (result.codigoTipoComponente) {
            case 'AA': {
              totalAA += this.peso[result.idSubtipoComponente];
              break;
            }
            case 'ACD': {
              totalACD += this.peso[result.idSubtipoComponente];
              break;
            }
            case 'APE': {
              totalAPE += this.peso[result.idSubtipoComponente];
              break;
            }
          }
      }

      this.totalAAValue = totalAA;
      this.totalACDValue = totalACD;
      this.totalAPEValue = totalAPE;

      // this.materiaPrincipal = this.formGeneral.value;
      // this.materiaPrincipal.idTipoMateriaCatalogo = this.tipoMateriaPSeleccteded.idTipoMateriaCatalogo;
      // this.materiaPrincipal.idUoc = this.uocSeleccted.idUoc;
      // this.materiaprincipalService.saveObject(this.materiaPrincipal).subscribe((data: any) => {
      // });
      //console.log(this.materiaMallalst);
    }
  }






  cancelar() {

  }


  cargarcombomateria() {
    this.materiacatalogoService.getAll().subscribe(data => {
      this.lstMateriasCatalogo = data;
    });
  }

  llenarTablaTipoComponente() {
    this.tipoComponenteService.getAllTipoSubtipoComponent().subscribe(data => {
      this.lsttipoSubtipoComponenteDto = data;

      console.log(this.lsttipoSubtipoComponenteDto);
    });
  }

  limpiarTablaComponentes(){
    for (let result of this.lsttipoSubtipoComponenteDto) {
      this.peso[result.idSubtipoComponente]=0;

    }
    this.totalAAValue=0;
    this.totalACDValue=0;
    this.totalAPEValue=0;
  }


  onChangeFacultad(event) {

    this.cargarcombocarrera(event.value.idFacultad)
    this.limpiarTablaComponentes();
  }
  onChangeCarrera(event) {

    this.cargarcomboplanestudio(event.value.idCarrera)
    this.limpiarTablaComponentes();
  }

  onChangeModalidad(event) {

    this.cargarcombomodalidad(event.value.codigoPlanEstudioMalla)
    this.limpiarTablaComponentes();
  }




  popUpMateriasPlan() {

    this.cargarTablaMaterias(this.planSelected.codigoPlanEstudioMalla, this.modalidadSelected.idModalidadPe);
    this.visible = true;
  }

  onRowSelect(event) {
    this.codMateriaSelected = event.data.codigoMateria;
    this.nomMateriaSelected = event.data.nombreMateria;
    this.credMateriaSelected = event.data.creditosMateria;
    this.horaMateriaSelected = event.data.horasSemestralesMateria;
    this.messageService.add({ severity: 'info', summary: 'Materia Seleccionada', detail: event.data.nombreMateria });
    this.visible = false;
    this.setValoresTablaComponentes(this.planSelected.codigoPlanEstudioMalla,event.data.idMateria);
  }

  onRowUnselect(event) {
    this.messageService.add({ severity: 'info', summary: 'Product Unselected', detail: event.data.nombreMateria });
  }

  popUpMateriasComponentes() {
    this.materiacomponenteservice.getAll().subscribe(data => {
      this.listMateriasCatalogo = data;
      console.log(this.listMateriasCatalogo);
      this.displayModal = true;
    })
  }
  setValoresTablaComponentes(codplan:string,idmateria:number){


    this.materiacomponenteservice.getAllByIdPlan(codplan,idmateria).subscribe(data => {
      let totalAA = 0;
      let totalAPE = 0;
      let totalACD = 0;
      console.log(data[0].componentesMateriaDto);
      for (let result of data[0].componentesMateriaDto) {
  
            this.peso[result.idSubtipoComponente] = result.horasComponente;
            switch (result.codigoComponente) {
              case 'AA': {
                totalAA += this.peso[result.idSubtipoComponente];
                break;
              }
              case 'ACD': {
                totalACD += this.peso[result.idSubtipoComponente];
                break;
              }
              case 'APE': {
                totalAPE += this.peso[result.idSubtipoComponente];
                break;
              }
            }
      }
      this.totalAAValue = totalAA;
      this.totalACDValue = totalACD;
      this.totalAPEValue = totalAPE;

    })
    
  }



  onRowSelectComponente(event) {

    let totalAA = 0;
    let totalAPE = 0;
    let totalACD = 0;
    let datosComponentes = event.data.componentesMateriaDto;
    for (let result of datosComponentes) {

          this.peso[result.idSubtipoComponente] = result.horasComponente;
          switch (result.codigoComponente) {
            case 'AA': {
              totalAA += this.peso[result.idSubtipoComponente];
              break;
            }
            case 'ACD': {
              totalACD += this.peso[result.idSubtipoComponente];
              break;
            }
            case 'APE': {
              totalAPE += this.peso[result.idSubtipoComponente];
              break;
            }
          }
    }
    this.totalAAValue = totalAA;
    this.totalACDValue = totalACD;
    this.totalAPEValue = totalAPE;
    this.messageService.add({ severity: 'info', summary: 'Materia Seleccionada'});
    this.displayModal=false;

  }

}
