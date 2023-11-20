import { Injectable } from '@angular/core';
import { BehaviorSubject,Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Person } from 'src/app/models/person';
import { Location } from 'src/app/models/demography';
import { Client } from 'src/app/models/client';
import { Rol } from 'src/app/models/rol';
import { LazyLoadEvent } from 'primeng/api';
import { Device } from 'src/app/models/device';

@Injectable()
export class ShareDataService {

  apiPerson: string = environment.apiUrl + "/person";
  apiLocation: string = environment.apiUrl + "/location";
  apiClient: string = environment.apiUrl + "/client";
  apiRol: string = environment.apiUrl + "/rol";
  apiDevice: string = environment.apiUrl + "/device";
  

  constructor(private httpClient: HttpClient) {
  }

  private selectedValueSubject = new BehaviorSubject<any>(null);
  selectedValue$ = this.selectedValueSubject.asObservable();

  setSelectedValue(value: any) {
    this.selectedValueSubject.next(value);
  }

  getPersonList(): Observable<Person[]> {
    return this.httpClient.get<Person[]>(this.apiPerson + '/get');
  }
  
  getLocationList(): Observable<Location[]> {
    return this.httpClient.get<Location[]>(this.apiLocation + '/get');
  }

  getClientList(): Observable<Client[]> {
    return this.httpClient.get<Client[]>(this.apiClient + '/get');
  }

  getRolList(): Observable<Rol[]> {
    return this.httpClient.get<Rol[]>(this.apiRol + '/get');
  }

  getDataTable(event: LazyLoadEvent, startDate: string | null, endDate: string | null): Observable<{ items: Device[]; totalRecords: number }> {
    const params: any = {
      first: event.first, // Índice del primer elemento a cargar
      rows: event.rows, // Cantidad de elementos a cargar por página
      startDate: startDate || '', // Utiliza un valor predeterminado si startDate es nulo
      endDate: endDate || '' // Utiliza un valor predeterminado si endDate es nulo
    };
  
    // Agregar los parámetros para la búsqueda global y el ordenamiento
    if (event.globalFilter) {
      params.globalFilter = event.globalFilter;
    }
  
    if (event.sortField) {
      params.sortField = event.sortField;
    }
  
    if (event.sortOrder) {
      params.sortOrder = event.sortOrder;
    }
  
    return this.httpClient.get<{ items: Device[]; totalRecords: number }>(this.apiDevice + '/getLazy', {
      params
    });
  }

}
