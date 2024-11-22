import Link from 'next/link'

export default function CategoriesPage() {
  return (
    <div className="prose max-w-none animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {['Science', 'Technology', 'History', 'Arts', 'Philosophy', 'Nature'].map((category) => (
          <Link 
            key={category} 
            href={`/categories/${category.toLowerCase()}`}
            className="group no-underline"
          >
            <div className="bg-surface-2 rounded-xl p-6 hover:shadow-md transition-all">
              <h2 className="text-xl font-semibold text-primary group-hover:text-primary-light mb-2">
                {category}
              </h2>
              <p className="text-text-secondary text-sm">
                Browse articles about {category.toLowerCase()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 