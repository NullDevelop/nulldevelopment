'use client'

import {
	Building2,
	FileSignature,
	FileText,
	Home,
	LayoutDashboard,
	Library,
	LogOut,
	Receipt,
	Send,
	Users,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const menuItems = [
	{ title: 'Dashboard', icon: LayoutDashboard, url: '/dashboard' },
	{ title: 'Empresas', icon: Building2, url: '/dashboard/companies' },
	{ title: 'Projetos', icon: FileText, url: '/dashboard/projects' },
	{ title: 'Clientes', icon: Users, url: '/dashboard/clients' },
	{ title: 'Catálogo', icon: Library, url: '/dashboard/catalog' },
	{ title: 'Orçamentos', icon: Receipt, url: '/dashboard/budgets' },
	{ title: 'Contratos', icon: FileSignature, url: '/dashboard/contracts' },
	{ title: 'Mensagens', icon: Send, url: '/dashboard/messages' },
]

export function AppSidebar() {
	const pathname = usePathname()

	return (
		<Sidebar
			collapsible="icon"
			className="border-r border-white/5 bg-black/40 backdrop-blur-xl"
		>
			<SidebarHeader className="h-16 justify-center border-b border-white/5 px-2">
				<div className="flex min-w-0 items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
					<div className="flex size-10 shrink-0 items-center justify-center overflow-hidden group-data-[collapsible=icon]:size-8">
						<Image
							src="/N3.svg"
							alt="Null Development"
							width={52}
							height={43}
							className="h-auto w-full object-contain"
						/>
					</div>
					<div className="flex min-w-0 flex-col leading-none group-data-[collapsible=icon]:hidden">
						<span className="font-sentient font-bold text-xl text-foreground tracking-tight">
							null<span className="text-primary">.</span>dev
						</span>
						<div className="h-0.5 bg-linear-to-r from-[#8C4B31] via-primary to-[#8C4B31] rounded-full mt-0.5" />
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-foreground/40">
						Menu Principal
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{menuItems.map((item) => {
								const isActive =
									pathname === item.url ||
									(item.url !== '/dashboard' && pathname.startsWith(item.url))
								return (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											isActive={isActive}
											tooltip={item.title}
											className={cn(
												'gap-3 px-3 py-5 font-mono text-sm transition-all duration-200',
												'group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0',
												isActive
													? 'bg-primary/10 text-primary shadow-[inset_2px_0_0_var(--primary)]'
													: 'text-foreground/60 hover:bg-white/5 hover:text-foreground',
											)}
										>
											<Link href={item.url}>
												<item.icon
													className={cn(
														'size-5 shrink-0 transition-colors',
														isActive
															? 'text-primary'
															: 'text-foreground/60 group-hover:text-primary',
													)}
												/>
												<span className="min-w-0 truncate group-data-[collapsible=icon]:hidden">
													{item.title}
												</span>
												{isActive ? (
													<span className="ml-auto size-1.5 shrink-0 rounded-full bg-primary animate-pulse group-data-[collapsible=icon]:hidden" />
												) : null}
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								)
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="border-t border-white/5">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							tooltip="Ver Site"
							className="gap-3 px-3 py-5 font-mono text-sm text-foreground/60 hover:bg-white/5 hover:text-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
						>
							<Link href="/">
								<Home className="size-5 shrink-0" />
								<span className="min-w-0 truncate group-data-[collapsible=icon]:hidden">
									Ver Site
								</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<form action="/api/auth/signout" method="POST">
							<SidebarMenuButton
								type="submit"
								tooltip="Sair"
								className="gap-3 px-3 py-5 font-mono text-sm text-red-500/70 hover:bg-red-500/10 hover:text-red-500 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
							>
								<LogOut className="size-5 shrink-0" />
								<span className="min-w-0 truncate group-data-[collapsible=icon]:hidden">
									Sair
								</span>
							</SidebarMenuButton>
						</form>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
