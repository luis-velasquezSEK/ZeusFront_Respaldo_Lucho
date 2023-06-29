import { Component, OnInit } from '@angular/core';
import { MallaDto } from '@/dto/MallaDto';
import { MallaService } from '@services/mallas/malla.service';
import { PlanEstudioMallaServicioEmiter } from '../MallaService';
import { SelectItem } from 'primeng/api';
import { NivelEstudioDto } from "@/dto/NivelEstudioDto";
import { NivelesEstudioService } from '@services/planestudio/nivelesestudio.service'; 
import { MateriaPrincipalPlanService } from '@services/planestudio/materiaprincipalplan.service';
import { MateriaPrincipalDto } from '@/dto/materia-principal-plan-dto';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-mallacurrilular',
  templateUrl: './mallacurrilular.component.html',
  styleUrls: ['./mallacurrilular.component.scss']
})
export class MallacurrilularComponent implements OnInit {

  /***
   * variables globales, @Input para enlaces de componentes
   * * */
  malla: MallaDto = new MallaDto();

  lstMalla: MallaDto[] = [];

  nivelEstudioSelected: any;
  nivelEstudioShow: NivelEstudioDto = new NivelEstudioDto();
  lstNivelEstudio: NivelEstudioDto[];
  lstMtaeriaPrincipal: MateriaPrincipalDto[]

  index = 0;
  sortOptions: SelectItem[];
  sortOrder: number;
  sortKey: string;
  sortField: string;

  constructor(public planEstudioMallaService: PlanEstudioMallaServicioEmiter,
              public nivelEstudioService: NivelesEstudioService,
              public materaprincipalService: MateriaPrincipalPlanService,
              public mallaService: MallaService) { }

  ngOnInit(): void {
    this.sortOptions = [
      {label: 'Nombre A-Z', value: 'codigoPlanEstudioMalla'},
      {label: 'Nombre Z-A', value: '!codigoPlanEstudioMalla'}
    ]
    // this.llenarMaterias()
  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf("!") === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  escogerMalla(item) {
    if (this.index === 0) {
      this.index = item.idMalla;
      this.malla = item;
    } else if (this.malla.idMalla == item.idMalla) {
      this.index == 0;
      this.malla = new MallaDto();
    } else {
      this.index = item.idMalla;
      this.malla = item;
    }
    this.planEstudioMallaService.setMallaInput(this.malla);
  }

  async llenarMaterias(event) {
    try {
      console.log('ID NIVEL ESTUDIO SELECTED: ' + this.nivelEstudioShow.idNivelEstudio);
      await this.nivelEstudioService.getAll().subscribe(data => {
        this.lstNivelEstudio = data
        let params = new HttpParams()
          .set('idNivelEstudio', this.nivelEstudioShow.idNivelEstudio);
          console.log('params:: ', params); 

        this.mallaService.getById(params).subscribe(res => {
        // this.materaprincipalService.getByNivel(params).subscribe(res => {
          this.lstMalla = res;
          this.index = 0;
          this.malla = new MallaDto()
        }), (error) => {
          console.log(error)
        }
      })
    } catch (e) {
      console.log('ERROR: ', e)
      
    }
  }

}
