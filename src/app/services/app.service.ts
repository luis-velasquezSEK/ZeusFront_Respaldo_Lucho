import {Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

import {environment} from "../../environments/environment";
import {delay, Observable, of, Subscription, switchMap, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "angularx-social-login";
import {TokenService} from "@services/token.service";
import {MenuItem, MessageService} from "primeng/api";
import {MenuService} from "@services/menu.service";
import {TokenDto} from "@/dto/token-dto";
import {formatDate} from "@angular/common";
import jsPDF from "jspdf";
import * as FileSaver from 'file-saver';
import "jspdf-autotable";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {JwtHelperService} from "@auth0/angular-jwt";
import {catchError} from "rxjs/operators";
import {SweetAlertService} from "@services/utils/sweet-alert.service";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {error} from 'protractor';
import {CookieService} from 'ngx-cookie-service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Cookied':'refreshtoken='

})
};

@Injectable({
  providedIn: 'root'
})
export class AppService {

  url = `${environment.HOST}/api/login`;

  userLogged: SocialUser;
  isLogged: boolean;

  interval: any;

  items: MenuItem[];
  menus: any;

  constructor(private router: Router,
              private toastr: ToastrService,
              private http: HttpClient,
              private messageService: MessageService,
              private authService: SocialAuthService,
              public menuService: MenuService,
              private storage: AngularFireStorage,
              private tokenService: TokenService,
              private jwtHelper: JwtHelperService,
              public sweetAlert: SweetAlertService,
              private _ngZone: NgZone,
              private cookieService: CookieService,
              ) {
  }

  timeToDate(time: Date): Date {
    let fecha = new Date();
    let fechaString = time.toString();
    let arrayFecha = fechaString.split(':');
    fecha.setHours(Number(arrayFecha[0]), Number(arrayFecha[1]), Number(arrayFecha[2]), 0);
    return fecha;
  }

  loginGoogle(tokenDTO)
    :
    Observable<any> {
    return this.http.post(this.url + '/GetAccessUser', tokenDTO);
  }

  refreshToken(token: string) {
    return this.http.post(this.url + '/GetRefreshToken', {
      refreshToken: token
    }, httpOptions);
  }

  refreshTokenCookie(token: string): any {
    // let headers = new Headers();
    // headers=headers.append('content-type','application/json')
    // headers=headers.append('Access-Control-Allow-Origin', '*')
    const httpOption = {
      headers: new HttpHeaders({
        'Cookied':'refreshtoken='+token
      })
    };
    
    return this.http.post(this.url + '/GetRefreshToken',{},httpOptions)
  }

  refreshTokenAny(token: string): any {
    return this.http.post(this.url + '/GetRefreshToken', {
      refreshToken: token
    }, httpOptions);
  }

  logoutBackEnd() {
    try {
      return this.http.post(this.url + '/logout', {
        userName: this.userLogged.email
      }, httpOptions);
    } catch (e) {
      console.log("Error en logoutBakend, " + e);
      return of(null);
    }

  }

//metodo para eliminar caracteres especiales de una cariable string
  removeSpecialCharacters(cadena) {
    // Definimos los caracteres que queremos eliminar
    var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,";

    // Los eliminamos todos
    for (var i = 0; i < specialChars.length; i++) {
      cadena = cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
    }

    // Lo queremos devolver limpio en minusculas
    cadena = cadena.toLowerCase();

    // Quitamos espacios y los sustituimos por _ porque nos gusta mas asi
    cadena = cadena.replace(/ /g, "_");

    // Quitamos acentos y "ñ". Fijate en que va sin comillas el primer parametro
    cadena = cadena.replace(/á/gi, "a");
    cadena = cadena.replace(/é/gi, "e");
    cadena = cadena.replace(/í/gi, "i");
    cadena = cadena.replace(/ó/gi, "o");
    cadena = cadena.replace(/ú/gi, "u");
    cadena = cadena.replace(/ñ/gi, "n");
    return cadena;

  }

  getMenuByUsername() {
    this.menuService.findByUsername(this.userLogged.email).subscribe(
      data => {
        this.menus = data;
        for (let objMenu of this.menus) {
          let item: MenuItem;
          item = {
            label: objMenu.itemDTO.label,
            icon: objMenu.itemDTO.icon,
            url: objMenu.itemDTO.url,
            routerLink: objMenu.routerLink,
            items: objMenu.itemsDTO
          }
          this.items = new Array();
          this.items.push(item);
        }
      }
    );
    return this.items;
  }


  ageEvent(fechNan) {
    let age: number
    let fecNac: Date
    fecNac = fechNan;
    if (fechNan) {
      var timeDiff = Math.abs(Date.now() - fecNac.getTime())
      age = Math.ceil((timeDiff / (1000 * 3600 * 24)) / 365)
    }
    return age
  }


  /*
  async loginByAuth({email, password}) {
    try {
      const token = await Gatekeeper.loginByAuth(email, password);
      localStorage.setItem('token', token);
      await this.getProfile();
      this.router.navigate(['/']);
    } catch (error) {
      this.toastr.error(error.response.data.message);
    }
  }

  async registerByAuth({email, password}) {
    try {
      const token = await Gatekeeper.registerByAuth(email, password);
      localStorage.setItem('token', token);
      await this.getProfile();
      this.router.navigate(['/']);
    } catch (error) {
      this.toastr.error(error.response.data.message);
    }
  }


  async loginByGoogle() {
    try {
      const token = await Gatekeeper.loginByGoogle();
      localStorage.setItem('token', token);
      await this.getProfile();
      this.router.navigate(['/']);
    } catch (error) {
      this.toastr.error(error.response.data.message);
    }
  }

  async registerByGoogle() {
    try {
      const token = await Gatekeeper.registerByGoogle();
      localStorage.setItem('token', token);
      await this.getProfile();
      this.router.navigate(['/']);
    } catch (error) {
      this.toastr.error(error.response.data.message);
    }
  }

  async loginByFacebook() {
    try {
      const token = await Gatekeeper.loginByFacebook();
      localStorage.setItem('token', token);
      await this.getProfile();
      this.router.navigate(['/']);
    } catch (error) {
      this.toastr.error(error.response.data.message);
    }
  }

  async registerByFacebook() {
    try {
      const token = await Gatekeeper.registerByFacebook();
      localStorage.setItem('token', token);
      await this.getProfile();
      this.router.navigate(['/']);
    } catch (error) {
      this.toastr.error(error.response.data.message);
    }
  }

  */
  msgCreate() {
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Data Created'});
  }

  msgUpdate() {
    this.messageService.add({severity: 'warn', summary: 'Success', detail: 'Data Updated'});
  }

  msgDelete() {
    this.messageService.add({severity: 'error', summary: 'Delete', detail: 'Data Deleted'});
  }

  msgInfo() {
    this.messageService.add({severity: 'info', summary: 'Delete', detail: 'Data Deleted'});
  }

  msgInfoDetail(severity
                  :
                  string, header
                  :
                  string, content
                  :
                  string
  ) {
    this.messageService.add({severity: severity, summary: header, detail: content});
  }


  /*******
   * FUNCIONES PARA EXPORTAR EXCEL Y PDF
   * ********/
  exportPdf(columnas, list, nombre, orientacion) {
    const currentDate = new Date();
    const date = formatDate(currentDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    // const doc = new jsPDF();
    const doc = new jsPDF(orientacion, 'pt');
    doc['autoTable'](columnas, list);
    // doc.autoTable(this.exportColumns, this.products);
    //doc.save(tipoPlanEstudioDTO.name+".pdf");
    doc.save(nombre + "-" + date + ".pdf");
  }

  exportExcel(list, nombre) {
    import("xlsx").then(xlsx => {
      const currentDate = new Date();
      const date = formatDate(currentDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');
      const worksheet = xlsx.utils.json_to_sheet(list);
      const workbook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
      const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
      this.saveAsExcelFile(excelBuffer, nombre + "-" + date);
    });
  }

  saveAsExcelFile(buffer
                    :
                    any, fileName
                    :
                    string
  ):
    void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data
      :
      Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  /******
   * FIN FUNCIONES EXPORTAR EXCEL PDF
   * *************/

  subirArchivosAFirebase(file) {
    try {
      let task: any;
      if (file !== null) {
        let url = 'files/file-' + file.name;
        task = this.storage.upload(url, file);
      }
      this.msgInfoDetail('info', 'File ' + file.name, 'Archivo subido correctamente a Firebase');
    } catch (e) {
      this.msgInfoDetail('error', 'File Uploaded', 'No se pudo subir el Archivo');
    }

  }

  async

  getProfile() {
    try {
      this.userLogged = JSON.parse(this.tokenService.getSocialUser());
      if (this.userLogged === null && this.tokenService.getToken() === null) {
        this.logout();
      }

    } catch (error) {
      this.logout();
      throw error;
    }
  }

  expirationCounter(token) {
    try {
      let timeout = this.jwtHelper.getTokenExpirationDate(token).valueOf() - new Date().valueOf();
      timeout = timeout * 0.001;
      this.interval = setInterval(() => {
        timeout = timeout - 1;
        if (timeout <= 0) {
          clearInterval(this.interval);
          const tokenRef = this.tokenService.getRefreshToken();
          this.refreshTokenCookie(tokenRef).subscribe(
            data => {
              this.tokenService.setToken(data.accessToken);
              this.tokenService.saveRefreshToken(data.refreshToken);
              this.expirationCounter(data.accessToken);
            }, error => {
              // this.logout();
              this.alertaSesionExpirada();
            }
          );
        }
      }, 1000);
    } catch (e) {
      this.logout();
    }
  }

  alertaSesionExpirada() {
    Swal.fire({
      showClass: {
        popup: 'animated fadeInDown slow',
      },
      hideClass: {
        popup: 'animated fadeOutUp slow',
      },
      title: '',
      text: 'Su sesión ha expirado, por favor vuelva a ingresar',
      imageUrl: '../../../assets/img/sessionTimeout.gif',
      imageAlt: 'Sesión Expirada',
      confirmButtonText: 'Volver a Ingresar',
      showConfirmButton: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.logout();
      }
    });
  }

  async logout() {
    try {
      await this.authService.signOut().then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('gatekeeper_token');
        localStorage.removeItem('language');
        this.logoutBackEnd().subscribe(
          (data: any) => {
            console.log("LogoutBackend: " + JSON.stringify(data));
          }, error => {
            console.log("LogoutBackend: " + JSON.stringify(error));
          });

        clearInterval(this.interval);
        this.tokenService.setToken(null);
        this.tokenService.saveRefreshToken(null);
        this.tokenService.setSocialUser(null);

        this.userLogged = null;
        this.isLogged = false;
        this.tokenService.logOut();
        
        this._ngZone.run(()=> {
          this.router.navigate(['/login']).then(() => window.location.reload());
        // @ts-ignore
          google.accounts.id.disableAutoSelect();
        })
      }), error => {
        console.log("Logout: " + JSON.stringify(error));
      };
    } catch (e) {
      this._ngZone.run(() => {
        this.router.navigate(['/login']).then(()=> window.location.reload());
        // @ts-ignore
        google.accounts.id.disableAutoSelect();
      })
    }
  }
}
