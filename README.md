# Null Development

> Site de portfólio e painel de gestão de projetos da Null Development.

| | |
|---|---|
| **Tipo** | Projeto próprio · site institucional + painel administrativo |
| **Meu papel** | Design e desenvolvimento completos |

## Sobre o projeto

Aplicação full stack que junta o site público da empresa, com o portfólio de projetos, e um painel administrativo para gerenciar todo o conteúdo.

## Funcionalidades

- Portfólio público com descrição, imagens, stack e links de cada projeto
- Painel administrativo com CRUD de projetos, empresas e mensagens
- Formulário de contato que alimenta as mensagens do painel
- Gráficos no painel e visual 3D na página inicial
- Autenticação do painel

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · shadcn/ui · Prisma · PostgreSQL · Better Auth · Recharts · Three.js (React Three Fiber) · Biome

## Como rodar

Pré-requisitos: Node.js 20+, pnpm e PostgreSQL.

```bash
pnpm install
cp .env.example .env   # ou crie o .env com as variáveis abaixo
pnpm prisma migrate dev
pnpm dev
```

## Variáveis de ambiente

`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`.

### Upload de imagens

Em desenvolvimento os arquivos são salvos em `public/uploads`. Na Vercel o sistema de arquivos é somente leitura, então é obrigatório configurar um [Blob store](https://vercel.com/docs/storage/vercel-blob/quickstart):

1. No painel da Vercel, crie um store em **Storage → Blob**.
2. Conecte-o ao projeto (isso adiciona automaticamente `BLOB_READ_WRITE_TOKEN`).
3. Faça um novo deploy.

A rota `/api/upload` usa o Blob automaticamente quando `BLOB_READ_WRITE_TOKEN` está disponível. Limite por imagem: 10 MB.

## Autor

**Pedro Andrade** — Desenvolvedor Full Stack · [null.dev](https://nulldev.com.br) · [LinkedIn](https://linkedin.com/in/pedrodevfull) · [GitHub](https://github.com/nulldevelop)