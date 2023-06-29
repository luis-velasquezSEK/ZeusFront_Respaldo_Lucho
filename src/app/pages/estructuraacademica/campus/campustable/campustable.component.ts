import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CampusDto} from "@/dto/CampusDto";
import {InstitucionEducativaService} from "@services/institucioneducativa/institucioneducativa.service";
import {AppService} from "@services/app.service";
import {FileService} from "@services/utils/file.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {Table} from "primeng/table";
import {CampusService} from "@services/institucioneducativa/campus.service";

@Component({
  selector: 'app-campustable',
  templateUrl: './campustable.component.html',
  styleUrls: ['./campustable.component.scss']
})
export class CampustableComponent implements OnInit {

  @Input() lstCampus: CampusDto[];
  @Output() campusSelect = new EventEmitter();
  proceso: string = 'academia';

  campus: CampusDto;
  selectedCampus: CampusDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(private campusService: CampusService,
              private appservice: AppService,
              public fileService: FileService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.construirTabla();
  }

  construirTabla() {
    this.cols = [
      {field: 'idCampus', header: 'ID'},
      {field: 'codigoCampus', header: 'Código'},
      {field: 'nombreCampus', header: 'Campus'},
      {field: 'callePrincipalCampus', header: 'Calle Principal'},
      {field: 'calleSecundariaCampus', header: 'Calle Secundaria'},
      {field: 'numeroCampus', header: 'No. Campus'},
      {field: 'referenciaCampus', header: 'Referencia'},
      {field: 'codPostalCampus', header: 'Cod Postal'},
      {field: 'telefonoCampus', header: 'Teléfono'},
      {field: 'faxCampus', header: 'Fax'},
      {field: 'emailCampus', header: 'Email'},
      {field: 'activoCampus', header: 'Activo'},
      {field: 'idSedeInstitucionDTO.nombreSedeInstitucion', header: 'Sede'},
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
      this.campusService.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
        this.lstCampus = res;
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
    for (let i = 0; i < this.selectedCampus.length; i++) {
      this.campusService.deleteObject(this.selectedCampus[i].idCampus).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedCampus.length) {
            this.lstCampus = this.lstCampus.filter(val => !this.selectedCampus.includes(val));
            this.selectedCampus = null;
            this.appservice.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.campus = {...item};
    this.campusSelect.emit(item);
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombreCampus + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItem(item);
      }
    });
  }

  eliminarItem(item) {
    this.campusService.deleteObject(item.idCampus).subscribe(
      data => {
        this.lstCampus = this.lstCampus.filter(val => val.idCampus !== item.idCampus);
        this.campus = new CampusDto();
        this.appservice.msgDelete();
      }
    );
  }

  hideDialog() {
    this.submitted = false;
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.lstCampus.length; i++) {
      if (this.lstCampus[i].idCampus === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  createId(): number {
    let id = 0;
    for (var i = 0; i < 5; i++) {
      id += (Math.floor(Math.random()));
    }
    return id;
  }

  exportPdf() {
    this.appservice.exportPdf(this.exportColumns, this.lstCampus, 'Campus', "p");
  }

  exportExcel() {
    this.appservice.exportExcel(this.lstCampus, 'Campus');
  }

  descargarArchivo(fileName: string) {
    //bloque try and catch para capturar el error de la descarga
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appservice.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }

}
