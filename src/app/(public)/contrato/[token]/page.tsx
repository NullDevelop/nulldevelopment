import { notFound } from 'next/navigation'
import { ContractPublicView } from '@/components/billing/contract-public-view'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function PublicContractPage({
	params,
}: {
	params: Promise<{ token: string }>
}) {
	const { token } = await params
	const contract = await prisma.contract.findUnique({
		where: { publicToken: token },
	})

	if (!contract) notFound()

	return (
		<ContractPublicView
			token={token}
			contract={{
				number: contract.number,
				title: contract.title,
				status: contract.status,
				clientName: contract.clientName,
				clientEmail: contract.clientEmail,
				objectClause: contract.objectClause,
				timelineClause: contract.timelineClause,
				paymentClause: contract.paymentClause,
				ipClause: contract.ipClause,
				totalValue: contract.totalValue,
				startDate: contract.startDate?.toISOString() ?? null,
				endDate: contract.endDate?.toISOString() ?? null,
				providerSigned: contract.providerSigned,
				providerSignerName: contract.providerSignerName,
				providerSignatureHash: contract.providerSignatureHash,
				clientSigned: contract.clientSigned,
				clientSignedAt: contract.clientSignedAt?.toISOString() ?? null,
				clientSignerName: contract.clientSignerName,
				clientSignatureHash: contract.clientSignatureHash,
			}}
		/>
	)
}
