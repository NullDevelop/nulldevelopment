import {
	ArrowUpRight,
	ExternalLink,
	Landmark,
	MessageCircle,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ProjectData } from '@/lib/projects-data'

interface CompactProjectCardProps {
	project: ProjectData
	showCaseLink?: boolean
	fullDescription?: boolean
	whatsapp?: {
		href: string
		label: string
	}
}

export function CompactProjectCard({
	project,
	showCaseLink = false,
	fullDescription = false,
	whatsapp,
}: CompactProjectCardProps) {
	const isLive = !!project.link
	const caseLabel = isLive
		? `Abrir ${project.title}`
		: `Ver case: ${project.title}`

	return (
		<article
			className={`group relative flex h-full items-start gap-4 overflow-hidden rounded-[2px] border border-white/[0.08] bg-[#16191C] p-5 transition-colors duration-300 hover:border-primary/40 sm:gap-5 sm:p-6 ${showCaseLink ? 'pr-12 sm:pr-14' : ''}`}
		>
			<div
				aria-hidden="true"
				className="absolute inset-x-0 top-0 z-10 h-px bg-linear-to-r from-primary/70 via-primary/25 to-transparent"
			/>

			<div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/[0.03] sm:h-16 sm:w-16">
				{project.image ? (
					<Image
						src={project.image}
						alt=""
						fill
						sizes="64px"
						className="object-cover"
					/>
				) : (
					<span className="flex h-full w-full items-center justify-center text-primary/70">
						<Landmark aria-hidden="true" className="h-6 w-6" />
					</span>
				)}
			</div>

			<div className="min-w-0">
				<h4 className="font-sentient text-xl font-medium leading-tight tracking-tight text-pretty text-foreground sm:text-2xl">
					{project.title}
				</h4>
				<p
					className={`mt-2 text-[13px] leading-relaxed text-pretty text-brand-steel ${fullDescription ? '' : 'line-clamp-2'}`}
				>
					{project.shortDescription}
				</p>
				{whatsapp && (
					<a
						href={whatsapp.href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`${whatsapp.label}: ${project.title}`}
						className="mt-4 inline-flex items-center gap-2 border border-primary/30 bg-primary/[0.07] px-3 py-1.5 text-[11px] font-medium tracking-wide text-primary transition-colors hover:border-primary/60 hover:bg-primary/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
					>
						<MessageCircle aria-hidden="true" className="h-3.5 w-3.5" />
						<span>{whatsapp.label}</span>
					</a>
				)}
			</div>

			{showCaseLink &&
				(isLive ? (
					<a
						href={project.link as string}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={caseLabel}
						className="absolute right-4 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-white/[0.08] text-brand-steel transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
					>
						<ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
					</a>
				) : (
					<Link
						href={`/projects/${project.slug}`}
						aria-label={caseLabel}
						className="absolute right-4 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-white/[0.08] text-brand-steel transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
					>
						<ArrowUpRight aria-hidden="true" className="h-4 w-4" />
					</Link>
				))}
		</article>
	)
}
