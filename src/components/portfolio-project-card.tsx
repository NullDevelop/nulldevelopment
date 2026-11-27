import { ArrowUpRight, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Dictionary } from '@/i18n/dictionaries/types'
import type { ProjectData } from '@/lib/projects-data'

interface PortfolioProjectCardProps {
	project: ProjectData
	groupNumber: string
	index: number
	t: Dictionary
}

export function PortfolioProjectCard({
	project,
	groupNumber,
	index,
	t,
}: PortfolioProjectCardProps) {
	const isLive = !!project.link
	const badge =
		project.statusBadge || (isLive ? t.portfolio.live : t.portfolio.caseBadge)
	const caseNumber = `${groupNumber}.${(index + 1).toString().padStart(2, '0')}`
	const categoryLabel = {
		saas: t.projectPage.saas,
		governamental: t.projectPage.public,
		landing: t.projectPage.landing,
		privado: t.projectPage.private,
	}[project.category]
	const visibleStack = project.stack.slice(0, 4)
	const hiddenStackCount = project.stack.length - visibleStack.length
	const href = `/projects/${project.slug}`

	return (
		<article className="group/card relative flex h-full flex-col overflow-hidden rounded-[2px] border border-white/[0.08] bg-[#16191C] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] motion-reduce:transition-none">
			<div
				aria-hidden="true"
				className="absolute inset-x-0 top-0 z-10 h-px bg-linear-to-r from-primary/70 via-primary/25 to-transparent"
			/>

			<Link
				href={href}
				aria-label={`${project.title} — ${t.portfolio.viewFullCase}`}
				className="group/image relative block aspect-[16/10] overflow-hidden bg-[#101214] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
			>
				<Image
					src={project.image}
					alt={project.title}
					fill
					loading={index === 0 ? 'eager' : 'lazy'}
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					className="object-cover transition-transform duration-700 group-hover/card:scale-[1.05] motion-reduce:transition-none"
				/>

				<div
					aria-hidden="true"
					className="absolute inset-0 bg-linear-to-t from-[#0B0D0F] via-[#0B0D0F]/25 to-transparent"
				/>
				<div
					aria-hidden="true"
					className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(201,120,85,0.16),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
				/>
				<div
					aria-hidden="true"
					className="absolute inset-3 border border-white/[0.07] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
				/>

				<div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
					<span className="inline-flex items-center gap-2 border border-primary/30 bg-[#0B0D0F]/85 px-2.5 py-1 backdrop-blur-sm">
						<span
							aria-hidden="true"
							className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_2px_rgba(201,120,85,0.45)]"
						/>
						<span className="font-mono text-[9px] uppercase tracking-[0.16em] text-primary">
							{badge}
						</span>
					</span>
					<span className="font-mono text-[10px] tracking-[0.2em] text-white/60">
						{caseNumber}
					</span>
				</div>

				<div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
					<p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-primary/85">
						<span
							aria-hidden="true"
							className="h-px w-4 shrink-0 bg-primary/60"
						/>
						{categoryLabel}
					</p>
					<h4 className="mt-2 font-sentient text-xl font-medium leading-tight tracking-tight text-pretty text-foreground sm:text-2xl">
						{project.title}
					</h4>
				</div>
			</Link>

			<div className="flex flex-1 flex-col p-5 sm:p-6">
				<p className="line-clamp-2 border-l border-primary/30 pl-3 text-[13px] leading-relaxed text-brand-steel">
					{project.shortDescription}
				</p>

				{project.stack.length > 0 && (
					<div className="mt-5">
						<p className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand-graphite">
							Stack
						</p>
						<div className="mt-2 flex flex-wrap gap-1.5">
							{visibleStack.map((tech) => (
								<span
									key={tech}
									className="border border-white/[0.08] bg-white/[0.03] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-brand-steel"
								>
									{tech}
								</span>
							))}
							{hiddenStackCount > 0 && (
								<span className="border border-white/[0.06] px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-brand-graphite">
									+{hiddenStackCount}
								</span>
							)}
						</div>
					</div>
				)}

				<div className="mt-auto flex items-center gap-3 border-t border-white/[0.07] pt-5">
					<span className="hidden font-mono text-[10px] tracking-[0.16em] text-brand-graphite sm:inline">
						CASE {caseNumber}
					</span>

					<div className="ml-auto flex items-center gap-2">
						{project.link && (
							<a
								href={project.link}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={`${project.title} — ${t.portfolio.live}`}
								className="inline-flex h-9 w-9 items-center justify-center border border-white/[0.1] text-brand-steel transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
							>
								<ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
							</a>
						)}
						<Link
							href={href}
							className="group/btn inline-flex h-9 items-center justify-center gap-2 bg-primary px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
						>
							<span>
								{isLive ? t.portfolio.viewCase : t.portfolio.viewFullCase}
							</span>
							<ArrowUpRight
								aria-hidden="true"
								className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 motion-reduce:transition-none"
							/>
						</Link>
					</div>
				</div>
			</div>
		</article>
	)
}
