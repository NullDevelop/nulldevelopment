'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { signatureHash } from '@/lib/signature'

type ActionResult = { success: boolean; error?: string }

export async function approveQuoteByToken(
	token: string,
	signerName: string,
): Promise<ActionResult> {
	const name = signerName.trim()
	if (!name) return { success: false, error: 'Informe seu nome completo.' }

	const quote = await prisma.quote.findUnique({
		where: { publicToken: token },
	})

	if (!quote) return { success: false, error: 'Proposta não encontrada.' }
	if (quote.status === 'aprovada') {
		return { success: false, error: 'Esta proposta já foi aprovada.' }
	}
	if (quote.status !== 'enviada') {
		return { success: false, error: 'Esta proposta ainda não foi enviada.' }
	}
	if (!quote.signatureHash) {
		return {
			success: false,
			error: 'Esta proposta ainda não foi assinada pelo contratado.',
		}
	}

	const now = new Date()
	await prisma.quote.update({
		where: { id: quote.id },
		data: {
			status: 'aprovada',
			approvedAt: now,
			signedAt: now,
			signerName: name,
			signatureHash: signatureHash('quote', quote.id, name, now.toISOString()),
		},
	})

	revalidatePath(`/proposta/${token}`)
	return { success: true }
}

export async function signContractByToken(
	token: string,
	signerName: string,
): Promise<ActionResult> {
	const name = signerName.trim()
	if (!name) return { success: false, error: 'Informe seu nome completo.' }

	const contract = await prisma.contract.findUnique({
		where: { publicToken: token },
	})

	if (!contract) return { success: false, error: 'Contrato não encontrado.' }
	if (contract.clientSigned) {
		return { success: false, error: 'Este contrato já foi assinado.' }
	}
	if (contract.status !== 'enviado' || !contract.providerSigned) {
		return {
			success: false,
			error: 'Este contrato ainda não está disponível para assinatura.',
		}
	}

	const now = new Date()
	await prisma.contract.update({
		where: { id: contract.id },
		data: {
			clientSigned: true,
			clientSignedAt: now,
			clientSignerName: name,
			clientSignatureHash: signatureHash(
				'contract',
				contract.id,
				name,
				now.toISOString(),
			),
			status: 'assinado',
		},
	})

	revalidatePath(`/contrato/${token}`)
	return { success: true }
}
