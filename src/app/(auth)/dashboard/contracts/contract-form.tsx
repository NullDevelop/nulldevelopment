'use client'

import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState, useTransition } from 'react'
import { toast } from 'sonner'
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
import { Textarea } from '@/components/ui/textarea'
import { type ContractInput, createContract, updateContract } from './actions'

export interface ContractClientOption {
	id: string
	name: string
	email: string | null
}

export interface ContractQuoteOption {
	id: string
	number: string
	title: string
	clientName: string
	clientEmail: string | null
	totalValue: number
}

export interface ContractFormData {
	id: string
	title: string
	clientId: string | null
	clientName: string
	clientEmail: string | null
	quoteId: string | null
	objectClause: string | null
	timelineClause: string | null
	paymentClause: string | null
	ipClause: string | null
	totalValue: number
	startDate: string | null
	endDate: string | null
}

const clauses = [
	{
		key: 'objectClause' as const,
		label: 'Cláusula de objeto',
		placeholder: 'Descreva o objeto do contrato',
	},
	{
		key: 'timelineClause' as const,
		label: 'Cláusula de prazo',
		placeholder: 'Descreva os prazos de execução',
	},
	{
		key: 'paymentClause' as const,
		label: 'Cláusula de pagamento',
		placeholder: 'Descreva valores e condições de pagamento',
	},
	{
		key: 'ipClause' as const,
		label: 'Propriedade intelectual',
		placeholder: 'Descreva a transferência de direitos',
	},
]

export function ContractForm({
	clients,
	quotes,
	contract,
}: {
	clients: ContractClientOption[]
	quotes: ContractQuoteOption[]
	contract?: ContractFormData
}) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const linkedClient = clients.find(
		(client) => client.id === contract?.clientId,
	)
	const [clientMode, setClientMode] = useState(
		linkedClient ? linkedClient.id : 'manual',
	)
	const [values, setValues] = useState({
		title: contract?.title ?? '',
		clientName: contract?.clientName || linkedClient?.name || '',
		clientEmail: contract?.clientEmail || linkedClient?.email || '',
		quoteId: contract?.quoteId ?? '',
		objectClause: contract?.objectClause ?? '',
		timelineClause: contract?.timelineClause ?? '',
		paymentClause: contract?.paymentClause ?? '',
		ipClause: contract?.ipClause ?? '',
		totalValue: String(contract?.totalValue ?? 0),
		startDate: contract?.startDate?.slice(0, 10) ?? '',
		endDate: contract?.endDate?.slice(0, 10) ?? '',
	})

	function setField(key: keyof typeof values, value: string) {
		setValues((current) => ({ ...current, [key]: value }))
	}

	function handleClientChange(value: string) {
		setClientMode(value)
		if (value === 'manual') {
			setField('clientName', '')
			setField('clientEmail', '')
			return
		}
		const client = clients.find((option) => option.id === value)
		setField('clientName', client?.name ?? '')
		setField('clientEmail', client?.email ?? '')
	}

	function handleQuoteChange(value: string) {
		const quoteId = value === 'none' ? '' : value
		setField('quoteId', quoteId)
		const quote = quotes.find((option) => option.id === quoteId)
		if (!quote) return
		if (!values.clientName.trim()) setField('clientName', quote.clientName)
		if (!values.clientEmail.trim())
			setField('clientEmail', quote.clientEmail ?? '')
		if (!values.title.trim()) setField('title', `Contrato - ${quote.title}`)
		if (!Number(values.totalValue))
			setField('totalValue', String(quote.totalValue))
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (!values.title.trim()) {
			toast.error('Informe o título do contrato.')
			return
		}
		if (!values.clientName.trim()) {
			toast.error('Informe o cliente.')
			return
		}

		const input: ContractInput = {
			title: values.title,
			clientId: clientMode === 'manual' ? undefined : clientMode,
			clientName: values.clientName,
			clientEmail: values.clientEmail || undefined,
			quoteId: values.quoteId || undefined,
			objectClause: values.objectClause || undefined,
			timelineClause: values.timelineClause || undefined,
			paymentClause: values.paymentClause || undefined,
			ipClause: values.ipClause || undefined,
			totalValue: Number(values.totalValue) || 0,
			startDate: values.startDate || undefined,
			endDate: values.endDate || undefined,
		}

		startTransition(async () => {
			try {
				const saved = contract
					? await updateContract(contract.id, input)
					: await createContract(input)
				toast.success(
					contract
						? 'Contrato atualizado com sucesso!'
						: 'Contrato criado com sucesso!',
				)
				router.push(`/dashboard/contracts/${saved.id}`)
				router.refresh()
			} catch (error) {
				console.error(error)
				toast.error('Não foi possível salvar o contrato.')
			}
		})
	}

	return (
		<div className="flex flex-col gap-6">
			<div>
				<Button asChild variant="ghost" size="sm" className="mb-2 -ml-3">
					<Link href="/dashboard/contracts">
						<ArrowLeft className="size-4" />
						Voltar
					</Link>
				</Button>
				<h1 className="font-sentient text-3xl font-bold text-foreground">
					{contract ? 'Editar contrato' : 'Novo contrato'}
				</h1>
				<p className="font-mono text-sm text-foreground/40 mt-1">
					Configure as cláusulas e as partes do instrumento.
				</p>
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col gap-6">
				<section className="rounded-[2px] border border-white/10 bg-card p-6 flex flex-col gap-5">
					<h2 className="font-mono text-xs uppercase tracking-widest text-primary">
						Identificação
					</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="flex flex-col gap-2">
							<Label htmlFor="contract-title">Título *</Label>
							<Input
								id="contract-title"
								value={values.title}
								onChange={(event) => setField('title', event.target.value)}
								placeholder="Contrato de desenvolvimento"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="contract-quote">Orçamento vinculado</Label>
							<Select
								value={values.quoteId || 'none'}
								onValueChange={handleQuoteChange}
							>
								<SelectTrigger id="contract-quote">
									<SelectValue placeholder="Selecione um orçamento" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">Nenhum</SelectItem>
									{quotes.map((quote) => (
										<SelectItem key={quote.id} value={quote.id}>
											{quote.number} · {quote.title}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="contract-client-select">Cliente</Label>
							<Select value={clientMode} onValueChange={handleClientChange}>
								<SelectTrigger id="contract-client-select">
									<SelectValue placeholder="Selecione um cliente" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="manual">Informar manualmente</SelectItem>
									{clients.map((client) => (
										<SelectItem key={client.id} value={client.id}>
											{client.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						{clientMode === 'manual' && (
							<>
								<div className="flex flex-col gap-2">
									<Label htmlFor="contract-client-name">
										Nome do cliente *
									</Label>
									<Input
										id="contract-client-name"
										value={values.clientName}
										onChange={(event) =>
											setField('clientName', event.target.value)
										}
										placeholder="Nome do contratante"
									/>
								</div>
								<div className="flex flex-col gap-2 sm:col-start-2">
									<Label htmlFor="contract-client-email">
										E-mail do cliente
									</Label>
									<Input
										id="contract-client-email"
										type="email"
										value={values.clientEmail}
										onChange={(event) =>
											setField('clientEmail', event.target.value)
										}
										placeholder="contato@empresa.com"
									/>
								</div>
							</>
						)}
					</div>
				</section>

				<section className="rounded-[2px] border border-white/10 bg-card p-6 flex flex-col gap-5">
					<h2 className="font-mono text-xs uppercase tracking-widest text-primary">
						Cláusulas
					</h2>
					{clauses.map((clause) => (
						<div className="flex flex-col gap-2" key={clause.key}>
							<Label htmlFor={`contract-${clause.key}`}>{clause.label}</Label>
							<Textarea
								id={`contract-${clause.key}`}
								value={values[clause.key]}
								onChange={(event) => setField(clause.key, event.target.value)}
								placeholder={clause.placeholder}
								rows={3}
							/>
						</div>
					))}
				</section>

				<section className="rounded-[2px] border border-white/10 bg-card p-6 flex flex-col gap-5">
					<h2 className="font-mono text-xs uppercase tracking-widest text-primary">
						Valores e prazos
					</h2>
					<div className="grid gap-4 sm:grid-cols-3">
						<div className="flex flex-col gap-2">
							<Label htmlFor="contract-total">Valor total (R$) *</Label>
							<Input
								id="contract-total"
								type="number"
								min="0"
								step="any"
								value={values.totalValue}
								onChange={(event) => setField('totalValue', event.target.value)}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="contract-start">Início</Label>
							<Input
								id="contract-start"
								type="date"
								value={values.startDate}
								onChange={(event) => setField('startDate', event.target.value)}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="contract-end">Fim</Label>
							<Input
								id="contract-end"
								type="date"
								value={values.endDate}
								onChange={(event) => setField('endDate', event.target.value)}
							/>
						</div>
					</div>
				</section>

				<div className="flex flex-wrap items-center justify-end gap-3">
					<Button asChild type="button" variant="outline">
						<Link href="/dashboard/contracts">Cancelar</Link>
					</Button>
					<Button type="submit" disabled={isPending} className="min-w-44">
						{isPending && <Loader2 className="size-4 animate-spin" />}
						{contract ? 'Salvar alterações' : 'Criar contrato'}
					</Button>
				</div>
			</form>
		</div>
	)
}
