import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { createStripe } from '@/lib/stripe'
import { createSupabaseAdmin } from '@/lib/supabase'
import { createResend } from '@/lib/resend'
import { generarContratoPDF } from '@/lib/generatePDF'
import type { DatosEmpresa } from '@/types'

export async function POST(req: Request) {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')

    if (!sig) {
        return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
    }

    const stripe = createStripe()
    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err) {
        console.error('Webhook signature error:', err)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    if (event.type !== 'checkout.session.completed') {
        return NextResponse.json({ received: true })
    }

    const session = event.data.object as Stripe.Checkout.Session
    const pedidoId = session.metadata?.pedido_id

    if (!pedidoId) {
        console.error('Missing pedido_id in session metadata')
        return NextResponse.json({ error: 'Missing pedido_id' }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()

    const { data: pedido, error: updateError } = await supabase
        .from('pedidos')
        .update({ estado: 'pagado' })
        .eq('id', pedidoId)
        .select('*')
        .single()

    if (updateError || !pedido) {
        console.error('Supabase update error:', updateError)
        return NextResponse.json({ error: 'Error actualizando pedido' }, { status: 500 })
    }

    const datos: DatosEmpresa = {
        nombreRazonSocial: pedido.nombre_razon_social,
        cifDni: pedido.cif_dni,
        direccion: pedido.direccion,
        email: pedido.email,
        personaContacto: pedido.persona_contacto,
        telefono: pedido.telefono,
    }

    let pdfBytes: Uint8Array | null = null
    try {
        pdfBytes = await generarContratoPDF({
            pedidoId: pedido.id,
            datos,
            servicios: pedido.servicios,
            precioSetup: pedido.precio_setup,
            precioMantenimiento: pedido.precio_mantenimiento,
            fecha: new Date(pedido.creado_en),
        })
    } catch (err) {
        console.error('PDF generation error:', err)
    }

    const resend = createResend()
    const emailNotificacion = process.env.EMAIL_NOTIFICACION ?? 'infraestructura@martin-bravo.dev'

    const attachments = pdfBytes
        ? [{ filename: `contrato-${pedido.id.slice(0, 8)}.pdf`, content: Buffer.from(pdfBytes) }]
        : []

    const serviciosLista = (pedido.servicios as string[]).join(', ')

    await resend.emails.send({
        from: 'Martin Bravo <infraestructura@martin-bravo.dev>',
        to: [datos.email],
        subject: 'Contrato de servicios de infraestructura — Martín Bravo',
        html: emailCliente(datos, pedido.servicios, pedido.precio_setup, pedido.precio_mantenimiento),
        attachments,
    })

    await resend.emails.send({
        from: 'Configurador <infraestructura@martin-bravo.dev>',
        to: [emailNotificacion],
        subject: `Nuevo pedido — ${datos.nombreRazonSocial}`,
        html: emailAdmin(datos, pedido.servicios, pedido.precio_setup, pedido.precio_mantenimiento, pedido.id),
    })

    console.log(`Pedido ${pedidoId} procesado correctamente`)
    return NextResponse.json({ received: true })
}

function emailCliente(
    datos: DatosEmpresa,
    servicios: string[],
    setup: number,
    mantenimiento: number,
): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, sans-serif; background: #f5f5f5; margin: 0; padding: 32px 16px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden;">
    <div style="background: #0f0f0f; padding: 28px 32px;">
      <p style="color: #4a7cf5; font-family: monospace; font-size: 12px; margin: 0 0 8px;">martin-bravo.dev</p>
      <h1 style="color: white; font-size: 20px; margin: 0;">Contrato confirmado</h1>
    </div>
    <div style="padding: 28px 32px;">
      <p style="color: #374151; margin: 0 0 20px;">Hola ${datos.personaContacto},</p>
      <p style="color: #374151; margin: 0 0 24px;">Tu pedido ha sido registrado y el pago confirmado. Aquí tienes el resumen:</p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 10px 12px; background: #f9fafb; border-radius: 4px 4px 0 0; font-size: 11px; font-family: monospace; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Servicios</td>
        </tr>
        ${servicios.map(s => `<tr><td style="padding: 8px 12px; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px;">• ${s}</td></tr>`).join('')}
      </table>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
        <tr>
          <td style="padding: 10px 12px; background: #f9fafb; border-radius: 4px 4px 0 0; font-size: 11px; font-family: monospace; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;" colspan="2">Precio</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #f3f4f6; color: #374151; font-size: 14px;">Setup inicial</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; text-align: right; font-family: monospace;">${setup} EUR</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; color: #374151; font-size: 14px;">Mantenimiento mensual</td>
          <td style="padding: 10px 12px; color: #111827; font-size: 14px; text-align: right; font-family: monospace;">${mantenimiento} EUR/mes</td>
        </tr>
      </table>

      <p style="color: #374151; margin: 0 0 8px;">Adjunto encontrarás el contrato de servicios con todos los detalles.</p>
      <p style="color: #374151; margin: 0 0 28px;">Me pondré en contacto contigo en los próximos días para coordinar la instalación.</p>

      <p style="color: #6b7280; font-size: 13px; margin: 0;">Un saludo,<br><strong style="color: #111827;">Martín Bravo</strong><br>infraestructura@martin-bravo.dev</p>
    </div>
  </div>
</body>
</html>`
}

function emailAdmin(
    datos: DatosEmpresa,
    servicios: string[],
    setup: number,
    mantenimiento: number,
    pedidoId: string,
): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="font-family: monospace; background: #0f0f0f; margin: 0; padding: 24px; color: #e2e2e2;">
  <div style="max-width: 540px; margin: 0 auto;">
    <h2 style="color: #4a7cf5; margin: 0 0 16px; font-size: 14px;">NUEVO PEDIDO CONFIRMADO</h2>
    <pre style="background: #111; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 16px; font-size: 13px; line-height: 1.7; white-space: pre-wrap;">
ID:         ${pedidoId}
Empresa:    ${datos.nombreRazonSocial}
CIF/DNI:    ${datos.cifDni}
Dirección:  ${datos.direccion}
Email:      ${datos.email}
Contacto:   ${datos.personaContacto}
Teléfono:   ${datos.telefono}

Setup:      ${setup} EUR
Mensual:    ${mantenimiento} EUR/mes

Servicios:
${servicios.map(s => `  - ${s}`).join('\n')}
    </pre>
  </div>
</body>
</html>`
}
