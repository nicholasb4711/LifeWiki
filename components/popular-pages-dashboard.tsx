"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, TrendingUp } from "lucide-react"
import Link from "next/link"

interface PopularPage {
  id: string
  title: string
  views: number
  wiki_id: string
  wiki_title: string
}

interface PopularPagesDashboardProps {
  pages: PopularPage[]
}

export function PopularPagesDashboard({ pages }: PopularPagesDashboardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Popular Pages
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No pages viewed yet
            </p>
          ) : (
            pages.map((page) => (
              <Link
                key={page.id}
                href={`/wikis/${page.wiki_id}/pages/${page.id}`}
                className="flex items-center justify-between py-2 px-2 -mx-2 rounded-md hover:bg-primary-300/50 dark:hover:bg-primary-500/20 transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate group-hover:text-foreground transition-colors">
                      {page.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      in {page.wiki_title}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground pl-4">
                  {page.views} {page.views === 1 ? 'view' : 'views'}
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
} 