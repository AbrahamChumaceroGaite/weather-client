import { Injectable } from '@angular/core';
import { BehaviorSubject,Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Person } from 'src/app/models/person';
import { Location } from 'src/app/models/demography';
import { Client } from 'src/app/models/client';
import { LazyLoadEvent } from 'primeng/api';
import { Device, DeviceID } from 'src/app/models/device';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class ShareDataService {

  apiPerson: string = environment.apiUrl + "/person";
  apiLocation: string = environment.apiUrl + "/location";
  apiClient: string = environment.apiUrl + "/client";
  apiRol: string = environment.apiUrl + "/rol";
  apiDevice: string = environment.apiUrl + "/device";
  

  constructor(private httpClient: HttpClient, private AuthService: AuthService) {
  }

  private selectedDeviceSubject = new BehaviorSubject<any>(null);
  selectedDevice$ = this.selectedDeviceSubject.asObservable();

  setSelectedValue(value: any) {
    this.selectedDeviceSubject.next(value);
  }


  getDataLast(id: number): Observable<Device[]> {
    const params: any = {
      idevice: id
    };
    return this.httpClient.get<Device[]>(this.apiDevice + '/get/list/last', { params });
  }

  getData(id: number, startDate: string | null, endDate: string | null): Observable<Device[]> {
    const params: any = {
      idevice: id,
      startDate: startDate || '', // Utiliza un valor predeterminado si startDate es nulo
      endDate: endDate || '' // Utiliza un valor predeterminado si endDate es nulo
    };
    return this.httpClient.get<Device[]>(this.apiDevice + '/get/list/data', { params });
  }
  

  getIdentityList(): Observable<DeviceID[]> {
    const params: any = {
      id: this.AuthService.getIdUser()
    }
    return this.httpClient.get<DeviceID[]>(this.apiDevice + '/get/identity/ByClient/', {params});
  }
  


}
