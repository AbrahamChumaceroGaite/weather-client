import { LOCALE_ID, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

/**Componentes */
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './components/login/login.component';
import { DeniedComponent } from './components/denied/denied.component';

/**Modulo de las librerias Graficas */
import { PrimengLibraryModule } from './modules/primeng-library.module';
import { NebularLibraryModule } from './modules/nebular-library.module';
import { NbContextMenuModule } from '@nebular/theme';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NbThemeModule, NbSidebarModule, NbMenuModule, NbDialogModule, NbFormFieldModule, NbToastrModule, NbLayoutModule, NbRouteTabsetComponent, NbRouteTabsetModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { DialogService } from 'primeng/dynamicdialog';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { ngxUiLoaderConfigTemplate } from './utils/ngxuiloader';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MessageService } from 'primeng/api';
import { ShareDataService } from './services/shared/shared.service';
import { TokenInterceptor } from './utils/token.interceptor';
import { LandingComponent } from './components/landing/landing.component';
import { CookieService } from 'ngx-cookie-service';
import { SocketMasterService } from './services/miscellaneous/socket.service';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    DeniedComponent,
    LandingComponent
  ],

  imports: [
    NgApexchartsModule,
    LeafletModule,
    BrowserModule,
    AppRoutingModule,
    NbContextMenuModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxUiLoaderModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfigTemplate),
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    NbFormFieldModule,
    NbEvaIconsModule,
    NbDialogModule.forRoot(),
    NbThemeModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule,
    NbMenuModule.forRoot(),
    NbToastrModule.forRoot(),
    NbRouteTabsetModule,
    CarouselModule,
    NebularLibraryModule,
    PrimengLibraryModule,
    NbThemeModule.forRoot({ name: 'corporate' }),
    NbLayoutModule,
    SocketIoModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:10000'
    }),
  ],
  providers: [DialogService, MessageService, SocketMasterService,  ShareDataService,CookieService, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  },
    {
      provide: LOCALE_ID,
      useValue: 'es'
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
