import { prisma } from '../src/lib/prisma'

type CatalogSeedItem = {
	name: string
	description: string
	baseHours: number
	complexity: 'baixa' | 'media' | 'alta'
	monthlyFee?: number
}

type CatalogSeedCategory = {
	name: string
	items: CatalogSeedItem[]
}

const catalog: CatalogSeedCategory[] = [
	{
		name: 'Sites e Landing Pages',
		items: [
			{
				name: 'Site Institucional Básico',
				description:
					'Site responsivo de até 5 seções (início, sobre, serviços, galeria, contato), desenvolvido com Next.js, TypeScript e Tailwind CSS. Inclui layout alinhado à identidade visual do cliente, botão de WhatsApp, formulário de contato, SEO básico (títulos, meta tags, sitemap), otimização de desempenho e publicação no domínio do cliente.',
				baseHours: 20,
				complexity: 'media',
			},
			{
				name: 'Site Institucional com Reservas',
				description:
					'Tudo do site institucional básico, mais um sistema de reservas ou agendamentos online com calendário de disponibilidade, confirmação por e-mail ou WhatsApp e painel administrativo simples para gerenciar as reservas. Indicado para pousadas, chácaras e espaços de eventos.',
				baseHours: 40,
				complexity: 'media',
			},
			{
				name: 'Site Institucional com Reservas e Pagamento Online',
				description:
					'Tudo do pacote com reservas, mais integração com gateway de pagamento (Pix e cartão), com confirmação automática do pagamento e registro das transações no painel.',
				baseHours: 56,
				complexity: 'alta',
			},
			{
				name: 'Landing Page de Conversão',
				description:
					'Página única focada em captação de clientes, com chamada principal, benefícios, prova social, formulário ou botão de WhatsApp e integração com ferramentas de métricas (Google Analytics e Meta Pixel, se desejado).',
				baseHours: 14,
				complexity: 'media',
			},
			{
				name: 'Redesign de Site Existente',
				description:
					'Reformulação visual e técnica de um site já publicado, com layout moderno, melhoria de velocidade, responsividade e SEO, mantendo o conteúdo e o domínio atuais.',
				baseHours: 18,
				complexity: 'media',
			},
		],
	},
	{
		name: 'Sistemas Web Sob Medida',
		items: [
			{
				name: 'Sistema Web de Gestão Sob Medida',
				description:
					'Desenvolvimento de sistema web completo conforme a necessidade do cliente, com levantamento de requisitos, modelagem de banco de dados (Prisma com MySQL/MariaDB), autenticação e controle de acesso por perfis (Better Auth), telas de cadastro, listagem e relatórios, e implantação em servidor.',
				baseHours: 120,
				complexity: 'alta',
			},
			{
				name: 'Painel Administrativo / Dashboard',
				description:
					'Painel com indicadores, gráficos e tabelas filtráveis, controle de usuários e permissões, e exportação de dados em PDF ou planilha.',
				baseHours: 60,
				complexity: 'media',
			},
			{
				name: 'Módulo Adicional de Sistema',
				description:
					'Desenvolvimento de um módulo ou funcionalidade nova em um sistema já existente (por exemplo: relatórios, controle de estoque, agendamento, emissão de documentos), incluindo testes e implantação.',
				baseHours: 30,
				complexity: 'media',
			},
			{
				name: 'Sistema para Órgãos Públicos',
				description:
					'Sistema web sob medida para prefeituras e secretarias (por exemplo: agendamento de auditório, controle de contratos, gestão de processos), observando as exigências da Lei 14.133/2021, com perfis de acesso, trilha de auditoria e relatórios.',
				baseHours: 160,
				complexity: 'alta',
			},
		],
	},
	{
		name: 'Sistemas Prontos (Licenciamento)',
		items: [
			{
				name: 'AutoSystem – Gestão para Oficinas e Auto Shops',
				description:
					'Sistema pronto para oficinas, com cadastro de clientes e veículos, ordens de serviço, orçamentos, controle financeiro básico e histórico de manutenções. Inclui implantação, configuração inicial e treinamento.',
				baseHours: 24,
				complexity: 'media',
			},
			{
				name: 'Saideira PDV – Ponto de Venda',
				description:
					'Sistema de PDV para pequenos comércios, com registro de vendas, controle de produtos e estoque, formas de pagamento, fechamento de caixa e relatórios. Inclui implantação, configuração inicial e treinamento.',
				baseHours: 20,
				complexity: 'media',
			},
			{
				name: 'Implantação e Treinamento de Sistema',
				description:
					'Instalação, configuração, carga inicial de dados e treinamento da equipe do cliente para uso de um sistema pronto.',
				baseHours: 8,
				complexity: 'baixa',
			},
		],
	},
	{
		name: 'Automação e Bots',
		items: [
			{
				name: 'Bot de Mensagens Automatizado',
				description:
					'Sistema de envio e resposta automática de mensagens (por exemplo: lembretes, confirmações, avisos e atendimento inicial), com fluxos configuráveis, listas de contatos e registro de envios.',
				baseHours: 32,
				complexity: 'media',
			},
			{
				name: 'Automação de Rotinas e Processos',
				description:
					'Automação de tarefas repetitivas, como importação e exportação de planilhas, geração de relatórios e notificações automáticas, feita sob medida para o processo do cliente.',
				baseHours: 24,
				complexity: 'media',
			},
			{
				name: 'Bot de Monitoramento de Oportunidades',
				description:
					'Robô que consulta fontes públicas (como portais de licitação) em intervalos programados, filtra por palavras-chave e região e envia alertas ao cliente.',
				baseHours: 40,
				complexity: 'alta',
			},
		],
	},
	{
		name: 'Infraestrutura e Deploy',
		items: [
			{
				name: 'Implantação em VPS Linux',
				description:
					'Configuração de servidor Linux com Nginx, PM2, certificado SSL, firewall e deploy da aplicação, com documentação do ambiente.',
				baseHours: 8,
				complexity: 'media',
			},
			{
				name: 'Implantação em Windows Server (IIS)',
				description:
					'Configuração de aplicação Node.js no IIS (iisnode), certificado SSL e rotina de deploy automatizado.',
				baseHours: 10,
				complexity: 'media',
			},
			{
				name: 'Pipeline de CI/CD',
				description:
					'Configuração de integração e entrega contínua com GitHub Actions (runners na nuvem ou self-hosted), com build, testes e deploy automáticos.',
				baseHours: 12,
				complexity: 'media',
			},
			{
				name: 'Migração de Servidor ou Hospedagem',
				description:
					'Migração de site ou sistema para novo servidor ou provedor, com cópia de arquivos e banco de dados, ajuste de DNS e janela de migração planejada para reduzir indisponibilidade.',
				baseHours: 10,
				complexity: 'media',
			},
		],
	},
	{
		name: 'E-mail, Domínio e Hospedagem',
		items: [
			{
				name: 'Configuração de E-mail Profissional',
				description:
					'Criação e configuração de e-mails no domínio do cliente (por exemplo: contato@empresa.com.br), com registros MX, SPF, DKIM e DMARC e configuração em celular e computador.',
				baseHours: 3,
				complexity: 'baixa',
			},
			{
				name: 'Registro e Configuração de Domínio e DNS',
				description:
					'Apoio no registro de domínio e na configuração de DNS (apontamentos, subdomínios, redirecionamentos e certificado SSL).',
				baseHours: 2,
				complexity: 'baixa',
			},
		],
	},
	{
		name: 'Manutenção e Suporte',
		items: [
			{
				name: 'Plano Mensal de Manutenção de Site',
				description:
					'Atualizações de conteúdo, correções, backups periódicos, monitoramento de disponibilidade e suporte por WhatsApp ou e-mail, dentro de um limite mensal de horas.',
				baseHours: 4,
				complexity: 'media',
				monthlyFee: 350,
			},
			{
				name: 'Plano Mensal de Suporte a Sistema',
				description:
					'Correção de erros, pequenos ajustes, acompanhamento de desempenho, backups e suporte técnico prioritário.',
				baseHours: 8,
				complexity: 'media',
				monthlyFee: 800,
			},
			{
				name: 'Hora Técnica de Desenvolvimento',
				description:
					'Hora avulsa de desenvolvimento, correção ou suporte, para demandas pontuais fora dos planos mensais.',
				baseHours: 1,
				complexity: 'baixa',
			},
		],
	},
	{
		name: 'Consultoria e Documentação Técnica',
		items: [
			{
				name: 'Levantamento de Requisitos e Proposta Técnica',
				description:
					'Reuniões de entendimento, definição de escopo, fluxos e telas, e entrega de documento com cronograma e estimativa.',
				baseHours: 8,
				complexity: 'media',
			},
			{
				name: 'Documentação Técnica para Contratação Pública',
				description:
					'Elaboração de apoio técnico para contratações públicas (Estudo Técnico Preliminar, Termo de Referência e especificações técnicas de sistemas), conforme a Lei 14.133/2021.',
				baseHours: 20,
				complexity: 'alta',
			},
			{
				name: 'Consultoria Técnica / Revisão de Código e Arquitetura',
				description:
					'Análise de sistema ou projeto existente, com relatório de problemas, riscos de segurança e desempenho, e recomendações de melhoria.',
				baseHours: 12,
				complexity: 'media',
			},
			{
				name: 'Auditoria de Segurança Básica',
				description:
					'Revisão de autenticação, permissões, validação de dados, dependências e configuração do servidor, com relatório de achados e correções sugeridas.',
				baseHours: 10,
				complexity: 'alta',
			},
		],
	},
	{
		name: 'Integrações e APIs',
		items: [
			{
				name: 'Integração com Gateway de Pagamento',
				description:
					'Integração de pagamentos por Pix e cartão, com webhooks de confirmação, conciliação e tratamento de falhas.',
				baseHours: 24,
				complexity: 'media',
			},
			{
				name: 'Integração com WhatsApp',
				description:
					'Envio de notificações e mensagens automáticas por WhatsApp, com templates e registro de envios.',
				baseHours: 16,
				complexity: 'media',
			},
			{
				name: 'Desenvolvimento de API REST com Documentação',
				description:
					'Criação de API com autenticação, validação de dados e documentação interativa (Swagger ou Scalar), pronta para uso por aplicativos e sistemas de terceiros.',
				baseHours: 40,
				complexity: 'alta',
			},
			{
				name: 'Integração com Sistemas de Terceiros',
				description:
					'Integração entre o sistema do cliente e serviços externos (ERP, CRM, planilhas, e-mail marketing, entre outros), com sincronização de dados e tratamento de erros.',
				baseHours: 24,
				complexity: 'media',
			},
		],
	},
]

async function main() {
	let itemCount = 0

	for (const [index, category] of catalog.entries()) {
		const savedCategory = await prisma.catalogCategory.upsert({
			where: { name: category.name },
			update: { order: index },
			create: { name: category.name, order: index },
		})

		for (const item of category.items) {
			const data = {
				name: item.name,
				description: item.description,
				baseHours: item.baseHours,
				complexity: item.complexity,
				monthlyFee: item.monthlyFee ?? 0,
				monthlyDuration: 12,
				categoryId: savedCategory.id,
			}

			const existing = await prisma.catalogItem.findFirst({
				where: {
					categoryId: savedCategory.id,
					name: item.name,
				},
			})

			if (existing) {
				await prisma.catalogItem.update({
					where: { id: existing.id },
					data,
				})
			} else {
				await prisma.catalogItem.create({ data })
			}

			itemCount += 1
		}
	}

	console.log(
		`Catálogo sincronizado: ${catalog.length} categorias, ${itemCount} itens.`,
	)
}

main()
	.catch((error) => {
		console.error(error)
		process.exitCode = 1
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
