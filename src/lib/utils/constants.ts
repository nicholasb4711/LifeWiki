export const WIKI_CATEGORIES = [
    'Science',
    'Technology',
    'History',
    'Arts',
    'Philosophy',
    'Nature',
] as const

export const NAV_LINKS = [
    { href: '/', label: 'Main Page' },
    { href: '/articles', label: 'All Articles' },
    { href: '/categories', label: 'Categories' },
    { href: '/recent', label: 'Recent Changes' },
    { href: '/random', label: 'Random Article' },
] as const 