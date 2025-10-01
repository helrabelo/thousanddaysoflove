#!/bin/bash

# Simular webhook do Mercado Pago aprovando o pagamento

MERCADO_PAGO_PAYMENT_ID="1324939246"

echo "🔄 Simulando aprovação do pagamento ${MERCADO_PAGO_PAYMENT_ID}..."

curl -X POST http://localhost:3000/api/webhooks/mercado-pago \
  -H "Content-Type: application/json" \
  -d "{
    \"action\": \"payment.updated\",
    \"api_version\": \"v1\",
    \"data\": {
      \"id\": \"${MERCADO_PAGO_PAYMENT_ID}\"
    },
    \"date_created\": \"2025-10-01T23:22:00.000Z\",
    \"id\": 12345,
    \"live_mode\": false,
    \"type\": \"payment\",
    \"user_id\": \"123456\"
  }" \
  --silent \
  --show-error \
  --write-out "\n\n✅ Status: %{http_code}\n"

echo ""
echo "✅ Webhook simulado!"
echo "Verifique se o status mudou para 'completed' na interface"
