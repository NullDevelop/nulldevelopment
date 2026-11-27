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

Em desenvolvimento os arquivos são salvos em `public/uploads`. Na Vercel o sistema de arquivos é somente leitura, então é obrigatório configurar um [Blob store](https://vercel.com/docs/vercel-blob/server-upload):

1. No painel da Vercel, crie um store em **Storage → Create Storage → Blob**.
2. Escolha **Public** como modo de acesso (as imagens precisam ser servidas publicamente; o modo não pode ser alterado depois).
3. Conecte o store ao projeto em **Projects → Connect to Project** (isso adiciona `BLOB_STORE_ID` e `VERCEL_OIDC_TOKEN`). Se quiser usar `BLOB_READ_WRITE_TOKEN`, marque **Add a read-write token env var to this connection**.
4. Faça um novo deploy.

A rota `/api/upload` usa o Blob automaticamente quando roda na Vercel; localmente continua gravando em `public/uploads`. Limite por imagem: **4,5 MB** (limite de corpo das Vercel Functions).

## Autor

**Pedro Andrade** — Desenvolvedor Full Stack · [null.dev](https://nulldev.com.br) · [LinkedIn](https://linkedin.com/in/pedrodevfull) · [GitHub](https://github.com/nulldevelop)