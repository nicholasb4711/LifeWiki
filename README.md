# Next.js Wiki Platform

A modern, collaborative wiki platform built with Next.js 14, Supabase, and TypeScript.

## Technologies Used

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Static type checking
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Icons** - Modern icon set
- **shadcn/ui** - Reusable component library

### Backend & Database
- **Supabase** - PostgreSQL database and authentication
- **Server Actions** - Next.js server-side mutations
- **Server Components** - React server components for improved performance

### Authentication
- Email/Password authentication
- Password reset functionality
- Protected routes
- Session management

## Features

### Implemented
- **User Authentication**
  - Sign up/Sign in
  - Password reset flow
  - Email verification
  - Protected routes

- **Wiki Management**
  - Create new wikis
  - Public/Private wiki toggle
  - Wiki directory structure
  - Basic wiki metadata (title, description)

### In Progress
- **Wiki Pages**
  - Create and edit wiki pages
  - Markdown support
  - Page hierarchy
  - Page versioning

### Planned Features
- **Collaboration**
  - Real-time editing
  - Comments and discussions
  - User roles and permissions
  - Wiki sharing

- **Content Management**
  - File attachments
  - Image uploads
  - Search functionality
  - Tags and categories

- **User Interface**
  - Dark mode support
  - Mobile responsiveness
  - Custom themes
  - Keyboard shortcuts

## Database Schema

### Current Tables
- `users` - User information (managed by Supabase Auth)
- `wikis` - Wiki metadata and settings
- `wiki_pages` - Individual wiki pages and content

## Getting Started

1. Clone the repository
