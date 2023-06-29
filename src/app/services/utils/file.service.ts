import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import { AppService } from '@services/app.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private http: HttpClient, public appService: AppService) {
  }

  url = `${environment.HOST}/`;
  endpoint: string = 'files';

  //servicio para enviar lista de archivos a backend


  //Metodo que envia los archivos al endpoint /upload
  uploadSingleFile(file: any, proceso: string, nombre:string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file, nombre);

    const req = new HttpRequest('POST', this.url + this.endpoint + '/uploadIndirect', formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  uploadManyFiles(fileMany: any, proceso: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    for (const file of fileMany) {
      formData.append('file', file, file.name);
    }


    const req = new HttpRequest('POST', this.url + this.endpoint + '/uploadIndirect', formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  //metodo para descargar por nombre
  getFileByName(fileName: string, proceso: string) {
    this.http.get(this.url + this.endpoint + '/fileByName/' + fileName + '/' + proceso, {responseType: 'blob'}).subscribe(data => {
      console.log('DATA RESPONSE: '+JSON.stringify(data));
      const downloadURL = window.URL.createObjectURL(data);
      console.log('DATA : '+JSON.stringify(downloadURL));
      const link = document.createElement('a');
      link.href = downloadURL;

      console.log('link.href : '+JSON.stringify(link.href));

      link.download = fileName;
      link.click();
    }), error => {
      console.log(error);
    };
  }

  getFileByNameView(fileName: string, proceso: string): any{
    this.http.get(this.url + this.endpoint + '/fileByNameView/' + fileName + '/' + proceso, {responseType: 'blob'}).subscribe(data => {
      console.log('DATA RESPONSE: '+JSON.stringify(data));
      const fileURL = window.URL.createObjectURL(data);
      
      console.log('DATA :: ', data);
      console.log(fileURL)
      return fileURL
    }), error => {
      console.log(error);
    };
  }

  //Metodo para Obtener los archivos
  getFiles() {
    return this.http.get(this.url + this.endpoint + '/files');
  }

  //Metodo para borrar los archivos
  deleteFile(filename: string) {
    return this.http.get(this.url + this.endpoint + '/delete/' + filename);
  }

}
