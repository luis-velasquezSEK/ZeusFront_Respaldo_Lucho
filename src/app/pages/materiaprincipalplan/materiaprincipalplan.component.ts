import {Component, HostBinding, Input, OnInit, Optional,ElementRef,ViewChild} from '@angular/core';
import {ConfirmationService, PrimeIcons, SelectItem} from 'primeng/api';
import {ControlContainer, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AppService} from "@services/app.service";
import {TipoMateriaPrincipalService} from "@services/planestudio/tipomateriaprincipal.service";
import {UnidadOrganizacionalCurricularService} from "@services/planestudio/unidadorganizacionalcurricular.service";
import {TipoMateriaPrincipalDto} from "@/dto/TipoMateriaPrincipalDto";
import {UnidadOrganizacionCurricularDto} from "@/dto/UnidadOrganizacionCurricularDto";
import {MateriaPrincipalDto} from "@/dto/materia-principal-plan-dto";
import { TipoComponenteDto } from '@/dto/TipoComponenteDto';
import { TipoComponenteService } from '@services/componente/tipocomponente.service';
import {MateriasCatalogoService} from "@services/catalogos/materiascatalogo.service";
import {CatalogoMateriasDto} from "@/dto/CatalogoMateriasDto";
import {Table} from "primeng/table";
import {MateriaPrincipalPlanService} from "@services/planestudio/materiaprincipalplan.service";
import { ComponentDto } from '@/dto/ComponentDto';
import { ComponenteService } from '@services/componente/componente.service';
import { Dropdown } from 'primeng/dropdown';
import { SubtipoComponenteDto } from '@/dto/SubtipoComponenteDto';
import { SubTipoComponenteService } from '@services/componente/subtipocomponente.service';


@Component({
  selector: 'app-materiaprincipalplan',
  templateUrl: './materiaprincipalplan.component.html',
  styleUrls: ['./materiaprincipalplan.component.scss']
})
export class MateriaprincipalplanComponent implements OnInit {
  
  form: FormGroup;
  


  /***
   * variables globales, @Input para enlaces de componentes
   * * */
  sections: any[];
  //FORMS
  formGeneral: FormGroup;
  
  //OBJECTS
  materiaPrincipal: MateriaPrincipalDto = new MateriaPrincipalDto();
  tipoMateriaPSeleccteded: any;
  tipoMateriaPShow: TipoMateriaPrincipalDto = new TipoMateriaPrincipalDto();
  uocSeleccted: any;
  uocShow: UnidadOrganizacionCurricularDto = new UnidadOrganizacionCurricularDto();
  materiasCatalogo: CatalogoMateriasDto;
  tipoComponenteShow: TipoComponenteDto = new TipoComponenteDto();
  tipoComponenteSelectec: any
  componenteDto:ComponentDto;
  lstSubtipoComponenteDto:SubtipoComponenteDto[];


  componente:ComponentDto=new ComponentDto();
  //LIST
  listTipoMateriaP: TipoMateriaPrincipalDto[];
  listUoc: UnidadOrganizacionCurricularDto[];
  listMateriasCatalogo: CatalogoMateriasDto[];
  @Input() listTipoComponente: TipoComponenteDto[];
  @Input() listSubTipoComponente: SubtipoComponenteDto[];
  selectedTipoComponenete: TipoComponenteDto[];
  listComponente:ComponentDto[];
  //OTHERS
  duracion: any;
  modalidad: any;
  tipoUoc: any;
  displayModal: boolean;
  loading: boolean;
  nombres:any;
  peso:number[]=[];


  /***
   * Constructor: se agregar los servicios ncesarios
   * **/
  constructor(
   
    public appService: AppService,
    public formBuilder: FormBuilder,
    public materiaprincipalService: MateriaPrincipalPlanService,
    public tipomateriaprincipalService: TipoMateriaPrincipalService,
    public uocService: UnidadOrganizacionalCurricularService,
    public materiacatalogoService: MateriasCatalogoService,
    public tipoComponenteService: TipoComponenteService,
    private confirmationService: ConfirmationService,
    private componenteService:ComponenteService,
    public SubtipoComponenteService: SubTipoComponenteService,
    ) {
    

  }

  /***
   * Constructir para inicializar antes del renderizado de la pagina
   * **/
  ngOnInit() {
    this.llenarSecciones();
    this.llenarCombosSeccion2();
    this.crearForms();
    this.llenarTableTipoComponente();
    this.llenarTableSubTipoComponente();
  }

  /**
   * Se llena las secciones para el timeline
   * ****/
  llenarSecciones() {
    this.sections = [
      {
        index: 1,
        header: 'Datos Generales',
        subheader: 'Características de una materia principal a ser usada.',
        icon: PrimeIcons.BOOK,
        color: '#9C27B0',
        image: 'planEstudio.png'
      },
      {
        index: 2,
        header: 'Tipo de Materia y su Unidad Organizacional Curricular',
        subheader: 'Tipos de materia y Uoc respectiva para ser asignada.',
        icon: 'fa fa-building',
        color: '#673AB7'
      }
    ];
  }


  showModalDialog() {
    this.materiacatalogoService.getAll().subscribe(data => {
      this.listMateriasCatalogo = data;
      console.log(this.listMateriasCatalogo);
      this.displayModal = true;
    })
  }

  confirmMateriaTemplate() {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de usar la Materia Template?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usarMateriaTemplate();
      }
    });
  }

  onRowSelect(event) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de usar la Materia Template?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usarMateriaTemplate();
      }
    });
  }

  onRowUnselect(event) {
    this.appService.msgInfoDetail('warn', 'Materia template', 'Selección Cancelada')
  }
// 	onSelected():void {

//     this.teams.dataKey = this.listTipoMateriaP.find(x=>x.idTipoMateriaCatalogo==1).idTipoMateriaCatalogo.toString();
//     //this.teams.value = this.listTipoMateriaP.find(country => country.idTipoMateriaCatalogo == 1)
//     console.log(this.teams.dataKey);

//    //this.teams.selectId='2';
// 		//this.teams.selectItem=this.selectItems;
// //console.log(this.teams.value.idTipoMateriaCatalogo=3);


// 	}
  usarMateriaTemplate() {

    console.log(this.materiasCatalogo.idUocNavigation.idUoc);
    //console.log('SE ESTA SELECCIONANDO LA TEMPLATE MATERIA: ' + this.materiasCatalogo.codigoMateria);
    this.materiaPrincipal.codigoMateriap = this.materiasCatalogo.codigoMateria;
    this.materiaPrincipal.nombreMateriap = this.materiasCatalogo.nombreMateria;
    this.materiaPrincipal.creditosMateriap = this.materiasCatalogo.creditosMateria;
    this.materiaPrincipal.horasSemestralesMateriap = this.materiasCatalogo.horasSemestralesMateria;
    this.materiaPrincipal.cuposMatriculaMateriap = this.materiasCatalogo.cuposMatriculaMateria;
    this.materiaPrincipal.campoUnescoMateriap = this.materiasCatalogo.campoUnescoMateria;
    this.materiaPrincipal.activoMateriap = this.materiasCatalogo.activoMateria;
    
    this.form.controls.idTipoMateria.setValue(this.listTipoMateriaP
      .find(estado => estado.idTipoMateriaCatalogo === this.materiasCatalogo.idTipoMateriaCatalogoNavigation.idTipoMateriaCatalogo))

      this.form.controls.idUnidadOrganizacional.setValue(this.listUoc
        .find(estado => estado.idUoc === this.materiasCatalogo.idUocNavigation.idUoc))


    //this.teams.value = this.listTipoMateriaP.find(country => country.idTipoMateriaCatalogo == 1);
    //this.teams.findOptionIndex 3;
    //console.log(this.teams.options);
    //this.onSelected();


  //   this.selectItems = [
  //     { nombreTipoMateriaCatalogo: 'CURRICULAR', idTipoMateriaCatalogo: 3 },
  //  ];
    
    // this.teams.selectItem=this.selectItems;
    
    
    //this.nameControl.setValue('9');
    //this.tipoMateriaPSeleccteded = this.select;


    this.formGeneral
    //console.log('asasa:'+ this.formUOC.setValue());



    //console.log('MATERIA PASADA: ' + this.materiaPrincipal.activoMateriap);

    //console.log('MATERIA PASADA: ' + this.materiaPrincipal.codigoMateriap);
    //this.displayModal = false;
    this.formGeneral = this.formBuilder.group(this.materiaPrincipal);
    this.displayModal = false;
    this.appService.msgInfoDetail('info', 'materia Template', 'Materia usada como template exitoso!')
  }

  clear(table: Table) {
    table.clear();
  }

  //se llenan los combos de tipo u de uoc
  llenarCombosSeccion2() {
    this.tipomateriaprincipalService.getAll().subscribe(data => {
      this.listTipoMateriaP = data;
    });
    this.uocService.getAll().subscribe(data => {
      this.listUoc = data;
    });
  }


   cols: any[];
   llenarTableTipoComponente() {
    this.tipoComponenteService.getAll().subscribe(data => {
      this.listTipoComponente = data;


    })
  }

  llenarTableSubTipoComponente() {
    this.SubtipoComponenteService.getAll().subscribe(data => {
      this.listSubTipoComponente = data;


    })
  }




  //Inicializa el formulario para el ingreso de la pagina y datos
  crearForms() {
    this.crearFormGeneral();
   
  }

  crearFormGeneral() {
    this.formGeneral = new FormGroup({
      idMateriap: new FormControl('',),
      codigoMateriap: new FormControl('',),
      nombreMateriap: new FormControl('',),
      creditosMateriap: new FormControl('',),
      horasSemestralesMateriap: new FormControl('',),
      cuposMatriculaMateriap: new FormControl('',),
      campoUnescoMateriap: new FormControl('',),
      activoMateriap: new FormControl('',),

      

    });

    this.form = new FormGroup({
idTipoMateria: new FormControl('',),
idUnidadOrganizacional: new FormControl('',),

    });




  }




  llenarFormTipoMateria(event) {
    this.tipoMateriaPShow = this.tipoMateriaPSeleccteded;
    
  }

  llenarFormUOC(event) {
    this.uocShow = this.uocSeleccted;
    this.duracion = this.uocSeleccted.idDuracionUocDTO.nombreDuracionUoc;
    this.modalidad = this.uocSeleccted.idModalidadUocDTO.nombreModalidadUoc;
    this.tipoUoc = this.uocSeleccted.idTipoUocDTO.nombreTipoUoc;
  }


  guardar() {
    if (this.formGeneral.invalid || this.uocSeleccted === undefined || this.tipoMateriaPSeleccteded === undefined)  
      {
        console.log(this.tipoMateriaPSeleccteded.idTipoMateriaCatalogo);
        console.log(this.uocSeleccted.idUoc);
      this.appService.msgInfoDetail('warn', 'Verificación', 'Verificar los Datos a Ingresar')
      return
      } 
    else {
      this.materiaPrincipal = this.formGeneral.value;      
      this.materiaPrincipal.idTipoMateriaCatalogo = this.tipoMateriaPSeleccteded.idTipoMateriaCatalogo;
      this.materiaPrincipal.idUoc = this.uocSeleccted.idUoc;
      this.materiaprincipalService.saveObject(this.materiaPrincipal).subscribe((data: any) => {
      //this.listTipoComponente.forEach( (element,index) => {
  
        // this.componente.IdTipoComponente=element.idTipoComponente;
        // //console.log(this.peso[index+1]);
        // this.componente.IdMateria=data.idMateria;
        // this.componente.CodigoComponente=element.codigoTipoComponente;
        // this.componente.PesoComponente=this.peso[index+1];
        // this.componente.ActivoComponente=true;
        // this.componenteService.saveObject(this.componente).subscribe(data => {
        //   var datasource = data 
       }); 
      }
       
        //console.log(this.listTipoComponente[index].idTipoComponente)
        this.appService.msgCreate();
        this.setearForm();
    };
    
      //


        // if (!this.materiaPrincipal.idMateriap) {
          
        // } 
        //else {
        //   this.appService.msgUpdate();
        // }
        //this.setearForm();
    //}
      // })
   //});
  //}}
    // console.log(this.control.numhoras)

    //   this.selectedTipoComponenete.forEach(element => {
    //     // console.log(element.idTipoComponente);
    //     console.log(this.control.numhoras)
    //   });
    //}
      // this.materiaprincipalService.saveObject(this.materiaPrincipal).subscribe((data: any) => {
      //   if (!this.materiaPrincipal.idMateriap) {
      //     this.appService.msgCreate();
      //   } else {
      //     this.appService.msgUpdate();
      //   }
      //   this.setearForm();
  //     });
  //   }
  // }

  setearForm() {
    this.formGeneral.reset();
    //OBJECTS
    this.materiaPrincipal = new MateriaPrincipalDto();
    this.tipoMateriaPSeleccteded = null;
    this.tipoMateriaPShow = new TipoMateriaPrincipalDto();
    this.uocSeleccted = null;
    this.uocShow = new UnidadOrganizacionCurricularDto();
    this.materiasCatalogo = null;


    //LIST
    this.listTipoMateriaP = new Array();
    this.listUoc = new Array();
    this.listMateriasCatalogo = new Array();

    //OTHERS
    this.duracion = '';
    this.modalidad = '';
    this.tipoUoc = '';
    this.displayModal = false;


    this.llenarSecciones();
    this.llenarCombosSeccion2();
    this.crearForms();
    this.llenarTableTipoComponente();
  }

  cancelar() {
    this.appService.msgInfoDetail('info', '', 'Acción Cancelada')
    this.setearForm();
  }

}
