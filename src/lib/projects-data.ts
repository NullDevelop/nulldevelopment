export type ProjectCategory = 'governamental' | 'privado' | 'saas' | 'landing'

/** Values accepted by the admin form and by the public portfolio. */
export const projectCategories: Array<{
	value: ProjectCategory
	label: string
}> = [
	{ value: 'governamental', label: 'Setor Público' },
	{ value: 'privado', label: 'Privado / Corporativo' },
	{ value: 'saas', label: 'Plataforma SaaS' },
	{ value: 'landing', label: 'Landing Page' },
]

export function isProjectCategory(value: unknown): value is ProjectCategory {
	return projectCategories.some((category) => category.value === value)
}

export function parseProjectCategory(
	value: unknown,
	fallback: ProjectCategory = 'privado',
): ProjectCategory {
	return isProjectCategory(value) ? value : fallback
}

export function projectCategoryLabel(value: unknown): string {
	const category = parseProjectCategory(value)
	return (
		projectCategories.find((item) => item.value === category)?.label ??
		'Privado / Corporativo'
	)
}

export interface ProjectData {
	id: string
	title: string
	slug: string
	shortDescription: string
	content: string
	image: string
	images: string[]
	stack: string[]
	link: string | null
	category: ProjectCategory
	statusBadge?: string
}
