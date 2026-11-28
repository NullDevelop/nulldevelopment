import { prisma } from '@/lib/prisma'

export async function getPublicProposal(token: string) {
	const quote = await prisma.quote.findUnique({
		where: { publicToken: token },
		include: { items: { orderBy: { order: 'asc' } } },
	})

	if (!quote) return null

	return {
		token,
		quote: {
			number: quote.number,
			title: quote.title,
			description: quote.description,
			status: quote.status,
			clientName: quote.clientName,
			clientEmail: quote.clientEmail,
			hourlyRate: quote.hourlyRate,
			discount: quote.discount,
			urgencyFee: quote.urgencyFee,
			entryAmount: quote.entryAmount,
			installments: quote.installments,
			totalHours: quote.totalHours,
			totalValue: quote.totalValue,
			monthlyTotal: quote.monthlyTotal,
			expirationDate: quote.expirationDate?.toISOString() ?? null,
			signerName: quote.signerName,
			signatureHash: quote.signatureHash,
			approvedAt: quote.approvedAt?.toISOString() ?? null,
			items: quote.items.map((item) => ({
				id: item.id,
				name: item.name,
				description: item.description,
				hours: item.hours,
				unitValue: item.unitValue,
				monthlyFee: item.monthlyFee,
				monthlyDuration: item.monthlyDuration,
			})),
		},
	}
}

export type PublicProposal = NonNullable<
	Awaited<ReturnType<typeof getPublicProposal>>
>
