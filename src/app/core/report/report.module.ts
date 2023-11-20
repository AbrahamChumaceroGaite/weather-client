import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';

import { ReportRoutingModule } from './report-routing.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NebularLibraryModule } from 'src/app/modules/nebular-library.module';
import { PrimengLibraryModule } from 'src/app/modules/primeng-library.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ClientReportComponent } from './client-report/client-report.component';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [
    HomeComponent,
    ClientReportComponent
  ],
  imports: [
    NgApexchartsModule,
    CommonModule,    
    CarouselModule,
    FormsModule,
    LeafletModule,
    ReactiveFormsModule,
    NebularLibraryModule,
    PrimengLibraryModule,
    ReportRoutingModule
  ]
})
export class ReportModule { }
