import { prisma } from '@/lib/prisma'

export async function getQuotes() {
	const quotes = await prisma.quote.findMany({
		include: { items: true, client: true },
		orderBy: { createdAt: 'desc' },
	})

	return quotes.map((quote) => ({
		id: quote.id,
		number: quote.number,
		title: quote.title,
		clientName: quote.client?.name ?? quote.clientName,
		clientEmail: quote.client?.email ?? quote.clientEmail,
		status: quote.status,
		totalValue: quote.totalValue,
		itemCount: quote.items.length,
		expirationDate: quote.expirationDate?.toISOString() ?? null,
		createdAt: quote.createdAt.toISOString(),
	}))
}

export async function getQuoteById(id: string) {
	const quote = await prisma.quote.findUnique({
		where: { id },
		include: {
			items: { orderBy: { order: 'asc' } },
			client: true,
		},
	})

	if (!quote) return null

	return {
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
	}
}

export async function getQuoteFormData(id: string) {
	const quote = await prisma.quote.findUnique({
		where: { id },
		include: { items: { orderBy: { order: 'asc' } } },
	})

	if (!quote) return null

	return {
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
	}
}

export type QuoteRow = Awaited<ReturnType<typeof getQuotes>>[number]
export type QuoteDetailData = NonNullable<
	Awaited<ReturnType<typeof getQuoteById>>
>
export type QuoteFormData = NonNullable<
	Awaited<ReturnType<typeof getQuoteFormData>>
>
