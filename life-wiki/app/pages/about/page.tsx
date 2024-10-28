import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'About',
    description: 'This is the about page for the Life Wiki app.',
}

export default function About() {
    return (
        <main>
            <h1>About</h1>
            <p>This is a simple wiki app built with Next.js.</p>
            <p>This is the about page</p>
        </main>
    )
}