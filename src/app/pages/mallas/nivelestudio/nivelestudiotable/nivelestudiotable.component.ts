import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppService } from "@services/app.service";
import { ConfirmationService, LazyLoadEvent } from "primeng/api";
import { FileService } from "@services/utils/file.service";
import { Table } from "primeng/table";
import { NivelEstudioDto } from '@/dto/NivelEstudioDto';
import { NivelesEstudioService } from '@services/planestudio/nivelesestudio.service';

@Component({
  selector: 'app-nivelestudiotable',
  templateUrl: './nivelestudiotable.component.html',
  styleUrls: ['./nivelestudiotable.component.scss']
})
export class NivelestudiotableComponent implements OnInit {
  @Input() lstNivelEstudio: NivelEstudioDto[];
  @Output() nivelEstudioSelect = new EventEmitter();
  proceso: string = 'nivel-estudio'

  nivelEstudio: NivelEstudioDto;
  selectedNivelEstudio: NivelEstudioDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(
    private NivelEstudioService: NivelesEstudioService,
    private appService: AppService,
    public fileService: FileService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.contruirTabla();
  }

  contruirTabla() {
    this.cols = [
      { field: 'idNivelEstudio', header: 'ID' },
      { field: 'codigoNivelEstudio', header: 'Código' },
      { field: 'nombreNivelEstudio', header: 'Nombre' },
      { field: 'idModalidadMallaDTO.nombreModalidadMalla', header: 'Modalidad Malla' },
      { field: 'descripcionNivelEstudio', header: 'Descripción' },
      { field: 'activoNivelEstudio', header: 'Activo' },
    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    this.loading = false;
  }

  clear(table: Table) {
    table.clear();
  }

  async loadData(event: LazyLoadEvent) {
    this.loading = true;
    await this.NivelEstudioService.getAllLazy({ lazyEvent: JSON.stringify(event) }).then(res => {
      this.lstNivelEstudio = res;
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
    for (let i = 0; i < this.selectedNivelEstudio.length; i++) {
      this.NivelEstudioService.deleteObject(this.selectedNivelEstudio[i].idNivelEstudio).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedNivelEstudio.length) {
            this.lstNivelEstudio = this.lstNivelEstudio.filter(val => !this.selectedNivelEstudio.includes(val));
            this.selectedNivelEstudio = null;
            this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.nivelEstudio = { ...item };
    this.nivelEstudioSelect.emit(item);
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombreNivelEstudio + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItem(item);
      }
    });
  }

  eliminarItem(item) {
    this.NivelEstudioService.deleteObject(item.idNivelEstudio).subscribe(
      data => {
        this.lstNivelEstudio = this.lstNivelEstudio.filter(val => val.idNivelEstudio !== item.idNivelEstudio);
        this.nivelEstudio = new NivelEstudioDto();
        this.appService.msgDelete();
      }
    );
  }

  exportPdf() {
    this.appService.exportPdf(this.exportColumns, this.lstNivelEstudio, 'Niveles de Estudio', "l");
  }

  exportExcel() {
    this.appService.exportExcel(this.lstNivelEstudio, 'Niveles de Estudio');
  }

   descargarArchivo(fileName: string) {
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appService.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }
}
