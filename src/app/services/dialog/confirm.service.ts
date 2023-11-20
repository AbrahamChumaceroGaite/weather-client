import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root',
})
export class ConfirmService {
    message!: string;
    constructor() { }
    //Genericos
    public editDialog(item: any) {
        return new Promise((resolve, reject) => {
            Swal.fire({
                title: '¿Confirmar cambios para ' + item + '?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Confirmar',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    resolve('Confirmed');
                } else {
                    resolve('Not Confirmed');
                    Swal.fire(
                        'CANCELADO',
                        'No se realizaron cambios :)',
                        'error'
                    )
                }
            });
        });
    }

    public deleteDialog(item: any) {
        return new Promise((resolve, reject) => {
            Swal.fire({
                title: '¿Esta Seguro de Eliminarlo?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Confirmar',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    resolve('Confirmed');
                } else {
                    resolve('Not Confirmed');
                    Swal.fire(
                        'CANCELADO',
                        'No se realizaron cambios :)',
                        'error'
                    )
                }
            });
        });
    }

    public DialogloginFailed() {
        return new Promise((resolve, reject) => {
            Swal.fire({
                title: 'Su sesión ha caducado',
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ingresar de nuevo',
            }).then((result) => {
                if (result.value) {
                    resolve('Confirmed');
                }  else {
                    resolve('Not Confirmed');
                }
            });
        });
    }
}