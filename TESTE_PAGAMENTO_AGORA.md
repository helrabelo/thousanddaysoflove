# 🧪 TESTE DE PAGAMENTO PIX - PASSO A PASSO

**Status:** ✅ Servidor rodando em http://localhost:3000
**Ambiente:** Teste (credenciais sandbox Mercado Pago)
**Database:** Supabase Cloud (produção)

---

## 🎯 Como Testar AGORA

### Passo 1: Acessar Lista de Presentes

```
Abra no navegador: http://localhost:3000/presentes
```

### Passo 2: Escolher um Presente

1. Navegue pela lista de presentes
2. Escolha qualquer item
3. Clique no botão **"Presentear com Amor via PIX"** ou similar

### Passo 3: Preencher Dados de Pagamento

No modal que abrir, preencha:

```
Nome: João Teste
Email: teste@email.com
Valor: R$ 10,00 (ou qualquer valor do presente)
Mensagem: "Testando pagamento PIX" (opcional)
```

### Passo 4: Gerar PIX

1. Clique em **"Gerar PIX"**
2. Aguarde alguns segundos (API Mercado Pago)

**O que deve aparecer:**
- ✅ QR Code do PIX
- ✅ Código PIX para copiar
- ✅ Instruções de pagamento
- ✅ Status "Aguardando pagamento"

### Passo 5: Testar Pagamento (3 opções)

#### Opção A: App Mercado Pago Sandbox (Recomendado)

1. **Baixe o app Mercado Pago** no celular
2. **Faça login com usuário de teste:**
   - Criar em: https://www.mercadopago.com.br/developers/panel/test-users
   - Ou usar credenciais de teste que você já tem
3. **Escaneie o QR Code** gerado
4. **Confirme o pagamento** (sem cobrar de verdade)

#### Opção B: Simular via API

```bash
# No terminal (em outra janela), execute:
curl -X POST http://localhost:3000/api/webhooks/mercado-pago \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "data": {
      "id": "PAYMENT_ID_DO_MERCADO_PAGO"
    }
  }'
```

**Nota:** Substitua `PAYMENT_ID_DO_MERCADO_PAGO` pelo ID retornado no passo 4.

#### Opção C: Painel Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel/payments
2. Encontre o pagamento criado
3. Aprove manualmente (modo teste)

---

## 📊 Verificar Resultados

### No Frontend (Interface)

1. **Página de Confirmação:**
   - Deve redirecionar para `/pagamento/confirmacao`
   - Mostrar status do pagamento
   - Exibir detalhes do presente

2. **Admin Dashboard:**
   ```
   http://localhost:3000/admin/pagamentos
   ```
   - Ver lista de todos os pagamentos
   - Verificar status atualizado
   - Conferir valores e métodos

### No Console do Navegador (F12)

```
✓ Payment created: {payment-uuid}
✓ Mercado Pago payment: {mercado-pago-id}
✓ QR Code generated successfully
✓ Status: pending → completed
```

### Logs do Servidor

No terminal onde o servidor está rodando, você verá:

```
✓ POST /api/payments/create-pix 200
✓ Payment service: Creating PIX payment
✓ Mercado Pago: Payment created - ID: 123456789
✓ QR Code generated
✓ Webhook received: payment.updated
✓ Payment status: pending → completed
```

---

## 🔍 Checklist de Testes

### ✅ Teste Básico de Criação

- [ ] Página /presentes carrega corretamente
- [ ] Modal de pagamento abre ao clicar no presente
- [ ] Form aceita nome, email, valor
- [ ] Botão "Gerar PIX" está funcionando
- [ ] API retorna QR Code
- [ ] Código PIX pode ser copiado

### ✅ Teste de Validação

- [ ] Não permite valor maior que preço do presente
- [ ] Não permite valor zero ou negativo
- [ ] Email precisa ser válido
- [ ] Mensagens de erro aparecem corretamente

### ✅ Teste de Pagamento

- [ ] QR Code é escaneável
- [ ] Código PIX funciona no app Mercado Pago
- [ ] Pagamento aparece no painel Mercado Pago
- [ ] Status inicial é "pending"

### ✅ Teste de Webhook

- [ ] Webhook recebe notificação
- [ ] Status atualiza para "completed"
- [ ] Admin dashboard reflete mudança
- [ ] Timestamp de updated_at é atualizado

### ✅ Teste de Interface

- [ ] Loading states aparecem
- [ ] Mensagens de sucesso/erro são claras
- [ ] Modal fecha corretamente
- [ ] Não há erros no console

---

## 🐛 Troubleshooting

### Erro: "Failed to create payment"

**Verificar:**
```bash
# Checar se .env.local tem as variáveis
grep MERCADO_PAGO .env.local

# Deve mostrar:
# MERCADO_PAGO_ACCESS_TOKEN=TEST-...
# MERCADO_PAGO_PUBLIC_KEY=TEST-...
```

### Erro: "Gift not found"

**Solução:** Verificar se há presentes cadastrados no Supabase
```
http://localhost:3000/admin/presentes
```

### QR Code não aparece

**Verificar:**
1. Console do navegador (F12) - ver erros
2. Logs do servidor - verificar resposta da API
3. Network tab - ver payload e response do POST

### Webhook não atualiza status

**Possíveis causas:**
1. Webhook URL não configurada no Mercado Pago
2. Servidor não está acessível externamente (usar ngrok)
3. Payload do webhook está incorreto

**Solução com ngrok:**
```bash
# Terminal 1: Servidor rodando (já está)
npm run dev

# Terminal 2: Expor para internet
ngrok http 3000

# Copiar URL (ex: https://abc123.ngrok.io)
# Configurar no Mercado Pago: https://abc123.ngrok.io/api/webhooks/mercado-pago
```

---

## 📱 Teste de Ponta a Ponta (E2E)

### Cenário Completo:

1. **Convidado acessa site** → `http://localhost:3000`
2. **Navega para presentes** → `/presentes`
3. **Escolhe presente** → Abre modal
4. **Preenche dados** → Nome, email, valor
5. **Gera PIX** → Vê QR Code
6. **Paga via app** → Mercado Pago sandbox
7. **Webhook processa** → Status atualiza
8. **Confirmação** → Página de sucesso
9. **Admin verifica** → Dashboard mostra pagamento

---

## 📋 Dados de Teste Sugeridos

### Presente de Teste:
```
Nome: Jogo de Panelas
Valor: R$ 250,00
Categoria: Cozinha
```

### Pagador de Teste:
```
Nome: João da Silva Teste
Email: joao.teste@email.com
Telefone: (85) 98765-4321
Valor: R$ 50,00 (pagamento parcial)
Mensagem: "Parabéns pelo casamento! 💕"
```

---

## ✅ Sucesso Esperado

Após completar todos os passos, você deve ter:

1. ✅ Pagamento criado no banco de dados
2. ✅ QR Code PIX gerado
3. ✅ Pagamento no painel Mercado Pago
4. ✅ Status atualizado via webhook
5. ✅ Registro no admin dashboard
6. ✅ Zero erros no console

---

## 🚀 Próximos Passos

Após confirmar que tudo funciona:

1. **Testar em mobile** (navegador mobile ou DevTools)
2. **Testar diferentes valores** (parcial vs total)
3. **Testar múltiplos presentes**
4. **Verificar emails** (se SendGrid configurado)
5. **Preparar para produção** (trocar credenciais quando pronto)

---

## 📞 Precisa de Ajuda?

Se encontrar problemas:

1. **Verifique logs do servidor** (terminal onde npm run dev está rodando)
2. **Console do navegador** (F12 → Console tab)
3. **Network tab** (F12 → Network → ver requests/responses)
4. **Supabase Dashboard** (verificar se dados estão salvando)
5. **Mercado Pago Dashboard** (ver se pagamentos aparecem)

---

**Bom teste! 🎉**

Qualquer problema, me avise que a gente debugga junto.
