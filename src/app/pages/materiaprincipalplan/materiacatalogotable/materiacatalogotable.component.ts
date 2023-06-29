import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TipoPlanEstudioDTO} from "@/dto/tipo-plan";
import {TipoPlanService} from "@services/planestudio/tipoplan.service";
import {AppService} from "@services/app.service";
import {ConfirmationService} from "primeng/api";
import {Table} from "primeng/table";
import * as FileSaver from 'file-saver';
import jsPDF from "jspdf";
import "jspdf-autotable";
import {formatDate} from "@angular/common";
import {CatalogoMateriasDto} from "@/dto/CatalogoMateriasDto";
import {MateriasCatalogoService} from "@services/catalogos/materiascatalogo.service";
import {MateriaPrincipalDto} from "@/dto/materia-principal-plan-dto";

@Component({
  selector: 'app-materiacatalogotable',
  templateUrl: './materiacatalogotable.component.html',
  styleUrls: ['./materiacatalogotable.component.scss']
})
export class MateriacatalogotableComponent implements OnInit {

  @Input() lstMateriaCatalogo: CatalogoMateriasDto[];
  @Output() materiacatalogoSelect = new EventEmitter();

  materiaCatalogo: CatalogoMateriasDto;
  materiaPrincipal: MateriaPrincipalDto;

  loading: boolean;

  exportColumns: any[];

  cols: any[];

  constructor(
    public materiacatalogoService: MateriasCatalogoService, private appService: AppService, private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.construirTabla();
  }

  construirTabla() {
    this.cols = [
      {field:'codigoMateria',header: 'Código'},
      {field:'nombreMateria',header: 'Nombre'},
      {field:'creditosMateria',header: '# Créditos'},
      {field:'horasSemestralesMateria', header: '# Horas Semestre'},
      {field:'cuposMatriculaMateria', header: '# Cupos'},
      {field:'idTipoMateriaCatalogoNavigation.nombreTipoMateriaCatalogo',header: 'Tipo Materia'},
    ];

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
    this.loading = false;

  }

  clear(table: Table) {
    table.clear();
  }

  onRowSelect(event) {
    this.confirmationService.confirm({
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-outlined p-button-rounded p-button-success',
      rejectButtonStyleClass: 'p-button-outlined p-button-rounded p-button-danger',
      message: 'Esta seguro de usar la Materia Template?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usarMateriaTemplate(event.data);
      }
    });
  }

  onRowUnselect(event) {

    this.appService.msgInfoDetail('warn', 'Materia template', 'Selección Cancelada')
    this.materiaCatalogo = null;
    this.materiacatalogoSelect.emit(null);
  }

  usarMateriaTemplate(materiaCatalogo) {

    this.materiaCatalogo = {...materiaCatalogo};
    this.materiacatalogoSelect.emit(materiaCatalogo);
    console.log('SE ESTA SELECCIONANDO LA TEMPLATE MATERIA: ' + this.materiaCatalogo.codigoMateria);
    this.materiaPrincipal.codigoMateriap = this.materiaCatalogo.codigoMateria;
    this.materiaPrincipal.nombreMateriap = this.materiaCatalogo.nombreMateria;
    this.materiaPrincipal.creditosMateriap = this.materiaCatalogo.creditosMateria;
    this.materiaPrincipal.horasSemestralesMateriap = this.materiaCatalogo.horasSemestralesMateria;
    this.materiaPrincipal.cuposMatriculaMateriap = this.materiaCatalogo.cuposMatriculaMateria;
    this.materiaPrincipal.campoUnescoMateriap = this.materiaCatalogo.campoUnescoMateria;
    this.materiaPrincipal.activoMateriap = this.materiaCatalogo.activoMateria;

    console.log('MATERIA PASADA: ' + this.materiaPrincipal.codigoMateriap);

    //this.displayModal = false;

    this.appService.msgInfoDetail('info', 'materia Template', 'Materia usada como template exitoso!')
  }

  findIndexById(id:string):
    number {
      
    let index = -1;
    for (let i = 0; i < this.lstMateriaCatalogo.length; i++) {
      if (this.lstMateriaCatalogo[i].codigoMateria === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  exportPdf() {
    const currentDate = new Date();
    const date = formatDate(currentDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    // const doc = new jsPDF();
    const doc = new jsPDF('p', 'pt');
    doc['autoTable'](this.exportColumns, this.lstMateriaCatalogo);
    // doc.autoTable(this.exportColumns, this.products);
    //doc.save(tipoPlanEstudioDTO.name+".pdf");
    doc.save("TiposPlanesEstudio-" + date + ".pdf");
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const currentDate = new Date();
      const date = formatDate(currentDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');
      const worksheet = xlsx.utils.json_to_sheet(this.lstMateriaCatalogo);
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
