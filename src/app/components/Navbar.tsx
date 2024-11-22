import React from 'react'
import Link from 'next/link'
import { auth, signOut } from '../../../auth'

const Navbar = async () => {
    const session = await auth()

    return (
        <header className='bg-surface sticky top-0 z-50 border-b border-surface-3 backdrop-blur-sm bg-surface/80'>
            <nav className='max-w-6xl mx-auto px-4 py-4'>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-4 sm:gap-8'>
                        <Link href='/' className='text-lg sm:text-xl font-bold text-primary hover:text-primary-light transition-colors'>
                            LifeWiki
                        </Link>
                        <div className='hidden sm:flex gap-2'>
                            <Link href='/articles' className='nav-link'>Articles</Link>
                            <Link href='/categories' className='nav-link'>Categories</Link>
                        </div>
                    </div>

                    <div className='flex items-center gap-2 sm:gap-4'>
                        <button className='sm:hidden p-2 hover:bg-surface-3 rounded-lg'>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                        <form className='hidden sm:block relative group'>
                            <input 
                                type="search" 
                                placeholder="Search articles..." 
                                className='input-field w-64 pl-10'
                            />
                            <svg 
                                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </form>
                        {session?.user ? (
                            <div className='flex items-center gap-2 sm:gap-3'>
                                <Link href='/create' className='btn-primary text-sm sm:text-base'>
                                    <span className='hidden sm:inline'>Create Article</span>
                                    <span className='sm:hidden'>Create</span>
                                </Link>
                                <div className='hidden sm:block h-6 w-px bg-surface-3'></div>
                                <Link href='/profile' className='nav-link hidden sm:block'>
                                    Profile
                                </Link>
                                <form action={async () => { 'use server'; await signOut(); }}>
                                    <button className='btn-secondary text-sm sm:text-base'>
                                        <span className='hidden sm:inline'>Sign Out</span>
                                        <span className='sm:hidden'>Exit</span>
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <Link href='/api/auth/signin' className='btn-primary text-sm sm:text-base'>
                                Sign In
                            </Link>
                        )}
                        <button className='sm:hidden p-2 hover:bg-surface-3 rounded-lg'>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar