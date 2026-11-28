import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { QuoteDetail } from './quote-detail'

export const dynamic = 'force-dynamic'

export default async function BudgetDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	const quote = await prisma.quote.findUnique({
		where: { id },
		include: {
			items: { orderBy: { order: 'asc' } },
			client: true,
		},
	})

	if (!quote) notFound()

	return (
		<QuoteDetail
			quote={{
				id: quote.id,
				number: quote.number,
				title: quote.title,
				description: quote.description,
				status: quote.status,
				clientName: quote.client?.name ?? quote.clientName,
				clientEmail: quote.client?.email ?? quote.clientEmail,
				hourlyRate: quote.hourlyRate,
				discount: quote.discount,
				urgencyFee: quote.urgencyFee,
				entryAmount: quote.entryAmount,
				installments: quote.installments,
				totalHours: quote.totalHours,
				totalValue: quote.totalValue,
				monthlyTotal: quote.monthlyTotal,
				expirationDate: quote.expirationDate?.toISOString() ?? null,
				createdAt: quote.createdAt.toISOString(),
				signerName: quote.signerName,
				signatureHash: quote.signatureHash,
				signedAt: quote.signedAt?.toISOString() ?? null,
				publicToken: quote.publicToken,
				items: quote.items.map((item) => ({
					id: item.id,
					name: item.name,
					description: item.description,
					hours: item.hours,
					unitValue: item.unitValue,
					monthlyFee: item.monthlyFee,
					monthlyDuration: item.monthlyDuration,
				})),
			}}
		/>
	)
}
