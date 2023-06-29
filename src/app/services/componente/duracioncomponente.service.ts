import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {EstadoPlanEstudioDTO} from "@/dto/estado-plan-dto";

@Injectable({
  providedIn: 'root'
})
export class DuracionComponenteService {
  constructor(private http: HttpClient) {
  }

  url = `${environment.HOST}/`;
  endpoint: string = 'duracion-componente';

  getAllLazy(params) {
    return this.http.get<any>(this.url + this.endpoint + '/listar', {params: params}).toPromise();
  }

  getAll(): Observable<any> {
    return this.http.get(this.url + this.endpoint + '/listar');
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
