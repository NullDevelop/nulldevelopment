import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ContractDetail } from './contract-detail'

export const dynamic = 'force-dynamic'

export default async function ContractDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	const contract = await prisma.contract.findUnique({
		where: { id },
		include: { quote: true, client: true },
	})

	if (!contract) notFound()

	return (
		<ContractDetail
			contract={{
				id: contract.id,
				number: contract.number,
				title: contract.title,
				status: contract.status,
				clientName: contract.client?.name ?? contract.clientName,
				clientEmail: contract.client?.email ?? contract.clientEmail,
				totalValue: contract.totalValue,
				objectClause: contract.objectClause,
				timelineClause: contract.timelineClause,
				paymentClause: contract.paymentClause,
				ipClause: contract.ipClause,
				startDate: contract.startDate?.toISOString() ?? null,
				endDate: contract.endDate?.toISOString() ?? null,
				createdAt: contract.createdAt.toISOString(),
				providerSigned: contract.providerSigned,
				providerSignedAt: contract.providerSignedAt?.toISOString() ?? null,
				providerSignerName: contract.providerSignerName,
				providerSignatureHash: contract.providerSignatureHash,
				clientSigned: contract.clientSigned,
				clientSignedAt: contract.clientSignedAt?.toISOString() ?? null,
				clientSignerName: contract.clientSignerName,
				clientSignatureHash: contract.clientSignatureHash,
				publicToken: contract.publicToken,
				quote: contract.quote
					? {
							id: contract.quote.id,
							number: contract.quote.number,
							title: contract.quote.title,
						}
					: null,
			}}
		/>
	)
}
