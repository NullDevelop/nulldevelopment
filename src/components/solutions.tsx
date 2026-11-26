const solutions = [
	{
		number: '01',
		title: 'Sistemas sob medida',
		description:
			'Aplicações web e plataformas desenhadas em torno dos seus processos, não o contrário.',
		tag: 'Software com propósito',
	},
	{
		number: '02',
		title: 'Automação de processos',
		description:
			'Menos tarefas repetitivas. Mais tempo para o que exige a atenção da sua equipe.',
		tag: 'Uma rotina mais simples',
	},
	{
		number: '03',
		title: 'Integração de sistemas',
		description:
			'Ferramentas e informações conectadas para uma operação que funciona de ponta a ponta.',
		tag: 'Tudo em sintonia',
	},
] as const

export function Solutions() {
	return (
		<section
			id="solucoes"
			className="bg-[#0C0C0E] border-b border-white/[0.06] py-20 sm:py-24 scroll-mt-20"
		>
			<div className="max-w-6xl mx-auto px-5 sm:px-8">
				{/* Section Header */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end mb-12 sm:mb-14">
					<div className="lg:col-span-7">
						<p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.22em] text-[#C97855]">
							01 / Soluções
						</p>
						<h2 className="mt-4 text-3xl sm:text-[40px] font-bold tracking-[-0.025em] leading-[1.12] text-foreground">
							Menos atrito.
							<br />
							Mais possibilidades.
						</h2>
					</div>

					<div className="lg:col-span-5 lg:pb-1">
						<p className="text-xs sm:text-sm text-brand-steel leading-relaxed max-w-sm">
							Da rotina operacional à experiência digital, a tecnologia deve trabalhar a seu favor.
						</p>
					</div>
				</div>

				{/* 3-Card Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
					{solutions.map((item) => (
						<article
							key={item.number}
							className="flex flex-col justify-between p-6 sm:p-7 bg-card border border-white/[0.07] hover:border-primary/40 rounded-[2px] transition-colors"
						>
							<div>
								<span className="text-[11px] font-mono font-medium text-[#C97855]">
									{item.number}
								</span>
								<h3 className="mt-4 text-lg font-semibold text-foreground tracking-tight">
									{item.title}
								</h3>
								<p className="mt-3 text-xs sm:text-[13px] text-brand-steel leading-relaxed">
									{item.description}
								</p>
							</div>

							<div className="mt-10 pt-4 border-t border-white/[0.06]">
								<span className="text-[9.5px] font-medium uppercase tracking-[0.18em] text-brand-graphite">
									{item.tag}
								</span>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	)
}
