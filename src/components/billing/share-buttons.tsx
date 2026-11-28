'use client'

import { Copy, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { whatsappUrl } from '@/i18n/format'
import { company } from '@/lib/company'

interface ShareButtonsProps {
	path: string
	message: string
	entity: string
}

export function ShareButtons({ path, message, entity }: ShareButtonsProps) {
	function publicUrl() {
		return `${window.location.origin}${path}`
	}

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(publicUrl())
			toast.success(`Link do ${entity} copiado!`)
		} catch (error) {
			console.error(error)
			toast.error('Não foi possível copiar o link.')
		}
	}

	function handleWhatsApp() {
		window.open(
			whatsappUrl(company.whatsapp, `${message} ${publicUrl()}`),
			'_blank',
			'noopener,noreferrer',
		)
	}

	return (
		<div className="flex flex-wrap gap-2">
			<Button type="button" variant="outline" size="sm" onClick={handleCopy}>
				<Copy className="size-4" />
				Copiar link
			</Button>
			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={handleWhatsApp}
			>
				<MessageCircle className="size-4" />
				Compartilhar no WhatsApp
			</Button>
		</div>
	)
}
