import { FormControl, ValidationErrors } from '@angular/forms';

export class validarDNI {
    // 
    // configurar el metodo subcribe para votar que la cedula ya existente
    // 
    // 

    //****/
    // VALIDADOR DE CEDULA ECUATORIANA
    //****/
    static validarDni(control: FormControl): ValidationErrors {
        //capturamos la propiedad de dniEmp
        var DNI = control.value

        // Validamos si no esta vacion el registro del DNI
        if (DNI !== null) {

            //Verificamos si tenemos 10 digitos
            if (DNI.length === 10) {
                //Se obtiene el digito de la region que son los dos primeros digitos
                var regionDigito = DNI.substring(0, 2)

                if (regionDigito >= 1 && regionDigito <= 24) {
                    //Extraemos el ultimo digito
                    var ultimoDigito = DNI.substring(9, 10);

                    //Agrupacion de pares y suma
                    var pares = parseInt(DNI.substring(1, 2))
                        + parseInt(DNI.substring(3, 4))
                        + parseInt(DNI.substring(5, 6))
                        + parseInt(DNI.substring(7, 8));

                    //Agrupo los impares, los multiplico por un factor de 2, si la resultante es > que 9 
                    //le restamos el 9 a la resultante
                    var num1 = DNI.substring(0, 1);
                    num1 = (num1 * 2);
                    if (num1 > 9) { num1 = (num1 - 9) }

                    var num3 = DNI.substring(2, 3);
                    num3 = (num3 * 2)
                    if (num3 > 9) { num3 = (num3 - 9) };

                    var num5 = DNI.substring(4, 5);
                    num5 = (num5 * 2)
                    if (num5 > 9) { num5 = (num5 - 9) }

                    var num7 = DNI.substring(6, 7);
                    num7 = (num7 * 2)
                    if (num7 > 9) { num7 = (num7 - 9) }

                    var num9 = DNI.substring(8, 9);
                    num9 = (num9 * 2)
                    if (num9 > 9) { num9 = (num9 - 9) }

                    var impares = num1 + num3 + num5 + num7 + num9

                    //suma total de pares e impares
                    var sumaTotal = (pares + impares);

                    //se extrae el primer digito
                    var primer_digito_suma = String(sumaTotal).substring(0, 1);

                    //se obtiene del decena inmediata
                    var decena = (parseInt(primer_digito_suma) + 1) * 10;

                    //obtenemos la resta de la decena inmediata - la suma total 
                    //obteniendo el digito validador
                    var digitoValidador = decena - sumaTotal;


                    if (digitoValidador == 10)
                        var digitoValidador = 0;

                    //Se valida si el digito validador es igual al ultimo digito de la cedula
                    if (digitoValidador == ultimoDigito) {
                        //si no hay error existente regresa un false
                        return null;
                    } else {
                        // 'DNI Incorrecto')
                        return { cedula: true };
                    }
                } else {
                    // 'El DNI no pertenece a ninguna region')
                    return { cedula: true };

                }
            } else {
                // 'El DNI no tiene 10 digitos')
                return { cedula: true };

            }
        } else {
            return { cedula: true}
        }
    }
}