'use client'

import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FormEvent, useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
	calcItemValue,
	calcQuoteTotals,
	formatCurrency,
} from '@/lib/billing-format'
import type { CatalogOption } from '@/lib/catalog'
import { createQuote, type QuoteInput, updateQuote } from './actions'

export interface ClientOption {
	id: string
	name: string
	email: string | null
}

export interface QuoteItemFormData {
	id: string
	name: string
	description: string | null
	hours: number
	monthlyFee: number
	monthlyDuration: number
}

export interface QuoteFormData {
	id: string
	title: string
	description: string | null
	clientId: string | null
	clientName: string
	clientEmail: string | null
	hourlyRate: number
	discount: number
	urgencyFee: number
	entryAmount: number
	installments: number
	expirationDate: string | null
	items: QuoteItemFormData[]
}

interface ItemValues {
	key: string
	name: string
	description: string
	hours: string
	monthlyFee: string
	monthlyDuration: string
	source: string
}

const newItem = (key: string): ItemValues => ({
	key,
	name: '',
	description: '',
	hours: '1',
	monthlyFee: '0',
	monthlyDuration: '12',
	source: '',
})

export function QuoteForm({
	clients,
	catalogItems,
	quote,
}: {
	clients: ClientOption[]
	catalogItems: CatalogOption[]
	quote?: QuoteFormData
}) {
	const router = useRouter()
	const [catalogSelection, setCatalogSelection] = useState('')
	const [isPending, startTransition] = useTransition()
	const [clientMode, setClientMode] = useState(
		clients.some((client) => client.id === quote?.clientId)
			? (quote?.clientId as string)
			: 'manual',
	)
	const [values, setValues] = useState({
		title: quote?.title ?? '',
		description: quote?.description ?? '',
		clientName: quote?.clientName ?? '',
		clientEmail: quote?.clientEmail ?? '',
		hourlyRate: String(quote?.hourlyRate ?? 150),
		discount: String(quote?.discount ?? 0),
		urgencyFee: String(quote?.urgencyFee ?? 0),
		entryAmount: String(quote?.entryAmount ?? 0),
		installments: String(quote?.installments ?? 1),
		expirationDate: quote?.expirationDate?.slice(0, 10) ?? '',
	})
	const [items, setItems] = useState<ItemValues[]>(
		quote?.items.length
			? quote.items.map((item) => ({
					key: item.id,
					name: item.name,
					description: item.description ?? '',
					hours: String(item.hours),
					monthlyFee: String(item.monthlyFee),
					monthlyDuration: String(item.monthlyDuration),
					source: '',
				}))
			: [newItem('novo-0')],
	)
	const itemCounter = useRef(items.length)

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

	function setItemField(index: number, key: keyof ItemValues, value: string) {
		setItems((current) =>
			current.map((item, itemIndex) =>
				itemIndex === index ? { ...item, [key]: value } : item,
			),
		)
	}

	function handleCatalogSelect(value: string) {
		const selected = catalogItems.find((item) => item.id === value)
		setCatalogSelection('')
		if (!selected) return

		itemCounter.current += 1
		setItems((current) => [
			...current,
			{
				key: `catalogo-${itemCounter.current}`,
				name: selected.name,
				description: selected.description,
				hours: String(selected.baseHours),
				monthlyFee: String(selected.monthlyFee),
				monthlyDuration: String(selected.monthlyDuration),
				source: selected.categoryName ?? 'Catálogo',
			},
		])
		toast.success(`Item "${selected.name}" adicionado à proposta.`)
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (!values.title.trim()) {
			toast.error('Informe o título do orçamento.')
			return
		}
		if (!values.clientName.trim()) {
			toast.error('Informe o cliente.')
			return
		}
		if (items.some((item) => !item.name.trim())) {
			toast.error('Informe o nome de todos os itens.')
			return
		}

		const input: QuoteInput = {
			title: values.title,
			description: values.description || undefined,
			clientId: clientMode === 'manual' ? undefined : clientMode,
			clientName: values.clientName,
			clientEmail: values.clientEmail || undefined,
			hourlyRate: Number(values.hourlyRate) || 0,
			discount: Number(values.discount) || 0,
			urgencyFee: Number(values.urgencyFee) || 0,
			entryAmount: Number(values.entryAmount) || 0,
			installments: Number(values.installments) || 1,
			expirationDate: values.expirationDate || undefined,
			items: items.map((item) => ({
				name: item.name,
				description: item.description || undefined,
				hours: Number(item.hours) || 0,
				monthlyFee: Number(item.monthlyFee) || 0,
				monthlyDuration: Number(item.monthlyDuration) || 12,
			})),
		}

		startTransition(async () => {
			try {
				const saved = quote
					? await updateQuote(quote.id, input)
					: await createQuote(input)
				toast.success(
					quote
						? 'Orçamento atualizado com sucesso!'
						: 'Orçamento criado com sucesso!',
				)
				router.push(`/dashboard/budgets/${saved.id}`)
				router.refresh()
			} catch (error) {
				console.error(error)
				toast.error('Não foi possível salvar o orçamento.')
			}
		})
	}

	const catalogGroups = catalogItems.reduce<Record<string, CatalogOption[]>>(
		(groups, item) => {
			const key = item.categoryName ?? 'Sem categoria'
			groups[key] = [...(groups[key] ?? []), item]
			return groups
		},
		{},
	)

	const totals = calcQuoteTotals(
		items.map((item) => ({
			name: item.name,
			hours: Number(item.hours) || 0,
			monthlyFee: Number(item.monthlyFee) || 0,
		})),
		Number(values.hourlyRate) || 0,
		Number(values.discount) || 0,
		Number(values.urgencyFee) || 0,
	)

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<Button asChild variant="ghost" size="sm" className="mb-2 -ml-3">
						<Link href="/dashboard/budgets">
							<ArrowLeft className="size-4" />
							Voltar
						</Link>
					</Button>
					<h1 className="font-sentient text-3xl font-bold text-foreground">
						{quote ? 'Editar orçamento' : 'Novo orçamento'}
					</h1>
					<p className="font-mono text-sm text-foreground/40 mt-1">
						Preencha os dados da proposta comercial.
					</p>
				</div>
				<p className="font-mono text-xs text-foreground/40">
					Valores atualizados em tempo real
				</p>
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col gap-6">
				<section className="rounded-[2px] border border-white/10 bg-card p-6 flex flex-col gap-5">
					<h2 className="font-mono text-xs uppercase tracking-widest text-primary">
						Identificação
					</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="flex flex-col gap-2">
							<Label htmlFor="quote-title">Título *</Label>
							<Input
								id="quote-title"
								value={values.title}
								onChange={(event) => setField('title', event.target.value)}
								placeholder="Desenvolvimento de plataforma"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="quote-expiration">Validade</Label>
							<Input
								id="quote-expiration"
								type="date"
								value={values.expirationDate}
								onChange={(event) =>
									setField('expirationDate', event.target.value)
								}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="quote-description">Descrição</Label>
						<Textarea
							id="quote-description"
							value={values.description}
							onChange={(event) => setField('description', event.target.value)}
							placeholder="Escopo e observações da proposta"
							rows={4}
						/>
					</div>
				</section>

				<section className="rounded-[2px] border border-white/10 bg-card p-6 flex flex-col gap-5">
					<h2 className="font-mono text-xs uppercase tracking-widest text-primary">
						Cliente
					</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="flex flex-col gap-2">
							<Label htmlFor="quote-client-select">Cliente</Label>
							<Select value={clientMode} onValueChange={handleClientChange}>
								<SelectTrigger id="quote-client-select">
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
									<Label htmlFor="quote-client-name">Nome do cliente *</Label>
									<Input
										id="quote-client-name"
										value={values.clientName}
										onChange={(event) =>
											setField('clientName', event.target.value)
										}
										placeholder="Nome do contratante"
									/>
								</div>
								<div className="flex flex-col gap-2 sm:col-start-2">
									<Label htmlFor="quote-client-email">E-mail do cliente</Label>
									<Input
										id="quote-client-email"
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
						Comercial
					</h2>
					<div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
						{[
							{
								id: 'quote-hourly-rate',
								label: 'Valor/hora (R$)',
								key: 'hourlyRate' as const,
							},
							{
								id: 'quote-discount',
								label: 'Desconto (%)',
								key: 'discount' as const,
							},
							{
								id: 'quote-urgency',
								label: 'Urgência (%)',
								key: 'urgencyFee' as const,
							},
							{
								id: 'quote-entry',
								label: 'Entrada (R$)',
								key: 'entryAmount' as const,
							},
							{
								id: 'quote-installments',
								label: 'Parcelas',
								key: 'installments' as const,
							},
						].map((field) => (
							<div className="flex flex-col gap-2" key={field.id}>
								<Label htmlFor={field.id}>{field.label}</Label>
								<Input
									id={field.id}
									type="number"
									min="0"
									step="any"
									value={values[field.key]}
									onChange={(event) => setField(field.key, event.target.value)}
								/>
							</div>
						))}
					</div>
				</section>

				<section className="rounded-[2px] border border-white/10 bg-card p-6 flex flex-col gap-5">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<h2 className="font-mono text-xs uppercase tracking-widest text-primary">
							Itens
						</h2>
						<div className="flex flex-wrap gap-2">
							{catalogItems.length > 0 ? (
								<Select
									value={catalogSelection}
									onValueChange={handleCatalogSelect}
								>
									<SelectTrigger
										className="w-[260px]"
										aria-label="Adicionar do catálogo"
									>
										<SelectValue placeholder="Adicionar do catálogo" />
									</SelectTrigger>
									<SelectContent className="max-h-80">
										{Object.entries(catalogGroups).map(
											([category, options]) => (
												<SelectGroup key={category}>
													<SelectLabel>{category}</SelectLabel>
													{options.map((option) => (
														<SelectItem key={option.id} value={option.id}>
															{option.name} · {option.baseHours}h
														</SelectItem>
													))}
												</SelectGroup>
											),
										)}
									</SelectContent>
								</Select>
							) : null}
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => {
									itemCounter.current += 1
									setItems((current) => [
										...current,
										newItem(`novo-${itemCounter.current}`),
									])
								}}
							>
								<Plus className="size-4" />
								Adicionar item
							</Button>
						</div>
					</div>
					<div className="flex flex-col gap-4">
						{items.map((item, index) => (
							<div
								key={item.key}
								className="rounded-[2px] border border-white/10 bg-background/40 p-4 flex flex-col gap-4"
							>
								<div className="flex items-center justify-between gap-2">
									<div className="flex flex-wrap items-center gap-2">
										<span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
											Item {index + 1}
										</span>
										{item.source ? (
											<span className="rounded-[2px] border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-primary">
												Catálogo · {item.source}
											</span>
										) : null}
									</div>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										aria-label={`Remover item ${index + 1}`}
										disabled={items.length === 1}
										onClick={() =>
											setItems((current) =>
												current.filter((_, itemIndex) => itemIndex !== index),
											)
										}
									>
										<Trash2 className="size-4 text-destructive" />
									</Button>
								</div>
								<div className="grid gap-4 sm:grid-cols-2">
									<div className="flex flex-col gap-2">
										<Label htmlFor={`item-name-${index}`}>Nome *</Label>
										<Input
											id={`item-name-${index}`}
											value={item.name}
											onChange={(event) =>
												setItemField(index, 'name', event.target.value)
											}
											placeholder="Desenvolvimento frontend"
										/>
									</div>
									<div className="flex flex-col gap-2">
										<Label htmlFor={`item-hours-${index}`}>Horas</Label>
										<Input
											id={`item-hours-${index}`}
											type="number"
											min="0"
											step="any"
											value={item.hours}
											onChange={(event) =>
												setItemField(index, 'hours', event.target.value)
											}
										/>
									</div>
									<div className="flex flex-col gap-2 sm:col-span-2">
										<Label htmlFor={`item-description-${index}`}>
											Descrição
										</Label>
										<Textarea
											id={`item-description-${index}`}
											value={item.description}
											onChange={(event) =>
												setItemField(index, 'description', event.target.value)
											}
											placeholder="Detalhes da entrega"
											rows={2}
										/>
									</div>
									<div className="flex flex-col gap-2">
										<Label htmlFor={`item-monthly-fee-${index}`}>
											Mensalidade (R$)
										</Label>
										<Input
											id={`item-monthly-fee-${index}`}
											type="number"
											min="0"
											step="any"
											value={item.monthlyFee}
											onChange={(event) =>
												setItemField(index, 'monthlyFee', event.target.value)
											}
										/>
									</div>
									<div className="flex flex-col gap-2">
										<Label htmlFor={`item-duration-${index}`}>
											Duração mensal (meses)
										</Label>
										<Input
											id={`item-duration-${index}`}
											type="number"
											min="1"
											step="1"
											value={item.monthlyDuration}
											onChange={(event) =>
												setItemField(
													index,
													'monthlyDuration',
													event.target.value,
												)
											}
										/>
									</div>
								</div>
								<p className="font-mono text-[10px] text-foreground/40 text-right">
									Subtotal:{' '}
									{formatCurrency(
										calcItemValue(
											Number(item.hours) || 0,
											Number(values.hourlyRate) || 0,
										),
									)}
								</p>
							</div>
						))}
					</div>
				</section>

				<section className="rounded-[2px] border border-white/10 bg-card p-6">
					<h2 className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
						Resumo
					</h2>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<TotalCard label="Horas totais" value={`${totals.totalHours}`} />
						<TotalCard
							label="Valor bruto"
							value={formatCurrency(totals.gross)}
						/>
						<TotalCard
							label={`Desconto (${values.discount || 0}%)`}
							value={`- ${formatCurrency(totals.discountValue)}`}
						/>
						<TotalCard
							label={`Urgência (${values.urgencyFee || 0}%)`}
							value={`+ ${formatCurrency(totals.urgencyValue)}`}
						/>
						<TotalCard
							label="Mensalidade recorrente"
							value={formatCurrency(totals.monthlyTotal)}
						/>
						<TotalCard
							label="Total da proposta"
							value={formatCurrency(totals.totalValue)}
							highlight
						/>
					</div>
				</section>

				<div className="flex flex-wrap items-center justify-end gap-3">
					<Button asChild type="button" variant="outline">
						<Link href="/dashboard/budgets">Cancelar</Link>
					</Button>
					<Button type="submit" disabled={isPending} className="min-w-44">
						{isPending && <Loader2 className="size-4 animate-spin" />}
						{quote ? 'Salvar alterações' : 'Criar orçamento'}
					</Button>
				</div>
			</form>
		</div>
	)
}

function TotalCard({
	label,
	value,
	highlight = false,
}: {
	label: string
	value: string
	highlight?: boolean
}) {
	return (
		<div className="rounded-[2px] border border-white/10 bg-background/40 p-4">
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
