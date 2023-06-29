import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppService} from "@services/app.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {FileService} from "@services/utils/file.service";
import {Table} from "primeng/table";
import { NivelesPaoDto } from '@/dto/NivelesPaoDto';
import { NivelpaoService } from '@services/mallas/nivelpao.service';

@Component({
  selector: 'app-nivelespaotable',
  templateUrl: './nivelespaotable.component.html',
  styleUrls: ['./nivelespaotable.component.scss']
})
export class NivelespaotableComponent implements OnInit {
  @Input() lstNivelPao: NivelesPaoDto[];
  @Output() nivelPaoSelect = new EventEmitter();
  proceso: string = 'niveles-pao'

  nivelPao: NivelesPaoDto;
  selectedNivelPao: NivelesPaoDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(
    private nivelPaoService: NivelpaoService,
    private appService: AppService,
    public fileService: FileService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.contruirTabla();
  }

  contruirTabla() {
    this.cols = [
      {field: 'idNivelespao', header: 'ID'},
      {field: 'nombreNivelesPao', header: 'Nombre'},
      {field: 'descripcionNivelesPao', header: 'Descripción'},
      {field: 'activoNivelesPao', header: 'Activo'},
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
      this.nivelPaoService.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
        this.lstNivelPao = res;
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
    for (let i = 0; i < this.selectedNivelPao.length; i++) {
      this.nivelPaoService.deleteObject(this.selectedNivelPao[i].idNivelespao).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedNivelPao.length) {
            this.lstNivelPao = this.lstNivelPao.filter(val => !this.selectedNivelPao.includes(val));
            this.selectedNivelPao = null;
            this.appService.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.nivelPao = {...item};
    this.nivelPaoSelect.emit(item);
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombreNivelesPao + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItem(item);
      }
    });
  }

  eliminarItem(item) {
    this.nivelPaoService.deleteObject(item.idNivelespao).subscribe(
      data => {
        this.lstNivelPao = this.lstNivelPao.filter(val => val.idNivelespao !== item.idNivelespao);
        this.nivelPao = new NivelesPaoDto();
        this.appService.msgDelete();
      }
    );
  }

  exportPdf() {
    this.appService.exportPdf(this.exportColumns, this.lstNivelPao, 'Niveles PAO', "l");
  }

  exportExcel() {
    this.appService.exportExcel(this.lstNivelPao, 'Niveles PAO');
  }

  descargarArchivo(fileName: string) {
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appService.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }
}
