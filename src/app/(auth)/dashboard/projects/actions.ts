'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { type ProjectCategory, projectCategories } from '@/lib/projects-data'

const categoryValues = projectCategories.map((category) => category.value) as [
	ProjectCategory,
	...ProjectCategory[],
]

const ProjectSchema = z.object({
	title: z.string().min(1),
	slug: z.string().min(1),
	shortDescription: z.string().min(1),
	content: z.string().min(1),
	image: z.string().min(1),
	images: z.array(z.string()),
	stack: z.array(z.string()),
	link: z.string().optional().nullable(),
	category: z.enum(categoryValues),
	companyId: z.string().optional().nullable(),
})

type ProjectInput = z.infer<typeof ProjectSchema>

async function requireAuth() {
	const session = await auth.api.getSession({ headers: await headers() })
	if (!session) throw new Error('Unauthorized')
}

function normalizeProjectData(data: ProjectInput) {
	const parsed = ProjectSchema.parse(data)
	return {
		...parsed,
		link: parsed.link?.trim() || null,
		// The form uses "none" for the empty option; the database expects null.
		companyId:
			parsed.companyId && parsed.companyId !== 'none' ? parsed.companyId : null,
	}
}

export async function createProject(data: ProjectInput) {
	await requireAuth()
	const projectData = normalizeProjectData(data)
	const project = await prisma.project.create({ data: projectData })
	revalidatePath('/dashboard/projects')
	revalidatePath('/')
	revalidatePath(`/projects/${project.slug}`)
	return project
}

export async function updateProject(id: string, data: ProjectInput) {
	await requireAuth()
	const projectData = normalizeProjectData(data)
	const existing = await prisma.project.findUnique({
		where: { id },
		select: { slug: true },
	})
	const project = await prisma.project.update({
		where: { id },
		data: projectData,
	})
	revalidatePath('/dashboard/projects')
	revalidatePath('/')
	revalidatePath(`/projects/${project.slug}`)
	if (existing?.slug && existing.slug !== project.slug) {
		revalidatePath(`/projects/${existing.slug}`)
	}
	return project
}

export async function deleteProject(id: string) {
	await requireAuth()
	const existing = await prisma.project.findUnique({
		where: { id },
		select: { slug: true },
	})
	await prisma.project.delete({ where: { id } })
	revalidatePath('/dashboard/projects')
	revalidatePath('/')
	if (existing?.slug) revalidatePath(`/projects/${existing.slug}`)
}
