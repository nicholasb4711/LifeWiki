"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, BookOpen, Settings } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          <Button asChild variant="default" className="h-24 flex flex-col gap-2">
            <Link href="/wikis/new">
              <Plus className="h-4 w-4" />
              New Wiki
            </Link>
          </Button>
          <Button asChild variant="default" className="h-24 flex flex-col gap-2">
            <Link href="/wikis">
              <BookOpen className="h-5 w-5" />
              My Wikis
            </Link>
          </Button>
          <Button asChild variant="default" className="h-24 flex flex-col gap-2">
            <Link href="/search">
              <Search className="h-5 w-5" />
              Search
            </Link>
          </Button>
          <Button asChild variant="default" className="h-24 flex flex-col gap-2">
            <Link href="/settings">
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 