'use client'
import { useConfiguradorStore } from '@/store/configuradorStore'
import { calcularPrecio } from '@/lib/precio'

export default function PrecioResumen() {
    const serviciosSeleccionados = useConfiguradorStore(s => s.serviciosSeleccionados)
    const { setup, mantenimiento, extras } = calcularPrecio(serviciosSeleccionados)

    return (
        <div className="bg-[var(--bg-2)] border border-[var(--border)] rounded-xl p-5 font-mono text-sm">
            <div className="text-[var(--muted)] mb-4 text-[10px] uppercase tracking-widest">
                Precio estimado
            </div>

            <div className="space-y-2.5">
                <div className="flex justify-between items-baseline">
                    <span className="text-[var(--muted)] text-xs">Setup base</span>
                    <span className="text-[var(--text)]">160 EUR</span>
                </div>

                {extras > 0 && (
                    <div className="flex justify-between items-baseline">
                        <span className="text-[var(--muted)] text-xs">
                            {extras} servicio{extras > 1 ? 's' : ''} extra
                        </span>
                        <span className="text-[var(--text)]">+{extras * 5} EUR</span>
                    </div>
                )}

                <div className="border-t border-[var(--border)] pt-2.5 flex justify-between items-baseline">
                    <span className="text-[var(--text)] text-xs font-medium">Setup total</span>
                    <span className="text-[var(--accent)] font-semibold text-base">{setup} EUR</span>
                </div>

                <div className="flex justify-between items-baseline">
                    <span className="text-[var(--muted)] text-xs">Mantenimiento</span>
                    <span className="text-[var(--text)]">{mantenimiento} EUR/mes</span>
                </div>
            </div>

            {serviciosSeleccionados.length === 0 && (
                <p className="text-[var(--muted)] text-[10px] mt-4 text-center">
                    Selecciona servicios para ver el precio
                </p>
            )}
        </div>
    )
}
