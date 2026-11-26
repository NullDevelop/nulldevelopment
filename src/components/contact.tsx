'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { saveMessage } from '@/app/actions/contact'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

const contactSchema = z.object({
	name: z.string().min(2, 'Informe como podemos chamar você.'),
	email: z.string().email('Informe um e-mail profissional válido.'),
	message: z.string().min(10, 'Conte brevemente qual processo ou ideia você quer transformar.'),
})

type ContactValues = z.infer<typeof contactSchema>

export function Contact() {
	const [isLoading, setIsLoading] = useState(false)

	const form = useForm<ContactValues>({
		resolver: zodResolver(contactSchema),
		defaultValues: {
			name: '',
			email: '',
			message: '',
		},
	})

	const onSubmit = async (data: ContactValues) => {
		setIsLoading(true)
		try {
			const result = await saveMessage({
				name: data.name,
				email: data.email,
				message: data.message,
			})

			if (result.success) {
				form.reset()

				if (result.emailSent) {
					toast.success('Mensagem enviada! Em breve entraremos em contato.')
				} else {
					toast.error(result.error)
				}
			} else {
				toast.error(result.error || 'Não foi possível enviar sua mensagem.')
			}
		} catch {
			toast.error('Erro de conexão. Tente novamente em instantes.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<section
			id="contato"
			className="bg-[#0C0C0E] border-b border-white/[0.06] py-20 sm:py-24 scroll-mt-20"
		>
			<div className="max-w-6xl mx-auto px-5 sm:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14">
					{/* Left Pitch */}
					<div className="lg:col-span-5 flex flex-col justify-between gap-10">
						<div>
							<p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.22em] text-[#C97855]">
								03 / Vamos conversar
							</p>
							<h2 className="mt-4 text-3xl sm:text-[42px] font-bold tracking-[-0.025em] leading-[1.08] text-foreground">
								O próximo passo
								<br />
								começa com
								<br />
								uma conversa.
							</h2>
							<p className="mt-6 text-xs sm:text-sm text-brand-steel leading-relaxed max-w-xs">
								Conte o que está travando sua rotina ou a ideia que você quer tirar do papel.
							</p>
						</div>

						<p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C97855]">
							Seu contexto é o ponto de partida.
						</p>
					</div>

					{/* Right Form */}
					<div className="lg:col-span-7">
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
							<div className="space-y-2">
								<Label htmlFor="name" className="text-xs font-medium text-brand-steel">
									Nome
								</Label>
								<Input
									id="name"
									placeholder="Como podemos chamar você?"
									className="h-11 rounded-[2px] bg-card dark:bg-card border-white/[0.1] text-sm text-foreground placeholder:text-brand-graphite focus-visible:ring-0 focus-visible:border-primary"
									{...form.register('name')}
								/>
								{form.formState.errors.name && (
									<p className="text-xs text-red-400">{form.formState.errors.name.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="email" className="text-xs font-medium text-brand-steel">
									E-mail profissional
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="voce@empresa.com"
									className="h-11 rounded-[2px] bg-card dark:bg-card border-white/[0.1] text-sm text-foreground placeholder:text-brand-graphite focus-visible:ring-0 focus-visible:border-primary"
									{...form.register('email')}
								/>
								{form.formState.errors.email && (
									<p className="text-xs text-red-400">{form.formState.errors.email.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="message" className="text-xs font-medium text-brand-steel">
									Sobre o projeto
								</Label>
								<Textarea
									id="message"
									placeholder="Qual processo ou ideia você quer transformar?"
									className="min-h-32 rounded-[2px] bg-card dark:bg-card border-white/[0.1] text-sm text-foreground placeholder:text-brand-graphite focus-visible:ring-0 focus-visible:border-primary resize-none leading-relaxed"
									{...form.register('message')}
								/>
								{form.formState.errors.message && (
									<p className="text-xs text-red-400">{form.formState.errors.message.message}</p>
								)}
							</div>

							<div className="pt-1 space-y-3">
								<button
									type="submit"
									disabled={isLoading}
									className="w-full h-12 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-[13px] font-semibold rounded-[2px] transition-colors cursor-pointer disabled:opacity-50"
								>
									<span>{isLoading ? 'Enviando...' : 'Conversar sobre meu projeto'}</span>
									<ArrowUpRight className="w-3.5 h-3.5 stroke-[2.25]" />
								</button>

								<p className="text-[11px] text-brand-graphite">
									Conte o essencial. Os detalhes vêm na conversa.
								</p>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	)
}
