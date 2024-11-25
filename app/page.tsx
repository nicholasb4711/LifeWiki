import Link from "next/link";
import { ArrowRight, BookOpen, Share2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Index() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Hero Section */}
      <section className="px-4 py-16 mx-auto text-center lg:py-32 bg-gradient-to-b from-primary/5 via-primary/5 to-transparent">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
          Your Digital Life, Organized
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          LifeWiki helps you capture, organize, and share your life's important information. 
          From personal notes to family documents, everything in one secure place.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="/sign-up">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/about">Learn more</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
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
