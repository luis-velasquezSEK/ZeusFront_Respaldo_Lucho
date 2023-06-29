import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppService} from "@services/app.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {FileService} from "@services/utils/file.service";
import {Table} from "primeng/table";
import { ModalidadPeriodoDto } from '@/dto/ModalidadPeriodoDto';
import { ModalidadperiodoService } from '@services/periodos/modalidadperiodo.service';

@Component({
  selector: 'app-modalidadpertable',
  templateUrl: './modalidadpertable.component.html',
  styleUrls: ['./modalidadpertable.component.scss']
})
export class ModalidadpertableComponent implements OnInit {
  @Input() lstModalidadPer: ModalidadPeriodoDto[];
  @Output() modalidadPerSelect = new EventEmitter();
  proceso: string = 'modalidad-periodo'

  modalidadPer: ModalidadPeriodoDto;
  selectedModalidadPer: ModalidadPeriodoDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(
    private modalidadPerService: ModalidadperiodoService,
    private appService: AppService,
    public fileService: FileService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.contruirTabla();
  }

  contruirTabla() {
    this.cols = [
      {field: 'idModalidad2', header: 'ID'},
      {field: 'nombreModalidadp', header: 'Nombre'},
      {field: 'descripcionModalidadp', header: 'Descripcion'},
      {field: 'activoModalidadp', header: 'Activo'},
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
      this.modalidadPerService.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
        this.lstModalidadPer = res;
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
    for (let i = 0; i < this.selectedModalidadPer.length; i++) {
      this.modalidadPerService.deleteObject(this.selectedModalidadPer[i].idModalidad2).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedModalidadPer.length) {
            this.lstModalidadPer = this.lstModalidadPer.filter(val => !this.selectedModalidadPer.includes(val));
            this.selectedModalidadPer = null;
            this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.modalidadPer = {...item};
    this.modalidadPerSelect.emit(item);
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombreModalidadp + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItem(item);
      }
    });
  }

  eliminarItem(item) {
    this.modalidadPerService.deleteObject(item.idModalidad2).subscribe(
      data => {
        this.lstModalidadPer = this.lstModalidadPer.filter(val => val.idModalidad2 !== item.idModalidad2);
        this.modalidadPer = new ModalidadPeriodoDto();
        this.appService.msgDelete();
      }
    );
  }

  exportPdf() {
    this.appService.exportPdf(this.exportColumns, this.lstModalidadPer, 'Modalidad Periodo', "l");
  }

  exportExcel() {
    this.appService.exportExcel(this.lstModalidadPer, 'Modalidad Periodo');
  }

  descargarArchivo(fileName: string) {
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appService.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }
}
