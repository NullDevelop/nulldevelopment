'use server'

import { z } from 'zod'
import { company } from '@/lib/company'
import { prisma } from '@/lib/prisma'

const MessageSchema = z.object({
	name: z.string().min(2).max(200),
	email: z.string().email().max(200),
	phone: z.string().max(20).optional(),
	city: z.string().max(100).optional(),
	industry: z.string().max(200).optional(),
	message: z.string().min(10).max(5000),
})

async function sendContactEmail(data: z.infer<typeof MessageSchema>) {
	const apiKey = process.env.RESEND_API_KEY
	if (!apiKey) {
		throw new Error('RESEND_API_KEY is not configured')
	}

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			from: `Null Development <${company.email}>`,
			to: [company.email],
			reply_to: data.email,
			subject: 'Nova mensagem de contato - Null Development',
			text: [
				`Nome: ${data.name}`,
				`E-mail: ${data.email}`,
				`Telefone: ${data.phone || 'Não informado'}`,
				`Cidade: ${data.city || 'Não informada'}`,
				`Segmento: ${data.industry || 'Não informado'}`,
				'',
				'Mensagem:',
				data.message,
			].join('\n'),
		}),
		cache: 'no-store',
	})

	if (!response.ok) {
		throw new Error(`Resend request failed with status ${response.status}`)
	}
}

export async function saveMessage(data: z.infer<typeof MessageSchema>) {
	const parsed = MessageSchema.safeParse(data)
	if (!parsed.success) {
		return { success: false, error: 'Dados inválidos' }
	}

	try {
		await prisma.message.create({
			data: {
				name: parsed.data.name,
				email: parsed.data.email,
				phone: parsed.data.phone,
				city: parsed.data.city,
				industry: parsed.data.industry,
				content: parsed.data.message,
			},
		})
	} catch (error) {
		console.error('Error saving message:', error)
		return { success: false, error: 'Falha ao salvar a mensagem' }
	}

	try {
		await sendContactEmail(parsed.data)
		return { success: true, emailSent: true }
	} catch (error) {
		console.error('Error sending contact email through Resend:', error)
		return {
			success: true,
			emailSent: false,
			error: 'Mensagem salva, mas não foi possível enviar o e-mail de notificação.',
		}
	}
}
