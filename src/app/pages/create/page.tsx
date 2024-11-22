import { redirect } from 'next/navigation'
import { auth } from '../../../../auth'

export default async function CreatePage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  return (
    <div className="prose max-w-none animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Create New Article</h1>
      
      <form className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="input-field w-full"
            placeholder="Article title"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="block font-medium">
            Category
          </label>
          <select id="category" className="input-field w-full">
            <option value="">Select a category</option>
            <option value="science">Science</option>
            <option value="technology">Technology</option>
            <option value="history">History</option>
            <option value="arts">Arts</option>
            <option value="philosophy">Philosophy</option>
            <option value="nature">Nature</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="block font-medium">
            Content
          </label>
          <textarea
            id="content"
            rows={10}
            className="input-field w-full"
            placeholder="Write your article content here..."
          />
        </div>

        <div className="flex gap-4">
          <button type="submit" className="btn-primary">
            Create Article
          </button>
          <button type="button" className="btn-secondary">
            Preview
          </button>
        </div>
      </form>
    </div>
  )
} 