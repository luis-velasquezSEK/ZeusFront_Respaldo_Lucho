import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {AppService} from "@services/app.service";
import {ConfirmationService} from "primeng/api";
import {Table} from "primeng/table";
import * as FileSaver from 'file-saver';
import jsPDF from "jspdf";
import "jspdf-autotable";
import {formatDate} from "@angular/common";
import {PeriodicidadPlanService} from "@services/planestudio/periodicidadplan.service";
import { PeriodicidadPlanEstudioDTO } from '@/dto/periodicidad-plan-dto';

@Component({
  selector: 'app-periodicidadplantable',
  templateUrl: './periodicidadplantable.component.html',
  styleUrls: ['./periodicidadplantable.component.scss']
})
export class PeriodicidadplantableComponent implements OnInit {

  @Input() lstPeriodicidadPlan: PeriodicidadPlanEstudioDTO[];
  @Output() periodicidadPlanSelect = new EventEmitter();

  periodicidadPlan: PeriodicidadPlanEstudioDTO;

  selectedPeriodicidadPlan: PeriodicidadPlanEstudioDTO[];

  submitted: boolean;

  loading: boolean;

  exportColumns: any[];

  cols: any[];

  constructor(private periodicidadplanservice: PeriodicidadPlanService, private appservice: AppService, private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.construirTabla();
  }

  construirTabla() {

    this.cols = [
      {field: 'nombrePeriodicidadPlanEstudios', header: 'Nombre'},
      {field: 'codigoPeriodicidadPlanEstudios', header: 'Código'},
      {field: 'descripcionPeriodicidadPlanEstudios', header: 'Descripción'},
      {field: 'activoPeriodicidadPlanEstudios', header: 'Activo'},
    ];

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
    this.loading = false;

  }

  clear(table: Table) {
    table.clear();
  }

  openNew() {
    this.periodicidadPlan = new PeriodicidadPlanEstudioDTO();
    this.submitted = false;
  }

  deleteSelectedPeriodicidadPlan() {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de Eliminar los elementos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarPeriodicidadSelected();
      }
    });
  }


  eliminarPeriodicidadSelected() {

    let indexLista: number = 0;
    for (let i = 0; i < this.selectedPeriodicidadPlan.length; i++) {
      this.periodicidadplanservice.deleteObject(this.selectedPeriodicidadPlan[i].idPeriodicidad).subscribe(
        data => {
          indexLista++;
          if (indexLista == this.selectedPeriodicidadPlan.length) {
            this.lstPeriodicidadPlan = this.lstPeriodicidadPlan.filter(val => !this.selectedPeriodicidadPlan.includes(val));
            this.selectedPeriodicidadPlan = null;
            this.appservice.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }


  }

  editPeriodicidadPlan(periodicidadplan) {
    this.periodicidadPlan = {...periodicidadplan};
    this.periodicidadPlanSelect.emit(periodicidadplan);
  }

  deletePeriodicidadPlan(periodicidadplan: PeriodicidadPlanEstudioDTO) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + periodicidadplan.nombrePeriodicidad + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarPeriodicidadSimple(periodicidadplan);
      }
    });
  }

  eliminarPeriodicidadSimple(periodicidadplan: PeriodicidadPlanEstudioDTO) {
    this.periodicidadplanservice.deleteObject(periodicidadplan.idPeriodicidad).subscribe(
      data => {
        this.lstPeriodicidadPlan = this.lstPeriodicidadPlan.filter(val => val.idPeriodicidad !== periodicidadplan.idPeriodicidad);
        this.periodicidadPlan = new PeriodicidadPlanEstudioDTO();
        this.appservice.msgDelete();
      }
    );
  }

  hideDialog() {
    this.submitted = false;
  }

  savePeriodicidadPlan() {
    this.submitted = true;

    if (this.periodicidadPlan.nombrePeriodicidad.trim()) {
      if (this.periodicidadPlan.idPeriodicidad) {
        this.lstPeriodicidadPlan[this.findIndexById(this.periodicidadPlan.idPeriodicidad)] = this.periodicidadPlan;
        this.appservice.msgUpdate();
      } else {
        this.periodicidadPlan.idPeriodicidad = this.createId();
        //this.tipoPlan.image = 'product-placeholder.svg';
        this.lstPeriodicidadPlan.push(this.periodicidadPlan);
        this.appservice.msgCreate();
      }

      this.lstPeriodicidadPlan = [...this.lstPeriodicidadPlan];
      this.periodicidadPlan = new PeriodicidadPlanEstudioDTO();
    }
  }

  findIndexById(id
                  :
                  number
  ):
    number {
    let index = -1;
    for (let i = 0; i < this.lstPeriodicidadPlan.length; i++) {
      if (this.lstPeriodicidadPlan[i].idPeriodicidad === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId()
    :
    number {
    let id = 0;
    for (var i = 0; i < 5; i++) {
      id += (Math.floor(Math.random()));
    }
    return id;
  }


  exportPdf() {
    const currentDate = new Date();
    const date = formatDate(currentDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    // const doc = new jsPDF();
    const doc = new jsPDF('p', 'pt');
    doc['autoTable'](this.exportColumns, this.lstPeriodicidadPlan);
    // doc.autoTable(this.exportColumns, this.products);
    //doc.save(tipoPlanEstudioDTO.name+".pdf");
    doc.save("PeriodicidadPlanesEstudio-" + date + ".pdf");
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const currentDate = new Date();
      const date = formatDate(currentDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');
      const worksheet = xlsx.utils.json_to_sheet(this.lstPeriodicidadPlan);
      const workbook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
      const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
      this.saveAsExcelFile(excelBuffer, "PeriodicidadPlanesEstudio-" + date);
    });
  }

  saveAsExcelFile(buffer
                    :
                    any, fileName
                    :
                    string
  ):
    void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data
      :
      Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }


}
