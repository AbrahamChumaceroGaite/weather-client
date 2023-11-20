import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ShareDataService } from '../services/shared/shared.service';

interface LoginResponse {
  token: string;
  name: string;
  rol: string;
  idrol: string;
  iduser: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private baseUrl = environment.apiUrl; 
  titulo: string = '';
  icon: string = '';
  userPermissions: any;
  constructor(private http: HttpClient, private router: Router) { }

  login(body: any): Observable<any> {
    const url = `${this.baseUrl}/login/client/`;
  
    return this.http.post<LoginResponse>(url, body).pipe(
      tap(res => {
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('iduser', res.iduser);
        sessionStorage.setItem('name', res.name);
        this.router.navigate(['/home']);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('iduser');
    sessionStorage.removeItem('name'); 
    this.router.navigate(['/']);
  }

  getIdDevice(){

  }
  
  getIdUser(): any {
    const idUser = sessionStorage.getItem('iduser');
    return idUser !== null ? idUser : '';
  }

  getUsername(): string {
    const username = sessionStorage.getItem('name');
    return username !== null ? username : '';
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');
    return !!token; // Devuelve true si existe un token almacenado, de lo contrario, devuelve false
  }

  setTitle(title: string, icon: string): void {
    this.titulo = title;
    this.icon = icon
  }

  getTitle(): string {
    return this.titulo;
  }

  getIcon(): string{
    return this.icon;
  }
}
