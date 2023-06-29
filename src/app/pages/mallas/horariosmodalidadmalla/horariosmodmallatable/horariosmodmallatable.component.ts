import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppService} from "@services/app.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {FileService} from "@services/utils/file.service";
import {Table} from "primeng/table";
import { HorasModalidadMallaDto } from '@/dto/HorasModalidadMallaDto';
import { HorasModalidadMallaService } from '@services/mallas/horasmodalidadmalla.service';

@Component({
  selector: 'app-horariosmodmallatable',
  templateUrl: './horariosmodmallatable.component.html',
  styleUrls: ['./horariosmodmallatable.component.scss']
})
export class HorariosmodmallatableComponent implements OnInit {
  @Input() lstHorasModMalla: HorasModalidadMallaDto[];
  @Output() horasModMallaSelect = new EventEmitter();
  @Output() lstHorarioModMallaEMitter = new EventEmitter();

  // proceso: string = 'horas-modalidad-malla'

  horasModMalla: HorasModalidadMallaDto;
  selectedHorasModMalla: HorasModalidadMallaDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(
    private HorasModMallaService: HorasModalidadMallaService,
    private appService: AppService,
    public fileService: FileService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.contruirTabla();
  }

  contruirTabla() {
    this.cols = [
      {field: 'idHorasModalidadMalla', header: 'ID'},
      {field: 'nombreModalidadMalla', header: 'Nombre'},
      {field: 'horaInicioModalidadMalla', header: 'Hora Inicio'},
      {field: 'horaFinModalidadMalla', header: 'Hora Fin'},
      {field: 'idModalidadMallaDTO.nombreModalidadMalla', header: 'Modalidad Malla'},
      {field: 'descripcionModalidadMalla', header: 'Descripción'},
      {field: 'activoModalidadMalla', header: 'Activo'},
    ];
    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
    this.loading = false;
  }

  clear(table: Table) {
    table.clear();
  }

  // // LISTAR LA INFORMACION Q EXISTE EN LA BASE
  // async loadData(event: LazyLoadEvent) {
  //   this.loading = true;
  //     await this.HorasModMallaService.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
  //       this.lstHorasModMalla = res;
  //       this.loading = false;
  //     })
  // }

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
    for (let i = 0; i < this.selectedHorasModMalla.length; i++) {
      this.HorasModMallaService.deleteObject(this.selectedHorasModMalla[i].idHorasModalidadMalla).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedHorasModMalla.length) {
            this.lstHorasModMalla = this.lstHorasModMalla.filter(val => !this.selectedHorasModMalla.includes(val));
            this.selectedHorasModMalla = null;
            this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.horasModMalla = {...item};
    this.horasModMallaSelect.emit(item);
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombreModalidadMalla + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItem(item);
      }
    });
  }

  async eliminarItem(item) {
    await this.HorasModMallaService.deleteObject(item.idHorasModalidadMalla).subscribe(
      data => {
        this.lstHorasModMalla = this.lstHorasModMalla.filter(val => val.idHorasModalidadMalla !== item.idHorasModalidadMalla);
        this.horasModMalla = new HorasModalidadMallaDto();
        this.appService.msgDelete();
      }
    );
  }

  async exportPdf() {
    await this.appService.exportPdf(this.exportColumns, this.lstHorasModMalla, 'Horas Modalidad Malla', "l");
  }

  async exportExcel() {
    await this.appService.exportExcel(this.lstHorasModMalla, 'Horas Modalidad Malla');
  }

  // async descargarArchivo(fileName: string) {
  //   try {
  //     await this.fileService.getFileByName(fileName, this.proceso);
  //   } catch (error) {
  //     await this.appService.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
  //   }
  // }
}
