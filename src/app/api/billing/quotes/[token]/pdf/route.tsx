import { renderToBuffer } from '@react-pdf/renderer'
import { QuotePdf } from '@/lib/pdf/documents'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ token: string }> },
) {
	const { token } = await params
	const quote = await prisma.quote.findUnique({
		where: { publicToken: token },
		include: { items: { orderBy: { order: 'asc' } } },
	})

	if (!quote) {
		return new Response('Proposta não encontrada', { status: 404 })
	}

	const pdf = await renderToBuffer(
		<QuotePdf
			quote={{
				number: quote.number,
				title: quote.title,
				description: quote.description,
				status: quote.status,
				clientName: quote.clientName,
				clientEmail: quote.clientEmail,
				hourlyRate: quote.hourlyRate,
				discount: quote.discount,
				urgencyFee: quote.urgencyFee,
				entryAmount: quote.entryAmount,
				installments: quote.installments,
				totalHours: quote.totalHours,
				totalValue: quote.totalValue,
				monthlyTotal: quote.monthlyTotal,
				expirationDate: quote.expirationDate,
				signerName: quote.signerName,
				signatureHash: quote.signatureHash,
				signedAt: quote.signedAt,
				items: quote.items.map((item) => ({
					name: item.name,
					description: item.description,
					hours: item.hours,
					unitValue: item.unitValue,
					monthlyFee: item.monthlyFee,
					monthlyDuration: item.monthlyDuration,
				})),
			}}
		/>,
	)

	const filename = `proposta-${quote.number}.pdf`.replace(/[^a-z0-9.-]/gi, '-')

	return new Response(new Uint8Array(pdf), {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="${filename}"`,
			'Cache-Control': 'no-store',
		},
	})
}
