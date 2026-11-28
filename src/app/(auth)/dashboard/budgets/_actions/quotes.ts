'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { calcQuoteTotals } from '@/lib/billing-format'
import { requirePermission } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'
import { signatureHash } from '@/lib/signature'

const QuoteItemSchema = z.object({
	name: z.string().min(1, 'Informe o nome do item'),
	description: z.string().optional(),
	hours: z.coerce.number().min(0),
	monthlyFee: z.coerce.number().min(0).optional(),
	monthlyDuration: z.coerce.number().int().min(1).optional(),
})

const QuoteSchema = z.object({
	title: z.string().min(1, 'Informe o título do orçamento'),
	description: z.string().optional(),
	clientId: z.string().optional(),
	clientName: z.string().min(1, 'Informe o cliente'),
	clientEmail: z.string().optional(),
	hourlyRate: z.coerce.number().min(0),
	discount: z.coerce.number().min(0).max(100).optional(),
	urgencyFee: z.coerce.number().min(0).max(100).optional(),
	entryAmount: z.coerce.number().min(0).optional(),
	installments: z.coerce.number().int().min(1).optional(),
	expirationDate: z.string().optional(),
	items: z.array(QuoteItemSchema).min(1, 'Adicione pelo menos um item'),
})

export type QuoteInput = z.input<typeof QuoteSchema>

const allowedStatuses = new Set([
	'rascunho',
	'enviada',
	'aprovada',
	'recusada',
	'assinada',
	'cancelada',
])

function normalize(input: QuoteInput) {
	const data = QuoteSchema.parse(input)

	return {
		title: data.title.trim(),
		description: data.description?.trim() || null,
		clientId: data.clientId || null,
		clientName: data.clientName.trim(),
		clientEmail: data.clientEmail?.trim() || null,
		hourlyRate: data.hourlyRate,
		discount: data.discount ?? 0,
		urgencyFee: data.urgencyFee ?? 0,
		entryAmount: data.entryAmount ?? 0,
		installments: data.installments ?? 1,
		expirationDate: data.expirationDate
			? new Date(`${data.expirationDate}T23:59:59`)
			: null,
		items: data.items.map((item, index) => ({
			name: item.name.trim(),
			description: item.description?.trim() || null,
			hours: item.hours,
			monthlyFee: item.monthlyFee ?? 0,
			monthlyDuration: item.monthlyDuration ?? 12,
			order: index,
		})),
	}
}

function totals(
	items: Array<{ name: string; hours: number; monthlyFee: number | null }>,
	data: ReturnType<typeof normalize>,
) {
	return calcQuoteTotals(
		items.map((item) => ({
			hours: item.hours,
			monthlyFee: item.monthlyFee,
		})),
		data.hourlyRate,
		data.discount,
		data.urgencyFee,
	)
}

function assertEntryWithinTotal(entryAmount: number, totalValue: number) {
	if (entryAmount > totalValue) {
		throw new Error('A entrada não pode ser maior que o total da proposta.')
	}
}

async function nextNumber() {
	const prefix = `ORC-${new Date().getFullYear()}-`
	const quotes = await prisma.quote.findMany({
		where: { number: { startsWith: prefix } },
		select: { number: true },
	})
	const used = new Set(quotes.map((quote) => quote.number))
	let sequence = 1
	while (used.has(`${prefix}${String(sequence).padStart(4, '0')}`))
		sequence += 1
	return `${prefix}${String(sequence).padStart(4, '0')}`
}

async function refresh(id?: string) {
	revalidatePath('/dashboard/budgets')
	revalidatePath('/dashboard')
	if (id) revalidatePath(`/dashboard/budgets/${id}`)
}

export async function createQuote(input: QuoteInput) {
	await requirePermission('billing:write')
	const data = normalize(input)
	const sum = totals(data.items, data)
	assertEntryWithinTotal(data.entryAmount, sum.totalValue)

	const quote = await prisma.quote.create({
		data: {
			number: await nextNumber(),
			title: data.title,
			description: data.description,
			clientId: data.clientId,
			clientName: data.clientName,
			clientEmail: data.clientEmail,
			hourlyRate: data.hourlyRate,
			discount: data.discount,
			urgencyFee: data.urgencyFee,
			entryAmount: data.entryAmount,
			installments: data.installments,
			expirationDate: data.expirationDate,
			totalHours: sum.totalHours,
			totalValue: sum.totalValue,
			monthlyTotal: sum.monthlyTotal,
			items: {
				create: data.items.map((item) => ({
					name: item.name,
					description: item.description,
					hours: item.hours,
					unitValue: item.hours * data.hourlyRate,
					monthlyFee: item.monthlyFee ?? 0,
					monthlyDuration: item.monthlyDuration ?? 12,
					order: item.order,
				})),
			},
		},
	})

	await refresh(quote.id)
	return quote
}

export async function updateQuote(id: string, input: QuoteInput) {
	await requirePermission('billing:write')
	const data = normalize(input)
	const sum = totals(data.items, data)
	assertEntryWithinTotal(data.entryAmount, sum.totalValue)

	const quote = await prisma.quote.update({
		where: { id },
		data: {
			title: data.title,
			description: data.description,
			clientId: data.clientId,
			clientName: data.clientName,
			clientEmail: data.clientEmail,
			hourlyRate: data.hourlyRate,
			discount: data.discount,
			urgencyFee: data.urgencyFee,
			entryAmount: data.entryAmount,
			installments: data.installments,
			expirationDate: data.expirationDate,
			totalHours: sum.totalHours,
			totalValue: sum.totalValue,
			monthlyTotal: sum.monthlyTotal,
			items: {
				deleteMany: {},
				create: data.items.map((item) => ({
					name: item.name,
					description: item.description,
					hours: item.hours,
					unitValue: item.hours * data.hourlyRate,
					monthlyFee: item.monthlyFee ?? 0,
					monthlyDuration: item.monthlyDuration ?? 12,
					order: item.order,
				})),
			},
		},
	})

	await refresh(id)
	return quote
}

export async function deleteQuote(id: string) {
	await requirePermission('billing:write')
	await prisma.quote.delete({ where: { id } })
	await refresh()
}

export async function setQuoteStatus(id: string, status: string) {
	await requirePermission('billing:write')
	if (!allowedStatuses.has(status)) throw new Error('Status inválido')

	const now = new Date()
	const quote = await prisma.quote.update({
		where: { id },
		data: {
			status,
			...(status === 'enviada' ? { sentAt: now } : {}),
			...(status === 'aprovada' ? { approvedAt: now } : {}),
		},
	})

	await refresh(id)
	return quote
}

export async function signQuoteAsProvider(id: string, signerName: string) {
	await requirePermission('billing:write')
	if (!signerName.trim()) throw new Error('Informe o nome de quem assina')

	const now = new Date()
	const quote = await prisma.quote.update({
		where: { id },
		data: {
			signerName: signerName.trim(),
			signatureHash: signatureHash(
				'quote',
				id,
				signerName.trim(),
				now.toISOString(),
			),
			signedAt: now,
			sentAt: now,
			status: 'enviada',
		},
	})

	await refresh(id)
	return quote
}
