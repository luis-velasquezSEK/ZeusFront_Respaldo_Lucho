import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppService} from "@services/app.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {FileService} from "@services/utils/file.service";
import {Table} from "primeng/table";
import { TipoPeriodoDto } from '@/dto/TipoPeriodoDto';
import { TipoperiodoService } from '@services/periodos/tipoperiodo.service';

@Component({
  selector: 'app-tipoperiodotable',
  templateUrl: './tipoperiodotable.component.html',
  styleUrls: ['./tipoperiodotable.component.scss']
})
export class TipoperiodotableComponent implements OnInit {
  @Input() lstTipoPer: TipoPeriodoDto[];
  @Output() tipoPerSelect = new EventEmitter();
  proceso: string = 'tipo-periodo'

  TipoPeriodo: TipoPeriodoDto;
  selectedTipoPer: TipoPeriodoDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(
    private tipoPerService: TipoperiodoService,
    private appService: AppService,
    public fileService: FileService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.contruirTabla();
  }

  contruirTabla() {
    this.cols = [
      {field: 'idTipoPeriodo', header: 'ID'},
      {field: 'nombreTipoPeriodo', header: 'Nombre'},
      {field: 'activoTipoPeriodo', header: 'Activo'},
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
      this.tipoPerService.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
        this.lstTipoPer = res;
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
    for (let i = 0; i < this.selectedTipoPer.length; i++) {
      this.tipoPerService.deleteObject(this.selectedTipoPer[i].idTipoPeriodo).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedTipoPer.length) {
            this.lstTipoPer = this.lstTipoPer.filter(val => !this.selectedTipoPer.includes(val));
            this.selectedTipoPer = null;
            this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.TipoPeriodo = {...item};
    this.tipoPerSelect.emit(item);
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombreTipoPeriodo + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItem(item);
      }
    });
  }

  eliminarItem(item) {
    this.tipoPerService.deleteObject(item.idTipoPeriodo).subscribe(
      data => {
        this.lstTipoPer = this.lstTipoPer.filter(val => val.idTipoPeriodo !== item.idTipoPeriodo);
        this.TipoPeriodo = new TipoPeriodoDto();
        this.appService.msgDelete();
      }
    );
  }

  exportPdf() {
    this.appService.exportPdf(this.exportColumns, this.lstTipoPer, 'Tipo Periodo', "l");
  }

  exportExcel() {
    this.appService.exportExcel(this.lstTipoPer, 'Tipo Periodo');
  }

  descargarArchivo(fileName: string) {
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appService.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }
}
