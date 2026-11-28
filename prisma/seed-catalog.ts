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
					'Entrega de site institucional responsivo com até cinco seções (início, sobre, serviços, galeria e contato), desenvolvido em Next.js, TypeScript e Tailwind CSS. O trabalho inclui levantamento das informações e da identidade visual do cliente, construção das telas, formulário de contato com validação, botão de WhatsApp, configuração de títulos, meta tags e sitemap, ajustes de desempenho e publicação no domínio indicado. O cliente fornece textos, imagens e acesso ao domínio; revisões são realizadas em até duas rodadas.',
				baseHours: 20,
				complexity: 'media',
			},
			{
				name: 'Site Institucional com Reservas',
				description:
					'Entrega de site institucional responsivo com as seções do pacote básico acrescidas de um módulo de reservas ou agendamentos online. O sistema permite consultar disponibilidade em calendário, registrar solicitações, confirmar por e-mail ou WhatsApp e consultar a agenda por um painel administrativo simplificado. Inclui parametrização de horários, bloqueio de datas e treinamento rápido para gestão das reservas. Indicado para pousadas, chácaras e espaços de eventos que precisam centralizar a agenda sem depender de ferramentas externas.',
				baseHours: 40,
				complexity: 'media',
			},
			{
				name: 'Site Institucional com Reservas e Pagamento Online',
				description:
					'Entrega do site com reservas e pagamento online integrado. Além da agenda e das confirmações automáticas, o sistema registra pagamentos por Pix e cartão, controla o status das transações e associa cada pagamento à reserva correspondente. Inclui configuração do gateway, testes em ambiente de homologação, tratamento de falhas de pagamento e painel para consulta histórica. O cliente informa as taxas e a chave Pix; eventuais custos do gateway são contratados diretamente com o provedor.',
				baseHours: 56,
				complexity: 'alta',
			},
			{
				name: 'Landing Page de Conversão',
				description:
					'Página única focada em captação de clientes, com chamada principal, benefícios, prova social, seção de objeções e chamada para ação por formulário ou WhatsApp. A entrega inclui redação e hierarquia de conteúdo, layout responsivo, integração com Google Analytics e Meta Pixel quando desejado, configuração de eventos de conversão, SEO básico e publicação no domínio. O cliente fornece oferta, depoimentos e materiais de marca; o resultado é acompanhado por cliques e envios registrados.',
				baseHours: 14,
				complexity: 'media',
			},
			{
				name: 'Redesign de Site Existente',
				description:
					'Reformulação visual e técnica de site já publicado, preservando conteúdo, endereços e domínio. O trabalho inclui diagnóstico de estrutura e desempenho, reorganização da navegação, atualização do layout para padrões atuais, melhoria de responsividade, correção de problemas de SEO e otimização de carregamento. A migração é planejada para evitar perda de indexação e indisponibilidade. Não envolve troca de plataforma, salvo quando acordado previamente.',
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
					'Desenvolvimento de sistema web sob medida a partir do processo real do cliente. Inclui levantamento de requisitos com entrevistas e mapeamento de fluxos, modelagem de banco de dados em Prisma com MySQL/MariaDB, autenticação e controle de acesso por perfis com Better Auth, telas de cadastro, listagem, filtros e relatórios, além das regras de negócio específicas. A entrega contempla testes funcionais, documentação de uso e implantação em servidor. O escopo detalhado é fechado na fase de levantamento.',
				baseHours: 120,
				complexity: 'alta',
			},
			{
				name: 'Painel Administrativo / Dashboard',
				description:
					'Painel de visualização e gestão integrado a sistema existente. Inclui indicadores principais, gráficos interativos, tabelas com filtros e paginação, controle de usuários e permissões e exportação de dados em PDF ou planilha. O layout é responsivo e segue a identidade visual do cliente. A entrega considera a integração com as fontes de dados já disponíveis e a validação dos números exibidos com o responsável pelo negócio.',
				baseHours: 60,
				complexity: 'media',
			},
			{
				name: 'Módulo Adicional de Sistema',
				description:
					'Desenvolvimento de nova funcionalidade em sistema já existente, como relatórios, controle de estoque, agendamento ou emissão de documentos. O trabalho inclui análise do código atual, definição das regras do módulo, implementação, integração com os dados existentes, testes de regressão e implantação. Busca-se preservar o comportamento das funcionalidades já em uso e manter a compatibilidade com a arquitetura adotada.',
				baseHours: 30,
				complexity: 'media',
			},
			{
				name: 'Sistema para Órgãos Públicos',
				description:
					'Sistema web sob medida para prefeituras e secretarias, voltado a processos como agendamento de auditórios, controle de contratos e gestão de solicitações. A entrega inclui perfis de acesso por setor, registro das ações para rastreabilidade, relatórios gerenciais e exportação de dados para prestação de contas. O desenvolvimento observa as exigências aplicáveis à contratação pública, com documentação técnica e fluxos claramente registrados. O escopo é detalhado a partir do processo administrativo informado pelo cliente.',
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
					'Licenciamento e implantação de sistema pronto para gestão de oficinas e auto shops. Inclui cadastro de clientes e veículos, ordens de serviço com etapas e status, orçamentos vinculados, controle financeiro básico e histórico de manutenções por veículo. A entrega contempla instalação, configuração inicial, carga de dados básicos e treinamento da equipe para uso das rotinas diárias. Personalizações específicas são avaliadas separadamente.',
				baseHours: 24,
				complexity: 'media',
			},
			{
				name: 'Saideira PDV – Ponto de Venda',
				description:
					'Licenciamento e implantação de sistema de ponto de venda para pequenos comércios. Inclui registro de vendas, cadastro de produtos, controle de estoque com movimentações, formas de pagamento, fechamento de caixa e relatórios de faturamento. A operação é configurada com a impressora e os dispositivos do estabelecimento. A entrega contempla instalação, parametrização inicial e treinamento do operador para uso no dia a dia.',
				baseHours: 20,
				complexity: 'media',
			},
			{
				name: 'Implantação e Treinamento de Sistema',
				description:
					'Serviço de colocação em operação de sistema pronto adquirido pelo cliente. Inclui instalação no ambiente definido, configuração de parâmetros, carga inicial de dados em planilha, validação dos primeiros registros e treinamento presencial ou remoto da equipe. Ao final, é entregue um resumo do ambiente configurado e das rotinas executadas, para que o cliente possa operar o sistema com autonomia.',
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
					'Implementação de fluxo automatizado de envio e resposta de mensagens para lembretes, confirmações, avisos e atendimento inicial. Inclui definição dos gatilhos, redação das mensagens, segmentação de contatos, registro de envios e tratamento de falhas. A automação é integrada ao canal definido pelo cliente e acompanhada por relatório simples de volume e resultados. A base de contatos e as regras de envio são fornecidas pelo cliente.',
				baseHours: 32,
				complexity: 'media',
			},
			{
				name: 'Automação de Rotinas e Processos',
				description:
					'Automação sob medida de tarefas repetitivas, como importação e exportação de planilhas, geração de relatórios, conferência de dados e notificações automáticas. O trabalho inclui mapeamento do processo atual, definição das regras, implementação do fluxo, testes com dados reais e documentação de execução. A solução reduz retrabalho e padroniza a rotina, mantendo registro das execuções e dos erros tratados.',
				baseHours: 24,
				complexity: 'media',
			},
			{
				name: 'Bot de Monitoramento de Oportunidades',
				description:
					'Robô que consulta fontes públicas, como portais de licitação e editais, em intervalos programados. O sistema filtra resultados por palavras-chave, região e faixa de valor, evita duplicidades e envia alertas ao cliente com link e resumo da oportunidade. Inclui configuração dos critérios, agenda de execução, registro das consultas e painel simples para revisão dos itens encontrados. O cliente define os termos e o destino dos alertas.',
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
					'Configuração de servidor Linux para hospedar a aplicação do cliente. Inclui instalação e ajuste de Nginx, PM2, certificado SSL, firewall e variáveis de ambiente, além de deploy da aplicação e validação de acesso. A entrega contempla documentação do ambiente, comandos de operação e rotina de reinício. A VPS é fornecida pelo cliente, com acesso administrativo disponível para configuração.',
				baseHours: 8,
				complexity: 'media',
			},
			{
				name: 'Implantação em Windows Server (IIS)',
				description:
					'Configuração de aplicação Node.js em servidor Windows com IIS por meio de iisnode. Inclui instalação dos componentes necessários, publicação do site, certificado SSL, ajustes de permissões e logs, além de rotina de deploy automatizado ou script de atualização. A entrega valida o funcionamento após reinício do servidor e documenta os passos de manutenção. O servidor e a licença são de responsabilidade do cliente.',
				baseHours: 10,
				complexity: 'media',
			},
			{
				name: 'Pipeline de CI/CD',
				description:
					'Configuração de integração e entrega contínua com GitHub Actions, em runners na nuvem ou self-hosted. O pipeline executa instalação de dependências, build, testes automatizados e deploy para o ambiente definido, com variáveis protegidas e notificação de resultado. A entrega inclui os arquivos de configuração no repositório e documento com o fluxo de publicação, permitindo que novas versões sejam liberadas de forma repetível.',
				baseHours: 12,
				complexity: 'media',
			},
			{
				name: 'Migração de Servidor ou Hospedagem',
				description:
					'Migração de site ou sistema para novo servidor ou provedor com planejamento para reduzir indisponibilidade. Inclui cópia de arquivos e banco de dados, restauração no ambiente de destino, ajuste de configurações e DNS, renovação de certificado SSL e testes de funcionamento. A janela de corte é agendada com o cliente e o ambiente anterior é mantido até a validação final.',
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
					'Criação e configuração de contas de e-mail no domínio do cliente, como contato@empresa.com.br. Inclui registro e validação de MX, SPF, DKIM e DMARC, configuração em celular e computador e teste de envio e recebimento. A entrega orienta boas práticas de segurança e fornece as configurações para novos dispositivos. A contratação do provedor de e-mail é feita pelo cliente.',
				baseHours: 3,
				complexity: 'baixa',
			},
			{
				name: 'Registro e Configuração de Domínio e DNS',
				description:
					'Apoio no registro de domínio e na configuração de DNS. Inclui apontamentos principais, subdomínios, redirecionamentos, registros de verificação e emissão de certificado SSL. A entrega valida a propagação e o acesso ao site e aos serviços vinculados. Quando o domínio já existe, a atuação é feita sobre a configuração atual, sem alterar o provedor sem autorização.',
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
					'Plano mensal de manutenção para site publicado. Inclui atualizações de conteúdo solicitadas, correções de problemas, backups periódicos, monitoramento de disponibilidade e suporte por WhatsApp ou e-mail, dentro do limite de horas contratado. As solicitações são organizadas por ordem de entrada e o cliente recebe um resumo mensal com as intervenções realizadas e o estado do ambiente. Demandas acima do limite são orçadas separadamente.',
				baseHours: 4,
				complexity: 'media',
				monthlyFee: 350,
			},
			{
				name: 'Plano Mensal de Suporte a Sistema',
				description:
					'Plano mensal de suporte para sistema em operação. Inclui correção de erros, pequenos ajustes de comportamento, acompanhamento de desempenho, backups e atendimento técnico prioritário dentro do limite de horas contratado. Cada chamado é registrado com descrição, prioridade e status. Mudanças de escopo ou novas funcionalidades são tratadas como demanda separada.',
				baseHours: 8,
				complexity: 'media',
				monthlyFee: 800,
			},
			{
				name: 'Hora Técnica de Desenvolvimento',
				description:
					'Hora avulsa de trabalho técnico para demandas pontuais fora dos planos mensais. Pode ser usada para correções, ajustes pontuais, investigação de falhas, pequenas melhorias ou suporte específico. O consumo é registrado por atividade e informado ao cliente, permitindo acompanhar o saldo de horas contratadas. Trabalhos com escopo maior são estimados e propostos separadamente.',
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
					'Etapa inicial de estruturação do projeto. Inclui reuniões de entendimento com os envolvidos, mapeamento de processos, definição de fluxos e telas, identificação de integrações e premissas, além da entrega de documento com cronograma, estimativa de esforço e proposta técnica. O material serve de base para assinatura do escopo e evita ambiguidades durante a execução.',
				baseHours: 8,
				complexity: 'media',
			},
			{
				name: 'Documentação Técnica para Contratação Pública',
				description:
					'Elaboração de documentação de apoio a processos de contratação pública. Inclui Estudo Técnico Preliminar, Termo de Referência e especificações técnicas de sistemas, com descrição clara da solução, requisitos funcionais e não funcionais, critérios de aceite e estimativa de valores. O texto é redigido em linguagem acessível e alinhado às exigências aplicáveis, mantendo rastreabilidade das decisões técnicas.',
				baseHours: 20,
				complexity: 'alta',
			},
			{
				name: 'Consultoria Técnica / Revisão de Código e Arquitetura',
				description:
					'Análise de sistema ou projeto existente com foco em qualidade e manutenibilidade. Inclui revisão da estrutura de código, arquitetura, dependências e práticas de segurança e desempenho, seguida de relatório com problemas encontrados, riscos priorizados e recomendações de melhoria. As sugestões são apresentadas por ordem de impacto e acompanhadas de exemplo de aplicação.',
				baseHours: 12,
				complexity: 'media',
			},
			{
				name: 'Auditoria de Segurança Básica',
				description:
					'Revisão dos principais pontos de exposição de uma aplicação. Inclui verificação de autenticação, controle de permissões, validação de dados, tratamento de erros, dependências desatualizadas e configuração do servidor. A entrega é um relatório com achados classificados por severidade, impacto prático e correções sugeridas. Não substitui testes de penetração completos, que podem ser contratados separadamente.',
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
					'Integração de pagamentos por Pix e cartão ao sistema do cliente. Inclui criação de cobranças, webhooks de confirmação, conciliação de transações, tratamento de falhas e estornos e registro dos eventos no painel. A entrega contempla testes em homologação e validação do fluxo com o gateway escolhido. Taxas e credenciais são fornecidas pelo cliente.',
				baseHours: 24,
				complexity: 'media',
			},
			{
				name: 'Integração com WhatsApp',
				description:
					'Envio de notificações e mensagens automáticas por WhatsApp a partir do sistema do cliente. Inclui configuração do canal, modelos de mensagem aprovados, registro de envios, tratamento de falhas e controle de descadastramento. A integração respeita as regras do provedor e a entrega inclui documentação dos gatilhos disponíveis. O número e o provedor oficial são definidos pelo cliente.',
				baseHours: 16,
				complexity: 'media',
			},
			{
				name: 'Desenvolvimento de API REST com Documentação',
				description:
					'Criação de API REST para consumo por aplicativos e sistemas de terceiros. Inclui autenticação, validação de dados, versionamento, tratamento de erros e documentação interativa com Swagger ou Scalar. A entrega contempla exemplos de requisições, contrato de respostas e ambiente de testes, permitindo que equipes externas integrem sem depender de contato direto para entender a interface.',
				baseHours: 40,
				complexity: 'alta',
			},
			{
				name: 'Integração com Sistemas de Terceiros',
				description:
					'Integração entre o sistema do cliente e serviços externos, como ERP, CRM, planilhas e ferramentas de e-mail marketing. Inclui mapeamento dos campos, sincronização de dados, tratamento de divergências e registro de erros com possibilidade de reprocessamento. A entrega é validada com dados reais e acompanhada de documentação do fluxo e dos responsáveis por cada sistema.',
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
