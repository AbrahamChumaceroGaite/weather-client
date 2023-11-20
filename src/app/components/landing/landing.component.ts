import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SwUpdate } from '@angular/service-worker';
import { LoginComponent } from '../login/login.component';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { owl_landing_page } from 'src/app/utils/owl-config';
import { header_info, boxes, services, maps, images, coordinates } from 'src/app/templates/home-data';
import * as Leaflet from 'leaflet';
import "leaflet-control-geocoder";


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  @ViewChild('map', { static: true }) mapElement!: ElementRef;
  images = images;
  header_info = header_info;
  services = services;
  boxes = boxes;
  displayLoginModal: boolean = false;

  ref: DynamicDialogRef | undefined;

  public promptEvent : any;

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e:any) {
    e.preventDefault();
    this.promptEvent = e;
  }

  constructor(public dialogService: DialogService, private swUpdate: SwUpdate, private platformLocation: PlatformLocation) { }

  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        const refresh = window.confirm('Hay una nueva versión disponible. ¿Desea actualizar la aplicación?');
        if (refresh) {
          window.location.reload();
        }
      });
    }
  }

  public installPWA() {
    this.promptEvent.prompt();
  }
  
  public shouldInstall(): boolean {
    return !this.isRunningStandalone() && this.promptEvent;
  }
  
  public isRunningStandalone(): boolean {
    return (window.matchMedia('(display-mode: standalone)').matches);
  }


  showLoginModal(): void {
    this.ref = this.dialogService.open(LoginComponent, {
      header: 'Iniciar sesión',
      styleClass: 'login-modal',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });

    this.ref.onClose.subscribe();

    this.ref.onMaximize.subscribe();
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }


}

