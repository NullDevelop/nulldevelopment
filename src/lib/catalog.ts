import { prisma } from './prisma'

export interface CatalogOption {
	id: string
	name: string
	description: string
	baseHours: number
	monthlyFee: number
	monthlyDuration: number
	categoryName: string | null
}

/** Opções reutilizáveis para montar propostas detalhadas. */
export async function getCatalogOptions(): Promise<CatalogOption[]> {
	const items = await prisma.catalogItem.findMany({
		include: { category: { select: { name: true } } },
		orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
	})

	return items.map((item) => ({
		id: item.id,
		name: item.name,
		description: item.description,
		baseHours: item.baseHours,
		monthlyFee: item.monthlyFee,
		monthlyDuration: item.monthlyDuration,
		categoryName: item.category?.name ?? null,
	}))
}
