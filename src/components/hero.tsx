import { ArrowDown, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { NullLogoMark } from './null-logo'

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-background border-b border-white/[0.06] pt-28 sm:pt-32">
			{/* Subtle bottom-right architectural diagonal glow & copper accent */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 overflow-hidden"
			>
				<div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-primary/[0.07] blur-[110px]" />
				<div
					className="hidden sm:block absolute bottom-0 right-0 w-[340px] h-[220px] bg-gradient-to-tl from-[#C97855]/[0.09] via-white/[0.02] to-transparent"
					style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
				/>
				<div className="hidden sm:block absolute bottom-6 -right-8 w-36 h-px bg-primary/60 -rotate-45" />
			</div>

			<div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-12 sm:pb-16">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 items-center">
					{/* Left Content */}
					<div className="lg:col-span-7">
						<p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.22em] text-[#C97855]">
							Desenvolvimento sob medida
						</p>

						<h1 className="mt-5 text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-[-0.03em] leading-[1.06] text-foreground">
							Tecnologia para
							<br />o trabalho real.
						</h1>

						<p className="mt-6 text-sm sm:text-base text-brand-steel leading-relaxed max-w-md">
							Software que simplifica processos e conecta o que faz seu negócio acontecer.
						</p>

						<div className="mt-9 flex flex-wrap items-center gap-6">
							<Link
								href="/#contato"
								className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs sm:text-[13px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-[2px] transition-colors"
							>
								<span>Vamos conversar</span>
								<ArrowUpRight className="w-3.5 h-3.5 stroke-[2.25]" />
							</Link>

							<Link
								href="/#solucoes"
								className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-medium text-brand-steel hover:text-foreground transition-colors"
							>
								<span>Conheça as soluções</span>
								<ArrowDown className="w-3.5 h-3.5 text-brand-steel" />
							</Link>
						</div>
					</div>

					{/* Right Brand Mark Feature */}
					<div className="lg:col-span-5 flex flex-col items-center justify-center py-4 lg:py-8">
						<NullLogoMark className="w-44 sm:w-52 lg:w-56 h-auto" />
						<p className="mt-7 text-[10px] font-medium uppercase tracking-[0.26em] text-brand-steel text-center">
							Do seu desafio à solução.
						</p>
					</div>
				</div>

				{/* Hero Bottom Bar */}
				<div className="mt-16 sm:mt-20 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<span className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-graphite">
						01 · Ideias que funcionam na prática
					</span>

					<Link
						href="/#solucoes"
						className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-brand-steel hover:text-foreground transition-colors"
					>
						<span>Explore a Null</span>
						<ArrowDown className="w-3 h-3" />
					</Link>
				</div>
			</div>
		</section>
	)
}
