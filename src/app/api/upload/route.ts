import fs from 'node:fs/promises'
import path from 'node:path'
import { put } from '@vercel/blob'
import { headers } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const ALLOWED_FOLDERS = new Set(['projects', 'companies', 'avatars', 'general'])
const ALLOWED_MIME_TYPES = new Set([
	'image/png',
	'image/jpeg',
	'image/webp',
	'image/gif',
	'image/avif',
])
const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
	// Proteção por autenticação
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session) {
		return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
	}

	try {
		const formData = await request.formData()
		const file = formData.get('file')
		const rawFolder = (formData.get('folder') as string) || 'general'

		if (!file || typeof file === 'string') {
			return NextResponse.json(
				{ error: 'Nenhum arquivo enviado' },
				{ status: 400 },
			)
		}

		if (!ALLOWED_FOLDERS.has(rawFolder)) {
			return NextResponse.json({ error: 'Pasta inválida' }, { status: 400 })
		}

		if (!ALLOWED_MIME_TYPES.has(file.type)) {
			return NextResponse.json(
				{ error: 'Use uma imagem PNG, JPG, WEBP, GIF ou AVIF' },
				{ status: 400 },
			)
		}

		if (file.size > MAX_FILE_SIZE) {
			return NextResponse.json(
				{ error: 'A imagem deve ter no máximo 10 MB' },
				{ status: 400 },
			)
		}

		const timestamp = Date.now()
		const safeFileName = file.name
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-zA-Z0-9.]/g, '_')
			.replace(/_+/g, '_')
		const fileName = `${timestamp}-${safeFileName}`
		const buffer = Buffer.from(await file.arrayBuffer())

		const usesBlob =
			!!process.env.BLOB_READ_WRITE_TOKEN ||
			!!(process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID)

		// Na Vercel o sistema de arquivos é somente leitura: usa o Blob store.
		if (usesBlob) {
			const blob = await put(`${rawFolder}/${fileName}`, buffer, {
				access: 'public',
				contentType: file.type,
			})

			return NextResponse.json({ url: blob.url, name: fileName })
		}

		if (process.env.VERCEL) {
			return NextResponse.json(
				{
					error:
						'Upload não configurado: crie um Blob store na Vercel e configure BLOB_READ_WRITE_TOKEN.',
				},
				{ status: 500 },
			)
		}

		// Desenvolvimento local: grava em public/uploads.
		const baseDir = path.join(process.cwd(), 'public', 'uploads')
		const targetDir = path.join(baseDir, rawFolder)

		// Garante que o caminho resolvido não escape de public/uploads
		if (!targetDir.startsWith(baseDir)) {
			return NextResponse.json({ error: 'Pasta inválida' }, { status: 400 })
		}

		await fs.mkdir(targetDir, { recursive: true })
		await fs.writeFile(path.join(targetDir, fileName), buffer)

		return NextResponse.json({
			url: `/uploads/${rawFolder}/${fileName}`,
			name: fileName,
		})
	} catch (error) {
		console.error('Erro no upload:', error)
		return NextResponse.json(
			{ error: 'Falha ao processar upload' },
			{ status: 500 },
		)
	}
}
