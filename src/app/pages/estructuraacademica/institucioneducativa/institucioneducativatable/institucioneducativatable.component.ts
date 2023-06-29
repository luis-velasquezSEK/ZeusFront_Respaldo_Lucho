import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EstadoPlanEstudioDTO} from "@/dto/estado-plan-dto";
import {EstadoPlanService} from "@services/planestudio/estadoplan.service";
import {AppService} from "@services/app.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {Table} from "primeng/table";
import {formatDate} from "@angular/common";
import jsPDF from "jspdf";
import {InstitucionEducativaDto} from "@/dto/InstitucionEducativaDto";
import {InstitucionEducativaService} from "@services/institucioneducativa/institucioneducativa.service";
import {FileService} from "@services/utils/file.service";

@Component({
  selector: 'app-institucioneducativatable',
  templateUrl: './institucioneducativatable.component.html',
  styleUrls: ['./institucioneducativatable.component.scss']
})
export class InstitucioneducativatableComponent implements OnInit {

  @Input() lstInstitucionEducativa: InstitucionEducativaDto[];
  @Output() institucionEducativaSelect = new EventEmitter();
  proceso: string = 'academia';

  institucionEducativa: InstitucionEducativaDto;
  selectedInstitucionEducativa: InstitucionEducativaDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(private institucionEducativaService: InstitucionEducativaService,
              private appservice: AppService,
              public fileService: FileService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.construirTabla();
  }

  construirTabla() {
    this.cols = [
      {field: 'codigoInstitucionEducativa', header: 'Código'},
      {field: 'nombreInstitucionEducativa', header: 'Nombre'},
      {field: 'codautorizacionInstitucionEducativa', header: 'No. Autorización'},
      {field: 'idCategoriaDTO.nombreCategoria', header: 'Categoria'},
      {field: 'idTipoInstitucionEducativaDTO.nombreTipoInstitucionEducativa', header: 'Tipo'},
      {field: 'activoInstitucionEducativa', header: 'Activo'}
    ];
    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
    this.loading = false;
  }

  clear(table: Table) {
    table.clear();
  }

  async loadData(event: LazyLoadEvent) {
    this.loading = true;
      await this.institucionEducativaService.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
        this.lstInstitucionEducativa = res;
        this.loading = false;
      });
  }

  openNew() {
    this.institucionEducativa = new InstitucionEducativaDto();
    this.submitted = false;
  }

  deleteSelectedInstitucionEducativa() {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de Eliminar los elementos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarInstitucionEducativaSelected();
      }
    });
  }

  eliminarInstitucionEducativaSelected() {
    let indexLista:number = 0;
    for (let i = 0; i < this.selectedInstitucionEducativa.length; i++) {
      this.institucionEducativaService.deleteObject(this.selectedInstitucionEducativa[i].idInstitucionEducativa).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedInstitucionEducativa.length) {
            this.lstInstitucionEducativa = this.lstInstitucionEducativa.filter(val => !this.selectedInstitucionEducativa.includes(val));
            this.selectedInstitucionEducativa = null;
            this.appservice.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editInstitucionEducativa(item: InstitucionEducativaDto) {
    this.institucionEducativa = {...item};
    this.institucionEducativaSelect.emit(item);
  }

  deleteInstitucionEducativa(item: InstitucionEducativaDto) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombreInstitucionEducativa + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarInstitucionEducativaSimple(item);
      }
    });
  }

  eliminarInstitucionEducativaSimple(item:InstitucionEducativaDto) {
    this.institucionEducativaService.deleteObject(item.idInstitucionEducativa).subscribe(
      data => {
        this.lstInstitucionEducativa = this.lstInstitucionEducativa.filter(val => val.idInstitucionEducativa !== item.idInstitucionEducativa);
        this.institucionEducativa = new InstitucionEducativaDto();
        this.appservice.msgDelete();
      }
    );
  }

  hideDialog() {
    this.submitted = false;
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.lstInstitucionEducativa.length; i++) {
      if (this.lstInstitucionEducativa[i].idInstitucionEducativa === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  createId(): number {
    let id = 0;
    for (var i = 0; i < 5; i++) {
      id += (Math.floor(Math.random()));
    }
    return id;
  }

  exportPdf() {
    this.appservice.exportPdf(this.exportColumns, this.lstInstitucionEducativa, 'InstitucionEducativa', "p");
  }

  exportExcel() {
    this.appservice.exportExcel(this.lstInstitucionEducativa, 'InstitucionEducativa');
  }

  descargarArchivo(fileName: string) {
    //bloque try and catch para capturar el error de la descarga
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appservice.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }

}
