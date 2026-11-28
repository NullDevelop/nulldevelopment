import { notFound } from 'next/navigation'
import { requirePermission } from '@/lib/permissions'
import { QuoteDetail } from '../_components/quote-detail'
import { getQuoteById } from '../_data-access/get-quotes'

export const dynamic = 'force-dynamic'

export default async function BudgetDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	await requirePermission('billing:read')
	const { id } = await params
	const quote = await getQuoteById(id)

	if (!quote) notFound()

	return <QuoteDetail quote={quote} />
}
