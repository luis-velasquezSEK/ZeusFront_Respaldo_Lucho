import { FormControl, ValidationErrors } from "@angular/forms";

export class CedulaValidator {
  static validarCedula(control: FormControl): ValidationErrors {
    if (control.value.length >= 10)
      return null;
    else
      return { cedula: true }
  }
}
