'use client'

import { Loader2, Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface DeleteBillingButtonProps {
	onDelete: () => Promise<unknown>
	entity?: string
	label?: string
	successMessage?: string
	errorMessage?: string
}

export function DeleteBillingButton({
	onDelete,
	entity = 'registro',
	label,
	successMessage = 'Registro excluído com sucesso!',
	errorMessage = `Não foi possível excluir o ${entity}.`,
}: DeleteBillingButtonProps) {
	const [open, setOpen] = useState(false)
	const [isPending, startTransition] = useTransition()

	function handleDelete() {
		startTransition(async () => {
			try {
				await onDelete()
				toast.success(successMessage)
				setOpen(false)
			} catch (error) {
				console.error(error)
				toast.error(errorMessage)
			}
		})
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					size={label ? 'default' : 'icon'}
					className="text-destructive hover:bg-destructive/10 hover:text-destructive"
				>
					<Trash2 className="size-4" />
					{label}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
					<AlertDialogDescription>
						Esta ação não pode ser desfeita. O {entity} será excluído
						permanentemente.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						onClick={(event) => {
							event.preventDefault()
							handleDelete()
						}}
						disabled={isPending}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						{isPending && <Loader2 className="size-4 animate-spin" />}
						Excluir
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
