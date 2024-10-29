export default function DashboardLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <section>
        <nav>Dashboard layout</nav>
        {children}
      </section>
    )
  }