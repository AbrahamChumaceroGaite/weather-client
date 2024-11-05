import { AuthService } from '../../auth/auth.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { SocketMasterService } from 'src/app/services/miscellaneous/socket.service';
import { NotificationService } from '../../services/notification/notification.service';
import { environment } from 'src/environments/environment';
import { ChartService } from 'src/app/services/miscellaneous/charts-service.service';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Device } from 'src/app/models/device';
import { ShareDataService } from 'src/app/services/shared/shared.service';

import * as Leaflet from 'leaflet';
import "leaflet-control-geocoder";
import { LatLng } from 'leaflet';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('users') users!: ElementRef;
  @ViewChild('locations') locations!: ElementRef;
  @ViewChild('reports') reports!: ElementRef;
  @ViewChild('dt') dt!: Table;
  @ViewChild('map', { static: true }) mapElement!: ElementRef;
  items: Device[] = [];
  filterValue: string = '';
  totalRecords = 0;
  startDate!: string | null;
  endDate: string = '';
  loading: boolean = true;
  notifications: any[] = []
  virtualnotifications: any[] = []
  coordinates: any;


  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 16,
    center: { lat: -21.53324450860366, lng: -64.73158650262741 }
  };

  constructor(
    private AuthService: AuthService,
    private datePipe: DatePipe,
    private SharedDataService: ShareDataService,
    private ChartService: ChartService,
    private socketService: SocketMasterService,
    private swPush: SwPush,
    private NotificationService: NotificationService) {
    if (this.swPush.isEnabled) {
      this.swPush.requestSubscription({
        serverPublicKey: environment.VAPID_PUBLIC_KEY, // Debes generar una clave pública y privada para tus notificaciones.
      }).then(sub => {
        this.NotificationService.postClient(sub).subscribe(data => {

        });
      })
        .catch(error => {
          console.error('Error al solicitar la suscripción a notificaciones push', error);
        });
    }

  }

  ngOnInit(): void {
    /*     this.socketService.on('connection', (res: any) => {
    
        });
        this.NotificationService.getNotifications()
        this.socketService.on('disconnect', () => {
    
        });
        this.getReportUser()
        this.loadDefaultData()
    
        this.socketService.on('notification', (res: any) => {
          this.getReportUser();
        });
        this.socketService.on('devicedata', (res: any) => {
          this.loadDefaultData();
        });
        setTimeout((a: any) => {
          this.setMapData();
          window.dispatchEvent(new Event('resize'));
        }, 1000); */
  }

  ngAfterViewInit() {
    this.NotificationService.getDashboard().subscribe((data: any) => {

      this.coordinates = data.totalLocations
      const dataDeviceGraph = [
        { name: 'Activas', value: data.totalDeviceON },
        { name: 'Inactivas', value: data.totalDeviceOFF },
      ]

      const dataClientUser = [
        { name: 'Usuarios', value: data.totalUsers },
        { name: 'Clientes', value: data.totalClients },
        { name: 'Personas', value: data.totalPersons },
      ]

      const dataClientLocations = [
        { name: 'Locaciones', value: data.totalLocations },
      ]

      this.loading = false
      this.ChartService.createPieChart(this.reports.nativeElement, dataDeviceGraph);
      this.ChartService.createPieChart(this.users.nativeElement, dataClientUser);
    })
  }


}
