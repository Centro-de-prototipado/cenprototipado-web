// Las categorías son de texto libre (definidas como opciones de multi-select en Notion).
export type PortfolioCategory = string

export type PortfolioProjectMeta = {
  id: string
  slug: string
  title: string
  categories: PortfolioCategory[]
  year: string
  image: string
  summary: string
  challenge: string
  solution: string
  techStack: string[]
  outcomes: string[]
  featured: boolean
  partner?: string
}

export type PortfolioProject = PortfolioProjectMeta & {
  content: string
}

export type PortfolioCategoryFilter = "Todos" | PortfolioCategory
