import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ComponenteDto} from "@/dto/ComponenteDto";
import {ComponenteService} from "@services/componente/componente.service";
import {AppService} from "@services/app.service";
import {ConfirmationService} from "primeng/api";
import {Table} from "primeng/table";
import {SedeInstitucionDto} from "@/dto/SedeInstitucionDto";
import {SedeService} from "@services/institucioneducativa/sede.service";

@Component({
  selector: 'app-sedeinstituciontable',
  templateUrl: './sedeinstituciontable.component.html',
  styleUrls: ['./sedeinstituciontable.component.scss']
})
export class SedeinstituciontableComponent implements OnInit {

  @Input() lstSede: SedeInstitucionDto[];
  @Output() sedeSelect = new EventEmitter();

  sede: SedeInstitucionDto;
  selectedSede: SedeInstitucionDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(private sedeService: SedeService,
              private appService: AppService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.construirTabla();
  }

  construirTabla() {
    this.cols = [
      {field: 'idSedeInstitucion', header: '#'},
      {field: 'codigoSedeInstitucion', header: 'Código'},
      {field: 'nombreSedeInstitucion', header: 'Sede'},
      {field:'idInstitucionEducativaDTO.nombreInstitucionEducativa',header: 'Institución'},
      {field: 'activoSedeInstitucion', header: 'Activo'},
    ];
    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
    this.loading = false;
  }

  clear(table: Table) {
    table.clear();
  }

  deleteSelectedSede() {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de Eliminar los elementos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarSedeSelected();
      }
    });
  }

  eliminarSedeSelected() {
    let indexLista:number = 0;
    this.lstSede = this.lstSede.filter(val => !this.selectedSede.includes(val));
    this.selectedSede = null;
    this.sedeSelect.emit(null);
    this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
  }

  editSede(item) {
    this.sede = new SedeInstitucionDto();
    this.sede = {...item};
    this.sedeSelect.emit(item);
    // console.log('SEDE'+JSON.stringify(this.sede));
  }

  deleteSede(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombreSedeInstitucion + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarSedeSimple(item);
      }
    });
  }

  eliminarSedeSimple(item) {
    this.sedeService.deleteObject(item.idSedeInstitucion).subscribe(
      data => {
        this.lstSede = this.lstSede.filter(val => val.idSedeInstitucion !== item.idSedeInstitucion);
        this.sede = new SedeInstitucionDto();
        this.appService.msgDelete();
      }
    );
  }

  hideDialog() {
    this.submitted = false;
  }

  exportPdf() {
    this.appService.exportPdf(this.exportColumns, this.lstSede, 'Sede', "p");
  }

  exportExcel() {
    this.appService.exportExcel(this.lstSede, 'Sede');
  }



}

