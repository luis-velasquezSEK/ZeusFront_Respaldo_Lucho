import { ICarrera } from '@/Interfaces/icarrera';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {

  constructor(private http: HttpClient) { }
  url = `${environment.HOST}/`;
  endpoint: string = 'api/carrera'
  getById(key): Observable<ICarrera> {
    return this.http.get<ICarrera>(this.url + this.endpoint + '/GetByIdFacultad/'+ key)
  }
}
