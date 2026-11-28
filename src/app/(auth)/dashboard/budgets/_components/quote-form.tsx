'use client'

import {
	ArrowLeft,
	ChevronDown,
	Copy,
	FileText,
	Info,
	Loader2,
	type LucideIcon,
	Plus,
	SlidersHorizontal,
	Trash2,
	UserRound,
	Wallet,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
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
	describePayment,
	formatCurrency,
	formatDate,
} from '@/lib/billing-format'
import { createQuote, type QuoteInput, updateQuote } from '../_actions/quotes'
import type {
	CatalogOption,
	ClientOption,
} from '../_data-access/get-budget-options'
import type { QuoteFormData } from '../_data-access/get-quotes'

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

function StepHeader({
	step,
	title,
	description,
	icon: Icon,
}: {
	step: string
	title: string
	description: string
	icon: LucideIcon
}) {
	return (
		<div className="flex items-start gap-3">
			<div className="flex size-9 shrink-0 items-center justify-center rounded-[2px] border border-primary/20 bg-primary/10">
				<Icon className="size-4 text-primary" />
			</div>
			<div>
				<div className="flex flex-wrap items-center gap-2">
					<span className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/35">
						Etapa {step}
					</span>
					<h2 className="font-sentient text-base font-semibold text-foreground">
						{title}
					</h2>
				</div>
				<p className="mt-0.5 font-mono text-[10px] text-foreground/35">
					{description}
				</p>
			</div>
		</div>
	)
}

function SourceBadge({ children }: { children: ReactNode }) {
	return (
		<span className="rounded-[2px] border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-primary">
			{children}
		</span>
	)
}

function SummaryRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between gap-3">
			<span className="font-mono text-[10px] text-foreground/35">{label}</span>
			<span className="font-mono text-[11px] text-foreground/70">{value}</span>
		</div>
	)
}

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
	const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
		() =>
			Object.fromEntries(
				items.map((item, index) => [
					item.key,
					!item.name.trim() || index === 0,
				]),
			),
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

	function addBlankItem() {
		itemCounter.current += 1
		const key = `novo-${itemCounter.current}`
		setItems((current) => [...current, newItem(key)])
		setExpandedItems((current) => ({ ...current, [key]: true }))
	}

	function duplicateItem(index: number) {
		const source = items[index]
		if (!source) return
		itemCounter.current += 1
		const key = `copia-${itemCounter.current}`
		setItems((current) => {
			const next = [...current]
			next.splice(index + 1, 0, { ...source, key })
			return next
		})
		setExpandedItems((current) => ({ ...current, [key]: true }))
	}

	function removeItem(index: number) {
		const removed = items[index]
		setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
		if (removed) {
			setExpandedItems((current) => {
				const next = { ...current }
				delete next[removed.key]
				return next
			})
		}
	}

	function toggleItem(key: string) {
		setExpandedItems((current) => ({ ...current, [key]: !current[key] }))
	}

	function handleCatalogSelect(value: string) {
		const selected = catalogItems.find((item) => item.id === value)
		setCatalogSelection('')
		if (!selected) return

		itemCounter.current += 1
		const key = `catalogo-${itemCounter.current}`
		setItems((current) => [
			...current,
			{
				key,
				name: selected.name,
				description: selected.description,
				hours: String(selected.baseHours),
				monthlyFee: String(selected.monthlyFee),
				monthlyDuration: String(selected.monthlyDuration),
				source: selected.categoryName ?? 'Catálogo',
			},
		])
		setExpandedItems((current) => ({ ...current, [key]: false }))
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
		if (
			values.clientEmail.trim() &&
			!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.clientEmail.trim())
		) {
			toast.error('Informe um e-mail válido.')
			return
		}
		if (Number(values.installments) < 1) {
			toast.error('Informe ao menos 1 parcela.')
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

	const payment = describePayment(
		totals.totalValue,
		Number(values.entryAmount) || 0,
		Number(values.installments) || 1,
		totals.monthlyTotal,
	)

	return (
		<div className="flex flex-col gap-6">
			<header className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<Button asChild variant="ghost" size="sm" className="mb-2 -ml-3">
						<Link href="/dashboard/budgets">
							<ArrowLeft className="size-4" />
							Voltar
						</Link>
					</Button>
					<p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
						Proposta comercial
					</p>
					<h1 className="mt-1 font-sentient text-3xl font-bold text-foreground">
						{quote ? 'Editar orçamento' : 'Novo orçamento'}
					</h1>
					<p className="mt-1 font-mono text-xs text-foreground/40">
						Estruture escopo, valores e condições em um só lugar.
					</p>
				</div>
				<div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5">
					<span className="size-1.5 animate-pulse rounded-full bg-primary" />
					<span className="font-mono text-[10px] uppercase tracking-widest text-primary">
						Cálculo ao vivo
					</span>
				</div>
			</header>

			<form
				id="quote-form"
				onSubmit={handleSubmit}
				className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
			>
				<div className="flex min-w-0 flex-col gap-5">
					<section className="rounded-[2px] border border-white/10 bg-card p-6">
						<StepHeader
							step="01"
							icon={FileText}
							title="Identificação"
							description="Dados que aparecem no topo da proposta e no PDF."
						/>
						<div className="mt-5 grid gap-4 sm:grid-cols-2">
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
							<div className="flex flex-col gap-2 sm:col-span-2">
								<Label htmlFor="quote-description">Descrição</Label>
								<Textarea
									id="quote-description"
									value={values.description}
									onChange={(event) =>
										setField('description', event.target.value)
									}
									placeholder="Contexto, objetivos e observações gerais da proposta"
									rows={3}
								/>
							</div>
						</div>
					</section>

					<section className="rounded-[2px] border border-white/10 bg-card p-6">
						<StepHeader
							step="02"
							icon={UserRound}
							title="Cliente"
							description="Escolha um cadastro existente ou informe os dados manualmente."
						/>
						<div className="mt-5 flex flex-col gap-4">
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
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="flex flex-col gap-2">
									<Label htmlFor="quote-client-name">Nome do cliente *</Label>
									<Input
										id="quote-client-name"
										value={values.clientName}
										onChange={(event) =>
											setField('clientName', event.target.value)
										}
										readOnly={clientMode !== 'manual'}
										placeholder="Nome do contratante"
										className={
											clientMode !== 'manual' ? 'text-foreground/60' : undefined
										}
									/>
								</div>
								<div className="flex flex-col gap-2">
									<Label htmlFor="quote-client-email">E-mail do cliente</Label>
									<Input
										id="quote-client-email"
										type="email"
										value={values.clientEmail}
										onChange={(event) =>
											setField('clientEmail', event.target.value)
										}
										readOnly={clientMode !== 'manual'}
										placeholder="contato@empresa.com"
										className={
											clientMode !== 'manual' ? 'text-foreground/60' : undefined
										}
									/>
								</div>
							</div>
							{clientMode !== 'manual' ? (
								<p className="font-mono text-[10px] text-foreground/35">
									Dados carregados do cadastro. Para alterar, selecione
									“Informar manualmente”.
								</p>
							) : null}
						</div>
					</section>

					<section className="rounded-[2px] border border-white/10 bg-card p-6">
						<StepHeader
							step="03"
							icon={SlidersHorizontal}
							title="Comercial"
							description="Parâmetros de preço, desconto e condição de pagamento."
						/>
						<div className="mt-5 flex flex-col gap-5">
							<div>
								<p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-foreground/35">
									Precificação
								</p>
								<div className="grid gap-4 sm:grid-cols-3">
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
									].map((field) => (
										<div className="flex flex-col gap-2" key={field.id}>
											<Label htmlFor={field.id}>{field.label}</Label>
											<Input
												id={field.id}
												type="number"
												min="0"
												step="any"
												value={values[field.key]}
												onChange={(event) =>
													setField(field.key, event.target.value)
												}
											/>
										</div>
									))}
								</div>
							</div>
							<div className="border-t border-white/5 pt-5">
								<p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-foreground/35">
									Pagamento
								</p>
								<div className="grid gap-4 sm:grid-cols-2">
									<div className="flex flex-col gap-2">
										<Label htmlFor="quote-entry">Entrada (R$)</Label>
										<Input
											id="quote-entry"
											type="number"
											min="0"
											step="any"
											value={values.entryAmount}
											onChange={(event) =>
												setField('entryAmount', event.target.value)
											}
										/>
										<p className="font-mono text-[10px] text-foreground/35">
											Informe o valor em reais, não a porcentagem.
										</p>
									</div>
									<div className="flex flex-col gap-2">
										<Label htmlFor="quote-installments">Parcelas</Label>
										<Input
											id="quote-installments"
											type="number"
											min="1"
											step="1"
											value={values.installments}
											onChange={(event) =>
												setField('installments', event.target.value)
											}
										/>
									</div>
								</div>
								<div className="mt-3 flex flex-col gap-0.5">
									{payment.lines.map((line) => (
										<p
											key={line}
											className="font-mono text-[10px] text-foreground/35"
										>
											{line}
										</p>
									))}
								</div>
							</div>
						</div>
					</section>

					<section className="rounded-[2px] border border-white/10 bg-card p-6">
						<StepHeader
							step="04"
							icon={Wallet}
							title="Itens da proposta"
							description="Descreva cada entrega. Itens do catálogo já vêm com detalhamento pronto."
						/>
						<div className="mt-5 flex flex-col gap-4">
							<div className="flex flex-wrap items-center justify-between gap-3">
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
										onClick={addBlankItem}
									>
										<Plus className="size-4" />
										Adicionar item
									</Button>
								</div>
								<p className="font-mono text-[10px] text-foreground/35">
									{items.length} item{items.length !== 1 ? 's' : ''} ·{' '}
									{totals.totalHours}h
								</p>
							</div>

							<div className="flex items-start gap-2 rounded-[2px] border border-white/8 bg-background/40 p-3">
								<Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
								<p className="font-mono text-[10px] leading-relaxed text-foreground/40">
									A descrição de cada item aparece na proposta pública e no PDF.
									Clique no item para expandir e editar.
								</p>
							</div>

							<div className="flex flex-col gap-3">
								{items.map((item, index) => {
									const subtotal = calcItemValue(
										Number(item.hours) || 0,
										Number(values.hourlyRate) || 0,
									)
									const isOpen = expandedItems[item.key] ?? false

									return (
										<div
											key={item.key}
											className="overflow-hidden rounded-[2px] border border-white/10 bg-background/40"
										>
											<div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
												<button
													type="button"
													onClick={() => toggleItem(item.key)}
													aria-expanded={isOpen}
													className="flex min-w-0 flex-1 items-center gap-3 text-left"
												>
													<ChevronDown
														className={`size-4 shrink-0 text-foreground/40 transition-transform ${
															isOpen ? '' : '-rotate-90'
														}`}
													/>
													<span className="flex size-7 shrink-0 items-center justify-center rounded-[2px] border border-white/10 font-mono text-[10px] text-foreground/50">
														{String(index + 1).padStart(2, '0')}
													</span>
													<span className="min-w-0">
														<span className="block truncate font-sentient text-sm font-semibold text-foreground">
															{item.name || 'Novo item'}
														</span>
														<span className="block font-mono text-[10px] text-foreground/35">
															{Number(item.hours) || 0}h ·{' '}
															{formatCurrency(subtotal)}
														</span>
													</span>
												</button>
												<div className="flex shrink-0 items-center gap-1">
													{item.source ? (
														<SourceBadge>{item.source}</SourceBadge>
													) : null}
													<Button
														type="button"
														variant="ghost"
														size="icon"
														aria-label={`Duplicar item ${index + 1}`}
														onClick={() => duplicateItem(index)}
													>
														<Copy className="size-4" />
													</Button>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														aria-label={`Remover item ${index + 1}`}
														disabled={items.length === 1}
														onClick={() => removeItem(index)}
													>
														<Trash2 className="size-4 text-destructive" />
													</Button>
												</div>
											</div>

											{isOpen ? (
												<div className="border-t border-white/5 px-4 py-4">
													<div className="grid gap-4 sm:grid-cols-2">
														<div className="flex flex-col gap-2">
															<Label htmlFor={`item-name-${index}`}>
																Nome *
															</Label>
															<Input
																id={`item-name-${index}`}
																value={item.name}
																onChange={(event) =>
																	setItemField(
																		index,
																		'name',
																		event.target.value,
																	)
																}
																placeholder="Desenvolvimento frontend"
															/>
														</div>
														<div className="flex flex-col gap-2">
															<Label htmlFor={`item-hours-${index}`}>
																Horas
															</Label>
															<Input
																id={`item-hours-${index}`}
																type="number"
																min="0"
																step="any"
																value={item.hours}
																onChange={(event) =>
																	setItemField(
																		index,
																		'hours',
																		event.target.value,
																	)
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
																	setItemField(
																		index,
																		'description',
																		event.target.value,
																	)
																}
																placeholder="Detalhes da entrega"
																rows={3}
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
																	setItemField(
																		index,
																		'monthlyFee',
																		event.target.value,
																	)
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
													<div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
														<span className="font-mono text-[10px] text-foreground/35">
															Subtotal do item
														</span>
														<span className="font-sentient text-sm font-semibold text-foreground">
															{formatCurrency(subtotal)}
														</span>
													</div>
												</div>
											) : null}
										</div>
									)
								})}
							</div>
						</div>
					</section>
				</div>

				<aside className="lg:sticky lg:top-24 lg:self-start">
					<section className="rounded-[2px] border border-white/10 bg-card p-5">
						<div className="flex items-center gap-2">
							<span className="size-1.5 rounded-full bg-primary" />
							<h2 className="font-mono text-xs uppercase tracking-widest text-primary">
								Resumo da proposta
							</h2>
						</div>
						<p className="mt-1 font-mono text-[10px] text-foreground/35">
							Atualizado enquanto você preenche.
						</p>

						<div className="mt-4 rounded-[2px] border border-white/8 bg-background/40 p-3">
							<p className="font-mono text-[9px] uppercase tracking-widest text-foreground/35">
								Cliente
							</p>
							<p className="mt-1 truncate font-sentient text-sm font-semibold text-foreground">
								{values.clientName || 'Não informado'}
							</p>
							<p className="truncate font-mono text-[10px] text-foreground/35">
								{values.clientEmail || 'Sem e-mail'}
							</p>
						</div>

						<div className="mt-4 flex flex-col gap-2.5">
							<SummaryRow
								label="Validade"
								value={formatDate(values.expirationDate)}
							/>
							<SummaryRow label="Itens" value={String(items.length)} />
							<SummaryRow label="Horas" value={`${totals.totalHours}h`} />
							<SummaryRow label="Bruto" value={formatCurrency(totals.gross)} />
							<SummaryRow
								label={`Desconto (${values.discount || 0}%)`}
								value={`- ${formatCurrency(totals.discountValue)}`}
							/>
							<SummaryRow
								label={`Urgência (${values.urgencyFee || 0}%)`}
								value={`+ ${formatCurrency(totals.urgencyValue)}`}
							/>
							<SummaryRow
								label="Recorrente"
								value={formatCurrency(totals.monthlyTotal)}
							/>
						</div>

						<div className="mt-4 border-t border-primary/20 pt-4">
							<p className="font-mono text-[9px] uppercase tracking-widest text-foreground/35">
								Total da proposta
							</p>
							<p className="mt-1 font-sentient text-3xl font-bold text-primary">
								{formatCurrency(totals.totalValue)}
							</p>
							<div className="mt-1 flex flex-col gap-0.5">
								{payment.lines.map((line) => (
									<p
										key={line}
										className="font-mono text-[10px] leading-relaxed text-foreground/35"
									>
										{line}
									</p>
								))}
							</div>
						</div>

						<div className="mt-4 flex items-start gap-2 rounded-[2px] border border-white/8 bg-background/40 p-3">
							<Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
							<p className="font-mono text-[10px] leading-relaxed text-foreground/40">
								Após salvar, o link público e o PDF ficam disponíveis no detalhe
								do orçamento.
							</p>
						</div>

						<div className="mt-5 flex flex-col gap-2">
							<Button
								type="submit"
								form="quote-form"
								disabled={isPending}
								className="w-full"
							>
								{isPending && <Loader2 className="size-4 animate-spin" />}
								{quote ? 'Salvar alterações' : 'Criar orçamento'}
							</Button>
							<Button
								asChild
								type="button"
								variant="outline"
								className="w-full"
							>
								<Link href="/dashboard/budgets">Cancelar</Link>
							</Button>
						</div>
					</section>
				</aside>
			</form>
		</div>
	)
}
