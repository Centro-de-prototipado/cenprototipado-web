export type PortfolioCategory = "Educacion" | "Industria" | "Comunidad"

export type PortfolioProjectMeta = {
  id: string
  slug: string
  title: string
  category: PortfolioCategory
  year: string
  image: string
  summary: string
  challenge: string
  solution: string
  techStack: string[]
  outcomes: string[]
  featured: boolean
}

export type PortfolioProject = PortfolioProjectMeta & {
  content: string
}

export type PortfolioCategoryFilter = "Todos" | PortfolioCategory
