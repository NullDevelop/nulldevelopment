'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/require-auth'

const ClientSchema = z.object({
	name: z.string().min(1, 'Informe o nome do cliente'),
	email: z.string().optional(),
	document: z.string().optional(),
	phone: z.string().optional(),
	address: z.string().optional(),
})

export type ClientInput = z.input<typeof ClientSchema>

function normalize(input: ClientInput) {
	const data = ClientSchema.parse(input)
	return {
		name: data.name.trim(),
		email: data.email?.trim() || null,
		document: data.document?.trim() || null,
		phone: data.phone?.trim() || null,
		address: data.address?.trim() || null,
	}
}

async function refresh() {
	revalidatePath('/dashboard/clients')
	revalidatePath('/dashboard/budgets')
	revalidatePath('/dashboard/contracts')
}

export async function createClient(input: ClientInput) {
	await requireAuth()
	const client = await prisma.client.create({ data: normalize(input) })
	await refresh()
	return client
}

export async function updateClient(id: string, input: ClientInput) {
	await requireAuth()
	const client = await prisma.client.update({
		where: { id },
		data: normalize(input),
	})
	await refresh()
	return client
}

export async function deleteClient(id: string) {
	await requireAuth()
	await prisma.client.delete({ where: { id } })
	await refresh()
}
