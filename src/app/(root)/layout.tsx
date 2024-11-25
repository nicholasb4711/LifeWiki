

export default function Layout({ children } : Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <h1>LifeWiki</h1>
      {children}
    </div>
  )
}