import type { Servicio } from '@/lib/servicios'

export default function ServicioCard({
    servicio,
    seleccionado,
    onClick,
}: {
    servicio: Servicio
    seleccionado: boolean
    onClick: () => void
}) {
    return (
        <div
            onClick={onClick}
            className={`
                group relative cursor-pointer rounded-lg p-4 border transition-all duration-150 flex flex-col gap-2.5
                ${seleccionado
                    ? 'bg-[#4a7cf5]/6 border-[#4a7cf5]/55 shadow-[0_0_28px_rgba(74,124,245,0.08)]'
                    : 'bg-[#0d0d0d] border-white/8 hover:border-white/20 hover:bg-[#101010]'
                }
            `}
        >
            <div className="flex items-start justify-between gap-2">
                <h3
                    className={`font-semibold text-[15px] leading-snug transition-colors ${
                        seleccionado ? 'text-white' : 'text-[#d4d4d4] group-hover:text-white'
                    }`}
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    {servicio.nombre}
                </h3>

                <span
                    className={`shrink-0 w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 transition-all ${
                        seleccionado
                            ? 'bg-[#4a7cf5] border-[#4a7cf5]'
                            : 'border-white/20 group-hover:border-white/35'
                    }`}
                >
                    {seleccionado && (
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path
                                d="M1 3l2 2 4-4"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </span>
            </div>

            <p className="text-[#6b7280] text-[13px] leading-relaxed flex-1">
                {servicio.descripcion}
            </p>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#3a3a3a] group-hover:text-[#4a4a4a] transition-colors">
                <span>vs</span>
                <span>{servicio.alternativa}</span>
            </div>
        </div>
    )
}
