import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { FolderOpen, Search, Settings, User } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { signOutAction } from "@/app/actions";

export async function NavBar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5">
        {/* Left section - Logo and main nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            LifeWiki
          </Link>
          
          {/* Only show these links if user is authenticated */}
          {user && (
            <div className="hidden md:flex items-center gap-6">
              <Link 
                href="/wikis" 
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
              >
                <FolderOpen className="h-4 w-4" />
                All Wikis
              </Link>
              <Link 
                href="/wikis/my-wikis" 
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
              >
                <FolderOpen className="h-4 w-4" />
                My Wikis
              </Link>
              <Link 
                href="/search" 
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </Link>
            </div>
          )}
        </div>

        {/* Right section - Auth and settings */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              
              <Link 
                href="/profile" 
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <form action={signOutAction}>
                <Button variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          )}
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
