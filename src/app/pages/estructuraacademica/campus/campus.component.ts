import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {InstitucionEducativaDto} from "@/dto/InstitucionEducativaDto";
import {FileUpload} from "primeng/fileupload";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {CategoriaDto} from "@/dto/CategoriaDto";
import {TipoInstitucionEducativaDto} from "@/dto/TipoInstitucionEducativaDto";
import {environment} from "../../../../environments/environment";
import {AppService} from "@services/app.service";
import {InstitucionEducativaService} from "@services/institucioneducativa/institucioneducativa.service";
import {CategoriaService} from "@services/institucioneducativa/categoria.service";
import {FileService} from "@services/utils/file.service";
import {TipoInstitucionEducativaService} from "@services/institucioneducativa/tipoinstitucioneducativa.service";
import {CampusDto} from "@/dto/CampusDto";
import {SedeInstitucionDto} from "@/dto/SedeInstitucionDto";
import {ParroquiaDto} from "@/dto/ParroquiaDto";
import {PaisDto} from "@/dto/PaisDto";
import {RegionDto} from "@/dto/RegionDto";
import {ProvinciaDto} from "@/dto/ProvinciaDto";
import {CantonDto} from "@/dto/CantonDto";
import {PaisService} from "@services/segmentacion/pais.service";
import {RegionService} from "@services/segmentacion/region.service";
import {ProvinciaService} from "@services/segmentacion/provincia.service";
import {CantonService} from "@services/segmentacion/canton.service";
import {CiudadService} from "@services/segmentacion/ciudad.service";
import {ParroquiaService} from "@services/segmentacion/parroquia.service";
import {CampusService} from "@services/institucioneducativa/campus.service";
import {SedeService} from "@services/institucioneducativa/sede.service";
import {CiudadDto} from "@/dto/CiudadDto";
import {MallaDto} from "@/dto/MallaDto";
import {ModalidadMallaDto} from "@/dto/ModalidadMallaDto";
import {NivelEstudioDto} from "@/dto/NivelEstudioDto";
import {CarreraDto} from "@/dto/CarreraDto";

@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.scss']
})
export class CampusComponent implements OnInit {


  /***
   * variables globales, @Input para enlaces de componentes
   * */
  @Input() campus: CampusDto;

  form: FormGroup;
  proceso: string = 'academia';

  pais: any;
  region: any;
  provincia: any;
  canton: any;
  ciudad: any;
  parroquia: any;
  sede: any;

  lstPais: PaisDto[];
  lstRegion: RegionDto[];
  lstProvincia: ProvinciaDto[];
  lstCanton: CantonDto[];
  lstCampus: CampusDto[];
  lstParroquia: ParroquiaDto[];
  lstCiudad: CiudadDto[];
  lstSede: SedeInstitucionDto[];

  enedicion: boolean;

  /***
   * Constructor: se agregar los servicios ncesarios
   * **/
  constructor(public appService: AppService,
              public sedeService: SedeService,
              public campusService: CampusService,
              public paisService: PaisService,
              public regionService: RegionService,
              public provinciaService: ProvinciaService,
              public cantonService: CantonService,
              public ciudadService: CiudadService,
              public parroquiaService: ParroquiaService,
              public formBuilder: FormBuilder) {
  }

  /***
   * Constructir para inicializar antes del renderizado de la pagina
   * **/
  ngOnInit() {
    this.campus = new CampusDto();
    this.crearForm();
    // this.llenarCampus();
    this.llenarCombos(0);
  }

  /***
   * Metodos vinculados a componente principal
   * **/
  async llenarCombos(opcion) {
    await this.campusService.getAll().subscribe(
      data => {
        this.lstCampus = data;
      }
    );
    await this.sedeService.getAll().subscribe(
      data => {
        this.lstSede = data;
      }
    );
    await this.paisService.getAll().subscribe(
      data => {
        this.lstPais = data;
      }
    );

    if(opcion === 1){

      await this.regionService.getAll().subscribe(
        data => {
          this.lstRegion = data;
        }
      );
      await this.provinciaService.getAll().subscribe(
        data => {
          this.lstProvincia = data;
        }
      );
      await this.cantonService.getAll().subscribe(
        data => {
          this.lstCanton = data;
        }
      );
      await this.ciudadService.getAll().subscribe(
        data => {
          this.lstCiudad = data;
        }
      );
      await this.parroquiaService.getAllDisponibles().subscribe(
        data => {
          this.lstParroquia = data;
        }
      );
    }
  }

  llenarCombosEdicion(item){
    //bloque try and catch
    try {
      let idParroquia = this.campus.idParroquiaDTO.idParroquia;
      this.ciudadService.getByIdParroquia(idParroquia).subscribe(
        data => {
          this.lstCiudad = data;
          this.ciudad = this.lstCiudad[0];
          this.cantonService.getByIdCiudad(this.lstCiudad[0].idCiudad).subscribe(
            data => {
              this.lstCanton = data;
              this.canton = this.lstCanton[0];
              this.provinciaService.getByIdCanton(this.lstCanton[0].idCanton).subscribe(
                data => {
                  this.lstProvincia = data;
                  this.provincia = this.lstProvincia[0];
                  this.regionService.getByIdProvincia(this.lstProvincia[0].idProvincia).subscribe(
                    data => {
                      this.lstRegion = data;
                      this.region = this.lstRegion[0];
                      this.paisService.getByIdRegion(this.lstRegion[0].idRegion).subscribe(
                        data => {
                          this.lstPais = data;
                          this.pais = this.lstPais[0];
                          this.llenarCombos(1);

                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  async setSeleccionado(item) {
    if (item !== null) {
      this.campus = item;
      this.form = this.formBuilder.group(this.campus);

      await this.parroquiaService.getAllDisponibles().subscribe(
        data => {
          this.lstParroquia = data;
          this.form.controls.idParroquiaDTO.setValue(this.lstParroquia
            .find(parroquia => parroquia.idParroquia === this.campus.idParroquiaDTO.idParroquia));
        }
      );

      this.form.controls.idSedeInstitucionDTO.setValue(this.lstSede
        .find(sede => sede.idSedeInstitucion === this.campus.idSedeInstitucionDTO.idSedeInstitucion));

      await this.sedeService.getById(this.campus.idSedeInstitucionDTO.idSedeInstitucion).subscribe(
        data => {
          this.sede = data;
        }
      );
      await this.parroquiaService.getById(this.campus.idParroquiaDTO.idParroquia).subscribe(
        data => {
          console.log(data)
          this.parroquia = data;
        }
      );

      this.llenarCombosEdicion(item);

      this.enedicion = true;
    } else {
      this.setearForm();
    }
  }

  llenarCampus() {
    this.campusService.getAll().subscribe(
      data => {
        this.lstCampus = data;
      }
    );
  }

  llenarDetallePais(event) {
    try {
      console.log('IDPAIS' + this.pais.idPais);
      this.regionService.getByIdPais(this.pais.idPais).subscribe(data => {
        this.lstRegion = data;
        this.lstProvincia = new Array();
        this.lstCanton = new Array();
        this.lstCiudad = new Array();
        this.lstParroquia = new Array();
        this.region = null;
        this.provincia = null;
        this.canton = null;
        this.ciudad = null;
        this.parroquia = null;
        this.form.controls.idParroquiaDTO.setValue(null);
      });
    } catch (e) {
      console.log('ERROR PAIS' + e);
      this.lstRegion = new Array();
      this.lstProvincia = new Array();
      this.lstCanton = new Array();
      this.lstCiudad = new Array();
      this.lstParroquia = new Array();
      this.pais = null;
      this.region = null;
      this.provincia = null;
      this.canton = null;
      this.ciudad = null;
      this.parroquia = null;
      this.form.controls.idParroquiaDTO.setValue(null);
    }
  }


  llenarDetalleRegion(event) {
    try {
      this.provinciaService.getByIdRegion(this.region.idRegion).subscribe(data => {
        this.lstProvincia = data;

        this.lstCanton = new Array();
        this.lstCiudad = new Array();
        this.lstParroquia = new Array();
        this.provincia = null;
        this.canton = null;
        this.ciudad = null;
        this.parroquia = null;
        this.form.controls.idParroquiaDTO.setValue(null);
      });
    } catch (e) {
      this.lstProvincia = new Array();
      this.lstCanton = new Array();
      this.lstCiudad = new Array();
      this.lstParroquia = new Array();
      this.region = null;
      this.provincia = null;
      this.canton = null;
      this.ciudad = null;
      this.parroquia = null;
      this.form.controls.idParroquiaDTO.setValue(null);
    }
  }

  llenarDetalleProvincia(event) {
    try {
      this.cantonService.getByIdProvincia(this.provincia.idProvincia).subscribe(data => {
        this.lstCanton = data;
        this.lstCiudad = new Array();
        this.lstParroquia = new Array();

        this.canton = null;
        this.ciudad = null;
        this.parroquia = null;
        this.form.controls.idParroquiaDTO.setValue(null);
      });
    } catch (e) {
      this.lstCanton = new Array();
      this.lstCiudad = new Array();
      this.lstParroquia = new Array();
      this.provincia = null;
      this.canton = null;
      this.ciudad = null;
      this.parroquia = null;
      this.form.controls.idParroquiaDTO.setValue(null);
    }
  }

  llenarDetalleCanton(event) {
    try {
      this.ciudadService.getByIdCanton(this.canton.idCanton).subscribe(data => {
        this.lstCiudad = data;
        this.lstParroquia = new Array();

        this.ciudad = null;
        this.parroquia = null;
        this.form.controls.idParroquiaDTO.setValue(null);
      });
    } catch (e) {
      this.lstCiudad = new Array();
      this.lstParroquia = new Array();
      this.canton = null;
      this.ciudad = null;
      this.parroquia = null;
      this.form.controls.idParroquiaDTO.setValue(null);
    }
  }

  llenarDetalleCiudad(event) {
    try {
      this.parroquiaService.getAllDisponiblesByIDCiudad(this.ciudad.idCiudad).subscribe(data => {
        this.lstParroquia = data;
        this.parroquia = null;
        this.form.controls.idParroquiaDTO.setValue(null);
      });
    } catch (e) {
      this.lstParroquia = new Array();
      this.ciudad = null;
      this.parroquia = null;
      this.form.controls.idParroquiaDTO.setValue(null);
    }
  }

  //Inicializa el formulario para el ingreso de la pagina y datos
  crearForm() {
    this.form = new FormGroup({
      idCampus: new FormControl('',),
      codigoCampus: new FormControl('',),
      nombreCampus: new FormControl('',),
      callePrincipalCampus: new FormControl('',),
      calleSecundariaCampus: new FormControl('',),
      numeroCampus: new FormControl('',),
      referenciaCampus: new FormControl('',),
      codPostalCampus: new FormControl('',),
      telefonoCampus: new FormControl('',),
      faxCampus: new FormControl('',),
      emailCampus: new FormControl('',),
      activoCampus: new FormControl('',),
      //infraestructuraListDTO: new FormControl('',),
      //facultadListDTO: new FormControl('',),
      //permisosListDTO: new FormControl('',),
      idParroquiaDTO: new FormControl(null,),
      idSedeInstitucionDTO: new FormControl(null,)
    });

  }

  /**
   * Métodos para funcionalidad de la pagina
   * **/
  guardar() {
    if (this.form.invalid) {
      this.appService.msgInfoDetail('warn', 'Verificacion', 'Verificar los Datos a Ingresar')
      return
    } else {
      this.campus = this.form.value;
      this.parroquiaService.getById(this.campus.idParroquiaDTO.idParroquia).subscribe(
        data => {
          this.parroquia = data;
          this.campus.idParroquiaDTO = this.parroquia;
        }
      );
      this.sedeService.getById(this.campus.idSedeInstitucionDTO.idSedeInstitucion).subscribe(
        data => {
          this.sede = data;
          this.campus.idSedeInstitucionDTO = this.sede;
        }
      );

      this.campusService.saveObject(this.campus).subscribe((data: any) => {
        if (!this.campus.idCampus) {
          this.appService.msgCreate();
        } else {
          this.appService.msgUpdate();
        }
        this.setearForm();
      });
    }
  }

  setearForm() {
    this.form.reset();
    this.campus = new CampusDto();
    this.sede = null;

    this.lstRegion = new Array();
    this.lstProvincia = new Array();
    this.lstCanton = new Array();
    this.lstCiudad = new Array();
    this.lstParroquia = new Array();
    this.pais = null;
    this.region = null;
    this.provincia = null;
    this.canton = null;
    this.ciudad = null;
    this.parroquia = null;
    this.llenarCombos(0);
    this.llenarCampus();

  }

  cancelar() {
    this.setearForm();
    this.appService.msgInfoDetail('info', '', 'Acción Cancelada')

  }
}
