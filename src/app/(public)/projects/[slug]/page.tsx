import {
	ArrowLeft,
	ArrowUpRight,
	ExternalLink,
	MessageCircle,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { HomeClient } from '@/components/home-client'
import { BlurFade } from '@/components/ui/blur-fade'
import { GalleryLightbox } from '@/components/ui/gallery-lightbox'
import { whatsappUrl } from '@/i18n/format'
import { localizeProject } from '@/i18n/projects'
import { getDictionary, getLocale } from '@/i18n/server'
import { company } from '@/lib/company'
import { getAllProjectSlugs, getProjectBySlug } from '@/lib/get-projetos'
import { siteUrl } from '@/lib/site'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const project = await getProjectBySlug(slug)

	if (!project) {
		return { title: 'Projeto não encontrado', robots: { index: false, follow: false } }
	}

	const title = `${project.title} | Desenvolvimento de software em Campina Grande do Sul`
	const image = new URL(project.image, siteUrl).toString()

	return {
		title,
		description: project.shortDescription,
		alternates: { canonical: `/projects/${project.slug}` },
		openGraph: {
			title,
			description: project.shortDescription,
			url: `/projects/${project.slug}`,
			siteName: 'Null Development',
			type: 'article',
			images: [{ url: image, alt: project.title }],
		},
	}
}

export async function generateStaticParams() {
	const slugs = await getAllProjectSlugs()
	return slugs.map((slug) => ({ slug }))
}

export default async function ProjectPage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const found = await getProjectBySlug(slug)

	if (!found) {
		notFound()
	}

	const locale = await getLocale()
	const t = await getDictionary()
	const p = t.projectPage
	const project = localizeProject(found, locale, t)

	const isLive = !!project.link
	const badge = project.statusBadge || (isLive ? p.liveBadge : p.caseStudy)
	const sectorLabel =
		project.category === 'governamental' ? t.portfolio.public : t.portfolio.private
	const solutionTypeLabels = {
		saas: p.saas,
		governamental: p.public,
		landing: p.landing,
		privado: p.private,
	}

	const whatsappHref = whatsappUrl(
		company.whatsapp,
		t.whatsapp.similar.replace('{title}', project.title),
	)

	return (
		<HomeClient>
			<main className="min-h-screen w-full relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
				{/* Top Navigation & Breadcrumbs */}
				<BlurFade delay={0.05}>
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
						<Link
							href="/#portfolio"
							className="inline-flex items-center gap-2 font-mono text-xs uppercase text-brand-steel hover:text-foreground transition-colors group"
						>
							<ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
							<span>{p.backToPortfolio}</span>
						</Link>

						<div className="flex items-center gap-2 text-xs font-mono text-brand-graphite">
							<span>{p.cases}</span>
							<span>/</span>
							<span className="text-brand-steel font-medium">{project.title}</span>
						</div>
					</div>
				</BlurFade>

				{/* Title & Quick Actions Header */}
				<BlurFade delay={0.1}>
					<div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-3xl">
							<div className="mb-4 flex flex-wrap items-center gap-2">
								<span className="inline-flex items-center border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
									{sectorLabel}
								</span>
								<span className="inline-flex items-center gap-2 border border-white/10 bg-card px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-brand-steel">
									<span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
									{badge}
								</span>
							</div>

							<h1 className="text-3xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
								{project.title}
							</h1>
							<p className="text-base sm:text-lg text-brand-steel mt-4 leading-relaxed max-w-2xl">
								{project.shortDescription}
							</p>
						</div>

						{/* Action Buttons */}
						<div className="flex shrink-0 flex-wrap items-center gap-3">
							{project.link && (
								<a
									href={project.link}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 text-xs sm:text-sm uppercase px-6 py-3.5 rounded-[2px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-colors"
								>
									<span>{p.viewLive}</span>
									<ExternalLink className="w-4 h-4" />
								</a>
							)}

							<a
								href={whatsappHref}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 text-xs sm:text-sm uppercase px-5 py-3.5 rounded-[2px] border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold transition-colors"
							>
								<MessageCircle className="w-4 h-4" />
								<span className="hidden sm:inline">{p.similar}</span>
							</a>
						</div>
					</div>
				</BlurFade>

				{/* Big Hero Banner Image */}
				<BlurFade delay={0.15}>
					<div className="group relative mb-10 aspect-video w-full overflow-hidden rounded-[2px] border border-white/15 bg-background shadow-2xl shadow-black/30">
						<Image
							src={project.image}
							alt={project.title}
							fill
							priority
							sizes="(max-width: 1200px) 100vw, 1200px"
							className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
						/>
						<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-40" />
					</div>
				</BlurFade>

				{/* Meta Strip Bar */}
				<BlurFade delay={0.2}>
					<div className="mb-10 grid grid-cols-2 gap-3 border border-white/10 bg-card p-4 backdrop-blur-xs sm:grid-cols-4 sm:gap-0 sm:p-5">
						<div className="border-l-2 border-primary/40 pl-4">
							<span className="text-brand-steel uppercase text-xs tracking-wider block mb-1 font-medium">
								{p.myRole}
							</span>
							<span className="text-foreground font-semibold text-sm sm:text-base">{p.myRoleValue}</span>
						</div>

						<div className="border-l-2 border-primary/40 pl-4">
							<span className="text-brand-steel uppercase text-xs tracking-wider block mb-1 font-medium">
								{p.solutionType}
							</span>
							<span className="text-foreground font-semibold text-sm sm:text-base">
								{solutionTypeLabels[project.category]}
							</span>
						</div>

						<div className="border-l-2 border-primary/40 pl-4">
							<span className="text-brand-steel uppercase text-xs tracking-wider block mb-1 font-medium">
								{p.status}
							</span>
							<span className="text-emerald-400 font-semibold text-sm sm:text-base flex items-center gap-2">
								<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
								{badge}
							</span>
						</div>

						<div className="border-l-2 border-primary/40 pl-4">
							<span className="text-brand-steel uppercase text-xs tracking-wider block mb-1 font-medium">
								{p.access}
							</span>
							<span className="text-foreground/90 font-semibold text-sm sm:text-base">
								{project.link ? (
									<a
										href={project.link}
										target="_blank"
										rel="noopener noreferrer"
										className="text-primary hover:underline flex items-center gap-1.5"
									>
										<span>{p.online}</span>
										<ArrowUpRight className="w-3.5 h-3.5" />
									</a>
								) : (
									p.private
								)}
							</span>
						</div>
					</div>
				</BlurFade>

				{/* Content Grid: Case Study Markdown + Gallery */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
					{/* Left / Main Column: Markdown Content */}
					<div className={project.images.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'}>
						<BlurFade delay={0.25}>
							<div className="rounded-[2px] border border-white/10 bg-card backdrop-blur-xs p-6 sm:p-9 space-y-6">
								{/* Tech Stack Chips inside Content */}
								{project.stack.length > 0 && (
									<div>
										<h3 className="text-xs uppercase tracking-widest text-primary mb-3 font-semibold">
											{p.stack}
										</h3>
										<div className="flex flex-wrap gap-2">
											{project.stack.map((tech) => (
												<span
													key={tech}
													className="text-xs sm:text-sm px-3.5 py-1.5 rounded-lg border border-white/15 bg-white/5 text-foreground/90 font-medium"
												>
													{tech}
												</span>
											))}
										</div>
									</div>
								)}

								<div className="h-px bg-white/10" />

								{/* Formatted Markdown Body */}
								<div className="prose prose-invert max-w-none">
									<ReactMarkdown
										components={{
											h2: ({ children }) => (
												<h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-10 mb-4 first:mt-0">
													{children}
												</h2>
											),
											h3: ({ children }) => (
												<h3 className="text-xl sm:text-2xl font-bold text-primary mt-8 mb-3">
													{children}
												</h3>
											),
											p: ({ children }) => (
												<p className="text-base sm:text-lg text-foreground/90 leading-relaxed mb-5">
													{children}
												</p>
											),
											strong: ({ children }) => (
												<strong className="text-foreground font-bold">{children}</strong>
											),
											ul: ({ children }) => (
												<ul className="text-base sm:text-lg text-foreground/90 leading-relaxed mb-5 space-y-3 pl-4">
													{children}
												</ul>
											),
											li: ({ children }) => (
												<li className="before:content-['•'] before:mr-2.5 before:text-primary before:font-bold flex items-start">
													<span>{children}</span>
												</li>
											),
											code: ({ children }) => (
												<code className="bg-white/10 text-primary px-2 py-0.5 rounded text-sm font-mono font-medium">
													{children}
												</code>
											),
										}}
									>
										{project.content}
									</ReactMarkdown>
								</div>
							</div>
						</BlurFade>
					</div>

					{/* Right Column: Visual Gallery Lightbox (if any) */}
					{project.images.length > 0 && (
						<div className="lg:col-span-4 space-y-6">
							<BlurFade delay={0.3}>
								<div className="rounded-[2px] border border-white/10 bg-card backdrop-blur-xs p-6">
									<h3 className="font-sentient text-base font-semibold text-foreground mb-2">
										{p.screens}
									</h3>
									<p className="font-mono text-xs text-brand-steel mb-4">
										{p.screensHint}
									</p>
									<GalleryLightbox images={project.images} title={project.title} />
								</div>
							</BlurFade>

							{/* Direct Hire Box on Sidebar */}
							<BlurFade delay={0.35}>
								<div className="rounded-[2px] border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
									<h4 className="font-sentient text-base font-semibold text-emerald-200 mb-1.5">
										{p.needSimilar}
									</h4>
									<p className="font-mono text-xs text-emerald-300/80 mb-4">
										{p.needSimilarText}
									</p>
									<a
										href={whatsappHref}
										target="_blank"
										rel="noopener noreferrer"
										className="w-full inline-flex items-center justify-center gap-2 font-mono text-xs uppercase px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition-colors"
									>
										<MessageCircle className="w-4 h-4" />
										<span>{p.whatsapp}</span>
									</a>
								</div>
							</BlurFade>
						</div>
					)}
				</div>

				{/* Bottom Bar: Back & Next Project Navigation */}
				<div className="mt-14 pt-8 border-t border-white/10 flex items-center justify-between font-mono text-xs text-brand-steel">
					<Link
						href="/#portfolio"
						className="hover:text-foreground transition-colors flex items-center gap-1.5"
					>
						<ArrowLeft className="w-4 h-4" />
						<span>{p.backToPortfolio}</span>
					</Link>

					<a
						href={whatsappHref}
						target="_blank"
						rel="noopener noreferrer"
						className="text-primary hover:text-primary/90 transition-colors flex items-center gap-1.5 font-medium"
					>
						<span>{p.requestQuote}</span>
						<ArrowUpRight className="w-4 h-4" />
					</a>
				</div>
			</main>
		</HomeClient>
	)
}
