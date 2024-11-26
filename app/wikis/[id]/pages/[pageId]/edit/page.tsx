import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { updatePageAction } from "@/app/actions";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/ui/submit-button";
import { MarkdownEditor } from "@/components/wiki/markdown-editor";

interface EditPageProps {
  params: Promise<{
    id: string;
    pageId: string;
  }>;
}

export default async function EditPage(props: EditPageProps) {
  const params = await props.params;
  const wikiId = await Promise.resolve(params.id);
  const pageId = await Promise.resolve(params.pageId);
  const supabase = await createClient();

  // Fetch page and wiki details
  const { data: page, error } = await supabase
    .from("pages")
    .select(`
      *,
      wiki:wikis (
        id,
        title,
        user_id
      )
    `)
    .eq("id", pageId)
    .eq("wiki_id", wikiId)
    .single();

  if (error || !page) {
    notFound();
  }

  // Check if user owns the wiki
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || page.wiki.user_id !== user.id) {
    redirect("/wikis");
  }

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-8">
      <div className="flex items-center justify-between">
        <BackButton label={`Back to ${page.title}`} />
      </div>

      <Card className="shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Edit Page</CardTitle>
          <p className="text-sm text-muted-foreground">
            Make changes to your page content
          </p>
        </CardHeader>
        <CardContent>
          <form action={updatePageAction} className="space-y-8">
            <FormMessage message={{
              success: ""
            }}/>
            <input type="hidden" name="wikiId" value={wikiId} />
            <input type="hidden" name="pageId" value={pageId} />

            <div className="space-y-2">
              <Label htmlFor="title" className="text-base">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter page title"
                required
                defaultValue={page.title}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="text" className="text-base">Content</Label>
              <div className="rounded-lg bg-card shadow-sm">
                <MarkdownEditor
                  id="text"
                  name="text"
                  placeholder="Write your content here..."
                  required
                  defaultValue={page.text}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <SubmitButton>Update Page</SubmitButton>
              <Button variant="outline" asChild>
                <Link href={`/wikis/${wikiId}/pages/${pageId}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 