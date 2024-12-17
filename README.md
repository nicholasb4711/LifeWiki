# Next.js Wiki Platform

A modern, collaborative wiki platform built with Next.js 14, Supabase, and TypeScript.

## Technologies Used

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Static type checking
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Icons** - Modern icon set
- **shadcn/ui** - Reusable component library
- **@tailwindcss/typography** - Typography styling for content

### Backend & Database
- **Supabase** - PostgreSQL database and authentication
- **Server Actions** - Next.js server-side mutations
- **Server Components** - React server components for improved performance
- **Row Level Security** - Database-level access control

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
  - View all wikis owned by user
  - Tag support for wikis
  - Analytics dashboard
  - Activity tracking

- **Page Management**
  - Create new pages within wikis
  - Edit existing pages
  - View page content
  - Page history tracking
  - Recent activity display
  - Directory navigation
  - Markdown support
  - Page view tracking

### In Progress
- **Content Enhancement**
  - Rich text editing
  - Markdown support
  - File attachments
  - Image uploads

### Planned Features
- **Collaboration**
  - Real-time editing
  - Comments and discussions
  - User roles and permissions
  - Wiki sharing

- **Content Management**
  - Search functionality
  - Tags and categories
  - Page templates
  - Version history

- **User Interface**
  - Dark mode support
  - Mobile responsiveness
  - Custom themes
  - Keyboard shortcuts

## Database Schema

### Current Tables
- `users` - User information (managed by Supabase Auth)
- `wikis` - Wiki metadata and settings
  - id
  - title
  - description
  - is_public
  - user_id
  - created_at
  - updated_at
  - tags (via wiki_tags junction table)

- `pages` - Wiki pages and content
  - id
  - wiki_id
  - title
  - text
  - created_by
  - updated_by
  - inserted_at
  - updated_at

- `tags` - Wiki categorization
  - id
  - name

- `wiki_tags` - Junction table for wiki-tag relationships
  - wiki_id
  - tag_id

- `user_activities` - Activity tracking
  - user_id
  - action_type
  - resource_type
  - resource_id
  - metadata
  - created_at

## Getting Started

1. Clone the repository
