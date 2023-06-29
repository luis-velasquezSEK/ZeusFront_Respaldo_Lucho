import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppService} from "@services/app.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {FileService} from "@services/utils/file.service";
import {Table} from "primeng/table";
import { ControlesPeriodoDto } from '@/dto/ControlesPeriodoDto';
import { ControlesperiodoService } from '@services/periodos/controlesperiodo.service';

@Component({
  selector: 'app-controlperiodotable',
  templateUrl: './controlperiodotable.component.html',
  styleUrls: ['./controlperiodotable.component.scss']
})
export class ControlperiodotableComponent implements OnInit {
  @Input() lstControlPer: ControlesPeriodoDto[];
  @Output() ControlPerSelect = new EventEmitter();
  proceso: string = 'controles-periodo'

  controlPer: ControlesPeriodoDto;
  selectedControlPer: ControlesPeriodoDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(
    private controlPerService: ControlesperiodoService,
    private appService: AppService,
    public fileService: FileService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.contruirTabla();
  }

  contruirTabla() {
    this.cols = [
      {field: 'idControlPeriodo', header: 'ID'},
      {field: 'nombreControlPeriodo', header: 'Nombre'},
      {field: 'fechaiControlPeriodo', header: 'Fecha Incial Control'},
      {field: 'fechafControlPeriodo', header: 'Fecha Final Control'},
      {field: 'vigenteControlPeriodo', header: 'Vigente'},
      {field: 'activoControlPeriodo', header: 'Activo'},
      {field: 'idPeriodoDTO', header: 'Periodo'},
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
      this.controlPerService.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
        this.lstControlPer = res;
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
    for (let i = 0; i < this.selectedControlPer.length; i++) {
      this.controlPerService.deleteObject(this.selectedControlPer[i].idControlPeriodo).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedControlPer.length) {
            this.lstControlPer = this.lstControlPer.filter(val => !this.selectedControlPer.includes(val));
            this.selectedControlPer = null;
            this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.controlPer = {...item};
    this.ControlPerSelect.emit(item);
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombreControlPeriodo + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItem(item);
      }
    });
  }

  eliminarItem(item) {
    this.controlPerService.deleteObject(item.idControlPeriodo).subscribe(
      data => {
        this.lstControlPer = this.lstControlPer.filter(val => val.idControlPeriodo !== item.idControlPeriodo);
        this.controlPer = new ControlesPeriodoDto();
        this.appService.msgDelete();
      }
    );
  }

  exportPdf() {
    this.appService.exportPdf(this.exportColumns, this.lstControlPer, 'Control Periodo', "l");
  }

  exportExcel() {
    this.appService.exportExcel(this.lstControlPer, 'Control Periodo');
  }

  descargarArchivo(fileName: string) {
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appService.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }
}
