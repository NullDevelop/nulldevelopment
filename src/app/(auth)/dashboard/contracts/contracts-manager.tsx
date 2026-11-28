'use client'

import { Pencil } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DeleteBillingButton } from '@/components/billing/delete-billing-button'
import { StatusBadge } from '@/components/billing/status-badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/billing-format'
import { deleteContract } from './actions'

export interface ContractRow {
	id: string
	number: string
	title: string
	status: string
	clientName: string
	totalValue: number
	providerSigned: boolean
	clientSigned: boolean
	quote: { number: string; title: string } | null
	startDate: string | null
	createdAt: string
}

export function ContractsManager({ contracts }: { contracts: ContractRow[] }) {
	const router = useRouter()

	return (
		<div className="rounded-[2px] border border-white/10 bg-card overflow-hidden">
			{contracts.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-16 gap-3">
					<p className="font-mono text-sm text-foreground/30">
						Nenhum contrato cadastrado.
					</p>
					<Button asChild variant="outline" size="sm">
						<Link href="/dashboard/contracts/new">Criar primeiro contrato</Link>
					</Button>
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full min-w-[900px]">
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
									Orçamento
								</th>
								<th className="font-mono text-xs text-foreground/40 uppercase tracking-widest text-left px-6 py-4">
									Status
								</th>
								<th className="font-mono text-xs text-foreground/40 uppercase tracking-widest text-left px-6 py-4">
									Valor
								</th>
								<th className="font-mono text-xs text-foreground/40 uppercase tracking-widest text-left px-6 py-4">
									Assinaturas
								</th>
								<th className="font-mono text-xs text-foreground/40 uppercase tracking-widest text-right px-6 py-4">
									Ações
								</th>
							</tr>
						</thead>
						<tbody>
							{contracts.map((contract) => (
								<tr
									key={contract.id}
									className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors"
								>
									<td className="px-6 py-4 font-mono text-xs text-foreground/50">
										{contract.number}
									</td>
									<td className="px-6 py-4">
										<Link
											href={`/dashboard/contracts/${contract.id}`}
											className="font-medium text-foreground hover:text-primary transition-colors"
										>
											{contract.title}
										</Link>
										<span className="block font-mono text-[10px] text-foreground/30 mt-0.5">
											Início: {formatDate(contract.startDate)}
										</span>
									</td>
									<td className="px-6 py-4 text-sm text-foreground/70">
										{contract.clientName}
									</td>
									<td className="px-6 py-4 font-mono text-xs text-foreground/50">
										{contract.quote ? contract.quote.number : '—'}
									</td>
									<td className="px-6 py-4">
										<StatusBadge status={contract.status} />
									</td>
									<td className="px-6 py-4 font-mono text-sm text-foreground">
										{formatCurrency(contract.totalValue)}
									</td>
									<td className="px-6 py-4">
										<div className="flex flex-wrap gap-1">
											<span
												className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${contract.providerSigned ? 'border-green-500/25 bg-green-500/10 text-green-400' : 'border-white/10 bg-white/5 text-foreground/40'}`}
											>
												N3 {contract.providerSigned ? 'assinou' : 'pendente'}
											</span>
											<span
												className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${contract.clientSigned ? 'border-green-500/25 bg-green-500/10 text-green-400' : 'border-white/10 bg-white/5 text-foreground/40'}`}
											>
												Cliente {contract.clientSigned ? 'assinou' : 'pendente'}
											</span>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex justify-end gap-1">
											<Button
												asChild
												variant="ghost"
												size="icon"
												aria-label={`Editar ${contract.title}`}
											>
												<Link href={`/dashboard/contracts/${contract.id}`}>
													<Pencil className="size-4" />
												</Link>
											</Button>
											<DeleteBillingButton
												entity="contrato"
												successMessage="Contrato excluído com sucesso!"
												onDelete={async () => {
													await deleteContract(contract.id)
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
	)
}
