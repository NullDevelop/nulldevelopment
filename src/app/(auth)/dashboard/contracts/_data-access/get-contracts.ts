import { buildContractClauses } from '@/lib/contract-clauses'
import { prisma } from '@/lib/prisma'

export async function getContracts() {
	const contracts = await prisma.contract.findMany({
		include: { quote: true, client: true },
		orderBy: { createdAt: 'desc' },
	})

	return contracts.map((contract) => ({
		id: contract.id,
		number: contract.number,
		title: contract.title,
		status: contract.status,
		clientName: contract.client?.name ?? contract.clientName,
		totalValue: contract.totalValue,
		providerSigned: contract.providerSigned,
		clientSigned: contract.clientSigned,
		quote: contract.quote
			? { number: contract.quote.number, title: contract.quote.title }
			: null,
		startDate: contract.startDate?.toISOString() ?? null,
		createdAt: contract.createdAt.toISOString(),
	}))
}

export type ContractRow = Awaited<ReturnType<typeof getContracts>>[number]

export async function getContractById(id: string) {
	const contract = await prisma.contract.findUnique({
		where: { id },
		include: { quote: true, client: true },
	})

	if (!contract) return null

	return {
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
	}
}

export type ContractDetailData = NonNullable<
	Awaited<ReturnType<typeof getContractById>>
>

export async function getContractFormData(id: string) {
	const contract = await prisma.contract.findUnique({ where: { id } })

	if (!contract) return null

	return {
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
	}
}

export type ContractFormData = NonNullable<
	Awaited<ReturnType<typeof getContractFormData>>
>

export async function getContractFormOptions(quoteId?: string) {
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

	const initialContract: ContractFormData = {
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
	}

	return {
		clients: clients.map((client) => ({
			id: client.id,
			name: client.name,
			email: client.email,
		})),
		quotes: quotes.map((item) => ({
			id: item.id,
			number: item.number,
			title: item.title,
			clientName: item.clientName,
			clientEmail: item.clientEmail,
			totalValue: item.totalValue,
		})),
		preset,
		linkedClientId,
		initialContract,
	}
}

export type ContractFormOptions = Awaited<
	ReturnType<typeof getContractFormOptions>
>
