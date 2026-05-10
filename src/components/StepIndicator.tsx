export default function StepIndicator({ paso }: { paso: 1 | 2 | 3 }) {
    const pasos = ['Servicios', 'Datos', 'Resumen']

    return (
        <div className="flex items-center gap-2 font-mono text-xs select-none">
            {pasos.map((nombre, i) => {
                const num = i + 1
                const activo = num === paso
                const completado = num < paso

                return (
                    <div key={num} className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                            <span
                                className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                                    activo
                                        ? 'bg-[#4a7cf5] text-white shadow-[0_0_12px_rgba(74,124,245,0.4)]'
                                        : completado
                                        ? 'bg-[#4a7cf5]/20 text-[#4a7cf5]'
                                        : 'bg-white/6 text-[#444]'
                                }`}
                            >
                                {completado ? (
                                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                        <path d="M1 3l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                ) : num}
                            </span>
                            <span
                                className={`transition-colors ${
                                    activo ? 'text-[#e2e2e2]' : 'text-[#444]'
                                }`}
                            >
                                {nombre}
                            </span>
                        </div>

                        {i < 2 && (
                            <span className="text-white/10 text-base leading-none">·····</span>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
