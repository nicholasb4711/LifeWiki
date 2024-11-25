import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/back-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit } from "lucide-react";
import { Markdown } from "@/components/markdown";

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
  const isOwner = user?.id === page.wiki.user_id;

  return { page, isOwner };
}

export default async function PageView(props: PageViewProps) {
  const params = await props.params;
  const wikiId = await Promise.resolve(params.id);
  const pageId = await Promise.resolve(params.pageId);
  
  const { page, isOwner } = await getPage(wikiId, pageId);

  return (
    <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 space-y-8">
      <div className="flex items-center justify-between">
        <BackButton label={`Back to ${page.wiki.title}`} />
        {isOwner && (
          <Button asChild size="sm">
            <Link href={`/wikis/${wikiId}/pages/${pageId}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        )}
      </div>

      <article className="prose prose-stone dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold tracking-tight mb-4">{page.title}</h1>
        <div className="text-sm text-muted-foreground mb-8">
          Last updated: {new Date(page.updated_at).toLocaleDateString()}
        </div>
        
        <Markdown content={page.text} />
      </article>
    </div>
  );
} 