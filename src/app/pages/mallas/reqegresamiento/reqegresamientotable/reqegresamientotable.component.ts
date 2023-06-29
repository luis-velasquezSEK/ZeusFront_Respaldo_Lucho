import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppService} from "@services/app.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {FileService} from "@services/utils/file.service";
import {Table} from "primeng/table";
import { RequisitoEgresamientoDto } from '@/dto/RequisitoEgresamientoDto';
import { RequisitoegreService } from '@services/mallas/requisitoegre.service';

@Component({
  selector: 'app-reqegresamientotable',
  templateUrl: './reqegresamientotable.component.html',
  styleUrls: ['./reqegresamientotable.component.scss']
})
export class ReqegresamientotableComponent implements OnInit {
  @Input() lstReqEgresamiento: RequisitoEgresamientoDto[];
  @Output() reqEgresamientoSelect = new EventEmitter();
  proceso: string = 'requisitos-egresamientos'

  reqEgresamiento: RequisitoEgresamientoDto;
  selectedReqEgresamiento: RequisitoEgresamientoDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(
    private reqEgresamientoService: RequisitoegreService,
    private appService: AppService,
    public fileService: FileService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.contruirTabla();
  }

  contruirTabla() {
    this.cols = [
      {field: 'idReqEgresamiento', header: 'ID'},
      {field: 'codigoReqEgresamiento', header: 'Código'},
      {field: 'nombreReqEgresamiento', header: 'Nombre'},
      {field: 'descripcionReqEgresamiento', header: 'Descripción'},
      {field: 'observacionReqEgresamiento', header: 'Observación'},
      {field: 'activoReqEgresamiento', header: 'Activo'},
      {field: 'idTipoReqEgresamientoDTO.nombreTipoReqEgresamiento', header: 'Tipo Requisito Egresamiento'},
    ];
    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
    this.loading = false;
  }

  clear(table: Table) {
    table.clear();
  }

  async loadData(event: LazyLoadEvent) {
    this.loading = true;
      await this.reqEgresamientoService.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
        this.lstReqEgresamiento = res;
        this.loading = false;
      })
  }

  deleteSelectedItems() {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de Eliminar los elementos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItemSelected();
      }
    });
  }

  eliminarItemSelected() {
    let indexLista:number = 0;
    for (let i = 0; i < this.selectedReqEgresamiento.length; i++) {
      this.reqEgresamientoService.deleteObject(this.selectedReqEgresamiento[i].idReqEgresamiento).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedReqEgresamiento.length) {
            this.lstReqEgresamiento = this.lstReqEgresamiento.filter(val => !this.selectedReqEgresamiento.includes(val));
            this.selectedReqEgresamiento = null;
            this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.reqEgresamiento = {...item};
    this.reqEgresamientoSelect.emit(item);
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombreReqEgresamiento + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItem(item);
      }
    });
  }

  async eliminarItem(item) {
    await this.reqEgresamientoService.deleteObject(item.idReqEgresamiento).subscribe(
      data => {
        this.lstReqEgresamiento = this.lstReqEgresamiento.filter(val => val.idReqEgresamiento !== item.idReqEgresamiento);
        this.reqEgresamiento = new RequisitoEgresamientoDto();
        this.appService.msgDelete();
      }
    );
  }

  async exportPdf() {
    await this.appService.exportPdf(this.exportColumns, this.lstReqEgresamiento, 'Requisito Egresamiento', "l");
  }

  async exportExcel() {
    await this.appService.exportExcel(this.lstReqEgresamiento, 'Requisito Egresamiento');
  }

  async descargarArchivo(fileName: string) {
    try {
      await this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      await this.appService.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }
}
