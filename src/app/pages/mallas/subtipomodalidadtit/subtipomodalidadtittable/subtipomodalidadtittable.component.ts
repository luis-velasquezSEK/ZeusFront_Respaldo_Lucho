import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppService} from "@services/app.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {FileService} from "@services/utils/file.service";
import {Table} from "primeng/table";
import { SubTipoModalidadTitDto } from '@/dto/SubTipoModalidadTitDto';
import { SubtipomodalidadtitService } from '@services/mallas/subtipomodalidadtit.service';

@Component({
  selector: 'app-subtipomodalidadtittable',
  templateUrl: './subtipomodalidadtittable.component.html',
  styleUrls: ['./subtipomodalidadtittable.component.scss']
})
export class SubtipomodalidadtittableComponent implements OnInit {

  @Input() lstSubTipoMt: SubTipoModalidadTitDto[];
  @Output() subTipoMtSelect = new EventEmitter();
  proceso: string = 'subtipo-modalidad-titulacion'

  subTipoMt: SubTipoModalidadTitDto;
  selectedSubTipoMt: SubTipoModalidadTitDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(
    private subTipoMtService: SubtipomodalidadtitService,
    private appService: AppService,
    public fileService: FileService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.contruirTabla();
  }

  contruirTabla() {
    this.cols = [
      {field: 'idSubTipoModalidadTitulacion', header: 'ID'},
      {field: 'codigoSubTipoModalidadTitulacion', header: 'Código'},
      {field: 'nombreSubTipoModalidadTitulacion', header: 'Nombre'},
      {field: 'observacionSubTipoModalidadTitulacion', header: 'Observacion'},
      {field: 'activoSubTipoModalidadTitulacion', header: 'Activo'},
      {field: 'idTipoModalidadTitulacionDTO.nombreTipoModalidadTitulacion', header: 'Tipo Modalidad'},
    ];
    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
    this.loading = false;
  }

  clear(table: Table) {
    table.clear();
  }

  async loadData(event: LazyLoadEvent) {
    this.loading = true;
      await this.subTipoMtService.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
        this.lstSubTipoMt = res;
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
    let indexLista:number = 0;
    for (let i = 0; i < this.selectedSubTipoMt.length; i++) {
      this.subTipoMtService.deleteObject(this.selectedSubTipoMt[i].idSubTipoModalidadTitulacion).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedSubTipoMt.length) {
            this.lstSubTipoMt = this.lstSubTipoMt.filter(val => !this.selectedSubTipoMt.includes(val));
            this.selectedSubTipoMt = null;
            this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.subTipoMt = {...item};
    this.subTipoMtSelect.emit(item);
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombreSubTipoModalidadTitulacion + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItem(item);
      }
    });
  }

  async eliminarItem(item) {
    await this.subTipoMtService.deleteObject(item.idSubTipoModalidadTitulacion).subscribe(
      data => {
        this.lstSubTipoMt = this.lstSubTipoMt.filter(val => val.idSubTipoModalidadTitulacion !== item.idSubTipoModalidadTitulacion);
        this.subTipoMt = new SubTipoModalidadTitDto();
        this.appService.msgDelete();
      }
    );
  }

  async exportPdf() {
    await this.appService.exportPdf(this.exportColumns, this.lstSubTipoMt, 'SubTipo Modalidad Titulacion', "l");
  }

  async exportExcel() {
    await this.appService.exportExcel(this.lstSubTipoMt, 'SubTipo Modalidad Titulacion');
  }

  async descargarArchivo(fileName: string) {
    try {
      await this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      await this.appService.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }
}
