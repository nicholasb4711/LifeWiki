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
  const { data: viewData } = await supabase
    .from('page_views')
    .select('*')
    .in('page_id', pageIds);

  const totalViews = viewData?.length || 0;

  // Get unique viewers by counting distinct viewer_ids
  const uniqueViewers = new Set(viewData?.map(view => view.viewer_id)).size;

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

  // Get most viewed pages with accurate count
  const { data: pagesWithViews } = await supabase
    .from('pages')
    .select(`
      id,
      title,
      wiki_id
    `)
    .eq('wiki_id', wikiId);

  // Count views for each page
  const formattedPages = pagesWithViews?.map(page => {
    const pageViewCount = viewData?.filter(view => view.page_id === page.id).length || 0;
    return {
      id: page.id,
      title: page.title,
      wiki_id: page.wiki_id,
      views: pageViewCount
    };
  })
  .sort((a, b) => b.views - a.views)
  .slice(0, 5) || [];

  return {
    totalViews,
    uniqueViewers,
    pageViews,
    mostViewedPages: formattedPages
  };
}

interface WikiWithViews {
  id: string;
  title: string;
  wiki_id: string;
  views: { count: number }[];
  wiki: {
    title: string;
    is_public: boolean;
    user_id: string;
  };
}

interface PageWithWiki {
  id: string;
  title: string;
  wiki_id: string;
  wiki: {
    title: string;
    is_public: boolean;
    user_id: string;
  };
}

export async function getPopularPages() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // First get all pages with their wiki info
  const { data: pages } = await supabase
    .from('pages')
    .select(`
      id,
      title,
      wiki_id,
      wiki:wikis!inner (
        title,
        is_public,
        user_id
      )
    `) as { data: PageWithWiki[] | null };

  if (!pages) return [];

  // Get all view data for these pages
  const { data: viewData } = await supabase
    .from('page_views')
    .select('*');

  // Transform and filter the data, counting all views
  const popularPages = pages
    .filter(page => page.wiki.user_id === user.id || page.wiki.is_public)
    .map(page => ({
      id: page.id,
      title: page.title,
      views: viewData?.filter(view => view.page_id === page.id).length || 0,
      wiki_id: page.wiki_id,
      wiki_title: page.wiki.title
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  return popularPages;
}

interface Activity {
  id: string;
  action_type: 
    | 'create_page' 
    | 'edit_page' 
    | 'view_page' 
    | 'create_wiki' 
    | 'delete_page'
    | 'delete_wiki'
    | 'update_wiki'
    | 'share_wiki';
  resource_type: 'page' | 'wiki';
  created_at: string;
  page?: {
    id: string;
    title: string;
    wiki_id: string;
    wiki: {
      title: string;
    };
  };
  wiki?: {
    id: string;
    title: string;
  };
}

interface ActivityResponse {
  id: string;
  action_type: string;
  resource_type: string;
  resource_id: string;
  created_at: string;
  metadata: {
    title?: string;
    is_public?: boolean;
  } | null;
  pages: {
    id: string;
    title: string;
    wiki_id: string;
    wikis: {
      id: string;
      title: string;
      is_public: boolean;
      user_id: string;
    }[];
  } | null;
  wikis: {
    id: string;
    title: string;
    is_public: boolean;
    user_id: string;
  } | null;
}

export async function getUserActivities() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Get activities with proper foreign key references
  const { data: activities } = await supabase
    .from('user_activities')
    .select(`
      id,
      action_type,
      resource_type,
      resource_id,
      created_at,
      metadata,
      pages:pages!fkey_resource_id (
        id,
        title,
        wiki_id,
        wikis!inner (
          id,
          title,
          is_public,
          user_id
        )
      ),
      wikis:wikis!fkey_resource_id (
        id,
        title,
        is_public,
        user_id
      )
    `)
    .order('created_at', { ascending: false })
    .limit(10) as { data: ActivityResponse[] | null };

  console.log('Raw activities:', activities); // Keep for debugging

  // Transform the data to match the expected format
  return activities?.map(activity => {
    const isPageActivity = activity.resource_type === 'page';
    const isWikiActivity = activity.resource_type === 'wiki';

    return {
      id: activity.id,
      action_type: activity.action_type as Activity['action_type'],
      resource_type: activity.resource_type as Activity['resource_type'],
      created_at: activity.created_at,
      page: isPageActivity && activity.pages ? {
        id: activity.pages.id,
        title: activity.pages.title,
        wiki_id: activity.pages.wiki_id,
        wiki_title: activity.pages.wikis[0]?.title // Access first wiki in the array
      } : undefined,
      wiki: isWikiActivity && activity.wikis ? {
        id: activity.wikis.id,
        title: activity.wikis.title
      } : activity.metadata?.title ? {
        id: activity.resource_id,
        title: activity.metadata.title
      } : undefined
    };
  }) || [];
} 