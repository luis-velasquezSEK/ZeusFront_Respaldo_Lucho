import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppService} from "@services/app.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {FileService} from "@services/utils/file.service";
import {Table} from "primeng/table";
import { ModalidadDto } from '@/dto/ModalidadDto';
import { ModalidadService } from '@services/mallas/modalidad.service';

@Component({
  selector: 'app-modalidadtable',
  templateUrl: './modalidadtable.component.html',
  styleUrls: ['./modalidadtable.component.scss']
})
export class ModalidadtableComponent implements OnInit {
  @Input() lstModalidad: ModalidadDto[];
  @Output() modalidadSelect = new EventEmitter();
  proceso: string = 'modalidad'

  modalidad: ModalidadDto;
  selectedModalidad: ModalidadDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(
    private modalidadService: ModalidadService,
    private appService: AppService,
    public fileService: FileService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.contruirTabla();
  }

  contruirTabla() {
    this.cols = [
      {field: 'idModalidad', header: 'ID'},
      {field: 'codigoModalidad', header: 'Código'},
      {field: 'nombreModalidad', header: 'Nombre'},
      {field: 'descripcionModalidad', header: 'Descripción'},
      {field: 'activoModalidad', header: 'Activo'},
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
      this.modalidadService.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
        this.lstModalidad = res;
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
    for (let i = 0; i < this.selectedModalidad.length; i++) {
      this.modalidadService.deleteObject(this.selectedModalidad[i].idModalidadPe).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedModalidad.length) {
            this.lstModalidad = this.lstModalidad.filter(val => !this.selectedModalidad.includes(val));
            this.selectedModalidad = null;
            this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.modalidad = {...item};
    this.modalidadSelect.emit(item);
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombreModalidad + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItem(item);
      }
    });
  }

  eliminarItem(item) {
    this.modalidadService.deleteObject(item.idModalidad).subscribe(
      data => {
        this.lstModalidad = this.lstModalidad.filter(val => val.idModalidadPe !== item.idModalidad);
        this.modalidad = new ModalidadDto();
        this.appService.msgDelete();
      }
    );
  }

  exportPdf() {
    this.appService.exportPdf(this.exportColumns, this.lstModalidad, 'Modalidad', "l");
  }

  exportExcel() {
    this.appService.exportExcel(this.lstModalidad, 'Modalidad');
  }

  descargarArchivo(fileName: string) {
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appService.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }
}
