const PRECIO_BASE = 160
const MANTENIMIENTO = 60
const SERVICIOS_INCLUIDOS = 5
const PRECIO_EXTRA = 5

export function calcularPrecio(serviciosSeleccionados: string[]) {
    const cantidad = serviciosSeleccionados.length
    const extras = Math.max(0, cantidad - SERVICIOS_INCLUIDOS)
    const setupTotal = PRECIO_BASE + extras * PRECIO_EXTRA

    return {
        setup: setupTotal,
        mantenimiento: MANTENIMIENTO,
        extras,
        serviciosIncluidos: Math.min(cantidad, SERVICIOS_INCLUIDOS),
    }
}
