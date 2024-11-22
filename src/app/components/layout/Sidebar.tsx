import React from 'react'
import Link from 'next/link'
import { NAV_LINKS } from '@/lib/utils/constants'

export function Sidebar() {
  return (
    <aside className="hidden md:block">
      <nav className="space-y-2 sticky top-24">
        <h3 className="font-semibold mb-3">Navigation</h3>
        <ul className="space-y-1">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="nav-link block">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
} 