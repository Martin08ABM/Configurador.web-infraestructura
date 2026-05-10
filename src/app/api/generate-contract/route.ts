import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { generarContratoPDF } from '@/lib/generatePDF'
import type { DatosEmpresa } from '@/types'

export async function POST(req: Request) {
    try {
        const { pedidoId }: { pedidoId: string } = await req.json()

        if (!pedidoId) {
            return NextResponse.json({ error: 'pedidoId requerido' }, { status: 400 })
        }

        const supabase = createSupabaseAdmin()

        const { data: pedido, error } = await supabase
            .from('pedidos')
            .select('*')
            .eq('id', pedidoId)
            .single()

        if (error || !pedido) {
            return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
        }

        const datos: DatosEmpresa = {
            nombreRazonSocial: pedido.nombre_razon_social,
            cifDni: pedido.cif_dni,
            direccion: pedido.direccion,
            email: pedido.email,
            personaContacto: pedido.persona_contacto,
            telefono: pedido.telefono,
        }

        const pdfBytes = await generarContratoPDF({
            pedidoId: pedido.id,
            datos,
            servicios: pedido.servicios,
            precioSetup: pedido.precio_setup,
            precioMantenimiento: pedido.precio_mantenimiento,
            fecha: new Date(pedido.creado_en),
        })

        return new Response(pdfBytes.buffer as ArrayBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="contrato-${pedidoId.slice(0, 8)}.pdf"`,
            },
        })
    } catch (err) {
        console.error('Generate contract error:', err)
        return NextResponse.json({ error: 'Error generando el contrato' }, { status: 500 })
    }
}
