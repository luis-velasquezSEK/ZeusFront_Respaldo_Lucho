import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppService } from "@services/app.service";
import { ConfirmationService, LazyLoadEvent } from "primeng/api";
import { FileService } from "@services/utils/file.service";
import { Table } from "primeng/table";
import { ModalidadMallaDto } from '@/dto/ModalidadMallaDto';
import { ModalidadMallaService } from '@services/mallas/modalidadmalla.service';

@Component({
  selector: 'app-modalidadmallatable',
  templateUrl: './modalidadmallatable.component.html',
  styleUrls: ['./modalidadmallatable.component.scss']
})
export class ModalidadmallatableComponent implements OnInit {
  @Input() lstModMalla: ModalidadMallaDto[];
  @Output() modMallaSelect = new EventEmitter();
  proceso: string = 'modalidad-malla'

  modMalla: ModalidadMallaDto;
  selectedModMalla: ModalidadMallaDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];
  
  constructor(
    private ModMallaService: ModalidadMallaService,
    private appService: AppService,
    public fileService: FileService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.contruirTabla();
  }

  contruirTabla() {
    this.cols = [
      { field: 'idModalidadMalla', header: 'ID' },
      { field: 'nombreModalidadMalla', header: 'Nombre' },
      { field: 'descripcionModalidadMalla', header: 'Descripción' },
      { field: 'activoModalidadMalla', header: 'Activo' },
      { field: 'idEstadoModmallaDTO.nombreEstadoModmalla', header: 'Estado Modalidad Malla' },
      { field: 'idMallaDTO.codigoPlanEstudioMalla', header: 'Malla' },
      { field: 'idModalidadDTO.nombreModalidad', header: 'Modalidad' },
      { field: 'idPeriodoDTO.codigoTextoPeriodo', header: 'Periodo' },
    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    this.loading = false;
  }

  clear(table: Table) {
    table.clear();
  }

  async loadData(event: LazyLoadEvent) {
    this.loading = true;
    await this.ModMallaService.getAllLazy({ lazyEvent: JSON.stringify(event) }).then(res => {
      this.lstModMalla = res;
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
    for (let i = 0; i < this.selectedModMalla.length; i++) {
      this.ModMallaService.deleteObject(this.selectedModMalla[i].idModalidadMalla).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedModMalla.length) {
            this.lstModMalla = this.lstModMalla.filter(val => !this.selectedModMalla.includes(val));
            this.selectedModMalla = null;
            this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.modMalla = { ...item };
    this.modMallaSelect.emit(item);
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombreModalidadMalla + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItem(item);
      }
    });
  }

  eliminarItem(item) {
    this.ModMallaService.deleteObject(item.idModalidadMalla).subscribe(
      data => {
        this.lstModMalla = this.lstModMalla.filter(val => val.idModalidadMalla !== item.idModalidadMalla);
        this.modMalla = new ModalidadMallaDto();
        this.appService.msgDelete();
      }
    );
  }

  exportPdf() {
    this.appService.exportPdf(this.exportColumns, this.lstModMalla, 'Modalidad Malla', "l");
  }

  exportExcel() {
    this.appService.exportExcel(this.lstModMalla, 'Modalidad Malla');
  }

  descargarArchivo(fileName: string) {
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appService.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }

}
