'use client'

import { Building2, Landmark } from 'lucide-react'
import { format, whatsappUrl } from '@/i18n/format'
import { localizeProject } from '@/i18n/projects'
import { useI18n } from '@/i18n/provider'
import { company } from '@/lib/company'
import type { ProjectData } from '@/lib/projects-data'
import { CompactProjectCard } from './compact-project-card'
import { BlurFade } from './ui/blur-fade'

// Institutional/restricted cases and the seed demo stay out of the showcase.
const hiddenProjectSlugs = new Set(['footeasy', 'sira', 'project-alpha'])

interface PortfolioSectionProps {
	dbProjects: ProjectData[]
}

export function PortfolioSection({ dbProjects }: PortfolioSectionProps) {
	const { t, locale } = useI18n()

	const projectsToDisplay = dbProjects
		.filter((project) => !hiddenProjectSlugs.has(project.slug))
		.map((project) => localizeProject(project, locale, t))

	const publicProjects = projectsToDisplay.filter(
		(project) => project.category === 'governamental',
	)

	const privateProjects = projectsToDisplay.filter(
		(project) => project.category !== 'governamental',
	)

	const projectGroups = [
		{
			id: 'public',
			number: '01',
			title: t.portfolio.public,
			icon: Landmark,
		},
		{
			id: 'private',
			number: '02',
			title: t.portfolio.private,
			icon: Building2,
		},
	] as const

	return (
		<section
			id="portfolio"
			className="bg-[#0C0C0E] border-b border-white/[0.06] py-20 sm:py-24 scroll-mt-20"
		>
			<div className="max-w-6xl mx-auto px-5 sm:px-8">
				{/* Section Header */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10 mb-12 sm:mb-14">
					<div className="lg:col-span-7">
						<p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
							{t.portfolio.eyebrow}
						</p>
						<h2 className="mt-4 text-3xl sm:text-[40px] font-bold tracking-[-0.025em] leading-[1.12] text-foreground">
							{t.portfolio.title}
						</h2>
					</div>

					<div className="lg:col-span-5 lg:pb-1">
						<p className="max-w-sm text-xs sm:text-sm leading-relaxed text-brand-steel">
							{t.portfolio.intro}
						</p>
					</div>
				</div>

				<div className="space-y-14 sm:space-y-16">
					{projectGroups.map((group) => {
						const CategoryIcon = group.icon
						const isPublic = group.id === 'public'
						const itemCount = isPublic
							? publicProjects.length
							: privateProjects.length
						const isEmpty = itemCount === 0

						return (
							<section
								key={group.id}
								aria-labelledby={`portfolio-${group.id}-heading`}
							>
								<div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
									<div className="flex items-center gap-4">
										<span className="flex h-9 w-9 shrink-0 items-center justify-center border border-primary/25 bg-primary/[0.07] text-primary">
											<CategoryIcon aria-hidden="true" className="h-4 w-4" />
										</span>
										<div className="flex items-baseline gap-3">
											<span className="font-mono text-[11px] tracking-[0.2em] text-brand-graphite">
												{group.number}
											</span>
											<h3
												id={`portfolio-${group.id}-heading`}
												className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
											>
												{group.title}
											</h3>
										</div>
									</div>

									<span className="inline-flex items-center gap-2 border border-white/[0.08] bg-card px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-brand-steel">
										{isEmpty ? (
											<>
												<span
													aria-hidden="true"
													className="h-1.5 w-1.5 rounded-full bg-primary"
												/>
												<span>{t.portfolio.comingSoon}</span>
											</>
										) : (
											<>
												<span className="text-primary">
													{itemCount.toString().padStart(2, '0')}
												</span>
												<span aria-hidden="true" className="text-white/15">
													/
												</span>
												<span>{t.portfolio.projectsLabel}</span>
											</>
										)}
									</span>
								</div>

								{isEmpty ? (
									<BlurFade inView>
										<div className="relative mt-6 overflow-hidden rounded-[2px] border border-dashed border-white/[0.1] bg-card/40">
											<div
												aria-hidden="true"
												className="absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,rgba(201,120,85,0.14),transparent_55%)]"
											/>
											<div
												aria-hidden="true"
												className="absolute -right-2 -top-10 font-sentient text-[9rem] leading-none text-white/[0.025] sm:text-[13rem]"
											>
												{group.number}
											</div>
											<div className="relative flex flex-col gap-5 px-6 py-12 sm:flex-row sm:items-center sm:gap-7 sm:px-10 sm:py-14">
												<span className="flex h-12 w-12 shrink-0 items-center justify-center border border-primary/25 bg-primary/[0.08] text-primary">
													<CategoryIcon
														aria-hidden="true"
														className="h-5 w-5"
													/>
												</span>
												<div className="max-w-xl">
													<p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
														{t.portfolio.comingSoon}
													</p>
													<p className="mt-3 text-base leading-relaxed text-pretty text-foreground/85 sm:text-lg">
														{t.portfolio.emptyCategory}
													</p>
												</div>
											</div>
										</div>
									</BlurFade>
								) : (
									<div className="grid grid-cols-1 gap-5 pt-6 md:grid-cols-2 lg:grid-cols-3">
										{(isPublic ? publicProjects : privateProjects).map(
											(project, index) => (
												<BlurFade
													key={project.id}
													delay={0.05 * (index + 1)}
													inView
													className="h-full"
												>
													<CompactProjectCard
														project={project}
														showCaseLink={!isPublic}
														whatsapp={
															isPublic
																? {
																		href: whatsappUrl(
																			company.whatsapp,
																			format(t.portfolio.interestMessage, {
																				title: project.title,
																			}),
																		),
																		label: t.portfolio.interestLabel,
																	}
																: undefined
														}
													/>
												</BlurFade>
											),
										)}
									</div>
								)}
							</section>
						)
					})}
				</div>
			</div>
		</section>
	)
}
