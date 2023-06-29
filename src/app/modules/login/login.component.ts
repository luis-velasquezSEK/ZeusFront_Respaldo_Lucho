import {
  Component,
  OnInit,
  OnDestroy,
  Renderer2,
  HostBinding,
  NgZone
} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AppService} from '@services/app.service';
import {
  GoogleLoginProvider,
  SocialAuthService,
   SocialUser} from "angularx-social-login";
//import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import {TokenDto} from "@/dto/token-dto";
import {Router} from "@angular/router";
import {TokenService} from '../../services/token.service'
import {JwtHelperService} from "@auth0/angular-jwt";
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
// import { NgOneTapService } from 'ng-google-one-tap';
import { HttpHeaders } from '@angular/common/http';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { UserNameDto } from '@/dto/UserNameDto';
import {CookieService} from 'ngx-cookie-service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'login-box';
  public loginForm: FormGroup;
  public isAuthLoading = false;
  public isGoogleLoading = false;
  public isFacebookLoading = false;

  socialUser: SocialUser;
  isLogged: boolean;

  constructor(
    private cookieService: CookieService,
    private renderer: Renderer2,
    private toastr: ToastrService,
    private appService: AppService,
    private authService: SocialAuthService,
    private router: Router,
    private tokenService: TokenService,
    private _ngZone: NgZone
  ) {
  }

  ngOnInit(): void{
    /*this.renderer.addClass(
      document.querySelector('app-root'),
      'login-page'
    );*/
    this.loginForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
    this.signInWithGoogleOneTap2()
  }

  async loginByAuth() {
    if (this.loginForm.valid) {
      this.isAuthLoading = true;
     // await this.appService.loginByAuth(this.loginForm.value);
      this.isAuthLoading = false;
    } else {
      this.toastr.error('Form is not valid!');
    }
  }

  async loginByGoogle() {
    this.isGoogleLoading = true;
   // await this.appService.loginByGoogle();
    this.isGoogleLoading = false;
  }

    /**
   * Metodo de Login mediante el uso de la Libreria de OneTap de Google
   */
  async signInWithGoogleOneTap2() {
    try {
      // console.log('New Google')
      window.onload = () => {
        // @ts-ignore
        google.accounts.id.initialize({
          client_id: '18826009579-jokv1saggluh788q0qgf6bh6h0ij77jm.apps.googleusercontent.com',
          callback: this.handleCredentialResponse.bind(this)
        });
        // @ts-ignore
        google.accounts.id.renderButton(
          document.getElementById('buttonDiv'),
          {theme: "outline", size: "large"}
        );
        // @ts-ignore
        google.accounts.id.prompt();
      }
    } catch (e) {
      console.log(e)
    }
  }

  async handleCredentialResponse(response) {
    // console.log(response);
    const tokenGoogle = new UserNameDto(response.credential);
   // console.log('CEDENCIALES::: ' + JSON.stringify(tokenGoogle));
    await this.appService.loginGoogle(tokenGoogle).subscribe(
      data => {

        console.log(data)
        this.appService.userLogged = data.fotoUsuario;

        
        this.tokenService.setSocialUser(JSON.stringify(data));
        this.tokenService.setToken(data.seguridad.key);
        this.tokenService.saveRefreshToken(data.seguridad.key);
        this.cookieService.set('refreshtoken',data.seguridad.key );

        //this.appService.expirationCounter(data.seguridad.key);

        this._ngZone.run(() => {
          this.isLogged = true;
          this.isGoogleLoading = false;
          this.router.navigate(['/'])
        })
        }, err => {
          console.log(err);
        }
      )
    }
  
  /**
   * Metodo de Login mediante el uso de la Libreria de Angularx Social Login
   * Metodo Obsoleto
   */
  signInWithGoogle(): void {
    this.isGoogleLoading = true;
    const headers = new HttpHeaders();
    headers.append('Acces-Control-Allow-Origin', '*');
    headers.append('Acces-Control-Allow-Methods', 'GET,POST,HEAD,OPTIONS,DELETE');
    headers.append('Acces-Control-Allow-Headers', 'Origin, Accept, X-Request-Whit, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization');

    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID, headers).then(
      data => {
        this.socialUser = data;
        //console.log('SOCIAL_USER:: ', this.socialUser)
        const tokenGoogle = new TokenDto(this.socialUser.idToken);
        this.appService.loginGoogle(tokenGoogle).subscribe(
          res => {
            //console.log('RES::', res)
            this.appService.userLogged = this.socialUser;
            this.tokenService.setSocialUser(JSON.stringify(this.socialUser));
            this.tokenService.setToken(res.token);
            this.tokenService.saveRefreshToken(res.refreshToken);

            this.appService.expirationCounter(res.accessToken);

            this.isLogged = true;
            this.isGoogleLoading = false;
            this.router.navigate(['/']);
          },
          err => {
            console.log(err);
            this.logOut();
          }
        );
      }
    ).catch(
      err => {
        console.log(err);
      }
    );
  }
  
  /**
   * Metodo de Login mediante el uso del metodo de Firebase
   */
  async signInWithGoogleFirebase() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth()
    await signInWithPopup(auth, provider)
      .then((result) =>  {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        //const token = credential.idToken;
        //const user = result.user;
        console.log('CREDENTIAL:: ', credential)
        const tokenGoogle = new TokenDto(credential.idToken);
        console.log('TOKEN:: ', tokenGoogle)

        this.appService.loginGoogle(tokenGoogle).subscribe(
          res => {
            console.log('DATA TOKEN:: ',res)
            this.appService.userLogged = res;
            this.tokenService.setSocialUser(JSON.stringify(res));
            this.tokenService.setToken(res.accessToken);
            this.tokenService.saveRefreshToken(res.refreshToken);

            this.appService.expirationCounter(res.accessToken);

            this.isLogged = true;
            this.isGoogleLoading = false;
            this.router.navigate(['/'])
          }, err => {
            console.log('ERR:: ', err);
            this.logOut()
          }
        )
      }).catch((e) => {
        const errorCode = e.code;
        const errorMessage = e.message;
        const email = e.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(e)
        console.log('CODIGO:: ', errorCode)
        console.log('MESAGGE:: ', errorMessage)
        console.log('EMAIL:: ', email)
        console.log('CREDENTIAL::', credential)
      })
  }

  logOut(): void {
    this.appService.logout().then(
      data => {
        this.isGoogleLoading = false;
        this.isLogged = false;
      }
    );
  }

  async loginByFacebook() {
    this.isFacebookLoading = true;
   // await this.appService.loginByFacebook();
    this.isFacebookLoading = false;
  }

  ngOnDestroy() {
    this.renderer.removeClass(
      document.querySelector('app-root'),
      'login-page'
    );
  }
}
