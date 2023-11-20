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
        this.NotificationService.postUser(sub).subscribe(data => {

        });
        // Enviar la suscripción al servidor backend.
      })
        .catch(error => {
          console.error('Error al solicitar la suscripción a notificaciones push', error);
        });
    }

  }

  ngOnInit(): void {
    this.socketService.on('connection', (res: any) => {

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
    }, 1000);
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

  getReportUser() {
    this.loading = true;
    this.NotificationService.getReport().subscribe((data: any) => {
      this.notifications = data
      this.loading = false;
    });
    this.virtualnotifications = Array.from({ length: 10000 });
  }

  getTableData(event: LazyLoadEvent) {
    this.loading = true;
    const formattedStartDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd HH:mm:ss');
    const formattedEndDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd HH:mm:ss');
    setTimeout(() => {
      this.SharedDataService.getDataTable(event, formattedStartDate, formattedEndDate).subscribe((data) => {
        this.items = data.items;
        this.totalRecords = data.totalRecords;
        this.loading = false;
      }, (error) => {
        this.loading = false;
      });
    }, 2000);
  }

  filterByName() {
    if (this.filterValue) {
      this.dt.filterGlobal(this.filterValue, 'contains');
    } else {
      this.dt.filterGlobal(null, 'contains'); // Restablecer el filtro global
    }
  }

  onDateRangeChange() {
    if (this.startDate && this.endDate) {
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);
      this.refreshTable(startDate, endDate)
    }
  }

  loadDefaultData() {
    const startDate = this.calculateLastWeekStartDate();
    const endDate = new Date();
    this.refreshTable(startDate, endDate)
  }

  calculateLastWeekStartDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    const tomo =  tomorrow.setDate(tomorrow.getDate() + 3); // Suma un día
    const lastWeek = new Date(tomo);
    lastWeek.setDate(lastWeek.getDate() - 30); // Resta una semana
    return lastWeek;
  }

  setMapData() {
    const markerIcon = Leaflet.icon({
      iconUrl: '/assets/icons/marker.png',
      iconSize: [38, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
      shadowAnchor: [12, 41]
    });
    const filteredData = this.coordinates;
    for (let i = 0; i < filteredData.length; i++) {
      const data = filteredData[i];
      const marker = Leaflet.marker([data.lat, data.lon], { draggable: true, icon: markerIcon })

      marker.addTo(this.map).bindPopup(`<pre>${JSON.stringify(data.name, null, 2)}</pre>`);
      this.markers.push(marker);
    }
  }

  onMapReady(map: Leaflet.Map) {
    this.map = map;
  }

  refreshTable(startDate: Date, endDate: Date) {
    const lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 10,
    };
    this.startDate = startDate.toISOString();
    this.endDate = endDate.toISOString();
    this.getTableData(lazyLoadEvent);
  }

}
