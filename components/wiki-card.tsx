import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface WikiCardProps {
  wiki: {
    id: string;
    title: string;
    description?: string;
    created_at: string;
    updated_at: string;
    user_id: string;
  };
  authorName?: string;
}

export function WikiCard({ wiki, authorName }: WikiCardProps) {
  return (
    <Link href={`/wikis/${wiki.id}`} className="block group">
      <Card className="flex flex-col h-full hover:bg-primary-100/80 dark:hover:bg-primary-500/10 hover:border hover:border-primary transition-colors hover:scale-105 transition-transform duration-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-xl font-semibold">{wiki.title}</span>
            <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </CardTitle>
          {authorName && (
            <p className="text-sm text-muted-foreground">
              By {authorName}
            </p>
          )}
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {wiki.description || "No description provided"}
          </p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <div className="flex flex-col gap-1">
            <span>Created: {formatDate(wiki.created_at)}</span>
            <span>Last updated: {formatDate(wiki.updated_at)}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}