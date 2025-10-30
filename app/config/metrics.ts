export type ChartType = 'line' | 'bar'

export interface MetricConfig {
  type: 'lcp' | 'cls' | 'inp' | 'fcp' | 'ttfb'
  name: string
  unit: string
  chartType: ChartType
  color: string
  threshold: string
  thresholdValue: number
  thresholdType: 'lt' | 'gt'
  displayUnit: string
}

export const metricsList: MetricConfig[] = [
  {
    type: 'lcp',
    name: 'LCP (最大内容绘制)',
    unit: 'ms',
    chartType: 'line',
    color: '#3b82f6',
    threshold: '小于 2.5s 为优秀',
    thresholdValue: 2500,
    thresholdType: 'lt',
    displayUnit: 'ms'
  },
  {
    type: 'cls',
    name: 'CLS (累积布局偏移)',
    unit: '',
    chartType: 'bar',
    color: '#22d3ee',
    threshold: '小于 0.1 为优秀',
    thresholdValue: 0.1,
    thresholdType: 'lt',
    displayUnit: ''
  },
  {
    type: 'inp',
    name: 'INP (交互延迟)',
    unit: 'ms',
    chartType: 'line',
    color: '#fde047',
    threshold: '小于 200ms 为优秀',
    thresholdValue: 200,
    thresholdType: 'lt',
    displayUnit: 'ms'
  },
  {
    type: 'fcp',
    name: 'FCP (首次内容绘制)',
    unit: 'ms',
    chartType: 'line',
    color: '#f87171',
    threshold: '小于 1.8s 为优秀',
    thresholdValue: 1800,
    thresholdType: 'lt',
    displayUnit: 'ms'
  },
  {
    type: 'ttfb',
    name: 'TTFB (首字节时间)',
    unit: 'ms',
    chartType: 'line',
    color: '#38bdf8',
    threshold: '小于 800ms 为优秀',
    thresholdValue: 800,
    thresholdType: 'lt',
    displayUnit: 'ms'
  }
]
