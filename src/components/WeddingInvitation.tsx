import React from 'react'
import Link from 'next/link'

const WeddingInvitation: React.FC = () => {
  return (
    <section className="wedding-invitation-section">
      <div className="wedding-invitation botanical-frame">
        {/* Monogram H ♥ Y */}
        <div className="monogram-section wedding-monogram">
          H <span className="heart-symbol">♥</span> Y
        </div>

        {/* Nomes dos noivos */}
        <div className="names-section wedding-names">
          Hel & Ylana
        </div>

        {/* Texto do convite personalizado */}
        <div className="invitation-text wedding-body">
          <p>
            Depois de 1000 dias construindo nosso universo particular,<br />
            com Linda, Cacao, Olivia e Oliver completando nossa família,<br />
            em nossa casa própria que sempre foi nosso sonho,<br />
            chegou a hora de celebrar que o que temos entre nós<br />
            é muito maior do que qualquer um pode imaginar.
          </p>

          <p>
            Venham celebrar conosco na Casa HY,<br />
            onde a arte encontra o amor
          </p>
        </div>

        {/* Detalhes do evento */}
        <div className="event-details">
          <div className="ceremony-details">
            <h3>Quinta-feira, 20 de Novembro</h3>
            <p className="wedding-details">
              2025<br />
              10H30
            </p>
          </div>

          <div className="reception-details">
            <p className="wedding-body" style={{ fontSize: '1rem', marginTop: '1.5rem' }}>
              <strong>Rua:</strong> Coronel Francisco Flávio Carneiro 200<br />
              Luciano Cavalcante.<br />
              <br />
              <strong>Local:</strong> Casa HY<br />
              Onde a arte encontra o amor e nossos mil dias se tornam eternidade.
            </p>
          </div>
        </div>

        {/* Seção RSVP */}
        <div className="rsvp-section">
          <p className="wedding-body" style={{ marginBottom: '1.5rem' }}>
            Confirme sua presença através do nosso site
          </p>
          <Link href="/rsvp" className="rsvp-button">
            Confirmar Presença
          </Link>
        </div>
      </div>
    </section>
  )
}

export default WeddingInvitation