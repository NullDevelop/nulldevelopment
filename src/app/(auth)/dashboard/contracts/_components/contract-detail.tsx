'use client'

import { ArrowLeft, Download, Loader2, Pencil, ShieldCheck } from 'lucide-react'
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
	contractStatusLabels,
	formatCurrency,
	formatDate,
} from '@/lib/billing-format'
import { company } from '@/lib/company'
import {
	deleteContract,
	setContractStatus,
	signContractAsProvider,
} from '../_actions/contracts'
import type { ContractDetailData } from '../_data-access/get-contracts'

export function ContractDetail({ contract }: { contract: ContractDetailData }) {
	const router = useRouter()
	const [signerName, setSignerName] = useState('')
	const [isPending, startTransition] = useTransition()

	function handleStatus(status: string) {
		startTransition(async () => {
			try {
				await setContractStatus(contract.id, status)
				toast.success('Status do contrato atualizado!')
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
				await signContractAsProvider(contract.id, signerName)
				toast.success('Assinatura registrada e contrato enviado!')
				setSignerName('')
				router.refresh()
			} catch (error) {
				console.error(error)
				toast.error('Não foi possível registrar a assinatura.')
			}
		})
	}

	const clauses = [
		{ label: 'Objeto', value: contract.objectClause },
		{ label: 'Prazo', value: contract.timelineClause },
		{ label: 'Pagamento', value: contract.paymentClause },
		{ label: 'Propriedade intelectual', value: contract.ipClause },
	]

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<Button asChild variant="ghost" size="sm" className="mb-2 -ml-3">
						<Link href="/dashboard/contracts">
							<ArrowLeft className="size-4" />
							Voltar
						</Link>
					</Button>
					<div className="flex flex-wrap items-center gap-3">
						<h1 className="font-sentient text-3xl font-bold text-foreground">
							{contract.number}
						</h1>
						<StatusBadge status={contract.status} />
					</div>
					<p className="font-mono text-sm text-foreground/40 mt-1">
						{contract.title} · criado em {formatDate(contract.createdAt)}
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button asChild variant="outline">
						<Link href={`/dashboard/contracts/${contract.id}/edit`}>
							<Pencil className="size-4" />
							Editar
						</Link>
					</Button>
					<Button asChild variant="outline">
						<a
							href={`/api/billing/contracts/${contract.publicToken}/pdf`}
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
						<Label htmlFor="contract-status">Status</Label>
						<Select value={contract.status} onValueChange={handleStatus}>
							<SelectTrigger id="contract-status" className="w-44">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(contractStatusLabels).map(([value, label]) => (
									<SelectItem key={value} value={value}>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="text-right">
						<p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
							Valor total
						</p>
						<p className="font-sentient text-2xl font-bold text-primary">
							{formatCurrency(contract.totalValue)}
						</p>
					</div>
				</div>
				<div className="grid gap-5 border-t border-white/10 pt-5 sm:grid-cols-3">
					<div>
						<p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
							Contratante
						</p>
						<p className="mt-1 font-medium text-foreground">
							{contract.clientName}
						</p>
						<p className="font-mono text-xs text-foreground/50">
							{contract.clientEmail ?? '—'}
						</p>
					</div>
					<div>
						<p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
							Contratado
						</p>
						<p className="mt-1 font-medium text-foreground">
							{company.legalName}
						</p>
						<p className="font-mono text-xs text-foreground/50">
							{company.phone}
						</p>
					</div>
					<div>
						<p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
							Vigência
						</p>
						<p className="mt-1 font-medium text-foreground">
							{formatDate(contract.startDate)} → {formatDate(contract.endDate)}
						</p>
						{contract.quote && (
							<Link
								href={`/dashboard/budgets/${contract.quote.id}`}
								className="font-mono text-xs text-primary hover:underline"
							>
								Orçamento {contract.quote.number}
							</Link>
						)}
					</div>
				</div>
			</section>

			<section className="rounded-[2px] border border-white/10 bg-card p-6 flex flex-col gap-5">
				<h2 className="font-mono text-xs uppercase tracking-widest text-primary">
					Cláusulas
				</h2>
				{clauses.map((clause) => (
					<div
						key={clause.label}
						className="border-t border-white/5 pt-4 first:border-0 first:pt-0"
					>
						<p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
							{clause.label}
						</p>
						<p className="mt-2 text-sm text-foreground/70 whitespace-pre-wrap">
							{clause.value || '—'}
						</p>
					</div>
				))}
			</section>

			<section className="grid gap-4 sm:grid-cols-2">
				<SignatureBlock
					title="Contratado"
					signed={contract.providerSigned}
					signerName={contract.providerSignerName}
					signedAt={contract.providerSignedAt}
					hash={contract.providerSignatureHash}
				/>
				<SignatureBlock
					title="Contratante"
					signed={contract.clientSigned}
					signerName={contract.clientSignerName}
					signedAt={contract.clientSignedAt}
					hash={contract.clientSignatureHash}
				/>
			</section>

			<section className="rounded-[2px] border border-white/10 bg-card p-6 flex flex-col gap-5">
				<h2 className="font-mono text-xs uppercase tracking-widest text-primary">
					Assinatura do contratado
				</h2>
				<div className="flex flex-wrap items-end gap-3">
					<div className="flex flex-col gap-2 min-w-64">
						<Label htmlFor="contract-signer">
							Nome do assinante ({company.ownerName})
						</Label>
						<Input
							id="contract-signer"
							value={signerName}
							onChange={(event) => setSignerName(event.target.value)}
							placeholder={company.ownerName}
							disabled={isPending || contract.providerSigned}
						/>
					</div>
					<Button
						type="button"
						onClick={handleSign}
						disabled={isPending || contract.providerSigned}
					>
						{isPending && <Loader2 className="size-4 animate-spin" />}
						Assinar contrato
					</Button>
				</div>
				<ShareButtons
					path={`/contrato/${contract.publicToken}`}
					message={`Olá! Confira o contrato ${contract.number} - ${contract.title}:`}
					entity="contrato"
				/>
			</section>

			<div className="flex justify-end">
				<DeleteBillingButton
					label="Excluir contrato"
					entity="contrato"
					successMessage="Contrato excluído com sucesso!"
					onDelete={async () => {
						await deleteContract(contract.id)
						router.push('/dashboard/contracts')
						router.refresh()
					}}
				/>
			</div>
		</div>
	)
}

function SignatureBlock({
	title,
	signed,
	signerName,
	signedAt,
	hash,
}: {
	title: string
	signed: boolean
	signerName: string | null
	signedAt: string | null
	hash: string | null
}) {
	return (
		<div className="rounded-[2px] border border-white/10 bg-card p-5">
			<div className="flex items-center gap-2">
				<ShieldCheck
					className={`size-4 ${signed ? 'text-green-400' : 'text-foreground/30'}`}
				/>
				<p className="font-mono text-xs uppercase tracking-widest text-foreground/60">
					{title}
				</p>
				<span
					className={`ml-auto font-mono text-[10px] ${signed ? 'text-green-400' : 'text-foreground/40'}`}
				>
					{signed ? 'assinado' : 'pendente'}
				</span>
			</div>
			<p className="mt-3 text-sm text-foreground">
				{signerName ?? 'Aguardando assinatura'}
			</p>
			<p className="font-mono text-[10px] text-foreground/40 mt-1">
				{signedAt ? formatDate(signedAt) : '—'}
			</p>
			{hash && (
				<p className="font-mono text-[10px] text-foreground/30 break-all mt-2">
					{hash}
				</p>
			)}
		</div>
	)
}
