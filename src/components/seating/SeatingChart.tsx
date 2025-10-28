'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { SeatingChartProps, TableWithGuests } from '@/types/wedding';

/**
 * SeatingChart Component
 * Renders an SVG-based seating chart matching the venue layout
 * Supports personalized highlighting and print-ready format
 */
export default function SeatingChart({
  tables,
  highlightedTable,
  showGuestNames = false,
  interactive = true,
  printMode = false,
}: SeatingChartProps) {
  const [hoveredTable, setHoveredTable] = React.useState<number | null>(null);

  // SVG viewBox dimensions (matching the hand-drawn layout)
  const viewBox = { width: 100, height: 120 };

  /**
   * Render a single table
   */
  const renderTable = (table: TableWithGuests) => {
    const isHighlighted = highlightedTable === table.table_number;
    const isHovered = hoveredTable === table.table_number;
    const isSpecial = table.is_special;

    // Position and size
    const x = table.position_x || 50;
    const y = table.position_y || 50;
    const radius = isSpecial ? 8 : 6;

    // Colors
    const fillColor = isHighlighted
      ? '#E8DCC4' // Warm gold for highlighted
      : isSpecial
        ? '#F8F6F3' // Cream for special tables
        : '#FFFFFF';

    const strokeColor = isHighlighted
      ? '#2C2C2C' // Dark charcoal for highlighted
      : isHovered
        ? '#4A4A4A' // Medium gray for hover
        : '#A8A8A8'; // Silver-gray default

    const strokeWidth = isHighlighted ? 2 : isHovered ? 1.5 : 1;

    return (
      <g
        key={table.id}
        onMouseEnter={() => interactive && setHoveredTable(table.table_number)}
        onMouseLeave={() => interactive && setHoveredTable(null)}
        style={{ cursor: interactive ? 'pointer' : 'default' }}
      >
        {/* Table circle */}
        <circle
          cx={x}
          cy={y}
          r={radius}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          className="transition-all duration-200"
        />

        {/* Table number */}
        <text
          x={x}
          y={y + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-playfair font-semibold"
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
            className="font-crimson text-xs"
            fontSize="3"
            fill="#4A4A4A"
          >
            {table.table_name}
          </text>
        )}

        {/* Guest names (for print/admin view) */}
        {showGuestNames && table.guests.length > 0 && (
          <g>
            {table.guests.map((guest, idx) => (
              <text
                key={idx}
                x={x + radius + 2}
                y={y - radius + (idx * 3)}
                className="font-crimson text-xs"
                fontSize="2.5"
                fill="#2C2C2C"
              >
                {guest.guest_name}
              </text>
            ))}
          </g>
        )}

        {/* Capacity indicator */}
        {!showGuestNames && (isHighlighted || isHovered) && (
          <text
            x={x}
            y={y + radius + 4}
            textAnchor="middle"
            className="font-crimson text-xs"
            fontSize="3"
            fill="#4A4A4A"
          >
            {table.assigned_guests}/{table.capacity}
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
      <g className="venue-elements">
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
          className="font-crimson text-xs"
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
          className="font-crimson text-xs"
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
          className="font-crimson text-xs"
          fontSize="2.5"
          fill="#4A4A4A"
        >
          Churrasqueira
        </text>
        <text
          x="87.5"
          y="67"
          textAnchor="middle"
          className="font-crimson text-xs"
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
          className="font-crimson text-xs"
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
          className="font-crimson text-xs"
          fontSize="2.5"
          fill="#4A4A4A"
        >
          Quarto
        </text>
        <text
          x="12.5"
          y="69"
          textAnchor="middle"
          className="font-crimson text-xs"
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
          className="font-crimson text-xs"
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
          className="font-crimson text-xs"
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
          className="font-crimson text-xs"
          fontSize="2"
          fill="#4A4A4A"
        >
          Mesa com cadeiras alugadas
        </text>
      </g>
    );
  };

  return (
    <div className={`seating-chart ${printMode ? 'print-mode' : ''}`}>
      {/* Header (only for non-print mode) */}
      {!printMode && (
        <div className="mb-6 text-center">
          <h2 className="font-playfair text-3xl text-charcoal mb-2">
            Mapa de Mesas
          </h2>
          <p className="font-crimson text-gray italic">
            {highlightedTable
              ? `Sua mesa: Mesa ${highlightedTable}`
              : 'Disposição das mesas no salão'}
          </p>
        </div>
      )}

      {/* SVG Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`relative w-full ${printMode ? 'h-[297mm]' : 'max-w-4xl mx-auto'}`}
      >
        <svg
          viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
          className="w-full h-full"
          style={{
            background: '#F8F6F3',
            border: printMode ? 'none' : '1px solid #A8A8A8',
            borderRadius: printMode ? '0' : '8px',
          }}
        >
          {/* Venue elements */}
          {renderVenueElements()}

          {/* Tables */}
          {tables.map(renderTable)}
        </svg>
      </motion.div>

      {/* Legend (only for interactive mode) */}
      {!printMode && interactive && (
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm font-crimson">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-white border-2 border-silver-gray" />
            <span className="text-gray">Mesa disponível</span>
          </div>
          {highlightedTable && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#E8DCC4] border-2 border-charcoal" />
              <span className="text-gray">Sua mesa</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-cream border border-silver-gray" />
            <span className="text-gray">Mesa especial</span>
          </div>
        </div>
      )}

      {/* Guest list for highlighted table */}
      {!printMode && highlightedTable && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 max-w-2xl mx-auto bg-white rounded-lg p-6 shadow-sm border border-silver-gray"
        >
          {(() => {
            const table = tables.find((t) => t.table_number === highlightedTable);
            if (!table) return null;

            return (
              <>
                <h3 className="font-playfair text-2xl text-charcoal mb-4 text-center">
                  {table.table_name || `Mesa ${table.table_number}`}
                </h3>
                <div className="space-y-2">
                  {table.guests.map((guest, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 border-b border-accent last:border-0"
                    >
                      <span className="font-crimson text-gray">
                        {guest.guest_name}
                        {guest.plus_one_name && (
                          <span className="text-sm italic ml-2">
                            (+ {guest.plus_one_name})
                          </span>
                        )}
                      </span>
                      {guest.rsvp_completed && (
                        <span className="text-xs text-green-600 font-semibold">
                          ✓ Confirmado
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
}
