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
        <main className="min-h-screen flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/25 flex items-center justify-center">
                    <span className="text-[var(--accent)] text-xl">✓</span>
                </div>

                <h1
                    className="text-3xl font-semibold mb-3"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    Pago confirmado
                </h1>

                <p className="text-[var(--muted)] mb-2">
                    Tu pedido ha sido registrado correctamente.
                </p>
                <p className="text-[var(--muted)] mb-8">
                    Recibirás el contrato y los próximos pasos en tu email en los próximos minutos.
                </p>

                <Link
                    href="https://infraestructura.martin-bravo.dev"
                    className="inline-block text-sm font-mono text-[var(--accent)] hover:underline"
                >
                    ← Volver a la web
                </Link>
            </div>
        </main>
    )
}
