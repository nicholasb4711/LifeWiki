"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface BackButtonProps {
  className?: string
  label?: string
}

export function BackButton({ 
  className = "text-sm text-muted-foreground hover:text-foreground", 
  label = "Back"
}: BackButtonProps) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className={`inline-flex items-center gap-2 transition-colors ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  )
} 