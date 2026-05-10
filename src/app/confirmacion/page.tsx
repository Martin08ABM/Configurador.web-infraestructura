'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { useConfiguradorStore } from '@/store/configuradorStore'

export default function ConfirmacionPage() {
    const reset = useConfiguradorStore(s => s.reset)

    useEffect(() => {
        reset()
    }, [reset])

    return (
        <main className="min-h-screen flex items-center justify-center px-6 relative z-10">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div
                    className="mx-auto mb-8 flex items-center justify-center"
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: 'rgba(74,124,245,0.12)',
                        border: '1px solid rgba(74,124,245,0.3)',
                        boxShadow: '0 0 40px rgba(74,124,245,0.15)',
                    }}
                >
                    <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                        <path
                            d="M2 9l7 7L22 2"
                            stroke="#4a7cf5"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <h1
                    className="text-4xl font-semibold mb-4 tracking-tight"
                    style={{ fontFamily: 'var(--font-display)', color: '#e8e8e8' }}
                >
                    Pago confirmado
                </h1>

                <p style={{ color: '#666', fontSize: 15, marginBottom: 8 }}>
                    Tu pedido ha sido registrado correctamente.
                </p>
                <p style={{ color: '#555', fontSize: 14, marginBottom: 40, lineHeight: 1.7 }}>
                    Recibirás el contrato en tu email en los próximos minutos.
                    Me pondré en contacto contigo para coordinar la instalación.
                </p>

                <Link
                    href="https://infraestructura.martin-bravo.dev"
                    className="font-mono"
                    style={{ fontSize: 13, color: '#4a7cf5' }}
                >
                    ← Volver a la web
                </Link>
            </div>
        </main>
    )
}
