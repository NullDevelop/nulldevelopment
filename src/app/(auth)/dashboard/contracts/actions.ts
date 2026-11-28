'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/require-auth'
import { signatureHash } from '@/lib/signature'

const ContractSchema = z.object({
	title: z.string().min(1, 'Informe o título do contrato'),
	clientId: z.string().optional(),
	clientName: z.string().min(1, 'Informe o cliente'),
	clientEmail: z.string().optional(),
	quoteId: z.string().optional(),
	objectClause: z.string().optional(),
	timelineClause: z.string().optional(),
	paymentClause: z.string().optional(),
	ipClause: z.string().optional(),
	totalValue: z.coerce.number().min(0),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
})

export type ContractInput = z.input<typeof ContractSchema>

const allowedStatuses = new Set([
	'rascunho',
	'enviado',
	'assinado',
	'cancelado',
])

function normalize(input: ContractInput) {
	const data = ContractSchema.parse(input)

	return {
		title: data.title.trim(),
		clientId: data.clientId || null,
		clientName: data.clientName.trim(),
		clientEmail: data.clientEmail?.trim() || null,
		quoteId: data.quoteId || null,
		objectClause: data.objectClause?.trim() || null,
		timelineClause: data.timelineClause?.trim() || null,
		paymentClause: data.paymentClause?.trim() || null,
		ipClause: data.ipClause?.trim() || null,
		totalValue: data.totalValue,
		startDate: data.startDate ? new Date(`${data.startDate}T00:00:00`) : null,
		endDate: data.endDate ? new Date(`${data.endDate}T23:59:59`) : null,
	}
}

async function nextNumber() {
	const prefix = `CON-${new Date().getFullYear()}-`
	const contracts = await prisma.contract.findMany({
		where: { number: { startsWith: prefix } },
		select: { number: true },
	})
	const used = new Set(contracts.map((contract) => contract.number))
	let sequence = 1
	while (used.has(`${prefix}${String(sequence).padStart(4, '0')}`))
		sequence += 1
	return `${prefix}${String(sequence).padStart(4, '0')}`
}

async function refresh(id?: string) {
	revalidatePath('/dashboard/contracts')
	revalidatePath('/dashboard')
	if (id) revalidatePath(`/dashboard/contracts/${id}`)
}

export async function createContract(input: ContractInput) {
	await requireAuth()
	const data = normalize(input)

	const contract = await prisma.contract.create({
		data: {
			number: await nextNumber(),
			...data,
		},
	})

	await refresh(contract.id)
	return contract
}

export async function updateContract(id: string, input: ContractInput) {
	await requireAuth()
	const data = normalize(input)

	const contract = await prisma.contract.update({
		where: { id },
		data,
	})

	await refresh(id)
	return contract
}

export async function deleteContract(id: string) {
	await requireAuth()
	await prisma.contract.delete({ where: { id } })
	await refresh()
}

export async function setContractStatus(id: string, status: string) {
	await requireAuth()
	if (!allowedStatuses.has(status)) throw new Error('Status inválido')

	const contract = await prisma.contract.update({
		where: { id },
		data: { status },
	})

	await refresh(id)
	return contract
}

export async function signContractAsProvider(id: string, signerName: string) {
	await requireAuth()
	if (!signerName.trim()) throw new Error('Informe o nome de quem assina')

	const now = new Date()
	const contract = await prisma.contract.update({
		where: { id },
		data: {
			providerSigned: true,
			providerSignedAt: now,
			providerSignerName: signerName.trim(),
			providerSignatureHash: signatureHash(
				'contract',
				id,
				signerName.trim(),
				now.toISOString(),
			),
			status: 'enviado',
			sentAt: now,
		},
	})

	await refresh(id)
	return contract
}
