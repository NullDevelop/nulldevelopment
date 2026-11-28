import { Landmark } from 'lucide-react'
import Image from 'next/image'
import type { ProjectData } from '@/lib/projects-data'

interface PublicSectorCardProps {
	project: ProjectData
}

export function PublicSectorCard({ project }: PublicSectorCardProps) {
	return (
		<article className="group relative flex h-full items-start gap-4 overflow-hidden rounded-[2px] border border-white/[0.08] bg-[#16191C] p-5 transition-colors duration-300 hover:border-primary/40 sm:gap-5 sm:p-6">
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
				<p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-pretty text-brand-steel">
					{project.shortDescription}
				</p>
			</div>
		</article>
	)
}
