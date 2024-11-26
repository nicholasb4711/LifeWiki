import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, FileText, Plus, Trash2 } from "lucide-react";
import { BackButton } from "@/components/back-button"
import { deleteWikiAction } from "@/app/actions";
import { ConfirmationDialog } from "@/components/confirmation-dialog"

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

  return (
    <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 space-y-8">
      {/* Back Navigation */}
      <div className="mb-8">
        <BackButton label="Back" />
      </div>

      {/* Wiki Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{wiki.title}</h1>
          <div className="flex gap-2">
            {isOwner && (
              <ConfirmationDialog
                title="Delete Wiki"
                description="Are you sure you want to delete this wiki? This action cannot be undone and will delete all pages within this wiki."
                action={deleteWikiWithId}
              />
            )}
            <Button asChild size="sm">
              <Link href={`/wikis/${wikiId}/pages/new`}>
                <Plus className="h-4 w-4 mr-2" />
                New Page
              </Link>
            </Button>
          </div>
        </div>
        {wiki.description && (
          <p className="text-muted-foreground">{wiki.description}</p>
        )}
      </div>

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
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-primary-300/50 dark:hover:bg-primary-500/20 hover:border hover:border-primary text-sm group transition-colors"
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
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pages?.slice(0, 5).map((page) => (
                  <div
                    key={page.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{page.title}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>Updated: {new Date(page.updated_at).toLocaleDateString()}</span>
                      {page.updater?.email && (
                        <span className="ml-2">by {page.updater.email}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
