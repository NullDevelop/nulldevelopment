import type { ProjectData } from '@/lib/projects-data'
import type { Locale } from './config'
import type { Dictionary } from './dictionaries/types'

/**
 * Keeps the content registered in the dashboard as the single source of truth.
 * Only the status badge is translated, when present.
 */
export function localizeProject(
	project: ProjectData,
	_locale: Locale,
	t: Dictionary,
): ProjectData {
	const badge = project.statusBadge
		? (t.badges[project.statusBadge] ?? project.statusBadge)
		: undefined

	return { ...project, statusBadge: badge }
}
