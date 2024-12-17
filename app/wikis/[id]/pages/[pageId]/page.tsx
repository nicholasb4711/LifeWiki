import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit, Trash } from "lucide-react";
import { Markdown } from "@/components/wiki/markdown";
import { deletePageAction } from "@/app/actions";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { trackPageView } from "@/app/actions/analytics"

interface PageViewProps {
  params: Promise<{
    id: string;
    pageId: string;
  }>;
}

async function getPage(wikiId: string, pageId: string) {
  const supabase = await createClient();

  // Fetch page and wiki details
  const { data: page, error } = await supabase
    .from("pages")
    .select(`
      *,
      wiki:wikis (
        id,
        title,
        user_id,
        is_public
      )
    `)
    .eq("id", pageId)
    .eq("wiki_id", wikiId)
    .single();

  if (error || !page) {
    notFound();
  }

  // Check if user has access
  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === page.created_by;

  return { page, isOwner };
}

export default async function PageView(props: PageViewProps) {
  const params = await props.params;
  const wikiId = await Promise.resolve(params.id);
  const pageId = await Promise.resolve(params.pageId);
  
  const { page, isOwner } = await getPage(wikiId, pageId);

  // Track page view
  await trackPageView(pageId);

  const deletePageWithId = async () => {
    "use server"
    const formData = new FormData()
    formData.append("wikiId", wikiId)
    formData.append("pageId", pageId)
    return deletePageAction(formData)
  }

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-8">
      <div className="flex items-center justify-between">
        <BackButton label={`Back to ${page.wiki.title}`} href={`/wikis/${wikiId}`} />
        {isOwner && (
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/wikis/${wikiId}/pages/${pageId}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <ConfirmationDialog
              title="Delete Page"
              description="Are you sure you want to delete this page? This action cannot be undone."
              action={deletePageWithId}
              trigger={
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              }
            />
          </div>
        )}
      </div>

      <article className="prose prose-stone dark:prose-invert max-w-none">
        <div className="not-prose mb-8">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">{page.title}</h1>
          <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
            <span>Last updated: {new Date(page.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="rounded-lg bg-card p-6 shadow-sm border">
          <Markdown content={page.text} />
        </div>
      </article>
    </div>
  );
} 