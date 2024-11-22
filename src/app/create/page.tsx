'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/config'
import { WIKI_CATEGORIES } from '@/lib/utils/constants'
import { Button } from '@/app/components/ui/Button'

export default function CreatePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [preview, setPreview] = React.useState(false)
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const article = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as string,
    }

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      })

      if (!response.ok) throw new Error('Failed to create article')

      const data = await response.json()
      router.push(`/articles/${data.id}`)
    } catch (error) {
      console.error('Failed to create article:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="prose max-w-none animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Create New Article</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="input-field w-full"
            placeholder="Article title"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="block font-medium">
            Category
          </label>
          <select 
            id="category" 
            name="category"
            required
            className="input-field w-full"
          >
            <option value="">Select a category</option>
            {WIKI_CATEGORIES.map((category) => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="block font-medium">
            Content
          </label>
          <div className="relative">
            <textarea
              id="content"
              name="content"
              required
              rows={10}
              className="input-field w-full"
              placeholder="Write your article content here... (Markdown supported)"
            />
            {preview && (
              <div 
                className="absolute inset-0 bg-surface-2 rounded-lg p-4 overflow-y-auto prose"
                dangerouslySetInnerHTML={{ 
                  __html: marked((document.getElementById('content') as HTMLTextAreaElement)?.value || '') 
                }}
              />
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="relative"
          >
            {isSubmitting && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
            Create Article
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setPreview(!preview)}
          >
            {preview ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </form>
    </div>
  )
} 