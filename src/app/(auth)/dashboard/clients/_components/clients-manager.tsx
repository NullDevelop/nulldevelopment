'use client'

import { Pencil, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { DeleteBillingButton } from '@/components/billing/delete-billing-button'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDate } from '@/lib/billing-format'
import {
	type ClientInput,
	createClient,
	deleteClient,
	updateClient,
} from '../_actions'
import type { ClientRow } from '../_data-access/get-clients'

interface ClientFormValues {
	name: string
	email: string
	document: string
	phone: string
	address: string
}

const emptyForm: ClientFormValues = {
	name: '',
	email: '',
	document: '',
	phone: '',
	address: '',
}

export function ClientsManager({ clients }: { clients: ClientRow[] }) {
	const router = useRouter()
	const [open, setOpen] = useState(false)
	const [editing, setEditing] = useState<ClientRow | null>(null)
	const [values, setValues] = useState<ClientFormValues>(emptyForm)
	const [isPending, startTransition] = useTransition()

	function openCreate() {
		setEditing(null)
		setValues(emptyForm)
		setOpen(true)
	}

	function openEdit(client: ClientRow) {
		setEditing(client)
		setValues({
			name: client.name,
			email: client.email ?? '',
			document: client.document ?? '',
			phone: client.phone ?? '',
			address: client.address ?? '',
		})
		setOpen(true)
	}

	function setField(key: keyof ClientFormValues, value: string) {
		setValues((current) => ({ ...current, [key]: value }))
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (!values.name.trim()) {
			toast.error('Informe o nome do cliente.')
			return
		}

		const input: ClientInput = {
			name: values.name,
			email: values.email || undefined,
			document: values.document || undefined,
			phone: values.phone || undefined,
			address: values.address || undefined,
		}

		startTransition(async () => {
			try {
				if (editing) {
					await updateClient(editing.id, input)
					toast.success('Cliente atualizado com sucesso!')
				} else {
					await createClient(input)
					toast.success('Cliente criado com sucesso!')
				}
				setOpen(false)
				router.refresh()
			} catch (error) {
				console.error(error)
				toast.error('Não foi possível salvar o cliente.')
			}
		})
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between gap-4">
				<div>
					<h1 className="font-sentient text-3xl font-bold text-foreground">
						Clientes
					</h1>
					<p className="font-mono text-sm text-foreground/40 mt-1">
						{clients.length} cliente{clients.length !== 1 ? 's' : ''} cadastrado
						{clients.length !== 1 ? 's' : ''}
					</p>
				</div>
				<Button onClick={openCreate}>
					<Plus className="size-4" />
					Novo cliente
				</Button>
			</div>

			<div className="rounded-[2px] border border-white/10 bg-card overflow-hidden">
				{clients.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 gap-3">
						<p className="font-mono text-sm text-foreground/30">
							Nenhum cliente cadastrado.
						</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full min-w-[760px]">
							<thead>
								<tr className="border-b border-white/5">
									<th className="font-mono text-xs text-foreground/40 uppercase tracking-widest text-left px-6 py-4">
										Nome
									</th>
									<th className="font-mono text-xs text-foreground/40 uppercase tracking-widest text-left px-6 py-4">
										E-mail
									</th>
									<th className="font-mono text-xs text-foreground/40 uppercase tracking-widest text-left px-6 py-4">
										Documento
									</th>
									<th className="font-mono text-xs text-foreground/40 uppercase tracking-widest text-left px-6 py-4">
										Telefone
									</th>
									<th className="font-mono text-xs text-foreground/40 uppercase tracking-widest text-left px-6 py-4">
										Cadastro
									</th>
									<th className="font-mono text-xs text-foreground/40 uppercase tracking-widest text-right px-6 py-4">
										Ações
									</th>
								</tr>
							</thead>
							<tbody>
								{clients.map((client) => (
									<tr
										key={client.id}
										className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors"
									>
										<td className="px-6 py-4">
											<span className="font-medium text-foreground">
												{client.name}
											</span>
											{client.address && (
												<span className="block font-mono text-[10px] text-foreground/30 mt-0.5">
													{client.address}
												</span>
											)}
										</td>
										<td className="px-6 py-4 font-mono text-xs text-foreground/60">
											{client.email ?? '—'}
										</td>
										<td className="px-6 py-4 font-mono text-xs text-foreground/60">
											{client.document ?? '—'}
										</td>
										<td className="px-6 py-4 font-mono text-xs text-foreground/60">
											{client.phone ?? '—'}
										</td>
										<td className="px-6 py-4 font-mono text-xs text-foreground/60">
											{formatDate(client.createdAt)}
										</td>
										<td className="px-6 py-4">
											<div className="flex justify-end gap-1">
												<Button
													type="button"
													variant="ghost"
													size="icon"
													aria-label={`Editar ${client.name}`}
													onClick={() => openEdit(client)}
												>
													<Pencil className="size-4" />
												</Button>
												<DeleteBillingButton
													entity="cliente"
													successMessage="Cliente excluído com sucesso!"
													onDelete={async () => {
														await deleteClient(client.id)
														router.refresh()
													}}
												/>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>
							{editing ? 'Editar cliente' : 'Novo cliente'}
						</DialogTitle>
						<DialogDescription>
							{editing
								? 'Atualize os dados do cliente.'
								: 'Cadastre um cliente para vincular propostas e contratos.'}
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="client-name">Nome *</Label>
							<Input
								id="client-name"
								value={values.name}
								onChange={(event) => setField('name', event.target.value)}
								placeholder="Nome do cliente"
							/>
						</div>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="flex flex-col gap-2">
								<Label htmlFor="client-email">E-mail</Label>
								<Input
									id="client-email"
									type="email"
									value={values.email}
									onChange={(event) => setField('email', event.target.value)}
									placeholder="contato@empresa.com"
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="client-document">Documento</Label>
								<Input
									id="client-document"
									value={values.document}
									onChange={(event) => setField('document', event.target.value)}
									placeholder="CPF/CNPJ"
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="client-phone">Telefone</Label>
								<Input
									id="client-phone"
									value={values.phone}
									onChange={(event) => setField('phone', event.target.value)}
									placeholder="(00) 00000-0000"
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="client-address">Endereço</Label>
								<Input
									id="client-address"
									value={values.address}
									onChange={(event) => setField('address', event.target.value)}
									placeholder="Cidade/UF"
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
							>
								Cancelar
							</Button>
							<Button type="submit" disabled={isPending}>
								{editing ? 'Salvar alterações' : 'Criar cliente'}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	)
}
