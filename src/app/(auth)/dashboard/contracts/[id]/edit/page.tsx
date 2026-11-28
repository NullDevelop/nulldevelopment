import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/permissions'
import { ContractForm } from '../../_components/contract-form'
import {
	getContractFormData,
	getContractFormOptions,
} from '../../_data-access/get-contracts'

export const dynamic = 'force-dynamic'

export default async function EditContractPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	await requirePermission('billing:read')
	const { id } = await params
	const [contract, options] = await Promise.all([
		getContractFormData(id),
		getContractFormOptions(),
	])

	if (!contract) notFound()

	return (
		<ContractForm
			clients={options.clients}
			quotes={options.quotes}
			contract={contract}
		/>
	)
}
