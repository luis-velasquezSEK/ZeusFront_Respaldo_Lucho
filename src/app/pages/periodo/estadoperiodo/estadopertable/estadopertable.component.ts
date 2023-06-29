import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppService} from "@services/app.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {FileService} from "@services/utils/file.service";
import {Table} from "primeng/table";
import { EstadoPeriodoDto } from '@/dto/EstadoPeriodoDto';
import { EstadoperiodoService } from '@services/periodos/estadoperiodo.service';

@Component({
  selector: 'app-estadopertable',
  templateUrl: './estadopertable.component.html',
  styleUrls: ['./estadopertable.component.scss']
})
export class EstadopertableComponent implements OnInit {
  @Input() lstEstadoPer: EstadoPeriodoDto[];
  @Output() estadoPerSelect = new EventEmitter();
  proceso: string = 'estado-periodo'

  EstadoPeriodo: EstadoPeriodoDto;
  selectedEstadoPer: EstadoPeriodoDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(
    private estadoPerService: EstadoperiodoService,
    private appService: AppService,
    public fileService: FileService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.contruirTabla();
  }

  contruirTabla() {
    this.cols = [
      {field: 'idEstadoPeriodo', header: 'ID'},
      {field: 'nombreEstadoPeriodo', header: 'Nombre'},
      {field: 'activoEstadoPeriodo', header: 'Activo'},
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
      this.estadoPerService.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
        this.lstEstadoPer = res;
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
    for (let i = 0; i < this.selectedEstadoPer.length; i++) {
      this.estadoPerService.deleteObject(this.selectedEstadoPer[i].idEstadoPeriodo).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedEstadoPer.length) {
            this.lstEstadoPer = this.lstEstadoPer.filter(val => !this.selectedEstadoPer.includes(val));
            this.selectedEstadoPer = null;
            this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.EstadoPeriodo = {...item};
    this.estadoPerSelect.emit(item);
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombreEstadoPeriodo + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItem(item);
      }
    });
  }

  eliminarItem(item) {
    this.estadoPerService.deleteObject(item.idEstadoPeriodo).subscribe(
      data => {
        this.lstEstadoPer = this.lstEstadoPer.filter(val => val.idEstadoPeriodo !== item.idEstadoPeriodo);
        this.EstadoPeriodo = new EstadoPeriodoDto();
        this.appService.msgDelete();
      }
    );
  }

  exportPdf() {
    this.appService.exportPdf(this.exportColumns, this.lstEstadoPer, 'Estado Periodo', "l");
  }

  exportExcel() {
    this.appService.exportExcel(this.lstEstadoPer, 'Estado Periodo');
  }

  descargarArchivo(fileName: string) {
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appService.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }
}
