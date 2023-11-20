// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mapboxAccessToken: 'pk.eyJ1IjoiZGFudGVhYnJhaGFtMiIsImEiOiJjbGl1Mmg0dnMxamQ5M2ZudzB3bm01NnQ5In0.ElL-GieNaB6KaaIlsfeNKg',
/*    apiUrl: 'https://weather-api.dev.404.codes/weather/api',
  apiSocket: 'https://weather-api.dev.404.codes', */
  apiUrl: 'http://localhost:80/weather/api',
  apiSocket: 'http://localhost:80',
  VAPID_PUBLIC_KEY: 'BG-g3iRrKPX4xinFhFZgPbVzhbwactIpiM3PgwUTItu-ISNTk4wwfIl4_riWWPYtqzjmZXYCDGJPn2B6jInA0T0'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
