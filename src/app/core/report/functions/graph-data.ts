import { Device } from "src/app/models/device";

export function setCarouselData(data: any): any[] {
  return [
    { id: '1', title: 'Humedad', values: data[0].hum + '%', img: 'assets/thumbails/humidity.png', icon:'bi bi-droplet-fill' },
    { id: '2', title: 'Presión', values: data[0].pres, img: 'assets/thumbails/pressure.png', icon:'bi bi-sunrise-fill' },
    { id: '3', title: 'UV', values: data[0].uv, img: 'assets/thumbails/uv.png', icon:'bi bi-thermometer-sun' },
    { id: '4', title: 'Altitud', values: data[0].altitude, img: 'assets/thumbails/altitude.png', icon:'bi bi-image-alt' },
    { id: '5', title: 'Lluvia', values: data[0].rain, img: 'assets/thumbails/rain.png', icon:'bi bi-cloud-rain-fill' },
    { id: '6', title: 'Viento (fuerza)', values: data[0].windf, img: 'assets/thumbails/windf.png', icon:'bi bi-wind' },
    { id: '7', title: 'Viento (dirección)', values: data[0].winds, img: 'assets/thumbails/winds.png', icon:'bi bi-wind' },
  ];
}

export function calculateLastWeekStartDate() {
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 30); // Resta una semana
  return lastWeek;
}

export function getTemperatureIcon(temp: number): string {
  if (temp > 20) {
    return 'thermometer-plus-outline';
  } else if (temp > 15) {
    return 'thermometer-minus-outline';
  } else {
    return 'thermometer-outline';
  }
}

export function getBackgroundImage(temp: number): string {
  if (temp > 20) {
    return 'url(/assets/thumbails/sun.jpeg)';
  } else if (temp > 15) {
    return 'url(/assets/thumbails/normal.jpeg)';
  } else {
    return 'url(/assets/thumbails/cold.jpeg)';
  }
}

export function getMonthName() {
  return ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
}

export function processData(data: Device[]): any[] {
  // Crear un objeto para almacenar las horas frío y horas calor por mes y año
  const resultTable: any[] = [];

  data.forEach((item: Device) => {
    const createdAt = new Date(item.createdAt);
    const year = createdAt.getFullYear();
    const month = createdAt.toLocaleString('default', { month: 'long' });
    const existingEntry = resultTable.find(entry => entry.year === year && entry.month === month);

    if (existingEntry) {
      existingEntry.hoursCold += calculateColdHours(item.temp); 
      existingEntry.hoursHeat += calculateHotHours(item.temp); 
    } else {
      // Si no existe, agregar una nueva entrada
      resultTable.push({
        year: year,
        month: month,
        hoursCold: calculateColdHours(item.temp), 
        hoursHeat: calculateHotHours(item.temp)  
      });
    }
  });

  return resultTable;
}

function calculateColdHours(temperatura: number): number {
  return (temperatura < 7) ? 1 : 0;
}

function calculateHotHours(temperatura: number): number {
  return (temperatura > 25) ? 1 : 0;
}