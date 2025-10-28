'use client';

import React from 'react';
import type { TableWithGuests } from '@/types/wedding';

/**
 * SeatingChartPrintable Component
 * Print-optimized version for A3 format (297mm x 420mm)
 * Shows all tables with their numbers and guest names
 */
interface SeatingChartPrintableProps {
  tables: TableWithGuests[];
  showGuestNames?: boolean;
}

export default function SeatingChartPrintable({
  tables,
  showGuestNames = false,
}: SeatingChartPrintableProps) {
  // SVG viewBox dimensions (matching the hand-drawn layout)
  const viewBox = { width: 100, height: 120 };

  /**
   * Render a single table
   */
  const renderTable = (table: TableWithGuests) => {
    const isSpecial = table.is_special;

    // Position and size
    const x = table.position_x || 50;
    const y = table.position_y || 50;
    const radius = isSpecial ? 8 : 6;

    // Colors for print
    const fillColor = isSpecial ? '#F8F6F3' : '#FFFFFF';
    const strokeColor = '#2C2C2C';
    const strokeWidth = isSpecial ? 2 : 1.5;

    return (
      <g key={table.id}>
        {/* Table circle */}
        <circle
          cx={x}
          cy={y}
          r={radius}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        {/* Table number */}
        <text
          x={x}
          y={y + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Playfair Display, serif"
          fontWeight="600"
          fontSize={isSpecial ? "5" : "4"}
          fill="#2C2C2C"
        >
          {table.table_number}
        </text>

        {/* Table name (for special tables) */}
        {isSpecial && table.table_name && (
          <text
            x={x}
            y={y - radius - 2}
            textAnchor="middle"
            fontFamily="Crimson Text, serif"
            fontSize="3"
            fill="#4A4A4A"
          >
            {table.table_name}
          </text>
        )}

        {/* Guest count */}
        {!showGuestNames && (
          <text
            x={x}
            y={y + radius + 4}
            textAnchor="middle"
            fontFamily="Crimson Text, serif"
            fontSize="3"
            fill="#4A4A4A"
          >
            {table.assigned_guests} pessoas
          </text>
        )}
      </g>
    );
  };

  /**
   * Render venue elements (based on hand-drawn layout)
   */
  const renderVenueElements = () => {
    return (
      <g>
        {/* Cortina de Pano (Fabric Curtain) - Top */}
        <rect
          x="30"
          y="15"
          width="40"
          height="2"
          fill="#E8E6E3"
          stroke="#A8A8A8"
          strokeWidth="0.5"
        />
        <text
          x="50"
          y="13"
          textAnchor="middle"
          fontFamily="Crimson Text, serif"
          fontSize="2.5"
          fill="#4A4A4A"
        >
          Cortina de Pano
        </text>

        {/* Bolo (Cake) - Top Right */}
        <circle cx="75" cy="22" r="3" fill="#FFFFFF" stroke="#A8A8A8" strokeWidth="0.5" />
        <text
          x="75"
          y="28"
          textAnchor="middle"
          fontFamily="Crimson Text, serif"
          fontSize="2.5"
          fill="#4A4A4A"
        >
          Bolo
        </text>

        {/* Churrasqueira & Buffet - Right side */}
        <rect
          x="80"
          y="55"
          width="15"
          height="20"
          fill="#F8F6F3"
          stroke="#A8A8A8"
          strokeWidth="0.5"
        />
        <text
          x="87.5"
          y="63"
          textAnchor="middle"
          fontFamily="Crimson Text, serif"
          fontSize="2.5"
          fill="#4A4A4A"
        >
          Churrasqueira
        </text>
        <text
          x="87.5"
          y="67"
          textAnchor="middle"
          fontFamily="Crimson Text, serif"
          fontSize="2.5"
          fill="#4A4A4A"
        >
          & Buffet
        </text>

        {/* Cozinha (Kitchen) - Bottom Right */}
        <rect
          x="75"
          y="95"
          width="20"
          height="15"
          fill="#E8E6E3"
          stroke="#A8A8A8"
          strokeWidth="0.5"
        />
        <text
          x="85"
          y="103"
          textAnchor="middle"
          fontFamily="Crimson Text, serif"
          fontSize="2.5"
          fill="#4A4A4A"
        >
          Cozinha
        </text>

        {/* Quarto Depósito - Left side */}
        <rect
          x="5"
          y="60"
          width="15"
          height="12"
          fill="#E8E6E3"
          stroke="#A8A8A8"
          strokeWidth="0.5"
        />
        <text
          x="12.5"
          y="66"
          textAnchor="middle"
          fontFamily="Crimson Text, serif"
          fontSize="2.5"
          fill="#4A4A4A"
        >
          Quarto
        </text>
        <text
          x="12.5"
          y="69"
          textAnchor="middle"
          fontFamily="Crimson Text, serif"
          fontSize="2.5"
          fill="#4A4A4A"
        >
          Depósito
        </text>

        {/* Entrada (Entrance) - Bottom */}
        <rect
          x="25"
          y="110"
          width="25"
          height="3"
          fill="none"
          stroke="#A8A8A8"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
        <text
          x="37.5"
          y="116"
          textAnchor="middle"
          fontFamily="Crimson Text, serif"
          fontSize="2.5"
          fill="#4A4A4A"
        >
          Entrada
        </text>

        {/* Elevador (Elevator) - Bottom Left */}
        <rect
          x="5"
          y="105"
          width="10"
          height="8"
          fill="#F8F6F3"
          stroke="#A8A8A8"
          strokeWidth="0.5"
        />
        <text
          x="10"
          y="109"
          textAnchor="middle"
          fontFamily="Crimson Text, serif"
          fontSize="2.5"
          fill="#4A4A4A"
        >
          Elevador
        </text>

        {/* Mesa com as cadeiras alugadas (Rented chairs table) - Bottom */}
        <rect
          x="40"
          y="95"
          width="20"
          height="5"
          fill="none"
          stroke="#A8A8A8"
          strokeWidth="0.5"
          strokeDasharray="1,1"
        />
        <text
          x="50"
          y="102"
          textAnchor="middle"
          fontFamily="Crimson Text, serif"
          fontSize="2"
          fill="#4A4A4A"
        >
          Mesa com cadeiras alugadas
        </text>
      </g>
    );
  };

  return (
    <div className="seating-chart-printable bg-white">
      {/* Header */}
      <div className="text-center mb-8 p-6">
        <h1
          className="font-playfair text-5xl text-charcoal mb-3"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Mapa de Mesas
        </h1>
        <p
          className="font-crimson text-xl text-gray italic"
          style={{ fontFamily: 'Crimson Text, serif' }}
        >
          Casamento Hel & Ylana - 20 de Novembro de 2025
        </p>
      </div>

      {/* SVG Chart */}
      <div className="w-full" style={{ minHeight: '800px' }}>
        <svg
          viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
          className="w-full h-full"
          style={{
            background: '#F8F6F3',
            border: '2px solid #2C2C2C',
          }}
        >
          {/* Venue elements */}
          {renderVenueElements()}

          {/* Tables */}
          {tables.map(renderTable)}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-8 p-6 border-t-2 border-charcoal">
        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white border-2 border-charcoal" />
            <span className="font-crimson text-gray" style={{ fontFamily: 'Crimson Text, serif' }}>
              Mesa regular
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cream border-2 border-charcoal" />
            <span className="font-crimson text-gray" style={{ fontFamily: 'Crimson Text, serif' }}>
              Mesa especial
            </span>
          </div>
        </div>
      </div>

      {/* Guest Lists (if enabled) */}
      {showGuestNames && (
        <div className="mt-8 p-6 grid grid-cols-2 gap-6">
          {tables
            .filter((t) => !t.is_special && t.guests.length > 0)
            .map((table) => (
              <div key={table.id} className="border border-silver-gray rounded-lg p-4">
                <h3
                  className="font-playfair text-lg text-charcoal mb-2 text-center"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Mesa {table.table_number}
                </h3>
                <ul
                  className="space-y-1 text-sm font-crimson text-gray"
                  style={{ fontFamily: 'Crimson Text, serif' }}
                >
                  {table.guests.map((guest, idx) => (
                    <li key={idx} className="border-b border-accent last:border-0 py-1">
                      {guest.guest_name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}

      {/* Print instructions */}
      <div className="mt-8 p-6 bg-accent rounded-lg print:hidden">
        <h3
          className="font-playfair text-lg text-charcoal mb-2"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Instruções para Impressão
        </h3>
        <ul
          className="space-y-1 text-sm font-crimson text-gray"
          style={{ fontFamily: 'Crimson Text, serif' }}
        >
          <li>• Formato recomendado: A3 (297mm x 420mm)</li>
          <li>• Orientação: Retrato (vertical)</li>
          <li>• Papel: Couché ou Opaline 180g/m² ou superior</li>
          <li>• Margem: 10mm em todos os lados</li>
          <li>• Qualidade: Alta resolução (300 DPI mínimo)</li>
        </ul>
      </div>
    </div>
  );
}
