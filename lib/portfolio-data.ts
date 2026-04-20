import { promises as fs } from "node:fs"
import path from "node:path"
import { cache } from "react"
import matter from "gray-matter"

import type {
  PortfolioCategory,
  PortfolioCategoryFilter,
  PortfolioProject,
  PortfolioProjectMeta,
} from "@/lib/portfolio-types"

const PORTFOLIO_CONTENT_DIR = path.join(process.cwd(), "content", "portfolio")

type FrontmatterShape = Partial<PortfolioProjectMeta>

const parseFrontmatter = (
  frontmatter: FrontmatterShape,
  content: string,
  fallbackSlug: string
): PortfolioProject => {
  const category = (frontmatter.category ?? "Educacion") as PortfolioCategory

  return {
    id: frontmatter.id ?? fallbackSlug,
    slug: frontmatter.slug ?? fallbackSlug,
    title: frontmatter.title ?? fallbackSlug,
    category,
    year: frontmatter.year ?? "",
    image: frontmatter.image ?? "/taller.jpg",
    summary: frontmatter.summary ?? "",
    challenge: frontmatter.challenge ?? "",
    solution: frontmatter.solution ?? "",
    techStack: Array.isArray(frontmatter.techStack)
      ? frontmatter.techStack
      : [],
    outcomes: Array.isArray(frontmatter.outcomes) ? frontmatter.outcomes : [],
    featured: Boolean(frontmatter.featured),
    content,
  }
}

const readProjectFromFile = async (
  fileName: string
): Promise<PortfolioProject> => {
  const slug = fileName.replace(/\.md$/, "")
  const filePath = path.join(PORTFOLIO_CONTENT_DIR, fileName)
  const rawContent = await fs.readFile(filePath, "utf8")
  const { data, content } = matter(rawContent)

  return parseFrontmatter(data as FrontmatterShape, content.trim(), slug)
}

export const getPortfolioProjects = cache(
  async (): Promise<PortfolioProjectMeta[]> => {
    const files = await fs.readdir(PORTFOLIO_CONTENT_DIR)
    const markdownFiles = files.filter((file) => file.endsWith(".md"))

    const projects = await Promise.all(markdownFiles.map(readProjectFromFile))

    return projects
      .map(({ content: _content, ...projectMeta }) => projectMeta)
      .sort((a, b) => Number(b.year) - Number(a.year))
  }
)

export const getPortfolioProjectBySlug = cache(
  async (slug: string): Promise<PortfolioProject | null> => {
    const projects = await getAllPortfolioProjectsWithContent()
    return projects.find((project) => project.slug === slug) ?? null
  }
)

export const getFeaturedPortfolioProjects = cache(
  async (): Promise<PortfolioProjectMeta[]> => {
    const projects = await getPortfolioProjects()
    return projects.filter((project) => project.featured)
  }
)

export const getPortfolioCategories = cache(
  async (): Promise<PortfolioCategoryFilter[]> => {
    const projects = await getPortfolioProjects()
    const categories = new Set(projects.map((project) => project.category))
    return ["Todos", ...categories]
  }
)

export const getPortfolioSlugs = cache(async (): Promise<string[]> => {
  const projects = await getPortfolioProjects()
  return projects.map((project) => project.slug)
})

const getAllPortfolioProjectsWithContent = cache(
  async (): Promise<PortfolioProject[]> => {
    const files = await fs.readdir(PORTFOLIO_CONTENT_DIR)
    const markdownFiles = files.filter((file) => file.endsWith(".md"))
    const projects = await Promise.all(markdownFiles.map(readProjectFromFile))

    return projects.sort((a, b) => Number(b.year) - Number(a.year))
  }
)
