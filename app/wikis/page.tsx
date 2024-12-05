import { Button } from "@/components/ui/button";
import { WikiCard } from "@/components/wiki/wiki-card";
import { createClient } from "@/utils/supabase/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

// Add interface at the top of the file
interface WikiTag {
  tag: {
    name: string;
  };
}

export default async function WikisPage() {
  const supabase = await createClient();

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Fetch wikis with their tags
  const { data: wikis, error } = await supabase
    .from('wikis')
    .select(`
      *,
      tags:wiki_tags(
        tag:tags(
          name
        )
      )
    `)
    .order('updated_at', { ascending: false });

  // Update the transformation with types
  const transformedWikis = wikis?.map(wiki => ({
    ...wiki,
    tags: wiki.tags?.map((t: WikiTag) => t.tag)
  })) || [];

  if (error) {
    console.error('Error fetching wikis:', error);
    return <div>Error loading wikis</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">All Wikis</h1>
        <Button asChild>
          <Link href="/wikis/new">
            <Plus className="h-4 w-4 mr-2" />
            New Wiki
          </Link>
        </Button>
      </div>

      {transformedWikis.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No wikis yet</h2>
          <p className="text-muted-foreground mb-4">
            Create your first wiki to get started
          </p>
          <Button asChild>
            <Link href="/wikis/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Wiki
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transformedWikis.map((wiki) => (
            <WikiCard key={wiki.id} wiki={wiki} />
          ))}
        </div>
      )}
    </div>
  );
}