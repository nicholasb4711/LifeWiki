export interface Article {
  id: string
  title: string
  content: string
  category: string
  authorId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateArticleInput {
  title: string
  content: string
  category: string
} 