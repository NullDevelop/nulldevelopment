import { requirePermission } from '@/lib/permissions'
import { Overview } from './_components/overview'
import { getOverview } from './_data-access/get-overview'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
	await requirePermission('billing:read')
	const overview = await getOverview()

	return <Overview data={overview} />
}
