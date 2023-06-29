import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppService} from "@services/app.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {FileService} from "@services/utils/file.service";
import {Table} from "primeng/table";
import { MallaDto } from '@/dto/MallaDto';
import { MallaService } from '@services/mallas/malla.service';

@Component({
  selector: 'app-mallastable',
  templateUrl: './mallastable.component.html',
  styleUrls: ['./mallastable.component.scss']
})
export class MallastableComponent implements OnInit {
  // @Input() lstMalla: MallaDto[];
  @Input() lstMalla: MallaDto[] = [];
  @Output() mallaSelect = new EventEmitter();
  proceso: string = 'malla'

  malla: MallaDto;
  selectedMalla: MallaDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(
    private MallaService: MallaService,
    private appService: AppService,
    public fileService: FileService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.contruirTabla();
  }

  contruirTabla() {
    this.cols = [
      { field: 'idMalla', header: 'ID' },
      { field: 'codigoPlanEstudioMalla', header: 'Codigo Plan Estudio' },
      { field: 'numerodecretoCesMalla', header: 'Numero Decreto' },
      { field: 'duracionSemestresMalla', header: 'Duracion Semestre' },
      { field: 'periodicidadMalla', header: 'Periocidad' },
      { field: 'cupoCesMalla', header: 'Cupo' },
      { field: 'fechaAprobacionMalla', header: 'Fecha Aprobacion' },
      { field: 'fechaVigenciaMalla', header: 'Fecha Vigencia' },
      { field: 'pathdecretoCesMalla', header: 'Decreto' },
      { field: 'semestreInicioMalla', header: 'Semestre Inicio' },
      { field: 'semestreFinMalla', header: 'Semestre Fin' },
      { field: 'pathresolucionactivaMalla', header: 'Solucion Activa' },
      { field: 'pathresolucioncierreMalla', header: 'Solucion Cierre' },
      { field: 'observacionesMalla', header: 'Observaciones' },
      { field: 'activoMalla', header: 'Activo' },
      { field: 'idCarreraDTO', header: 'Carrera' },
      { field: 'idEstadoMallaDTO', header: 'Estado Malla' },
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
      this.MallaService.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
        this.lstMalla = res;
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
    for (let i = 0; i < this.selectedMalla.length; i++) {
      this.MallaService.deleteObject(this.selectedMalla[i].idMalla).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedMalla.length) {
            this.lstMalla = this.lstMalla.filter(val => !this.selectedMalla.includes(val));
            this.selectedMalla = null;
            this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.malla = {...item};
    this.mallaSelect.emit(item);
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.codigoPlanEstudioMalla + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItem(item);
      }
    });
  }

  eliminarItem(item) {
    this.MallaService.deleteObject(item.idMalla).subscribe(
      data => {
        this.lstMalla = this.lstMalla.filter(val => val.idMalla !== item.idMalla);
        this.malla = new MallaDto();
        this.appService.msgDelete();
      }
    );
  }

  exportPdf() {
    this.appService.exportPdf(this.exportColumns, this.lstMalla, 'Malla', "l");
  }

  exportExcel() {
    this.appService.exportExcel(this.lstMalla, 'Malla');
  }

  descargarArchivo(fileName: string) {
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appService.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }
}
