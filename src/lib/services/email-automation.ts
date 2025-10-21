// @ts-nocheck: automated email scheduler still depends on loosely typed Supabase metadata blobs
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Email Automation Service for Brazilian Wedding RSVP System
 *
 * Features:
 * 📧 Portuguese email templates
 * 🤖 Automated sequences (invitation → reminder → thank you)
 * 📊 Delivery tracking with SendGrid
 * 🇧🇷 Brazilian cultural context and formal addressing
 * ⏰ Smart timing based on Brazilian time zones
 * 📱 Mobile-optimized email design
 */

import { createClient } from '@/lib/supabase/client'
import { Guest } from '@/types/wedding'
import { getBrazilianWeddingGreeting } from '@/lib/utils/wedding'

interface EmailData {
  to: string
  subject: string
  html: string
  text: string
  templateId?: string
  templateData?: Record<string, any>
}

interface SendGridResponse {
  success: boolean
  messageId?: string
  error?: string
}

export class EmailAutomationService {

  // ====================
  // EMAIL TEMPLATES
  // ====================

  /**
   * Portuguese invitation email template
   */
  private static getInvitationTemplate(guest: Guest): EmailData {
    const timeOfDay = new Date().getHours() < 12 ? 'morning' :
                     new Date().getHours() < 18 ? 'afternoon' : 'evening'
    const greeting = getBrazilianWeddingGreeting(timeOfDay)

    const subject = `💕 Você está convidado(a) para nosso casamento! - Hel & Ylana`

    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Convite de Casamento - Hel & Ylana</title>
      <style>
        body {
          font-family: 'Georgia', serif;
          line-height: 1.6;
          color: #4a5568;
          background: linear-gradient(135deg, #f6e6f0 0%, #f0e6f6 100%);
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #d946ef 0%, #be185d 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .header .subtitle {
          margin: 10px 0 0 0;
          font-size: 16px;
          opacity: 0.9;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          color: #be185d;
          margin-bottom: 20px;
        }
        .wedding-details {
          background: #f9f5ff;
          border-radius: 15px;
          padding: 25px;
          margin: 25px 0;
          border-left: 4px solid #d946ef;
        }
        .wedding-details h3 {
          margin: 0 0 15px 0;
          color: #be185d;
          font-size: 20px;
        }
        .detail-item {
          display: flex;
          margin-bottom: 10px;
          align-items: center;
        }
        .detail-icon {
          width: 20px;
          margin-right: 10px;
          color: #d946ef;
        }
        .cta-section {
          text-align: center;
          margin: 30px 0;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #d946ef 0%, #be185d 100%);
          color: white;
          padding: 15px 40px;
          text-decoration: none;
          border-radius: 50px;
          font-weight: bold;
          font-size: 16px;
          box-shadow: 0 5px 15px rgba(217, 70, 239, 0.3);
          transition: transform 0.2s;
        }
        .cta-button:hover {
          transform: translateY(-2px);
        }
        .invitation-code {
          background: #f0f9ff;
          border: 2px dashed #0ea5e9;
          border-radius: 10px;
          padding: 15px;
          text-align: center;
          margin: 20px 0;
        }
        .invitation-code strong {
          font-size: 20px;
          color: #0369a1;
          font-family: 'Courier New', monospace;
        }
        .footer {
          background: #f8fafc;
          padding: 30px;
          text-align: center;
          color: #64748b;
          font-size: 14px;
        }
        .heart {
          color: #d946ef;
          font-size: 20px;
        }
        @media (max-width: 480px) {
          .container {
            margin: 10px;
            border-radius: 15px;
          }
          .header, .content {
            padding: 25px 20px;
          }
          .cta-button {
            padding: 12px 30px;
            font-size: 14px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💕 Mil Dias de Amor</h1>
          <p class="subtitle">Hel & Ylana • 20 de Novembro de 2025</p>
        </div>

        <div class="content">
          <p class="greeting">${greeting}, ${guest.name}!</p>

          <p>Com grande alegria no coração, convidamos você para celebrar conosco um momento muito especial: nosso casamento!</p>

          <p>Após <strong>mil dias de amor</strong>, chegou a hora de unirmos nossas vidas oficialmente. E queremos que você, pessoa especial em nossas vidas, esteja presente neste dia único.</p>

          <div class="wedding-details">
            <h3>📅 Detalhes do Casamento</h3>
            <div class="detail-item">
              <span class="detail-icon">🗓️</span>
              <strong>Data:</strong> 20 de Novembro de 2025 (Segunda-feira)
            </div>
            <div class="detail-item">
              <span class="detail-icon">⏰</span>
              <strong>Horário:</strong> Cerimônia às 10:30h | Recepção às 11:30h
            </div>
            <div class="detail-item">
              <span class="detail-icon">📍</span>
              <strong>Local:</strong> Em breve enviaremos o endereço completo
            </div>
            <div class="detail-item">
              <span class="detail-icon">👗</span>
              <strong>Traje:</strong> Social
            </div>
          </div>

          <div class="cta-section">
            <p><strong>Por favor, confirme sua presença até o dia 1º de Novembro de 2025</strong></p>
            <a href="https://thousandaysof.love/rsvp?code=${guest.invitation_code}" class="cta-button">
              ✨ Confirmar Presença
            </a>
          </div>

          <div class="invitation-code">
            <p>Seu código de convite é:</p>
            <strong>${guest.invitation_code}</strong>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #64748b;">
              Use este código para confirmar sua presença rapidamente
            </p>
          </div>

          <p>Mal podemos esperar para celebrar este momento especial com você! Se tiver qualquer dúvida, não hesite em nos contactar.</p>

          <p>Com muito amor e expectativa,</p>
          <p><strong>Hel & Ylana</strong> <span class="heart">💕</span></p>
        </div>

        <div class="footer">
          <p>Este convite foi criado especialmente para você com muito carinho.</p>
          <p>Casamento Hel & Ylana • 20 de Novembro de 2025</p>
          <p><a href="https://thousandaysof.love" style="color: #d946ef;">thousandaysof.love</a></p>
        </div>
      </div>
    </body>
    </html>
    `

    const text = `
${greeting}, ${guest.name}!

Você está convidado(a) para o casamento de Hel & Ylana!

DETALHES DO CASAMENTO:
📅 Data: 20 de Novembro de 2025
⏰ Horário: 10:30h (Cerimônia) | 11:30h (Recepção)
📍 Local: Em breve
👗 Traje: Social

CONFIRME SUA PRESENÇA:
https://thousandaysof.love/rsvp?code=${guest.invitation_code}

Código do convite: ${guest.invitation_code}

Prazo para confirmação: 1º de Novembro de 2025

Com amor,
Hel & Ylana 💕
    `

    return {
      to: guest.email,
      subject,
      html,
      text
    }
  }

  /**
   * Portuguese RSVP confirmation email template
   */
  private static getConfirmationTemplate(guest: Guest): EmailData {
    const subject = guest.attending
      ? `🎉 RSVP Confirmado! Mal podemos esperar para celebrar com você!`
      : `💙 Obrigado pela resposta - sentiremos sua falta!`

    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmação de RSVP - Hel & Ylana</title>
      <style>
        body {
          font-family: 'Georgia', serif;
          line-height: 1.6;
          color: #4a5568;
          background: linear-gradient(135deg, ${guest.attending ? '#f0fdf4' : '#fef2f2'} 0%, ${guest.attending ? '#ecfccb' : '#fee2e2'} 100%);
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, ${guest.attending ? '#16a34a' : '#dc2626'} 0%, ${guest.attending ? '#15803d' : '#b91c1c'} 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .content {
          padding: 40px 30px;
        }
        .status-icon {
          font-size: 48px;
          text-align: center;
          margin: 20px 0;
        }
        .info-box {
          background: ${guest.attending ? '#f0fdf4' : '#fef2f2'};
          border-radius: 15px;
          padding: 25px;
          margin: 25px 0;
          border-left: 4px solid ${guest.attending ? '#16a34a' : '#dc2626'};
        }
        .next-steps {
          background: #f8fafc;
          border-radius: 15px;
          padding: 25px;
          margin: 25px 0;
        }
        .next-steps h3 {
          color: #334155;
          margin-top: 0;
        }
        .next-steps ul {
          padding-left: 20px;
        }
        .next-steps li {
          margin-bottom: 8px;
        }
        .gift-cta {
          text-align: center;
          margin: 30px 0;
        }
        .gift-button {
          display: inline-block;
          background: linear-gradient(135deg, #d946ef 0%, #be185d 100%);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 50px;
          font-weight: bold;
          margin: 0 10px;
        }
        .footer {
          background: #f8fafc;
          padding: 30px;
          text-align: center;
          color: #64748b;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${guest.attending ? '🎉 RSVP Confirmado!' : '💙 Obrigado pela Resposta'}</h1>
          <p>Hel & Ylana • 20 de Novembro de 2025</p>
        </div>

        <div class="content">
          <div class="status-icon">
            ${guest.attending ? '✅' : '😔'}
          </div>

          ${guest.attending ? `
            <h2>Que alegria, ${guest.name}!</h2>
            <p>Recebemos sua confirmação de presença e estamos radiantes! Não vemos a hora de celebrar este momento especial com você.</p>

            ${guest.plus_one ? `
              <div class="info-box">
                <h3>👫 Acompanhante Confirmado</h3>
                <p>Também estamos ansiosos para conhecer <strong>${guest.plus_one_name}</strong>!</p>
              </div>
            ` : ''}

            ${guest.dietary_restrictions ? `
              <div class="info-box">
                <h3>🍽️ Restrições Alimentares</h3>
                <p>Anotamos suas restrições alimentares: <em>${guest.dietary_restrictions}</em></p>
                <p>Faremos questão de ter opções deliciosas para você!</p>
              </div>
            ` : ''}

            <div class="next-steps">
              <h3>📋 Próximos Passos</h3>
              <ul>
                <li>✉️ Você receberá mais detalhes sobre o local nas próximas semanas</li>
                <li>📍 O endereço completo será enviado até 1º de Novembro</li>
                <li>📱 Salve a data: <strong>20 de Novembro de 2025, às 10:30h</strong></li>
                <li>👗 Lembre-se: o traje é social</li>
                <li>🎁 Se desejar, confira nossa lista de presentes</li>
              </ul>
            </div>

            <div class="gift-cta">
              <p>Se quiser nos presentear, preparamos uma lista especial:</p>
              <a href="https://thousandaysof.love/presentes" class="gift-button">🎁 Ver Lista de Presentes</a>
            </div>
          ` : `
            <h2>Entendemos, ${guest.name}</h2>
            <p>Obrigado por nos informar que não poderá estar presente. Embora sentiremos sua falta, compreendemos completamente.</p>

            <div class="info-box">
              <h3>💕 Você Estará em Nossos Corações</h3>
              <p>Mesmo não podendo celebrar fisicamente conosco, saiba que você é uma pessoa especial em nossas vidas e estará em nossos pensamentos neste dia tão importante.</p>
            </div>

            ${guest.special_requests ? `
              <div class="info-box">
                <h3>💌 Sua Mensagem</h3>
                <p><em>"${guest.special_requests}"</em></p>
                <p>Muito obrigado pelas palavras carinhosas!</p>
              </div>
            ` : ''}

            <p>Se mudar de ideia, você sempre pode atualizar sua resposta usando o código <strong>${guest.invitation_code}</strong> em nosso site.</p>
          `}

          <p>Se tiver qualquer dúvida ou precisar alterar algo, não hesite em nos contactar.</p>

          <p>Com muito amor e gratidão,</p>
          <p><strong>Hel & Ylana</strong> 💕</p>
        </div>

        <div class="footer">
          <p>Código do seu convite: <strong>${guest.invitation_code}</strong></p>
          <p><a href="https://thousandaysof.love/rsvp?code=${guest.invitation_code}">Alterar resposta</a></p>
          <p>Casamento Hel & Ylana • 20 de Novembro de 2025</p>
        </div>
      </div>
    </body>
    </html>
    `

    const text = `
${guest.attending ? '🎉 RSVP CONFIRMADO!' : '💙 OBRIGADO PELA RESPOSTA'}

${guest.attending ? `
Que alegria, ${guest.name}!

Sua presença está confirmada para nosso casamento em 20 de Novembro de 2025, às 10:30h.

${guest.plus_one ? `Acompanhante: ${guest.plus_one_name}` : ''}
${guest.dietary_restrictions ? `Restrições alimentares: ${guest.dietary_restrictions}` : ''}

PRÓXIMOS PASSOS:
- Detalhes do local serão enviados até 1º de Novembro
- Traje: Social
- Lista de presentes: https://thousandaysof.love/presentes
` : `
Entendemos, ${guest.name}.

Obrigado por nos informar que não poderá estar presente. Sentiremos sua falta, mas você estará em nossos corações.

${guest.special_requests ? `Sua mensagem: "${guest.special_requests}"` : ''}
`}

Código do convite: ${guest.invitation_code}
Alterar resposta: https://thousandaysof.love/rsvp?code=${guest.invitation_code}

Com amor,
Hel & Ylana 💕
    `

    return {
      to: guest.email,
      subject,
      html,
      text
    }
  }

  /**
   * Portuguese reminder email template
   */
  private static getReminderTemplate(guest: Guest, reminderCount: number = 1): EmailData {
    const timeOfDay = new Date().getHours() < 12 ? 'morning' :
                     new Date().getHours() < 18 ? 'afternoon' : 'evening'
    const greeting = getBrazilianWeddingGreeting(timeOfDay)

    const urgencyLevel = reminderCount === 1 ? 'gentle' : reminderCount === 2 ? 'moderate' : 'urgent'

    const subject = urgencyLevel === 'urgent'
      ? `⏰ ÚLTIMO LEMBRETE: Confirme sua presença - Casamento Hel & Ylana`
      : `💕 Lembrete carinhoso: Confirme sua presença no nosso casamento`

    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lembrete RSVP - Hel & Ylana</title>
      <style>
        body {
          font-family: 'Georgia', serif;
          line-height: 1.6;
          color: #4a5568;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .urgency-banner {
          background: ${urgencyLevel === 'urgent' ? '#dc2626' : urgencyLevel === 'moderate' ? '#ea580c' : '#059669'};
          color: white;
          padding: 15px;
          text-align: center;
          font-weight: bold;
        }
        .content {
          padding: 40px 30px;
        }
        .countdown {
          background: #fef3c7;
          border-radius: 15px;
          padding: 25px;
          text-align: center;
          margin: 25px 0;
          border-left: 4px solid #f59e0b;
        }
        .countdown h3 {
          color: #92400e;
          margin-top: 0;
        }
        .days-left {
          font-size: 36px;
          font-weight: bold;
          color: #d97706;
          margin: 10px 0;
        }
        .cta-section {
          text-align: center;
          margin: 30px 0;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 18px 45px;
          text-decoration: none;
          border-radius: 50px;
          font-weight: bold;
          font-size: 18px;
          box-shadow: 0 5px 15px rgba(245, 158, 11, 0.4);
        }
        .footer {
          background: #f8fafc;
          padding: 30px;
          text-align: center;
          color: #64748b;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        ${urgencyLevel !== 'gentle' ? `
          <div class="urgency-banner">
            ${urgencyLevel === 'urgent' ? '⏰ ÚLTIMO LEMBRETE - Prazo para RSVP termina em breve!' : '⚠️ Lembrete importante - Por favor, confirme sua presença'}
          </div>
        ` : ''}

        <div class="header">
          <h1>💕 ${reminderCount === 1 ? 'Lembrete Carinhoso' : reminderCount === 2 ? 'Segundo Lembrete' : 'Último Lembrete'}</h1>
          <p>Casamento Hel & Ylana</p>
        </div>

        <div class="content">
          <p class="greeting">${greeting}, ${guest.name}!</p>

          <p>${reminderCount === 1 ?
            'Esperamos que você esteja bem! Este é um lembrete carinhoso sobre nosso casamento.' :
            reminderCount === 2 ?
            'Ainda não recebemos sua confirmação de presença e ficamos preocupados se nosso convite chegou até você.' :
            'Este é nosso último lembrete antes do prazo final para confirmação de presença.'
          }</p>

          <div class="countdown">
            <h3>⏰ Tempo Restante para RSVP</h3>
            <div class="days-left">${Math.max(0, Math.ceil((new Date('2025-11-01').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}</div>
            <p>dias até o prazo final (1º de Novembro)</p>
          </div>

          <p><strong>Detalhes do nosso casamento:</strong></p>
          <ul>
            <li>📅 <strong>Data:</strong> 20 de Novembro de 2025</li>
            <li>⏰ <strong>Horário:</strong> 10:30h (Cerimônia)</li>
            <li>📍 <strong>Local:</strong> Será enviado após confirmação</li>
            <li>👗 <strong>Traje:</strong> Social</li>
          </ul>

          <p>${urgencyLevel === 'urgent' ?
            'Por favor, confirme sua presença hoje mesmo! Precisamos finalizar os preparativos e sua resposta é muito importante para nós.' :
            'Sua presença é muito importante para nós! Por favor, reserve alguns minutinhos para confirmar.'
          }</p>

          <div class="cta-section">
            <a href="https://thousandaysof.love/rsvp?code=${guest.invitation_code}" class="cta-button">
              ${urgencyLevel === 'urgent' ? '⚡ CONFIRMAR AGORA' : '✨ Confirmar Presença'}
            </a>
          </div>

          <p>Se tiver qualquer problema com o link acima, use seu código de convite <strong>${guest.invitation_code}</strong> em nosso site: <a href="https://thousandaysof.love">thousandaysof.love</a></p>

          <p>Com amor e expectativa,</p>
          <p><strong>Hel & Ylana</strong> 💕</p>
        </div>

        <div class="footer">
          <p>Este é o ${reminderCount}º lembrete enviado para ${guest.email}</p>
          <p>Código do convite: <strong>${guest.invitation_code}</strong></p>
          <p>Casamento Hel & Ylana • 20 de Novembro de 2025</p>
        </div>
      </div>
    </body>
    </html>
    `

    const text = `
${greeting}, ${guest.name}!

${reminderCount === 1 ? 'LEMBRETE CARINHOSO' : reminderCount === 2 ? '2º LEMBRETE' : 'ÚLTIMO LEMBRETE'}

Ainda não recebemos sua confirmação de presença para nosso casamento.

DETALHES:
📅 Data: 20 de Novembro de 2025
⏰ Horário: 10:30h
📍 Local: Será enviado após confirmação
👗 Traje: Social

⏰ PRAZO PARA RSVP: 1º de Novembro de 2025
(${Math.max(0, Math.ceil((new Date('2025-11-01').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} dias restantes)

CONFIRME SUA PRESENÇA:
https://thousandaysof.love/rsvp?code=${guest.invitation_code}

Código: ${guest.invitation_code}

${urgencyLevel === 'urgent' ? 'POR FAVOR, CONFIRME HOJE MESMO!' : 'Sua presença é muito importante para nós!'}

Com amor,
Hel & Ylana 💕
    `

    return {
      to: guest.email,
      subject,
      html,
      text
    }
  }

  // ====================
  // EMAIL SENDING
  // ====================

  /**
   * Send email using SendGrid (placeholder for actual integration)
   */
  private static async sendEmailViaSendGrid(emailData: EmailData): Promise<SendGridResponse> {
    try {
      // TODO: Integrate with actual SendGrid API
      if (process.env.NODE_ENV === 'development') {
        console.log('Would send email via SendGrid:', {
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html.substring(0, 100) + '...'
        })
      }

      // Simulate successful send
      return {
        success: true,
        messageId: `sg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    } catch (error) {
      console.error('SendGrid error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown SendGrid error'
      }
    }
  }

  /**
   * Log email activity to database
   */
  private static async logEmailActivity(
    guestId: string,
    emailType: 'invitation' | 'reminder' | 'confirmation' | 'thank_you',
    subject: string,
    deliveryStatus: 'sent' | 'delivered' | 'bounced' | 'failed',
    messageId?: string,
    errorMessage?: string
  ): Promise<void> {
    try {
      const supabase = createClient()

      await supabase
        .from('email_logs')
        .insert({
          guest_id: guestId,
          email_type: emailType,
          subject: subject,
          sent_date: new Date().toISOString(),
          delivery_status: deliveryStatus,
          sendgrid_message_id: messageId,
          error_message: errorMessage,
          metadata: {
            timestamp: new Date().toISOString(),
            brazilian_timezone: 'America/Sao_Paulo'
          }
        })
    } catch (error) {
      console.error('Error logging email activity:', error)
    }
  }

  // ====================
  // PUBLIC METHODS
  // ====================

  /**
   * Send invitation email
   */
  static async sendInvitationEmail(guest: Guest): Promise<boolean> {
    try {
      const emailData = this.getInvitationTemplate(guest)
      const result = await this.sendEmailViaSendGrid(emailData)

      await this.logEmailActivity(
        guest.id,
        'invitation',
        emailData.subject,
        result.success ? 'sent' : 'failed',
        result.messageId,
        result.error
      )

      // Update guest invitation sent date
      if (result.success) {
        const supabase = createClient()
        await supabase
          .from('guests')
          .update({
            invitation_sent_date: new Date().toISOString(),
            email_delivery_status: 'sent'
          })
          .eq('id', guest.id)
      }

      return result.success
    } catch (error) {
      console.error('Error sending invitation email:', error)
      return false
    }
  }

  /**
   * Send RSVP confirmation email
   */
  static async sendConfirmationEmail(guest: Guest): Promise<boolean> {
    try {
      const emailData = this.getConfirmationTemplate(guest)
      const result = await this.sendEmailViaSendGrid(emailData)

      await this.logEmailActivity(
        guest.id,
        'confirmation',
        emailData.subject,
        result.success ? 'sent' : 'failed',
        result.messageId,
        result.error
      )

      return result.success
    } catch (error) {
      console.error('Error sending confirmation email:', error)
      return false
    }
  }

  /**
   * Send reminder email
   */
  static async sendReminderEmail(guest: Guest, reminderCount: number = 1): Promise<boolean> {
    try {
      const emailData = this.getReminderTemplate(guest, reminderCount)
      const result = await this.sendEmailViaSendGrid(emailData)

      await this.logEmailActivity(
        guest.id,
        'reminder',
        emailData.subject,
        result.success ? 'sent' : 'failed',
        result.messageId,
        result.error
      )

      // Update guest reminder count and last email date
      if (result.success) {
        const supabase = createClient()
        await supabase
          .from('guests')
          .update({
            rsvp_reminder_count: reminderCount,
            last_email_sent_date: new Date().toISOString()
          })
          .eq('id', guest.id)
      }

      return result.success
    } catch (error) {
      console.error('Error sending reminder email:', error)
      return false
    }
  }

  /**
   * Send bulk reminder emails
   */
  static async sendBulkReminders(): Promise<{ sent: number; failed: number }> {
    try {
      const supabase = createClient()

      // Get guests needing reminders
      const { data: guests, error } = await supabase
        .from('guests')
        .select('*')
        .is('attending', null)
        .lt('rsvp_reminder_count', 3)

      if (error || !guests) {
        return { sent: 0, failed: 0 }
      }

      let sent = 0
      let failed = 0

      for (const guest of guests) {
        const success = await this.sendReminderEmail(guest, guest.rsvp_reminder_count + 1)
        if (success) {
          sent++
        } else {
          failed++
        }

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      return { sent, failed }
    } catch (error) {
      console.error('Error sending bulk reminders:', error)
      return { sent: 0, failed: 0 }
    }
  }

  /**
   * Get email analytics
   */
  static async getEmailAnalytics(days: number = 30): Promise<any> {
    try {
      const supabase = createClient()
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .gte('sent_date', cutoffDate.toISOString())

      if (error || !data) return null

      const analytics = {
        totalEmails: data.length,
        emailTypes: {} as Record<string, number>,
        deliveryStatus: {} as Record<string, number>,
        dailyVolume: {} as Record<string, number>
      }

      data.forEach((email: any) => {
        // Count by type
        analytics.emailTypes[email.email_type] = (analytics.emailTypes[email.email_type] || 0) + 1

        // Count by delivery status
        analytics.deliveryStatus[email.delivery_status] = (analytics.deliveryStatus[email.delivery_status] || 0) + 1

        // Count by day
        const day = email.sent_date.split('T')[0]
        analytics.dailyVolume[day] = (analytics.dailyVolume[day] || 0) + 1
      })

      return analytics
    } catch (error) {
      console.error('Error getting email analytics:', error)
      return null
    }
  }
}

export default EmailAutomationService
