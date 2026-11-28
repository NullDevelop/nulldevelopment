import { requirePermission } from '@/lib/permissions'
import { ContractForm } from '../_components/contract-form'
import { getContractFormOptions } from '../_data-access/get-contracts'

export const dynamic = 'force-dynamic'

export default async function NewContractPage({
	searchParams,
}: {
	searchParams: Promise<{ quoteId?: string }>
}) {
	await requirePermission('billing:read')
	const { quoteId } = await searchParams
	const options = await getContractFormOptions(quoteId)

	return (
		<ContractForm
			clients={options.clients}
			quotes={options.quotes}
			contract={options.initialContract}
		/>
	)
}
