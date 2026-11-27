import { prisma } from './prisma'
import {
	curatedProjects,
	type ProjectCategory,
	type ProjectData,
	parseProjectCategory,
} from './projects-data'

export { curatedProjects, type ProjectCategory, type ProjectData }

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

		const dbMap = new Map(dbProjects.map((project) => [project.slug, project]))
		const curatedSlugs = new Set(curatedProjects.map((project) => project.slug))

		const curatedWithDbData = curatedProjects.map((curated) => {
			const dbItem = dbMap.get(curated.slug)
			if (!dbItem) return curated
			return {
				...toProjectData(dbItem),
				// The curated list is the only source for translated badges for now.
				statusBadge: curated.statusBadge,
			}
		})

		// Projects created in the dashboard are now part of the public portfolio too.
		const dbOnlyProjects = dbProjects
			.filter((project) => !curatedSlugs.has(project.slug))
			.map(toProjectData)

		return [...curatedWithDbData, ...dbOnlyProjects]
	} catch (err) {
		console.error('Error fetching projects from database, using curated list:', err)
		return curatedProjects
	}
}

export async function getProjectBySlug(slug: string): Promise<ProjectData | null> {
	const curated = curatedProjects.find((project) => project.slug === slug)

	try {
		const dbItem = await prisma.project.findUnique({
			where: { slug },
		})

		if (dbItem) {
			return {
				...toProjectData(dbItem),
				statusBadge: curated?.statusBadge,
			}
		}
	} catch (err) {
		console.error('Error fetching project by slug from database:', err)
	}

	return curated ?? null
}

/** Slugs from both the curated list and the database, used by static params and sitemap. */
export async function getAllProjectSlugs(): Promise<string[]> {
	const slugs = new Set(curatedProjects.map((project) => project.slug))

	try {
		const dbProjects = await prisma.project.findMany({ select: { slug: true } })
		for (const project of dbProjects) slugs.add(project.slug)
	} catch (err) {
		console.error('Error fetching project slugs from database:', err)
	}

	return [...slugs]
}
