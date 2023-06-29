import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {InstitucionEducativaDto} from "@/dto/InstitucionEducativaDto";
import {InstitucionEducativaService} from "@services/institucioneducativa/institucioneducativa.service";
import {AppService} from "@services/app.service";
import {FileService} from "@services/utils/file.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {Table} from "primeng/table";
import {EstadoModmallaDto} from "@/dto/EstadoModmallaDto";
import {EstadoModalidadMallaService} from "@services/mallas/estadomodalidadmalla.service";

@Component({
  selector: 'app-estadomodalidadmallatable',
  templateUrl: './estadomodalidadmallatable.component.html',
  styleUrls: ['./estadomodalidadmallatable.component.scss']
})
export class EstadomodalidadmallatableComponent implements OnInit {

  @Input() lstEstadoModalidadMalla: EstadoModmallaDto[];
  @Output() estadoModMallaSelect = new EventEmitter();
  proceso: string = 'malla';

  estadoModMalla: EstadoModmallaDto;
  selectedEstadoModMalla: EstadoModmallaDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(private estadoModalidadMallaService: EstadoModalidadMallaService,
              private appservice: AppService,
              public fileService: FileService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.construirTabla();
  }

  construirTabla() {
    this.cols = [
      {field: 'idEstadoModmalla', header: 'Código'},
      {field: 'nombreEstadoModmalla', header: 'Nombre'},
      {field: 'descripcionEstadoModmalla', header: 'No. Autorización'},
      {field: 'activoEstadoModmalla', header: 'Activo'}
    ];
    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
    this.loading = false;
  }

  clear(table: Table) {
    table.clear();
  }

  async loadData(event: LazyLoadEvent) {
    this.loading = true;
    await this.estadoModalidadMallaService.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
      this.lstEstadoModalidadMalla = res;
      this.loading = false;
    });
  }

  deleteSelectedEstadoModMalla() {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de Eliminar los elementos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarEstadoModMallaSelected();
      }
    });
  }

  eliminarEstadoModMallaSelected() {
    let indexLista:number = 0;
    for (let i = 0; i < this.selectedEstadoModMalla.length; i++) {
      this.estadoModalidadMallaService.deleteObject(this.selectedEstadoModMalla[i].idEstadoModmalla).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedEstadoModMalla.length) {
            this.lstEstadoModalidadMalla = this.lstEstadoModalidadMalla.filter(val => !this.selectedEstadoModMalla.includes(val));
            this.selectedEstadoModMalla = null;
            this.appservice.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editEstadoModMalla(item: EstadoModmallaDto) {
    this.estadoModMalla = {...item};
    this.estadoModMallaSelect.emit(item);
  }

  deleteEstadoModMalla(item: EstadoModmallaDto) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombreEstadoModmalla + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarEstadoModMalla(item);
      }
    });
  }

  async eliminarEstadoModMalla(item: EstadoModmallaDto) {
    await this.estadoModalidadMallaService.deleteObject(item.idEstadoModmalla).subscribe(
      data => {
        this.lstEstadoModalidadMalla = this.lstEstadoModalidadMalla.filter(val => val.idEstadoModmalla !== item.idEstadoModmalla);
        this.estadoModMalla = new EstadoModmallaDto();
        this.appservice.msgDelete();
      }
    );
  }

  hideDialog() {
    this.submitted = false;
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.lstEstadoModalidadMalla.length; i++) {
      if (this.lstEstadoModalidadMalla[i].idEstadoModmalla === id) {
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

  async exportPdf() {
    await this.appservice.exportPdf(this.exportColumns, this.lstEstadoModalidadMalla, 'EstadoModalidadMalla', "p");
  }

  async exportExcel() {
    await this.appservice.exportExcel(this.lstEstadoModalidadMalla, 'EstadoModalidadMalla');
  }

  async descargarArchivo(fileName: string) {
    //bloque try and catch para capturar el error de la descarga
    try {
      await this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appservice.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }
}
