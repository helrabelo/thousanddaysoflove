'use client'

import React from 'react'

export interface SeatingTableListPrintableGuest {
  id: string
  name: string
}

export interface SeatingTableListEntry {
  key: string
  tableNumber: number | null
  title: string
  subtitle?: string
  isSpecial?: boolean
  guests: SeatingTableListPrintableGuest[]
}

interface SeatingTableListPrintableProps {
  tables: SeatingTableListEntry[]
  totalGuests: number
}

const formatPeopleCount = (count: number) =>
  `${count} ${count === 1 ? 'pessoa' : 'pessoas'}`

export default function SeatingTableListPrintable({
  tables,
  totalGuests,
}: SeatingTableListPrintableProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[var(--decorative)] bg-[var(--background)] shadow-lg"
      style={{ width: '900px', minHeight: '1200px', padding: '72px 64px' }}
    >
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="table-list-dots" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.5" fill="var(--decorative)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#table-list-dots)" />
        </svg>
      </div>

      <div className="relative z-10">
        <header className="text-center mb-12">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-[var(--secondary-text)] mb-4">
            Casamento Hel & Ylana
          </p>
          <h1 className="font-heading text-4xl text-[var(--primary-text)] mb-3">
            Lista de Convidados por Mesa
          </h1>
          <p className="font-body text-base text-[var(--secondary-text)] italic">
            Verso auxiliar do mapa de mesas
          </p>
          <p className="font-body text-sm text-[var(--secondary-text)] mt-4">
            Total: {formatPeopleCount(totalGuests)} confirmadas ou pendentes
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tables.map((table) => (
            <article
              key={table.key}
              className="flex h-full flex-col rounded-xl border border-[var(--decorative)] bg-white/90 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-heading text-2xl text-[var(--primary-text)]">
                    {table.tableNumber ? `Mesa ${table.tableNumber}` : table.title}
                  </p>
                  {table.subtitle && (
                    <p className="font-body text-xs uppercase tracking-[0.2em] text-[var(--secondary-text)] mt-2">
                      {table.subtitle}
                    </p>
                  )}
                  {table.isSpecial && !table.subtitle && (
                    <p className="font-body text-xs uppercase tracking-[0.2em] text-[var(--secondary-text)] mt-2">
                      Mesa Especial
                    </p>
                  )}
                </div>
                <span className="rounded-full border border-[var(--decorative)] px-3 py-1 text-xs font-body uppercase tracking-[0.2em] text-[var(--secondary-text)]">
                  {formatPeopleCount(table.guests.length)}
                </span>
              </div>

              <ul className="mt-5 space-y-2">
                {table.guests.map((guest, index) => (
                  <li key={guest.id} className="flex items-baseline gap-3">
                    <span className="w-6 text-right text-xs font-body uppercase tracking-[0.2em] text-[var(--decorative)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-body text-base text-[var(--primary-text)]">
                      {guest.name}
                    </span>
                  </li>
                ))}
                {table.guests.length === 0 && (
                  <li className="font-body text-sm italic text-[var(--secondary-text)]">
                    Atribuir convidados para esta mesa
                  </li>
                )}
              </ul>
            </article>
          ))}
        </section>

        <footer className="mt-12 text-center text-xs font-body uppercase tracking-[0.3em] text-[var(--secondary-text)]">
          Atualizado automaticamente a partir do Supabase
        </footer>
      </div>
    </div>
  )
}
