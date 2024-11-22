import Link from 'next/link'
import Navbar from '../components/Navbar'

export default function Layout({ children } : Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Mobile Navigation */}
          <div className="md:hidden flex overflow-x-auto pb-4 gap-2 -mx-4 px-4">
            <Link href="/" className="btn-secondary whitespace-nowrap">Main Page</Link>
            <Link href="/recent" className="btn-secondary whitespace-nowrap">Recent Changes</Link>
            <Link href="/random" className="btn-secondary whitespace-nowrap">Random Article</Link>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden md:block">
            <nav className="space-y-2 sticky top-24">
              <h3 className="font-semibold mb-3">Navigation</h3>
              <ul className="space-y-1">
                <li><Link href="/" className="nav-link block">Main Page</Link></li>
                <li><Link href="/recent" className="nav-link block">Recent Changes</Link></li>
                <li><Link href="/random" className="nav-link block">Random Article</Link></li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}