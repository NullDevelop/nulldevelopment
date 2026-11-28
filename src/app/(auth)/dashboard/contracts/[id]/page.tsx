import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/permissions'
import { ContractDetail } from '../_components/contract-detail'
import { getContractById } from '../_data-access/get-contracts'

export const dynamic = 'force-dynamic'

export default async function ContractDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	await requirePermission('billing:read')
	const { id } = await params
	const contract = await getContractById(id)

	if (!contract) notFound()

	return <ContractDetail contract={contract} />
}
