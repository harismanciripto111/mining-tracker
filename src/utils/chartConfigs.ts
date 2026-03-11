import { colors, chartPalette } from './colors'
import type { ApexOptions } from 'apexcharts'

// ---- Base Chart Config ----
export function getBaseChartOptions(): ApexOptions {
  return {
    chart: {
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        dynamicAnimation: { enabled: true, speed: 350 }
      },
      zoom: { enabled: false }
    },
    theme: {
      mode: 'dark',
      palette: 'palette1'
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.06)',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: 10, bottom: 0, left: 10 }
    },
    xaxis: {
      labels: {
        style: { colors: colors.textSecondary, fontSize: '11px' }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: colors.textSecondary, fontSize: '11px' },
        formatter: (val: number) => `$${val.toFixed(0)}`
      }
    },
    tooltip: {
      theme: 'dark',
      style: { fontSize: '12px' },
      y: {
        formatter: (val: number) => `$${val.toFixed(2)}`
      }
    },
    legend: {
      labels: { colors: colors.textSecondary },
      fontSize: '12px',
      position: 'top',
      horizontalAlign: 'right'
    },
    colors: chartPalette
  }
}

// ---- Cumulative Line Chart ----
export function getCumulativeChartOptions(): ApexOptions {
  return {
    ...getBaseChartOptions(),
    chart: {
      ...getBaseChartOptions().chart,
      type: 'area',
      height: 350
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100]
      }
    },
    dataLabels: { enabled: false },
    colors: [colors.accent]
  }
}

// ---- Daily Bar Chart ----
export function getDailyBarChartOptions(): ApexOptions {
  return {
    ...getBaseChartOptions(),
    chart: {
      ...getBaseChartOptions().chart,
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
        colors: {
          ranges: [
            { from: -999999, to: -0.01, color: colors.loss },
            { from: 0, to: 999999, color: colors.profit }
          ]
        }
      }
    },
    dataLabels: { enabled: false }
  }
}

// ---- Heatmap Chart ----
export function getHeatmapChartOptions(): ApexOptions {
  return {
    ...getBaseChartOptions(),
    chart: {
      ...getBaseChartOptions().chart,
      type: 'heatmap',
      height: 250
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 4,
        colorScale: {
          ranges: [
            { from: -999999, to: -100, color: '#dc2626', name: 'Large Loss' },
            { from: -99.99, to: -0.01, color: '#f87171', name: 'Small Loss' },
            { from: 0, to: 0, color: '#374151', name: 'Neutral' },
            { from: 0.01, to: 100, color: '#34d399', name: 'Small Profit' },
            { from: 100.01, to: 999999, color: '#059669', name: 'Large Profit' }
          ]
        }
      }
    },
    dataLabels: { enabled: false },
    stroke: { width: 2, colors: ['#0a0e17'] }
  }
}

// ---- ROI Area Chart ----
export function getRoiChartOptions(): ApexOptions {
  return {
    ...getBaseChartOptions(),
    chart: {
      ...getBaseChartOptions().chart,
      type: 'area',
      height: 300
    },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.05,
        stops: [0, 90, 100]
      }
    },
    dataLabels: { enabled: false },
    colors: [colors.violet],
    yaxis: {
      ...getBaseChartOptions().yaxis,
      labels: {
        style: { colors: colors.textSecondary, fontSize: '11px' },
        formatter: (val: number) => `${val.toFixed(1)}%`
      }
    }
  }
}

// ---- Distribution Donut ----
export function getDistributionChartOptions(): ApexOptions {
  return {
    ...getBaseChartOptions(),
    chart: {
      ...getBaseChartOptions().chart,
      type: 'donut',
      height: 300
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              color: colors.textPrimary,
              fontSize: '14px'
            },
            value: {
              show: true,
              color: colors.textSecondary,
              fontSize: '20px',
              fontFamily: 'JetBrains Mono, monospace',
              formatter: (val: string) => `${val} days`
            },
            total: {
              show: true,
              label: 'Total Days',
              color: colors.textSecondary,
              fontSize: '12px'
            }
          }
        }
      }
    },
    stroke: { width: 0 },
    dataLabels: { enabled: false },
    colors: [colors.profit, colors.loss, colors.neutral]
  }
}

// ---- Radial Bar (Mining Efficiency) ----
export function getRadialChartOptions(): ApexOptions {
  return {
    ...getBaseChartOptions(),
    chart: {
      ...getBaseChartOptions().chart,
      type: 'radialBar',
      height: 280
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '65%' },
        track: {
          background: 'rgba(255, 255, 255, 0.05)',
          strokeWidth: '100%'
        },
        dataLabels: {
          name: {
            show: true,
            color: colors.textSecondary,
            fontSize: '12px',
            offsetY: -10
          },
          value: {
            show: true,
            color: colors.textPrimary,
            fontSize: '28px',
            fontFamily: 'JetBrains Mono, monospace',
            offsetY: 5,
            formatter: (val: number) => `${val.toFixed(0)}%`
          }
        }
      }
    },
    stroke: { lineCap: 'round' },
    colors: [colors.accent]
  }
}
