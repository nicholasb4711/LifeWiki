import { redirect } from 'next/navigation'
import { auth } from '../../../../auth'

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  return (
    <div className="prose max-w-none animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-2 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <div className="space-y-2">
            <p className="text-text-secondary">
              <span className="font-medium text-text-primary">Name:</span> {session.user.name}
            </p>
            <p className="text-text-secondary">
              <span className="font-medium text-text-primary">Email:</span> {session.user.email}
            </p>
          </div>
        </div>

        <div className="bg-surface-2 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Your Contributions</h2>
          <p className="text-text-secondary">No contributions yet.</p>
        </div>
      </div>
    </div>
  )
} 