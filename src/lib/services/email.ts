import sgMail from '@sendgrid/mail'

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export class EmailService {
  // Send RSVP confirmation email
  static async sendRsvpConfirmation(data: {
    guestEmail: string
    guestName: string
    attending: boolean
    invitationCode: string
  }) {
    try {
      const templateId = process.env.SENDGRID_RSVP_CONFIRMATION_TEMPLATE_ID

      const msg = {
        to: data.guestEmail,
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || 'noreply@thousanddaysoflove.com',
          name: process.env.SENDGRID_FROM_NAME || 'Hel & Ylana - Mil Dias de Amor'
        },
        templateId: templateId || 'd-default-rsvp-template',
        dynamicTemplateData: {
          guest_name: data.guestName,
          attending: data.attending,
          attending_text: data.attending ? 'Confirmada' : 'Não Confirmada',
          invitation_code: data.invitationCode,
          wedding_date: '20 de Novembro de 2025',
          wedding_time: '10:30h',
          venue_name: 'Casa HY, Fortaleza',
          couple_names: 'Hel & Ylana',
          website_url: process.env.NEXT_PUBLIC_SITE_URL || 'https://thousanddaysoflove.com'
        }
      }

      // If no template ID is set, send a simple HTML email
      if (!templateId) {
        const htmlContent = this.generateRsvpConfirmationHtml(data)
        Object.assign(msg, {
          subject: `Confirmação de RSVP - Casamento Hel & Ylana`,
          html: htmlContent
        })
        delete msg.templateId
        delete msg.dynamicTemplateData
      }

      const result = await sgMail.send(msg)
      return { success: true, messageId: result[0].headers['x-message-id'] }

    } catch (error) {
      console.error('Error sending RSVP confirmation email:', error)
      throw error
    }
  }

  // Send payment confirmation email
  static async sendPaymentConfirmation(data: {
    paymentId: string
    giftName: string
    amount: number
    buyerName: string
    buyerEmail: string
  }) {
    try {
      const templateId = process.env.SENDGRID_PAYMENT_CONFIRMATION_TEMPLATE_ID

      const msg = {
        to: data.buyerEmail,
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || 'noreply@thousanddaysoflove.com',
          name: process.env.SENDGRID_FROM_NAME || 'Hel & Ylana - Mil Dias de Amor'
        },
        templateId: templateId || 'd-default-payment-template',
        dynamicTemplateData: {
          buyer_name: data.buyerName,
          gift_name: data.giftName,
          amount: this.formatBRL(data.amount),
          payment_id: data.paymentId,
          wedding_date: '20 de Novembro de 2025',
          couple_names: 'Hel & Ylana',
          website_url: process.env.NEXT_PUBLIC_SITE_URL || 'https://thousanddaysoflove.com'
        }
      }

      // If no template ID is set, send a simple HTML email
      if (!templateId) {
        const htmlContent = this.generatePaymentConfirmationHtml(data)
        Object.assign(msg, {
          subject: `Pagamento Confirmado - Presente para Hel & Ylana`,
          html: htmlContent
        })
        delete msg.templateId
        delete msg.dynamicTemplateData
      }

      const result = await sgMail.send(msg)

      // Also send notification to the couple
      await this.sendPaymentNotificationToCouple(data)

      return { success: true, messageId: result[0].headers['x-message-id'] }

    } catch (error) {
      console.error('Error sending payment confirmation email:', error)
      throw error
    }
  }

  // Send payment notification to the couple
  static async sendPaymentNotificationToCouple(data: {
    paymentId: string
    giftName: string
    amount: number
    buyerName: string
    buyerEmail: string
  }) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'hel@thousanddaysoflove.com'

      const msg = {
        to: adminEmail,
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || 'noreply@thousanddaysoflove.com',
          name: process.env.SENDGRID_FROM_NAME || 'Hel & Ylana - Mil Dias de Amor'
        },
        subject: `🎁 Novo Presente Recebido - ${data.giftName}`,
        html: this.generateCoupleNotificationHtml(data)
      }

      const result = await sgMail.send(msg)
      return { success: true, messageId: result[0].headers['x-message-id'] }

    } catch (error) {
      console.error('Error sending couple notification email:', error)
      // Don't throw error here as this is a secondary notification
      return { success: false, error: error.message }
    }
  }

  // Send RSVP reminder email
  static async sendRsvpReminder(data: {
    guestEmail: string
    guestName: string
    invitationCode: string
    daysUntilDeadline: number
  }) {
    try {
      const templateId = process.env.SENDGRID_RSVP_REMINDER_TEMPLATE_ID

      const msg = {
        to: data.guestEmail,
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || 'noreply@thousanddaysoflove.com',
          name: process.env.SENDGRID_FROM_NAME || 'Hel & Ylana - Mil Dias de Amor'
        },
        templateId: templateId || 'd-default-reminder-template',
        dynamicTemplateData: {
          guest_name: data.guestName,
          invitation_code: data.invitationCode,
          days_until_deadline: data.daysUntilDeadline,
          rsvp_deadline: '01 de Novembro de 2025',
          wedding_date: '20 de Novembro de 2025',
          couple_names: 'Hel & Ylana',
          rsvp_url: `${process.env.NEXT_PUBLIC_SITE_URL}/rsvp?code=${data.invitationCode}`,
          website_url: process.env.NEXT_PUBLIC_SITE_URL || 'https://thousanddaysoflove.com'
        }
      }

      // If no template ID is set, send a simple HTML email
      if (!templateId) {
        const htmlContent = this.generateRsvpReminderHtml(data)
        Object.assign(msg, {
          subject: `Lembrete RSVP - Casamento Hel & Ylana em ${data.daysUntilDeadline} dias`,
          html: htmlContent
        })
        delete msg.templateId
        delete msg.dynamicTemplateData
      }

      const result = await sgMail.send(msg)
      return { success: true, messageId: result[0].headers['x-message-id'] }

    } catch (error) {
      console.error('Error sending RSVP reminder email:', error)
      throw error
    }
  }

  // Generate HTML for RSVP confirmation (fallback when no template)
  static generateRsvpConfirmationHtml(data: {
    guestName: string
    attending: boolean
    invitationCode: string
  }): string {
    const attendingStatus = data.attending ? 'CONFIRMADA' : 'NÃO CONFIRMADA'
    const statusColor = data.attending ? '#10B981' : '#EF4444'

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmação RSVP - Hel & Ylana</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #F8F6F3 0%, #E8E6E3 100%);">
        <div style="max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #6B6B6B 0%, #4A4A4A 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Mil Dias de Amor</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Hel & Ylana</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1F2937; margin: 0 0 20px 0; font-size: 24px;">Olá, ${data.guestName}!</h2>

            <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Recebemos sua confirmação de presença para nosso casamento. Aqui estão os detalhes:
            </p>

            <!-- Status Card -->
            <div style="background: #F9FAFB; border-left: 4px solid ${statusColor}; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
              <h3 style="color: ${statusColor}; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">
                Presença: ${attendingStatus}
              </h3>
              <p style="color: #6B7280; margin: 0; font-size: 14px;">
                Código do convite: <strong>${data.invitationCode}</strong>
              </p>
            </div>

            <!-- Wedding Details -->
            <div style="background: linear-gradient(135deg, #FEF3C7 0%, #E0DDD8 100%); padding: 25px; border-radius: 12px; margin-bottom: 30px;">
              <h3 style="color: #1F2937; margin: 0 0 15px 0; font-size: 18px;">Detalhes do Casamento</h3>
              <p style="color: #374151; margin: 5px 0; font-size: 14px;">
                <strong>Data:</strong> 20 de Novembro de 2025
              </p>
              <p style="color: #374151; margin: 5px 0; font-size: 14px;">
                <strong>Horário da Cerimônia:</strong> 10:30h
              </p>
              <p style="color: #374151; margin: 5px 0; font-size: 14px;">
                <strong>Horário da Recepção:</strong> 11:30h
              </p>
            </div>

            ${data.attending ? `
              <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Estamos muito felizes em saber que você estará conosco neste dia especial! ❤️
              </p>

              <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">
                Não se esqueça de conferir nossa <a href="${process.env.NEXT_PUBLIC_SITE_URL}/presentes" style="color: #4A4A4A; text-decoration: none;">lista de presentes</a> se desejar nos presentear.
              </p>
            ` : `
              <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">
                Sentiremos sua falta, mas compreendemos. Obrigado por nos avisar! ❤️
              </p>
            `}
          </div>

          <!-- Footer -->
          <div style="background: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; margin: 0; font-size: 14px;">
              Com amor,<br>
              <strong style="color: #4A4A4A;">Hel & Ylana</strong>
            </p>
            <p style="color: #9CA3AF; margin: 15px 0 0 0; font-size: 12px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #4A4A4A; text-decoration: none;">thousanddaysoflove.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // Generate HTML for payment confirmation (fallback when no template)
  static generatePaymentConfirmationHtml(data: {
    paymentId: string
    giftName: string
    amount: number
    buyerName: string
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pagamento Confirmado - Hel & Ylana</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #F8F6F3 0%, #E8E6E3 100%);">
        <div style="max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #10B981 0%, #4A4A4A 100%); padding: 40px 30px; text-align: center;">
            <div style="background: white; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="color: #10B981; font-size: 30px;">✓</span>
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Pagamento Confirmado!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Obrigado pelo presente ❤️</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1F2937; margin: 0 0 20px 0; font-size: 24px;">Olá, ${data.buyerName}!</h2>

            <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Seu pagamento foi processado com sucesso! Estamos muito gratos pelo seu presente.
            </p>

            <!-- Payment Details -->
            <div style="background: linear-gradient(135deg, #ECFDF5 0%, #E8E6E3 100%); padding: 25px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #D1FAE5;">
              <h3 style="color: #1F2937; margin: 0 0 15px 0; font-size: 18px;">Detalhes do Pagamento</h3>
              <p style="color: #374151; margin: 5px 0; font-size: 14px;">
                <strong>Presente:</strong> ${data.giftName}
              </p>
              <p style="color: #374151; margin: 5px 0; font-size: 14px;">
                <strong>Valor:</strong> ${this.formatBRL(data.amount)}
              </p>
              <p style="color: #374151; margin: 5px 0; font-size: 14px;">
                <strong>ID do Pagamento:</strong> ${data.paymentId}
              </p>
              <p style="color: #374151; margin: 5px 0; font-size: 14px;">
                <strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div style="background: linear-gradient(135deg, #FEF3C7 0%, #E0DDD8 100%); padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
              <h3 style="color: #1F2937; margin: 0 0 15px 0; font-size: 18px;">💕 Hel & Ylana 💕</h3>
              <p style="color: #374151; margin: 0; font-size: 16px; font-style: italic;">
                "Sua generosidade torna nosso dia ainda mais especial. Muito obrigado por fazer parte da nossa história de amor!"
              </p>
            </div>

            <p style="color: #4B5563; font-size: 16px; line-height: 1.6; text-align: center;">
              Nos vemos no grande dia:<br>
              <strong style="color: #4A4A4A;">20 de Novembro de 2025</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; margin: 0; font-size: 14px;">
              Com muito amor e gratidão,<br>
              <strong style="color: #4A4A4A;">Hel & Ylana</strong>
            </p>
            <p style="color: #9CA3AF; margin: 15px 0 0 0; font-size: 12px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #4A4A4A; text-decoration: none;">thousanddaysoflove.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // Generate HTML for couple notification
  static generateCoupleNotificationHtml(data: {
    paymentId: string
    giftName: string
    amount: number
    buyerName: string
    buyerEmail: string
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Novo Presente Recebido - ${data.giftName}</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #F9FAFB;">
        <div style="max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #F59E0B 0%, #4A4A4A 100%); padding: 30px; text-align: center;">
            <div style="background: white; width: 50px; height: 50px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
              <span style="color: #F59E0B; font-size: 24px;">🎁</span>
            </div>
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Novo Presente Recebido!</h1>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            <h2 style="color: #1F2937; margin: 0 0 20px 0; font-size: 20px;">Parabéns! 🎉</h2>

            <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Vocês acabaram de receber um novo presente! Aqui estão os detalhes:
            </p>

            <!-- Gift Details -->
            <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; border: 1px solid #BBF7D0; margin-bottom: 25px;">
              <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 18px;">Detalhes do Presente</h3>
              <p style="color: #374151; margin: 5px 0; font-size: 14px;">
                <strong>Presente:</strong> ${data.giftName}
              </p>
              <p style="color: #374151; margin: 5px 0; font-size: 14px;">
                <strong>Valor:</strong> ${this.formatBRL(data.amount)}
              </p>
              <p style="color: #374151; margin: 5px 0; font-size: 14px;">
                <strong>Comprador:</strong> ${data.buyerName}
              </p>
              <p style="color: #374151; margin: 5px 0; font-size: 14px;">
                <strong>E-mail:</strong> ${data.buyerEmail}
              </p>
              <p style="color: #374151; margin: 5px 0; font-size: 14px;">
                <strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; text-align: center;">
              <p style="color: #92400E; margin: 0; font-size: 14px; font-weight: 500;">
                💝 Não se esqueçam de enviar um agradecimento especial para ${data.buyerName}!
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; margin: 0; font-size: 12px;">
              Sistema automático - <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" style="color: #4A4A4A; text-decoration: none;">Ver Dashboard</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // Generate HTML for RSVP reminder (fallback when no template)
  static generateRsvpReminderHtml(data: {
    guestName: string
    invitationCode: string
    daysUntilDeadline: number
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lembrete RSVP - Hel & Ylana</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #F8F6F3 0%, #E8E6E3 100%);">
        <div style="max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #F59E0B 0%, #6B6B6B 100%); padding: 40px 30px; text-align: center;">
            <div style="background: white; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="color: #F59E0B; font-size: 30px;">⏰</span>
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Lembrete RSVP</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Faltam ${data.daysUntilDeadline} dias!</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1F2937; margin: 0 0 20px 0; font-size: 24px;">Olá, ${data.guestName}!</h2>

            <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Ainda não recebemos sua confirmação de presença para nosso casamento.
              ${data.daysUntilDeadline <= 5 ? 'Por favor, confirme sua presença o quanto antes!' : 'Gostaríamos muito de saber se você estará conosco!'}
            </p>

            <!-- Countdown -->
            <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FECACA 100%); padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 30px; border: 2px solid #F59E0B;">
              <h3 style="color: #92400E; margin: 0 0 10px 0; font-size: 24px; font-weight: 700;">
                ${data.daysUntilDeadline} ${data.daysUntilDeadline === 1 ? 'dia' : 'dias'}
              </h3>
              <p style="color: #92400E; margin: 0; font-size: 16px;">
                até o prazo de confirmação (01/11/2025)
              </p>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/rsvp?code=${data.invitationCode}"
                 style="display: inline-block; background: linear-gradient(135deg, #6B6B6B 0%, #4A4A4A 100%); color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                Confirmar Presença Agora
              </a>
            </div>

            <!-- Wedding Details -->}
            <div style="background: linear-gradient(135deg, #F0F9FF 0%, #E8E6E3 100%); padding: 25px; border-radius: 12px; margin-bottom: 20px;">
              <h3 style="color: #1F2937; margin: 0 0 15px 0; font-size: 18px; text-align: center;">💒 Nosso Grande Dia</h3>
              <p style="color: #374151; margin: 5px 0; font-size: 14px; text-align: center;">
                <strong>20 de Novembro de 2025</strong><br>
                Cerimônia às 16:00h • Recepção às 18:00h
              </p>
            </div>

            <p style="color: #6B7280; font-size: 14px; text-align: center;">
              Seu código de convite: <strong>${data.invitationCode}</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; margin: 0; font-size: 14px;">
              Com amor,<br>
              <strong style="color: #4A4A4A;">Hel & Ylana</strong>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // Format Brazilian currency
  static formatBRL(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  // Test email functionality
  static async testEmail(recipientEmail: string) {
    try {
      const msg = {
        to: recipientEmail,
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || 'noreply@thousanddaysoflove.com',
          name: process.env.SENDGRID_FROM_NAME || 'Hel & Ylana - Mil Dias de Amor'
        },
        subject: 'Teste - Sistema de E-mail do Casamento',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4A4A4A;">Sistema de E-mail Funcionando! ✅</h1>
            <p>Este é um e-mail de teste do sistema do casamento Hel & Ylana.</p>
            <p>Se você recebeu este e-mail, significa que o sistema está funcionando corretamente.</p>
            <p style="color: #6B7280; font-size: 14px;">
              Enviado em: ${new Date().toLocaleString('pt-BR')}
            </p>
          </div>
        `
      }

      const result = await sgMail.send(msg)
      return { success: true, messageId: result[0].headers['x-message-id'] }

    } catch (error) {
      console.error('Error sending test email:', error)
      throw error
    }
  }
}
