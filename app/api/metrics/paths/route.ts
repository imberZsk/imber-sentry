import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../generated/prisma'

const prisma = new PrismaClient()

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get('projectId')
  const country = searchParams.get('country')
  if (!projectId || !country) {
    return NextResponse.json([], { status: 400 })
  }
  const paths = await prisma.webVitalMetric.findMany({
    where: { projectId: Number(projectId), country },
    select: { path: true },
    distinct: ['path']
  })
  // 返回去重后的 path 列表
  return NextResponse.json(paths.map((p) => p.path).filter(Boolean))
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}
