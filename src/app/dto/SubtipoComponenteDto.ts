import {DuracionComponenteDto} from "@/dto/DuracionComponenteDto";
import {EstadoComponenteDto} from "@/dto/EstadoComponenteDto";
import {ModalidadComponenteDto} from "@/dto/ModalidadComponenteDto";
import {PlanEstudiosDto} from "@/dto/PlanEstudiosDto";
import {TipoComponenteDto} from "@/dto/TipoComponenteDto";

export class SubtipoComponenteDto {


  
  idSubtipoComponente: number;
  idTipoComponente: number;
  codigoSubtipoComponente: string;
  nombreSubtipoComponente: string;
  descripcionSubtipoComponente: string;
  incluyeDedicacionDocenteSubtipoComponente: boolean;
  activoSubtipoComponente: boolean;
  idTipoComponenteNavigation: number;


  constructor() {
  }
}
