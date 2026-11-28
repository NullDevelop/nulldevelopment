import { prisma } from '@/lib/prisma'

export async function getOverview() {
	const [
		projectsCount,
		companiesCount,
		messagesCount,
		quotesCount,
		contractsCount,
		catalogItemsCount,
	] = await Promise.all([
		prisma.project.count(),
		prisma.company.count(),
		prisma.message.count(),
		prisma.quote.count(),
		prisma.contract.count(),
		prisma.catalogItem.count(),
	])

	return {
		projectsCount,
		companiesCount,
		messagesCount,
		quotesCount,
		contractsCount,
		catalogItemsCount,
	}
}

export type Overview = Awaited<ReturnType<typeof getOverview>>
