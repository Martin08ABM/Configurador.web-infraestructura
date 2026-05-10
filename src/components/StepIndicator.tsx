export default function StepIndicator({ paso }: { paso: 1 | 2 | 3 }) {
    const pasos = ['Servicios', 'Datos', 'Resumen']

    return (
        <div className="flex items-center gap-1 font-mono text-xs">
            {pasos.map((nombre, i) => {
                const num = i + 1
                const activo = num === paso
                const completado = num < paso
                return (
                    <div key={num} className="flex items-center gap-1">
                        <span
                            className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-medium transition-colors ${
                                activo
                                    ? 'bg-[#4a7cf5] text-white'
                                    : completado
                                    ? 'bg-[#4a7cf5]/25 text-[#4a7cf5]'
                                    : 'bg-white/8 text-[#6b7280]'
                            }`}
                        >
                            {completado ? '✓' : num}
                        </span>
                        <span className={activo ? 'text-[#e2e2e2]' : 'text-[#6b7280]'}>
                            {nombre}
                        </span>
                        {i < 2 && <span className="text-white/15 mx-1.5">—</span>}
                    </div>
                )
            })}
        </div>
    )
}
