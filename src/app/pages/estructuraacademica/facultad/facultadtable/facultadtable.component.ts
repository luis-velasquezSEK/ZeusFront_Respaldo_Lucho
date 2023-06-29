import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CampusDto} from "@/dto/CampusDto";
import {CampusService} from "@services/institucioneducativa/campus.service";
import {AppService} from "@services/app.service";
import {FileService} from "@services/utils/file.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {Table} from "primeng/table";
import {FacultadDto} from "@/dto/FacultadDto";
import {FacultadService} from "@services/institucioneducativa/facultad.service";

@Component({
  selector: 'app-facultadtable',
  templateUrl: './facultadtable.component.html',
  styleUrls: ['./facultadtable.component.scss']
})
export class FacultadtableComponent implements OnInit {

  @Input() lstFacultad: FacultadDto[];
  @Output() facultadSelect = new EventEmitter();
  proceso: string = 'academia';

  facultad: FacultadDto;
  selectedFacultad: FacultadDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(private facultadService: FacultadService,
              private appservice: AppService,
              public fileService: FileService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.construirTabla();
  }

  construirTabla() {
    this.cols = [
      {field: 'idFacultad', header: 'ID'},
      {field: 'codigoFacultad', header: 'Código'},
      {field: 'nombreFacultad', header: 'Facultad'},
      {field: 'descripcionFacultad', header: 'Descripción'},
      {field: 'resolucionFacultad', header: 'Resolución'},
      {field: 'fechacreaFacultad', header: 'Fecha Creación'},
      {field: 'fechaactFacultad', header: 'Fecha Actualiza'},
      {field: 'fechacierreFacultad', header: 'Fecha Cierre'},
      {field: 'fecharegistroFacultad', header: 'Fecha Registro'},
      {field: 'activoFacultad', header: 'Activo'},
      {field: 'idCampusDTO.nombreCampus', header: 'Campus'},
      {field: 'idEstadoFacultadDTO.nombreEstadoFacultad', header: 'Estado'}
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
      this.facultadService.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
        this.lstFacultad = res;
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
    for (let i = 0; i < this.selectedFacultad.length; i++) {
      this.facultadService.deleteObject(this.selectedFacultad[i].idFacultad).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedFacultad.length) {
            this.lstFacultad = this.lstFacultad.filter(val => !this.selectedFacultad.includes(val));
            this.selectedFacultad = null;
            this.appservice.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.facultad = {...item};
    this.facultadSelect.emit(item);
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
    this.facultadService.deleteObject(item.idFacultad).subscribe(
      data => {
        this.lstFacultad = this.lstFacultad.filter(val => val.idFacultad !== item.idFacultad);
        this.facultad = new FacultadDto();
        this.appservice.msgDelete();
      }
    );
  }

  exportPdf() {
    this.appservice.exportPdf(this.exportColumns, this.lstFacultad, 'Facultad', "l");
  }

  exportExcel() {
    this.appservice.exportExcel(this.lstFacultad, 'Facultad');
  }

  descargarArchivo(fileName: string) {
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appservice.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }

}
