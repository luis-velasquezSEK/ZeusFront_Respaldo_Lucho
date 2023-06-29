import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TipoPlanEstudioDTO} from "@/dto/tipo-plan";
import {TipoPlanService} from "@services/planestudio/tipoplan.service";
import {AppService} from "@services/app.service";
import {ConfirmationService} from "primeng/api";
import {Table} from "primeng/table";
import * as FileSaver from 'file-saver';
import jsPDF from "jspdf";
import "jspdf-autotable";
import {formatDate} from "@angular/common";
import {ComponenteDto} from "@/dto/ComponenteDto";
import {ComponenteService} from "@services/componente/componente.service";
import {PlanEstudioServiceEmiter} from "@pages/planestudio/PlanEstudioService";

@Component({
  selector: 'app-componentetable',
  templateUrl: './componentetable.component.html',
  styleUrls: ['./componentetable.component.scss']
})
export class ComponentetableComponent implements OnInit {

  @Input() lstComponente: ComponenteDto[];
  @Output() componenteSelect = new EventEmitter();
  @Output() lstComponenteEmiter = new EventEmitter();

  componente: ComponenteDto;

  selectedComponente: ComponenteDto[];

  submitted: boolean;

  loading: boolean;

  exportColumns: any[];

  cols: any[];

  constructor(private componenteService: ComponenteService,
              public planEstudioService: PlanEstudioServiceEmiter,
              private appservice: AppService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.construirTabla();
  }

  construirTabla() {
    /*this.tipoplanservice.getAll().subscribe(
      data => {
        this.lstTipoPlan = data;
      }
    );*/

    this.cols = [
      {field: 'idComponente', header: '#'},
      {field: 'codigoComponente', header: 'Nombre'},
      {field: 'nombreComponente', header: 'Observaciones'},
      {field: 'pesoComponente', header: 'Peso'},
      {field:'idDuracionComponenteDTO.nombreDuracionComponente',header: 'Duración'},
      {field:'idModalidadComponenteDTO.nombreModalidadComponente',header: 'Modalidad'},
      {field:'idTipoComponenteDTO.nombreTipoComponente',header: 'Tipo'},
      {field: 'activoComponente', header: 'Activo'},
    ];

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
    this.loading = false;

  }

  clear(table: Table) {
    table.clear();
  }

  deleteSelectedComponente() {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de Eliminar los elementos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarComponenteSelected();
      }
    });
  }


  eliminarComponenteSelected() {
    let indexLista:number = 0;
    this.lstComponente = this.lstComponente.filter(val => !this.selectedComponente.includes(val));
    this.selectedComponente = null;
    this.componenteSelect.emit(null);
    this.lstComponenteEmiter.emit(this.lstComponente);
    this.planEstudioService.setComponenteInput(this.lstComponente);


    this.appservice.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
  }

  editTipoPlan(componente) {
    this.componente = {...componente};
    this.componenteSelect.emit(componente);
  }

  deleteTipoPlan(componente) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + componente.nombreComponente + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarComponenteSimple(componente);
      }
    });
  }

  eliminarComponenteSimple(componente) {
    this.lstComponente = this.lstComponente.filter(val => val.idComponente !== componente.idComponente);
    this.componente = new ComponenteDto();
    this.componenteSelect.emit(null);
    this.lstComponenteEmiter.emit(this.lstComponente);
    this.planEstudioService.setComponenteInput(this.lstComponente);

    this.appservice.msgDelete();
  }

  hideDialog() {
    this.submitted = false;
  }

  exportPdf() {
    this.appservice.exportPdf(this.exportColumns, this.lstComponente, 'Componentes', "p");
  }

  exportExcel() {
    this.appservice.exportExcel(this.lstComponente, 'Componentes');
  }



}
