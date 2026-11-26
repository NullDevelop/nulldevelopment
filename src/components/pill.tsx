import { cn } from '@/lib/utils'

export const Pill = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<div
			className={cn(
				'inline-flex h-8 items-center justify-center border border-primary/20 bg-primary/5 px-3 text-[10px] font-medium uppercase tracking-[0.2em] text-primary/80',
				className,
			)}
		>
			{children}
		</div>
	)
}
