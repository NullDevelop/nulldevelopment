import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar'
import { auth } from '@/lib/auth'

export default async function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const [session, cookieStore] = await Promise.all([
		auth.api.getSession({ headers: await headers() }),
		cookies(),
	])
	if (!session) redirect('/login')

	const sidebarDefaultOpen = cookieStore.get('sidebar_state')?.value !== 'false'

	return (
		<SidebarProvider defaultOpen={sidebarDefaultOpen}>
			<AppSidebar />
			<SidebarInset className="min-w-0 min-h-screen">
				<header className="flex items-center h-16 px-4 border-b border-white/[0.06] bg-background/90 backdrop-blur-md sticky top-0 z-50">
					<SidebarTrigger className="hover:bg-white/5" />
					<div className="ml-4 h-4 w-px bg-white/10" />
					<h1 className="ml-4 font-sentient text-lg tracking-tight">
						Painel Administrativo
					</h1>
				</header>
				<div className="min-w-0 p-4 lg:p-8">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
