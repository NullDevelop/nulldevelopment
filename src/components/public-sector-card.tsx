interface PublicSectorCardProps {
	name: string
	description: string
}

export function PublicSectorCard({ name, description }: PublicSectorCardProps) {
	return (
		<article className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-[2px] border border-white/[0.08] bg-[#16191C] px-6 py-6 transition-colors duration-300 hover:border-primary/40">
			<div
				aria-hidden="true"
				className="absolute inset-x-0 top-0 z-10 h-px bg-linear-to-r from-primary/70 via-primary/25 to-transparent"
			/>
			<h4 className="font-sentient text-xl font-medium leading-tight tracking-tight text-pretty text-foreground sm:text-2xl">
				{name}
			</h4>
			<p className="border-l border-primary/30 pl-3 text-[13px] leading-relaxed text-pretty text-brand-steel">
				{description}
			</p>
		</article>
	)
}
