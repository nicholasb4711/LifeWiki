import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils";
import { Edit, ExternalLink } from "lucide-react";
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
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl font-semibold">{wiki.title}</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/wikis/${wiki.id}`}>
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Link>
            </Button>
          </div>
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
  );
}