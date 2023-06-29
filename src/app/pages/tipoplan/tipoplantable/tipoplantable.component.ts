import {Component, Input, OnInit, Output} from '@angular/core';
import {AppService} from "@services/app.service";
import {ConfirmationService} from "primeng/api";
import {Table} from "primeng/table";
import * as FileSaver from 'file-saver';
import jsPDF from "jspdf";
import "jspdf-autotable";
import {formatDate} from "@angular/common";
import {EventEmitter} from '@angular/core';
import {TipoPlanService} from "@services/planestudio/tipoplan.service";
import {TipoPlanEstudioDTO} from "@/dto/tipo-plan";

@Component({
  selector: 'app-tipoplantable',
  templateUrl: './tipoplantable.component.html',
  styleUrls: ['./tipoplantable.component.scss']
})
export class TipoplantableComponent implements OnInit {
  tipoPlanDialog: boolean;

  @Input() lstTipoPlan: TipoPlanEstudioDTO[];
  @Output() tipoPlanSelect = new EventEmitter();

  tipoPlan: TipoPlanEstudioDTO;

  selectedTipoPlan: TipoPlanEstudioDTO[];

  submitted: boolean;

  loading: boolean;

  exportColumns: any[];

  cols: any[];

  constructor(private tipoplanservice: TipoPlanService, private appservice: AppService, private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.construirTabla();
  }

  construirTabla() {
    /*this.tipoplanservice.getAll().subscribe(
      data => {
        this.lstTipoPlan = data;
      }
    );*/

    this.cols = [
      {field: 'nombreTipoPe', header: 'Nombre'},
      {field: 'observacionTipoPe', header: 'Observaciones'},
      {field: 'activoTipoPe', header: 'Activo'},
    ];

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
    this.loading = false;

  }

  clear(table: Table) {
    table.clear();
  }

  openNew() {
    this.tipoPlan = new TipoPlanEstudioDTO();
    this.submitted = false;
    this.tipoPlanDialog = true;
  }

  deleteSelectedTipoPlan() {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de Eliminar los elementos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarPlanSelected();
      }
    });
  }


  eliminarPlanSelected() {

    let indexLista:number = 0;
    for (let i = 0; i < this.selectedTipoPlan.length; i++) {
      this.tipoplanservice.deleteObject(this.selectedTipoPlan[i].idTipoPe).subscribe(
        data => {
          indexLista++;
          console.log('INDEX LISTA: '+indexLista);
          console.log('INDEX LISTA SELECCIONADA: '+this.selectedTipoPlan.length);

          if (indexLista == this.selectedTipoPlan.length) {
            this.lstTipoPlan = this.lstTipoPlan.filter(val => !this.selectedTipoPlan.includes(val));
            this.selectedTipoPlan = null;
            this.appservice.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }


  }

  editTipoPlan(tipoplan) {
    this.tipoPlan = {...tipoplan};
    this.tipoPlanDialog = false;
    this.tipoPlanSelect.emit(tipoplan);
  }

  deleteTipoPlan(tipoplan:TipoPlanEstudioDTO) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + tipoplan.nombreTipoPe + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarPlanSimple(tipoplan);
      }
    });
  }

  eliminarPlanSimple(tipoplan:TipoPlanEstudioDTO) {
    this.tipoplanservice.deleteObject(tipoplan.idTipoPe).subscribe(
      data => {
        this.lstTipoPlan = this.lstTipoPlan.filter(val => val.idTipoPe !== tipoplan.idTipoPe);
        this.tipoPlan = new TipoPlanEstudioDTO();
        this.appservice.msgDelete();
      }
    );
  }

  hideDialog() {
    this.tipoPlanDialog = false;
    this.submitted = false;
  }

  saveTipoPlan() {
    this.submitted = true;

    if (this.tipoPlan.nombreTipoPe.trim()) {
      if (this.tipoPlan.idTipoPe) {
        this.lstTipoPlan[this.findIndexById(this.tipoPlan.idTipoPe)] = this.tipoPlan;
        this.appservice.msgUpdate();
      } else {
        this.tipoPlan.idTipoPe = this.createId();
        //this.tipoPlan.image = 'product-placeholder.svg';
        this.lstTipoPlan.push(this.tipoPlan);
        this.appservice.msgCreate();
      }

      this.lstTipoPlan = [...this.lstTipoPlan];
      this.tipoPlanDialog = false;
      this.tipoPlan = new TipoPlanEstudioDTO();
    }
  }

  findIndexById(id
                  :
                  number
  ):
    number {
    let index = -1;
    for (let i = 0; i < this.lstTipoPlan.length; i++) {
      if (this.lstTipoPlan[i].idTipoPe === id) {
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
    doc['autoTable'](this.exportColumns, this.lstTipoPlan);
    // doc.autoTable(this.exportColumns, this.products);
    //doc.save(tipoPlanEstudioDTO.name+".pdf");
    doc.save("TiposPlanesEstudio-" + date + ".pdf");
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const currentDate = new Date();
      const date = formatDate(currentDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');
      const worksheet = xlsx.utils.json_to_sheet(this.lstTipoPlan);
      const workbook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
      const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
      this.saveAsExcelFile(excelBuffer, "TiposPlanesEstudio-" + date);
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
