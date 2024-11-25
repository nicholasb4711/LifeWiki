import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "@/components/back-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { createPageAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { MarkdownEditor } from "@/components/markdown-editor"

interface NewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NewPage(props: NewPageProps) {
  const params = await props.params;
  const wikiId = await Promise.resolve(params.id);
  const supabase = await createClient();

  // Verify wiki exists and user has access
  const { data: wiki, error } = await supabase
    .from("wikis")
    .select("*")
    .eq("id", wikiId)
    .single();

  if (error || !wiki) {
    notFound();
  }

  // Check if user owns the wiki
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || wiki.user_id !== user.id) {
    redirect("/wikis");
  }

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-8">
      <BackButton label={`Back to ${wiki.title}`} />

      <Card>
        <CardHeader>
          <CardTitle>Create New Page</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPageAction} className="space-y-6">
            <FormMessage message={{
              success: ""
            }} />
            <input type="hidden" name="wikiId" value={wikiId} />

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter page title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="text">Content</Label>
              <MarkdownEditor
                id="text"
                name="text"
                placeholder="Write your content here..."
                required
              />
            </div>

            <div className="flex gap-4">
              <SubmitButton>Create Page</SubmitButton>
              <Button variant="outline" asChild>
                <Link href={`/wikis/${wikiId}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 