import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CorrequisitoDto} from "@/dto/CorrequisitoDto";
import {AppService} from "@services/app.service";
import {FileService} from "@services/utils/file.service";
import {ConfirmationService} from "primeng/api";
import {Table} from "primeng/table";
import {PrerrequisitosPlanEstudioDto} from "@/dto/PrerrequisitosPlanEstudioDto";
import {PlanEstudioServiceEmiter} from "@pages/planestudio/PlanEstudioService";

@Component({
  selector: 'app-prerrequisitostable',
  templateUrl: './prerrequisitostable.component.html',
  styleUrls: ['./prerrequisitostable.component.scss']
})
export class PrerrequisitostableComponent implements OnInit {

  //#region Atributos
  @Input() lstPrerrequisito: PrerrequisitosPlanEstudioDto[];
  @Output() prerrequisitoSelect = new EventEmitter();
  @Output() lstPrerrequisitoEmiter = new EventEmitter();

  prerrequisito: PrerrequisitosPlanEstudioDto;
  selectedPrerrequisito: PrerrequisitosPlanEstudioDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];
  proceso: string = 'prerrequisitos';

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
      {field: 'idPpestudios', header: '#'},
      {field: 'nombrePpestudios', header: 'Prerrequisito'},
      {field: 'descripcionPpestudios', header: 'Observaciones'},
//      {field: 'pathCorrequisito', header: 'Archivo'},
      {field: 'idTipoPpeDTO.nombreTipoPpe', header: 'Tipo'},
      {field: 'idCodigoCumplimientoprDTO.nombreCodigoCumplimientopr', header: 'Cumplimiento'},
      {field: 'cumpleMateria', header: 'Cumplimiento'},
      {field: 'activoMateriaPpestudios', header: 'Activo'},

    ];

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
    this.loading = false;

  }

  clear(table: Table) {
    table.clear();
  }

  deleteSelectedPrerrequisito() {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de Eliminar los elementos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarPrerrequisitoSelected();
      }
    });
  }

  eliminarPrerrequisitoSelected() {
    let indexLista: number = 0;
    this.lstPrerrequisito = this.lstPrerrequisito.filter(val => !this.selectedPrerrequisito.includes(val));
    this.selectedPrerrequisito = null;
    this.prerrequisitoSelect.emit(null);
    this.lstPrerrequisitoEmiter.emit(this.lstPrerrequisito);
    this.planEstudioService.setPrerrequisitoInput(this.lstPrerrequisito);
    this.appservice.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
  }

  editPrerrequisito(prerrequisito) {
    this.prerrequisito = {...prerrequisito};
    this.prerrequisitoSelect.emit(prerrequisito);
  }

  deletePrerrequisito(prerrequisito) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + prerrequisito.nombrePpestudios + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarPrerrequisitoSimple(prerrequisito);
      }
    });
  }

  eliminarPrerrequisitoSimple(prerrequisito) {
    this.lstPrerrequisito = this.lstPrerrequisito.filter(val => val.idPpestudios !== prerrequisito.idPpestudios);
    this.prerrequisito = new PrerrequisitosPlanEstudioDto();
    this.prerrequisitoSelect.emit(null);
    this.lstPrerrequisitoEmiter.emit(this.lstPrerrequisito);
    this.planEstudioService.setPrerrequisitoInput(this.lstPrerrequisito);
    this.appservice.msgDelete();
  }

  hideDialog() {
    this.submitted = false;
  }

  exportPdf() {
    this.appservice.exportPdf(this.exportColumns, this.lstPrerrequisito, 'Prerrequisitos', "p");
  }

  exportExcel() {
    this.appservice.exportExcel(this.lstPrerrequisito, 'Prerrequisitos');
  }

  descargarArchivo(fileName: string) {
    this.fileService.getFileByName(fileName, this.proceso);
  }
}
