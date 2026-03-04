# Deploy do Frontend Astrocode (Vercel)

Este guia explica como hospedar o frontend online na **Vercel** para cumprir o requisito: *"Hospedagem obrigatória do frontend - O projeto deve estar hosteado e acessível online"*.

## Pré-requisitos

- Conta na [Vercel](https://vercel.com) (gratuita)
- Projeto no [GitHub](https://github.com) (recomendado para deploy automático)

## Opção 1: Deploy via GitHub (recomendado)

1. **Envie o projeto para o GitHub** (se ainda não fez):
   ```bash
   git add .
   git commit -m "Add Vercel deployment config"
   git push origin main
   ```

2. **Acesse [vercel.com](https://vercel.com)** e faça login com sua conta GitHub.

3. **Importe o projeto**:
   - Clique em "Add New..." → "Project"
   - Selecione o repositório do projeto
   - **Root Directory**: defina como `astrocode-web` (importante!)
   - Clique em "Deploy"

4. **Configure a variável de ambiente** (quando o backend estiver online):
   - No painel do projeto na Vercel → Settings → Environment Variables
   - Adicione: `API_BASE_URL` = URL do seu backend (ex: `https://seu-backend.railway.app`)

5. **Redeploy** após adicionar a variável para aplicar as mudanças.

## Opção 2: Deploy via Vercel CLI

1. **Instale a Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Na pasta do frontend**:
   ```bash
   cd astrocode-web
   vercel
   ```

3. Siga as perguntas (login, nome do projeto, etc.).

4. Para configurar a URL da API:
   ```bash
   vercel env add API_BASE_URL
   ```
   Digite a URL do backend quando solicitado.

## Configuração da URL da API

O frontend precisa da URL do backend para funcionar (login, agendamentos, etc.):

- **Sem variável definida**: usa `http://localhost:3000` (não funcionará em produção)
- **Com `API_BASE_URL`**: usa a URL configurada (ex: `https://astrocode-api.railway.app`)

**Importante**: O backend NestJS também precisa estar hospedado e com CORS configurado para aceitar requisições do domínio da Vercel.

## Resultado

Após o deploy, você receberá uma URL pública, por exemplo:
- `https://astrocode-web-xxx.vercel.app`

O frontend estará **acessível online 24/7**, cumprindo o requisito de hospedagem obrigatória.
