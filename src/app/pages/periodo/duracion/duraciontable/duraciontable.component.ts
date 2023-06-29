import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppService} from "@services/app.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {FileService} from "@services/utils/file.service";
import {Table} from "primeng/table";
import { DuracionPeriodoDto } from '@/dto/DuracionPeriodoDto';
import { DuracionperiodoService } from '@services/periodos/duracionperiodo.service';

@Component({
  selector: 'app-duraciontable',
  templateUrl: './duraciontable.component.html',
  styleUrls: ['./duraciontable.component.scss']
})
export class DuraciontableComponent implements OnInit {
  @Input() lstDuracion: DuracionPeriodoDto[];
  @Output() duracionSelect = new EventEmitter();
  proceso: string = 'duracion-periodo'

  duracion: DuracionPeriodoDto;
  selectedDuracion: DuracionPeriodoDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(
    private duracionService: DuracionperiodoService,
    private appService: AppService,
    public fileService: FileService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.contruirTabla();
  }

  contruirTabla() {
    this.cols = [
      {field: 'idDuracionPeriodo', header: 'ID'},
      {field: 'nombreDuracionPeriodo', header: 'Nombre'},
      {field: 'activoDuracionPeriodo', header: 'Activo'},
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
      this.duracionService.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
        this.lstDuracion = res;
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
    for (let i = 0; i < this.selectedDuracion.length; i++) {
      this.duracionService.deleteObject(this.selectedDuracion[i].idDuracionPeriodo).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedDuracion.length) {
            this.lstDuracion = this.lstDuracion.filter(val => !this.selectedDuracion.includes(val));
            this.selectedDuracion = null;
            this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.duracion = {...item};
    this.duracionSelect.emit(item);
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombreDuracionPeriodo + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItem(item);
      }
    });
  }

  eliminarItem(item) {
    this.duracionService.deleteObject(item.idDuracionPeriodo).subscribe(
      data => {
        this.lstDuracion = this.lstDuracion.filter(val => val.idDuracionPeriodo !== item.idDuracionPeriodo);
        this.duracion = new DuracionPeriodoDto();
        this.appService.msgDelete();
      }
    );
  }

  exportPdf() {
    this.appService.exportPdf(this.exportColumns, this.lstDuracion, 'Duracion Periodo', "l");
  }

  exportExcel() {
    this.appService.exportExcel(this.lstDuracion, 'Duracion Periodo');
  }

  descargarArchivo(fileName: string) {
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appService.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }
}
