'use client'
import { useRouter } from 'next/navigation'
import { servicios } from '@/lib/servicios'
import { useConfiguradorStore } from '@/store/configuradorStore'
import { calcularPrecio } from '@/lib/precio'
import ServicioCard from '@/components/servicioCard'
import StepIndicator from '@/components/StepIndicator'
import PrecioResumen from '@/components/PrecioResumen'

const CATEGORIAS = [
    { id: 'general', label: 'General' },
    { id: 'desarrollo', label: 'Desarrollo' },
    { id: 'productividad', label: 'Productividad' },
]

export default function Home() {
    const router = useRouter()
    const { serviciosSeleccionados, toggleServicio } = useConfiguradorStore()
    const { setup } = calcularPrecio(serviciosSeleccionados)
    const sinServicios = serviciosSeleccionados.length === 0

    return (
        <main style={{ minHeight: '100vh', position: 'relative', zIndex: 10 }}>
            <div style={{ maxWidth: 1024, margin: '0 auto', padding: '48px 24px 160px' }}>

                {/* Header */}
                <header style={{ marginBottom: 48 }}>
                    <div style={{ marginBottom: 20 }}>
                        <StepIndicator paso={1} />
                    </div>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(24px, 3.5vw, 40px)',
                        fontWeight: 700,
                        color: '#ebebeb',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.25,
                        marginBottom: 12,
                        overflowWrap: 'break-word',
                        paddingBottom: 4,
                    }}>
                        Configura tu infraestructura
                    </h1>
                    <p style={{ color: '#555', fontSize: 15, maxWidth: 460, lineHeight: 1.6 }}>
                        Elige los servicios que quieres instalar. Los primeros 5 están incluidos en el precio base — cada adicional suma 5 EUR.
                    </p>
                </header>

                {/* Two-column layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }} className="lg-layout">
                    {/* Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        {CATEGORIAS.map(({ id, label }) => {
                            const grupo = servicios.filter(s => s.categoria === id)
                            const selCount = grupo.filter(s => serviciosSeleccionados.includes(s.id)).length

                            return (
                                <section key={id}>
                                    {/* Category label */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                        <span style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: 11,
                                            fontWeight: 500,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.15em',
                                            color: '#444',
                                        }}>
                                            {label}
                                        </span>
                                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                                        {selCount > 0 && (
                                            <span style={{
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: 11,
                                                color: '#4a7cf5',
                                                background: 'rgba(74,124,245,0.1)',
                                                border: '1px solid rgba(74,124,245,0.25)',
                                                padding: '2px 8px',
                                                borderRadius: 4,
                                            }}>
                                                {selCount}
                                            </span>
                                        )}
                                    </div>

                                    {/* Grid */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                                        gap: 8,
                                    }}>
                                        {grupo.map(s => (
                                            <ServicioCard
                                                key={s.id}
                                                servicio={s}
                                                seleccionado={serviciosSeleccionados.includes(s.id)}
                                                onClick={() => toggleServicio(s.id)}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )
                        })}
                    </div>

                    {/* Sidebar — desktop only, handled by CSS */}
                    <div className="sidebar-desktop">
                        <div style={{ position: 'sticky', top: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <PrecioResumen />
                            <button
                                onClick={() => router.push('/datos')}
                                disabled={sinServicios}
                                className="btn-primary"
                                style={{ width: '100%', opacity: sinServicios ? 0.35 : 1 }}
                            >
                                Continuar →
                            </button>
                            {sinServicios && (
                                <p style={{ textAlign: 'center', fontSize: 11, fontFamily: 'var(--font-mono)', color: '#333' }}>
                                    Selecciona al menos un servicio
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sticky bar */}
            <div className="mobile-bar" style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                padding: '16px 20px',
                background: 'rgba(10,10,10,0.97)',
                backdropFilter: 'blur(16px)',
                borderTop: '1px solid rgba(255,255,255,0.08)',
            }}>
                <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {!sinServicios && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#555' }}>
                                {serviciosSeleccionados.length} servicio{serviciosSeleccionados.length !== 1 ? 's' : ''}
                            </span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: '#4a7cf5' }}>
                                {setup} EUR
                            </span>
                        </div>
                    )}
                    <button
                        onClick={() => router.push('/datos')}
                        disabled={sinServicios}
                        className="btn-primary"
                        style={{ width: '100%', opacity: sinServicios ? 0.35 : 1 }}
                    >
                        {sinServicios ? 'Selecciona al menos un servicio' : 'Continuar →'}
                    </button>
                </div>
            </div>
        </main>
    )
}
