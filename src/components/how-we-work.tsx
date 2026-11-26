const steps = [
	{
		number: '01',
		title: 'Entender',
		description: 'Mapear sua rotina, as pessoas e o que precisa mudar.',
	},
	{
		number: '02',
		title: 'Construir',
		description: 'Transformar prioridades em uma solução útil e clara.',
	},
	{
		number: '03',
		title: 'Evoluir',
		description: 'Aprender com o uso e aprimorar o que foi entregue.',
	},
] as const

export function HowWeWork() {
	return (
		<section
			id="como-trabalhamos"
			className="bg-background border-b border-white/[0.06] py-20 sm:py-24 scroll-mt-20"
		>
			<div className="max-w-6xl mx-auto px-5 sm:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
					{/* Left Pitch */}
					<div className="lg:col-span-5">
						<p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.22em] text-[#C97855]">
							02 / Como trabalhamos
						</p>
						<h2 className="mt-4 text-3xl sm:text-[38px] font-bold tracking-[-0.025em] leading-[1.12] text-foreground">
							Primeiro, o seu desafio.
							<br />
							Depois, a tecnologia.
						</h2>
						<p className="mt-5 text-xs sm:text-sm text-brand-steel leading-relaxed max-w-xs">
							Uma construção próxima, do entendimento do problema à evolução da solução.
						</p>
					</div>

					{/* Right 3-Row Process */}
					<div className="lg:col-span-7 border-t border-white/[0.08]">
						{steps.map((step) => (
							<div
								key={step.number}
								className="grid grid-cols-12 gap-4 py-6 sm:py-7 border-b border-white/[0.08] items-baseline"
							>
								<span className="col-span-2 sm:col-span-1 text-[11px] font-mono font-medium text-[#C97855]">
									{step.number}
								</span>
								<h3 className="col-span-10 sm:col-span-4 text-base sm:text-lg font-semibold text-foreground tracking-tight">
									{step.title}
								</h3>
								<p className="col-span-10 col-start-3 sm:col-span-7 sm:col-start-auto text-xs sm:text-[13px] text-brand-steel leading-relaxed">
									{step.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
