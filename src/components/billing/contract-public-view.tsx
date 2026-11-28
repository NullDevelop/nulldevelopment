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
import { signContractByToken } from '@/app/actions/public-billing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	contractStatusLabels,
	formatCurrency,
	formatDate,
} from '@/lib/billing-format'
import { company } from '@/lib/company'

interface ContractData {
	number: string
	title: string
	status: string
	clientName: string
	clientEmail: string | null
	objectClause: string | null
	timelineClause: string | null
	paymentClause: string | null
	ipClause: string | null
	totalValue: number
	startDate: string | null
	endDate: string | null
	providerSigned: boolean
	providerSignerName: string | null
	providerSignatureHash: string | null
	clientSigned: boolean
	clientSignedAt: string | null
	clientSignerName: string | null
	clientSignatureHash: string | null
}

const clauses: Array<[string, keyof ContractData]> = [
	['Objeto', 'objectClause'],
	['Prazo', 'timelineClause'],
	['Pagamento', 'paymentClause'],
	['Propriedade intelectual', 'ipClause'],
]

export function ContractPublicView({
	token,
	contract,
}: {
	token: string
	contract: ContractData
}) {
	const [name, setName] = useState('')
	const [signed, setSigned] = useState(contract.clientSigned)
	const [isPending, startTransition] = useTransition()
	const canSign =
		contract.providerSigned && !signed && contract.status === 'enviado'

	function handleSign() {
		startTransition(async () => {
			const result = await signContractByToken(token, name)
			if (!result.success) {
				toast.error(result.error ?? 'Não foi possível registrar a assinatura.')
				return
			}
			setSigned(true)
			toast.success('Contrato assinado com sucesso!')
		})
	}

	return (
		<main className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl space-y-6">
				<div className="flex flex-wrap items-start justify-between gap-4 print:hidden">
					<div>
						<p className="font-mono text-xs uppercase tracking-widest text-primary">
							Null Development · Contrato
						</p>
						<h1 className="mt-2 font-sentient text-3xl font-bold text-foreground sm:text-4xl">
							{contract.title}
						</h1>
						<p className="mt-1 font-mono text-sm text-foreground/40">
							{contract.number} ·{' '}
							{contractStatusLabels[contract.status] ?? contract.status}
						</p>
					</div>
					<Button asChild variant="outline" className="print:hidden">
						<a
							href={`/api/billing/contracts/${token}/pdf`}
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
								Contratado
							</p>
							<p className="mt-1 text-lg font-medium text-foreground">
								{company.ownerName}
							</p>
							<p className="text-sm text-foreground/50">{company.email}</p>
						</div>
						<div>
							<p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
								Contratante
							</p>
							<p className="mt-1 text-lg font-medium text-foreground">
								{contract.clientName}
							</p>
							<p className="text-sm text-foreground/50">
								{contract.clientEmail ?? '—'}
							</p>
						</div>
					</div>

					<div className="mt-6 space-y-6">
						{clauses.map(([title, key]) => {
							const text = contract[key]
							return typeof text === 'string' && text ? (
								<div key={key}>
									<h2 className="font-sentient text-lg font-semibold text-foreground">
										{title}
									</h2>
									<p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/60">
										{text}
									</p>
								</div>
							) : null
						})}
					</div>

					<div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
						<div>
							<p className="font-mono text-xs uppercase tracking-widest text-foreground/40">
								Valor total
							</p>
							<p className="mt-1 font-sentient text-3xl font-bold text-primary">
								{formatCurrency(contract.totalValue)}
							</p>
							<p className="text-xs text-foreground/50">
								{formatDate(contract.startDate)} a{' '}
								{formatDate(contract.endDate)}
							</p>
						</div>
						<div className="space-y-1 text-right">
							<p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
								Assinatura do contratado
							</p>
							<p className="text-sm font-medium text-foreground">
								{contract.providerSignerName ?? 'Pendente'}
							</p>
							<p className="font-mono text-xs text-foreground/40">
								{contract.providerSignatureHash ?? '—'}
							</p>
						</div>
					</div>
				</div>

				<div className="rounded-[2px] border border-white/10 bg-card p-6 sm:p-8 print:hidden">
					{signed || contract.clientSigned ? (
						<div className="flex items-start gap-4">
							<CheckCircle2 className="mt-0.5 size-6 shrink-0 text-green-500" />
							<div>
								<h2 className="font-sentient text-xl font-semibold text-foreground">
									Contrato assinado
								</h2>
								<p className="mt-1 text-sm text-foreground/60">
									Assinado por {contract.clientSignerName ?? 'cliente'} em{' '}
									{formatDate(contract.clientSignedAt)}
								</p>
								{contract.clientSignatureHash ? (
									<p className="mt-2 font-mono text-xs text-foreground/40">
										Hash: {contract.clientSignatureHash}
									</p>
								) : null}
							</div>
						</div>
					) : canSign ? (
						<div>
							<div className="flex items-center gap-3">
								<FileSignature className="size-5 text-primary" />
								<h2 className="font-sentient text-xl font-semibold text-foreground">
									Assinar contrato
								</h2>
							</div>
							<p className="mt-2 text-sm text-foreground/60">
								Digite seu nome completo para registrar sua assinatura digital
								neste contrato.
							</p>
							<div className="mt-5 flex flex-col gap-3 sm:flex-row">
								<Input
									value={name}
									onChange={(event) => setName(event.target.value)}
									placeholder="Seu nome completo"
									aria-label="Nome completo"
								/>
								<Button
									onClick={handleSign}
									disabled={isPending || !name.trim()}
								>
									<ShieldCheck className="mr-2 size-4" />
									{isPending ? 'Assinando...' : 'Assinar contrato'}
								</Button>
							</div>
						</div>
					) : (
						<p className="text-sm text-foreground/60">
							Este contrato ainda não está disponível para assinatura.
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
