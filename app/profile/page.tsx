import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"
import { formatDate } from "@/lib/utils"
import { InfoIcon, Settings } from "lucide-react"
import Link from "next/link"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/sign-in")
  }

  // Fetch user's wikis count
  const { count: wikisCount } = await supabase
    .from('wikis')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">Profile</h1>
        <Link href="/settings">
          <Button variant="ghost" size="lg">
          <Settings className="h-auto w-auto" />
          <span className="sr-only">Settings</span>
          </Button>
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.user_metadata?.avatar_url || ""} />
                <AvatarFallback>{user.email?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user.email}</h2>
                <p className="text-sm text-muted-foreground">
                  Member since {formatDate(user.created_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Total Wikis</dt>
                <dd className="text-2xl font-bold">{wikisCount}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Email Preferences</h3>
              <p className="text-sm text-muted-foreground">
                Manage your email notifications and preferences
              </p>
              <Button variant="outline" disabled>Coming Soon</Button>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-destructive">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
              <Button variant="destructive" disabled>Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 