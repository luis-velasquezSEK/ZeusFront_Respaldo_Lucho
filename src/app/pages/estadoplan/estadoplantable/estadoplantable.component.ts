import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EstadoPlanEstudioDTO} from "@/dto/estado-plan-dto";
import {EstadoPlanService} from "@services/planestudio/estadoplan.service";
import {AppService} from "@services/app.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {Table} from "primeng/table";
import * as FileSaver from 'file-saver';
import jsPDF from "jspdf";
import "jspdf-autotable";
import {formatDate} from "@angular/common";
import {TipoPlanEstudioDTO} from "@/dto/tipo-plan";

@Component({
  selector: 'app-estadoplantable',
  templateUrl: './estadoplantable.component.html',
  styleUrls: ['./estadoplantable.component.scss']
})
export class EstadoplantableComponent implements OnInit {

  @Input() lstEstadoPlan: EstadoPlanEstudioDTO[];
  @Output() estadoPlanSelect = new EventEmitter();


  estadoPlan: EstadoPlanEstudioDTO;

  selectedEstadoPlan: EstadoPlanEstudioDTO[];

  submitted: boolean;

  loading: boolean;

  exportColumns: any[];

  cols: any[];

  constructor(private estadoplanservice: EstadoPlanService, private appservice: AppService, private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.construirTabla();
  }

  construirTabla() {
    /* this.estadoplanservice.getAll().subscribe(
      data => {
        this.lstEstadoPlan = data;
      }
    );*/

    this.cols = [
      {field: 'nombreEstadoPe', header: 'Nombre'},
      {field: 'observacionEstadoPe', header: 'Observaciones'},
      {field: 'activoEstadoPe', header: 'Activo'},
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
      this.estadoplanservice.getAllLazy({lazyEvent: JSON.stringify(event)}).then(res => {
        this.lstEstadoPlan = res;
        this.loading = false;
      })
    }, 1000);
  }

  openNew() {
    this.estadoPlan = new EstadoPlanEstudioDTO();
    this.submitted = false;
  }

  deleteSelectedEstadoPlan() {
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
    for (let i = 0; i < this.selectedEstadoPlan.length; i++) {
      this.estadoplanservice.deleteObject(this.selectedEstadoPlan[i].idEstadoPe).subscribe(
        data => {
          indexLista++;
          console.log('INDEX LISTA: '+indexLista);
          console.log('INDEX LISTA SELECCIONADA: '+this.selectedEstadoPlan.length);

          if (indexLista == this.selectedEstadoPlan.length) {
            this.lstEstadoPlan = this.lstEstadoPlan.filter(val => !this.selectedEstadoPlan.includes(val));
            this.selectedEstadoPlan = null;
            this.appservice.msgInfoDetail('error', 'Eliminación', 'Se han eliminado todos los datos seleccionados',)
          }
        }
      );
    }


  }

  editEstadoPlan(estadoplan: EstadoPlanEstudioDTO) {
    this.estadoPlan = {...estadoplan};
    this.estadoPlanSelect.emit(estadoplan);
    // console.log('EMITE ESTADO PLAN: '+estadoplan);
  }

  deleteEstadoPlan(estadoplan: EstadoPlanEstudioDTO) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de eliminar ' + estadoplan.nombreEstadoPe + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarPlanSimple(estadoplan);
      }
    });
  }

  eliminarPlanSimple(estadoplan:EstadoPlanEstudioDTO) {
    this.estadoplanservice.deleteObject(estadoplan.idEstadoPe).subscribe(
      data => {
        this.lstEstadoPlan = this.lstEstadoPlan.filter(val => val.idEstadoPe !== estadoplan.idEstadoPe);
        this.estadoPlan = new EstadoPlanEstudioDTO();
        this.appservice.msgDelete();
      }
    );
  }

  hideDialog() {
    this.submitted = false;
  }

  saveEstadoPlan() {
    this.submitted = true;

    if (this.estadoPlan.nombreEstadoPe.trim()) {
      if (this.estadoPlan.idEstadoPe) {
        this.lstEstadoPlan[this.findIndexById(this.estadoPlan.idEstadoPe)] = this.estadoPlan;
        this.appservice.msgUpdate();
      } else {
        this.estadoPlan.idEstadoPe = this.createId();
        //this.estadoPlan.image = 'product-placeholder.svg';
        this.lstEstadoPlan.push(this.estadoPlan);
        this.appservice.msgCreate();
      }

      this.lstEstadoPlan = [...this.lstEstadoPlan];
      this.estadoPlan = new EstadoPlanEstudioDTO();
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.lstEstadoPlan.length; i++) {
      if (this.lstEstadoPlan[i].idEstadoPe === id) {
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
    const currentDate = new Date();
    const date = formatDate(currentDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    // const doc = new jsPDF();
    const doc = new jsPDF('p', 'pt');
    doc['autoTable'](this.exportColumns, this.lstEstadoPlan);
    // doc.autoTable(this.exportColumns, this.products);
    //doc.save(EstadoPlanEstudioDTO.name+".pdf");
    doc.save("EstadosPlanesEstudio-" + date + ".pdf");
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const currentDate = new Date();
      const date = formatDate(currentDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');
      const worksheet = xlsx.utils.json_to_sheet(this.lstEstadoPlan);
      const workbook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
      const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
      this.saveAsExcelFile(excelBuffer, "EstadoPlanesEstudio-" + date);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }


}
