'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { MobileMenu } from './mobile-menu'
import { NullBrandLogo } from './null-logo'

const navItems = [
	{ name: 'Soluções', href: '/#solucoes' },
	{ name: 'Projetos', href: '/#portfolio' },
	{ name: 'Como trabalhamos', href: '/#como-trabalhamos' },
]

export const Header = () => {
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 24)
		}
		handleScroll()
		window.addEventListener('scroll', handleScroll, { passive: true })
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b ${
				scrolled
					? 'bg-background/90 backdrop-blur-md border-white/[0.08]'
					: 'bg-background/70 backdrop-blur-sm border-white/[0.05]'
			}`}
		>
			<div className="max-w-6xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-6">
				<Link href="/" className="shrink-0 focus:outline-none">
					<NullBrandLogo size="sm" />
				</Link>

				<div className="flex items-center gap-8">
					<nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
						{navItems.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className="text-xs sm:text-[13px] font-medium text-brand-steel hover:text-foreground transition-colors"
							>
								{item.name}
							</Link>
						))}
					</nav>

					<Link
						href="/#contato"
						className="hidden md:inline-flex items-center justify-center px-5 py-2.5 text-xs font-medium text-foreground border border-white/15 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/30 rounded-[2px] transition-all"
					>
						Vamos conversar
					</Link>

					<div className="md:hidden">
						<MobileMenu />
					</div>
				</div>
			</div>
		</header>
	)
}
