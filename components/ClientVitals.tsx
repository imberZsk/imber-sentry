'use client'

import { useEffect } from 'react'

export const reportWebVitals = async (metric: any) => {
  const projectId = 1 // TODO: 替换为你的实际项目ID
  const send = () => {
    const body = {
      projectId,
      type: metric.name.toLowerCase(),
      value: metric.value,
      userAgent: navigator.userAgent,
      url: window.location.href,
      path: window.location.pathname
    }
    console.log('上报web vitals:', body)
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
  }
  send()
}

export default function ClientVitals() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      return
    }
    import('web-vitals').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
      onCLS(reportWebVitals)
      onINP(reportWebVitals)
      onLCP(reportWebVitals)
      onFCP(reportWebVitals)
      onTTFB(reportWebVitals)
      console.log('web-vitals 注册完成')
    })
  }, [])
  return null
}
