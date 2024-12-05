import { createWikiAction } from "@/app/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FormMessage } from "@/components/ui/form-message";
import { TagInput } from "@/components/ui/tag-input";

export default function NewWikiPage() {
  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-8">
        <Link
          href="/wikis/my-wikis"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Wikis
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Wiki</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createWikiAction} className="space-y-6">
            <FormMessage message={{
                          success: ""
                      }} />
            
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter wiki title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter wiki description (optional)"
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="isPublic" name="isPublic" value="true" />
              <Label htmlFor="isPublic">Make this wiki public</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <TagInput
                id="tags"
                name="tags"
                placeholder="Add tags..."
              />
              <p className="text-sm text-muted-foreground">
                Separate tags with commas or press Enter
              </p>
            </div>

            <div className="flex gap-4">
              <SubmitButton>Create Wiki</SubmitButton>
              <Button variant="outline" asChild>
                <Link href="/wikis/my-wikis">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}