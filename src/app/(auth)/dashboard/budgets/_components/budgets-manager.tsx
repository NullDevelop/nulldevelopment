'use client'

import { Pencil, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DeleteBillingButton } from '@/components/billing/delete-billing-button'
import { StatusBadge } from '@/components/billing/status-badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/billing-format'
import { deleteQuote } from '../_actions/quotes'
import type { QuoteRow } from '../_data-access/get-quotes'

export type BudgetRow = QuoteRow

export function BudgetsManager({ quotes }: { quotes: QuoteRow[] }) {
	const router = useRouter()

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
			<div className="rounded-[2px] border border-white/10 bg-card overflow-hidden">
				{quotes.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 gap-3">
						<p className="font-mono text-sm text-foreground/30">
							Nenhum orçamento cadastrado.
						</p>
						<Button asChild variant="outline" size="sm">
							<Link href="/dashboard/budgets/new">
								Criar primeiro orçamento
							</Link>
						</Button>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full min-w-[820px]">
							<thead>
								<tr className="border-b border-white/5">
									<th className="font-mono text-xs text-foreground/40 uppercase tracking-widest text-left px-6 py-4">
										Número
									</th>
									<th className="font-mono text-xs text-foreground/40 uppercase tracking-widest text-left px-6 py-4">
										Título
									</th>
									<th className="font-mono text-xs text-foreground/40 uppercase tracking-widest text-left px-6 py-4">
										Cliente
									</th>
									<th className="font-mono text-xs text-foreground/40 uppercase tracking-widest text-left px-6 py-4">
										Status
									</th>
									<th className="font-mono text-xs text-foreground/40 uppercase tracking-widest text-left px-6 py-4">
										Total
									</th>
									<th className="font-mono text-xs text-foreground/40 uppercase tracking-widest text-left px-6 py-4">
										Validade
									</th>
									<th className="font-mono text-xs text-foreground/40 uppercase tracking-widest text-right px-6 py-4">
										Ações
									</th>
								</tr>
							</thead>
							<tbody>
								{quotes.map((quote) => (
									<tr
										key={quote.id}
										className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors"
									>
										<td className="px-6 py-4 font-mono text-xs text-foreground/50">
											{quote.number}
										</td>
										<td className="px-6 py-4">
											<Link
												href={`/dashboard/budgets/${quote.id}`}
												className="font-medium text-foreground hover:text-primary transition-colors"
											>
												{quote.title}
											</Link>
											<span className="block font-mono text-[10px] text-foreground/30 mt-0.5">
												{quote.itemCount} item
												{quote.itemCount !== 1 ? 's' : ''}
											</span>
										</td>
										<td className="px-6 py-4 text-sm text-foreground/70">
											{quote.clientName}
										</td>
										<td className="px-6 py-4">
											<StatusBadge status={quote.status} />
										</td>
										<td className="px-6 py-4 font-mono text-sm text-foreground">
											{formatCurrency(quote.totalValue)}
										</td>
										<td className="px-6 py-4 font-mono text-xs text-foreground/60">
											{formatDate(quote.expirationDate)}
										</td>
										<td className="px-6 py-4">
											<div className="flex justify-end gap-1">
												<Button
													asChild
													variant="ghost"
													size="icon"
													aria-label={`Editar ${quote.title}`}
												>
													<Link href={`/dashboard/budgets/${quote.id}`}>
														<Pencil className="size-4" />
													</Link>
												</Button>
												<DeleteBillingButton
													entity="orçamento"
													successMessage="Orçamento excluído com sucesso!"
													onDelete={async () => {
														await deleteQuote(quote.id)
														router.refresh()
													}}
												/>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	)
}
