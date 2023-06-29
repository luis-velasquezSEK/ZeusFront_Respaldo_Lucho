import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import { IPlanEstudio } from '@/Interfaces/iplanestudio';
import { IModalidad } from '@/Interfaces/imodalidad';

@Injectable({
  providedIn: 'root'
})
export class PlanEstudioService {
  constructor(private http: HttpClient) {
  }

  url = `${environment.HOST}/`;
  endpoint: string = 'api/PlanEstudio';

  getAll(): Observable<any> {
    return this.http.get(this.url + this.endpoint + '/GetAll');
  }

  getByIdCarrera(key): Observable<IPlanEstudio> {
    return this.http.get<IPlanEstudio>(this.url + this.endpoint + '/GetAllByIdCarrera/' + key);
  }

  getByIdModalidad(key): Observable<IModalidad> {
    return this.http.get<IModalidad>(this.url + this.endpoint + '/GetAllByIdModalidad/' + key);
  }

  getIdMateriaPlan(codplan,codmateria): Observable<IPlanEstudio> {
    return this.http.get<IPlanEstudio>(this.url + this.endpoint + '/GetAllByPlanMateria/' + codplan+'/'+codmateria)
  }

  findByCarrera(key): Observable<any> {
    return this.http.get(this.url + this.endpoint + '/GetAllByIdCarrera/' + key);
  }

  getAllByCodigo(cod): Observable<any> {
    return this.http.get(this.url + this.endpoint + '/GetAllByCodPlan/' + cod);
  }

  saveObject(obj): Observable<any> {
    return this.http.post(this.url + this.endpoint + '/crear', obj);
  }

  getById(key): Observable<any> {
    return this.http.get(this.url + this.endpoint + '/ver/' + key);
  }

  checarCruceSemanal(idEspacio, obj): Observable<any> {
    return this.http.post(this.url + this.endpoint + '/crucesemanal/'+idEspacio, obj);
  }

  checarCruceFechas(idEspacio, obj): Observable<any> {
    return this.http.post(this.url + this.endpoint + '/crucefechas/'+idEspacio, obj);
  }

  checarCruceModulos(idEspacio, obj): Observable<any> {
    return this.http.post(this.url + this.endpoint + '/crucemodulo/'+idEspacio, obj);
  }

  editObject(obj): Observable<any> {
    return this.http.put(this.url + this.endpoint + '/editar/' + obj.idUser, obj);
  }

  deleteObject(key): Observable<any> {
    return this.http.delete(this.url + this.endpoint + '/eliminar/' + key);
  }

}
