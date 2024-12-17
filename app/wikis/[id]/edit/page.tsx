import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { TagInput } from "@/components/ui/tag-input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FormMessage } from "@/components/ui/form-message";
import { updateWikiAction } from "@/app/actions";

interface EditWikiPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditWikiPage({ params }: EditWikiPageProps) {
  const supabase = await createClient();
  const { id: wikiId } = await Promise.resolve(params);
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Fetch wiki data
  const { data: wiki, error } = await supabase
    .from("wikis")
    .select(`
      *,
      tags:wiki_tags(
        tag:tags(
          name
        )
      )
    `)
    .eq("id", wikiId)
    .single();

  // Fetch all existing tags
  const { data: allTags } = await supabase
    .from("tags")
    .select("name");

  if (error || !wiki) {
    notFound();
  }

  // Check ownership
  if (wiki.user_id !== user.id) {
    redirect("/wikis");
  }

  // Transform tags data
  const currentTags = wiki.tags?.map((t: any) => t.tag.name) || [];
  const tagSuggestions = allTags?.map(t => t.name) || [];

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-8">
        <Link
          href={`/wikis/${wikiId}`}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Wiki
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Wiki</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateWikiAction} className="space-y-6">
            <FormMessage message={{ success: "", error: "" }} />
            
            <input type="hidden" name="id" value={wikiId} />
            
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={wiki.title}
                placeholder="Enter wiki title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={wiki.description || ""}
                placeholder="Enter wiki description (optional)"
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isPublic" 
                name="isPublic" 
                defaultChecked={wiki.is_public}
                value="true" 
              />
              <Label htmlFor="isPublic">Make this wiki public</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <TagInput
                id="tags"
                name="tags"
                defaultValue={currentTags}
                placeholder="Add tags..."
                suggestions={tagSuggestions}
              />
              <p className="text-sm text-muted-foreground">
                Separate tags with commas or press Enter
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit">Save Changes</Button>
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