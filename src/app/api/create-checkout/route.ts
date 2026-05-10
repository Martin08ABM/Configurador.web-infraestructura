import { NextResponse } from 'next/server'
import { createStripe } from '@/lib/stripe'
import { createSupabaseAdmin } from '@/lib/supabase'
import { calcularPrecio } from '@/lib/precio'
import type { DatosEmpresa } from '@/types'

export async function POST(req: Request) {
    try {
        const { servicios, datos }: { servicios: string[]; datos: DatosEmpresa } = await req.json()

        if (!servicios?.length || !datos?.email) {
            return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
        }

        const precio = calcularPrecio(servicios)
        const supabase = createSupabaseAdmin()
        const stripe = createStripe()

        const { data: pedido, error: dbError } = await supabase
            .from('pedidos')
            .insert({
                servicios,
                nombre_razon_social: datos.nombreRazonSocial,
                cif_dni: datos.cifDni,
                direccion: datos.direccion,
                email: datos.email,
                persona_contacto: datos.personaContacto,
                telefono: datos.telefono,
                precio_setup: precio.setup,
                precio_mantenimiento: precio.mantenimiento,
                estado: 'pendiente',
            })
            .select('id')
            .single()

        if (dbError || !pedido) {
            console.error('Supabase insert error:', dbError)
            return NextResponse.json({ error: 'Error guardando el pedido' }, { status: 500 })
        }

        const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Setup de infraestructura',
                            description: `Instalación y configuración de ${servicios.length} servicio${servicios.length > 1 ? 's' : ''}`,
                        },
                        unit_amount: precio.setup * 100,
                    },
                    quantity: 1,
                },
            ],
            customer_email: datos.email,
            metadata: { pedido_id: pedido.id },
            success_url: `${base}/confirmacion?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${base}/resumen`,
        })

        await supabase
            .from('pedidos')
            .update({ stripe_session_id: session.id })
            .eq('id', pedido.id)

        return NextResponse.json({ url: session.url })
    } catch (err) {
        console.error('Checkout error:', err)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
