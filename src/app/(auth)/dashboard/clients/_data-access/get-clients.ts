import { prisma } from '@/lib/prisma'

export async function getClients() {
	const clients = await prisma.client.findMany({
		orderBy: { createdAt: 'desc' },
	})

	return clients.map((client) => ({
		id: client.id,
		name: client.name,
		email: client.email,
		document: client.document,
		phone: client.phone,
		address: client.address,
		createdAt: client.createdAt.toISOString(),
	}))
}

export type ClientRow = Awaited<ReturnType<typeof getClients>>[number]
