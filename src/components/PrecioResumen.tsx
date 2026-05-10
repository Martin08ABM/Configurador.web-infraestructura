'use client'
import { useConfiguradorStore } from '@/store/configuradorStore'
import { calcularPrecio } from '@/lib/precio'

export default function PrecioResumen() {
    const serviciosSeleccionados = useConfiguradorStore(s => s.serviciosSeleccionados)
    const { setup, mantenimiento, extras, serviciosIncluidos } = calcularPrecio(serviciosSeleccionados)
    const total = serviciosSeleccionados.length

    return (
        <div className="bg-[#0d0d0d] border border-white/8 rounded-lg p-5">
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#3d3d3d] mb-4">
                Precio estimado
            </p>

            {total === 0 ? (
                <p className="text-[#3d3d3d] text-xs font-mono text-center py-2">
                    Selecciona servicios
                </p>
            ) : (
                <div className="space-y-2.5 font-mono text-sm">
                    <div className="flex justify-between text-xs">
                        <span className="text-[#555]">
                            {serviciosIncluidos} servicio{serviciosIncluidos !== 1 ? 's' : ''} incluido{serviciosIncluidos !== 1 ? 's' : ''}
                        </span>
                        <span className="text-[#888]">160 EUR</span>
                    </div>

                    {extras > 0 && (
                        <div className="flex justify-between text-xs">
                            <span className="text-[#555]">
                                +{extras} extra{extras !== 1 ? 's' : ''}
                            </span>
                            <span className="text-[#888]">+{extras * 5} EUR</span>
                        </div>
                    )}

                    <div className="h-px bg-white/6 my-1" />

                    <div className="flex justify-between items-baseline">
                        <span className="text-[#aaa] text-xs">Setup total</span>
                        <span className="text-[#4a7cf5] font-semibold text-lg">{setup} EUR</span>
                    </div>

                    <div className="flex justify-between items-baseline">
                        <span className="text-[#555] text-xs">Mantenimiento</span>
                        <span className="text-[#666] text-xs">{mantenimiento} EUR/mes</span>
                    </div>
                </div>
            )}
        </div>
    )
}
