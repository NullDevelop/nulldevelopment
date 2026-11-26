'use client'

import { ArrowUp } from 'lucide-react'
import Link from 'next/link'
import { NullBrandLogo } from './null-logo'

export function Footer() {
	return (
		<footer className="bg-background py-10">
			<div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col gap-6">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-6">
					<Link href="/" className="shrink-0 focus:outline-none">
						<NullBrandLogo size="sm" />
					</Link>

					<p className="text-[10px] font-medium uppercase tracking-[0.22em] text-brand-graphite text-center">
						Tecnologia para o trabalho real
					</p>

					<Link
						href="#"
						className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-steel hover:text-foreground transition-colors"
					>
						<span>Voltar ao topo</span>
						<ArrowUp className="w-3 h-3" />
					</Link>
				</div>

				<nav
					aria-label="Links institucionais"
					className="flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-xs text-brand-steel"
				>
					<Link href="/#portfolio" className="hover:text-foreground transition-colors">
						Projetos
					</Link>
					<Link href="/termos" className="hover:text-foreground transition-colors">
						Termos
					</Link>
					<Link href="/privacidade" className="hover:text-foreground transition-colors">
						Privacidade
					</Link>
				</nav>
			</div>
		</footer>
	)
}
