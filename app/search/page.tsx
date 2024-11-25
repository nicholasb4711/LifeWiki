import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WikiCard } from "@/components/wiki-card"
import { SearchBar } from "@/components/search-bar"

interface SearchPageProps {
  searchParams: {
    q?: string
    sort?: 'title' | 'updated_at' | 'created_at'
    order?: 'asc' | 'desc'
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  let query = supabase
    .from('wikis')
    .select('*')
    .or(`user_id.eq.${user.id},is_public.eq.true`)

  // Apply search if query exists
  if (searchParams.q) {
    query = query.or(`title.ilike.%${searchParams.q}%,description.ilike.%${searchParams.q}%`)
  }

  // Apply sorting
  const sortColumn = searchParams.sort || 'updated_at'
  const sortOrder = searchParams.order || 'desc'
  query = query.order(sortColumn, { ascending: sortOrder === 'asc' })

  const { data: wikis, error } = await query

  if (error) {
    console.error('Error fetching wikis:', error)
    return <div>Error loading wikis</div>
  }

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Search LifeWiki</h1>
      
      <SearchBar 
        defaultQuery={searchParams.q} 
        defaultSort={searchParams.sort}
        defaultOrder={searchParams.order}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wikis.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-muted-foreground">
              No wikis found matching your search.
            </CardContent>
          </Card>
        ) : (
          wikis.map((wiki) => (
            <WikiCard key={wiki.id} wiki={wiki} />
          ))
        )}
      </div>
    </div>
  )
}