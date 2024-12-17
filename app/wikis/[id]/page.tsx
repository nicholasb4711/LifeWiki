import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, FileText, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { BackButton } from "@/components/ui/back-button"
import { deleteWikiAction } from "@/app/actions";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { getWikiAnalytics } from "@/app/actions/analytics"
import { useState } from "react"
import { CollapsibleAnalytics } from "@/components/analytics/collapsible-analytics"
import { RecentActivityComponent } from "@/components/analytics/recent-activity-component"
import { getUserActivities } from "@/app/actions/analytics"

interface WikiPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WikiPage(props: WikiPageProps) {
  const params = await props.params;
  const supabase = await createClient();
  const wikiId = await Promise.resolve(params.id);

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Fetch wiki details
  const { data: wiki, error } = await supabase
    .from("wikis")
    .select("*, user_id")
    .eq("id", wikiId)
    .single();

  if (error || !wiki) {
    notFound();
  }

  // Check if user is owner
  const isOwner = wiki.user_id === user.id;

  // Check if user can access (is owner or wiki is public)
  if (!isOwner && !wiki.is_public) {
    redirect("/wikis");
  }

  // Fetch pages with user information
  const { data: pages } = await supabase
    .from("pages")
    .select("*")
    .eq("wiki_id", wikiId)
    .order("updated_at", { ascending: false });

  const deleteWikiWithId = async () => {
    "use server"
    const formData = new FormData()
    formData.append("wikiId", wikiId)
    return deleteWikiAction(formData)
  }

  // Get analytics and activities
  const [analytics, activities] = await Promise.all([
    getWikiAnalytics(wikiId),
    getUserActivities()
  ]);

  // Filter activities to only show ones related to this wiki
  const wikiActivities = activities?.filter(
    activity => 
      (activity.wiki?.id === wikiId) || 
      (activity.page?.wiki_id === wikiId)
  ) || [];

  return (
    <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 space-y-8">
      {/* Back Navigation */}
      <div className="mb-8">
        <BackButton label="Back" />
      </div>

      {/* Wiki Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{wiki.title}</h1>
          {wiki.user_id === user.id && (
            <div className="flex gap-2">
              <Button asChild>
                <Link href={`/wikis/${params.id}/edit`}>
                  Edit Wiki
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href={`/wikis/${wikiId}/pages/new`}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Page
                </Link>
              </Button>
            </div>
          )}
        </div>
        {wiki.description && (
          <p className="text-muted-foreground">{wiki.description}</p>
        )}
      </div>

      {/* Analytics Dashboard - Only shown to owner */}
      {isOwner && analytics && (
        <CollapsibleAnalytics analytics={analytics} />
      )}

      {/* Wiki Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar with Directory */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-2">
              {!pages?.length ? (
                <p className="text-sm text-muted-foreground">No pages yet</p>
              ) : (
                pages?.map((page) => (
                  <Link
                    key={page.id}
                    href={`/wikis/${wikiId}/pages/${page.id}`}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-primary-300/50 dark:hover:bg-primary-500/20 text-sm group transition-colors"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    <span className="truncate">{page.title}</span>
                  </Link>
                ))
              )}
            </nav>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {pages?.length === 0 
                  ? "Welcome to this wiki! Get started by creating your first page using the \"New Page\" button above."
                  : "Select a page from the directory to start reading, or create a new page using the \"New Page\" button above."
                }
              </p>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <RecentActivityComponent 
            pages={pages || []} 
            title="Recent Updates"
            emptyMessage="No pages yet"
          />
        </div>
      </div>
    </div>
  );
}
