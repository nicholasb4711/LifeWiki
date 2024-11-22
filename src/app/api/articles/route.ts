import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import type { CreateArticleInput } from '@/lib/types/article'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json() as CreateArticleInput
    
    // Here you would typically:
    // 1. Validate the input
    // 2. Sanitize the content
    // 3. Save to your database
    // For now, we'll just return a mock response
    
    const article = {
      id: crypto.randomUUID(),
      ...body,
      authorId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('Failed to create article:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 