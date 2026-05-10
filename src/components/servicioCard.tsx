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
            role="checkbox"
            aria-checked={seleccionado}
            tabIndex={0}
            onKeyDown={e => e.key === ' ' || e.key === 'Enter' ? onClick() : null}
            style={{
                cursor: 'pointer',
                borderRadius: 8,
                overflow: 'hidden',
                border: seleccionado
                    ? '1px solid rgba(74,124,245,0.6)'
                    : '1px solid rgba(255,255,255,0.1)',
                background: seleccionado
                    ? 'linear-gradient(145deg, rgba(74,124,245,0.13) 0%, rgba(74,124,245,0.07) 100%)'
                    : 'rgba(255,255,255,0.03)',
                boxShadow: seleccionado
                    ? '0 0 0 1px rgba(74,124,245,0.1), 0 4px 20px rgba(74,124,245,0.1)'
                    : '0 1px 3px rgba(0,0,0,0.3)',
                transition: 'all 0.15s ease',
                userSelect: 'none',
            }}
        >
            {/* Accent top bar */}
            <div style={{
                height: seleccionado ? 2 : 0,
                background: 'linear-gradient(90deg, transparent, #4a7cf5, transparent)',
                transition: 'height 0.15s ease',
            }} />

            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Name + checkbox */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 600,
                        fontSize: 14,
                        lineHeight: 1.3,
                        color: seleccionado ? '#ffffff' : '#d0d0d0',
                        transition: 'color 0.15s',
                    }}>
                        {servicio.nombre}
                    </span>

                    <span style={{
                        flexShrink: 0,
                        width: 18,
                        height: 18,
                        marginTop: 1,
                        borderRadius: '50%',
                        border: seleccionado ? '2px solid #4a7cf5' : '2px solid rgba(255,255,255,0.2)',
                        background: seleccionado ? '#4a7cf5' : 'transparent',
                        boxShadow: seleccionado ? '0 0 8px rgba(74,124,245,0.6)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s ease',
                    }}>
                        {seleccionado && (
                            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        )}
                    </span>
                </div>

                {/* Description */}
                <span style={{
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: '#777777',
                    display: 'block',
                }}>
                    {servicio.descripcion}
                </span>

                {/* Alternative */}
                <span style={{
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    color: '#3a3a3a',
                    letterSpacing: '0.02em',
                }}>
                    vs {servicio.alternativa}
                </span>
            </div>
        </div>
    )
}
