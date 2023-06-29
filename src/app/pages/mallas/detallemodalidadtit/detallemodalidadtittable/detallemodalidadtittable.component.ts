import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppService} from "@services/app.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {FileService} from "@services/utils/file.service";
import {Table} from "primeng/table";
import { DetalleModalidadTitulacionDto } from '@/dto/DetalleModalidadTitDTO';
import { DetallemodalidadtitService } from '@services/mallas/detallemodalidadtit.service';

@Component({
  selector: 'app-detallemodalidadtittable',
  templateUrl: './detallemodalidadtittable.component.html',
  styleUrls: ['./detallemodalidadtittable.component.scss']
})
export class DetallemodalidadtittableComponent implements OnInit {

  @Input() lstDetalleMt: DetalleModalidadTitulacionDto[];
  @Output() detalleMtSelect = new EventEmitter();
  proceso: string = 'detalle-modalidad-titulacion'

  detalleMt: DetalleModalidadTitulacionDto;
  selectedDetalleMt: DetalleModalidadTitulacionDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(
    private detalleMtService: DetallemodalidadtitService,
    private appService: AppService,
    public fileService: FileService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.contruirTabla();
  }

  contruirTabla() {
    this.cols = [
      {field: 'idDetalleMt', header: 'ID'},
      {field: 'codigoDetalleMt', header: 'Código'},
      {field: 'nombreDetalleMt', header: 'Nombre'},
      {field: 'observacionesDetalleMt', header: 'Observaciones'},
      {field: 'subTipoModalidadTitulacionDto.nombreSubTipoModalidadTitulacion', header: 'Sub Tipo'},
      {field: 'activoDetalleMt', header: 'Activo'}
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
      this.detalleMtService.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
        this.lstDetalleMt = res;
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
    for (let i = 0; i < this.selectedDetalleMt.length; i++) {
      this.detalleMtService.deleteObject(this.selectedDetalleMt[i].idDetalleMt).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedDetalleMt.length) {
            this.lstDetalleMt = this.lstDetalleMt.filter(val => !this.selectedDetalleMt.includes(val));
            this.selectedDetalleMt = null;
            this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.detalleMt = {...item};
    this.detalleMtSelect.emit(item);
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombreDetalleMt + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItem(item);
      }
    });
  }

  eliminarItem(item) {
    this.detalleMtService.deleteObject(item.idDetalleMt).subscribe(
      data => {
        this.lstDetalleMt = this.lstDetalleMt.filter(val => val.idDetalleMt !== item.idDetalleMt);
        this.detalleMt = new DetalleModalidadTitulacionDto();
        this.appService.msgDelete();
      }
    );
  }

  exportPdf() {
    this.appService.exportPdf(this.exportColumns, this.lstDetalleMt, 'Detalle Modalidad Titulacion', "l");
  }

  exportExcel() {
    this.appService.exportExcel(this.lstDetalleMt, 'Detalle Modalidad Titulacion');
  }

  descargarArchivo(fileName: string) {
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appService.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }

}
