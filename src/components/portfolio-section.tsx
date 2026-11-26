'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, ArrowUpRight } from 'lucide-react'
import { BlurFade } from './ui/blur-fade'
import { localizeProject } from '@/i18n/projects'
import { useI18n } from '@/i18n/provider'
import { curatedProjects, type ProjectData } from '@/lib/projects-data'

const hiddenProjectSlugs = new Set(['footeasy', 'sira'])

interface PortfolioSectionProps {
	dbProjects: ProjectData[]
}

export function PortfolioSection({ dbProjects }: PortfolioSectionProps) {
	const { t, locale } = useI18n()

	const projectsToDisplay = (dbProjects.length > 0 ? dbProjects : curatedProjects)
		.filter((project) => !hiddenProjectSlugs.has(project.slug))
		.map((project) => localizeProject(project, locale, t))

	const projectGroups = [
		{
			id: 'public',
			number: '01',
			title: t.portfolio.public,
			projects: projectsToDisplay.filter((project) => project.category === 'governamental'),
		},
		{
			id: 'private',
			number: '02',
			title: t.portfolio.private,
			projects: projectsToDisplay.filter((project) => project.category !== 'governamental'),
		},
	]

	return (
		<section className="min-h-screen flex flex-col justify-center py-24 lg:py-28 relative z-10 px-4 sm:px-6 scroll-mt-16 sm:scroll-mt-20" id="portfolio">
			<div className="max-w-6xl mx-auto w-full">
				{/* Section Header */}
				<div className="mb-14 border-b border-white/10 pb-7">
					<div className="max-w-2xl">
						<span className="text-xs sm:text-sm uppercase tracking-widest text-primary font-semibold">
							{t.portfolio.eyebrow}
						</span>
						<h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
							{t.portfolio.title}
						</h2>
					</div>
				</div>

				<div className="space-y-14">
					{projectGroups.map((group) => (
						<section key={group.id} aria-labelledby={`portfolio-${group.id}-heading`}>
							<div className="mb-6 flex items-end justify-between border-b border-white/10 pb-4">
								<div className="flex items-center gap-4">
									<span className="font-mono text-xs tracking-widest text-primary">
										{group.number}
									</span>
									<h3
										id={`portfolio-${group.id}-heading`}
										className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
									>
										{group.title}
									</h3>
								</div>
								<span className="border border-white/10 bg-card px-2.5 py-1 text-[10px] font-mono tracking-widest text-brand-steel">
									{group.projects.length.toString().padStart(2, '0')}
								</span>
							</div>

							{group.projects.length === 0 ? (
								<p className="border-l-2 border-primary/50 bg-card px-5 py-4 text-sm text-brand-steel">
									{t.portfolio.emptyCategory}
								</p>
							) : (
								<div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
									{group.projects.map((project, index) => {
										const isLive = !!project.link
										const badge = project.statusBadge || (isLive ? t.portfolio.live : t.portfolio.caseBadge)

										return (
											<BlurFade key={project.id} delay={0.06 * (index + 1)} inView>
												<article className="group/card flex h-full flex-col overflow-hidden rounded-[2px] border border-white/10 bg-gradient-to-b from-[#20252a] to-[#171a1e] shadow-lg shadow-black/20 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-black/30 motion-reduce:transition-none">
													<div aria-hidden="true" className="h-0.5 w-full bg-linear-to-r from-primary via-primary/50 to-transparent" />
													<Link
														href={`/projects/${project.slug}`}
														aria-label={`${project.title} — ${t.portfolio.viewFullCase}`}
														className="group/image relative block aspect-[16/9] overflow-hidden bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
													>
														<Image
															src={project.image}
															alt={project.title}
															fill
															loading={index === 0 ? 'eager' : 'lazy'}
															sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
															className="object-cover transition-transform duration-700 group-hover/card:scale-[1.04] motion-reduce:transition-none"
														/>
														<div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent" />
														<span className="absolute left-3 top-3 border border-primary/50 bg-background/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary backdrop-blur">
															{badge}
														</span>
														<span aria-hidden="true" className="absolute right-3 top-3 font-mono text-[10px] tracking-[0.2em] text-white/80">
															{group.number}.{(index + 1).toString().padStart(2, '0')}
														</span>
														<h4 className="absolute bottom-0 left-0 right-0 line-clamp-2 px-4 pb-4 text-xl font-semibold tracking-tight text-pretty text-white sm:px-5 sm:pb-5 sm:text-2xl">
															{project.title}
														</h4>
													</Link>

													<div className="flex flex-1 flex-col p-4 sm:p-5">
														<p className="line-clamp-2 text-sm leading-relaxed text-brand-steel">
															{project.shortDescription}
														</p>

														<div className="mt-4 flex flex-wrap items-center gap-2">
															{project.stack.slice(0, 4).map((tech) => (
																<span
																	key={tech}
																	className="border border-primary/20 bg-primary/[0.06] px-2.5 py-1 text-[10px] font-medium text-foreground/90"
																>
																	{tech}
																</span>
															))}
														</div>

														<div className="mt-auto flex items-center gap-2 border-t border-white/10 pt-4">
															{project.link && (
																<a
																	href={project.link}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="inline-flex h-10 flex-1 items-center justify-center gap-2 border border-white/20 px-3 text-[11px] font-medium text-brand-steel transition-colors hover:border-primary/50 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
																>
																	<span>{t.portfolio.live}</span>
																	<ExternalLink aria-hidden="true" className="h-4 w-4" />
																</a>
															)}
															<Link
																href={`/projects/${project.slug}`}
																className="group/btn inline-flex h-10 flex-1 items-center justify-center gap-2 bg-primary px-3 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
															>
																<span>{project.link ? t.portfolio.viewCase : t.portfolio.viewFullCase}</span>
																<ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 motion-reduce:transition-none" />
															</Link>
														</div>
													</div>
												</article>
											</BlurFade>
										)
									})}
								</div>
							)}
						</section>
					))}
				</div>
			</div>
		</section>
	)
}
