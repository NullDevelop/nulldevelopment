'use client'

import { Pencil, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState, useTransition } from 'react'
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
} from './actions'

export interface CatalogItemRow {
	id: string
	name: string
	description: string
	baseHours: number
	complexity: string
	monthlyFee: number
	monthlyDuration: number
	categoryId: string | null
	categoryName: string
}

export interface CatalogCategoryRow {
	id: string
	name: string
	description: string | null
	order: number
	items: CatalogItemRow[]
}

const complexityLabels: Record<string, string> = {
	baixa: 'Baixa',
	media: 'Média',
	alta: 'Alta',
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

	const items = categories.flatMap((category) => category.items)

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
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 className="font-sentient text-3xl font-bold text-foreground">
						Catálogo de itens
					</h1>
					<p className="font-mono text-sm text-foreground/40 mt-1">
						{items.length} item{items.length !== 1 ? 's' : ''} para montar
						propostas detalhadas
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

			<section className="rounded-[2px] border border-white/10 bg-card overflow-hidden">
				<div className="border-b border-white/5 px-6 py-4">
					<h2 className="font-mono text-xs uppercase tracking-widest text-primary">
						Categorias
					</h2>
				</div>
				{categories.length === 0 ? (
					<p className="px-6 py-10 text-center font-mono text-sm text-foreground/30">
						Nenhuma categoria cadastrada.
					</p>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full min-w-[700px]">
							<thead>
								<tr className="border-b border-white/5">
									<th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-widest text-foreground/40">
										Nome
									</th>
									<th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-widest text-foreground/40">
										Descrição
									</th>
									<th className="px-6 py-4 text-center font-mono text-xs uppercase tracking-widest text-foreground/40">
										Itens
									</th>
									<th className="px-6 py-4 text-right font-mono text-xs uppercase tracking-widest text-foreground/40">
										Ações
									</th>
								</tr>
							</thead>
							<tbody>
								{categories.map((category) => (
									<tr
										key={category.id}
										className="border-b border-white/5 last:border-0 hover:bg-white/3"
									>
										<td className="px-6 py-4 font-medium text-foreground">
											{category.name}
										</td>
										<td className="max-w-[420px] truncate px-6 py-4 font-mono text-xs text-foreground/50">
											{category.description ?? '—'}
										</td>
										<td className="px-6 py-4 text-center font-mono text-xs text-foreground/60">
											{category.items.length}
										</td>
										<td className="px-6 py-4">
											<div className="flex justify-end gap-1">
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
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</section>

			<section className="rounded-[2px] border border-white/10 bg-card overflow-hidden">
				<div className="border-b border-white/5 px-6 py-4">
					<h2 className="font-mono text-xs uppercase tracking-widest text-primary">
						Itens do catálogo
					</h2>
				</div>
				{items.length === 0 ? (
					<p className="px-6 py-10 text-center font-mono text-sm text-foreground/30">
						Nenhum item cadastrado. Crie itens com descrição detalhada para usar
						nos orçamentos.
					</p>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full min-w-[980px]">
							<thead>
								<tr className="border-b border-white/5">
									<th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-widest text-foreground/40">
										Item
									</th>
									<th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-widest text-foreground/40">
										Categoria
									</th>
									<th className="px-6 py-4 text-center font-mono text-xs uppercase tracking-widest text-foreground/40">
										Horas
									</th>
									<th className="px-6 py-4 text-center font-mono text-xs uppercase tracking-widest text-foreground/40">
										Complexidade
									</th>
									<th className="px-6 py-4 text-right font-mono text-xs uppercase tracking-widest text-foreground/40">
										Mensalidade
									</th>
									<th className="px-6 py-4 text-right font-mono text-xs uppercase tracking-widest text-foreground/40">
										Ações
									</th>
								</tr>
							</thead>
							<tbody>
								{items.map((item) => (
									<tr
										key={item.id}
										className="border-b border-white/5 last:border-0 hover:bg-white/3"
									>
										<td className="max-w-[380px] px-6 py-4">
											<span className="font-medium text-foreground">
												{item.name}
											</span>
											<span className="mt-0.5 block truncate font-mono text-[10px] text-foreground/40">
												{item.description}
											</span>
										</td>
										<td className="px-6 py-4 font-mono text-xs text-foreground/60">
											{item.categoryName || '—'}
										</td>
										<td className="px-6 py-4 text-center font-mono text-xs text-foreground/60">
											{item.baseHours}
										</td>
										<td className="px-6 py-4 text-center font-mono text-xs text-foreground/60">
											{complexityLabels[item.complexity] ?? item.complexity}
										</td>
										<td className="px-6 py-4 text-right font-mono text-xs text-foreground/60">
											{formatCurrency(item.monthlyFee)}
										</td>
										<td className="px-6 py-4">
											<div className="flex justify-end gap-1">
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
										</td>
									</tr>
								))}
							</tbody>
						</table>
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
