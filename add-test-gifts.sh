#!/bin/bash

# Add Test Gifts to Sanity CMS
# Usage: ./add-test-gifts.sh

set -e

PROJECT_ID="ala3rp0f"
DATASET="production"
API_VERSION="2024-01-01"
TOKEN="skVBvJF3UwSroRJcXeSVQ4GxNNvZzn2vz8BZq15zwOhjfzxb3AcyroWJWwFQC1hVxqoknUDbf4FIRtbIkIXj5FomzPh1NUQEsWhu3cZWIfpchSSgiDGg646AQ5ATHToeoWl3ZjcTkz6GLdZOjCytJErGyl0KIQvWvORCo4pSrfszQVkDUaH6"

echo "🎁 Adding test gifts to Sanity CMS..."

# Function to upload placeholder image
upload_placeholder_image() {
  local name=$1
  local color=$2

  echo "📸 Uploading placeholder image for $name..."

  # Create a simple placeholder image URL (1200x800 product image size)
  local placeholder_url="https://via.placeholder.com/1200x800/${color}/FFFFFF?text=${name// /+}"

  # Download and upload to Sanity
  curl -s "$placeholder_url" -o "/tmp/${name}.png"

  # Upload to Sanity Assets API
  local response=$(curl -s -X POST \
    "https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/assets/images/${DATASET}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: image/png" \
    --data-binary "@/tmp/${name}.png")

  # Extract asset ID
  local asset_id=$(echo "$response" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)

  rm "/tmp/${name}.png"

  echo "$asset_id"
}

# Upload placeholder images
echo ""
echo "📸 Step 1: Uploading placeholder images..."
GELADEIRA_ASSET=$(upload_placeholder_image "Geladeira" "4A90E2")
PANELAS_ASSET=$(upload_placeholder_image "Panelas" "F5A623")
POTES_ASSET=$(upload_placeholder_image "Potes" "7ED321")
LUADEMEL_ASSET=$(upload_placeholder_image "LuaDeMel" "BD10E0")

echo ""
echo "✅ Images uploaded:"
echo "  - Geladeira: $GELADEIRA_ASSET"
echo "  - Panelas: $PANELAS_ASSET"
echo "  - Potes: $POTES_ASSET"
echo "  - Lua de Mel: $LUADEMEL_ASSET"

# Create gift mutations
echo ""
echo "🎁 Step 2: Creating gift items..."

MUTATIONS=$(cat <<EOF
{
  "mutations": [
    {
      "create": {
        "_type": "giftItem",
        "title": "Geladeira Brastemp Frost Free",
        "description": "Geladeira moderna com frost free, ideal para nossa família de 6 (incluindo os 4 cachorros barulhentos). Vai guardar toda a comida dos dogs e nossa também!",
        "fullPrice": 3000,
        "image": {
          "_type": "image",
          "asset": {
            "_type": "reference",
            "_ref": "$GELADEIRA_ASSET"
          }
        },
        "category": "electronics",
        "allowPartialPayment": true,
        "suggestedContributions": [500, 1000, 1500],
        "allowCustomAmount": true,
        "priority": "high",
        "isActive": true,
        "storeUrl": "https://www.brastemp.com.br/geladeira-frost-free"
      }
    },
    {
      "create": {
        "_type": "giftItem",
        "title": "Jogo de Panelas Tramontina 10 Peças",
        "description": "Jogo completo de panelas antiaderente para fazer comida gostosa. Perfeito para o apê que o Hel passava de bicicleta sonhando e agora é nosso!",
        "fullPrice": 800,
        "image": {
          "_type": "image",
          "asset": {
            "_type": "reference",
            "_ref": "$PANELAS_ASSET"
          }
        },
        "category": "kitchen",
        "allowPartialPayment": false,
        "allowCustomAmount": false,
        "priority": "medium",
        "isActive": true,
        "storeUrl": "https://www.tramontina.com.br/panelas"
      }
    },
    {
      "create": {
        "_type": "giftItem",
        "title": "Kit Potes de Vidro Para Mantimentos",
        "description": "Conjunto de potes de vidro para organizar a despensa. Linda 👑, Cacau 🍫, Olivia 🌸 e Oliver ⚡ agradecem pela organização da ração deles!",
        "fullPrice": 200,
        "image": {
          "_type": "image",
          "asset": {
            "_type": "reference",
            "_ref": "$POTES_ASSET"
          }
        },
        "category": "kitchen",
        "allowPartialPayment": true,
        "suggestedContributions": [50, 100, 150],
        "allowCustomAmount": true,
        "priority": "low",
        "isActive": true
      }
    },
    {
      "create": {
        "_type": "giftItem",
        "title": "Contribuição para Lua de Mel em Fernando de Noronha",
        "description": "Ajude a gente a conhecer um dos lugares mais lindos do Brasil! Vamos comemorar 1000 dias juntos e o apartamento próprio depois de anos trabalhando.",
        "fullPrice": 5000,
        "image": {
          "_type": "image",
          "asset": {
            "_type": "reference",
            "_ref": "$LUADEMEL_ASSET"
          }
        },
        "category": "honeymoon",
        "allowPartialPayment": true,
        "suggestedContributions": [200, 500, 1000, 2000],
        "allowCustomAmount": true,
        "priority": "high",
        "isActive": true
      }
    }
  ]
}
EOF
)

# Submit mutations
echo "🚀 Submitting gift mutations to Sanity..."

RESPONSE=$(curl -s -X POST \
  "https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$MUTATIONS")

echo ""
echo "✅ Response from Sanity:"
echo "$RESPONSE" | jq '.'

echo ""
echo "🎉 Done! Test gifts added to Sanity CMS!"
echo ""
echo "📍 View gifts at:"
echo "  - Website: http://localhost:3000/presentes"
echo "  - Sanity Studio: http://localhost:3000/studio"
echo ""
