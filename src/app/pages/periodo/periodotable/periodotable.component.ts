import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppService} from "@services/app.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {FileService} from "@services/utils/file.service";
import {Table} from "primeng/table";
import { PeriodoDto } from '@/dto/PeriodoDto';
import { PeriodoService } from '@services/periodos/periodo.service';

@Component({
  selector: 'app-periodotable',
  templateUrl: './periodotable.component.html',
  styleUrls: ['./periodotable.component.scss']
})
export class PeriodotableComponent implements OnInit {
  @Input() lstPeriodo: PeriodoDto[];
  @Output() periodoSelect = new EventEmitter();
  proceso: string = 'periodo'

  periodo: PeriodoDto;
  selectedPeriodo: PeriodoDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(
    private PeriodoService: PeriodoService,
    private appService: AppService,
    public fileService: FileService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.contruirTabla();
  }

  contruirTabla() {
    this.cols = [
      { field: 'idPeriodo', header: 'ID' },
      { field: 'codigoPeriodo', header: 'Codigo Periodo' },
      { field: 'codigoNumeroPeriodo', header: 'Codigo Numero' },
      { field: 'codigoTextoPeriodo', header: 'Codigo Texto' },
      { field: 'descripcionPeriodo', header: 'Descripcion' },
      { field: 'fechaInicioPeriodo', header: 'Fecha Inicio' },
      { field: 'fechaFinPeriodo', header: 'Fecha Fin' },
      { field: 'fechaRegistroPeriodo', header: 'Fecha Registro' },
      { field: 'fechaActualizaPeriodo', header: 'Fecha Actualizacion' },
      { field: 'activoPeriodo', header: 'Activo' },
      { field: 'idDuracionPeriodoDTO.nombreDuracionPeriodo', header: 'Duracion Periodo' },
      { field: 'idEstadoPeriodoDTO.nombreEstadoPeriodo', header: 'Estado Periodo' },
      { field: 'idModalidad2DTO.nombreModalidadp', header: 'Modalidad Periodo' },
      { field: 'idTipoPeriodoDTO.nombreTipoPeriodo', header: 'Tipo Periodo' },
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
      this.PeriodoService.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
        this.lstPeriodo = res;
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
    for (let i = 0; i < this.selectedPeriodo.length; i++) {
      this.PeriodoService.deleteObject(this.selectedPeriodo[i].idPeriodo).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedPeriodo.length) {
            this.lstPeriodo = this.lstPeriodo.filter(val => !this.selectedPeriodo.includes(val));
            this.selectedPeriodo = null;
            this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.periodo = {...item};
    this.periodoSelect.emit(item);
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.codigoPeriodo + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItem(item);
      }
    });
  }

  eliminarItem(item) {
    this.PeriodoService.deleteObject(item.idPeriodo).subscribe(
      data => {
        this.lstPeriodo = this.lstPeriodo.filter(val => val.idPeriodo !== item.idPeriodo);
        this.periodo = new PeriodoDto();
        this.appService.msgDelete();
      }
    );
  }

  exportPdf() {
    this.appService.exportPdf(this.exportColumns, this.lstPeriodo, 'Periodo', "l");
  }

  exportExcel() {
    this.appService.exportExcel(this.lstPeriodo, 'Periodo');
  }

  descargarArchivo(fileName: string) {
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appService.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }
}
