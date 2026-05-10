'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useConfiguradorStore } from '@/store/configuradorStore'
import { servicios as catalogo } from '@/lib/servicios'
import { calcularPrecio } from '@/lib/precio'
import StepIndicator from '@/components/StepIndicator'

export default function ResumenPage() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { serviciosSeleccionados, datosEmpresa } = useConfiguradorStore()

    useEffect(() => {
        setMounted(true)
        if (serviciosSeleccionados.length === 0) router.replace('/')
        else if (!datosEmpresa) router.replace('/datos')
    }, [])

    if (!mounted || serviciosSeleccionados.length === 0 || !datosEmpresa) return null

    const serviciosElegidos = catalogo.filter(s => serviciosSeleccionados.includes(s.id))
    const precio = calcularPrecio(serviciosSeleccionados)

    const handlePagar = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ servicios: serviciosSeleccionados, datos: datosEmpresa }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error ?? 'Error al crear el pago')
            window.location.href = json.url
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error desconocido')
            setLoading(false)
        }
    }

    return (
        <main style={{ minHeight: '100vh', position: 'relative', zIndex: 10 }}>
            <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 24px 80px' }}>

                <header style={{ marginBottom: 48 }}>
                    <div style={{ marginBottom: 20 }}>
                        <StepIndicator paso={3} />
                    </div>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(24px, 3.5vw, 40px)',
                        fontWeight: 700,
                        color: '#ebebeb',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.25,
                        paddingBottom: 4,
                        marginBottom: 12,
                        overflowWrap: 'break-word',
                    }}>
                        Resumen del pedido
                    </h1>
                    <p style={{ color: '#555', fontSize: 15, lineHeight: 1.6 }}>
                        Revisa los detalles antes de pagar.
                    </p>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                    {/* Servicios */}
                    <Panel label="Servicios seleccionados">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {serviciosElegidos.map(s => (
                                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4a7cf5', flexShrink: 0 }} />
                                    <span style={{ fontSize: 14, color: '#c0c0c0' }}>{s.nombre}</span>
                                </div>
                            ))}
                        </div>
                    </Panel>

                    {/* Datos */}
                    <Panel label="Datos de empresa">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {([
                                ['Nombre', datosEmpresa.nombreRazonSocial],
                                ['CIF/DNI', datosEmpresa.cifDni],
                                ['Dirección', datosEmpresa.direccion],
                                ['Email', datosEmpresa.email],
                                ['Contacto', datosEmpresa.personaContacto],
                                ['Teléfono', datosEmpresa.telefono],
                            ] as [string, string][]).map(([k, v]) => (
                                <div key={k} style={{ display: 'flex', gap: 16 }}>
                                    <span style={{ fontSize: 12, color: '#444', fontFamily: 'var(--font-mono)', width: 68, flexShrink: 0 }}>{k}</span>
                                    <span style={{ fontSize: 13, color: '#999', wordBreak: 'break-all' }}>{v}</span>
                                </div>
                            ))}
                        </div>
                    </Panel>

                    {/* Precio */}
                    <div style={{
                        background: 'rgba(74,124,245,0.07)',
                        border: '1px solid rgba(74,124,245,0.2)',
                        borderRadius: 8,
                        padding: 20,
                    }}>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4a7cf5', marginBottom: 16 }}>
                            Precio
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <span style={{ fontSize: 14, color: '#777' }}>Setup (pago único)</span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, color: '#4a7cf5' }}>{precio.setup} EUR</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid rgba(74,124,245,0.12)', paddingTop: 10 }}>
                                <span style={{ fontSize: 13, color: '#555' }}>Mantenimiento mensual</span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#555' }}>{precio.mantenimiento} EUR/mes</span>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div style={{ background: 'rgba(224,82,82,0.08)', border: '1px solid rgba(224,82,82,0.2)', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                        <button onClick={() => router.push('/datos')} className="btn-ghost">
                            ← Atrás
                        </button>
                        <button
                            onClick={handlePagar}
                            disabled={loading}
                            className="btn-primary"
                            style={{ flex: 1, opacity: loading ? 0.6 : 1 }}
                        >
                            {loading ? 'Redirigiendo...' : 'Contratar y pagar →'}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: 20 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#333', marginBottom: 14 }}>
                {label}
            </p>
            {children}
        </div>
    )
}
