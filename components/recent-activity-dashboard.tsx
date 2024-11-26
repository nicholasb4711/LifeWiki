"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus, Edit, Clock, Trash2, Share2, Activity } from "lucide-react"
import Link from "next/link"

interface Activity {
  id: string
  action_type: 'create_page' | 'edit_page' | 'view_page' | 'create_wiki' | 'delete_page' | 'delete_wiki' | 'update_wiki' | 'share_wiki'
  resource_type: 'page' | 'wiki'
  created_at: string
  page?: {
    id: string
    title: string
    wiki_id: string
    wiki_title: string
    updated_at?: string
    updater?: {
      email: string
    }
  }
  wiki?: {
    id: string
    title: string
  }
  metadata?: {
    title: string
  }
}

interface RecentActivityDashboardProps {
  activities: Activity[]
}

export function RecentActivityDashboard({ activities }: RecentActivityDashboardProps) {
  const getActivityIcon = (type: Activity['action_type']) => {
    switch (type) {
      case 'create_page':
      case 'create_wiki':
        return <Plus className="h-4 w-4 text-primary" />
      case 'edit_page':
      case 'update_wiki':
        return <Edit className="h-4 w-4 text-primary" />
      case 'view_page':
        return <FileText className="h-4 w-4 text-primary" />
      case 'delete_page':
      case 'delete_wiki':
        return <Trash2 className="h-4 w-4 text-destructive" />
      case 'share_wiki':
        return <Share2 className="h-4 w-4 text-primary" />
      default:
        return <Activity className="h-4 w-4 text-primary" />
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Recent Activity
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity
            </p>
          ) : (
            activities.map((activity) => (
              <Link
                key={activity.id}
                href={activity.page ? `/wikis/${activity.page.wiki_id}/pages/${activity.page.id}` : `/wikis/${activity.wiki?.id}`}
                className="flex items-center justify-between py-2 px-2 -mx-2 rounded-md hover:bg-primary-300/50 dark:hover:bg-primary-500/20 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  {getActivityIcon(activity.action_type)}
                  <div>
                    <span className="font-medium group-hover:text-foreground transition-colors">
                      {activity.page?.title || activity.wiki?.title}
                    </span>
                    {activity.page && (
                      <p className="text-xs text-muted-foreground">
                        in {activity.page.wiki_title}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span>{new Date(activity.created_at).toLocaleDateString()}</span>
                  {activity.page?.updater?.email && (
                    <span className="ml-2">by {activity.page.updater.email}</span>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
} 