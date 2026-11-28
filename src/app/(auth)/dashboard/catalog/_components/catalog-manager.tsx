'use client'

import {
	Boxes,
	ChevronDown,
	Clock3,
	Layers3,
	type LucideIcon,
	Pencil,
	Plus,
	Search,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { type FormEvent, useMemo, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { DeleteBillingButton } from '@/components/billing/delete-billing-button'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
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
import { formatCurrency } from '@/lib/billing-format'
import {
	type CatalogCategoryInput,
	type CatalogItemInput,
	createCategory,
	createItem,
	deleteCategory,
	deleteItem,
	updateCategory,
	updateItem,
} from '../_actions'
import type {
	CatalogCategoryRow,
	CatalogItemRow,
} from '../_data-access/get-catalog'

const complexityLabels: Record<string, string> = {
	baixa: 'Baixa',
	media: 'Média',
	alta: 'Alta',
}

function StatCard({
	icon: Icon,
	label,
	value,
}: {
	icon: LucideIcon
	label: string
	value: string
}) {
	return (
		<div className="flex items-center gap-3 rounded-[2px] border border-white/8 bg-card px-4 py-3">
			<div className="flex size-9 items-center justify-center rounded-[2px] border border-primary/20 bg-primary/10">
				<Icon className="size-4 text-primary" />
			</div>
			<div>
				<p className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/35">
					{label}
				</p>
				<p className="font-sentient text-xl font-semibold leading-tight text-foreground">
					{value}
				</p>
			</div>
		</div>
	)
}

function MetaBadge({
	children,
	accent = false,
}: {
	children: ReactNode
	accent?: boolean
}) {
	return (
		<span
			className={`rounded-[2px] border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${
				accent
					? 'border-primary/30 bg-primary/10 text-primary'
					: 'border-white/10 bg-white/3 text-foreground/45'
			}`}
		>
			{children}
		</span>
	)
}

export function CatalogManager({
	categories,
}: {
	categories: CatalogCategoryRow[]
}) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const [categoryOpen, setCategoryOpen] = useState(false)
	const [editingCategory, setEditingCategory] =
		useState<CatalogCategoryRow | null>(null)
	const [categoryValues, setCategoryValues] = useState({
		name: '',
		description: '',
		order: '0',
	})

	const [itemOpen, setItemOpen] = useState(false)
	const [editingItem, setEditingItem] = useState<CatalogItemRow | null>(null)
	const [itemValues, setItemValues] = useState({
		name: '',
		description: '',
		baseHours: '0',
		complexity: 'media',
		monthlyFee: '0',
		monthlyDuration: '12',
		categoryId: '',
	})

	const [query, setQuery] = useState('')
	const [activeCategory, setActiveCategory] = useState('all')
	const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

	const items = categories.flatMap((category) => category.items)
	const totalHours = items.reduce((sum, item) => sum + item.baseHours, 0)

	const filteredCategories = useMemo(() => {
		const term = query.trim().toLocaleLowerCase('pt-BR')

		return categories
			.map((category) => ({
				...category,
				items: category.items.filter((item) => {
					const matchesCategory =
						activeCategory === 'all' || category.id === activeCategory
					const matchesTerm =
						!term ||
						`${item.name} ${item.description} ${category.name}`
							.toLocaleLowerCase('pt-BR')
							.includes(term)
					return matchesCategory && matchesTerm
				}),
			}))
			.filter((category) => category.items.length > 0)
	}, [categories, query, activeCategory])

	function focusItems() {
		document.getElementById('catalog-itens')?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})
	}

	function openCreateCategory() {
		setEditingCategory(null)
		setCategoryValues({ name: '', description: '', order: '0' })
		setCategoryOpen(true)
	}

	function openEditCategory(category: CatalogCategoryRow) {
		setEditingCategory(category)
		setCategoryValues({
			name: category.name,
			description: category.description ?? '',
			order: String(category.order),
		})
		setCategoryOpen(true)
	}

	function openCreateItem() {
		setEditingItem(null)
		setItemValues({
			name: '',
			description: '',
			baseHours: '0',
			complexity: 'media',
			monthlyFee: '0',
			monthlyDuration: '12',
			categoryId: '',
		})
		setItemOpen(true)
	}

	function openEditItem(item: CatalogItemRow) {
		setEditingItem(item)
		setItemValues({
			name: item.name,
			description: item.description,
			baseHours: String(item.baseHours),
			complexity: item.complexity,
			monthlyFee: String(item.monthlyFee),
			monthlyDuration: String(item.monthlyDuration),
			categoryId: item.categoryId ?? '',
		})
		setItemOpen(true)
	}

	function submitCategory(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (!categoryValues.name.trim()) {
			toast.error('Informe o nome da categoria.')
			return
		}
		const input: CatalogCategoryInput = {
			name: categoryValues.name,
			description: categoryValues.description || undefined,
			order: Number(categoryValues.order) || 0,
		}

		startTransition(async () => {
			try {
				if (editingCategory) {
					await updateCategory(editingCategory.id, input)
					toast.success('Categoria atualizada com sucesso!')
				} else {
					await createCategory(input)
					toast.success('Categoria criada com sucesso!')
				}
				setCategoryOpen(false)
				router.refresh()
			} catch (error) {
				console.error(error)
				toast.error('Não foi possível salvar a categoria.')
			}
		})
	}

	function submitItem(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (!itemValues.name.trim()) {
			toast.error('Informe o nome do item.')
			return
		}
		if (!itemValues.description.trim()) {
			toast.error('Descreva o item para a proposta.')
			return
		}
		const input: CatalogItemInput = {
			name: itemValues.name,
			description: itemValues.description,
			baseHours: Number(itemValues.baseHours) || 0,
			complexity: itemValues.complexity,
			monthlyFee: Number(itemValues.monthlyFee) || 0,
			monthlyDuration: Number(itemValues.monthlyDuration) || 12,
			categoryId: itemValues.categoryId || undefined,
		}

		startTransition(async () => {
			try {
				if (editingItem) {
					await updateItem(editingItem.id, input)
					toast.success('Item atualizado com sucesso!')
				} else {
					await createItem(input)
					toast.success('Item criado com sucesso!')
				}
				setItemOpen(false)
				router.refresh()
			} catch (error) {
				console.error(error)
				toast.error('Não foi possível salvar o item.')
			}
		})
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-wrap items-end justify-between gap-5">
				<div className="flex flex-col gap-1.5">
					<p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
						Comercial · biblioteca
					</p>
					<h1 className="font-sentient text-3xl font-bold text-foreground">
						Catálogo de serviços
					</h1>
					<p className="max-w-xl font-mono text-xs leading-relaxed text-foreground/40">
						Descrições prontas para montar propostas completas sem repetir
						trabalho. Use os filtros para encontrar o item certo.
					</p>
				</div>
				<div className="flex gap-2">
					<Button type="button" variant="outline" onClick={openCreateCategory}>
						<Plus className="size-4" />
						Nova categoria
					</Button>
					<Button type="button" onClick={openCreateItem}>
						<Plus className="size-4" />
						Novo item
					</Button>
				</div>
			</div>

			<div className="grid gap-3 sm:grid-cols-3">
				<StatCard
					icon={Layers3}
					label="Categorias"
					value={String(categories.length)}
				/>
				<StatCard
					icon={Boxes}
					label="Serviços cadastrados"
					value={String(items.length)}
				/>
				<StatCard
					icon={Clock3}
					label="Horas base somadas"
					value={`${new Intl.NumberFormat('pt-BR').format(totalHours)}h`}
				/>
			</div>

			<section className="rounded-[2px] border border-white/10 bg-card overflow-hidden">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-6 py-4">
					<div>
						<h2 className="font-mono text-xs uppercase tracking-widest text-primary">
							Categorias
						</h2>
						<p className="mt-1 font-mono text-[10px] text-foreground/35">
							Agrupe serviços por tipo de entrega.
						</p>
					</div>
				</div>
				{categories.length === 0 ? (
					<p className="px-6 py-10 text-center font-mono text-sm text-foreground/30">
						Nenhuma categoria cadastrada.
					</p>
				) : (
					<div className="grid gap-3 p-6 sm:grid-cols-2 xl:grid-cols-3">
						{categories.map((category) => {
							const categoryHours = category.items.reduce(
								(sum, item) => sum + item.baseHours,
								0,
							)
							return (
								<article
									key={category.id}
									className="group rounded-[2px] border border-white/8 bg-background/40 p-4 transition-colors hover:border-primary/40"
								>
									<div className="flex items-start justify-between gap-3">
										<div className="min-w-0">
											<h3 className="font-sentient text-base font-semibold leading-snug text-foreground">
												{category.name}
											</h3>
											<p className="mt-1 font-mono text-[10px] text-foreground/40">
												{category.items.length} itens · {categoryHours}h
											</p>
										</div>
										<div className="flex shrink-0 gap-1 opacity-60 transition-opacity group-hover:opacity-100">
											<Button
												type="button"
												variant="ghost"
												size="icon"
												aria-label={`Editar ${category.name}`}
												onClick={() => openEditCategory(category)}
											>
												<Pencil className="size-4" />
											</Button>
											<DeleteBillingButton
												entity="categoria"
												successMessage="Categoria excluída com sucesso!"
												onDelete={async () => {
													await deleteCategory(category.id)
													router.refresh()
												}}
											/>
										</div>
									</div>
									{category.description ? (
										<p className="mt-3 line-clamp-2 font-mono text-[11px] leading-relaxed text-foreground/45">
											{category.description}
										</p>
									) : null}
									<button
										type="button"
										onClick={() => {
											setActiveCategory(category.id)
											focusItems()
										}}
										className="mt-3 font-mono text-[10px] uppercase tracking-widest text-primary transition-colors hover:text-foreground"
									>
										Ver serviços →
									</button>
								</article>
							)
						})}
					</div>
				)}
			</section>

			<section
				id="catalog-itens"
				className="scroll-mt-6 rounded-[2px] border border-white/10 bg-card overflow-hidden"
			>
				<div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 px-6 py-4">
					<div>
						<h2 className="font-mono text-xs uppercase tracking-widest text-primary">
							Serviços
						</h2>
						<p className="mt-1 font-mono text-[10px] text-foreground/35">
							Itens reutilizáveis nos orçamentos e no PDF.
						</p>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<div className="relative">
							<Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-foreground/35" />
							<Input
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="Buscar serviço..."
								className="w-full pl-9 font-mono text-xs sm:w-64"
								aria-label="Buscar serviço"
							/>
						</div>
						<Button type="button" onClick={openCreateItem}>
							<Plus className="size-4" />
							Novo item
						</Button>
					</div>
				</div>

				<div className="flex flex-wrap gap-2 border-b border-white/5 px-6 py-4">
					<button
						type="button"
						onClick={() => setActiveCategory('all')}
						className={`rounded-[2px] border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
							activeCategory === 'all'
								? 'border-primary/50 bg-primary/10 text-primary'
								: 'border-white/10 text-foreground/45 hover:border-white/25 hover:text-foreground/80'
						}`}
					>
						Todos <span className="ml-1 opacity-60">{items.length}</span>
					</button>
					{categories.map((category) => (
						<button
							key={category.id}
							type="button"
							onClick={() => setActiveCategory(category.id)}
							className={`rounded-[2px] border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
								activeCategory === category.id
									? 'border-primary/50 bg-primary/10 text-primary'
									: 'border-white/10 text-foreground/45 hover:border-white/25 hover:text-foreground/80'
							}`}
						>
							{category.name}
							<span className="ml-1.5 opacity-60">{category.items.length}</span>
						</button>
					))}
				</div>

				{filteredCategories.length === 0 ? (
					<div className="px-6 py-12 text-center">
						<p className="font-sentient text-lg text-foreground/70">
							Nenhum serviço encontrado.
						</p>
						<p className="mt-1 font-mono text-xs text-foreground/35">
							Tente outro termo ou limpe os filtros.
						</p>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="mt-4"
							onClick={() => {
								setQuery('')
								setActiveCategory('all')
							}}
						>
							Limpar filtros
						</Button>
					</div>
				) : (
					<div className="divide-y divide-white/5">
						{filteredCategories.map((category) => {
							const isOpen = !collapsed[category.id]
							const categoryHours = category.items.reduce(
								(sum, item) => sum + item.baseHours,
								0,
							)
							return (
								<div key={category.id}>
									<button
										type="button"
										onClick={() =>
											setCollapsed((current) => ({
												...current,
												[category.id]: !current[category.id],
											}))
										}
										className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-white/3"
									>
										<div className="flex items-center gap-3">
											<ChevronDown
												className={`size-4 text-foreground/40 transition-transform ${
													isOpen ? '' : '-rotate-90'
												}`}
											/>
											<div>
												<p className="font-sentient text-base font-semibold text-foreground">
													{category.name}
												</p>
												<p className="font-mono text-[10px] text-foreground/35">
													{category.items.length} itens · {categoryHours}h
												</p>
											</div>
										</div>
										<MetaBadge>{category.items.length} serviços</MetaBadge>
									</button>

									{isOpen ? (
										<div className="grid gap-3 px-6 pb-5 pt-1 lg:grid-cols-2">
											{category.items.map((item) => (
												<article
													key={item.id}
													className="rounded-[2px] border border-white/8 bg-background/30 p-4 transition-colors hover:border-primary/30"
												>
													<div className="flex items-start justify-between gap-3">
														<div className="min-w-0">
															<h3 className="font-sentient text-sm font-semibold leading-snug text-foreground">
																{item.name}
															</h3>
															<p className="mt-1.5 line-clamp-2 font-mono text-[11px] leading-relaxed text-foreground/45">
																{item.description}
															</p>
														</div>
														<div className="flex shrink-0 gap-1">
															<Button
																type="button"
																variant="ghost"
																size="icon"
																aria-label={`Editar ${item.name}`}
																onClick={() => openEditItem(item)}
															>
																<Pencil className="size-4" />
															</Button>
															<DeleteBillingButton
																entity="item"
																successMessage="Item excluído com sucesso!"
																onDelete={async () => {
																	await deleteItem(item.id)
																	router.refresh()
																}}
															/>
														</div>
													</div>
													<div className="mt-4 flex flex-wrap items-center gap-2">
														<MetaBadge>{item.baseHours}h</MetaBadge>
														<MetaBadge>
															{complexityLabels[item.complexity] ??
																item.complexity}
														</MetaBadge>
														{item.monthlyFee > 0 ? (
															<MetaBadge accent>
																{formatCurrency(item.monthlyFee)}/mês
															</MetaBadge>
														) : null}
													</div>
												</article>
											))}
										</div>
									) : null}
								</div>
							)
						})}
					</div>
				)}
			</section>

			<Dialog open={categoryOpen} onOpenChange={setCategoryOpen}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>
							{editingCategory ? 'Editar categoria' : 'Nova categoria'}
						</DialogTitle>
						<DialogDescription>
							Organize os itens do catálogo por tipo de entrega.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={submitCategory} className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="category-name">Nome *</Label>
							<Input
								id="category-name"
								value={categoryValues.name}
								onChange={(event) =>
									setCategoryValues((current) => ({
										...current,
										name: event.target.value,
									}))
								}
								placeholder="Frontend"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="category-description">Descrição</Label>
							<Textarea
								id="category-description"
								value={categoryValues.description}
								onChange={(event) =>
									setCategoryValues((current) => ({
										...current,
										description: event.target.value,
									}))
								}
								rows={3}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="category-order">Ordem</Label>
							<Input
								id="category-order"
								type="number"
								min="0"
								value={categoryValues.order}
								onChange={(event) =>
									setCategoryValues((current) => ({
										...current,
										order: event.target.value,
									}))
								}
							/>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setCategoryOpen(false)}
							>
								Cancelar
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? 'Salvando...' : 'Salvar categoria'}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={itemOpen} onOpenChange={setItemOpen}>
				<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
					<DialogHeader>
						<DialogTitle>
							{editingItem ? 'Editar item' : 'Novo item'}
						</DialogTitle>
						<DialogDescription>
							Esta descrição aparece no detalhamento da proposta e no PDF.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={submitItem} className="flex flex-col gap-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="flex flex-col gap-2">
								<Label htmlFor="catalog-item-name">Nome *</Label>
								<Input
									id="catalog-item-name"
									value={itemValues.name}
									onChange={(event) =>
										setItemValues((current) => ({
											...current,
											name: event.target.value,
										}))
									}
									placeholder="Painel de gestão"
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="catalog-item-category">Categoria</Label>
								<Select
									value={itemValues.categoryId || 'none'}
									onValueChange={(value) =>
										setItemValues((current) => ({
											...current,
											categoryId: value === 'none' ? '' : value,
										}))
									}
								>
									<SelectTrigger id="catalog-item-category">
										<SelectValue placeholder="Sem categoria" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">Sem categoria</SelectItem>
										{categories.map((category) => (
											<SelectItem key={category.id} value={category.id}>
												{category.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="catalog-item-description">Descrição *</Label>
							<Textarea
								id="catalog-item-description"
								value={itemValues.description}
								onChange={(event) =>
									setItemValues((current) => ({
										...current,
										description: event.target.value,
									}))
								}
								placeholder="Descreva entregas, telas, regras de negócio e observações."
								rows={5}
							/>
						</div>
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							<div className="flex flex-col gap-2">
								<Label htmlFor="catalog-item-hours">Horas base</Label>
								<Input
									id="catalog-item-hours"
									type="number"
									min="0"
									step="any"
									value={itemValues.baseHours}
									onChange={(event) =>
										setItemValues((current) => ({
											...current,
											baseHours: event.target.value,
										}))
									}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="catalog-item-complexity">Complexidade</Label>
								<Select
									value={itemValues.complexity}
									onValueChange={(value) =>
										setItemValues((current) => ({
											...current,
											complexity: value,
										}))
									}
								>
									<SelectTrigger id="catalog-item-complexity">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="baixa">Baixa</SelectItem>
										<SelectItem value="media">Média</SelectItem>
										<SelectItem value="alta">Alta</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="catalog-item-monthly">Mensalidade (R$)</Label>
								<Input
									id="catalog-item-monthly"
									type="number"
									min="0"
									step="any"
									value={itemValues.monthlyFee}
									onChange={(event) =>
										setItemValues((current) => ({
											...current,
											monthlyFee: event.target.value,
										}))
									}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="catalog-item-duration">Duração (meses)</Label>
								<Input
									id="catalog-item-duration"
									type="number"
									min="1"
									step="1"
									value={itemValues.monthlyDuration}
									onChange={(event) =>
										setItemValues((current) => ({
											...current,
											monthlyDuration: event.target.value,
										}))
									}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setItemOpen(false)}
							>
								Cancelar
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? 'Salvando...' : 'Salvar item'}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	)
}
