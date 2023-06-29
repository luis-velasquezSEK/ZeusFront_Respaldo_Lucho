import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppService} from "@services/app.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {FileService} from "@services/utils/file.service";
import {Table} from "primeng/table";
import { EstadoMallaDto } from '@/dto/EstadoMallaDto';
import { EstadomallaService } from '@services/mallas/estadomalla.service';

@Component({
  selector: 'app-estadomallatable',
  templateUrl: './estadomallatable.component.html',
  styleUrls: ['./estadomallatable.component.scss']
})
export class EstadomallatableComponent implements OnInit {
  @Input() lstEstadoMalla: EstadoMallaDto[];
  @Output() estadoMallaSelect = new EventEmitter();
  proceso: string = 'estado-malla'

  estadoMalla: EstadoMallaDto;
  selectedEstadoMalla: EstadoMallaDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(
    private EstadoMallaService: EstadomallaService,
    private appService: AppService,
    public fileService: FileService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.contruirTabla();
  }

  contruirTabla() {
    this.cols = [
      {field: 'idEstadoMalla', header: 'ID'},
      {field: 'nombreEstadoMalla', header: 'Nombre'},
      {field: 'activoEstadoMalla', header: 'Activo'},
    ];
    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
    this.loading = false;
  }

  clear(table: Table) {
    table.clear();
  }

  loadData(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      this.EstadoMallaService.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
        this.lstEstadoMalla = res;
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
    let indexLista:number = 0;
    for (let i = 0; i < this.selectedEstadoMalla.length; i++) {
      this.EstadoMallaService.deleteObject(this.selectedEstadoMalla[i].idEstadoMalla).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedEstadoMalla.length) {
            this.lstEstadoMalla = this.lstEstadoMalla.filter(val => !this.selectedEstadoMalla.includes(val));
            this.selectedEstadoMalla = null;
            this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.estadoMalla = {...item};
    this.estadoMallaSelect.emit(item);
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombreEstadoMalla + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItem(item);
      }
    });
  }

  eliminarItem(item) {
    this.EstadoMallaService.deleteObject(item.idEstadoMalla).subscribe(
      data => {
        this.lstEstadoMalla = this.lstEstadoMalla.filter(val => val.idEstadoMalla !== item.idEstadoMalla);
        this.estadoMalla = new EstadoMallaDto();
        this.appService.msgDelete();
      }
    );
  }

  exportPdf() {
    this.appService.exportPdf(this.exportColumns, this.lstEstadoMalla, 'Estado Malla', "l");
  }

  exportExcel() {
    this.appService.exportExcel(this.lstEstadoMalla, 'Estado Malla');
  }

  descargarArchivo(fileName: string) {
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appService.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }
}
