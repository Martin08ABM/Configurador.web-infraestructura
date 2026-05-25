export type PlanMantenimiento = 'basico' | 'completo'

export const PLANES: Record<PlanMantenimiento, { label: string; precio: number; descripcion: string }> = {
    basico:   { label: 'Plan Básico',    precio: 40, descripcion: 'Hasta 3 apps' },
    completo: { label: 'Plan Completo',  precio: 60, descripcion: 'Apps ilimitadas' },
}

const PRECIO_BASE = 160
const SERVICIOS_INCLUIDOS = 5
const PRECIO_EXTRA = 5

export function calcularPrecio(serviciosSeleccionados: string[], plan: PlanMantenimiento = 'basico') {
    const cantidad = serviciosSeleccionados.length
    const extras = Math.max(0, cantidad - SERVICIOS_INCLUIDOS)
    const setupTotal = PRECIO_BASE + extras * PRECIO_EXTRA

    return {
        setup: setupTotal,
        mantenimiento: PLANES[plan].precio,
        extras,
        serviciosIncluidos: Math.min(cantidad, SERVICIOS_INCLUIDOS),
    }
}
