import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppService } from "@services/app.service";
import { ConfirmationService, LazyLoadEvent } from "primeng/api";
import { FileService } from "@services/utils/file.service";
import { Table } from "primeng/table";
import { ModalidadTitulacionDto } from '@/dto/ModalidadTitulacionDto';
import { ModalidadtitulacionService } from '@services/mallas/modalidadtitulacion.service';

@Component({
  selector: 'app-modalidadtittable',
  templateUrl: './modalidadtittable.component.html',
  styleUrls: ['./modalidadtittable.component.scss']
})
export class ModalidadtittableComponent implements OnInit {

  @Input() lstModalidadTit: ModalidadTitulacionDto[];
  @Output() modalidadTitSelect = new EventEmitter();
  proceso: string = 'modalidad-Titulacion'

  modalidadTit: ModalidadTitulacionDto;
  selectedModalidadTit: ModalidadTitulacionDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(
    private modalidadTitService: ModalidadtitulacionService,
    private appService: AppService,
    public fileService: FileService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.contruirTabla();
  }

  contruirTabla() {
    this.cols = [
      { field: 'idModalidadTitulacion', header: 'ID' },
      { field: 'codigoModalidadTitulacion', header: 'Código' },
      { field: 'nombreModalidadTitulacion', header: 'Nombre' },
      { field: 'observacionModalidadTitulacion', header: 'Observaciones' },
      { field: 'detalleModalidadTitulacionListDTO.nombreDetalleMt', header: 'Detalle Modalidad' },
      { field: 'activoModalidadTitulacion', header: 'Activo' }
    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    this.loading = false;
  }

  clear(table: Table) {
    table.clear();
  }

  loadData(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      this.modalidadTitService.getAllLazy({ lazyEvent: JSON.stringify(event) }).then(res => {
        this.lstModalidadTit = res;
        this.loading = false;
      })
    }, 1000);
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
    for (let i = 0; i < this.selectedModalidadTit.length; i++) {
      this.modalidadTitService.deleteObject(this.selectedModalidadTit[i].idModalidadTitulacion).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedModalidadTit.length) {
            this.lstModalidadTit = this.lstModalidadTit.filter(val => !this.selectedModalidadTit.includes(val));
            this.selectedModalidadTit = null;
            this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.modalidadTit = { ...item };
    this.modalidadTitSelect.emit(item);
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombreModalidadTitulacion + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItem(item);
      }
    });
  }

  eliminarItem(item) {
    this.modalidadTitService.deleteObject(item.idModalidadTitulacion).subscribe(
      data => {
        this.lstModalidadTit = this.lstModalidadTit.filter(val => val.idModalidadTitulacion !== item.idModalidadTitulacion);
        this.modalidadTit = new ModalidadTitulacionDto();
        this.appService.msgDelete();
      }
    );
  }

  exportPdf() {
    this.appService.exportPdf(this.exportColumns, this.lstModalidadTit, 'Modalidad Titulacion', "l");
  }

  exportExcel() {
    this.appService.exportExcel(this.lstModalidadTit, 'Modalidad Titulacion');
  }

  descargarArchivo(fileName: string) {
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appService.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }

}
