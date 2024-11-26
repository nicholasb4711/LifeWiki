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

  // First get all page IDs for this wiki
  const { data: pages } = await supabase
    .from('pages')
    .select('id')
    .eq('wiki_id', wikiId);

  const pageIds = pages?.map(page => page.id) || [];

  // Get total views for all pages in the wiki
  const { count: totalViews } = await supabase
    .from('page_views')
    .select('*', { count: 'exact' })
    .in('page_id', pageIds);

  // Get unique viewers for the wiki
  const { count: uniqueViewers } = await supabase
    .from('page_views')
    .select('viewer_id', { count: 'exact', head: true })
    .in('page_id', pageIds)
    .not('viewer_id', 'is', null);

  // Get views over time (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: dailyViews } = await supabase
    .from('page_views')
    .select('viewed_at')
    .in('page_id', pageIds)
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

  // Get most viewed pages
  const { data: pagesWithViews } = await supabase
    .from('pages')
    .select(`
      id,
      title,
      wiki_id,
      views:page_views(count)
    `)
    .eq('wiki_id', wikiId);

  // Transform and sort pages by view count
  const formattedPages = pagesWithViews?.map(page => ({
    id: page.id,
    title: page.title,
    wiki_id: page.wiki_id,
    views: page.views.length || 0
  }))
  .sort((a, b) => b.views - a.views)
  .slice(0, 5) || [];

  return {
    totalViews: totalViews || 0,
    uniqueViewers: uniqueViewers || 0,
    pageViews,
    mostViewedPages: formattedPages
  };
} 