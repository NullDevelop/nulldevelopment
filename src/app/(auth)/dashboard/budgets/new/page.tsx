import { prisma } from '@/lib/prisma'
import { QuoteForm } from '../quote-form'

export const dynamic = 'force-dynamic'

export default async function NewBudgetPage() {
	const clients = await prisma.client.findMany({
		select: { id: true, name: true, email: true },
		orderBy: { name: 'asc' },
	})

	return (
		<QuoteForm
			clients={clients.map((client) => ({
				id: client.id,
				name: client.name,
				email: client.email,
			}))}
		/>
	)
}
