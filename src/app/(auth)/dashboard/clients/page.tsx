import { requirePermission } from '@/lib/permissions'
import { ClientsManager } from './_components/clients-manager'
import { getClients } from './_data-access/get-clients'

export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
	await requirePermission('billing:read')
	const clients = await getClients()

	return <ClientsManager clients={clients} />
}
