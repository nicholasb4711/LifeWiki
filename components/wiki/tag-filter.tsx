"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"

interface TagFilterProps {
  availableTags: { name: string; count: number }[]
}

export function TagFilter({ availableTags }: TagFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get('tags')?.split(',').filter(Boolean) || []
  )

  const toggleTag = (tagName: string) => {
    const newTags = selectedTags.includes(tagName)
      ? selectedTags.filter(t => t !== tagName)
      : [...selectedTags, tagName]
    
    setSelectedTags(newTags)
    
    // Update URL
    const params = new URLSearchParams(searchParams)
    if (newTags.length > 0) {
      params.set('tags', newTags.join(','))
    } else {
      params.delete('tags')
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {availableTags.map(({ name, count }) => (
        <Badge
          key={name}
          variant={selectedTags.includes(name) ? "default" : "secondary"}
          className={cn(
            "cursor-pointer hover:bg-primary/90 transition-colors",
            selectedTags.includes(name) 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-primary/20"
          )}
          onClick={() => toggleTag(name)}
        >
          {name} ({count})
        </Badge>
      ))}
    </div>
  )
} 