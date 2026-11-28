import { prisma } from '@/lib/prisma'

/** Opções de clientes e catálogo para montar propostas detalhadas. */
export async function getBudgetFormOptions() {
	const [clients, catalogItems] = await Promise.all([
		prisma.client.findMany({
			select: { id: true, name: true, email: true },
			orderBy: { name: 'asc' },
		}),
		prisma.catalogItem.findMany({
			include: { category: { select: { name: true } } },
			orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
		}),
	])

	return {
		clients: clients.map((client) => ({
			id: client.id,
			name: client.name,
			email: client.email,
		})),
		catalogItems: catalogItems.map((item) => ({
			id: item.id,
			name: item.name,
			description: item.description,
			baseHours: item.baseHours,
			complexity: item.complexity,
			monthlyFee: item.monthlyFee,
			monthlyDuration: item.monthlyDuration,
			categoryName: item.category?.name ?? null,
		})),
	}
}

export type BudgetFormOptions = Awaited<ReturnType<typeof getBudgetFormOptions>>
export type ClientOption = BudgetFormOptions['clients'][number]
export type CatalogOption = BudgetFormOptions['catalogItems'][number]
