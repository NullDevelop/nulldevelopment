import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { requirePermission } from '@/lib/permissions'
import { ContractsManager } from './_components/contracts-manager'
import { getContracts } from './_data-access/get-contracts'

export const dynamic = 'force-dynamic'

export default async function ContractsPage() {
	await requirePermission('billing:read')
	const contracts = await getContracts()

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between gap-4">
				<div>
					<h1 className="font-sentient text-3xl font-bold text-foreground">
						Contratos
					</h1>
					<p className="font-mono text-sm text-foreground/40 mt-1">
						{contracts.length} contrato{contracts.length !== 1 ? 's' : ''}{' '}
						cadastrado{contracts.length !== 1 ? 's' : ''}
					</p>
				</div>
				<Button asChild>
					<Link href="/dashboard/contracts/new">
						<Plus className="size-4" />
						Novo contrato
					</Link>
				</Button>
			</div>
			<ContractsManager contracts={contracts} />
		</div>
	)
}
