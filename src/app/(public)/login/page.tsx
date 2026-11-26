'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NullBrandLogo } from '@/components/null-logo'
import { authClient } from '@/lib/auth-client'

export default function LoginPage() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)

		const { error } = await authClient.signIn.username({
			username,
			password,
			callbackURL: '/dashboard',
		})

		if (error) {
			toast.error(error.message || 'Erro ao fazer login')
		} else {
			toast.success('Login realizado com sucesso!')
			router.push('/dashboard')
		}
		setLoading(false)
	}

	return (
		<div className="relative flex min-h-screen items-center justify-center bg-background px-4 overflow-hidden">
			{/* Glow de fundo */}
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
				<div className="h-125 w-125 rounded-full bg-primary/5 blur-[120px]" />
			</div>

			<div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-8">
				{/* Logo texto */}
				<Link href="/" className="focus:outline-none">
					<NullBrandLogo size="md" />
				</Link>

				{/* Card */}
				<div className="w-full rounded-[2px] border border-white/10 bg-card backdrop-blur-xl p-8 flex flex-col gap-6">
					<div className="text-center space-y-1">
						<h1 className="font-sentient text-2xl font-bold text-foreground">
							Acesso ao Painel
						</h1>
						<p className="font-mono text-xs text-foreground/40">
							Entre com suas credenciais para continuar
						</p>
					</div>

					<form onSubmit={handleLogin} className="flex flex-col gap-4">
						<div className="space-y-1.5">
							<Label htmlFor="username" className="font-mono text-xs text-foreground/50 uppercase tracking-widest">
								Usuário
							</Label>
							<Input
								id="username"
								type="text"
								placeholder="seu_usuario"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
								className="border-white/10 bg-white/5 text-foreground placeholder:text-foreground/20 focus-visible:ring-primary focus-visible:border-primary/50 h-11 rounded-[2px]"
							/>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="password" className="font-mono text-xs text-foreground/50 uppercase tracking-widest">
								Senha
							</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="border-white/10 bg-white/5 text-foreground placeholder:text-foreground/20 focus-visible:ring-primary focus-visible:border-primary/50 h-11 rounded-[2px]"
							/>
						</div>

						<Button
							type="submit"
							className="w-full h-11 mt-2 rounded-[2px] bg-primary font-mono font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
							disabled={loading}
						>
							{loading ? 'Entrando...' : 'Entrar →'}
						</Button>
					</form>

					<p className="text-center font-mono text-xs text-brand-steel">
						Ainda não tem uma conta?{' '}
						<Link href="/register" className="text-primary hover:underline">
							Cadastre-se
						</Link>
					</p>
				</div>

				<p className="font-mono text-xs text-foreground/20">
					© {new Date().getFullYear()} Null Development
				</p>
			</div>
		</div>
	)
}
