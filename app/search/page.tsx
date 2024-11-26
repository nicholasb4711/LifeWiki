import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { WikiCard } from "@/components/wiki/wiki-card"
import { SearchBar } from "@/components/search/search-bar"

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    sort?: 'title' | 'updated_at' | 'created_at'
    order?: 'asc' | 'desc'
  }>
}

// Add these interfaces
interface Wiki {
  id: string
  title: string
  description: string
  is_public: boolean
  user_id: string
  updated_at: string
  created_at: string
}

interface Page {
  id: string
  title: string
  text: string
  wiki_id: string
  updated_at: string
  inserted_at: string
  wiki: Wiki
}

export default async function SearchPage(props: SearchPageProps) {
  const searchParams = await props.searchParams;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Fetch wikis
  let wikiQuery = supabase
    .from('wikis')
    .select('*')
    .or(`user_id.eq.${user.id},is_public.eq.true`)

  // Fetch pages with their wikis
  let pageQuery = supabase
    .from('pages')
    .select(`
      id,
      title,
      text,
      wiki_id,
      updated_at,
      inserted_at,
      wiki:wikis!inner(*)
    `)
    .not('wiki_id', 'is', null)

  // Apply search if query exists
  if (searchParams.q) {
    wikiQuery = wikiQuery.or(`title.ilike.%${searchParams.q}%,description.ilike.%${searchParams.q}%`)
    pageQuery = pageQuery.or(`title.ilike.%${searchParams.q}%,text.ilike.%${searchParams.q}%`)
  }

  // Apply sorting
  const sortColumn = searchParams.sort || 'updated_at'
  const sortOrder = searchParams.order || 'desc'
  wikiQuery = wikiQuery.order(sortColumn, { ascending: sortOrder === 'asc' })
  pageQuery = pageQuery.order(sortColumn, { ascending: sortOrder === 'asc' })

  const [wikiResult, pageResult] = await Promise.all([
    wikiQuery.returns<Wiki[]>(),
    pageQuery.returns<Page[]>(),
  ])

  const wikis = wikiResult.data || []
  const pages = (pageResult.data || []).filter(
    page => page.wiki && (page.wiki.user_id === user.id || page.wiki.is_public)
  )

  if (wikiResult.error || pageResult.error) {
    console.error('Error fetching data:', wikiResult.error || pageResult.error)
    return <div>Error loading results</div>
  }

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 p-4">
      <h1 className="text-2xl sm:text-3xl font-bold">Search LifeWiki</h1>
      
      <SearchBar 
        defaultQuery={searchParams.q} 
        defaultSort={searchParams.sort}
        defaultOrder={searchParams.order}
      />

      <div className="space-y-6">
        {wikis.length === 0 && pages.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-muted-foreground">
              No results found matching your search.
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="text-sm text-muted-foreground">
              Found {wikis.length} wikis and {pages.length} pages
            </div>
            
            {wikis.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Wikis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wikis.map((wiki) => (
                    <WikiCard key={`wiki-${wiki.id}`} wiki={wiki} />
                  ))}
                </div>
              </div>
            )}

            {pages.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Pages</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pages.map((page) => (
                    <WikiCard 
                      key={`page-${page.id}`} 
                      wiki={{
                        ...page.wiki,
                        id: page.id,
                        title: `${page.wiki.title} > ${page.title}`,
                        description: page.text.substring(0, 200) + '...'
                      }} 
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}