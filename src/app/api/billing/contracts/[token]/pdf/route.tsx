import { renderToBuffer } from '@react-pdf/renderer'
import { ContractPdf } from '@/lib/pdf/documents'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ token: string }> },
) {
	const { token } = await params
	const contract = await prisma.contract.findUnique({
		where: { publicToken: token },
	})

	if (!contract) {
		return new Response('Contrato não encontrado', { status: 404 })
	}

	const pdf = await renderToBuffer(
		<ContractPdf
			contract={{
				number: contract.number,
				title: contract.title,
				status: contract.status,
				clientName: contract.clientName,
				clientEmail: contract.clientEmail,
				objectClause: contract.objectClause,
				timelineClause: contract.timelineClause,
				paymentClause: contract.paymentClause,
				ipClause: contract.ipClause,
				totalValue: contract.totalValue,
				startDate: contract.startDate,
				endDate: contract.endDate,
				providerSigned: contract.providerSigned,
				providerSignerName: contract.providerSignerName,
				providerSignatureHash: contract.providerSignatureHash,
				clientSigned: contract.clientSigned,
				clientSignerName: contract.clientSignerName,
				clientSignatureHash: contract.clientSignatureHash,
			}}
		/>,
	)

	const filename = `contrato-${contract.number}.pdf`.replace(
		/[^a-z0-9.-]/gi,
		'-',
	)

	return new Response(new Uint8Array(pdf), {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="${filename}"`,
			'Cache-Control': 'no-store',
		},
	})
}
