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
        if (serviciosSeleccionados.length === 0) router.replace('/')
    }, [])

    const onSubmit = (data: FormData) => {
        setDatosEmpresa(data as DatosEmpresa)
        router.push('/resumen')
    }

    if (!mounted || serviciosSeleccionados.length === 0) return null

    return (
        <main style={{ minHeight: '100vh', position: 'relative', zIndex: 10 }}>
            <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 24px 80px' }}>

                <header style={{ marginBottom: 48 }}>
                    <div style={{ marginBottom: 20 }}>
                        <StepIndicator paso={2} />
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
                        Datos de empresa
                    </h1>
                    <p style={{ color: '#555', fontSize: 15, lineHeight: 1.6 }}>
                        Se incluirán en el contrato de servicios.
                    </p>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <Field label="Nombre / Razón social" error={errors.nombreRazonSocial?.message}>
                        <input {...register('nombreRazonSocial')} placeholder="Acme S.L." className={`input${errors.nombreRazonSocial ? ' error' : ''}`} />
                    </Field>
                    <Field label="CIF / DNI" error={errors.cifDni?.message}>
                        <input {...register('cifDni')} placeholder="B12345678" className={`input${errors.cifDni ? ' error' : ''}`} />
                    </Field>
                    <Field label="Dirección fiscal" error={errors.direccion?.message}>
                        <input {...register('direccion')} placeholder="Calle Mayor 1, 08001 Barcelona" className={`input${errors.direccion ? ' error' : ''}`} />
                    </Field>
                    <Field label="Email de contacto" error={errors.email?.message}>
                        <input {...register('email')} type="email" placeholder="hola@empresa.com" className={`input${errors.email ? ' error' : ''}`} />
                    </Field>
                    <Field label="Persona de contacto" error={errors.personaContacto?.message}>
                        <input {...register('personaContacto')} placeholder="Juan García" className={`input${errors.personaContacto ? ' error' : ''}`} />
                    </Field>
                    <Field label="Teléfono" error={errors.telefono?.message}>
                        <input {...register('telefono')} type="tel" placeholder="+34 600 000 000" className={`input${errors.telefono ? ' error' : ''}`} />
                    </Field>

                    <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                        <button type="button" onClick={() => router.push('/')} className="btn-ghost">
                            ← Atrás
                        </button>
                        <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                            Continuar →
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, color: '#666', fontFamily: 'var(--font-mono)' }}>
                {label}
            </label>
            {children}
            {error && (
                <span style={{ fontSize: 12, color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>
                    {error}
                </span>
            )}
        </div>
    )
}
