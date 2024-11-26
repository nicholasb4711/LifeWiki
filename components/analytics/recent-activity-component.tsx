"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import Link from "next/link"

interface RecentPage {
  id: string
  title: string
  wiki_id: string
  wiki_title?: string
  updated_at: string
  updater?: {
    email: string
  }
}

interface ActivityData {
  id: string;
  action_type: string;
  resource_type: string;
  created_at: string;
  page?: {
    id: string;
    title: string;
    wiki_id: string;
    wiki_title: string;
  };
  wiki?: {
    id: string;
    title: string;
  };
}

interface RecentActivityProps {
  pages: (RecentPage | ActivityData)[];
  showWikiTitle?: boolean;
  title?: string;
  emptyMessage?: string;
  limit?: number;
  isHomePage?: boolean;
}

export function RecentActivityComponent({ 
  pages, 
  showWikiTitle = false, 
  title = "Recent Activity",
  emptyMessage = "No recent activity",
  limit = 5,
  isHomePage = false
}: RecentActivityProps) {
  const formatPage = (page: RecentPage | ActivityData) => {
    if (isHomePage) {
      const activityPage = page as ActivityData;
      return {
        id: activityPage.page?.id || '',
        title: activityPage.page?.title || '',
        wiki_id: activityPage.page?.wiki_id || '',
        wiki_title: activityPage.page?.wiki_title || '',
        updated_at: activityPage.created_at
      };
    }
    return page as RecentPage;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!pages?.length ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {emptyMessage}
            </p>
          ) : (
            pages?.slice(0, limit).map((page) => {
              const formattedPage = formatPage(page);
              return (
                <Link
                  key={formattedPage.id}
                  href={`/wikis/${formattedPage.wiki_id}/pages/${formattedPage.id}`}
                  className="flex items-center justify-between py-2 px-2 -mx-2 rounded-md hover:bg-primary-300/50 dark:hover:bg-primary-500/20 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <div>
                      <span className="font-medium group-hover:text-foreground transition-colors">
                        {formattedPage.title}
                      </span>
                      {showWikiTitle && formattedPage.wiki_title && (
                        <p className="text-xs text-muted-foreground">
                          in {formattedPage.wiki_title}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>Updated: {new Date(formattedPage.updated_at).toLocaleDateString()}</span>
                    {formattedPage.updater?.email && (
                      <span className="ml-2">by {formattedPage.updater.email}</span>
                    )}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
} 