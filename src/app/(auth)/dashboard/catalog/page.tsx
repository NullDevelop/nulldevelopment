import { requirePermission } from '@/lib/permissions'
import { CatalogManager } from './_components/catalog-manager'
import { getCatalog } from './_data-access/get-catalog'

export const dynamic = 'force-dynamic'

export default async function CatalogPage() {
	await requirePermission('billing:read')
	const categories = await getCatalog()

	return <CatalogManager categories={categories} />
}
