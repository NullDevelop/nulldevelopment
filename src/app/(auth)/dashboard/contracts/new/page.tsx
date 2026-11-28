import { buildContractClauses } from '@/lib/contract-clauses'
import { prisma } from '@/lib/prisma'
import { ContractForm } from '../contract-form'

export const dynamic = 'force-dynamic'

export default async function NewContractPage({
	searchParams,
}: {
	searchParams: Promise<{ quoteId?: string }>
}) {
	const { quoteId } = await searchParams
	const [clients, quotes, quote] = await Promise.all([
		prisma.client.findMany({
			select: { id: true, name: true, email: true },
			orderBy: { name: 'asc' },
		}),
		prisma.quote.findMany({
			select: {
				id: true,
				number: true,
				title: true,
				clientName: true,
				clientEmail: true,
				totalValue: true,
			},
			orderBy: { createdAt: 'desc' },
		}),
		quoteId
			? prisma.quote.findUnique({ where: { id: quoteId } })
			: Promise.resolve(null),
	])

	const preset = quote ? buildContractClauses(quote) : null
	const linkedClientId =
		quote?.clientId && clients.some((client) => client.id === quote.clientId)
			? quote.clientId
			: null

	return (
		<ContractForm
			clients={clients.map((client) => ({
				id: client.id,
				name: client.name,
				email: client.email,
			}))}
			quotes={quotes.map((item) => ({
				id: item.id,
				number: item.number,
				title: item.title,
				clientName: item.clientName,
				clientEmail: item.clientEmail,
				totalValue: item.totalValue,
			}))}
			contract={{
				id: '',
				title: preset?.title ?? '',
				clientId: linkedClientId,
				clientName: quote?.clientName ?? '',
				clientEmail: quote?.clientEmail ?? '',
				quoteId: quote?.id ?? '',
				objectClause: preset?.objectClause ?? '',
				timelineClause: preset?.timelineClause ?? '',
				paymentClause: preset?.paymentClause ?? '',
				ipClause: preset?.ipClause ?? '',
				totalValue: quote?.totalValue ?? 0,
				startDate: quote ? new Date().toISOString().slice(0, 10) : '',
				endDate: quote?.expirationDate?.toISOString().slice(0, 10) ?? '',
			}}
		/>
	)
}
