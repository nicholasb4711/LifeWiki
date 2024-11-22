export default function Home() {
  return (
    <div className="prose max-w-none animate-fade-in">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-3 sm:mb-4">Welcome to LifeWiki</h1>
        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto px-4">
          Your collaborative knowledge base for sharing and discovering information.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mt-8 sm:mt-12">
        <div className="bg-surface-2 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all animate-slide-in">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold">Featured Article</h2>
          </div>
          <p className="text-text-secondary text-sm sm:text-base">No featured article yet. Be the first to contribute!</p>
        </div>
        
        <div className="bg-surface-2 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all animate-slide-in [animation-delay:200ms]">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 bg-accent/10 rounded-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold">Recent Changes</h2>
          </div>
          <p className="text-text-secondary text-sm sm:text-base">No recent changes yet.</p>
        </div>
      </div>
    </div>
  )
}
