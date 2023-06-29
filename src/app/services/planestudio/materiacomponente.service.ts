import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import { IMateriaComponente } from '@/Interfaces/imateriacomponente';

@Injectable({
  providedIn: 'root'
})
export class MateriaComponenteService {
  constructor(private http: HttpClient) {
  }

  url = `${environment.HOST}/`;
  endpoint: string = 'api/componentemateria';

  getAll(): Observable<IMateriaComponente> {
    return this.http.get<IMateriaComponente>(this.url + this.endpoint + '/GetAll');
  }

  getAllByIdPlan(codplan:string,idmateria:number): Observable<any> {
    return this.http.get<any>(this.url + this.endpoint + '/GetAllByMateria/'+codplan+"/"+idmateria);
  }

  getComponenteSinPlanificar(idplan: number, idmat: number, idper: number): Observable<any>{
    return this.http.get<any>(this.url + this.endpoint + '/GetComponenteSinPlanificar/' + idplan + '/' + idmat + '/' + idper);
  }

  editObject(obj): Observable<any> {
    return this.http.put(this.url + this.endpoint + '/Update', obj);
  }



}
