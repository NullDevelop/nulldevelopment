import { prisma } from './prisma'
import {
	type ProjectCategory,
	type ProjectData,
	parseProjectCategory,
} from './projects-data'

export type { ProjectCategory, ProjectData }

type DbProject = {
	id: string
	title: string
	slug: string
	shortDescription: string
	content: string
	image: string
	images: string[]
	stack: string[]
	link: string | null
	category: string | null
}

function toProjectData(dbProject: DbProject): ProjectData {
	return {
		id: dbProject.id,
		title: dbProject.title,
		slug: dbProject.slug,
		shortDescription: dbProject.shortDescription,
		content: dbProject.content,
		image: dbProject.image,
		images: dbProject.images ?? [],
		stack: dbProject.stack ?? [],
		link: dbProject.link ?? null,
		category: parseProjectCategory(dbProject.category),
	}
}

export async function getProjects(): Promise<ProjectData[]> {
	try {
		const dbProjects = await prisma.project.findMany({
			select: {
				id: true,
				title: true,
				slug: true,
				shortDescription: true,
				image: true,
				images: true,
				link: true,
				stack: true,
				content: true,
				category: true,
			},
			orderBy: { createdAt: 'desc' },
		})

		return dbProjects.map(toProjectData)
	} catch (err) {
		console.error('Error fetching projects from database:', err)
		return []
	}
}

export async function getProjectBySlug(
	slug: string,
): Promise<ProjectData | null> {
	try {
		const dbItem = await prisma.project.findUnique({
			where: { slug },
		})

		return dbItem ? toProjectData(dbItem) : null
	} catch (err) {
		console.error('Error fetching project by slug from database:', err)
		return null
	}
}

/** Slugs from the database, used by static params and sitemap. */
export async function getAllProjectSlugs(): Promise<string[]> {
	try {
		const dbProjects = await prisma.project.findMany({ select: { slug: true } })
		return dbProjects.map((project) => project.slug)
	} catch (err) {
		console.error('Error fetching project slugs from database:', err)
		return []
	}
}
