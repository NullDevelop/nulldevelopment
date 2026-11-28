import { formatCurrency, formatDate } from './billing-format'

interface QuoteForClauses {
	title: string
	description?: string | null
	totalValue: number
	expirationDate?: Date | string | null
}

export function buildContractClauses(quote: QuoteForClauses) {
	const scope =
		quote.description?.trim() ||
		'escopo detalhado no orçamento de referência, parte integrante deste instrumento.'

	return {
		title: `Contrato - ${quote.title}`,
		objectClause: `O presente contrato tem por objeto a execução de ${scope}`,
		timelineClause: `Os serviços serão executados conforme o cronograma definido no orçamento, com previsão de conclusão até ${formatDate(quote.expirationDate)}.`,
		paymentClause: `O valor total dos serviços é de ${formatCurrency(quote.totalValue)}, conforme condições de entrada e parcelamento descritas no orçamento de referência.`,
		ipClause:
			'Após a quitação integral, todos os direitos intelectuais e o código-fonte desenvolvido serão transferidos ao Contratante, podendo o Contratado utilizá-los apenas para fins de comprovação de autoria.',
	}
}
