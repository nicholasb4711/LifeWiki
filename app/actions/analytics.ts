"use server"

import { createClient } from "@/utils/supabase/server";

export async function trackActivity(
  actionType: string,
  resourceType: string,
  resourceId: string,
  metadata?: any
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("user_activities").insert({
    user_id: user.id,
    action_type: actionType,
    resource_type: resourceType,
    resource_id: resourceId,
    metadata
  });
}

export async function trackPageView(pageId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("page_views").insert({
    page_id: pageId,
    viewer_id: user.id
  });
}

export async function getWikiAnalytics(wikiId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Get total views
  const { count: totalViews } = await supabase
    .from('page_views')
    .select('*', { count: 'exact' })
    .eq('wiki_id', wikiId);

  // Get unique viewers
  const { count: uniqueViewers } = await supabase
    .from('page_views')
    .select('viewer_id', { count: 'exact', head: true })
    .eq('wiki_id', wikiId)
    .not('viewer_id', 'is', null);

  // Get views over time (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: dailyViews } = await supabase
    .from('page_views')
    .select('viewed_at')
    .eq('wiki_id', wikiId)
    .gte('viewed_at', thirtyDaysAgo.toISOString());

  // Format daily views for chart
  const viewsByDate = dailyViews?.reduce((acc: Record<string, number>, view) => {
    const date = new Date(view.viewed_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const pageViews = Object.entries(viewsByDate || {}).map(([date, views]) => ({
    date,
    views,
  }));

  // Get most viewed pages with count
  const { data: mostViewedPages } = await supabase
    .from('pages')
    .select(`
      id,
      title,
      wiki_id,
      view_count:page_views(count)
    `)
    .eq('wiki_id', wikiId)
    .order('view_count', { ascending: false })
    .limit(5);

  // Transform the data to match the expected format
  const formattedPages = mostViewedPages?.map(page => ({
    id: page.id,
    title: page.title,
    wiki_id: page.wiki_id,
    views: page.view_count?.[0]?.count || 0 // Extract the count from the array
  })) || [];

  return {
    totalViews: totalViews || 0,
    uniqueViewers: uniqueViewers || 0,
    pageViews,
    mostViewedPages: formattedPages
  };
} 