import { createClient } from '@/utils/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: wikis } = await supabase.from('wikis').select()

  return <pre>{JSON.stringify(wikis, null, 2)}</pre>
}