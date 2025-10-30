import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../generated/prisma'

const prisma = new PrismaClient()

// CORS 头部
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}

// POST: 上报性能指标
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { projectId, type, value, userAgent, url, path } = body
    // 新增：解析国家代码
    let country = 'global'
    try {
      const urlPath = new URL(url).pathname
      const match = urlPath.match(/^\/([^\/]+)/)
      if (match && match[1]) country = match[1]
    } catch {}
    if (!projectId || !type || value === undefined) {
      return new NextResponse(JSON.stringify({ error: '缺少必要参数' }), {
        status: 400,
        headers: corsHeaders
      })
    }
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })
    if (!project) {
      return new NextResponse(JSON.stringify({ error: '无效的 projectId' }), {
        status: 400,
        headers: corsHeaders
      })
    }
    const metric = await prisma.webVitalMetric.create({
      data: {
        projectId,
        type,
        value,
        userAgent,
        url,
        path,
        country
      }
    })
    return new NextResponse(JSON.stringify(metric), { headers: corsHeaders })
  } catch (e) {
    return new NextResponse(
      JSON.stringify({ error: '服务器错误', detail: String(e) }),
      { status: 500, headers: corsHeaders }
    )
  }
}

// GET: 查询性能指标
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')
    const type = searchParams.get('type')
    const country = searchParams.get('country')
    const path = searchParams.get('path')
    if (!projectId) {
      return new NextResponse(JSON.stringify({ error: '缺少 projectId' }), {
        status: 400,
        headers: corsHeaders
      })
    }
    const where: Record<string, unknown> = { projectId: Number(projectId) }
    if (type) where.type = type
    if (country) where.country = country
    if (path) where.path = path
    const metrics = await prisma.webVitalMetric.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 1000
    })
    return new NextResponse(JSON.stringify(metrics), { headers: corsHeaders })
  } catch (e) {
    return new NextResponse(
      JSON.stringify({ error: '服务器错误', detail: String(e) }),
      { status: 500, headers: corsHeaders }
    )
  }
}

// OPTIONS: 处理预检请求
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}
