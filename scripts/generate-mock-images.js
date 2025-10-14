#!/usr/bin/env node

/**
 * Generate Mock Images for Thousand Days of Love
 * Creates elegant SVG placeholders matching the wedding design system
 */

const fs = require('fs');
const path = require('path');

// Wedding Design System Colors
const colors = {
  background: '#F8F6F3',
  primaryText: '#2C2C2C',
  secondaryText: '#4A4A4A',
  decorative: '#A8A8A8',
  accent: '#E8E6E3'
};

// Icon SVG paths for different types
const icons = {
  heart: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  camera: 'M12 15.5c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79-4-4 4zm0-9c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-3c-1.1 0-2 .9-2 2h-3l-1 1H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8.5c0-1.1-.9-2-2-2h-3l-1-1h-3c0-1.1-.9-2-2-2z',
  pets: 'M4.5 11c-1.38 0-2.5 1.12-2.5 2.5S3.12 16 4.5 16 7 14.88 7 13.5 5.88 11 4.5 11zm15 0c-1.38 0-2.5 1.12-2.5 2.5S18.12 16 19.5 16 22 14.88 22 13.5 20.88 11 19.5 11zm-7.5-2c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3zm0 9c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z',
  couple: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
  ring: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12.5c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5z',
  home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
  travel: 'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
  celebration: 'M7 2v11h3v9l7-12h-4l4-8z'
};

/**
 * Generate an elegant SVG placeholder
 */
function generateSVG({ width, height, title, subtitle, icon, gradient = false }) {
  const viewBox = `0 0 ${width} ${height}`;

  // Create gradient background if requested
  const backgroundGradient = gradient
    ? `<defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.background};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>`
    : `<rect width="${width}" height="${height}" fill="${colors.background}"/>`;

  // Add decorative border
  const border = `<rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="none" stroke="${colors.decorative}" stroke-width="2" opacity="0.3"/>`;

  // Add icon if provided
  const iconPath = icons[icon] || icons.heart;
  const iconSize = Math.min(width, height) * 0.15;
  const iconX = width / 2 - iconSize / 2;
  const iconY = height / 2 - iconSize / 2 - 40;

  const iconSVG = `<g transform="translate(${iconX}, ${iconY}) scale(${iconSize / 24})">
    <path d="${iconPath}" fill="${colors.decorative}" opacity="0.4"/>
  </g>`;

  // Add title text
  const titleFontSize = Math.min(width, height) * 0.06;
  const titleY = height / 2 + 20;

  const titleSVG = title ? `<text x="${width / 2}" y="${titleY}"
    font-family="Playfair Display, serif"
    font-size="${titleFontSize}"
    font-weight="600"
    fill="${colors.primaryText}"
    text-anchor="middle"
    letter-spacing="0.05em">${title}</text>` : '';

  // Add subtitle text
  const subtitleFontSize = Math.min(width, height) * 0.04;
  const subtitleY = titleY + subtitleFontSize + 10;

  const subtitleSVG = subtitle ? `<text x="${width / 2}" y="${subtitleY}"
    font-family="Crimson Text, serif"
    font-size="${subtitleFontSize}"
    font-style="italic"
    fill="${colors.secondaryText}"
    text-anchor="middle"
    opacity="0.8">${subtitle}</text>` : '';

  // Decorative line above title
  const lineY = titleY - titleFontSize - 20;
  const lineWidth = width * 0.15;
  const decorativeLine = `<line x1="${width / 2 - lineWidth / 2}" y1="${lineY}"
    x2="${width / 2 + lineWidth / 2}" y2="${lineY}"
    stroke="${colors.decorative}"
    stroke-width="2"
    opacity="0.5"/>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
  ${backgroundGradient}
  ${border}
  ${decorativeLine}
  ${iconSVG}
  ${titleSVG}
  ${subtitleSVG}
</svg>`;
}

/**
 * Save SVG to file
 */
function saveSVG(svg, filename) {
  const dir = path.dirname(filename);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filename, svg, 'utf8');
  console.log(`✓ Generated: ${filename}`);
}

/**
 * Generate all mock images
 */
function generateAllImages() {
  console.log('🎨 Generating mock images for Thousand Days of Love...\n');

  const publicDir = path.join(__dirname, '..', 'public');

  // 1. Hero Images
  console.log('📸 Hero Images:');
  saveSVG(
    generateSVG({
      width: 1920,
      height: 1080,
      title: 'Hel & Ylana',
      subtitle: '1000 Dias de Amor',
      icon: 'heart',
      gradient: true
    }),
    path.join(publicDir, 'images', 'hero-poster.jpg')
  );

  saveSVG(
    generateSVG({
      width: 1920,
      height: 1080,
      title: 'H ♥ Y',
      subtitle: 'November 20th, 2025',
      icon: 'couple',
      gradient: true
    }),
    path.join(publicDir, 'images', 'hero-couple.jpg')
  );

  // 2. Timeline Photos (15 events)
  console.log('\n📅 Timeline Photos:');
  const timelineEvents = [
    { id: 'primeiro-oi', title: 'Primeiro Oi', subtitle: 'WhatsApp', icon: 'heart' },
    { id: 'primeiro-encontro', title: 'Primeiro Encontro', subtitle: 'Casa Fontana', icon: 'couple' },
    { id: 'o-gesto-decisivo', title: 'O Gesto', subtitle: 'Cuidado & Amor', icon: 'heart' },
    { id: 'guaramiranga-pedido', title: 'Pedido de Namoro', subtitle: 'Guaramiranga', icon: 'ring' },
    { id: 'chegada-cacao', title: 'Cacao Chegou', subtitle: 'Família Cresce', icon: 'pets' },
    { id: 'reveillon-juntos', title: 'Primeiro Réveillon', subtitle: '2024', icon: 'celebration' },
    { id: 'primeiro-aniversario', title: '1º Aniversário', subtitle: 'Surpresa', icon: 'heart' },
    { id: 'linda-filhotes', title: 'Olivia & Oliver', subtitle: '4 Pets', icon: 'pets' },
    { id: 'apartamento-proprio', title: 'Casa Própria', subtitle: 'Sonho Realizado', icon: 'home' },
    { id: 'segundo-aniversario', title: '2º Aniversário', subtitle: 'Rio & Búzios', icon: 'travel' },
    { id: 'primeiro-natal', title: 'Natal em Casa', subtitle: 'Nossa Casa', icon: 'home' },
    { id: 'segundo-reveillon', title: 'Réveillon 2025', subtitle: 'Casa Própria', icon: 'celebration' },
    { id: 'ovulos-congelados', title: 'Futuro Juntos', subtitle: 'Planejando', icon: 'heart' },
    { id: 'pedido-casamento', title: 'O Pedido', subtitle: 'Icaraí', icon: 'ring' },
    { id: 'mil-dias', title: '1000 Dias', subtitle: 'Para Sempre', icon: 'celebration' }
  ];

  timelineEvents.forEach(event => {
    saveSVG(
      generateSVG({
        width: 800,
        height: 600,
        title: event.title,
        subtitle: event.subtitle,
        icon: event.icon,
        gradient: true
      }),
      path.join(publicDir, 'images', 'timeline', `${event.id}.jpg`)
    );
  });

  // 3. Gallery Photos
  console.log('\n🖼️  Gallery Photos:');
  const galleryItems = [
    { name: 'primeiro-beijo', title: 'Primeiro Beijo', subtitle: 'Casa Fontana', icon: 'heart' },
    { name: 'jantar-romantico', title: 'Jantar Romântico', subtitle: 'O Gesto', icon: 'couple' },
    { name: 'praia-juntos', title: 'Guaramiranga', subtitle: 'Pedido de Namoro', icon: 'travel' },
    { name: 'pedido-video', title: 'O Pedido', subtitle: 'Icaraí', icon: 'ring' },
    { name: 'festa-noivado', title: 'Festa', subtitle: '4 Pets', icon: 'pets' },
    { name: 'escolha-vestido', title: 'Rio & Búzios', subtitle: '2º Aniversário', icon: 'travel' },
    { name: 'ensaio-pre-wedding', title: 'Natal', subtitle: 'Casa Própria', icon: 'home' },
    { name: 'familia-dele', title: 'Futuro', subtitle: 'Planejando', icon: 'heart' }
  ];

  galleryItems.forEach(item => {
    // Full size
    saveSVG(
      generateSVG({
        width: 1200,
        height: 900,
        title: item.title,
        subtitle: item.subtitle,
        icon: item.icon,
        gradient: true
      }),
      path.join(publicDir, 'images', 'gallery', `${item.name}.jpg`)
    );

    // Thumbnail
    saveSVG(
      generateSVG({
        width: 400,
        height: 300,
        title: item.title,
        subtitle: item.subtitle,
        icon: item.icon,
        gradient: false
      }),
      path.join(publicDir, 'images', 'gallery', `${item.name}-thumb.jpg`)
    );
  });

  // 4. Pet Portraits
  console.log('\n🐾 Pet Portraits:');
  const pets = [
    { name: 'linda', title: 'Linda 👑', subtitle: 'Matriarca Autista' },
    { name: 'cacao', title: 'Cacao 🍫', subtitle: 'Companheiro' },
    { name: 'olivia', title: 'Olivia 🌸', subtitle: 'Filhote Doce' },
    { name: 'oliver', title: 'Oliver ⚡', subtitle: 'Filhote Energético' }
  ];

  pets.forEach(pet => {
    // Portrait
    saveSVG(
      generateSVG({
        width: 600,
        height: 600,
        title: pet.title,
        subtitle: pet.subtitle,
        icon: 'pets',
        gradient: true
      }),
      path.join(publicDir, 'images', 'pets', `${pet.name}.jpg`)
    );

    // Thumbnail
    saveSVG(
      generateSVG({
        width: 200,
        height: 200,
        title: pet.title,
        subtitle: '',
        icon: 'pets',
        gradient: false
      }),
      path.join(publicDir, 'images', 'pets', `${pet.name}-thumb.jpg`)
    );
  });

  console.log('\n✨ All mock images generated successfully!');
  console.log('\n📋 Summary:');
  console.log('   • 2 Hero images');
  console.log('   • 15 Timeline photos');
  console.log('   • 8 Gallery photos (+ 8 thumbnails)');
  console.log('   • 4 Pet portraits (+ 4 thumbnails)');
  console.log('   • Total: 41 images');
  console.log('\n🎨 All images follow the wedding design system aesthetic!');
}

// Run the generator
generateAllImages();
