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
        if (serviciosSeleccionados.length === 0) {
            router.replace('/')
        } else if (!datosEmpresa) {
            router.replace('/datos')
        }
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
        <main className="min-h-screen">
            <div className="max-w-xl mx-auto px-6 py-12">
                <header className="mb-10">
                    <div className="mb-6">
                        <StepIndicator paso={3} />
                    </div>
                    <h1
                        className="text-3xl font-semibold mb-2"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        Resumen del pedido
                    </h1>
                    <p className="text-[var(--muted)]">
                        Revisa los detalles antes de pagar.
                    </p>
                </header>

                <div className="space-y-4">
                    <Card title="Servicios seleccionados">
                        <ul className="space-y-1.5">
                            {serviciosElegidos.map(s => (
                                <li key={s.id} className="flex items-center gap-2.5 text-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                                    <span className="text-[var(--text)]">{s.nombre}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    <Card title="Datos de empresa">
                        <dl className="space-y-1.5 font-mono text-sm">
                            <Row label="Nombre" value={datosEmpresa.nombreRazonSocial} />
                            <Row label="CIF/DNI" value={datosEmpresa.cifDni} />
                            <Row label="Dirección" value={datosEmpresa.direccion} />
                            <Row label="Email" value={datosEmpresa.email} />
                            <Row label="Contacto" value={datosEmpresa.personaContacto} />
                            <Row label="Teléfono" value={datosEmpresa.telefono} />
                        </dl>
                    </Card>

                    <Card title="Precio">
                        <div className="space-y-2 font-mono text-sm">
                            <div className="flex justify-between">
                                <span className="text-[var(--muted)]">Setup (pago único)</span>
                                <span className="text-[var(--text)]">{precio.setup} EUR</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--muted)]">Mantenimiento mensual</span>
                                <span className="text-[var(--text)]">{precio.mantenimiento} EUR/mes</span>
                            </div>
                        </div>
                    </Card>

                    {error && (
                        <p className="text-sm text-[var(--danger)] font-mono bg-[var(--danger)]/10 border border-[var(--danger)]/20 rounded-lg px-4 py-3">
                            {error}
                        </p>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => router.push('/datos')}
                            className="px-5 py-3 border border-[var(--border)] rounded-lg text-[var(--muted)]
                                hover:text-[var(--text)] hover:border-white/25 transition-all"
                        >
                            ← Atrás
                        </button>
                        <button
                            onClick={handlePagar}
                            disabled={loading}
                            className="flex-1 py-3 px-6 bg-[var(--accent)] text-white font-medium rounded-lg
                                hover:bg-[#3a6ce0] active:scale-[0.98] transition-all
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Redirigiendo...' : 'Contratar y pagar →'}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-[var(--bg-2)] border border-[var(--border)] rounded-xl p-5">
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] mb-3">
                {title}
            </h2>
            {children}
        </div>
    )
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex gap-3">
            <dt className="text-[var(--muted)] shrink-0 w-20">{label}</dt>
            <dd className="text-[var(--text)]">{value}</dd>
        </div>
    )
}
