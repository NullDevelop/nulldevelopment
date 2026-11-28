import { prisma } from '@/lib/prisma'
import { CatalogManager } from './catalog-manager'

export const dynamic = 'force-dynamic'

export default async function CatalogPage() {
	const categories = await prisma.catalogCategory.findMany({
		include: {
			items: { orderBy: { name: 'asc' } },
		},
		orderBy: [{ order: 'asc' }, { name: 'asc' }],
	})

	return (
		<CatalogManager
			categories={categories.map((category) => ({
				id: category.id,
				name: category.name,
				description: category.description,
				order: category.order,
				items: category.items.map((item) => ({
					id: item.id,
					name: item.name,
					description: item.description,
					baseHours: item.baseHours,
					complexity: item.complexity,
					monthlyFee: item.monthlyFee,
					monthlyDuration: item.monthlyDuration,
					categoryId: item.categoryId,
					categoryName: category.name,
				})),
			}))}
		/>
	)
}
