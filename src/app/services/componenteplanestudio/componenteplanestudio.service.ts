import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ComponentePlanEstudioService {
  constructor(private http: HttpClient) {
  }

  url = `${environment.HOST}/`;
  endpoint: string = 'api/PlanEstudio';

  getAllLazy(params) {
    return this.http.get<any>(this.url + this.endpoint + '/listar', {params: params}).toPromise();
  }

  getAll(): Observable<any> {
    return this.http.get(this.url + this.endpoint + '/GetAll');
  }

  getById(key): Observable<any> {
    return this.http.get(this.url + this.endpoint + '/ver/' + key);
  }

  saveObject(obj): Observable<any> {
    return this.http.post(this.url + this.endpoint + '/SaveComponente', obj);
  }

  editObject(obj): Observable<any> {
    return this.http.put(this.url + this.endpoint + '/editar/' + obj.idUser, obj);
  }

  deleteObject(key): Observable<any> {
    return this.http.delete(this.url + this.endpoint + '/eliminar/' + key);
  }
}