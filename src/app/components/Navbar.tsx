import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { auth, signOut } from '../../../auth'


const Navbar = async () => {
    const session = await auth()

    return (
        <header className='px-5 pw-3 bg-white shadow-sm font-work-sans'>
            <nav className='flex justify-between items-center'>
                <Link href='/'>
                    <Image src='/next.svg' alt='logo' width={144} height={30} />
                </Link>

                <div className='flex items-center gap-5'>
                    {session && session.user ? (
                        <>
                        <Link href='/profile'>
                            <a>Profile</a>
                        </Link>
                        <button onClick={signOut()}>
                            Sign Out
                        </button>
                        </>
                        ) : (
                            <></>
                        )}

                </div>
            </nav>
        </header>
    )
}

export default Navbar