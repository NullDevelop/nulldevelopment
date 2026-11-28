import { requirePermission } from '@/lib/permissions'
import { QuoteForm } from '../_components/quote-form'
import { getBudgetFormOptions } from '../_data-access/get-budget-options'

export const dynamic = 'force-dynamic'

export default async function NewBudgetPage() {
	await requirePermission('billing:read')
	const options = await getBudgetFormOptions()

	return (
		<QuoteForm clients={options.clients} catalogItems={options.catalogItems} />
	)
}
