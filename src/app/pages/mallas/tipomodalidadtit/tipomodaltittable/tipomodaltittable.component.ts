import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppService} from "@services/app.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {FileService} from "@services/utils/file.service";
import {Table} from "primeng/table";
import { TipoModalidadTitDto } from '@/dto/TipoModalidadTitDto';
import { TipomodalidadtitService } from '@services/mallas/tipomodalidadtit.service';

@Component({
  selector: 'app-tipomodaltittable',
  templateUrl: './tipomodaltittable.component.html',
  styleUrls: ['./tipomodaltittable.component.scss']
})
export class TipomodaltittableComponent implements OnInit {

  @Input() lstTipoMt: TipoModalidadTitDto[];
  @Output() tipoMtSelect = new EventEmitter();
  proceso: string = 'tipo-modalidad-titulacion'

  tipoMt: TipoModalidadTitDto;
  selectedTipoMt: TipoModalidadTitDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(
    private tipoMtService: TipomodalidadtitService,
    private appService: AppService,
    public fileService: FileService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.contruirTabla();
  }

  contruirTabla() {
    this.cols = [
      {field: 'idTipoModalidadTitulacion', header: 'ID'},
      {field: 'nombreTipoModalidadTitulacion', header: 'Nombre'},
      {field: 'activoTipoModalidadTitulacion', header: 'Activo'},
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
      this.tipoMtService.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
        this.lstTipoMt = res;
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
    for (let i = 0; i < this.selectedTipoMt.length; i++) {
      this.tipoMtService.deleteObject(this.selectedTipoMt[i].idTipoModalidadTitulacion).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedTipoMt.length) {
            this.lstTipoMt = this.lstTipoMt.filter(val => !this.selectedTipoMt.includes(val));
            this.selectedTipoMt = null;
            this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.tipoMt = {...item};
    this.tipoMtSelect.emit(item);
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombreTipoModalidadTitulacion + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItem(item);
      }
    });
  }

  eliminarItem(item) {
    this.tipoMtService.deleteObject(item.idTipoModalidadTitulacion).subscribe(
      data => {
        this.lstTipoMt = this.lstTipoMt.filter(val => val.idTipoModalidadTitulacion !== item.idTipoModalidadTitulacion);
        this.tipoMt = new TipoModalidadTitDto();
        this.appService.msgDelete();
      }
    );
  }

  exportPdf() {
    this.appService.exportPdf(this.exportColumns, this.lstTipoMt, 'Tipo Modalidad Titulacion', "l");
  }

  exportExcel() {
    this.appService.exportExcel(this.lstTipoMt, 'Tipo Modalidad Titulacion');
  }

  descargarArchivo(fileName: string) {
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appService.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }
}
