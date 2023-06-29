import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UnidadOrganizacionalCurricularService {
  constructor(private http: HttpClient) {
  }

  url = `${environment.HOST}/`;
  endpoint: string = 'api/uoc';

  getAll(): Observable<any> {
    return this.http.get(this.url + this.endpoint + '/GetAll');
  }

  getById(key): Observable<any> {
    return this.http.get(this.url + this.endpoint + '/ver/' + key);
  }

  saveObject(obj): Observable<any> {
    return this.http.post(this.url + this.endpoint + '/crear', obj);
  }

  editObject(obj): Observable<any> {
    return this.http.put(this.url + this.endpoint + '/editar/' + obj.idUser, obj);
  }

  deleteObject(key): Observable<any> {
    return this.http.delete(this.url + this.endpoint + '/eliminar/' + key);
  }

}
