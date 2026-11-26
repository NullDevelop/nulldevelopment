'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { NullBrandLogo } from './null-logo'

interface MobileMenuProps {
	className?: string
}

const menuItems = [
	{ name: 'Soluções', href: '/#solucoes' },
	{ name: 'Projetos', href: '/#portfolio' },
	{ name: 'Como trabalhamos', href: '/#como-trabalhamos' },
	{ name: 'Vamos conversar', href: '/#contato' },
]

export const MobileMenu = ({ className }: MobileMenuProps) => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<Dialog.Root modal={true} open={isOpen} onOpenChange={setIsOpen}>
			<Dialog.Trigger asChild>
				<button
					type="button"
					className={cn(
						'p-2 text-brand-steel hover:text-foreground transition-colors rounded-[2px] border border-white/15 bg-white/[0.03]',
						className,
					)}
					aria-label="Abrir menu"
				>
					<Menu size={18} />
				</button>
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />

				<Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl">
					<div>
						<div className="flex items-center justify-between pb-5 border-b border-white/10">
							<NullBrandLogo size="sm" />
							<Dialog.Close asChild>
								<button
									type="button"
									className="p-1.5 text-brand-steel hover:text-foreground transition-colors rounded-[2px] border border-white/10"
									aria-label="Fechar menu"
								>
									<X size={18} />
								</button>
							</Dialog.Close>
						</div>

						<Dialog.Title className="sr-only">Navegação</Dialog.Title>

						<nav className="flex flex-col space-y-2 mt-6">
							{menuItems.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									onClick={() => setIsOpen(false)}
									className="text-sm font-medium text-brand-steel hover:text-foreground transition-colors py-3 border-b border-white/[0.06]"
								>
									{item.name}
								</Link>
							))}
						</nav>
					</div>

					<div className="pt-6 border-t border-white/10">
						<Link
							href="/#contato"
							onClick={() => setIsOpen(false)}
							className="w-full inline-flex items-center justify-center text-xs font-semibold h-11 rounded-[2px] bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
						>
							Vamos conversar
						</Link>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
