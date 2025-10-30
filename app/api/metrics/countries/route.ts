import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../generated/prisma'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get('projectId')
  if (!projectId) {
    return NextResponse.json([], { status: 400 })
  }
  const countries = await prisma.webVitalMetric.findMany({
    where: { projectId: Number(projectId) },
    select: { country: true },
    distinct: ['country']
  })
  // 返回去重后的国家列表
  return NextResponse.json(countries.map((c) => c.country).filter(Boolean))
}
