import { requirePermission } from '@/lib/permissions'
import { BudgetsManager } from './_components/budgets-manager'
import { getQuotes } from './_data-access/get-quotes'

export const dynamic = 'force-dynamic'

export default async function BudgetsPage() {
	await requirePermission('billing:read')
	const quotes = await getQuotes()

	return <BudgetsManager quotes={quotes} />
}
