'use client'

import {
	ArrowLeft,
	Download,
	FileSignature,
	Loader2,
	Pencil,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { DeleteBillingButton } from '@/components/billing/delete-billing-button'
import { ShareButtons } from '@/components/billing/share-buttons'
import { StatusBadge } from '@/components/billing/status-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	describePayment,
	formatCurrency,
	formatDate,
	quoteStatusLabels,
} from '@/lib/billing-format'
import { company } from '@/lib/company'
import {
	deleteQuote,
	setQuoteStatus,
	signQuoteAsProvider,
} from '../_actions/quotes'
import type { QuoteDetailData } from '../_data-access/get-quotes'

export function QuoteDetail({ quote }: { quote: QuoteDetailData }) {
	const router = useRouter()
	const [signerName, setSignerName] = useState('')
	const [isPending, startTransition] = useTransition()
	const canGenerateContract = ['aprovada', 'assinada'].includes(quote.status)
	const alreadySigned =
		quote.status === 'aprovada' || quote.status === 'assinada'

	function handleStatus(status: string) {
		startTransition(async () => {
			try {
				await setQuoteStatus(quote.id, status)
				toast.success('Status da proposta atualizado!')
				router.refresh()
			} catch (error) {
				console.error(error)
				toast.error('Não foi possível atualizar o status.')
			}
		})
	}

	function handleSign() {
		if (!signerName.trim()) {
			toast.error('Informe o nome de quem assina.')
			return
		}
		startTransition(async () => {
			try {
				await signQuoteAsProvider(quote.id, signerName)
				toast.success('Assinatura registrada e proposta enviada!')
				setSignerName('')
				router.refresh()
			} catch (error) {
				console.error(error)
				toast.error('Não foi possível registrar a assinatura.')
			}
		})
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<Button asChild variant="ghost" size="sm" className="mb-2 -ml-3">
						<Link href="/dashboard/budgets">
							<ArrowLeft className="size-4" />
							Voltar
						</Link>
					</Button>
					<div className="flex flex-wrap items-center gap-3">
						<h1 className="font-sentient text-3xl font-bold text-foreground">
							{quote.number}
						</h1>
						<StatusBadge status={quote.status} />
					</div>
					<p className="font-mono text-sm text-foreground/40 mt-1">
						{quote.title} · criada em {formatDate(quote.createdAt)}
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button asChild variant="outline">
						<Link href={`/dashboard/budgets/${quote.id}/edit`}>
							<Pencil className="size-4" />
							Editar
						</Link>
					</Button>
					<Button asChild variant="outline">
						<a
							href={`/api/billing/quotes/${quote.publicToken}/pdf`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Download className="size-4" />
							Baixar PDF
						</a>
					</Button>
				</div>
			</div>

			<section className="rounded-[2px] border border-white/10 bg-card p-6 flex flex-col gap-5">
				<div className="flex flex-wrap items-end justify-between gap-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="quote-status">Status</Label>
						<Select value={quote.status} onValueChange={handleStatus}>
							<SelectTrigger id="quote-status" className="w-44">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(quoteStatusLabels).map(([value, label]) => (
									<SelectItem key={value} value={value}>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					{canGenerateContract && (
						<Button asChild>
							<Link href={`/dashboard/contracts/new?quoteId=${quote.id}`}>
								<FileSignature className="size-4" />
								Gerar contrato
							</Link>
						</Button>
					)}
				</div>
				<div className="grid gap-5 border-t border-white/10 pt-5 sm:grid-cols-2">
					<div>
						<p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
							Cliente
						</p>
						<p className="mt-1 font-medium text-foreground">
							{quote.clientName}
						</p>
						<p className="font-mono text-xs text-foreground/50">
							{quote.clientEmail ?? '—'}
						</p>
					</div>
					<div>
						<p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
							Validade
						</p>
						<p className="mt-1 font-medium text-foreground">
							{formatDate(quote.expirationDate)}
						</p>
						<div className="flex flex-col gap-0.5">
							{describePayment(
								quote.totalValue,
								quote.entryAmount,
								quote.installments,
								quote.monthlyTotal,
							).lines.map((line) => (
								<p key={line} className="font-mono text-xs text-foreground/50">
									{line}
								</p>
							))}
						</div>
					</div>
				</div>
				{quote.description && (
					<div className="border-t border-white/10 pt-5">
						<p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
							Descrição
						</p>
						<p className="mt-2 text-sm text-foreground/70 whitespace-pre-wrap">
							{quote.description}
						</p>
					</div>
				)}
			</section>

			<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<DetailStat label="Horas" value={`${quote.totalHours}`} />
				<DetailStat
					label="Valor/hora"
					value={formatCurrency(quote.hourlyRate)}
				/>
				<DetailStat
					label={`Desconto (${quote.discount}%)`}
					value={formatCurrency(
						quote.totalHours * quote.hourlyRate * (quote.discount / 100),
					)}
				/>
				<DetailStat
					label={`Urgência (${quote.urgencyFee}%)`}
					value={formatCurrency(
						quote.totalHours * quote.hourlyRate * (quote.urgencyFee / 100),
					)}
				/>
				<DetailStat
					label="Mensalidade"
					value={formatCurrency(quote.monthlyTotal)}
				/>
				<DetailStat
					label="Total"
					value={formatCurrency(quote.totalValue)}
					highlight
				/>
			</section>

			<section className="rounded-[2px] border border-white/10 bg-card overflow-hidden">
				<div className="px-6 py-4 border-b border-white/5">
					<h2 className="font-mono text-xs uppercase tracking-widest text-primary">
						Itens da proposta
					</h2>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full min-w-[720px]">
						<thead>
							<tr className="border-b border-white/5">
								<th className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 text-left px-6 py-3">
									Item
								</th>
								<th className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 text-left px-6 py-3">
									Horas
								</th>
								<th className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 text-left px-6 py-3">
									Valor
								</th>
								<th className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 text-left px-6 py-3">
									Mensalidade
								</th>
								<th className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 text-left px-6 py-3">
									Duração
								</th>
							</tr>
						</thead>
						<tbody>
							{quote.items.map((item) => (
								<tr
									key={item.id}
									className="border-b border-white/5 last:border-0"
								>
									<td className="px-6 py-4">
										<span className="font-medium text-foreground">
											{item.name}
										</span>
										{item.description && (
											<span className="block font-mono text-[10px] text-foreground/40 mt-0.5">
												{item.description}
											</span>
										)}
									</td>
									<td className="px-6 py-4 font-mono text-xs text-foreground/60">
										{item.hours}
									</td>
									<td className="px-6 py-4 font-mono text-xs text-foreground">
										{formatCurrency(item.unitValue)}
									</td>
									<td className="px-6 py-4 font-mono text-xs text-foreground/60">
										{formatCurrency(item.monthlyFee)}
									</td>
									<td className="px-6 py-4 font-mono text-xs text-foreground/60">
										{item.monthlyDuration} mes(es)
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section className="rounded-[2px] border border-white/10 bg-card p-6 flex flex-col gap-5">
				<div>
					<h2 className="font-mono text-xs uppercase tracking-widest text-primary">
						Assinatura e compartilhamento
					</h2>
					<p className="font-mono text-[10px] text-foreground/40 mt-2">
						{quote.signedAt
							? `Assinada por ${quote.signerName ?? '—'} em ${formatDate(quote.signedAt)}`
							: 'A proposta ainda não foi assinada.'}
						{quote.signatureHash && (
							<span className="block break-all mt-1">
								Hash: {quote.signatureHash}
							</span>
						)}
					</p>
				</div>
				<div className="flex flex-wrap items-end gap-3">
					<div className="flex flex-col gap-2 min-w-64">
						<Label htmlFor="quote-signer">
							Nome do assinante ({company.ownerName})
						</Label>
						<Input
							id="quote-signer"
							value={signerName}
							onChange={(event) => setSignerName(event.target.value)}
							placeholder={company.ownerName}
							disabled={isPending || alreadySigned}
						/>
					</div>
					<Button
						type="button"
						onClick={handleSign}
						disabled={isPending || alreadySigned}
					>
						{isPending && <Loader2 className="size-4 animate-spin" />}
						Assinar proposta
					</Button>
				</div>
				<ShareButtons
					path={`/proposta/${quote.publicToken}`}
					message={`Olá! Confira a proposta ${quote.number} - ${quote.title}:`}
					entity="proposta"
				/>
			</section>

			<div className="flex justify-end">
				<DeleteBillingButton
					label="Excluir proposta"
					entity="orçamento"
					successMessage="Orçamento excluído com sucesso!"
					onDelete={async () => {
						await deleteQuote(quote.id)
						router.push('/dashboard/budgets')
						router.refresh()
					}}
				/>
			</div>
		</div>
	)
}

function DetailStat({
	label,
	value,
	highlight = false,
}: {
	label: string
	value: string
	highlight?: boolean
}) {
	return (
		<div className="rounded-[2px] border border-white/10 bg-card p-4">
			<p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
				{label}
			</p>
			<p
				className={`font-sentient text-xl font-bold mt-1 ${highlight ? 'text-primary' : 'text-foreground'}`}
			>
				{value}
			</p>
		</div>
	)
}
