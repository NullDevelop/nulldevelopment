import { prisma } from '@/lib/prisma'

export async function getPublicContract(token: string) {
	const contract = await prisma.contract.findUnique({
		where: { publicToken: token },
	})

	if (!contract) return null

	return {
		token,
		contract: {
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
		},
	}
}

export type PublicContract = NonNullable<
	Awaited<ReturnType<typeof getPublicContract>>
>
