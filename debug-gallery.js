// Script para debugar dados da galeria
// Execute no console do navegador: node debug-gallery.js

console.log('🔍 DEBUGANDO DADOS DA GALERIA...\n')

// Simular localStorage do navegador
const mockLocalStorage = {
  'wedding_media_items': null,
  'wedding_timeline_events': null,
  'wedding_gallery_stats': null
}

console.log('📂 Chaves no localStorage:')
Object.keys(mockLocalStorage).forEach(key => {
  const data = mockLocalStorage[key]
  if (data) {
    try {
      const parsed = JSON.parse(data)
      console.log(`✅ ${key}: ${Array.isArray(parsed) ? parsed.length : 'object'} itens`)
    } catch (error) {
      console.log(`❌ ${key}: erro ao fazer parse`, error)
    }
  } else {
    console.log(`⚠️  ${key}: vazio`)
  }
})

console.log('\n📋 INSTRUÇÕES PARA DEBUG:')
console.log('1. Abra o navegador em http://localhost:3000')
console.log('2. Pressione F12 para abrir DevTools')
console.log('3. Vá na aba Console')
console.log('4. Execute estes comandos:')
console.log('')
console.log('// Verificar dados existentes:')
console.log('const items = JSON.parse(localStorage.getItem("wedding_media_items") || "[]")')
console.log('console.log("Fotos no localStorage:", items.length)')
console.log('console.log("Primeiras 3 fotos:", items.slice(0, 3))')
console.log('')
console.log('// Limpar dados mockados (se necessário):')
console.log('localStorage.removeItem("wedding_media_items")')
console.log('localStorage.removeItem("wedding_timeline_events")')
console.log('localStorage.removeItem("wedding_gallery_stats")')
console.log('')
console.log('// Depois reload a página')
console.log('location.reload()')
