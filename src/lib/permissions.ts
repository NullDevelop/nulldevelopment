import { requireAuth } from './require-auth'

export type Permission = 'billing:read' | 'billing:write'

const rolePermissions: Record<string, readonly Permission[]> = {
	owner: ['billing:read', 'billing:write'],
	admin: ['billing:read', 'billing:write'],
	member: ['billing:read'],
}

/** Garante sessão ativa e permissão da feature antes de qualquer leitura/escrita. */
export async function requirePermission(permission: Permission) {
	const session = await requireAuth()
	const role = (session.user as { role?: string | null }).role ?? 'owner'

	if (!rolePermissions[role]?.includes(permission)) {
		throw new Error('Forbidden')
	}

	return session
}
