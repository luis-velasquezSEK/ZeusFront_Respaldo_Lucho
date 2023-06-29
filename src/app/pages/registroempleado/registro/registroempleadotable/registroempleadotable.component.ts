import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { AppService } from '@services/app.service';
import { FileService } from '@services/utils/file.service';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { Table } from "primeng/table";
import { EmpleadoService } from '@services/empleado/empleado.service';
import { EmpleadoDto } from '@/dto/EmpleadoDto';

@Component({
  selector: 'app-registroempleadotable',
  templateUrl: './registroempleadotable.component.html',
  styleUrls: ['./registroempleadotable.component.scss']
})
export class RegistroempleadotableComponent implements OnInit {

  @Input() lstEmpleado: EmpleadoDto[];
  @Output() empleadoSelect = new EventEmitter();
  proceso: string = 'empleado';

  empleado: EmpleadoDto;
  selectedEmpleado: EmpleadoDto[];
  submitted: boolean;
  loading: boolean;
  exportColumns: any[];
  cols: any[];

  constructor(
    private empleadoService: EmpleadoService,
    private appservice: AppService,
    private fileService: FileService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {

  }

  contruirTabla() {
    this.cols = [
      { field: 'idEmp', header: 'ID' },
      { field: 'nombresEmp', header: 'Nombre' },
      { field: 'apellidoEmp', header: 'Apellido' },
      { field: 'dniEmp', header: 'DNI' },
      { field: 'fnacEmp', header: 'FNacimiento' },
      { field: 'edadEmp', header: 'Edad' },
      { field: 'fechaRegistroEmp', header: 'FechaRegistro' },
      { field: 'fechaActualizaEmp', header: 'fechaActualiza' },
      { field: 'pathfirmadigitalEmp', header: 'Firma' },
      { field: 'activoEmp', header: 'Activo' },
      { field: 'idEstadoEmpDTO', header: 'Estado' },
      { field: 'idFacultadDTO', header: 'Facultad' },
      { field: 'idTipoEmpDTO', header: 'Tipo' }
    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    this.loading = false;
  }

  clear(table: Table) {
    table.clear();
  }

  loadData(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      this.empleadoService.getAllLazy({ lazyEvent: JSON.stringify(event) }).then(res => {
        this.lstEmpleado = res;
        this.loading = false;
      })
    }, 1000)
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
        this.eliminarItemSelect();
      }
    })
  }

  eliminarItemSelect() {
    let indexLista: number = 0;
    for (let i = 0; i < this.selectedEmpleado.length; i++) {
      this.empleadoService.deleteObject(this.selectedEmpleado[i].idEmp).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedEmpleado.length) {
            this.lstEmpleado = this.lstEmpleado.filter(val => !this.selectedEmpleado.includes(val));
            this.selectedEmpleado = null;
            this.appservice.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }
  }
  

  editItem(item) {
    this.empleado = { ...item };
    this.empleadoSelect.emit(item);
    
  }

  deleteItem(item) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + item.nombresEmp + ' ' + item.apellidoEmp + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarItem(item);
      }
    });
  }

  eliminarItem(item) {
    this.empleadoService.deleteObject(item.idEmp).subscribe(
      data => {
        this.lstEmpleado = this.lstEmpleado.filter(val => val.idEmp !== item.idEmp);
        this.empleado = new EmpleadoDto();
        this.appservice.msgDelete();
        //console.log('DATA ENVIAR By JSON::::: ' + JSON.stringify(data));
      }
    );
  }

  exportPdf() {
    this.appservice.exportPdf(this.exportColumns, this.lstEmpleado, 'Empleado', '1');
  }

  exportExcel() {
    this.appservice.exportExcel(this.lstEmpleado, 'Empleado');
  }

  descargarArchivo(fileName: string) {
    try {
      this.fileService.getFileByName(fileName, this.proceso);
    } catch (error) {
      this.appservice.msgInfoDetail('error', 'Error', 'Error al descargar el archivo')
    }
  }

}
