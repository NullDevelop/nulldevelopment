import { prisma } from '@/lib/prisma'
import { ClientsManager } from './clients-manager'

export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
	const clients = await prisma.client.findMany({
		orderBy: { createdAt: 'desc' },
	})

	return (
		<ClientsManager
			clients={clients.map((client) => ({
				id: client.id,
				name: client.name,
				email: client.email,
				document: client.document,
				phone: client.phone,
				address: client.address,
				createdAt: client.createdAt.toISOString(),
			}))}
		/>
	)
}
