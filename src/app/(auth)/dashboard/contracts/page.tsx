import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { ContractsManager } from './contracts-manager'

export const dynamic = 'force-dynamic'

export default async function ContractsPage() {
	const contracts = await prisma.contract.findMany({
		include: { quote: true, client: true },
		orderBy: { createdAt: 'desc' },
	})

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
			<ContractsManager
				contracts={contracts.map((contract) => ({
					id: contract.id,
					number: contract.number,
					title: contract.title,
					status: contract.status,
					clientName: contract.client?.name ?? contract.clientName,
					totalValue: contract.totalValue,
					providerSigned: contract.providerSigned,
					clientSigned: contract.clientSigned,
					quote: contract.quote
						? { number: contract.quote.number, title: contract.quote.title }
						: null,
					startDate: contract.startDate?.toISOString() ?? null,
					createdAt: contract.createdAt.toISOString(),
				}))}
			/>
		</div>
	)
}
