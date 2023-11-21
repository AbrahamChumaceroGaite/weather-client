import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    apiUrl: string = environment.apiUrl + "/notification";
    constructor(private httpClient: HttpClient) {

    }

    getReport() {
        const params: any = {
            id: sessionStorage.getItem('iduser'),

        };
        return this.httpClient.get(this.apiUrl + '/get/report/user', { params });
    }

    getNotifications() {
        const params: any = {
            id: sessionStorage.getItem('iduser'),
        };
        return this.httpClient.get(this.apiUrl + '/get/notifitacions/user', { params });
    }

    readNotification(id: number) {
        const body = ''
        return this.httpClient.put(this.apiUrl + '/update/notificactions/user/' + id, body).pipe(
            map((response: any) => response.mensaje)
        );
    }

    getDashboard() {
        return this.httpClient.get(this.apiUrl + '/main/admin/dashboard/users');
    }

    postClient(data: any) {
        const body: any = {
            body: data,
            id: sessionStorage.getItem('iduser'),
        }
        return this.httpClient.post(this.apiUrl + '/register/subscription/client', body).pipe(
            map((response: any) => response.mensaje)
        );
    }

    delete(id: number) {
        return this.httpClient.delete(this.apiUrl + '/delete/' + id);
    }

}
