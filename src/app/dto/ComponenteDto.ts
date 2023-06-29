import {DuracionComponenteDto} from "@/dto/DuracionComponenteDto";
import {EstadoComponenteDto} from "@/dto/EstadoComponenteDto";
import {ModalidadComponenteDto} from "@/dto/ModalidadComponenteDto";
import {PlanEstudiosDto} from "@/dto/PlanEstudiosDto";
import {TipoComponenteDto} from "@/dto/TipoComponenteDto";

export class ComponenteDto {

  // idComponente: number;

  // codigoComponente: string;

  // nombreComponente: string;

  // pesoComponente: number;

  // padreComponente: number;

  // activoComponente: boolean;
  // profesorListDTO: [];
  // componenteListDTO: [];
  // comIdComponenteDTO: any;
  // idDuracionComponenteDTO: any;
  // idEstadocDTO: any;
  // idModalidadComponenteDTO: any;
  // planEstudiosDTO: any;
  // idTipoComponenteDTO: any;

  idComponente: number;
  idPlanEstudio: string;
  idMateria: string;
  idSubtipoComponente: string;
  codigoComponente: string;
  pesoComponente: string;
  activoComponente: boolean;
  horasComponente: string;

  idMateriaNavigation: any;
  idPlanEstudioNavigation: any;
  idSubtipoComponenteNavigation: any;

  planificacions: [];

  constructor() {
  }
}
