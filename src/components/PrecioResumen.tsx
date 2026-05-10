'use client'
import { useConfiguradorStore } from '@/store/configuradorStore'
import { calcularPrecio } from '@/lib/precio'

export default function PrecioResumen() {
    const sel = useConfiguradorStore(s => s.serviciosSeleccionados)
    const { setup, mantenimiento, extras, serviciosIncluidos } = calcularPrecio(sel)

    return (
        <div
            style={{
                background: '#111111',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                padding: '20px',
            }}
        >
            <p
                className="font-mono uppercase tracking-widest mb-4"
                style={{ fontSize: 10, color: '#333' }}
            >
                Precio estimado
            </p>

            {sel.length === 0 ? (
                <p className="font-mono text-center" style={{ fontSize: 12, color: '#333', padding: '8px 0' }}>
                    Selecciona servicios
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {/* Incluidos */}
                    <div className="flex justify-between items-baseline">
                        <span className="font-mono" style={{ fontSize: 12, color: '#555' }}>
                            {serviciosIncluidos} incluido{serviciosIncluidos !== 1 ? 's' : ''}
                        </span>
                        <span className="font-mono" style={{ fontSize: 13, color: '#888' }}>
                            160 EUR
                        </span>
                    </div>

                    {/* Extras */}
                    {extras > 0 && (
                        <div className="flex justify-between items-baseline">
                            <span className="font-mono" style={{ fontSize: 12, color: '#555' }}>
                                +{extras} extra{extras !== 1 ? 's' : ''}
                            </span>
                            <span className="font-mono" style={{ fontSize: 13, color: '#888' }}>
                                +{extras * 5} EUR
                            </span>
                        </div>
                    )}

                    {/* Divider */}
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

                    {/* Total */}
                    <div className="flex justify-between items-baseline">
                        <span className="font-mono" style={{ fontSize: 12, color: '#888' }}>
                            Setup total
                        </span>
                        <span
                            className="font-semibold font-mono"
                            style={{ fontSize: 22, color: '#4a7cf5' }}
                        >
                            {setup} EUR
                        </span>
                    </div>

                    {/* Mantenimiento */}
                    <div
                        className="flex justify-between items-baseline"
                        style={{
                            borderTop: '1px solid rgba(255,255,255,0.04)',
                            paddingTop: 10,
                            marginTop: 2,
                        }}
                    >
                        <span className="font-mono" style={{ fontSize: 11, color: '#404040' }}>
                            Mantenimiento
                        </span>
                        <span className="font-mono" style={{ fontSize: 11, color: '#404040' }}>
                            {mantenimiento} EUR/mes
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}
