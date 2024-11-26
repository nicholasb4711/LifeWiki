import Link from "next/link";
import { ArrowRight, BookOpen, Share2, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PopularPagesDashboard } from "@/components/popular-pages-dashboard"
import { getPopularPages } from "@/app/actions/analytics"
import { getUserActivities } from "@/app/actions/analytics"
import { RecentActivityComponent } from "@/components/recent-activity-component"
import { QuickActions } from "@/components/quick-actions";

interface PopularPage {
  id: string;
  title: string;
  views: number;
  wiki_id: string;
  wiki_title: string;
}

export default async function Index() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get user's wikis count and popular pages if logged in
  let wikisCount = 0;
  let activities = [];
  let popularPages: PopularPage[] = [];
  if (user) {
    const [{ count }, pages, userActivities] = await Promise.all([
      supabase
        .from('wikis')
        .select('*', { count: 'exact'}),
      getPopularPages(),
      getUserActivities()
    ]);
    wikisCount = count || 0;
    popularPages = pages || [];
    activities = userActivities || [];
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Welcome Message - Only shown for logged in users */}
      {user && (
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-none shadow-none">
          <CardContent className="p-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">
                Welcome{user.email ? `, ${user.email.split('@')[0]}` : ''}!
              </h2>
              <p className="text-muted-foreground">
                {wikisCount > 0 ? (
                  <>You have {wikisCount} wiki{wikisCount === 1 ? '' : 's'} in your collection.</>
                ) : (
                  "Ready to start organizing? Create your first wiki to begin."
                )}
              </p>
              {wikisCount === 0 && (
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/wikis/new">
                    Create Your First Wiki
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hero Section */}
      <section className="px-4 w-full rounded-lg py-8 mx-auto text-center lg:py-28 bg-gradient-to-b from-primary/5 via-primary/5 to-transparent">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
          Your Digital Life, Organized
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          LifeWiki helps you capture, organize, and share your life's important information. 
          From personal notes to family documents, everything in one secure place.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href={user ? "/wikis/new" : "/sign-up"}>
              {user ? "Create New Wiki" : "Get Started"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href={user ? "/wikis" : "/about"}>
              {user ? "View Wikis" : "Learn more"}
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<BookOpen className="h-8 w-8" />}
              title="Simple Organization"
              description="Create wikis for different aspects of your life with an intuitive interface."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Secure Storage"
              description="Your data is encrypted and securely stored with enterprise-grade security."
            />
            <FeatureCard
              icon={<Share2 className="h-8 w-8" />}
              title="Easy Sharing"
              description="Share specific wikis with family members or trusted contacts."
            />
          </div>
        </div>
      </section>

      {/* Analytics Section - Only shown for logged in users */}
      {user && (
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <PopularPagesDashboard pages={popularPages} />
              </div>
              <QuickActions />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border">
      <div className="p-3 bg-primary/5 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

