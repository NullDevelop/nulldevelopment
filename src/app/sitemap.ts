import type { MetadataRoute } from 'next'
import { getAllProjectSlugs } from '@/lib/get-projetos'
import { siteUrl } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const publicPages: MetadataRoute.Sitemap = [
		{ url: new URL('/', siteUrl).toString(), changeFrequency: 'monthly', priority: 1 },
		{ url: new URL('/privacidade', siteUrl).toString(), changeFrequency: 'yearly', priority: 0.2 },
		{ url: new URL('/termos', siteUrl).toString(), changeFrequency: 'yearly', priority: 0.2 },
	]
	const slugs = await getAllProjectSlugs()
	const projectPages: MetadataRoute.Sitemap = slugs.map((slug) => ({
		url: new URL(`/projects/${slug}`, siteUrl).toString(),
		changeFrequency: 'monthly',
		priority: 0.7,
	}))

	return [...publicPages, ...projectPages]
}
