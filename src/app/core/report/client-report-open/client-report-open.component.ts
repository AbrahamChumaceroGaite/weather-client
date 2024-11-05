import { ShareDataService } from 'src/app/services/shared/shared.service';
import { MessagesService } from 'src/app/services/dialog/message.service';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Device, DeviceID } from 'src/app/models/device';
import { setCarouselData, getBackgroundImage, getTemperatureIcon, getMonthName } from '../functions/graph-data';
import { responsiveOptions, setSelectWeather } from '../../../utils/helps';
import { ChartService } from 'src/app/services/miscellaneous/charts-service.service';
import * as Leaflet from 'leaflet';
import "leaflet-control-geocoder";
import { OwlOptions } from 'ngx-owl-carousel-o';
import { owl_landing_page } from 'src/app/utils/owl-config';
import { DatePipe } from '@angular/common';
import { product } from 'src/app/models/product';
import { category } from 'src/app/models/category';
import { SocketMasterService } from 'src/app/services/miscellaneous/socket.service';


@Component({
  selector: 'app-client-report-open',
  templateUrl: './client-report-open.component.html',
  styleUrls: ['./client-report-open.component.scss']
})
export class ClientReportOpenComponent {
  @ViewChild('dt') dt!: Table;
  @ViewChild('map', { static: true }) mapElement!: ElementRef;
  @ViewChild('meditor') meditor!: ElementRef;
  @ViewChild('historic') historic!: ElementRef;
  @ViewChild('temperature') temperature!: ElementRef;
  @ViewChild('average') average!: ElementRef;
  @ViewChild('average2') average2!: ElementRef;
  @Input() id!: number;

  showComponent: boolean = false;

  charTitle!: string;
  charData: number[] = [];
  charDate: string[] = [];
  startDate!: string | null;
  endDate: string = '';

  dataLast!: Device[];
  dataCarousel: any;
  dataTemp: any;
  dataDate: any
  dateLocation: any;
  dataDeviceClient: any;
  dataDevice!: Device[];
  dataHours!: any[];
  dataDeviceGraph: { label: string; value: string }[] = setSelectWeather;


  selectedItem: any;
  selectedCategory: any;
  selectedYear: any;
  selectedDevice: any;
  productData!: product[];
  categories: category[] = [];
  filteredData: any[] = [];
  filterValue: string = '';
  totalRecords = 0;

  loading = false;
  visible = true;

  responsiveOptions = responsiveOptions;
  customOptions: OwlOptions = owl_landing_page;
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 15,
    center: { lat: -21.52624450860366, lng: -64.73158650262741 }
  };

  constructor(
    private datePipe: DatePipe,
    private MessageService: MessagesService,
    private ChartService: ChartService,
    private socketService: SocketMasterService,
    private ShareDataService: ShareDataService,
  ) {
    this.ShareDataService.selectedDevice$.subscribe((value) => {
      this.selectedDevice = value;
    })
  }

  ngOnInit(): void {

    this.socketService.on('connection', (res: any) => {

    });
    this.socketService.on('disconnect', () => {

    });

    this.socketService.on('devicedata', (res: any) => {
      this.getDataLast();
      this.getData();
    });
    setTimeout((a: any) => {
      this.setMapData();
      window.dispatchEvent(new Event('resize'));
    }, 1000);

    this.getDeviceList();

    setTimeout((a: any) => {
      this.getDataLast();
      this.setMapData();     
      window.dispatchEvent(new Event('resize'));
    }, 2000);
  }

  ngAfterViewInit() {
    setTimeout((a: any) => {
      this.getDataLast();
      this.getData();
      window.dispatchEvent(new Event('resize'));
    }, 2000);

  }

  getDeviceList() {
    this.ShareDataService.getIdentityList().subscribe((data: DeviceID[]) => {
      if(data.length > 0){
        this.dataDeviceClient = data;
        this.selectedDevice = data[0].id;
      }
      else {
        this.showComponent = true;
      }      
    }, (err)=> {
      this.MessageService.showMsjError("Tardo en obtener información, actualice la pagina");
    })
  }

  getDataLast() {
    this.loading = true;
    this.ShareDataService.getDataLast(this.selectedDevice).subscribe((data: Device[]) => {
      this.dataLast = data;
      this.dataDate = data.map((d: Device) => d.createdAt)
      this.dataTemp = data.map((d: Device) => d.temp)
      this.dateLocation = data.map((d: Device) => d.location)
      this.dataCarousel = setCarouselData(this.dataLast);
      this.getData();
      this.setMapData();     
      this.loading = false;
      this.ChartService.meditor(this.meditor.nativeElement, this.dataTemp);
    }, (err) => {
      this.loading = false;
      this.MessageService.showMsjError(err.error.message);
    });
  }

  getData() {
    this.loading = true;
    const formattedStartDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd HH:mm:ss');
    const formattedEndDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd HH:mm:ss');
    this.ShareDataService.getData(this.selectedDevice, formattedStartDate, formattedEndDate).subscribe((data: any) => {
      this.dataDevice = data.device;
      this.dataHours = data.hour;
      this.selectedYear = data.hour[0];
      this.filterData('hum');
      this.selectedItem = "hum";
      const values = this.dataDevice.map((d) => d.temp);
      const names = this.dataDevice.map((d) => d.createdAt);
      this.ChartService.LineChartTemperature(this.temperature.nativeElement, names, values);
      if (values.length > 0) {
        const sum = values.reduce((acc, currentValue) => acc + currentValue, 0);
        const average = sum / values.length;
        const averageFormatted = parseFloat(average.toFixed(2));
        this.ChartService.AverageChart(this.average.nativeElement, averageFormatted);
      } else {
        this.ChartService.AverageChart(this.average.nativeElement, 0);
      }
      this.loading = false;
    }, (err) => {
      this.loading = false;
    });
  }

  getMonthNames() {
    return getMonthName();
  }

  getIcon(temp: number): string {
    return getTemperatureIcon(temp);
  }

  getBackground(temp: number): string {
    return getBackgroundImage(temp);
  }

  filterDevice(event: any) {
    this.loading = true;
    this.selectedDevice = event;
    this.getDataLast();
    this.getData();
  }

  filterData(event: any) {
    this.loading = true;
    const selectedValue = event;
    this.charTitle = this.dataDeviceGraph.find((d) => d.value === selectedValue)?.label.toLocaleUpperCase() || '';

    switch (selectedValue) {
      case 'hum':
        this.charData = this.dataDevice.map((d) => d.hum);
        this.charDate = this.dataDevice.map((d) => d.createdAt);
        break;
      case 'pres':
        this.charData = this.dataDevice.map((d) => d.pres);
        this.charDate = this.dataDevice.map((d) => d.createdAt);
        break;
      case 'uv':
        this.charData = this.dataDevice.map((d) => d.uv);
        this.charDate = this.dataDevice.map((d) => d.createdAt);
        break;
      case 'altitude':
        this.charData = this.dataDevice.map((d) => d.altitude);
        this.charDate = this.dataDevice.map((d) => d.createdAt);
        break;
      case 'rain':
        this.charData = this.dataDevice.map((d) => d.rain);
        this.charDate = this.dataDevice.map((d) => d.createdAt);
        break;
      case 'windf':
        this.charData = this.dataDevice.map((d) => d.windf);
        this.charDate = this.dataDevice.map((d) => d.createdAt);
        break;
      case 'windf':
        this.charData = this.dataDevice.map((d) => d.windf);
        this.charDate = this.dataDevice.map((d) => d.createdAt);
        break;
      default:
        this.charData = [];
        this.charDate = [];
        break;
    }
    this.loading = false;
    this.getEcharts();
  }

  getEcharts() {
    const names = this.charDate;
    const values = this.charData;
    this.ChartService.LineChartWithBrush(this.historic.nativeElement, names, values);

    if (values.length > 0) {
      const sum = values.reduce((acc, currentValue) => acc + currentValue, 0);
      const average = sum / values.length;
      const averageFormatted = parseFloat(average.toFixed(2));
      this.ChartService.AverageChart2(this.average2.nativeElement, averageFormatted);
    } else {
      this.ChartService.AverageChart2(this.average2.nativeElement, 0);
    }
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
    const filteredData = this.dataLast;
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

  onDateRangeChange() {
    if (this.startDate && this.endDate) {
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);
      this.getData();
    }
  }


}
