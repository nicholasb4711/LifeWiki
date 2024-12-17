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
  suggestions?: string[]
}

export function TagInput({
  id,
  name,
  placeholder,
  defaultValue = [],
  onChange,
  suggestions = [],
}: TagInputProps) {
  const [tags, setTags] = useState<string[]>(defaultValue)
  const [input, setInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredSuggestions = suggestions
    .filter(s => !tags.includes(s))
    .filter(s => s.toLowerCase().includes(input.toLowerCase()))

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const addTag = (tagToAdd: string = input) => {
    const trimmedInput = tagToAdd.trim()
    if (trimmedInput && !tags.includes(trimmedInput)) {
      const newTags = [...tags, trimmedInput]
      setTags(newTags)
      onChange?.(newTags)
    }
    setInput("")
    setShowSuggestions(false)
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
      <div className="relative">
        <Input
          id={id}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
            {filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion}
                className="px-3 py-2 hover:bg-accent cursor-pointer"
                onClick={() => addTag(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
      <input
        type="hidden"
        name={name}
        value={tags.join(",")}
      />
    </div>
  )
} 