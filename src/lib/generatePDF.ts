import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import type { DatosEmpresa } from '@/types'
import { servicios as catalogo } from '@/lib/servicios'

const PROVEEDOR = {
    nombre: 'Martin Bravo',
    email: 'infraestructura@martin-bravo.dev',
    ubicacion: 'Figueres (Girona)',
}

export async function generarContratoPDF(params: {
    pedidoId: string
    datos: DatosEmpresa
    servicios: string[]
    precioSetup: number
    precioMantenimiento: number
    fecha: Date
}): Promise<Uint8Array> {
    const doc = await PDFDocument.create()
    const font = await doc.embedFont(StandardFonts.Helvetica)
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)

    const W = 595
    const H = 842
    const LEFT = 55
    const RIGHT = 540
    const BOTTOM = 60

    let page = doc.addPage([W, H])
    let y = H - 60

    const black: [number, number, number] = [0.1, 0.1, 0.1]
    const gray: [number, number, number] = [0.45, 0.45, 0.45]
    const lightGray: [number, number, number] = [0.75, 0.75, 0.75]

    const ensureSpace = (needed: number) => {
        if (y - needed < BOTTOM) {
            page = doc.addPage([W, H])
            y = H - 60
        }
    }

    const text = (
        str: string,
        x: number,
        size: number,
        color: [number, number, number] = black,
        bold = false,
    ) => {
        ensureSpace(size + 4)
        page.drawText(str, {
            x,
            y,
            size,
            font: bold ? fontBold : font,
            color: rgb(...color),
        })
    }

    const nl = (size: number, multiplier = 1.6) => {
        y -= size * multiplier
    }

    const rule = () => {
        ensureSpace(12)
        page.drawLine({
            start: { x: LEFT, y },
            end: { x: RIGHT, y },
            thickness: 0.5,
            color: rgb(...lightGray),
        })
        y -= 12
    }

    const section = (label: string) => {
        ensureSpace(24)
        y -= 4
        text(label, LEFT, 9, gray, true)
        nl(9, 1.8)
    }

    // ------ CABECERA ------
    text('CONTRATO DE SERVICIOS DE INFRAESTRUCTURA', LEFT, 13, black, true)
    nl(13, 1.5)

    const fechaStr = params.fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    })
    text(`Ref: ${params.pedidoId.slice(0, 8).toUpperCase()}`, LEFT, 9, gray)
    text(fechaStr, RIGHT - 130, 9, gray)
    nl(9, 2.5)

    rule()

    // ------ PARTES ------
    section('1. PARTES DEL CONTRATO')

    text('PROVEEDOR', LEFT, 8, gray, true)
    nl(8, 1.5)
    text(PROVEEDOR.nombre, LEFT, 10, black, true)
    nl(10)
    text(PROVEEDOR.email, LEFT, 9, black)
    nl(9)
    text(PROVEEDOR.ubicacion, LEFT, 9, black)
    nl(9, 2.5)

    text('CLIENTE', LEFT, 8, gray, true)
    nl(8, 1.5)
    text(params.datos.nombreRazonSocial, LEFT, 10, black, true)
    nl(10)
    text(`CIF/DNI: ${params.datos.cifDni}`, LEFT, 9, black)
    nl(9)
    text(params.datos.direccion, LEFT, 9, black)
    nl(9)
    text(params.datos.email, LEFT, 9, black)
    nl(9)
    text(`Contacto: ${params.datos.personaContacto}`, LEFT, 9, black)
    nl(9)
    text(`Telefono: ${params.datos.telefono}`, LEFT, 9, black)
    nl(9, 2.5)

    rule()

    // ------ SERVICIOS ------
    section('2. SERVICIOS CONTRATADOS')

    const serviciosContratados = catalogo.filter(s => params.servicios.includes(s.id))
    serviciosContratados.forEach(s => {
        text(`- ${s.nombre}`, LEFT + 8, 10, black)
        nl(10)
    })
    nl(8)

    rule()

    // ------ PRECIO ------
    section('3. PRECIO Y FORMA DE PAGO')

    text(`Setup inicial (pago unico):`, LEFT, 10, black)
    text(`${params.precioSetup} EUR`, RIGHT - 60, 10, black, true)
    nl(10, 1.5)

    text(`Mantenimiento mensual:`, LEFT, 10, black)
    text(`${params.precioMantenimiento} EUR/mes`, RIGHT - 80, 10, black, true)
    nl(10, 1.5)

    text('Los primeros 5 servicios estan incluidos en el precio base de 160 EUR.', LEFT, 8, gray)
    nl(8)
    text('Cada servicio adicional tiene un coste extra de 5 EUR sobre el setup.', LEFT, 8, gray)
    nl(8)
    text('El mantenimiento mensual cubre: servidor VPS, actualizaciones y soporte tecnico.', LEFT, 8, gray)
    nl(8, 2.5)

    rule()

    // ------ CONDICIONES ------
    section('4. CONDICIONES DEL SERVICIO')

    const clausulas = [
        '4.1. El proveedor instalara y configurara todos los servicios en un plazo maximo de 7 dias habiles desde la confirmacion del pago.',
        '4.2. El mantenimiento mensual incluye: actualizaciones de seguridad, copias de seguridad y soporte tecnico basico por email.',
        '4.3. El cliente es el unico propietario de sus datos y tiene acceso administrativo completo al servidor en todo momento.',
        '4.4. Todos los datos del cliente se alojan exclusivamente en el servidor bajo su control. El proveedor no accede a ellos salvo solicitud expresa.',
        '4.5. La rescision del contrato de mantenimiento requiere un preaviso minimo de 30 dias naturales comunicado por email.',
        '4.6. El proveedor no se hace responsable de perdidas derivadas del mal uso de los servicios por parte del cliente.',
        '4.7. Cualquier modificacion de las condiciones requiere acuerdo escrito de ambas partes.',
        '4.8. Este contrato se rige por la legislacion espanola. Para cualquier controversia, ambas partes se someten a los juzgados de Girona.',
    ]

    clausulas.forEach(c => {
        ensureSpace(14)
        text(c, LEFT, 8.5, [0.2, 0.2, 0.2])
        nl(8.5, 1.7)
    })

    nl(5)
    rule()

    // ------ FIRMAS ------
    section('5. ACEPTACION')

    text(
        'El pago realizado mediante Stripe Checkout constituye la aceptacion expresa de las condiciones anteriores.',
        LEFT,
        9,
        gray,
    )
    nl(9, 1.5)
    text(`Fecha de pago: ${fechaStr}`, LEFT, 9, gray)
    nl(9, 3)

    text('Por el proveedor:', LEFT, 9, black)
    text('Por el cliente:', 310, 9, black)
    nl(9, 3)

    text('_______________________', LEFT, 9, lightGray)
    text('_______________________', 310, 9, lightGray)
    nl(9, 1.5)

    text(PROVEEDOR.nombre, LEFT, 9, black)
    text(params.datos.nombreRazonSocial, 310, 9, black)

    return doc.save()
}
