import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppService } from "@services/app.service";
import { ConfirmationService, LazyLoadEvent } from "primeng/api";
import { FileService } from "@services/utils/file.service";
import { Table } from "primeng/table";
import { TipoRequisitoEgreDto } from '@/dto/TipoRequisitoEgreDto';
import { TiporequisitoegreService } from '@services/mallas/tiporequisitoegre.service';

@Component({
  selector: 'app-tiporeqegresamientotable',
  templateUrl: './tiporeqegresamientotable.component.html',
  styleUrls: ['./tiporeqegresamientotable.component.scss']
})
export class TiporeqegresamientotableComponent implements OnInit {

  @Input() lstTipoReqEgre: TipoRequisitoEgreDto[];
  @Output() tipoReqEgreSelect = new EventEmitter();
  proceso: string = 'tipo-requisito-egresamiento'

  tipoReqEgre: TipoRequisitoEgreDto;
  selectedTipoReqEgre: TipoRequisitoEgreDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(
    private tipoReqEgreService: TiporequisitoegreService,
    private appService: AppService,
    public fileService: FileService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.contruirTabla();
  }

  contruirTabla() {
    this.cols = [
      { field: 'idTipoReqEgresamiento', header: 'ID' },
      { field: 'nombreTipoReqEgresamiento', header: 'Nombre' },
      { field: 'activoTipoReqEgresamiento', header: 'Activo' },
    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    this.loading = false;
  }

  clear(table: Table) {
    table.clear();
  }

  async loadData(event: LazyLoadEvent) {
    this.loading = true;
    await this.tipoReqEgreService.getAllLazy({ lazyEvent: JSON.stringify(event) }).then(res => {
      this.lstTipoReqEgre = res;
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
    let indexLista: number = 0;
    for (let i = 0; i < this.selectedTipoReqEgre.length; i++) {
      this.tipoReqEgreService.deleteObject(this.selectedTipoReqEgre[i].idTipoReqEgresamiento).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedTipoReqEgre.length) {
            this.lstTipoReqEgre = this.lstTipoReqEgre.filter(val => !this.selectedTipoReqEgre.includes(val));
            this.selectedTipoReqEgre = null;
            this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.tipoReqEgre = { ...item };
    this.tipoReqEgreSelect.emit(item);
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombreTipoReqEgresamiento + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItem(item);
      }
    });
  }

  async eliminarItem(item) {
    await this.tipoReqEgreService.deleteObject(item.idTipoReqEgresamiento).subscribe(
      data => {
        this.lstTipoReqEgre = this.lstTipoReqEgre.filter(val => val.idTipoReqEgresamiento !== item.idTipoReqEgresamiento);
        this.tipoReqEgre = new TipoRequisitoEgreDto();
        this.appService.msgDelete();
      }
    );
  }

  async exportPdf() {
    await this.appService.exportPdf(this.exportColumns, this.lstTipoReqEgre, 'Tipo Requisito Titulacion', "l");
  }

  async exportExcel() {
    await this.appService.exportExcel(this.lstTipoReqEgre, 'Tipo Requisito Titulacion');
  }

  async descargarArchivo(fileName: string) {
    try {
      await this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appService.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }
}
