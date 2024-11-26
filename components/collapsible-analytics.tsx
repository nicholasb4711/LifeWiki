"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"

interface CollapsibleAnalyticsProps {
  analytics: {
    pageViews: {
      date: string
      views: number
    }[]
    totalViews: number
    uniqueViewers: number
    mostViewedPages: {
      id: string
      title: string
      wiki_id: string
      views: number
    }[]
  }
}

export function CollapsibleAnalytics({ analytics }: CollapsibleAnalyticsProps) {
  const [showAnalytics, setShowAnalytics] = useState(true)

  return (
    <Card>
      <CardHeader 
        className="cursor-pointer select-none hover:bg-accent/50 transition-colors rounded-t-lg" 
        onClick={() => setShowAnalytics(!showAnalytics)}
      >
        <div className="flex items-center justify-between">
          <CardTitle>Analytics Dashboard</CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {showAnalytics ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {showAnalytics && (
        <CardContent>
          <AnalyticsDashboard
            pageViews={analytics.pageViews}
            totalViews={analytics.totalViews}
            uniqueViewers={analytics.uniqueViewers}
            mostViewedPages={analytics.mostViewedPages}
          />
        </CardContent>
      )}
    </Card>
  )
} 