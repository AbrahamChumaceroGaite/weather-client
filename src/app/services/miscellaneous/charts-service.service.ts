import { Injectable } from '@angular/core';
import * as echarts from 'echarts';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  constructor() { }

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

  LineChartWithBrush(chartElement: HTMLElement, name: string[], value: number[]) {
    const chart = echarts.init(chartElement);

    const option = {
      tooltip: {
        trigger: 'axis'
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: true },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: name,
      },
      yAxis: {
        type: 'value',
      },
      dataZoom: [
        {
          type: 'inside',
          start: 50,
          end: 100
        },
        {
          start: 0,
          end: 10
        }
      ],
      series: [
        {
          name: 'Valor: ',
          type: 'line',
          symbol: 'none',
          sampling: 'lttb',
          itemStyle: {
            color: 'rgb(255, 255, 255)'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(23, 149, 204)'
              },
              {
                offset: 1,
                color: 'rgb(186, 229, 247)'
              }
            ])
          },
          data: value,

        }
      ]
    };

    chart.setOption(option);
  }

  LineChartTemperature(chartElement: HTMLElement, name: string[], value: number[]) {
    const chart = echarts.init(chartElement);

    const option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        data: name
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} °C'
        }
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: true },
          magicType: { type: ['line', 'bar'] },
          restore: {},
          saveAsImage: {}
        }
      }, dataZoom: [
        {
          type: 'inside',
          start: 50,
          end: 100
        },
        {
          start: 0,
          end: 10
        }
      ],
      visualMap: {
        top: 50,
        right: 0,
        pieces: [
          {
            gt: 0,
            lte: 10,
            color: '#93CE07'
          },
          {
            gt: 10,
            lte: 20,
            color: '#FBDB0F'
          },
          {
            gt: 20,
            lte: 30,
            color: '#FC7D02'
          },
          {
            gt: 30,
            lte: 40,
            color: '#FD0100'
          }
        ],
        outOfRange: {
          color: '#999'
        }
      },
      series: {
        name: 'ºC ',
        type: 'line',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: value,
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
        markLine: {
          silent: true,
          lineStyle: {
            color: '#333'
          },
          /*    data: [
               {
                 yAxis: 0
               },
               {
                 yAxis: 10
               },
               {
                 yAxis: 20
               },
               {
                 yAxis: 30
               },
               {
                 yAxis: 40
               }
             ] */
        }
      }
    };

    chart.setOption(option);
  }

  meditor(chartElement: HTMLElement, data: any) {
    const chart = echarts.init(chartElement);

    const option = {
      series: [
        {
          type: 'gauge',
          center: ['50%', '60%'],
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: 40,
          splitNumber: 10,
          itemStyle: {
            color: '#FFFF'
          },
          progress: {
            show: true,
            width: 10
          },
          pointer: {
            show: false
          },
          axisLine: {
            lineStyle: {
              width: 20
            }
          },
          axisTick: {
            distance: -45,
            splitNumber: 5,
            lineStyle: {
              width: 2,
              color: '#fff'
            }
          },
          splitLine: {
            distance: -52,
            length: 14,
            lineStyle: {
              width: 3,
              color: '#fff'
            }
          },
          axisLabel: {
            distance: -20,
            color: '#fff',
            fontSize: 15
          },
          anchor: {
            show: false
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            width: '40%',
            lineHeight: 40,
            borderRadius: 8,
            offsetCenter: [0, '-15%'],
            fontSize: 40,
            fontWeight: 'bolder',
            formatter: data + '°C',
            color: 'inherit'
          },
          data: [
            {
              value: data
            }
          ]
        },
        {
          type: 'gauge',
          center: ['50%', '60%'],
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: 40,
          itemStyle: {
            color: '#FD7347'
          },
          progress: {
            show: true,
            width: 8
          },

          pointer: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          detail: {
            show: false
          },
          data: [
            {
              value: data
            }
          ]
        }

      ]
    };

    chart.setOption(option);
  }

  AverageChart(chartElement: HTMLElement, value: any) {
    const chart = echarts.init(chartElement);

    const option = {
      series: [
        {
          type: 'gauge',
          min: 0,
          max: 40,
          progress: {
            show: true,
            width: 18
          },
          axisLine: {
            lineStyle: {
              width: 18
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            length: 5,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          axisLabel: {
            distance: 25,
            color: '#999',
            fontSize: 7
          },
          anchor: {
            show: false,
            size: 5,
            itemStyle: {
              borderWidth: 10
            }
          },
          pointer: {
            show: false
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            fontSize: 20,
            offsetCenter: [0, '-10%'],
            formatter: value + '°C',
          },
          data: [
            {
              value: value
            }
          ]
        }
      ]
    };

    chart.setOption(option);
  }
  
  AverageChart2(chartElement: HTMLElement, value: any) {
    const chart = echarts.init(chartElement);

    const option = {
      series: [
        {
          type: 'gauge',
          min: 0,
          max: 40,
          progress: {
            show: true,
            width: 18
          },
          axisLine: {
            lineStyle: {
              width: 18
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            length: 5,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          axisLabel: {
            distance: 25,
            color: '#999',
            fontSize: 7
          },
          anchor: {
            show: false,
            size: 5,
            itemStyle: {
              borderWidth: 10
            }
          },
          pointer: {
            show: false
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            fontSize: 20,
            offsetCenter: [0, '-10%'],
            formatter: value ,
          },
          data: [
            {
              value: value
            }
          ]
        }
      ]
    };

    chart.setOption(option);
  }
}