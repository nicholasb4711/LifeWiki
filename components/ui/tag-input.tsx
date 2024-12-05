"use client"

import { useState, KeyboardEvent } from "react"
import { X } from "lucide-react"
import { Input } from "./input"
import { Badge } from "./badge"

interface TagInputProps {
  id?: string
  name: string
  placeholder?: string
  defaultValue?: string[]
  onChange?: (tags: string[]) => void
}

export function TagInput({
  id,
  name,
  placeholder,
  defaultValue = [],
  onChange,
}: TagInputProps) {
  const [tags, setTags] = useState<string[]>(defaultValue)
  const [input, setInput] = useState("")

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  const addTag = () => {
    const trimmedInput = input.trim()
    if (trimmedInput && !tags.includes(trimmedInput)) {
      const newTags = [...tags, trimmedInput]
      setTags(newTags)
      onChange?.(newTags)
    }
    setInput("")
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove)
    setTags(newTags)
    onChange?.(newTags)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="gap-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:bg-destructive/50 rounded-full p-1"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        id={id}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={placeholder}
      />
      <input
        type="hidden"
        name={name}
        value={tags.join(",")}
      />
    </div>
  )
} 