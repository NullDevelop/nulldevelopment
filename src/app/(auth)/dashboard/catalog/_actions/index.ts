'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requirePermission } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'

const CategorySchema = z.object({
	name: z.string().min(1, 'Informe o nome da categoria'),
	description: z.string().optional(),
	order: z.coerce.number().int().min(0).optional(),
})

const ItemSchema = z.object({
	name: z.string().min(1, 'Informe o nome do item'),
	description: z.string().min(1, 'Descreva o item'),
	baseHours: z.coerce.number().min(0),
	complexity: z.string().optional(),
	monthlyFee: z.coerce.number().min(0).optional(),
	monthlyDuration: z.coerce.number().int().min(1).optional(),
	categoryId: z.string().optional(),
})

export type CatalogCategoryInput = z.input<typeof CategorySchema>
export type CatalogItemInput = z.input<typeof ItemSchema>

async function refresh() {
	revalidatePath('/dashboard/catalog')
	revalidatePath('/dashboard/budgets/new')
	revalidatePath('/dashboard')
}

export async function createCategory(input: CatalogCategoryInput) {
	await requirePermission('billing:write')
	const data = CategorySchema.parse(input)
	const category = await prisma.catalogCategory.create({
		data: {
			name: data.name.trim(),
			description: data.description?.trim() || null,
			order: data.order ?? 0,
		},
	})
	await refresh()
	return category
}

export async function updateCategory(id: string, input: CatalogCategoryInput) {
	await requirePermission('billing:write')
	const data = CategorySchema.parse(input)
	const category = await prisma.catalogCategory.update({
		where: { id },
		data: {
			name: data.name.trim(),
			description: data.description?.trim() || null,
			order: data.order ?? 0,
		},
	})
	await refresh()
	return category
}

export async function deleteCategory(id: string) {
	await requirePermission('billing:write')
	await prisma.catalogCategory.delete({ where: { id } })
	await refresh()
}

export async function createItem(input: CatalogItemInput) {
	await requirePermission('billing:write')
	const data = ItemSchema.parse(input)
	const item = await prisma.catalogItem.create({
		data: {
			name: data.name.trim(),
			description: data.description.trim(),
			baseHours: data.baseHours,
			complexity: data.complexity?.trim() || 'media',
			monthlyFee: data.monthlyFee ?? 0,
			monthlyDuration: data.monthlyDuration ?? 12,
			categoryId: data.categoryId || null,
		},
	})
	await refresh()
	return item
}

export async function updateItem(id: string, input: CatalogItemInput) {
	await requirePermission('billing:write')
	const data = ItemSchema.parse(input)
	const item = await prisma.catalogItem.update({
		where: { id },
		data: {
			name: data.name.trim(),
			description: data.description.trim(),
			baseHours: data.baseHours,
			complexity: data.complexity?.trim() || 'media',
			monthlyFee: data.monthlyFee ?? 0,
			monthlyDuration: data.monthlyDuration ?? 12,
			categoryId: data.categoryId || null,
		},
	})
	await refresh()
	return item
}

export async function deleteItem(id: string) {
	await requirePermission('billing:write')
	await prisma.catalogItem.delete({ where: { id } })
	await refresh()
}
