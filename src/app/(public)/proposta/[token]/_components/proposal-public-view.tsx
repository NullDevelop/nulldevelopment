'use client'

import {
	CheckCircle2,
	Download,
	FileSignature,
	ShieldCheck,
} from 'lucide-react'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	describePayment,
	formatCurrency,
	formatDate,
	quoteStatusLabels,
} from '@/lib/billing-format'
import { company } from '@/lib/company'
import { approveQuoteByToken } from '../../../_actions/public-billing'

interface ProposalItem {
	id: string
	name: string
	description: string | null
	hours: number
	unitValue: number
	monthlyFee: number
	monthlyDuration: number
}

interface ProposalData {
	number: string
	title: string
	description: string | null
	status: string
	clientName: string
	clientEmail: string | null
	hourlyRate: number
	discount: number
	urgencyFee: number
	entryAmount: number
	installments: number
	totalHours: number
	totalValue: number
	monthlyTotal: number
	expirationDate: string | null
	signerName: string | null
	signatureHash: string | null
	approvedAt: string | null
	items: ProposalItem[]
}

export function ProposalPublicView({
	token,
	quote,
}: {
	token: string
	quote: ProposalData
}) {
	const [name, setName] = useState('')
	const [approved, setApproved] = useState(quote.status === 'aprovada')
	const [isPending, startTransition] = useTransition()
	const canApprove = quote.status === 'enviada' && !approved
	const payment = describePayment(
		quote.totalValue,
		quote.entryAmount,
		quote.installments,
		quote.monthlyTotal,
	)

	function handleApprove() {
		startTransition(async () => {
			const result = await approveQuoteByToken(token, name)
			if (!result.success) {
				toast.error(result.error ?? 'Não foi possível registrar a aprovação.')
				return
			}
			setApproved(true)
			toast.success('Proposta aprovada com sucesso!')
		})
	}

	return (
		<main className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl space-y-6">
				<div className="flex flex-wrap items-start justify-between gap-4 print:hidden">
					<div>
						<p className="font-mono text-xs uppercase tracking-widest text-primary">
							Null Development · Proposta comercial
						</p>
						<h1 className="mt-2 font-sentient text-3xl font-bold text-foreground sm:text-4xl">
							{quote.title}
						</h1>
						<p className="mt-1 font-mono text-sm text-foreground/40">
							{quote.number} · {company.ownerName}
						</p>
					</div>
					<Button asChild variant="outline" className="print:hidden">
						<a
							href={`/api/billing/quotes/${token}/pdf`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Download className="mr-2 size-4" />
							Baixar PDF
						</a>
					</Button>
				</div>

				<div className="rounded-[2px] border border-white/10 bg-card p-6 sm:p-8">
					<div className="grid gap-6 border-b border-white/10 pb-6 sm:grid-cols-2">
						<div>
							<p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
								Contratante
							</p>
							<p className="mt-1 text-lg font-medium text-foreground">
								{quote.clientName}
							</p>
							<p className="text-sm text-foreground/50">
								{quote.clientEmail ?? '—'}
							</p>
						</div>
						<div>
							<p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
								Validade
							</p>
							<p className="mt-1 text-lg font-medium text-foreground">
								{formatDate(quote.expirationDate)}
							</p>
							<p className="text-sm text-foreground/50">
								{quoteStatusLabels[quote.status] ?? quote.status}
							</p>
						</div>
					</div>

					{quote.description ? (
						<p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-foreground/70">
							{quote.description}
						</p>
					) : null}

					<div className="mt-8">
						<h2 className="font-sentient text-xl font-semibold text-foreground">
							Escopo e investimento
						</h2>
						<div className="mt-4 overflow-x-auto">
							<table className="w-full min-w-[560px] text-left text-sm">
								<thead>
									<tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-widest text-foreground/40">
										<th className="py-3 pr-4">Item</th>
										<th className="py-3 pr-4">Horas</th>
										<th className="py-3 text-right">Valor</th>
									</tr>
								</thead>
								<tbody>
									{quote.items.map((item) => (
										<tr
											key={item.id}
											className="border-b border-white/5 align-top"
										>
											<td className="py-4 pr-4">
												<p className="font-medium text-foreground">
													{item.name}
												</p>
												{item.description ? (
													<p className="mt-1 text-xs text-foreground/50">
														{item.description}
													</p>
												) : null}
											</td>
											<td className="py-4 pr-4 font-mono text-foreground/70">
												{item.hours}
											</td>
											<td className="py-4 text-right font-mono text-foreground">
												{formatCurrency(item.unitValue)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					<div className="mt-8 flex flex-col items-end gap-2 border-t border-white/10 pt-6">
						{quote.discount > 0 || quote.urgencyFee > 0 ? (
							<p className="font-mono text-xs text-foreground/40">
								{quote.discount > 0 ? `${quote.discount}% desconto` : ''}
								{quote.discount > 0 && quote.urgencyFee > 0 ? ' · ' : ''}
								{quote.urgencyFee > 0 ? `${quote.urgencyFee}% urgência` : ''}
							</p>
						) : null}
						<p className="font-mono text-xs uppercase tracking-widest text-foreground/40">
							Total dos serviços
						</p>
						<p className="font-sentient text-3xl font-bold text-primary">
							{formatCurrency(quote.totalValue)}
						</p>
						<div className="mt-2 flex flex-col gap-0.5">
							{payment.lines.map((line) => (
								<p key={line} className="text-xs text-foreground/50">
									{line}
								</p>
							))}
						</div>
					</div>
				</div>

				<div className="rounded-[2px] border border-white/10 bg-card p-6 sm:p-8 print:hidden">
					{approved || quote.status === 'aprovada' ? (
						<div className="flex items-start gap-4">
							<CheckCircle2 className="mt-0.5 size-6 shrink-0 text-green-500" />
							<div>
								<h2 className="font-sentient text-xl font-semibold text-foreground">
									Proposta aprovada
								</h2>
								<p className="mt-1 text-sm text-foreground/60">
									Aprovada por {quote.signerName ?? 'cliente'} em{' '}
									{formatDate(quote.approvedAt)}
								</p>
								{quote.signatureHash ? (
									<p className="mt-2 font-mono text-xs text-foreground/40">
										Hash: {quote.signatureHash}
									</p>
								) : null}
							</div>
						</div>
					) : canApprove ? (
						<div>
							<div className="flex items-center gap-3">
								<FileSignature className="size-5 text-primary" />
								<h2 className="font-sentient text-xl font-semibold text-foreground">
									Aprovar e assinar proposta
								</h2>
							</div>
							<p className="mt-2 text-sm text-foreground/60">
								Digite seu nome completo para registrar a aprovação desta
								proposta.
							</p>
							<div className="mt-5 flex flex-col gap-3 sm:flex-row">
								<Input
									value={name}
									onChange={(event) => setName(event.target.value)}
									placeholder="Seu nome completo"
									aria-label="Nome completo"
								/>
								<Button
									onClick={handleApprove}
									disabled={isPending || !name.trim()}
								>
									<ShieldCheck className="mr-2 size-4" />
									{isPending ? 'Registrando...' : 'Aprovar proposta'}
								</Button>
							</div>
						</div>
					) : (
						<p className="text-sm text-foreground/60">
							Esta proposta ainda não está disponível para aprovação.
						</p>
					)}
				</div>

				<p className="text-center font-mono text-xs text-foreground/30 print:hidden">
					Documento gerado por{' '}
					<Link href="/" className="text-primary hover:underline">
						Null Development
					</Link>
				</p>
			</div>
		</main>
	)
}
