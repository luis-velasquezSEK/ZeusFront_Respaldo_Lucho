import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ComponenteDto} from "@/dto/ComponenteDto";
import {ComponenteService} from "@services/componente/componente.service";
import {AppService} from "@services/app.service";
import {ConfirmationService} from "primeng/api";
import {Table} from "primeng/table";
import {CorrequisitoDto} from "@/dto/CorrequisitoDto";
import {CorrequisitoService} from "@services/correquisito/correquisito.service";
import {FileService} from "@services/utils/file.service";
import {PlanEstudioServiceEmiter} from "@pages/planestudio/PlanEstudioService";

@Component({
  selector: 'app-correquisitostable',
  templateUrl: './correquisitostable.component.html',
  styleUrls: ['./correquisitostable.component.scss']
})
export class CorrequisitostableComponent implements OnInit {

  @Input() lstCorrequisito: CorrequisitoDto[];
  @Output() correquisitoSelect = new EventEmitter();
  @Output() lstCorrequisitoEmiter = new EventEmitter();
  correquisito: CorrequisitoDto;
  selectedCorrequisito: CorrequisitoDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];
  proceso: string = 'correquisitos';

  constructor(private appservice: AppService,
              public fileService: FileService,
              public planEstudioService: PlanEstudioServiceEmiter,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.construirTabla();
  }

  construirTabla() {
    this.cols = [
      {field: 'idCorrequisito', header: '#'},
      {field: 'codMateriaCorrequisito', header: 'Requisito'},
      {field: 'observacionCorrequisito', header: 'Observaciones'},
      {field: 'pathCorrequisito', header: 'Archivo'},
      {field: 'idTipoCorrequisitoDTO.nombreTipoCorrequisito', header: 'Tipo'},
      {field: 'cumpleMateriaCorrequisito', header: 'Cumplimiento'},
      {field: 'activoMateriaCorrequisito', header: 'Activo'},

    ];

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
    this.loading = false;

  }

  clear(table: Table) {
    table.clear();
  }

  deleteSelectedCorrequisito() {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de Eliminar los elementos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarCorrequisitoSelected();
      }
    });
  }

  eliminarCorrequisitoSelected() {
    let indexLista: number = 0;
    this.lstCorrequisito = this.lstCorrequisito.filter(val => !this.selectedCorrequisito.includes(val));
    this.selectedCorrequisito = null;
    this.correquisitoSelect.emit(null);
    this.lstCorrequisitoEmiter.emit(this.lstCorrequisito);
    this.planEstudioService.setCorrequisitoInput(this.lstCorrequisito);
    this.appservice.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
  }

  editCorrequisito(correquisito) {
    this.correquisito = {...correquisito};
    this.correquisitoSelect.emit(correquisito);
  }

  deleteCorrequisito(correquisito) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + correquisito.codMateriaCorrequisito + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarCorrequisitoSimple(correquisito);
      }
    });
  }

  eliminarCorrequisitoSimple(correquisito) {
    this.lstCorrequisito = this.lstCorrequisito.filter(val => val.idCorrequisito !== correquisito.idCorrequisito);
    this.correquisito = new CorrequisitoDto();
    this.correquisitoSelect.emit(null);
    this.lstCorrequisitoEmiter.emit(this.lstCorrequisito);
    this.planEstudioService.setCorrequisitoInput(this.lstCorrequisito);
    this.appservice.msgDelete();
  }

  hideDialog() {
    this.submitted = false;
  }

  exportPdf() {
    this.appservice.exportPdf(this.exportColumns, this.lstCorrequisito, 'Correquisitos', "p");
  }

  exportExcel() {
    this.appservice.exportExcel(this.lstCorrequisito, 'Correquisitos');
  }

  descargarArchivo(fileName: string) {
    this.fileService.getFileByName(fileName, this.proceso);
  }
}
