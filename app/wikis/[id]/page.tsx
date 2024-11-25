import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, FileText, FolderIcon, Plus } from "lucide-react";
import { BackButton } from "@/components/back-button"

interface WikiPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WikiPage(props: WikiPageProps) {
  const params = await props.params;
  const supabase = await createClient();
  const wikiId = await Promise.resolve(params.id);

  // Fetch wiki details
  const { data: wiki, error } = await supabase
    .from("wikis")
    .select("*, user_id")
    .eq("id", wikiId)
    .single();

  if (error || !wiki) {
    notFound();
  }

  // Fetch wiki pages (you'll need to create this table)
  const { data: pages } = await supabase
    .from("wiki_pages")
    .select("*")
    .eq("wiki_id", wikiId)
    .order("created_at", { ascending: true });

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
          <Button asChild>
            <Link href={`/wikis/${wikiId}/pages/new`}>
              <Plus className="h-4 w-4 mr-2" />
              New Page
            </Link>
          </Button>
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
              {pages?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No pages yet</p>
              ) : (
                pages?.map((page) => (
                  <Link
                    key={page.id}
                    href={`/wikis/${wikiId}/pages/${page.id}`}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent text-sm group"
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
                Welcome to your new wiki! Get started by creating your first page
                using the "New Page" button above.
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
                    <span className="text-sm text-muted-foreground">
                      {new Date(page.created_at).toLocaleDateString()}
                    </span>
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