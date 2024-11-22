export default function ArticlesPage() {
  return (
    <div className="prose max-w-none animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">All Articles</h1>
      
      <div className="space-y-6">
        <div className="flex gap-2 flex-wrap">
          <button className="btn-secondary">Latest</button>
          <button className="btn-secondary">Most Viewed</button>
          <button className="btn-secondary">Alphabetical</button>
        </div>

        <div className="bg-surface-2 rounded-xl p-6">
          <p className="text-text-secondary">No articles yet. Be the first to contribute!</p>
        </div>
      </div>
    </div>
  )
} 