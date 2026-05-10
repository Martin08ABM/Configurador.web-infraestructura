'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useConfiguradorStore } from '@/store/configuradorStore'
import StepIndicator from '@/components/StepIndicator'
import type { DatosEmpresa } from '@/types'

const schema = z.object({
    nombreRazonSocial: z.string().min(2, 'Nombre requerido'),
    cifDni: z.string().min(8, 'CIF/DNI no válido'),
    direccion: z.string().min(5, 'Dirección requerida'),
    email: z.string().email('Email no válido'),
    personaContacto: z.string().min(2, 'Nombre de contacto requerido'),
    telefono: z.string().min(9, 'Teléfono no válido'),
})

type FormData = z.infer<typeof schema>

const inputCls = (hasError: boolean) =>
    `w-full bg-[var(--bg-2)] border rounded-lg px-4 py-2.5 text-[var(--text)] outline-none
    transition-colors placeholder:text-[var(--muted)] font-mono text-sm
    focus:border-[var(--accent)] ${hasError ? 'border-[var(--danger)]' : 'border-[var(--border)] hover:border-white/20'}`

export default function DatosPage() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const { serviciosSeleccionados, datosEmpresa, setDatosEmpresa } = useConfiguradorStore()

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: datosEmpresa ?? undefined,
    })

    useEffect(() => {
        setMounted(true)
        if (serviciosSeleccionados.length === 0) {
            router.replace('/')
        }
    }, [])

    const onSubmit = (data: FormData) => {
        setDatosEmpresa(data as DatosEmpresa)
        router.push('/resumen')
    }

    if (!mounted || serviciosSeleccionados.length === 0) return null

    return (
        <main className="min-h-screen">
            <div className="max-w-xl mx-auto px-6 py-12">
                <header className="mb-10">
                    <div className="mb-6">
                        <StepIndicator paso={2} />
                    </div>
                    <h1
                        className="text-3xl font-semibold mb-2"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        Datos de empresa
                    </h1>
                    <p className="text-[var(--muted)]">
                        Se incluirán en el contrato de servicios.
                    </p>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <Field label="Nombre / Razón social" error={errors.nombreRazonSocial?.message}>
                        <input
                            {...register('nombreRazonSocial')}
                            placeholder="Acme S.L."
                            className={inputCls(!!errors.nombreRazonSocial)}
                        />
                    </Field>

                    <Field label="CIF / DNI" error={errors.cifDni?.message}>
                        <input
                            {...register('cifDni')}
                            placeholder="B12345678"
                            className={inputCls(!!errors.cifDni)}
                        />
                    </Field>

                    <Field label="Dirección fiscal" error={errors.direccion?.message}>
                        <input
                            {...register('direccion')}
                            placeholder="Calle Mayor 1, 08001 Barcelona"
                            className={inputCls(!!errors.direccion)}
                        />
                    </Field>

                    <Field label="Email de contacto" error={errors.email?.message}>
                        <input
                            {...register('email')}
                            type="email"
                            placeholder="hola@empresa.com"
                            className={inputCls(!!errors.email)}
                        />
                    </Field>

                    <Field label="Persona de contacto" error={errors.personaContacto?.message}>
                        <input
                            {...register('personaContacto')}
                            placeholder="Juan García"
                            className={inputCls(!!errors.personaContacto)}
                        />
                    </Field>

                    <Field label="Teléfono" error={errors.telefono?.message}>
                        <input
                            {...register('telefono')}
                            type="tel"
                            placeholder="+34 600 000 000"
                            className={inputCls(!!errors.telefono)}
                        />
                    </Field>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => router.push('/')}
                            className="px-5 py-3 border border-[var(--border)] rounded-lg text-[var(--muted)]
                                hover:text-[var(--text)] hover:border-white/25 transition-all"
                        >
                            ← Atrás
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 px-6 bg-[var(--accent)] text-white font-medium rounded-lg
                                hover:bg-[#3a6ce0] active:scale-[0.98] transition-all"
                        >
                            Continuar →
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}

function Field({
    label,
    error,
    children,
}: {
    label: string
    error?: string
    children: React.ReactNode
}) {
    return (
        <div>
            <label className="block text-sm text-[var(--text)] mb-1.5 font-mono">{label}</label>
            {children}
            {error && <p className="text-xs text-[var(--danger)] mt-1 font-mono">{error}</p>}
        </div>
    )
}
