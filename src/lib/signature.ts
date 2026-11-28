import { createHash } from 'node:crypto'

/** Short integrity hash shown on proposals and contracts. */
export function signatureHash(...parts: Array<string | number>) {
	return createHash('sha256')
		.update(parts.join('-'))
		.digest('hex')
		.toUpperCase()
		.slice(0, 16)
}
