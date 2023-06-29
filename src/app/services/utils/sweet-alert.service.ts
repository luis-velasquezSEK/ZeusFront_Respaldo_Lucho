import {Injectable} from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {
  constructor() {
  }

  panelWait:Swal;

  simpleAlert(){
    this.panelWait = Swal.fire({
      title: 'Espere por favor',
      text: 'Estamos procesando su solicitud',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });
  }

  sesionTimeout(){
    Swal.fire({
      showClass: {
        popup: 'animated fadeInDown slow',
      },
      hideClass: {
        popup: 'animated fadeOutUp slow',
      },
      title: '',
      text: 'Su sesión ha expirado, por favor vuelva a ingresar',
      imageUrl: '../../../assets/img/session_timeout.png',
      imageWidth: 200,
      imageHeight: 200,
      imageAlt: 'Sesión Expirada',
      confirmButtonText: 'Volver a Ingresar',
      showConfirmButton: true,
    })
  }

  alertWithSuccess(){
    Swal.fire('Thank you...', 'You submitted succesfully!', 'success')
  }
  erroalert()
  {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
      footer: '<a href>Why do I have this issue?</a>'
    })
  }
  topend()
  {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Your work has been saved',
      showConfirmButton: false,
      timer: 1500
    })
  }
  confirmBox(){
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      console.log(result);
      if (result.value) {
        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
  }

  imageBox(title, text, urlImage) {
    this.panelWait = Swal.fire({
      title: title,
      text: text,
      imageUrl: urlImage,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Enviando...',
      showConfirmButton: true,
    })
  }

  animatedBox(){
    Swal.fire({
      title: 'Custom width, padding, color, background.',
      width: 600,
      padding: '3em',
      color: '#716add',
      background: '#fff url(https://e1.pngegg.com/pngimages/461/900/png-clipart-green-leaf-trees.png)',
      backdrop: `
    rgba(0,0,123,0.4)
    url("./assets/img/nyan-cat.gif")
    left top
    no-repeat
  `
    })
  }

  timerBox(){
    let timerInterval
    Swal.fire({
      title: 'Auto close alert!',
      html: 'I will close in <b></b> milliseconds.',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft()
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
      }
    })
  }



}
