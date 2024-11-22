import Link from 'next/link'

export default function RandomPage() {
  return (
    <div className="prose max-w-none animate-fade-in">
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Random Article</h1>
        <p className="text-text-secondary mb-8">
          No articles available yet. Create some articles to use this feature!
        </p>
        <Link href="/create" className="btn-primary">
          Create First Article
        </Link>
      </div>
    </div>
  )
} 