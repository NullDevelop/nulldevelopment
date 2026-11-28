import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/permissions'
import { QuoteForm } from '../../_components/quote-form'
import { getBudgetFormOptions } from '../../_data-access/get-budget-options'
import { getQuoteFormData } from '../../_data-access/get-quotes'

export const dynamic = 'force-dynamic'

export default async function EditBudgetPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	await requirePermission('billing:read')
	const { id } = await params
	const [quote, options] = await Promise.all([
		getQuoteFormData(id),
		getBudgetFormOptions(),
	])

	if (!quote) notFound()

	return (
		<QuoteForm
			clients={options.clients}
			catalogItems={options.catalogItems}
			quote={quote}
		/>
	)
}
