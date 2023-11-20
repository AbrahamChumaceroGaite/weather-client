import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

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
    const url = `${this.baseUrl}/login/`;
  
    return this.http.post<LoginResponse>(url, body).pipe(
      tap(res => {
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('iduser', res.iduser);
        sessionStorage.setItem('name', res.name);
        sessionStorage.setItem('rol', res.rol);
        this.router.navigate(['/home']);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('iduser');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('rol'); // Agrega esta línea para eliminar el nombre de usuario
    this.router.navigate(['/']);
  }

  getUserPermissions() {
    const permisosString = sessionStorage.getItem('pageaccess');
    this.userPermissions = permisosString ? JSON.parse(permisosString) : null;
    // Verifica si permisosString es null y proporciona un valor predeterminado si es así
    return permisosString ? JSON.parse(permisosString) : null;
  }

  getIdUser(): any {
    const idUser = sessionStorage.getItem('iduser');
    return idUser !== null ? idUser : '';
  }

  getUsername(): string {
    const username = sessionStorage.getItem('name');
    return username !== null ? username : '';
  }

  getRol(): string {
    const rol = sessionStorage.getItem('rol');
    return rol !== null ? rol : '';
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
