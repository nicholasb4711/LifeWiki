"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface BackButtonProps {
  className?: string
  label?: string
  href?: string
}

export function BackButton({ 
  className = "text-sm text-muted-foreground hover:text-foreground", 
  label = "Back",
  href
}: BackButtonProps) {
  const router = useRouter()

  if (href) {
    return (
      <Link
        href={href}
        className={`inline-flex items-center gap-2 transition-colors ${className}`}
      >
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Link>
    )
  }

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