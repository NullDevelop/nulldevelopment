import type { MetadataRoute } from 'next'
import { curatedProjects } from '@/lib/projects-data'
import { siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
	const publicPages: MetadataRoute.Sitemap = [
		{ url: new URL('/', siteUrl).toString(), changeFrequency: 'monthly', priority: 1 },
		{ url: new URL('/privacidade', siteUrl).toString(), changeFrequency: 'yearly', priority: 0.2 },
		{ url: new URL('/termos', siteUrl).toString(), changeFrequency: 'yearly', priority: 0.2 },
	]
	const projectPages: MetadataRoute.Sitemap = curatedProjects.map((project) => ({
		url: new URL(`/projects/${project.slug}`, siteUrl).toString(),
		changeFrequency: 'monthly',
		priority: 0.7,
	}))

	return [...publicPages, ...projectPages]
}
