'use client'
import { useRouter } from 'next/navigation'
import { servicios } from '@/lib/servicios'
import { useConfiguradorStore } from '@/store/configuradorStore'
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

    return (
        <main className="min-h-screen">
            <div className="max-w-5xl mx-auto px-6 py-12">
                <header className="mb-10">
                    <div className="mb-6">
                        <StepIndicator paso={1} />
                    </div>
                    <h1
                        className="text-3xl font-semibold mb-2"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        Selecciona tus servicios
                    </h1>
                    <p className="text-[var(--muted)]">
                        Los primeros 5 están incluidos en el precio base. Cada servicio adicional suma 5 EUR al setup.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        {CATEGORIAS.map(({ id, label }) => {
                            const grupo = servicios.filter(s => s.categoria === id)
                            return (
                                <section key={id}>
                                    <h2 className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] mb-3">
                                        {label}
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                    <div className="lg:sticky lg:top-8 space-y-3">
                        <PrecioResumen />
                        <button
                            onClick={() => router.push('/datos')}
                            disabled={serviciosSeleccionados.length === 0}
                            className="w-full py-3 px-6 bg-[var(--accent)] text-white font-medium rounded-lg
                                transition-all hover:bg-[#3a6ce0] active:scale-[0.98]
                                disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Continuar →
                        </button>
                        {serviciosSeleccionados.length === 0 && (
                            <p className="text-center text-[10px] font-mono text-[var(--muted)]">
                                Selecciona al menos un servicio
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
