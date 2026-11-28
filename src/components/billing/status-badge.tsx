import { contractStatusLabels, quoteStatusLabels } from '@/lib/billing-format'

const statusStyles: Record<string, string> = {
	rascunho: 'border-white/10 bg-white/5 text-foreground/50',
	enviada: 'border-blue-500/25 bg-blue-500/10 text-blue-400',
	enviado: 'border-blue-500/25 bg-blue-500/10 text-blue-400',
	aprovada: 'border-green-500/25 bg-green-500/10 text-green-400',
	assinada: 'border-green-500/25 bg-green-500/10 text-green-400',
	assinado: 'border-green-500/25 bg-green-500/10 text-green-400',
	recusada: 'border-red-500/25 bg-red-500/10 text-red-400',
	cancelada: 'border-red-500/25 bg-red-500/10 text-red-400',
	cancelado: 'border-red-500/25 bg-red-500/10 text-red-400',
}

export function StatusBadge({ status }: { status: string }) {
	const label =
		quoteStatusLabels[status] ?? contractStatusLabels[status] ?? status
	const style =
		statusStyles[status] ?? 'border-white/10 bg-white/5 text-foreground/50'

	return (
		<span
			className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${style}`}
		>
			{label}
		</span>
	)
}
