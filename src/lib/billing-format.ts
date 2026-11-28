export interface BillingItemInput {
	name?: string
	description?: string | null
	hours: number
	monthlyFee?: number | null
	monthlyDuration?: number | null
}

export function calcQuoteTotals(
	items: BillingItemInput[],
	hourlyRate: number,
	discount: number,
	urgencyFee: number,
) {
	const totalHours = items.reduce((sum, item) => sum + item.hours, 0)
	const gross = totalHours * hourlyRate
	const discountValue = gross * (discount / 100)
	const urgencyValue = gross * (urgencyFee / 100)
	const totalValue = Math.max(0, gross - discountValue + urgencyValue)
	const monthlyTotal = items.reduce(
		(sum, item) => sum + (item.monthlyFee ?? 0),
		0,
	)

	return {
		totalHours,
		gross,
		discountValue,
		urgencyValue,
		totalValue,
		monthlyTotal,
	}
}

export function calcItemValue(hours: number, hourlyRate: number) {
	return hours * hourlyRate
}

export function formatCurrency(value: number) {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(value)
}

export function formatDate(value: Date | string | null | undefined) {
	if (!value) return '—'
	const date = typeof value === 'string' ? new Date(value) : value
	return new Intl.DateTimeFormat('pt-BR', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	}).format(date)
}

export const quoteStatusLabels: Record<string, string> = {
	rascunho: 'Rascunho',
	enviada: 'Enviada',
	aprovada: 'Aprovada',
	recusada: 'Recusada',
	assinada: 'Assinada',
	cancelada: 'Cancelada',
}

export const contractStatusLabels: Record<string, string> = {
	rascunho: 'Rascunho',
	enviado: 'Enviado',
	assinado: 'Assinado',
	cancelado: 'Cancelado',
}
