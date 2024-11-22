export default function RecentPage() {
  return (
    <div className="prose max-w-none animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Recent Changes</h1>
      
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <button className="btn-secondary">Last 24 Hours</button>
          <button className="btn-secondary">Last Week</button>
          <button className="btn-secondary">Last Month</button>
        </div>

        <div className="bg-surface-2 rounded-xl p-6">
          <p className="text-text-secondary">No recent changes to display.</p>
        </div>
      </div>
    </div>
  )
} 