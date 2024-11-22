import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import type { NextAuthConfig } from 'next-auth'

const config: NextAuthConfig = {
    providers: [GitHub],
}

export const { handlers, signIn, signOut, auth } = NextAuth(config) 