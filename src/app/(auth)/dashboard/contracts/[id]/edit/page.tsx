import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ContractForm } from '../../contract-form'

export const dynamic = 'force-dynamic'

export default async function EditContractPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	const [contract, clients, quotes] = await Promise.all([
		prisma.contract.findUnique({ where: { id } }),
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
	])

	if (!contract) notFound()

	return (
		<ContractForm
			clients={clients.map((client) => ({
				id: client.id,
				name: client.name,
				email: client.email,
			}))}
			quotes={quotes.map((quote) => ({
				id: quote.id,
				number: quote.number,
				title: quote.title,
				clientName: quote.clientName,
				clientEmail: quote.clientEmail,
				totalValue: quote.totalValue,
			}))}
			contract={{
				id: contract.id,
				title: contract.title,
				clientId: contract.clientId,
				clientName: contract.clientName,
				clientEmail: contract.clientEmail,
				quoteId: contract.quoteId,
				objectClause: contract.objectClause,
				timelineClause: contract.timelineClause,
				paymentClause: contract.paymentClause,
				ipClause: contract.ipClause,
				totalValue: contract.totalValue,
				startDate: contract.startDate?.toISOString() ?? null,
				endDate: contract.endDate?.toISOString() ?? null,
			}}
		/>
	)
}
