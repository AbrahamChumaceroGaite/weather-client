import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  constructor(public dialogService: DialogService, private swUpdate: SwUpdate, private platformLocation: PlatformLocation) { }

  ngOnInit(): void {

  }

  installPWA(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('¿Desea instalar la aplicación?')) {
          window.location.reload();
        }
      });
    }
  }

  isPWAInstalled(): boolean {
    return true;
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

