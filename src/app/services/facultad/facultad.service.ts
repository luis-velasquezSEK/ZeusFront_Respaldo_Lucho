import { IFacultad } from '@/Interfaces/ifacultad';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacultadService {

  constructor(private http: HttpClient) { }
  url = `${environment.HOST}/`;
  endpoint: string = 'api/facultad'
  getAll(): Observable<IFacultad> {
    return this.http.get<IFacultad>(this.url + this.endpoint + '/GetAll')
  }
}
