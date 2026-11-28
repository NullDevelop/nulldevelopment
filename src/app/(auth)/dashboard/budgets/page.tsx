import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { BudgetsManager } from './budgets-manager'

export const dynamic = 'force-dynamic'

export default async function BudgetsPage() {
	const quotes = await prisma.quote.findMany({
		include: { items: true, client: true },
		orderBy: { createdAt: 'desc' },
	})

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between gap-4">
				<div>
					<h1 className="font-sentient text-3xl font-bold text-foreground">
						Orçamentos
					</h1>
					<p className="font-mono text-sm text-foreground/40 mt-1">
						{quotes.length} proposta{quotes.length !== 1 ? 's' : ''} cadastrada
						{quotes.length !== 1 ? 's' : ''}
					</p>
				</div>
				<Button asChild>
					<Link href="/dashboard/budgets/new">
						<Plus className="size-4" />
						Novo orçamento
					</Link>
				</Button>
			</div>
			<BudgetsManager
				quotes={quotes.map((quote) => ({
					id: quote.id,
					number: quote.number,
					title: quote.title,
					status: quote.status,
					clientName: quote.client?.name ?? quote.clientName,
					totalValue: quote.totalValue,
					itemCount: quote.items.length,
					expirationDate: quote.expirationDate?.toISOString() ?? null,
					createdAt: quote.createdAt.toISOString(),
				}))}
			/>
		</div>
	)
}
