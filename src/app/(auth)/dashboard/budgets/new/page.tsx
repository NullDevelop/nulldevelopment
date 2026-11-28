import { getCatalogOptions } from '@/lib/catalog'
import { prisma } from '@/lib/prisma'
import { QuoteForm } from '../quote-form'

export const dynamic = 'force-dynamic'

export default async function NewBudgetPage() {
	const [clients, catalogItems] = await Promise.all([
		prisma.client.findMany({
			select: { id: true, name: true, email: true },
			orderBy: { name: 'asc' },
		}),
		getCatalogOptions(),
	])

	return (
		<QuoteForm
			clients={clients.map((client) => ({
				id: client.id,
				name: client.name,
				email: client.email,
			}))}
			catalogItems={catalogItems}
		/>
	)
}
