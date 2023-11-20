import { ElementRef, Injectable } from '@angular/core';
import * as Leaflet from 'leaflet';
import "leaflet-control-geocoder";
import { LatLng } from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapServicio {
  private map!: Leaflet.Map;
  private markers: Leaflet.Marker[] = [];

  constructor() { }

  public inicializarMapa(elementRef: ElementRef): void {
    const options = {
      layers: [
        Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        })
      ],
      zoom: 16,
      center: { lat: -21.53324450860366, lng: -64.73158650262741 }
    };

    this.map = Leaflet.map(elementRef.nativeElement, options);
  }

  public agregarMarcador(lat: number, lng: number, draggable: boolean, popupContent: string): void {
    const markerIcon = Leaflet.icon({
      iconUrl: './assets/img/marker.svg',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
      shadowAnchor: [12, 41]
    });

    const marker = Leaflet.marker([lat, lng], { draggable: draggable, icon: markerIcon })
      .on('click', (event) => this.markerClicked(event))
      .on('dragend', (event) => this.markerDragEnd(event));

    marker.addTo(this.map).bindPopup(popupContent);
    this.markers.push(marker);
  }

  public limpiarMarcadores(): void {
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];
  }

  public moverCentroMapa(lat: number, lng: number): void {
    const center = new LatLng(lat, lng);
    this.map.panTo(center);
  }

  private markerClicked(event: any): void {
    const markerIndex = this.markers.indexOf(event.target);
    const markerData = this.markers[markerIndex].getPopup()?.getContent();
  }

  private markerDragEnd(event: any): void {

  }
}
