export type ProjectCategory = 'governamental' | 'privado' | 'pessoal'

/** Values accepted by the admin form and by the public portfolio. */
export const projectCategories: Array<{
	value: ProjectCategory
	label: string
}> = [
	{ value: 'governamental', label: 'Setor Público' },
	{ value: 'privado', label: 'Empresa Privada' },
	{ value: 'pessoal', label: 'Projetos Pessoais' },
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
		'Empresa Privada'
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
