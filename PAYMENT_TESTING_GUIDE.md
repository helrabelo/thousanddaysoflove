# Guia de Testes de Pagamento - ThousandDaysOfLove

## Status da Implementação de Pagamentos

### ✅ O que está pronto:

1. **Infraestrutura Backend Completa**
   - PaymentService com integração Mercado Pago
   - Suporte a PIX com geração de QR Code
   - API Routes configuradas:
     - `/api/payments/create-pix` - Criar pagamento PIX
     - `/api/payments/status` - Verificar status
     - `/api/webhooks/mercado-pago` - Receber notificações

2. **Banco de Dados**
   - Tabela `payments` no Supabase
   - Relacionamento com `gifts` e `guests`
   - RLS (Row Level Security) configurado

3. **Funcionalidades Implementadas**
   - Criação de pagamento PIX
   - Geração de QR Code
   - Webhook handler para atualizações automáticas
   - Formatação de valores em BRL
   - Validações de pagamento

### ⚠️ O que precisa ser configurado:

1. **Variáveis de Ambiente do Mercado Pago**
   ```bash
   MERCADO_PAGO_ACCESS_TOKEN=your_access_token
   MERCADO_PAGO_PUBLIC_KEY=your_public_key
   MERCADO_PAGO_WEBHOOK_SECRET=your_webhook_secret
   ```

2. **URL do Webhook**
   - Configurar no painel do Mercado Pago
   - URL: `https://seu-dominio.com/api/webhooks/mercado-pago`

---

## Step-by-Step: Como Testar Pagamentos

### Pré-requisitos

1. **Criar conta no Mercado Pago** (se ainda não tem)
   - Acesse: https://www.mercadopago.com.br/developers/
   - Crie uma aplicação

2. **Obter Credenciais de Teste**
   - No painel do Mercado Pago: `Suas integrações > Credenciais`
   - Copie as credenciais de **TESTE** (não usar produção ainda!)
   - Access Token de teste
   - Public Key de teste

### Passo 1: Configurar Variáveis de Ambiente

```bash
# No arquivo .env.local (já existe .env.local.example como referência)

# Credenciais de TESTE do Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=TEST-123456789-123456-abcdef123456789abcdef123456789-123456789
MERCADO_PAGO_PUBLIC_KEY=TEST-abcdef12-3456-7890-abcd-ef1234567890
MERCADO_PAGO_WEBHOOK_SECRET=seu_webhook_secret_opcional

# URL do site (para webhooks locais, usar ngrok)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Passo 2: Configurar Supabase Local

```bash
# Iniciar Supabase local
npm run supabase:start

# Verificar que está rodando
npm run supabase:status

# Resetar banco com dados de teste (se necessário)
npm run db:reset
```

### Passo 3: Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

### Passo 4: Testar Criação de Pagamento PIX

**Opção A: Via Interface do Site**

1. Acesse: `http://localhost:3000/presentes`
2. Escolha um presente
3. Clique em "Presentear com PIX"
4. Preencha os dados:
   - Nome
   - Email
   - Valor (pode ser parcial)
   - Mensagem (opcional)
5. Clique em "Gerar PIX"
6. Você deve ver:
   - QR Code gerado
   - Código PIX para copiar
   - Status "Aguardando pagamento"

**Opção B: Teste Direto via API (usando cURL ou Postman)**

```bash
# Criar um pagamento PIX de teste
curl -X POST http://localhost:3000/api/payments/create-pix \
  -H "Content-Type: application/json" \
  -d '{
    "giftId": "gift-id-from-database",
    "amount": 100.00,
    "payerEmail": "teste@exemplo.com",
    "buyerName": "João Silva",
    "message": "Parabéns pelo casamento!"
  }'
```

**Resposta Esperada:**

```json
{
  "success": true,
  "payment": {
    "id": "payment-uuid",
    "status": "pending",
    "amount": 100.00
  },
  "mercadoPago": {
    "paymentId": 123456789,
    "status": "pending",
    "pixCode": "00020126...codigo-pix-completo",
    "qrCodeBase64": "data:image/png;base64,...",
    "qrCodeImage": "data:image/png;base64,..."
  }
}
```

### Passo 5: Testar Pagamento no Ambiente Sandbox do Mercado Pago

1. **Usar App do Mercado Pago em Modo Teste**
   - Baixe o app Mercado Pago
   - Faça login com usuário de teste (criar no painel dev)
   - Escaneie o QR Code gerado
   - Confirme o pagamento

2. **Ou usar a API de Teste do Mercado Pago**
   ```bash
   # Simular aprovação de pagamento
   curl -X PUT https://api.mercadopago.com/v1/payments/{payment_id} \
     -H "Authorization: Bearer TEST-ACCESS-TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"status": "approved"}'
   ```

### Passo 6: Verificar Atualização via Webhook (Local Testing)

**Para testar webhooks localmente, usar ngrok:**

1. **Instalar ngrok** (se não tiver)
   ```bash
   # macOS
   brew install ngrok

   # Ou baixar de: https://ngrok.com/download
   ```

2. **Expor servidor local**
   ```bash
   # Em um terminal separado
   ngrok http 3000
   ```

3. **Configurar URL do Webhook no Mercado Pago**
   - Copie a URL do ngrok (ex: `https://abcd1234.ngrok.io`)
   - No painel Mercado Pago: Configurações > Webhooks
   - Adicione: `https://abcd1234.ngrok.io/api/webhooks/mercado-pago`

4. **Testar Webhook**
   ```bash
   # Simular notificação de webhook
   curl -X POST http://localhost:3000/api/webhooks/mercado-pago \
     -H "Content-Type: application/json" \
     -d '{
       "type": "payment",
       "data": {
         "id": "123456789"
       }
     }'
   ```

### Passo 7: Verificar Status do Pagamento

**Via Interface:**
1. Acesse `/admin/pagamentos`
2. Verifique lista de pagamentos
3. Status deve atualizar automaticamente quando webhook processar

**Via API:**
```bash
curl http://localhost:3000/api/payments/status?paymentId=payment-uuid
```

### Passo 8: Monitorar Logs

```bash
# Terminal onde o servidor está rodando
# Você verá logs como:

✓ Payment created: payment-uuid
✓ Mercado Pago payment created: 123456789 pending
✓ QR Code generated successfully
✓ Webhook received: payment approved
✓ Payment status updated: completed
```

---

## Checklist de Testes

### ✅ Testes Básicos

- [ ] Criar pagamento PIX com sucesso
- [ ] QR Code é gerado corretamente
- [ ] Código PIX pode ser copiado
- [ ] Pagamento aparece no admin com status "pending"
- [ ] Valores são formatados em BRL (R$)

### ✅ Testes de Validação

- [ ] Não permite valor maior que preço do presente
- [ ] Não permite valor negativo ou zero
- [ ] Requer giftId válido
- [ ] Validação de email funciona

### ✅ Testes de Webhook

- [ ] Webhook recebe notificação do Mercado Pago
- [ ] Status é atualizado de "pending" para "completed"
- [ ] Admin dashboard reflete mudança automaticamente
- [ ] Email de confirmação é enviado (se configurado)

### ✅ Testes de Interface

- [ ] Modal de pagamento abre corretamente
- [ ] QR Code é exibido claramente
- [ ] Botão "Copiar código PIX" funciona
- [ ] Feedback visual durante processamento
- [ ] Mensagem de sucesso/erro apropriada

---

## Ambientes de Teste do Mercado Pago

### Usuários de Teste

Criar no painel: https://www.mercadopago.com.br/developers/panel/test-users

**Comprador (Payer):**
- Email: test_user_123456@testuser.com
- Senha: gerada automaticamente

**Vendedor (Collector):**
- Email: test_user_789012@testuser.com
- Senha: gerada automaticamente

### Dados de Teste PIX

No ambiente de teste, qualquer QR Code gerado pode ser "pago" através da interface de teste do Mercado Pago.

---

## Troubleshooting

### Erro: "Mercado Pago access token not configured"

**Solução:** Verificar se o `.env.local` tem a variável:
```bash
MERCADO_PAGO_ACCESS_TOKEN=TEST-seu-token-aqui
```

### Erro: "Failed to create payment record"

**Solução:**
1. Verificar se Supabase está rodando: `npm run supabase:status`
2. Verificar se tabela `payments` existe: `npm run supabase:studio`
3. Verificar RLS policies

### Webhook não está funcionando

**Solução:**
1. Verificar se ngrok está rodando
2. Verificar URL configurada no Mercado Pago
3. Verificar logs do ngrok: `http://localhost:4040`
4. Testar manualmente com cURL

### QR Code não aparece

**Solução:**
1. Verificar resposta da API no console do browser (F12)
2. Verificar se biblioteca `qrcode` está instalada: `npm install qrcode`
3. Verificar logs do servidor

---

## Próximos Passos para Produção

### Antes de ir para produção:

1. **Trocar credenciais de teste por produção**
   ```bash
   MERCADO_PAGO_ACCESS_TOKEN=APP-production-token
   MERCADO_PAGO_PUBLIC_KEY=APP-production-key
   ```

2. **Configurar domínio real**
   ```bash
   NEXT_PUBLIC_SITE_URL=https://thousanddaysof.love
   ```

3. **Configurar webhook em produção**
   - URL: `https://thousanddaysof.love/api/webhooks/mercado-pago`

4. **Testar com valores reais pequenos** (R$ 0,01 ou R$ 1,00)

5. **Configurar certificado SSL** (Vercel já fornece)

6. **Configurar emails de confirmação** (SendGrid)

7. **Implementar monitoramento** (Sentry, LogRocket, etc.)

---

## Recursos Úteis

- **Documentação Mercado Pago PIX:** https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-configuration/integrate-with-pix
- **Credenciais de Teste:** https://www.mercadopago.com.br/developers/panel/credentials
- **Webhooks:** https://www.mercadopago.com.br/developers/pt/docs/checkout-api/additional-content/your-integrations/notifications/webhooks
- **Ngrok Documentation:** https://ngrok.com/docs

---

## Suporte

Se encontrar problemas:

1. Verificar logs do servidor Next.js
2. Verificar Supabase Studio para dados
3. Verificar painel Mercado Pago para status de pagamentos
4. Verificar documentação oficial do Mercado Pago

**Status Atual:** ✅ Sistema pronto para testes | ⚠️ Requer configuração de credenciais
