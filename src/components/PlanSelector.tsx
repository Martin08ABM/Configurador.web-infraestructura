'use client'
import { useConfiguradorStore } from '@/store/configuradorStore'
import { PLANES, type PlanMantenimiento } from '@/lib/precio'

const PLAN_IDS = Object.keys(PLANES) as PlanMantenimiento[]

export default function PlanSelector() {
    const plan = useConfiguradorStore(s => s.planMantenimiento)
    const setPlan = useConfiguradorStore(s => s.setPlanMantenimiento)

    return (
        <div
            style={{
                background: '#111111',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                padding: '16px',
            }}
        >
            <p
                style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: '#333',
                    marginBottom: 12,
                }}
            >
                Plan de mantenimiento
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {PLAN_IDS.map((id) => {
                    const { label, precio, descripcion } = PLANES[id]
                    const activo = plan === id

                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setPlan(id)}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px 14px',
                                borderRadius: 7,
                                border: activo
                                    ? '1px solid rgba(74,124,245,0.5)'
                                    : '1px solid rgba(255,255,255,0.07)',
                                background: activo
                                    ? 'rgba(74,124,245,0.08)'
                                    : 'transparent',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'border-color 0.15s, background 0.15s',
                            }}
                        >
                            {/* Label + descripción */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <span
                                    style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: 12,
                                        color: activo ? '#c8d8ff' : '#666',
                                        fontWeight: activo ? 600 : 400,
                                    }}
                                >
                                    {label}
                                </span>
                                <span
                                    style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: 10,
                                        color: activo ? '#4a7cf5' : '#3a3a3a',
                                    }}
                                >
                                    {descripcion}
                                </span>
                            </div>

                            {/* Precio */}
                            <span
                                style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: activo ? '#4a7cf5' : '#444',
                                    flexShrink: 0,
                                    marginLeft: 12,
                                }}
                            >
                                {precio} EUR/mes
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
