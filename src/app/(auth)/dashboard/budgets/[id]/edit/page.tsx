import { notFound } from 'next/navigation'
import { getCatalogOptions } from '@/lib/catalog'
import { prisma } from '@/lib/prisma'
import { QuoteForm } from '../../quote-form'

export const dynamic = 'force-dynamic'

export default async function EditBudgetPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	const [quote, clients, catalogItems] = await Promise.all([
		prisma.quote.findUnique({
			where: { id },
			include: { items: { orderBy: { order: 'asc' } } },
		}),
		prisma.client.findMany({
			select: { id: true, name: true, email: true },
			orderBy: { name: 'asc' },
		}),
		getCatalogOptions(),
	])

	if (!quote) notFound()

	return (
		<QuoteForm
			clients={clients.map((client) => ({
				id: client.id,
				name: client.name,
				email: client.email,
			}))}
			catalogItems={catalogItems}
			quote={{
				id: quote.id,
				title: quote.title,
				description: quote.description,
				clientId: quote.clientId,
				clientName: quote.clientName,
				clientEmail: quote.clientEmail,
				hourlyRate: quote.hourlyRate,
				discount: quote.discount,
				urgencyFee: quote.urgencyFee,
				entryAmount: quote.entryAmount,
				installments: quote.installments,
				expirationDate: quote.expirationDate?.toISOString() ?? null,
				items: quote.items.map((item) => ({
					id: item.id,
					name: item.name,
					description: item.description,
					hours: item.hours,
					monthlyFee: item.monthlyFee,
					monthlyDuration: item.monthlyDuration,
				})),
			}}
		/>
	)
}
