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

    const handleContinuar = () => router.push('/datos')

    return (
        <main className="min-h-screen">
            <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-10 pb-36 lg:pb-12">

                <header className="mb-10">
                    <div className="mb-5">
                        <StepIndicator paso={1} />
                    </div>
                    <h1
                        className="text-3xl sm:text-4xl font-semibold mb-2 tracking-tight"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        Selecciona tus servicios
                    </h1>
                    <p className="text-[#555] text-sm sm:text-base max-w-xl">
                        Los primeros 5 están incluidos en el precio base.
                        Cada servicio adicional suma 5 EUR al setup.
                    </p>
                </header>

                <div className="flex flex-col lg:grid lg:grid-cols-[1fr_280px] gap-8 items-start">

                    {/* Servicios */}
                    <div className="space-y-8">
                        {CATEGORIAS.map(({ id, label }) => {
                            const grupo = servicios.filter(s => s.categoria === id)
                            return (
                                <section key={id}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#3a3a3a]">
                                            {label}
                                        </span>
                                        <div className="flex-1 h-px bg-white/5" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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

                    {/* Sidebar desktop */}
                    <div className="hidden lg:flex flex-col gap-3 sticky top-8">
                        <PrecioResumen />
                        <button
                            onClick={handleContinuar}
                            disabled={sinServicios}
                            className="w-full py-2.5 px-5 bg-[#4a7cf5] text-white text-sm font-medium rounded-lg
                                transition-all hover:bg-[#3a6ce0] active:scale-[0.98]
                                disabled:opacity-30 disabled:cursor-not-allowed
                                shadow-[0_0_24px_rgba(74,124,245,0.15)]"
                        >
                            Continuar →
                        </button>
                        {sinServicios && (
                            <p className="text-center text-[10px] font-mono text-[#3a3a3a]">
                                Selecciona al menos un servicio
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Barra sticky móvil */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/8 px-5 py-4">
                <div className="max-w-lg mx-auto flex flex-col gap-3">
                    {!sinServicios && (
                        <div className="flex items-center justify-between font-mono">
                            <span className="text-xs text-[#555]">
                                {serviciosSeleccionados.length} servicio{serviciosSeleccionados.length !== 1 ? 's' : ''}
                            </span>
                            <span className="text-[#4a7cf5] font-semibold">{setup} EUR setup</span>
                        </div>
                    )}
                    <button
                        onClick={handleContinuar}
                        disabled={sinServicios}
                        className="w-full py-3 px-5 bg-[#4a7cf5] text-white text-sm font-medium rounded-lg
                            transition-all hover:bg-[#3a6ce0] active:scale-[0.98]
                            disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        {sinServicios ? 'Selecciona al menos un servicio' : 'Continuar →'}
                    </button>
                </div>
            </div>
        </main>
    )
}
