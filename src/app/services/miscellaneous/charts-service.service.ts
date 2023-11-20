import { Injectable } from '@angular/core';
import * as echarts from 'echarts';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  constructor() { }
  // Crear un gráfico de torta (gráfico circular)
  createPieChart(chartElement: HTMLElement, data: { name: string; value: number }[]) {
    const chart = echarts.init(chartElement);
    const totalValue = data.reduce((acc, item) => acc + item.value, 0);
  
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        top: '1%',
        left: 'center',
        data: data.map((item) => item.name),
      },
      series: [
        {
          name: 'Datos',
          type: 'pie',
          radius: ['50%', '70%'], // Controla el tamaño del anillo interior y exterior
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: false, // Evita que las etiquetas interiores sean visibles
            position: 'center',
            formatter: `{d}%`, // Muestra el porcentaje en lugar del título de la leyenda
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: data.map((item) => ({
            name: item.name,
            value: item.value,
            label: {
              show: true, // Muestra etiquetas en las secciones de la dona
              formatter: `{b} ({d}%)`, // Muestra el título de la leyenda y el porcentaje en las etiquetas
            },
          })),
        },
      ],
    };
    chart.setOption(option);
  }

  createCircleChart(chartElement: HTMLElement, data: { name: string; value: number }[]) {
    const chart = echarts.init(chartElement);
    const totalValue = data.reduce((acc, item) => acc + item.value, 0);
  
    const option = {

      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Información',
          type: 'pie',
          radius: '50%',
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    
    
    chart.setOption(option);
  }

  createTreeMap(chartElement: HTMLElement, data: any[]) {
    const chart = echarts.init(chartElement);

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'value',         
          boundaryGap: [0, 0.01]
        }
      ],
      yAxis: [
        {
          type: 'category',  
          data: data.map((item) => item.name),        
        }
      ],
      series: [
        {
          name: 'Información',
          type: 'bar',
          barWidth: '60%',
          itemStyle: {
            color: 'rgba(0, 125, 71, 0.5)' // Cambiar el color de las barras a verde
          },
          data: data.map((item) => item.value),
        }
      ]
    };

    chart.setOption(option);
  }
}