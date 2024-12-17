import { Button } from "@/components/ui/button";
import { WikiCard } from "@/components/wiki/wiki-card";
import { createClient } from "@/utils/supabase/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { TagFilter } from "@/components/wiki/tag-filter";

// Add interface at the top of the file
interface WikiTag {
  tag: {
    name: string;
  };
}

interface Wiki {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  tags?: { name: string }[];
}

interface WikisPageProps {
  searchParams: Promise<{
    tags?: string;
  }>;
}

export default async function WikisPage({ searchParams }: WikisPageProps) {
  const supabase = await createClient();
  const params = await searchParams;

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Get selected tags from URL
  const selectedTags = params.tags?.split(',').filter(Boolean) || [];

  // Declare wikis and error variables
  let wikis: any;
  let error: any;

  // Fetch wikis with their tags
  if (selectedTags.length > 0) {
    const { data: filteredWikiIds } = await supabase
      .from('tags')
      .select(`
        wikis:wiki_tags!inner(
          wiki_id
        )
      `)
      .in('name', selectedTags);

    const wikiIds = filteredWikiIds?.map(t => t.wikis[0].wiki_id) || [];

    const { data, error: err } = await supabase
      .from('wikis')
      .select(`
        *,
        tags:wiki_tags(
          tag:tags(
            name
          )
        )
      `)
      .in('id', wikiIds)
      .order('updated_at', { ascending: false });

    wikis = data;
    error = err;
  } else {
    const { data, error: err } = await supabase
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

    wikis = data;
    error = err;
  }

  // Get all available tags with counts
  const { data: tagCounts } = await supabase
    .from('tags')
    .select(`
      name,
      wiki_tags(count)
    `);

  const availableTags = tagCounts?.map(tag => ({
    name: tag.name,
    count: tag.wiki_tags[0].count
  })) || [];

  // Transform wikis data
  const transformedWikis = wikis?.map((wiki: any) => ({
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

      {availableTags.length > 0 && (
        <TagFilter availableTags={availableTags} />
      )}

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
          {transformedWikis.map((wiki: Wiki) => (
            <WikiCard key={wiki.id} wiki={wiki} />
          ))}
        </div>
      )}
    </div>
  );
}