export default function StepIndicator({ paso }: { paso: 1 | 2 | 3 }) {
    const pasos = ['Servicios', 'Datos', 'Resumen']

    return (
        <div className="flex items-center gap-0 select-none">
            {pasos.map((nombre, i) => {
                const num = i + 1
                const activo = num === paso
                const completado = num < paso

                return (
                    <div key={num} className="flex items-center">
                        <div className="flex items-center gap-2">
                            <span
                                className="flex items-center justify-center rounded-full font-mono text-[11px] font-bold transition-all duration-200"
                                style={{
                                    width: 22,
                                    height: 22,
                                    background: activo
                                        ? '#4a7cf5'
                                        : completado
                                        ? 'rgba(74,124,245,0.2)'
                                        : 'rgba(255,255,255,0.06)',
                                    color: activo ? '#fff' : completado ? '#4a7cf5' : '#444',
                                    boxShadow: activo ? '0 0 12px rgba(74,124,245,0.5)' : 'none',
                                }}
                            >
                                {completado ? (
                                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                        <path d="M1 3l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                ) : num}
                            </span>
                            <span
                                className="text-xs font-mono transition-colors"
                                style={{ color: activo ? '#d4d4d4' : '#444' }}
                            >
                                {nombre}
                            </span>
                        </div>

                        {i < 2 && (
                            <span className="mx-3 text-[10px] font-mono" style={{ color: '#2a2a2a', letterSpacing: '0.2em' }}>
                                ···
                            </span>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
