import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FacultadDto} from "@/dto/FacultadDto";
import {FacultadService} from "@services/institucioneducativa/facultad.service";
import {AppService} from "@services/app.service";
import {FileService} from "@services/utils/file.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {Table} from "primeng/table";
import {CarreraService} from "@services/institucioneducativa/carrera.service";
import {CarreraDto} from "@/dto/CarreraDto";

@Component({
  selector: 'app-carreratable',
  templateUrl: './carreratable.component.html',
  styleUrls: ['./carreratable.component.scss']
})
export class CarreratableComponent implements OnInit {

  @Input() lstCarrera: CarreraDto[];
  @Output() carreraSelect = new EventEmitter();
  proceso: string = 'academia';

  carrera: CarreraDto;
  selectedCarrera: CarreraDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(private carreraService: CarreraService,
              private appservice: AppService,
              public fileService: FileService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.construirTabla();
  }

  construirTabla() {
    this.cols = [
      {field: 'idCarrera', header: 'ID'},
      {field: 'codigoCarrera', header: 'Código'},
      {field: 'nombreCarrera', header: 'Nombre'},
      {field: 'siglasCarrera', header: 'Siglas'},
      {field: 'tituloCarrera', header: 'Título'},
      {field: 'mencionCarrera', header: 'Mención'},
      {field: 'pathdecretoAprobacionCarrera', header: 'Decreto'},
      {field: 'fechacreaCarrera', header: 'Crea'},
      {field: 'fechaactCarrera', header: 'Actualiza'},
      {field: 'fechacierraCarrera', header: 'Cierra'},
      {field: 'activoCarrera', header: 'Activo'},
      {field: 'idEstadoCarreraDTO.nombreEstadoCarrera', header: 'Estado'},
      {field: 'idFacultadDTO.nombreFacultad', header: 'Facultad'}
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
      this.carreraService.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
        this.lstCarrera = res;
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
    for (let i = 0; i < this.selectedCarrera.length; i++) {
      this.carreraService.deleteObject(this.selectedCarrera[i].idCarrera).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedCarrera.length) {
            this.lstCarrera = this.lstCarrera.filter(val => !this.selectedCarrera.includes(val));
            this.selectedCarrera = null;
            this.appservice.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }

  editItem(item) {
    this.carrera = {...item};
    this.carreraSelect.emit(item);
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
    this.carreraService.deleteObject(item.idCarrera).subscribe(
      data => {
        this.lstCarrera = this.lstCarrera.filter(val => val.idCarrera !== item.idCarrera);
        this.carrera = new CarreraDto();
        this.appservice.msgDelete();
      }
    );
  }

  exportPdf() {
    this.appservice.exportPdf(this.exportColumns, this.lstCarrera, 'Carrera', "l");
  }

  exportExcel() {
    this.appservice.exportExcel(this.lstCarrera, 'Carrera');
  }

  descargarArchivo(fileName: string) {
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appservice.msgInfoDetail('error', 'Error', 'Error al descargar el archivo');
    }
  }

}
